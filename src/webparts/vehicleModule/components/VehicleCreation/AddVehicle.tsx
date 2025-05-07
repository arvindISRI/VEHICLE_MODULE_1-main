import * as React from 'react';
import { PeoplePicker, PrincipalType } from '@pnp/spfx-controls-react/lib/PeoplePicker';
import styles from '../VehicleModule.module.scss'
import * as moment from 'moment'

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
import { IVehicleModuleProps } from '../IVehicleModuleProps';
import EmployeeOps from '../../../services/bal/PersonalAdvanceVehicleMaster';
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

      AllEmployeeCollObj: [],
      yearOfManufacture: '',
      yearOfManufacture1: '',

      isSubmitting: false,
      isSave:false,
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

          // POutstandingLoanasOnDate: 0,
          // PAmount: 0,
          // PDatePurposeofWithdrawal: ''
          POutstandingLoanasOnDate: 0,
          PAmount: 0,
          PDatePurposeofWithdrawal: null,
          // expectedLife:0,
          DatePurposeofWithdrawal:'',
        }
      ],

      ExpenseDetails: {
        TotalEmolumentspm: 0,
        TwentyFiveofthetotalemoluments: 0,
        Totaldeductions: 0,
        FityofNetemoluments: 0,
        ExpectedlifeofVehicle: ''

      },
      ConditionOfVehicle: '',
      ExpectlifeShow:false,
      typeOfVehicle1:'',
      typeOfVehicle:'',

    };

  }
  async componentDidMount() {
    await this.getCurrentUser();
    await this.getEmployee();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showhideEmployeeNameLab !== this.state.showhideEmployeeNameLab && !this.state.showhideEmployeeNameLab) {
      this.setState({ selectedOption: null });
    }
  }

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

  handleDropdownChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, field?: string) => {
    if (option && field) {
      this.setState({ [field]: option.key });
    }
  }

  public handleInputChangeadd = (e) => {
    const { name, value } = e.target;
    const parsed = parseFloat(value);
    !isNaN(parsed) && isFinite(value) ? parsed : value;
    const numericValue = (value )

    let updatedExpenseDetails = {
      ...this.state.ExpenseDetails,
      [name.split('.')[1]]: numericValue
    };

    if (name === "ExpenseDetails.TotalEmolumentspm") {
      updatedExpenseDetails.TwentyFiveofthetotalemoluments = numericValue * 0.25;
    }

    const totalEmoluments = name === "ExpenseDetails.TotalEmolumentspm"
      ? numericValue
      : this.state.ExpenseDetails.TotalEmolumentspm || 0;

    const totalDeductions = name === "ExpenseDetails.Totaldeductions"
      ? numericValue
      : this.state.ExpenseDetails.Totaldeductions || 0;

    updatedExpenseDetails.FityofNetemoluments = (totalEmoluments - totalDeductions) * 0.5;

    this.setState({ ExpenseDetails: updatedExpenseDetails });

  };

  // public BtnSubmitRequest = async () => {

  //   this.setState({ isSubmitting: true });

  //   this.state;
  //   this.setState({ isSubmitting: false });

  //   const spCrudObj = await useSPCRUD();
  //   var VehicleRequestItem;
  //     VehicleRequestItem = {

  //       EmployeeCode: this.state.EmployeeID,
  //       EmployeeName: this.state.EmployeeName,
  //       Age: ''+this.state.Age,
  //       Status: "Pending",
  //       DateOfJoining:this.state.DateOfJoining?new Date(this.state.DateOfJoining):null,
  //       ResidenceAddress:this.state.CurrentOfficeLocation,
  //       Designation: this.state.DesignationTitle,
  //       TotalEmoluments	:	+this.state.ExpenseDetails.TotalEmolumentspm	,
  //       Emoluments25	:	+this.state.ExpenseDetails.TwentyFiveofthetotalemoluments	,
  //       TotalDeductions	:	+this.state.ExpenseDetails.Totaldeductions	,
  //       NetEmoluments50	:	+this.state.ExpenseDetails.FityofNetemoluments	,
  //       EmiTenure	:	this.state.ExpenseDetails.RepaymenttenureinEMI?+this.state.ExpenseDetails.RepaymenttenureinEMI:0	,
  //       CostOfVehicle	:	this.state.ExpenseDetails.CostofVehicle?+this.state.ExpenseDetails.CostofVehicle:0	,
  //       VehicleType:this.state.typeOfVehicle	,
  //       ManufactureYear:this.state.yearOfManufacture1?(this.state.yearOfManufacture1):""	,
  //       VehicleCondition:this.state.ConditionOfVehicle	,
  //       MakeModel:this.state.ExpenseDetails.MakeModel?this.state.ExpenseDetails.MakeModel:""	,
  //       SellerDetails:this.state.ExpenseDetails.NameandAddressoftheSeller?this.state.ExpenseDetails.NameandAddressoftheSeller:""	,
  //       ExpectedLife:''+this.state.ExpenseDetails.ExpectedlifeofVehicle	,
  //       FinalRepaymentDate:this.state.ExpenseDetails.Dateoffinalrepaymentofloan?new Date(this.state.ExpenseDetails.Dateoffinalrepaymentofloan):null	,
  //       AmountofLoanAvailed:this.state.ExpenseDetails.AmountofLoanavailed?+this.state.ExpenseDetails.AmountofLoanavailed:0,
  //       DateofLoanAvailed:this.state.ExpenseDetails.DateofAvailmentofLoan?new Date(this.state.ExpenseDetails.DateofAvailmentofLoan):null

  //     };
  
  //   return await spCrudObj.insertData("PersonalAdvanceVehicle", VehicleRequestItem, this.props).then(async (req) => {
  //     this.setState({ reqID: req.data.ID });

  //     const RequestNoGenerate = {
  //       Title: 'VM000' + req.data.ID,
  //     };

  //     await spCrudObj.updateData("PersonalAdvanceVehicle", req.data.ID, RequestNoGenerate, this.props);

  //    if (this.state.vehicleRows && this.state.vehicleRows.length > 0) {

      
  //       await this.InsertPrevPersonalAdvanceHistory("PrevPersonalAdvanceHistory", req.data.ID, this.state.vehicleRows);
  //       alert('Vehicle Request Submitted Successfully!');
      
  //      // PrevPersonalAdvanceHistory

  //     } else {
  //       alert('Vehicle Request Submitted without attachments.');
  //     }

  //     this.setState({ isSubmitting: false });

  //     //window.location.href = `${ENV_CONFIG.siteUrl}/SitePages/CHSModule.aspx`;  

  //     return req;
  //   });
  // };


  //   async InsertPrevPersonalAdvanceHistory(ListName, RequestNoGenerate, itemArray) {
  //   const spCrudObj = await useSPCRUD();
  //   for (let i = 0; i < itemArray.length; i++) {
  //     var objVehicleHistoryitems;
  //     objVehicleHistoryitems = {
  //       PersonalAdvanceVehicleIdId:RequestNoGenerate,
  //       WithdrawalDetails:itemArray[i].DatePurposeofWithdrawal?itemArray[i].DatePurposeofWithdrawal:'',
  //       WithdrawalAmount:itemArray[i].PAmount?+itemArray[i].PAmount:0,
  //       ExpectedLife:itemArray[i].expectedLife?+itemArray[i].expectedLife:0,
  //       OutstandingLoan:itemArray[i].POutstandingLoanasOnDate?+itemArray[i].POutstandingLoanasOnDate:0,
  //       FinalRepaymentDate:itemArray[i].PDatePurposeofWithdrawal?new Date(itemArray[i].PDatePurposeofWithdrawal):null
  //     }
  //   }
  //     try {
  //        await spCrudObj.insertData(ListName, objVehicleHistoryitems, this.props).then(async (req) => {

  //       })
  //     } catch (error) {
  //       console.log(`Error uploading ${objVehicleHistoryitems}:`, error);
  //     }
   
  // }


  public BtnSubmitRequest = async (SubmittionType) => {
    var VehicleRequestItem
    // if(SubmittionType=='Draft'){
    //   VehicleRequestItem  = {
    //     EmployeeCode: this.state.EmployeeID,
    //     EmployeeName: this.state.EmployeeName,
    //     Age: '' + this.state.Age,
    //     Status: "Draft",
    //     DateOfJoining: this.state.DateOfJoining ? new Date(this.state.DateOfJoining) : null,
    //     ResidenceAddress: this.state.CurrentOfficeLocation,
    //     Designation: this.state.DesignationTitle,
    //     TotalEmoluments: +this.state.ExpenseDetails.TotalEmolumentspm,
    //     Emoluments25: +this.state.ExpenseDetails.TwentyFiveofthetotalemoluments,
    //     TotalDeductions: +this.state.ExpenseDetails.Totaldeductions,
    //     NetEmoluments50: +this.state.ExpenseDetails.FityofNetemoluments,
    //     EmiTenure: this.state.ExpenseDetails.RepaymenttenureinEMI ? +this.state.ExpenseDetails.RepaymenttenureinEMI : 0,
    //     CostOfVehicle: this.state.ExpenseDetails.CostofVehicle ? +this.state.ExpenseDetails.CostofVehicle : 0,
    //     VehicleType: this.state.typeOfVehicle,

    //     ManufactureYear: this.state.yearOfManufacture1 || "",
    //     VehicleCondition: this.state.ConditionOfVehicle,
    //     MakeModel: this.state.ExpenseDetails.MakeModel || "",
    //     SellerDetails: this.state.ExpenseDetails.NameandAddressoftheSeller || "",
    //     ExpectedLife: '' + this.state.ExpenseDetails.ExpectedlifeofVehicle,
    //     PrevVehicleLoanType:this.state.typeOfVehicle1,
    //     PrevLoanRepaymentDate	: this.state.ExpenseDetails.Dateoffinalrepaymentofloan ? new Date(this.state.ExpenseDetails.Dateoffinalrepaymentofloan) : null,
    //     PrevLoanAmount	: this.state.ExpenseDetails.AmountofLoanavailed ? +this.state.ExpenseDetails.AmountofLoanavailed : 0,
    //     PrevLoanDate	: this.state.ExpenseDetails.DateofAvailmentofLoan ? new Date(this.state.ExpenseDetails.DateofAvailmentofLoan) : null
    //   };
    // }

    if(SubmittionType=='Submitted'){
       VehicleRequestItem = {
        EmployeeCode: this.state.EmployeeID,
        EmployeeName: this.state.EmployeeName,
        Age: '' + this.state.Age,
        Status: "Pending",
        DateOfJoining: this.state.DateOfJoining ? new Date(this.state.DateOfJoining) : null,
        ResidenceAddress: this.state.CurrentOfficeLocation,
        Designation: this.state.DesignationTitle,
        TotalEmoluments: +this.state.ExpenseDetails.TotalEmolumentspm,
        Emoluments25: +this.state.ExpenseDetails.TwentyFiveofthetotalemoluments,
        TotalDeductions: +this.state.ExpenseDetails.Totaldeductions,
        NetEmoluments50: +this.state.ExpenseDetails.FityofNetemoluments,
        EmiTenure: this.state.ExpenseDetails.RepaymenttenureinEMI ? +this.state.ExpenseDetails.RepaymenttenureinEMI : 0,
        CostOfVehicle: this.state.ExpenseDetails.CostofVehicle ? +this.state.ExpenseDetails.CostofVehicle : 0,
        VehicleType: this.state.typeOfVehicle,
        HR1Response:'Pending with HR1',
        HR2Response:'Pending with HR2',

        DateOfConfirmation: this.state.DateOfConfirmation
        ? `${new Date(this.state.DateOfConfirmation).getDate()}-${new Date(this.state.DateOfConfirmation).getMonth() + 1}-${new Date(this.state.DateOfConfirmation).getFullYear()}`
        : null,
        GHResponse:'Pending with Group Head',
        ManufactureYear: this.state.yearOfManufacture1 || "",
        VehicleCondition: this.state.ConditionOfVehicle,
        MakeModel: this.state.ExpenseDetails.MakeModel || "",
        SellerDetails: this.state.ExpenseDetails.NameandAddressoftheSeller || "",
        ExpectedLife: '' + this.state.ExpenseDetails.ExpectedlifeofVehicle,
        PrevVehicleLoanType:this.state.typeOfVehicle1,
        PrevLoanRepaymentDate	: this.state.ExpenseDetails.Dateoffinalrepaymentofloan ? new Date(this.state.ExpenseDetails.Dateoffinalrepaymentofloan) : null,
        PrevLoanAmount	: this.state.ExpenseDetails.AmountofLoanavailed ? +this.state.ExpenseDetails.AmountofLoanavailed : 0,
        PrevLoanDate	: this.state.ExpenseDetails.DateofAvailmentofLoan ? new Date(this.state.ExpenseDetails.DateofAvailmentofLoan) : null
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
  
      if (this.state.vehicleRows && this.state.vehicleRows.length > 0) {
        await this.InsertPrevPersonalAdvanceHistory("PrevPersonalAdvanceHistory", req.data.ID, this.state.vehicleRows);
        alert('Vehicle Request Submitted Successfully!');
        window.location.href='#/InitiatorDashboard'

      } else {
        alert('Vehicle Request Submitted without attachments.');
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error submitting the vehicle request.");
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  public BtnSaveAsDraft = async (SubmittionType) => {
    var VehicleRequestItem
    if(SubmittionType=='Draft'){
      VehicleRequestItem  = {
        EmployeeCode: this.state.EmployeeID,
        EmployeeName: this.state.EmployeeName,
        Age: '' + this.state.Age,
        Status: "Draft",
        DateOfJoining: this.state.DateOfJoining ? new Date(this.state.DateOfJoining) : null,
        ResidenceAddress: this.state.CurrentOfficeLocation,
        Designation: this.state.DesignationTitle,
        TotalEmoluments: +this.state.ExpenseDetails.TotalEmolumentspm,
        Emoluments25: +this.state.ExpenseDetails.TwentyFiveofthetotalemoluments,
        TotalDeductions: +this.state.ExpenseDetails.Totaldeductions,
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
        PrevVehicleLoanType:this.state.typeOfVehicle1,
        PrevLoanRepaymentDate	: this.state.ExpenseDetails.Dateoffinalrepaymentofloan ? new Date(this.state.ExpenseDetails.Dateoffinalrepaymentofloan) : null,
        PrevLoanAmount	: this.state.ExpenseDetails.AmountofLoanavailed ? +this.state.ExpenseDetails.AmountofLoanavailed : 0,
        PrevLoanDate	: this.state.ExpenseDetails.DateofAvailmentofLoan ? new Date(this.state.ExpenseDetails.DateofAvailmentofLoan) : null
      };
    }

    // if(SubmittionType=='Submitted'){
    //    VehicleRequestItem = {
    //     EmployeeCode: this.state.EmployeeID,
    //     EmployeeName: this.state.EmployeeName,
    //     Age: '' + this.state.Age,
    //     Status: "Pending",
    //     DateOfJoining: this.state.DateOfJoining ? new Date(this.state.DateOfJoining) : null,
    //     ResidenceAddress: this.state.CurrentOfficeLocation,
    //     Designation: this.state.DesignationTitle,
    //     TotalEmoluments: +this.state.ExpenseDetails.TotalEmolumentspm,
    //     Emoluments25: +this.state.ExpenseDetails.TwentyFiveofthetotalemoluments,
    //     TotalDeductions: +this.state.ExpenseDetails.Totaldeductions,
    //     NetEmoluments50: +this.state.ExpenseDetails.FityofNetemoluments,
    //     EmiTenure: this.state.ExpenseDetails.RepaymenttenureinEMI ? +this.state.ExpenseDetails.RepaymenttenureinEMI : 0,
    //     CostOfVehicle: this.state.ExpenseDetails.CostofVehicle ? +this.state.ExpenseDetails.CostofVehicle : 0,
    //     VehicleType: this.state.typeOfVehicle,

    //     ManufactureYear: this.state.yearOfManufacture1 || "",
    //     VehicleCondition: this.state.ConditionOfVehicle,
    //     MakeModel: this.state.ExpenseDetails.MakeModel || "",
    //     SellerDetails: this.state.ExpenseDetails.NameandAddressoftheSeller || "",
    //     ExpectedLife: '' + this.state.ExpenseDetails.ExpectedlifeofVehicle,
    //     PrevVehicleLoanType:this.state.typeOfVehicle1,
    //     PrevLoanRepaymentDate	: this.state.ExpenseDetails.Dateoffinalrepaymentofloan ? new Date(this.state.ExpenseDetails.Dateoffinalrepaymentofloan) : null,
    //     PrevLoanAmount	: this.state.ExpenseDetails.AmountofLoanavailed ? +this.state.ExpenseDetails.AmountofLoanavailed : 0,
    //     PrevLoanDate	: this.state.ExpenseDetails.DateofAvailmentofLoan ? new Date(this.state.ExpenseDetails.DateofAvailmentofLoan) : null
    //   };
    // }
    this.setState({ isSave: true });
  
    const spCrudObj = await useSPCRUD();
  
 
  
    try {
      const req = await spCrudObj.insertData("PersonalAdvanceVehicle", VehicleRequestItem, this.props);
      this.setState({ reqID: req.data.ID });
  
      const RequestNoGenerate = {
        Title: 'VM000' + req.data.ID
      };
  
      await spCrudObj.updateData("PersonalAdvanceVehicle", req.data.ID, RequestNoGenerate, this.props);
  
      if (this.state.vehicleRows && this.state.vehicleRows.length > 0) {
        await this.InsertPrevPersonalAdvanceHistory("PrevPersonalAdvanceHistory", req.data.ID, this.state.vehicleRows);
        alert('Vehicle Request Submitted Successfully!');
        window.location.href='#/InitiatorDashboard'
      } else {
        alert('Vehicle Request Submitted without attachments.');
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
        // ExpectedLife: itemArray[i].expectedLife ? +itemArray[i].expectedLife : 0,
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
    const isSecondHand = option.key.toString() === 'Second Hand';

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

          // POutstandingLoanasOnDate: 0,
          // PAmount: 0,
          // PDatePurposeofWithdrawal: ''

          POutstandingLoanasOnDate: 0,
          PAmount: 0,
          PDatePurposeofWithdrawal: null,
          // expectedLife:0,
          DatePurposeofWithdrawal:'',
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

  public render(): React.ReactElement<IVehicleModuleProps> {
    return (
      <div >

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
              <Label className="control-Label font-weight-bold">Total Emoluments p.m. (Salary and allowance) </Label>
            </div>
            <div className="col-sm-2">
              <TextField type='number'
                name="ExpenseDetails.TotalEmolumentspm"
                onChanged={(e: any) => this.handleInputChangeadd(event)}/>
            </div>
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">25% of the total emoluments </Label>
            </div>
            <div className="col-sm-2">
              <TextField type='number' disabled
                value={this.state.ExpenseDetails.TwentyFiveofthetotalemoluments}
                name="ExpenseDetails.TwentyFiveofthetotalemoluments"
                onChanged={(e: any) => this.handleInputChangeadd(event)}/>
            </div>
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Total deductions p.m. viz. Festival Advance, Personal Advance </Label>
            </div>
            <div className="col-sm-2">
              <TextField type='number'
                name="ExpenseDetails.Totaldeductions"
                onChanged={(e: any) => this.handleInputChangeadd(event)}/>    
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
                onChanged={(e: any) => this.handleInputChangeadd(event)}/>  </div>
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Repayment tenure in EMI (Maximum 20)  </Label>
            </div>
            <div className="col-sm-2">
              <TextField type='number'
                name="ExpenseDetails.RepaymenttenureinEMI"
                onChanged={(e: any) => this.handleInputChangeadd(event)}/>

            </div>

          </div>
        </div>

        <h4><b>C). Particulars of Vehicle </b></h4>

        <div className='card'>

          <div className="row form-group">
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Type of Vehicle</Label>
            </div>
            <div className="col-sm-2">
              <Dropdown placeHolder="Select vehicle type" options={vehicleOptions}
                selectedKey={this.state.typeOfVehicle}
                onChanged={this.handleTypeOfVehicleChange}
              />
            </div>
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Whether new or second hand </Label>
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
              <Label className="control-Label font-weight-bold">Make/ Model  </Label>
            </div>
            <div className="col-sm-2">
              <TextField 
                name="ExpenseDetails.MakeModel"
                onChanged={(e: any) => this.handleInputChangeadd(event)}/>    
                </div>
          </div>
          <div className="row form-group">
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Year of Manufacture  </Label>
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
              <Label className="control-Label font-weight-bold">Cost of Vehicle   </Label>
            </div>

            <div className="col-sm-2">
              {}

<TextField
  type="number"
  name="ExpenseDetails.CostofVehicle"
  value={this.state.ExpenseDetails.CostofVehicle || ''}
  onChanged={(value: string) => {
    this.setState(prevState => ({
      ExpenseDetails: {
        ...prevState.ExpenseDetails,
        CostofVehicle: value
      }
    }));
  }}
/>

            </div>
          </div>
          <div className="row form-group">
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Name and Address of the Seller / Dealer  </Label>
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

            <div className="col-sm-2" hidden={!this.state.ExpectlifeShow}>
              <Label className="control-Label font-weight-bold">Expected life of Vehicle (in case of second hand vehicle)  </Label>
            </div>
            <div className="col-sm-2"  hidden={!this.state.ExpectlifeShow}>

<TextField

  type='text'
  name="ExpenseDetails.ExpectedlifeofVehicle"
  value={this.state.ExpenseDetails.ExpectedlifeofVehicle }
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

{}

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
                onChanged={(e: any) => this.handleInputChangeadd(event)}></TextField>                  </div>
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
              <TextField type='date'
                name="ExpenseDetails.Dateoffinalrepaymentofloan"
                onChanged={(e: any) => this.handleInputChangeadd(event)}></TextField>  </div>

          </div>

        </div>

        <h4><b>E). Previous Personal Advance History </b> </h4>

        {this.state.vehicleRows.map((row, index) => (
          <div className='card mb-1' key={index}>
            <div className="row form-group">

              <div className="col-sm-1">
                <Label className="control-Label font-weight-bold">Sr No</Label>
                <label className="control-Label font-weight-bold">{index + 1}</label>
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
              {/* <div className="col-sm-3">
                <Label className="control-Label font-weight-bold">Expected Life</Label>
                <TextField
                  type="number"
                  value={row.expectedLife}
                  onChanged={(val) => this.handleRowChange(index, 'expectedLife', val)}
                />
              </div> */}

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
                    <a  href={'#/InitiatorDashboard'}><PrimaryButton >{"Exit"} </PrimaryButton></a>
            
            
          </div>

      </div>
    );
  }
}