import * as React from 'react';
import { PeoplePicker, PrincipalType } from '@pnp/spfx-controls-react/lib/PeoplePicker';
import styles from '../VehicleModule.module.scss'
import * as moment from 'moment'
import swal from 'sweetalert';
import UseUtilities, { IUtilities } from '../../../services/bal/utilities';
import Utilities from '../../../services/bal/utilities';
import { Formik, FormikProps, ErrorMessage, Field } from 'formik';
import * as yup from 'yup';
import { Web } from '@pnp/sp/presets/all';
import { BaseButton, Button, Checkbox, FontWeights, IconButton, IPersonaProps } from 'office-ui-fabric-react';
import { Link, useHistory } from 'react-router-dom';
import useSPCRUD, { ISPCRUD } from '../../../services/bal/spcrud';
import SPCRUD from '../../../services/bal/spcrud';
import { IEmployeeMaster } from '../../../services/interface/IEmployeeMaster';
import { keys } from '@microsoft/sp-lodash-subset';
import { Icon, DefaultButton, Dialog, DialogFooter, DialogType, Dropdown, IDropdownOption, PrimaryButton, IDropdown, } from 'office-ui-fabric-react';
import { Pivot, PivotItem, IPivotItemProps, PivotLinkSize, PivotLinkFormat } from 'office-ui-fabric-react/lib/Pivot';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { escape } from '@microsoft/sp-lodash-subset';
import { Items, sp } from 'sp-pnp-js';
import { CurrentUser } from 'sp-pnp-js/lib/sharepoint/siteusers';
import Select from 'react-select-plus';
import 'react-select-plus/dist/react-select-plus.css';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { ENV_CONFIG } from '../../../../Enviroment/envConfig';
import PersonalAdvanceVehicleMasterOps from '../../../services/bal/PersonalAdvanceVehicleMaster';

import { IVehicleModuleProps } from '../IVehicleModuleProps';
import EmployeeOps from '../../../services/bal/PersonalAdvanceVehicleMaster';
import { IVehicleRequest } from '../../../services/interface/IVehicleRequest';
SPComponentLoader.loadCss('https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css');
SPComponentLoader.loadCss('https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
const initialValues = {
  NoteTypeId: 0,
  GroupId: '',
  FinancialYearId: "",
  Subject: "",
}
const validate = yup.object().shape({
  SanctionNote: yup.string().required('Note Type is required'),
  FinancialYear: yup.string().required('Financial Year is required'),
  Subject: yup.string().required('Subject is required'),
  SanctionType: yup.string().when("SanctionNote", {
    is: 'Sanction Note',
    then: yup.string().required('Sanction Type is required'),
    otherwise: yup.string()
  }),
});
export interface ISelectState {
  selectedOption?: string;
}
const vehicleOptions: IDropdownOption[] = [
  { key: 'Two Wheeler', text: 'Two Wheeler' },
  { key: 'Four Wheeler', text: 'Four Wheeler' }
];
const ConditionofvehicleOptions: IDropdownOption[] = [
  { key: 'New', text: 'New' },
  { key: 'Second Hand', text: 'Second Hand' }
];
const onbehalfoption: IDropdownOption[] = [
  { key: 'Yes', text: 'Yes' },
  { key: 'No', text: 'No' }
];
export default class AddVehicle extends React.Component<IVehicleModuleProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedFiles: [],

      AllEmployeeCollObj: [],
      yearOfManufacture: '',
      yearOfManufacture1: '',
      isSubmitting: false,
      AlreadyAnPendingRequest: false,
      isSave: false,
      selectedOption: '',
      filteredData: [],
      showhideEmployeeNameLab: false,
      Currentuser: "",
      allDashboardData2: [],
      filteredDashboard: [],
      EmployeeName: "",
      searchValue: "",
      filteredEmployees: [],
      EmployeeID: '',
      EmployeeIDId: '',
      DesignationId: '',
      CompanyEmail: '',
      file: null,
      reqID: '',
      isClearable: true,
      isSearchable: true,
      filteredOptions: [],
      selectedId: null,
      isDropdownOpen: false,
      vehicleOptions: [],
      vehicleRows: [
        {
          POutstandingLoanasOnDate: 0,
          PAmount: 0,
          PDatePurposeofWithdrawal: null,
          DatePurposeofWithdrawal: '',
        }
      ],

      ExpenseDetails: {
        TotalEmolumentspm: 0,
        TwentyFiveofthetotalemoluments: 0,
        Totaldeductions: 0,
        TotalLoanAmount: 0,
        FityofNetemoluments: 0,
        ExpectedlifeofVehicle: '',
        Dateoffinalrepaymentofloan: '',
        DateofAvailmentofLoan: '',


      },
      ConditionOfVehicle: '',
      ExpectlifeShow: false,
      typeOfVehicle1: '',
      typeOfVehicle: '',
    };
  }
  async componentDidMount() {
    await this.getEmployee();

    localStorage.removeItem('activeTab');

    localStorage.setItem('activeTab', 'Pending');
    await this.getCurrentUser();
    await this.getAllPersonalAdvanceVehicle();

  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.showhideEmployeeNameLab !== this.state.showhideEmployeeNameLab && !this.state.showhideEmployeeNameLab) {
      this.setState({ selectedOption: null });
      if (prevState.ExpenseDetails !== this.state.ExpenseDetails) {
        console.log("ExpenseDetails updated:", this.state.ExpenseDetails);
      }

    }
  }
  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.ExpenseDetails !== this.state.ExpenseDetails) {
  //     console.log("ExpenseDetails updated:", this.state.ExpenseDetails);
  //   }
  // }
  public getCurrentUser = async () => {
    const spCrudObj = await useSPCRUD();
    return await spCrudObj.currentUser(this.props).then(cuser => {
      this.setState({ Currentuser: cuser });
      return cuser;
    });
  }
  public getEmployee = async (): Promise<IEmployeeMaster> => {
    return await EmployeeOps().getEmployeeMaster(this.props).then(async (results) => {
      let employeeData = results;
      this.setState({
        EmployeeInfodb: employeeData,
        AllEmployeeCollObj: [],
        EmployeeName: employeeData.EmployeeName,
        DateOfJoining: employeeData.DateOfJoining ? new Date(employeeData.DateOfJoining) : null,
        CurrentOfficeLocation: employeeData.CurrentOfficeLocation,
        DateOfConfirmation: employeeData.DateOfConfirmation
          ? `${new Date(employeeData.DateOfConfirmation).getDate()}-${new Date(employeeData.DateOfConfirmation).getMonth() + 1}-${new Date(employeeData.DateOfConfirmation).getFullYear()}`
          : null,
        EmployeeIDId: employeeData.Id,
        DependentType: "",
        ActualClaimAmountLable: "",
        CompanyEmail: employeeData.CompanyEmail,
        EmployeeID: employeeData.EmployeeId,
        DesignationId: employeeData.DesignationId,
        DesignationTitle: employeeData.DesignationTitle,
        DateofBirth: employeeData.DateofBirth,
        Scale: employeeData.Scale,
        Age: parseInt(employeeData.Age),
        EmpType: employeeData.EmpType,
      });
      return employeeData;
    });
  };

  public getAllPersonalAdvanceVehicle = async (): Promise<IVehicleRequest | any> => {
    return await PersonalAdvanceVehicleMasterOps().getAllPersonalAdvanceVehicle(this.props).then(async (results) => {
      let employeeData = results;
      var currentEmpResult = employeeData.filter((item) => {
        return ((item.EmployeeCode == this.state.EmployeeID) && (item.Status == 'Pending'));
      })
      if (currentEmpResult && currentEmpResult.length > 0) {
        this.setState({ AlreadyAnPendingRequest: true });
      }
    });
  };
  handleDropdownChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, field?: string) => {
    if (option && field) {
      this.setState({ [field]: option.key });
    }
  }

  handleInputChangeadd = (e) => {
    const { name, value } = e.target;
    const field = name.split('.')[1];

    const updatedExpenseDetails = {
      ...this.state.ExpenseDetails,
      [field]: value
    };

    // Numeric fields
    const totalEmoluments = field === "TotalEmolumentspm"
      ? parseFloat(value)
      : parseFloat(this.state.ExpenseDetails.TotalEmolumentspm) || 0;

    let totalDeductions = field === "Totaldeductions" 
      ? parseFloat(value)
      : parseFloat(this.state.ExpenseDetails.Totaldeductions) || 0;

      let totaLoanAmount = field === "TotalLoanAmount" 
      ? parseFloat(value)
      : parseFloat(this.state.ExpenseDetails.TotalLoanAmount) || 0;
      
      let costofVehicle = field === "CostofVehicle" 
      ? parseFloat(value)
      : parseFloat(this.state.ExpenseDetails.CostofVehicle) || 0;

      let repaymenttenureinEMI = field === "RepaymenttenureinEMI" 
      ? parseFloat(value)
      : parseFloat(this.state.ExpenseDetails.RepaymenttenureinEMI) || 0;

      // ExpenseDetails.RepaymenttenureinEMI
      if (field === "RepaymenttenureinEMI" && repaymenttenureinEMI > 120) {
        repaymenttenureinEMI = 120;
        updatedExpenseDetails.RepaymenttenureinEMI = repaymenttenureinEMI.toString();
      }
 // Cap deductions
 if (field === "CostofVehicle" && costofVehicle > 1000000) {
  costofVehicle = 1000000;
  updatedExpenseDetails.CostofVehicle = costofVehicle.toString();
}

    // Cap deductions
    if (field === "Totaldeductions" && totalDeductions > totalEmoluments) {
      totalDeductions = totalEmoluments;
      updatedExpenseDetails.Totaldeductions = totalEmoluments.toString();
    }

    // Calculate emolument percentages
    if (field === "TotalEmolumentspm") {
      updatedExpenseDetails.TwentyFiveofthetotalemoluments = (totalEmoluments * 0.25).toFixed(2);
    }

    updatedExpenseDetails.FityofNetemoluments = ((totalEmoluments - totalDeductions) * 0.5).toFixed(2);

    // Date validation: Final repayment date must be >= availment date
    const availmentDateStr = field === "DateofAvailmentofLoan" ? value : this.state.ExpenseDetails.DateofAvailmentofLoan;
    const finalRepaymentDateStr = field === "Dateoffinalrepaymentofloan" ? value : this.state.ExpenseDetails.Dateoffinalrepaymentofloan;

    if (availmentDateStr && finalRepaymentDateStr) {
      const availmentDate = new Date(availmentDateStr);
      const finalRepaymentDate = new Date(finalRepaymentDateStr);

      if (finalRepaymentDate < availmentDate) {
        // Auto-correct to match availment date
        updatedExpenseDetails.Dateoffinalrepaymentofloan = availmentDateStr;
      }
    }

    this.setState({ ExpenseDetails: updatedExpenseDetails });
  };

  private onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = [];
    if (e.target.files) {
      for (let i = 0; i < e.target.files.length; i++) {
        files.push(e.target.files.item(i)!);
      }
    }
    this.setState({ selectedFiles: files });
  };
  public BtnSubmitRequest = async (SubmittionType) => {

    if (this.state.AlreadyAnPendingRequest == true) {
      swal("Notice", "Your Vehicle Request already in Pending.", "info");
      //alert('hii');
      return false

    }

    var count = 0;
    if (this.state.vehicleRows && this.state.vehicleRows.length > 0) {
      for (var v = 0; v < this.state.vehicleRows.length; v++) {
        if ((+this.state.vehicleRows[v].POutstandingLoanasOnDate) > (+this.state.vehicleRows[v].PAmount)) {

          count++
          // PAmount<=POutstandingLoanasOnDate

        }
      }
      if (count > 0) {
        swal("Notice", "Outstanding Loan as on date should be less that Amount", "info");
        //alert('hii');
        return false

      }
    }


  
    const { ExpenseDetails, typeOfVehicle, ConditionOfVehicle, yearOfManufacture1, ExpectlifeShow } = this.state;
    const showAlert = (message) => {
      swal("Validation Error", message, "warning");
      return false;
    };
    const isEmpty = (val) => val == '' || val == null || val == undefined || val == 0;
    if (isEmpty(ExpenseDetails.TotalEmolumentspm)) return showAlert('Please Fill Total Emoluments p.m. (Salary and allowance)');
    if (isEmpty(ExpenseDetails.TotalLoanAmount)) return showAlert('Please Fill Total Loan Amount');
 
    if ((ExpenseDetails.TotalLoanAmount>ExpenseDetails.CostofVehicle)) return showAlert('Please Fill Total Loan Amount Less than Cost of Vehicle');

    
    if (isEmpty(ExpenseDetails.Totaldeductions)) return showAlert('Please Fill Total deductions p.m. viz. Festival Advance, Personal Advance');
    if (isEmpty(ExpenseDetails.RepaymenttenureinEMI)) return showAlert('Please Fill Repayment tenure in EMI');
    if (ExpenseDetails.RepaymenttenureinEMI > 120) return showAlert('Repayment tenure in EMI should be less than 120');
    if (isEmpty(typeOfVehicle)) return showAlert('Please Select Type of Vehicle');
    if (isEmpty(ConditionOfVehicle)) return showAlert('Please Select Whether new or second hand');
    if (isEmpty(ExpenseDetails.MakeModel)) return showAlert('Please Fill Make/ Model');
    if (isEmpty(yearOfManufacture1)) return showAlert('Please Select Year of Manufacture');
    if (isEmpty(ExpenseDetails.CostofVehicle)) return showAlert('Please Fill Cost of Vehicle');
    if (isEmpty(ExpenseDetails.NameandAddressoftheSeller)) return showAlert('Please Fill Name and Address of the Seller / Dealer');
    if (ExpectlifeShow && isEmpty(ExpenseDetails.ExpectedlifeofVehicle)) return showAlert('Please Fill Expected life of Vehicle');
    let VehicleRequestItem = null;


    if (SubmittionType == 'Submitted') {
var rate=5.5;
var VehicleLoanEMI= ((this.state.ExpenseDetails.TotalLoanAmount*(1+(rate*this.state.ExpenseDetails.RepaymenttenureinEMI*(1/1200))))/(this.state.ExpenseDetails.RepaymenttenureinEMI)).toFixed(2);
     
      VehicleRequestItem = {
        EmployeeCode: this.state.EmployeeID,
        EmployeeName: this.state.EmployeeName,
        Age: '' + this.state.Age,
        Status: "Pending",
        VehicleLoanEMI:+VehicleLoanEMI || 0,

        HR1Response: 'Pending with HR1',
        HR2Response: 'Pending with HR2',
        GHResponse: 'Pending with Group Head',
        CurrentStatus:'Pending with Group Head',
        DateOfJoining: this.state.DateOfJoining ? new Date(this.state.DateOfJoining) : null,
        DateOfConfirmation: this.state.DateOfConfirmation
          ? `${new Date(this.state.DateOfConfirmation).getDate()}-${new Date(this.state.DateOfConfirmation).getMonth() + 1}-${new Date(this.state.DateOfConfirmation).getFullYear()}`
          : null,
        ResidenceAddress: this.state.CurrentOfficeLocation,
        Designation: this.state.DesignationTitle,
        TotalEmoluments: +ExpenseDetails.TotalEmolumentspm,
        Emoluments25: +ExpenseDetails.TwentyFiveofthetotalemoluments,
        TotalDeductions: +ExpenseDetails.Totaldeductions,
        NetEmoluments50: +ExpenseDetails.FityofNetemoluments,
        EmiTenure: +ExpenseDetails.RepaymenttenureinEMI || 0,
        CostOfVehicle: +ExpenseDetails.CostofVehicle || 0,
        TotalLoanAmount: +ExpenseDetails.TotalLoanAmount || 0,
        VehicleType: typeOfVehicle,
        ManufactureYear: yearOfManufacture1 || "",
        VehicleCondition: ConditionOfVehicle,
        MakeModel: ExpenseDetails.MakeModel || "",
        SellerDetails: ExpenseDetails.NameandAddressoftheSeller || "",
        ExpectedLife: '' + ExpenseDetails.ExpectedlifeofVehicle,
        PrevVehicleLoanType: this.state.typeOfVehicle1,
        PrevLoanRepaymentDate: ExpenseDetails.Dateoffinalrepaymentofloan ? new Date(ExpenseDetails.Dateoffinalrepaymentofloan) : null,
        PrevLoanAmount: +ExpenseDetails.AmountofLoanavailed || 0,
        PrevLoanDate: ExpenseDetails.DateofAvailmentofLoan ? new Date(ExpenseDetails.DateofAvailmentofLoan) : null
      };
    }
    this.setState({ isSubmitting: true });
    const spCrudObj = await useSPCRUD();
    try {
      const req = await spCrudObj.insertData("PersonalAdvanceVehicle", VehicleRequestItem, this.props);
      this.setState({ reqID: req.data.ID });
      const RequestNoGenerate = {
        Title: 'VM000' + req.data.ID
      };
      await spCrudObj.updateData("PersonalAdvanceVehicle", req.data.ID, RequestNoGenerate, this.props);


  // `    // 3. Upload and tag files with RequestNo metadata
  //     if (this.state.selectedFiles.length > 0) {
  //       const libraryFolder = 'VehicleCostAttachments';
  //       const folder = sp.web.getFolderByServerRelativeUrl(libraryFolder);
  //       for (const file of this.state.selectedFiles) {
  //         const uploadResult = await folder.files.add(file.name, file, true);
  //         // Set RequestNo column on the uploaded file
  //         await uploadResult.file.getItem().then(item =>
  //           item.update({
  //             PersonalAdvanceVehicleIdId: req.data.ID,
  //           })
  //         );
  //       }
  //     }`

  // if (this.state.selectedFiles.length > 0) {

  //   const libraryFolder = 'VehicleCostAttachments';
  //   const folder = sp.web.getFolderByServerRelativeUrl(libraryFolder);
  //   const files = this.state.selectedFiles;
  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     const vPersonalAdvanceVehicleIdId=req.data.ID;

  //     try {
  //       const uploadResult = await folder.files.add(file.name, file, true);
  //       const item = await uploadResult.file.getItem();
  
  //       await item.update({
  //         PersonalAdvanceVehicleIdId: vPersonalAdvanceVehicleIdId,
  //       });
  
  //       console.log(`File ${file.name} uploaded and metadata updated.`);
  //     } catch (error) {
  //       console.error(`Error handling file ${file.name}:`, error);
  //     }
  //   }
  // }

  if (this.state.selectedFiles.length > 0) {
    const libraryFolder = 'VehicleCostAttachments';
    const files = this.state.selectedFiles;
    const vPersonalAdvanceVehicleIdId = req.data.ID;
    const web = Web(this.props.currentSPContext.pageContext.web.absoluteUrl); // Make sure this.props is accessible
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uniqueFileName = `${(new Date().getTime() * 10000 + 621355968000000000)}_${file.name}`;
  
      try {
        // Upload file in chunks
        const uploadResult = await web.getFolderByServerRelativeUrl(libraryFolder).files.addChunked(uniqueFileName, file, data => {
          // Logger.log({ data: data, level: LogLevel.Verbose, message: `Uploading ${file.name}...` });
        }, true);
  
        // Set metadata
        const item = await uploadResult.file.getItem();
        await item.update({
          PersonalAdvanceVehicleIdId: vPersonalAdvanceVehicleIdId
        });
  
        console.log(`✔ File ${file.name} uploaded and metadata updated.`);
      } catch (error) {
        console.error(`❌ Error handling file ${file.name}:`, error);
      }
    }
  }
  
  
      if (this.state.vehicleRows && this.state.vehicleRows.length > 0) {
        await this.InsertPrevPersonalAdvanceHistory("PrevPersonalAdvanceHistory", req.data.ID, this.state.vehicleRows);
        swal("Success", "Vehicle Request Submitted Successfully!", "success").then(() => {
          window.location.href = '#/InitiatorDashboard';
        });
      } else {
        swal("Notice", "Vehicle Request Submitted Failed.", "info");
      }
    } catch (error) {
      console.error("Submission error:", error);
      swal("Notice", "Vehicle Request Submitted Failed.", "info");
    } finally {
      this.setState({ isSubmitting: false });
    }
  };
  public BtnSaveAsDraft = async (SubmittionType) => {

  //   if (this.state.ExpenseDetails.TotalLoanAmount>this.state.ExpenseDetails.CostofVehicle){
  //   return swal("Please Fill Total Loan Amount Less than Cost of Vehicle.", "info");
  // }

  var rate=5.5;
  var VehicleLoanEMI= ((this.state.ExpenseDetails.TotalLoanAmount*(1+(rate*this.state.ExpenseDetails.RepaymenttenureinEMI*(1/1200))))/(this.state.ExpenseDetails.RepaymenttenureinEMI)).toFixed(2);
  

    var VehicleRequestItem
    if (SubmittionType == 'Draft') {
      VehicleRequestItem = {
        EmployeeCode: this.state.EmployeeID,
        EmployeeName: this.state.EmployeeName,
        Age: '' + this.state.Age,
        Status: "Draft",
        VehicleLoanEMI:+VehicleLoanEMI || 0,
        CurrentStatus:'Draft',

        DateOfJoining: this.state.DateOfJoining ? new Date(this.state.DateOfJoining) : null,
        ResidenceAddress: this.state.CurrentOfficeLocation,
        Designation: this.state.DesignationTitle,
        TotalEmoluments: +this.state.ExpenseDetails.TotalEmolumentspm,
        Emoluments25: +this.state.ExpenseDetails.TwentyFiveofthetotalemoluments,
        TotalDeductions: +this.state.ExpenseDetails.Totaldeductions,
        TotalLoanAmount: +this.state.ExpenseDetails.TotalLoanAmount || 0,

        NetEmoluments50: +this.state.ExpenseDetails.FityofNetemoluments,
        EmiTenure: this.state.ExpenseDetails.RepaymenttenureinEMI ? +this.state.ExpenseDetails.RepaymenttenureinEMI : 0,
        CostOfVehicle: this.state.ExpenseDetails.CostofVehicle ? +this.state.ExpenseDetails.CostofVehicle : 0,
        VehicleType: this.state.typeOfVehicle,
        DateOfConfirmation: this.state.DateOfConfirmation
          ? `${new Date(this.state.DateOfConfirmation).getDate()}-${new Date(this.state.DateOfConfirmation).getMonth() + 1}-${new Date(this.state.DateOfConfirmation).getFullYear()}`
          : null,
        ManufactureYear: this.state.yearOfManufacture1 || "",
        VehicleCondition: this.state.ConditionOfVehicle,
        MakeModel: this.state.ExpenseDetails.MakeModel || "",
        SellerDetails: this.state.ExpenseDetails.NameandAddressoftheSeller || "",
        ExpectedLife: '' + this.state.ExpenseDetails.ExpectedlifeofVehicle,
        PrevVehicleLoanType: this.state.typeOfVehicle1,
        PrevLoanRepaymentDate: this.state.ExpenseDetails.Dateoffinalrepaymentofloan ? new Date(this.state.ExpenseDetails.Dateoffinalrepaymentofloan) : null,
        PrevLoanAmount: this.state.ExpenseDetails.AmountofLoanavailed ? +this.state.ExpenseDetails.AmountofLoanavailed : 0,
        PrevLoanDate: this.state.ExpenseDetails.DateofAvailmentofLoan ? new Date(this.state.ExpenseDetails.DateofAvailmentofLoan) : null
      };
    }
    this.setState({ isSave: true });
    const spCrudObj = await useSPCRUD();
    try {
      const req = await spCrudObj.insertData("PersonalAdvanceVehicle", VehicleRequestItem, this.props);
      this.setState({ reqID: req.data.ID });
      const RequestNoGenerate = {
        Title: 'VM000' + req.data.ID
      };
      await spCrudObj.updateData("PersonalAdvanceVehicle", req.data.ID, RequestNoGenerate, this.props);


      // 3. Upload and tag files with RequestNo metadata
      // if (this.state.selectedFiles.length > 0) {
      //   const libraryFolder = 'VehicleCostAttachments';
      //   const folder = sp.web.getFolderByServerRelativeUrl(libraryFolder);
      //   for (const file of this.state.selectedFiles) {
      //     const uploadResult = await folder.files.add(file.name, file, true);
      //     // Set RequestNo column on the uploaded file
      //     await uploadResult.file.getItem().then(item =>
      //       item.update({
      //         PersonalAdvanceVehicleIdId: req.data.ID,
      //       })
      //     );
      //   }
      // }
      // if (this.state.selectedFiles.length > 0) {
      //   const libraryFolder = 'VehicleCostAttachments';
      //   const folder = sp.web.getFolderByServerRelativeUrl(libraryFolder);
      //   const files = this.state.selectedFiles;
      //   for (let i = 0; i < files.length; i++) {
      //     const file = files[i];
      //     const vPersonalAdvanceVehicleIdId=req.data.ID;
    
      //     try {
      //       const uploadResult = await folder.files.add(file.name, file, true);
      //       const item = await uploadResult.file.getItem();
      
      //       await item.update({
      //         PersonalAdvanceVehicleIdId: vPersonalAdvanceVehicleIdId,
      //       });
      
      //       console.log(`File ${file.name} uploaded and metadata updated.`);
      //     } catch (error) {
      //       console.error(`Error handling file ${file.name}:`, error);
      //     }
      //   }
      // }

      
  if (this.state.selectedFiles.length > 0) {
    const libraryFolder = 'VehicleCostAttachments';
    const files = this.state.selectedFiles;
    const vPersonalAdvanceVehicleIdId = req.data.ID;
    const web = Web(this.props.currentSPContext.pageContext.web.absoluteUrl); // Make sure this.props is accessible
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uniqueFileName = `${(new Date().getTime() * 10000 + 621355968000000000)}_${file.name}`;
  
      try {
        // Upload file in chunks
        const uploadResult = await web.getFolderByServerRelativeUrl(libraryFolder).files.addChunked(uniqueFileName, file, data => {
          // Logger.log({ data: data, level: LogLevel.Verbose, message: `Uploading ${file.name}...` });
        }, true);
  
        // Set metadata
        const item = await uploadResult.file.getItem();
        await item.update({
          PersonalAdvanceVehicleIdId: vPersonalAdvanceVehicleIdId
        });
  
        console.log(`✔ File ${file.name} uploaded and metadata updated.`);
      } catch (error) {
        console.error(`❌ Error handling file ${file.name}:`, error);
      }
    }
  }
      if (this.state.vehicleRows && this.state.vehicleRows.length > 0) {
        await this.InsertPrevPersonalAdvanceHistory("PrevPersonalAdvanceHistory", req.data.ID, this.state.vehicleRows);
        swal("Success", "Vehicle Request Updated Successfully!", "success").then(() => {
          window.location.href = '#/InitiatorDashboard';
        });
      } else {
        swal("Notice", "Vehicle Request Saved Failed.", "info");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error submitting the vehicle request.");
    } finally {
      this.setState({ isSave: false });
    }
  };
  async InsertPrevPersonalAdvanceHistory(ListName, RequestNoGenerate, itemArray) {
    const spCrudObj = await useSPCRUD();
    for (let i = 0; i < itemArray.length; i++) {
      const objVehicleHistoryitems = {
        PersonalAdvanceVehicleIdId: RequestNoGenerate,
        WithdrawalDetails: itemArray[i].DatePurposeofWithdrawal || '',
        WithdrawalAmount: itemArray[i].PAmount ? +itemArray[i].PAmount : 0,
        OutstandingLoan: itemArray[i].POutstandingLoanasOnDate ? +itemArray[i].POutstandingLoanasOnDate : 0,
        FinalRepaymentDate: itemArray[i].PDatePurposeofWithdrawal ? new Date(itemArray[i].PDatePurposeofWithdrawal) : null
      };
      try {
        await spCrudObj.insertData(ListName, objVehicleHistoryitems, this.props);
      } catch (error) {
        console.error(`Error uploading item ${i + 1}:`, error);
      }
    }
  }
  private getYearOptions(): IDropdownOption[] {
    const currentYear = new Date().getFullYear();
    const startYear = 1980;
    const options: IDropdownOption[] = [];
    for (let year = currentYear; year >= startYear; year--) {
      options.push({ key: year.toString(), text: year.toString() });
    }
    return options;
  }
  private handleYearChange = (
    option: IDropdownOption,
    index?: number
  ): void => {
    console.log("Changed to:", option.text);
    this.setState({ yearOfManufacture: option.key.toString() });
  };
  private handleYearChange1 = (
    option: IDropdownOption,
    index?: number
  ): void => {
    console.log("Changed to:", option.text);
    this.setState({ yearOfManufacture1: option.key.toString() });
  };
  private handleConditionOfVehicleChange = (
    option: IDropdownOption,
    index?: number
  ): void => {
    const isSecondHand = option.key.toString() == 'Second Hand';
    this.setState(prevState => ({
      ConditionOfVehicle: option.key.toString(),
      ExpectlifeShow: isSecondHand,
      ExpenseDetails: {
        ...prevState.ExpenseDetails,
        CostofVehicle: isSecondHand ? prevState.ExpenseDetails.CostofVehicle || '' : '',
        ExpectedlifeofVehicle: isSecondHand ? prevState.ExpenseDetails.ExpectedlifeofVehicle || '' : ''
      }
    }));
  };
  private handleTypeOfVehicleChange = (
    option: IDropdownOption,
    index?: number
  ): void => {
    this.setState(prevState => ({
      typeOfVehicle: option.key.toString(),
    }));
  };
  private handleTypeOfVehicleChange1 = (
    option: IDropdownOption,
    index?: number
  ): void => {
    this.setState(prevState => ({
      typeOfVehicle1: option.key.toString(),
    }));
  };
  private addRow = () => {

    this.setState(prevState => ({
      vehicleRows: [
        ...prevState.vehicleRows,
        {
          POutstandingLoanasOnDate: 0,
          PAmount: 0,
          PDatePurposeofWithdrawal: null,
          DatePurposeofWithdrawal: '',
        }
      ]
    }));
  };




  private handleRowChange = (index: number, field: string, value: string) => {
    const updatedRows = [...this.state.vehicleRows];
    updatedRows[index][field] = value;
    this.setState({ vehicleRows: updatedRows });
  };
  private removeRow = (index: number) => {
    this.setState(prevState => ({
      vehicleRows: prevState.vehicleRows.filter((_, i) => i !== index)
    }));
  };

  handleExpenseDetailsChange = (field, value) => {
    const updatedExpenseDetails = {
      ...this.state.ExpenseDetails,
      [field]: value
    };

    // Optional: date validation
    if (field === "Dateoffinalrepaymentofloan") {
      const availmentDate = new Date(updatedExpenseDetails.DateofAvailmentofLoan);
      const repaymentDate = new Date(value);
      if (repaymentDate < availmentDate) {
        updatedExpenseDetails.Dateoffinalrepaymentofloan = updatedExpenseDetails.DateofAvailmentofLoan;
      }
    }

    // Optional: recalculate values
    const totalEmoluments = parseFloat(updatedExpenseDetails.TotalEmolumentspm) || 0;
    const totalDeductions = parseFloat(updatedExpenseDetails.Totaldeductions) || 0;

    updatedExpenseDetails.TwentyFiveofthetotalemoluments = (totalEmoluments * 0.25).toFixed(2);
    updatedExpenseDetails.FityofNetemoluments = ((totalEmoluments - totalDeductions) * 0.5).toFixed(2);

    if (totalDeductions > totalEmoluments) {
      updatedExpenseDetails.Totaldeductions = totalEmoluments.toString();
    }

    this.setState({ ExpenseDetails: updatedExpenseDetails });
  };




  public render(): React.ReactElement<IVehicleModuleProps> {
    return (
      <div className="mainsection" >
        <h1>Add Form</h1>
        <h4> <b> A). Service Particulars</b></h4>
        <div className='card'>
          <div className="row form-group">
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Employee ID</Label>
            </div>
            <div className="col-sm-2">
              <Label className="control-Label">{this.state.EmployeeID}</Label>
            </div>
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Employee Name</Label>
            </div>
            <div className="col-sm-2">
              <Label className="control-Label ">{this.state.EmployeeName}</Label>
            </div>
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Age</Label>
            </div>
            <div className="col-sm-2">
              <Label className="control-Label ">{this.state.Age}</Label>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Date of joining</Label>
            </div>
            <div className="col-sm-2">
              {moment(this.state.DateOfJoining).format("DD/MM/YYYY")} </div>
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Residence Address  </Label>
            </div>
            <div className="col-sm-2">
              <Label className="control-Label ">{this.state.CurrentOfficeLocation}</Label>
            </div>
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Designation</Label>
            </div>
            <div className="col-sm-2">
              <Label className="control-Label ">{this.state.DesignationTitle}</Label>
            </div>
          </div>
        </div>
        <h4><b> B). Salary Particulars</b></h4>
        <div className='card'>
          <div className="row form-group">
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Total Emoluments p.m. (Salary and allowance)<span style={{ color: 'red' }}>*</span> </Label>
            </div>
            <div className="col-sm-2">
              <TextField type='number'
                name="ExpenseDetails.TotalEmolumentspm"
                onChanged={(e: any) => this.handleInputChangeadd(event)} />
            </div>
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">25% of the total emoluments   <span style={{ color: 'red' }}>*</span></Label>
            </div>
            <div className="col-sm-2">
              <TextField type='number' disabled
                value={this.state.ExpenseDetails.TwentyFiveofthetotalemoluments}
                name="ExpenseDetails.TwentyFiveofthetotalemoluments"
                onChanged={(e: any) => this.handleInputChangeadd(event)} />
            </div>
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Total deductions p.m. viz. Festival Advance, Personal Advance <span style={{ color: 'red' }}>*</span></Label>
            </div>
            <div className="col-sm-2">
              <TextField type='number'
                value={this.state.ExpenseDetails.Totaldeductions}
                name="ExpenseDetails.Totaldeductions"
                onChanged={(e: any) => this.handleInputChangeadd(event)} />
            </div>
          </div>
          <div className="row form-group">
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">50% of Net emoluments p.m. </Label>
            </div>
            <div className="col-sm-2">
              <TextField type='number' disabled
                value={this.state.ExpenseDetails.FityofNetemoluments}
                name="ExpenseDetails.FityofNetemoluments"
                onChanged={(e: any) => this.handleInputChangeadd(event)} />  </div>
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Repayment tenure in EMI (Maximum 120)  <span style={{ color: 'red' }}>*</span> </Label>
            </div>
            <div className="col-sm-2">
              <TextField type='number'
                value={this.state.ExpenseDetails.RepaymenttenureinEMI}
                placeholder={"Enter Month"}
                name="ExpenseDetails.RepaymenttenureinEMI"
                onChanged={(e: any) => this.handleInputChangeadd(event)} />
            </div>
          </div>
        </div>
        <h4><b>C). Particulars of Vehicle </b></h4>
        <div className='card'>
          <div className="row form-group">
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Type of Vehicle <span style={{ color: 'red' }}>*</span></Label>
            </div>
            <div className="col-sm-2">
              <Dropdown placeHolder="Select vehicle type" options={vehicleOptions}
                selectedKey={this.state.typeOfVehicle}
                onChanged={this.handleTypeOfVehicleChange}
              />
            </div>
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Whether new or second hand <span style={{ color: 'red' }}>*</span> </Label>
            </div>
            <div className="col-sm-2">
              <Dropdown
                placeHolder="Select Condition of vehicle"
                options={ConditionofvehicleOptions}
                selectedKey={this.state.ConditionOfVehicle}
                onChanged={this.handleConditionOfVehicleChange}
              />
            </div>
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Make/ Model  <span style={{ color: 'red' }}>*</span> </Label>
            </div>
            <div className="col-sm-2">
              <TextField
                name="ExpenseDetails.MakeModel"
                onChanged={(e: any) => this.handleInputChangeadd(event)} />
            </div>
          </div>
          <div className="row form-group">
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Year of Manufacture  <span style={{ color: 'red' }}>*</span> </Label>
            </div>
            <div className="col-sm-2">
              <Dropdown
                placeHolder="Select a year"
                selectedKey={this.state.yearOfManufacture1}
                onChanged={this.handleYearChange1}
                options={this.getYearOptions()}
              />
            </div>
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Cost of Vehicle <span style={{ color: 'red' }}>*</span>  </Label>
              <span style={{ color: 'red' }} hidden={!(this.state.ConditionOfVehicle == 'New')} > (as per enclosed invoice) </span>
              <span style={{ color: 'red' }} hidden={!(this.state.ConditionOfVehicle == 'Second Hand')}>  (as per enclosed valuation report from a Govt. approved value.) </span>
            </div>
            <div className="col-sm-2">
              { }
              {/* <TextField
                type="number"
                name="ExpenseDetails.CostofVehicle"
                max={'1000000'}
                value={this.state.ExpenseDetails.CostofVehicle || ''}
                onChanged={(value: string) => {
                  this.setState(prevState => ({
                    ExpenseDetails: {
                      ...prevState.ExpenseDetails,
                      CostofVehicle: value
                    }
                  }));
                }}
              /> */}
              <input
  type="number"
  name="ExpenseDetails.CostofVehicle"
  value={this.state.ExpenseDetails.CostofVehicle || ''}
  onChange={(e) => {
    const inputValue = e.target.value;
    const numericValue = Number(inputValue);

    this.setState((prevState) => ({
      ExpenseDetails: {
        ...prevState.ExpenseDetails,
        CostofVehicle: numericValue > 1000000 ? 1000000 : numericValue
      }
    }));
  }}
/>

            </div>
             <div className="col-sm-2">
                          <Label className="control-Label font-weight-bold">
                            Cost of Vehicle Attachments <span style={{ color: 'red' }}>*</span>
                          </Label>
                        </div>

            <div className="col-sm-2">
              <input className="form-control" type="file" multiple onChange={this.onFilesChange} />
            </div>
          </div>
          <div className="row form-group"> 
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Name and Address of the Seller / Dealer <span style={{ color: 'red' }}>*</span>  </Label>
            </div>
            <div className="col-sm-2">
              <TextField
                multiline
                name="ExpenseDetails.NameandAddressoftheSeller"
                value={this.state.ExpenseDetails.NameandAddressoftheSeller || ''}
                onChanged={(value: string) => {
                  this.setState(prevState => ({
                    ExpenseDetails: {
                      ...prevState.ExpenseDetails,
                      NameandAddressoftheSeller: value
                    }
                  }));
                }}
              />
            </div>

            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Total Loan Amount  </Label>
            </div>
            <div className="col-sm-2">
              <TextField type='number'
                value={this.state.ExpenseDetails.TotalLoanAmount || ''}

                name="ExpenseDetails.TotalLoanAmount"
                onChanged={(e: any) => this.handleInputChangeadd(event)}></TextField>

            </div>

            <div className="col-sm-2" hidden={!this.state.ExpectlifeShow}>
              <Label className="control-Label font-weight-bold">Expected life of Vehicle (in case of second hand vehicle)<span style={{ color: 'red' }}>*</span>   </Label>
            </div>
            <div className="col-sm-2" hidden={!this.state.ExpectlifeShow}>
              <TextField
                type='text'
                name="ExpenseDetails.ExpectedlifeofVehicle"
                value={this.state.ExpenseDetails.ExpectedlifeofVehicle}
                onChanged={(value: string) => {
                  this.setState(prevState => ({
                    ExpenseDetails: {
                      ...prevState.ExpenseDetails,
                      ExpectedlifeofVehicle: value
                    }
                  }));
                }}
              />
            </div>
            { }
          </div>
        </div>
        <h4><b>D). Details of Earlier Vehicle Loan availed from Exim Bank (if any) </b> </h4>
        <div className='card'>
          <div className="row form-group">
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Type of Vehicle taken (two/four wheeler)</Label>
            </div>
            <div className="col-sm-2">
              <Dropdown placeHolder="Select vehicle type" options={vehicleOptions}
                selectedKey={this.state.typeOfVehicle1}
                onChanged={this.handleTypeOfVehicleChange1}
              />
            </div>
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Amount of Loan availed  </Label>
            </div>
            <div className="col-sm-2">
              <TextField type='number'
                name="ExpenseDetails.AmountofLoanavailed"
                onChanged={(e: any) => this.handleInputChangeadd(event)}></TextField>

            </div>
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Date of Availment of Loan   </Label>
            </div>
            <div className="col-sm-2">
              <TextField type='date'
                name="ExpenseDetails.DateofAvailmentofLoan"
                onChanged={(e: any) => this.handleInputChangeadd(event)}></TextField>                   </div>
          </div>
          <div className="row form-group">
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Date of final repayment of loan  </Label>
            </div>
            <div className="col-sm-2">
              {/* <TextField
                type="date"
                name="ExpenseDetails.Dateoffinalrepaymentofloan"
                min={this.state.ExpenseDetails.DateofAvailmentofLoan}
                onChange={(e) => this.handleInputChangeadd(e)}
              /> */}
              <input
                type="date"
                name="ExpenseDetails.Dateoffinalrepaymentofloan"
                value={this.state.ExpenseDetails.Dateoffinalrepaymentofloan || ''}
                min={this.state.ExpenseDetails.DateofAvailmentofLoan || ''}
                onChange={this.handleInputChangeadd}
              />
            </div>
          </div>
        </div>
        <h4><b>E). Previous Personal Advance History </b> </h4>
        {this.state.vehicleRows.map((row, index) => (
          <div className='card mb-1' key={index}>
            <div className="row form-group">
              <div className="col-sm-1">
                <Label className="control-Label font-weight-bold">Sr No {index + 1}</Label>
                {/* <label className="control-Label font-weight-bold">{index + 1}</label> */}
              </div>
              <div className="col-sm-3">
                <Label className="control-Label font-weight-bold">Date/Purpose of Withdrawal </Label>
                <TextField
                  multiline
                  value={row.DatePurposeofWithdrawal}
                  onChanged={(val) => this.handleRowChange(index, 'DatePurposeofWithdrawal', val)}
                />
              </div>
              <div className="col-sm-3">
                <Label className="control-Label font-weight-bold">Amount</Label>
                <TextField
                  type="number"
                  value={row.PAmount}
                  onChanged={(val) => this.handleRowChange(index, 'PAmount', val)}
                />
              </div>
              <div className="col-sm-3">
                <Label className="control-Label font-weight-bold">Outstanding Loan amount as on date
                </Label>
                <TextField
                  type='number'
                  value={row.POutstandingLoanasOnDate}
                  onChanged={(val) => this.handleRowChange(index, 'POutstandingLoanasOnDate', val)}
                />
              </div>
            </div>
            <div className="row form-group">
              <div className="col-sm-1">
              </div>
              <div className="col-sm-3">
                <Label className="control-Label font-weight-bold">Date of Final Repayment </Label>
                <TextField
                  type='date'
                  value={row.PDatePurposeofWithdrawal}
                  onChanged={(val) => this.handleRowChange(index, 'PDatePurposeofWithdrawal', val)}
                />
              </div>
              { }
              <div className="col-sm-4 d-flex align-items-center mt-4">
                <IconButton
                  iconProps={{ iconName: 'Add' }}
                  title="Add Row"
                  onClick={this.addRow}
                />
                {this.state.vehicleRows.length > 1 && (
                  <IconButton
                    iconProps={{ iconName: 'Delete' }}
                    title="Remove Row"
                    onClick={() => this.removeRow(index)}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
        <div className='text-center'>
          <PrimaryButton
            onClick={() => this.BtnSubmitRequest('Submitted')}
            disabled={this.state.isSubmitting}
          >
            {this.state.isSubmitting ? <Spinner size={SpinnerSize.small} /> : "Submit"}
          </PrimaryButton>
          <PrimaryButton
            onClick={() => this.BtnSaveAsDraft('Draft')}
            disabled={this.state.isSave}
          >
            {this.state.isSave ? <Spinner size={SpinnerSize.small} /> : "Save As Draft"}
          </PrimaryButton>
          <a href={'#/InitiatorDashboard'}><PrimaryButton >{"Exit"} </PrimaryButton></a>
        </div>
      </div>
    );
  }
}