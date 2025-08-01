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
import useSPCRUD, { ISPCRUD } from '../../../services/bal/spcrud';
import SPCRUD from '../../../services/bal/spcrud';
import PersonalAdvanceVehicleMasterOps from '../../../services/bal/PersonalAdvanceVehicleMaster';
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
import { IVehicleRequest } from '../../../services/interface/IVehicleRequest';
import { IPrevPersonalAdvanceHistory } from '../../../services/interface/IPrevPersonalAdvanceHistory';
import NoteTemplateDocsDocumentOps from '../../../services/bal/NoteTemplateDocs';
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
export default class EditVehicle extends React.Component<IVehicleModuleProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      AllEmployeeCollObj: [],
      NoteTempDocsColl: [],
      yearOfManufacture: '',
      yearOfManufacture1: '',
      isSubmitting: false,
      AlreadyAnPendingRequest: false,
      existingFiles: [],
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
      newVehicleRows: [],
      updatedVehicleRows: [],
      removedVehicleRowIds: [],
      vehicleRows: [
        {
          POutstandingLoanasOnDate: 0,
          PAmount: 0,
          PDatePurposeofWithdrawal: null,
          expectedLife: 0,
          DatePurposeofWithdrawal: ''
        }
      ],
      ExpenseDetails: {
        TotalEmolumentspm: 0,
        TotalLoanAmount:0,
        TwentyFiveofthetotalemoluments: 0,
        Totaldeductions: 0,
        FityofNetemoluments: 0,
        ExpectedlifeofVehicle: '',
      },
      ConditionOfVehicle: '',
      ExpectlifeShow: false,
      typeOfVehicle1: '',
      typeOfVehicle: '',
    };
  }
  //   async componentDidMount() {

  //     let hashUrl = window.location.hash;
  //     let hashUrlSplit = hashUrl.split('/');
  //     let VMId = hashUrlSplit[2];
  //     this.setState({ VMId: VMId });

  //     localStorage.removeItem('activeTab');

  //     localStorage.setItem('activeTab', 'Pending');

  //     await this.getAllPersonalAdvanceVehicle();
  //     await this.getAllPrevPersonalAdvanceHistory();
  //     await this.getCurrentUser();

  //   //   const requestNo = VMId;
  //   //   const libraryFolder = 'VehicleCostAttachments';
  //   //   // const files = await sp.web.getFolderByServerRelativeUrl(libraryFolder)
  //   //   //   .files.filter(`PersonalAdvanceVehicleId eq '${requestNo}'`).get();
  //   //   // this.setState({ existingFiles: files.map(f => ({ Name: f.Name, Url: f.ServerRelativeUrl, Id: f.UniqueId })) });
  //   //   const files = await sp.web
  //   //   .getFolderByServerRelativeUrl(libraryFolder)
  //   //   .files
  //   //   .select('Name','ServerRelativeUrl','PersonalAdvanceVehicleIdId')
  //   //   .expand('PersonalAdvanceVehicleId')
  //   //   .filter(`PersonalAdvanceVehicleIdId eq ${VMId}`)
  //   //   .get();
  //   // this.setState({ existingFiles: files.map(f => ({ Name: f.Name, Url: f.ServerRelativeUrl, Id: f.UniqueId })) });


  // const requestNo = VMId;
  // const libraryFolder = 'VehicleCostAttachments';

  // const files = await sp.web
  //   .getFolderByServerRelativeUrl(libraryFolder)
  //   .files
  //   .select('Name','ServerRelativeUrl','UniqueId','ListItemAllFields/PersonalAdvanceVehicleIdId')
  //   .expand('ListItemAllFields')
  //   .filter(`ListItemAllFields/PersonalAdvanceVehicleIdId eq ${requestNo}`)
  //   .get();

  // this.setState({
  //   existingFiles: files.map(f => ({
  //     Name: f.Name,
  //     Url: f.ServerRelativeUrl,
  //     Id: f.UniqueId
  //   }))
  // });



  //   }
  async componentDidMount() {
    // Extract VMId from the URL hash
    const hashUrl = window.location.hash;
    const hashUrlSplit = hashUrl.split('/');
    const VMId = hashUrlSplit[2];

    this.setState({ VMId });

    // Set default active tab
    localStorage.removeItem('activeTab');
    localStorage.setItem('activeTab', 'Pending');

    // Call API functions
    await this.getAllPersonalAdvanceVehicle();
    await this.getAllPrevPersonalAdvanceHistory();
    await this.getCurrentUser();

    // Fetch files from SharePoint library
    const requestNo = VMId;
    await this.getNoteTemplateDocs(requestNo)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showhideEmployeeNameLab !== this.state.showhideEmployeeNameLab && !this.state.showhideEmployeeNameLab) {
      this.setState({ selectedOption: null });
    }
    // if(prevState.ExpenseDetails.Dateoffinalrepaymentofloan !== this.state.ExpenseDetails.Dateoffinalrepaymentofloan && !this.state.ExpenseDetails.Dateoffinalrepaymentofloan){
    //   // this.state.ExpenseDetails.Dateoffinalrepaymentofloan
    //   this.setState({ ExpenseDetails:{Dateoffinalrepaymentofloan : null }});
    //   // ExpenseDetails: {
    //   //   TotalEmolumentspm: nul,
    // }
  }


  public getNoteTemplateDocs = async (NoteId) => {
    let web = Web(this.props.currentSPContext.pageContext.web.absoluteUrl);
    await NoteTemplateDocsDocumentOps().getNoteTemplateDocsDocument(NoteId, this.props).then(async (brPlanDocresults) => {
      this.setState({ NoteTempDocsColl: brPlanDocresults });
    }, error => {
      console.log(error);
    });
  }


  // Handle new file selection
  private onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = [];
    if (e.target.files) {
      for (let i = 0; i < e.target.files.length; i++) {
        files.push(e.target.files.item(i)!);
      }
    }
    this.setState({ selectedFiles: files });
  };

  // Remove existing attachment
  // private removeExisting = async (id: number) => {
  //   await sp.web.getFileById(id).delete();
  //   this.setState(prev => ({ existingFiles: prev.existingFiles.filter(f => f.Id !== id) }));
  // };
  public getCurrentUser = async () => {
    const spCrudObj = await useSPCRUD();
    return await spCrudObj.currentUser(this.props).then(cuser => {
      this.setState({ Currentuser: cuser });
      return cuser;
    });
  }

  public getAllPersonalAdvanceVehicle = async (): Promise<IVehicleRequest | any> => {
    return await PersonalAdvanceVehicleMasterOps().getAllPersonalAdvanceVehicle(this.props).then(async (results) => {
      let employeeData = results;

     
      var currentEmpResult = employeeData.filter((item) => {
        return item.ID == +this.state.VMId;
      })
      var AlreadyPendingcurrentEmpResult=[];
       AlreadyPendingcurrentEmpResult = employeeData.filter((item) => {
        return (item.EmployeeCode == +currentEmpResult[0].EmployeeCode) && (item.Status == 'Pending');
      });
      
      if (AlreadyPendingcurrentEmpResult && AlreadyPendingcurrentEmpResult.length > 0) {
        this.setState({ AlreadyAnPendingRequest: true });
      }

      if (currentEmpResult && currentEmpResult.length > 0) {
        this.setState({
          EmployeeInfodb: currentEmpResult,
          AllEmployeeCollObj: [],
          EmployeeName: currentEmpResult[0].EmployeeName,
          Title: currentEmpResult[0].Title,
          DateOfJoining: currentEmpResult[0].DateOfJoining ? new Date(currentEmpResult[0].DateOfJoining) : null,
          CurrentOfficeLocation: currentEmpResult[0].ResidenceAddress,
          EmployeeCode: '' + currentEmpResult[0].EmployeeCode,
          DesignationTitle: currentEmpResult[0].Designation,
          Age: (currentEmpResult[0].Age),
          ExpenseDetails: {
             TotalEmolumentspm: +currentEmpResult[0].TotalEmoluments,
            TotalLoanAmount: +currentEmpResult[0].TotalLoanAmount,

            
            TwentyFiveofthetotalemoluments: +currentEmpResult[0].Emoluments25,
            Totaldeductions: +currentEmpResult[0].TotalDeductions,
            FityofNetemoluments: +currentEmpResult[0].NetEmoluments50,
            RepaymenttenureinEMI: currentEmpResult[0].EmiTenure,
            MakeModel: currentEmpResult[0].MakeModel,
            CostofVehicle: currentEmpResult[0].CostOfVehicle,
            NameandAddressoftheSeller: currentEmpResult[0].SellerDetails,
            AmountofLoanavailed: currentEmpResult[0].PrevLoanAmount ? +currentEmpResult[0].PrevLoanAmount : 0,
            Dateoffinalrepaymentofloan: currentEmpResult[0].PrevLoanRepaymentDate ? new Date(currentEmpResult[0].PrevLoanRepaymentDate).toISOString().split('T')[0] : '',
            DateofAvailmentofLoan: currentEmpResult[0].PrevLoanDate ? new Date(currentEmpResult[0].PrevLoanDate).toISOString().split('T')[0] : '',
            ExpectedlifeofVehicle: currentEmpResult[0].ExpectedLife || '',

          },
          typeOfVehicle: currentEmpResult[0].VehicleType,
          typeOfVehicle1: currentEmpResult[0].PrevVehicleLoanType,
          ConditionOfVehicle: currentEmpResult[0].VehicleCondition,
          yearOfManufacture1: currentEmpResult[0].ManufactureYear,
        });
      }
      return currentEmpResult;
    });
  };
  public getAllPrevPersonalAdvanceHistory = async (): Promise<any> => {
    return await PersonalAdvanceVehicleMasterOps().getAllPrevPersonalAdvanceHistory(this.props).then(async (results) => {
      let employeeDataHisty = results;
      var currentEmpResultHistory = employeeDataHisty.filter((item) => {
        return item.PersonalAdvanceVehicleId.Id == +this.state.VMId;
      });
      if (currentEmpResultHistory && currentEmpResultHistory.length > 0) {
        const vehicleRowsFromDB = currentEmpResultHistory.map((item) => ({
          DatePurposeofWithdrawal: item.WithdrawalDetails || '',
          PAmount: item.WithdrawalAmount || 0,
          POutstandingLoanasOnDate: item.OutstandingLoan || 0,
          PDatePurposeofWithdrawal: item.FinalRepaymentDate ? new Date(item.FinalRepaymentDate).toISOString().split('T')[0] : null,
          Id: item.ID || 0,
          isNew: false,
          PersonalAdvanceVehicleId: item.PersonalAdvanceVehicleId || 0
        }));
        this.setState({
          EmployeeInfodb: currentEmpResultHistory,
          vehicleRows: vehicleRowsFromDB,
          AllEmployeeCollObj: [],
        });
      }
      return currentEmpResultHistory;
    });
  };


  handleDropdownChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, field?: string) => {
    if (option && field) {
      this.setState({ [field]: option.key });
    }
  }
  // public handleInputChangeadd = (e) => {
  //   const { name, value } = e.target;
  //   const parsed = parseFloat(value);
  //   !isNaN(parsed) && isFinite(value) ? parsed : value;
  //   const numericValue = (value)
  //   let updatedExpenseDetails = {
  //     ...this.state.ExpenseDetails,
  //     [name.split('.')[1]]: numericValue
  //   };
  //   if (name == "ExpenseDetails.TotalEmolumentspm") {
  //     updatedExpenseDetails.TwentyFiveofthetotalemoluments = numericValue * 0.25;
  //   }
  //   const totalEmoluments = name == "ExpenseDetails.TotalEmolumentspm"
  //     ? numericValue
  //     : this.state.ExpenseDetails.TotalEmolumentspm || 0;
  //   const totalDeductions = name == "ExpenseDetails.Totaldeductions"
  //     ? numericValue
  //     : this.state.ExpenseDetails.Totaldeductions || 0;
  //   updatedExpenseDetails.FityofNetemoluments = (totalEmoluments - totalDeductions) * 0.5;
  //   this.setState({ ExpenseDetails: updatedExpenseDetails });
  // };

  // handleInputChangeadd = (e) => {
  //   const { name, value } = e.target;
  //   const field = name.split('.')[1];

  //   const parsedValue = parseFloat(value);
  //   const numericValue = !isNaN(parsedValue) && isFinite(parsedValue) ? parsedValue : value;

  //   // Prepare new ExpenseDetails object
  //   let updatedExpenseDetails = {
  //     ...this.state.ExpenseDetails,
  //     [field]: numericValue
  //   };

  //   // Fetch updated totals for both fields
  //   let totalEmoluments = field === "TotalEmolumentspm" ? numericValue : parseFloat(this.state.ExpenseDetails.TotalEmolumentspm) || 0;
  //   let totalDeductions = field === "Totaldeductions" ? numericValue : parseFloat(this.state.ExpenseDetails.Totaldeductions) || 0;

  //   // Enforce capping: Total Deductions should not exceed Total Emoluments
  //   if (+totalDeductions > +totalEmoluments) {
  //     totalDeductions = +totalEmoluments;
  //     updatedExpenseDetails.Totaldeductions = +totalEmoluments; // Cap the value
  //   }

  //   // Update 25% of Total Emoluments
  //   updatedExpenseDetails.TwentyFiveofthetotalemoluments = totalEmoluments * 0.25;

  //   // Update 50% of Net Emoluments
  //   updatedExpenseDetails.FityofNetemoluments = (totalEmoluments - totalDeductions) * 0.5;

  //   // Final state update
  //   this.setState({ ExpenseDetails: updatedExpenseDetails });
  // };

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
// if (field === "CostofVehicle" && costofVehicle > 1000000) {
  if (field === "CostofVehicle") {

  // costofVehicle = 1000000;
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

  public BtnSaveAsDraft = async (SubmittionType) => {

    var rate=5.5;
    var VehicleLoanEMI= ((this.state.ExpenseDetails.TotalLoanAmount*(1+(rate*this.state.ExpenseDetails.RepaymenttenureinEMI*(1/1200))))/(this.state.ExpenseDetails.RepaymenttenureinEMI)).toFixed(2);
     
    const spCrudObj = await useSPCRUD();
    if (this.state.removedVehicleRowIds && this.state.removedVehicleRowIds.length > 0) {
      for (var r = 0; r < this.state.removedVehicleRowIds.length; r++) {
        await spCrudObj.deleteData("PrevPersonalAdvanceHistory", this.state.removedVehicleRowIds[r], this.props);
      }
    }
    const RequestNoGenerate = this.state.VMId;
    var VehicleRequestItem
    if (SubmittionType == 'Draft') {
      VehicleRequestItem = {
        EmployeeCode: this.state.EmployeeCode,
        EmployeeName: this.state.EmployeeName,
        Age: '' + this.state.Age,
        Status: "Draft",
        CurrentStatus:'Draft',

        VehicleLoanEMI:VehicleLoanEMI||0,
        Id: RequestNoGenerate,
        DateOfJoining: this.state.DateOfJoining ? new Date(this.state.DateOfJoining) : null,
        ResidenceAddress: this.state.CurrentOfficeLocation,
        Designation: this.state.DesignationTitle,
        TotalEmoluments: +this.state.ExpenseDetails.TotalEmolumentspm,
        TotalLoanAmount: +this.state.ExpenseDetails.TotalLoanAmount,

        Emoluments25: +this.state.ExpenseDetails.TwentyFiveofthetotalemoluments,
        TotalDeductions: +this.state.ExpenseDetails.Totaldeductions,
        NetEmoluments50: +this.state.ExpenseDetails.FityofNetemoluments,
        EmiTenure: this.state.ExpenseDetails.RepaymenttenureinEMI ? +this.state.ExpenseDetails.RepaymenttenureinEMI : 0,
        CostOfVehicle: this.state.ExpenseDetails.CostofVehicle ? +this.state.ExpenseDetails.CostofVehicle : 0,
        VehicleType: this.state.typeOfVehicle,
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
    try {
      await spCrudObj.updateData("PersonalAdvanceVehicle", this.state.VMId, VehicleRequestItem, this.props);
      const RequestNoGenerate = +this.state.VMId;

      // // 3. Upload and tag files with RequestNo metadata
      // if (this.state.selectedFiles && this.state.selectedFiles.length > 0) {
      //   const libraryFolder = 'VehicleCostAttachments';
      //   const folder = sp.web.getFolderByServerRelativeUrl(libraryFolder);
      //   for (const file of this.state.selectedFiles) {
      //     const uploadResult = await folder.files.add(file.name, file, true);
      //     // Set RequestNo column on the uploaded file
      //     await uploadResult.file.getItem().then(item =>
      //       item.update({
      //         PersonalAdvanceVehicleIdId: +this.state.VMId,
      //       })
      //     );
      //   }
      // }

  if(this.state.selectedFiles){
    if (this.state.selectedFiles.length  > 0 ) {
      const libraryFolder = 'VehicleCostAttachments';
      const files = this.state.selectedFiles;
      const vPersonalAdvanceVehicleIdId =RequestNoGenerate;// req.data.ID;
      const web = Web(this.props.currentSPContext.pageContext.web.absoluteUrl); // Make sure this.props is accessible
    
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uniqueFileName = `${file.name}`;
    
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
  }


      const newRows = this.state.vehicleRows.filter(row => row.isNew == true);
      const existingRows = this.state.vehicleRows.filter(row => !row.isNew && row.Id);
      if (existingRows && existingRows.length > 0) {
        await this.UpdatePrevPersonalAdvanceHistory("PrevPersonalAdvanceHistory", RequestNoGenerate, existingRows);
      }
      if (newRows && newRows.length > 0) {
        await this.InsertPrevPersonalAdvanceHistory("PrevPersonalAdvanceHistory", RequestNoGenerate, newRows);
      }
      if ((existingRows && existingRows.length > 0) || (newRows && newRows.length > 0)) {
        swal("Success", "Vehicle Request Updated Successfully!", "success").then(() => {
          window.location.href = '#/InitiatorDashboard';
        });
      } else {
        swal("Notice", "Vehicle Request Submitted Failed.", "info");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error submitting the vehicle request.");
    } finally {
      this.setState({ isSave: false });
    }
  };
  // public BtnSubmitRequest = async (SubmittionType) => {
  //   var AlreadyPendingcurrentEmpResult=[];
  //  var EmployeeCode= +this.state.EmployeeCode;
  //      await PersonalAdvanceVehicleMasterOps().getAllPersonalAdvanceVehicle(this.props).then(async (results) => {
  //       let employeeData = results;

  //        AlreadyPendingcurrentEmpResult = employeeData.filter((item:any) => {
  //         (+item.EmployeeCode ==EmployeeCode && item.Status=='Pending' );
  //      })
  //      if (AlreadyPendingcurrentEmpResult && AlreadyPendingcurrentEmpResult.length > 0) {
  //       swal("Notice", "Your Vehicle Request already in Pending.", "info");
  //       //alert('hii');
  //       return false

  //        this.setState({AlreadyAnPendingRequest:true});
  //      }
  //     })
  public BtnSubmitRequest = async (SubmittionType) => {
    var rate=5.5;
    var VehicleLoanEMI= ((this.state.ExpenseDetails.TotalLoanAmount*(1+(rate*this.state.ExpenseDetails.RepaymenttenureinEMI*(1/1200))))/(this.state.ExpenseDetails.RepaymenttenureinEMI)).toFixed(2);
     

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

    let AlreadyPendingcurrentEmpResult = [];
    const EmployeeCode = +this.state.EmployeeCode;

 



    // if(this.state.AlreadyAnPendingRequest==true){
    //   swal("Notice", "Your Vehicle Request already in Pending.", "info");
    //   //alert('hii');
    //   return false

    // }
    const { ExpenseDetails, typeOfVehicle, ConditionOfVehicle, yearOfManufacture1, ExpectlifeShow } = this.state;
    const showAlert = (message) => {
      swal("Vehicle Module says:", message, "warning");
    };
    const isEmpty = (val) => val == '' || val == null || val == undefined || val == 0;
    if (isEmpty(ExpenseDetails.TotalEmolumentspm)){ 
    showAlert('Please Fill Total Emoluments p.m. (Salary and allowance)');
    return false;
    }

    if (isEmpty(ExpenseDetails.Totaldeductions)) 
      
      {
         
        showAlert('Please Fill Total deductions p.m. viz. Festival Advance, Personal Advance');
        return false
      }

      if (isEmpty(ExpenseDetails.TotalLoanAmount)) 
      
        {
           
          showAlert('Please Fill Total Loan Amount');
                    return false
        }

        if (isEmpty(ExpenseDetails.RepaymenttenureinEMI))
        {
           showAlert('Please Fill Repayment tenure in EMI');
           return false

        }
    if (isEmpty(ExpenseDetails.TotalLoanAmount)) {
       showAlert('Please Fill Total Loan Amount');
      return false

    }

    
    if (ExpenseDetails.RepaymenttenureinEMI > 120){
       showAlert('Repayment tenure in EMI should be less than 120');
       return false

    }
    if (isEmpty(typeOfVehicle)){  
      showAlert('Please Select Type of Vehicle')
      return false
    };
    if (isEmpty(ConditionOfVehicle)) {
      showAlert('Please Select Whether new or second hand');
      return false
    } 
    if (isEmpty(ExpenseDetails.MakeModel)){
      showAlert('Please Fill Make/ Model');
      return   false;
    }  
    if (isEmpty(yearOfManufacture1)) {
      showAlert('Please Select Year of Manufacture');
      return false;
    } 
    if (isEmpty(ExpenseDetails.CostofVehicle)) {
      showAlert('Please Fill Cost of Vehicle');
      return false
    } 
    if (isEmpty(ExpenseDetails.NameandAddressoftheSeller)) 
    {
      showAlert('Please Fill Name and Address of the Seller / Dealer');
      return false
    }
    if (ExpectlifeShow && isEmpty(ExpenseDetails.ExpectedlifeofVehicle)) 
      {
        showAlert('Please Fill Expected life of Vehicle');
        return false
      } 

      if (this.state.AlreadyAnPendingRequest == true) {
        swal("Notice", "Your Vehicle Request already in Pending.", "info");
        //alert('hii');
        return false
  
      }

      // await PersonalAdvanceVehicleMasterOps().getAllPersonalAdvanceVehicle(this.props).then(async (results) => {
      //   const employeeData = results;
  
      //   console.log("Checking against EmployeeCode:", EmployeeCode);
      //   console.log("Employee vehicle data:", employeeData);
  
      //   AlreadyPendingcurrentEmpResult = employeeData.filter((item: any) => {
      //     console.log("Item:", item.EmployeeCode, item.Status);
      //     return +item.EmployeeCode == +EmployeeCode && item.Status == 'Pending';
      //   });
  
      //   if (AlreadyPendingcurrentEmpResult && AlreadyPendingcurrentEmpResult.length > 0) {
      //     this.setState({ AlreadyAnPendingRequest: true });
      //     swal("Notice", "Your Vehicle Request is already in Pending.", "info");
      //     window.location.href = '#/InitiatorDashboard';
  
      //     return false;
      //   }
      // });

    const spCrudObj = await useSPCRUD();
    if (this.state.removedVehicleRowIds.length > 0) {
      for (let id of this.state.removedVehicleRowIds) {
        await spCrudObj.deleteData("PrevPersonalAdvanceHistory", id, this.props);
      }
    }
    let VehicleRequestItem;
    if (SubmittionType == 'Submitted') {
      VehicleRequestItem = {
        EmployeeCode: this.state.EmployeeCode,
        EmployeeName: this.state.EmployeeName,
        Age: '' + this.state.Age,
        VehicleLoanEMI:VehicleLoanEMI||0,
        Status: "Pending",
        RequestorEmail	:this.state.CompanyEmail,

        HR1Response: 'Pending with HR1',
        HR2Response: 'Pending with HR2',
        GHResponse: 'Pending with Group Head',
        CurrentStatus:'Pending with Group Head',

        DateOfJoining: this.state.DateOfJoining ? new Date(this.state.DateOfJoining) : null,
        ResidenceAddress: this.state.CurrentOfficeLocation,
        Designation: this.state.DesignationTitle,
        TotalEmoluments: +ExpenseDetails.TotalEmolumentspm,
        TotalLoanAmount: +ExpenseDetails.TotalLoanAmount,

        Emoluments25: +ExpenseDetails.TwentyFiveofthetotalemoluments,
        TotalDeductions: +ExpenseDetails.Totaldeductions,
        NetEmoluments50: +ExpenseDetails.FityofNetemoluments,
        EmiTenure: +ExpenseDetails.RepaymenttenureinEMI || 0,
        CostOfVehicle: +ExpenseDetails.CostofVehicle || 0,
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
    try {
      await spCrudObj.updateData("PersonalAdvanceVehicle", +this.state.VMId, VehicleRequestItem, this.props);
      const RequestNoGenerate = this.state.VMId;
      // // 3. Upload and tag files with RequestNo metadata
      // if (this.state.selectedFiles && this.state.selectedFiles.length > 0) {
      //   const libraryFolder = 'VehicleCostAttachments';
      //   const folder = sp.web.getFolderByServerRelativeUrl(libraryFolder);
      //   for (const file of this.state.selectedFiles) {
      //     const uploadResult = await folder.files.add(file.name, file, true);
      //     // Set RequestNo column on the uploaded file
      //     await uploadResult.file.getItem().then(item =>
      //       item.update({
      //         PersonalAdvanceVehicleIdId: RequestNoGenerate,
      //       })
      //     );
      //   }
      // }
      
      if (this.state.selectedFiles&&this.state.selectedFiles.length > 0) {
        const libraryFolder = 'VehicleCostAttachments';
        const files = this.state.selectedFiles;
        const vPersonalAdvanceVehicleIdId =RequestNoGenerate;// req.data.ID;
        const web = Web(this.props.currentSPContext.pageContext.web.absoluteUrl); // Make sure this.props is accessible
      
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const uniqueFileName = `${file.name}`;
      
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

      const newRows = this.state.vehicleRows.filter(row => row.isNew);
      const existingRows = this.state.vehicleRows.filter(row => !row.isNew && row.Id);
      if (existingRows && existingRows.length > 0) {
        await this.UpdatePrevPersonalAdvanceHistory("PrevPersonalAdvanceHistory", RequestNoGenerate, existingRows);
      }
      if (newRows && newRows.length > 0) {
        await this.InsertPrevPersonalAdvanceHistory("PrevPersonalAdvanceHistory", RequestNoGenerate, newRows);
      }
      if (existingRows || existingRows.length > 0 || newRows || newRows.length > 0) {
        swal("Success", "Vehicle Request Submitted Successfully!", "success").then(() => {
          window.location.href = '#/InitiatorDashboard';
        });
      } else {
        swal("Submitted", "Vehicle Request Submitted without attachments.", "info");
      }
    } catch (error) {
      console.error("Submission error:", error);
      swal("Error", "Error submitting the vehicle request.", "error");
    } finally {
      this.setState({ isSubmitting: false });
    }
  };
  async InsertPrevPersonalAdvanceHistory(ListName, RequestNoGenerate, itemArray) {
    const spCrudObj = await useSPCRUD();
    if (itemArray && itemArray.length > 0) {
      for (let i = 0; i < itemArray.length; i++) {
        const objVehicleHistoryitems = {
          PersonalAdvanceVehicleIdId: +RequestNoGenerate,
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
  }
  async UpdatePrevPersonalAdvanceHistory(ListName, RequestNoGenerate, itemArray) {
    const spCrudObj = await useSPCRUD();
    if (itemArray && itemArray.length > 0) {
      for (let i = 0; i < itemArray.length; i++) {
        const objVehicleHistoryitems = {
          PersonalAdvanceVehicleIdId: +RequestNoGenerate,
          WithdrawalDetails: itemArray[i].DatePurposeofWithdrawal || '',
          WithdrawalAmount: itemArray[i].PAmount ? +itemArray[i].PAmount : 0,
          OutstandingLoan: itemArray[i].POutstandingLoanasOnDate ? +itemArray[i].POutstandingLoanasOnDate : 0,
          FinalRepaymentDate: itemArray[i].PDatePurposeofWithdrawal ? new Date(itemArray[i].PDatePurposeofWithdrawal) : null
        };
        try {
          await spCrudObj.updateData(ListName, itemArray[i].Id, objVehicleHistoryitems, this.props);
        } catch (error) {
          console.error(`Error uploading item ${i + 1}:`, error);
        }
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
    const newRow = {
      Id: Date.now(),
      POutstandingLoanasOnDate: 0,
      PAmount: 0,
      PDatePurposeofWithdrawal: null,
      DatePurposeofWithdrawal: '',
      isNew: true
    };
    this.setState(prevState => ({
      vehicleRows: [...prevState.vehicleRows, newRow],
      newVehicleRows: [...prevState.newVehicleRows, newRow]
    }));
  };
  private handleRowChange = (index: number, field: string, value: string) => {
    const updatedRows = [...this.state.vehicleRows];
    const row = { ...updatedRows[index], [field]: value };
    updatedRows[index] = row;
    const isExisting = !row.isNew;
    this.setState(prevState => ({
      vehicleRows: updatedRows,
      updatedVehicleRows: isExisting
        ? [
          ...prevState.updatedVehicleRows.filter(r => r.Id !== row.Id),
          row
        ]
        : prevState.updatedVehicleRows
    }));
  };
  private removeRow = (index: number, object) => {
    const rowToRemove = this.state.vehicleRows[index];
    const updatedVehicleRows = this.state.vehicleRows.filter((_, i) => i !== index);
    this.setState(prevState => {
      const isNew = rowToRemove.isNew;
      const newVehicleRows = isNew
        ? prevState.newVehicleRows.filter(r => r.Id !== rowToRemove.Id)
        : prevState.newVehicleRows;
      const newVehicleRows1 = isNew
        ? prevState.newVehicleRows.filter(r => r.Id == rowToRemove.Id)
        : prevState.newVehicleRows;
      newVehicleRows1.map((item) => {
        item.PDatePurposeofWithdrawal = null;
        item.PDatePurposeofWithdrawal = "";
      })
      const removedVehicleRowIds = isNew
        ? prevState.removedVehicleRowIds
        : [...prevState.removedVehicleRowIds, rowToRemove.Id];
      const updatedUpdatedVehicleRows = prevState.updatedVehicleRows.filter(r => r.Id !== rowToRemove.Id);
      return {
        vehicleRows: updatedVehicleRows,
        newVehicleRows: newVehicleRows,
        updatedVehicleRows: updatedUpdatedVehicleRows,
        removedVehicleRowIds: removedVehicleRowIds
      };
    });
  };

  removeExisting = async (fileId) => {
    try {
      // Find the file to delete
      const fileToDelete = this.state.NoteTempDocsColl.find(item => item.Id === fileId);

      if (!fileToDelete) return;

      // Confirm deletion
      const confirmDelete = window.confirm(`Are you sure you want to delete ${fileToDelete.FileLeafRef}?`);
      if (!confirmDelete) return;

      // Delete file from SharePoint library
      await sp.web.getFileByServerRelativeUrl(fileToDelete.ServerRelativeUrl).recycle(); // or .delete()

      // Remove from local state
      const updatedFiles = this.state.NoteTempDocsColl.filter(item => item.Id !== fileId);
      this.setState({ NoteTempDocsColl: updatedFiles });

      alert("File removed successfully.");
    } catch (error) {
      console.error("Error removing file:", error);
      alert("Failed to remove the file.");
    }
  };
  public render(): React.ReactElement<IVehicleModuleProps> {
    const { existingFiles, NoteTempDocsColl } = this.state;

    //   const {
    //     currentUserGroupArray, currentUserGroup, SanctionApprovalYearOption, SanctionApprovalCurrencyOption, ApproverL2UHName, ApproverGHName, SubGroupOption,
    //     showInterHead, InterGrpHeadObj, SACommitteeNameMasterObj, SanctionCommitteeMembers, globalFilteredMembers, MDUserObj, DMDUserObj, SanctionApprovalItemColl, FinancialYearId,
    //     showLoader, ForInfoUserName, SADiscussionDetailsColl, NoteTempDocsColl
    // } = this.state;
    return (

      <div className="mainsection">
        <h1>Edit Form</h1>
        <h4> <b> A). Service Particulars</b></h4>
         <div className='card'>
                       <div className="row form-group">
                       <div className="col-sm-2">
                           <Label className="control-Label font-weight-bold">VM Request ID</Label>
                         </div>
                         <div className="col-sm-2">
                           <Label className="control-Label">{this.state.Title}</Label>
                         </div>
             
                         <div className="col-sm-2">
                           <Label className="control-Label font-weight-bold">Employee ID</Label>
                         </div>
                         <div className="col-sm-2">
                           <Label className="control-Label">{this.state.EmployeeCode}</Label>
                         </div>
                         <div className="col-sm-2">
                           <Label className="control-Label font-weight-bold">Employee Name</Label>
                         </div>
                         <div className="col-sm-2">
                           <Label className="control-Label ">{this.state.EmployeeName}</Label>
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
             
                       <div className="row form-group">
                       <div className="col-sm-2">
                           <Label className="control-Label font-weight-bold">Age</Label>
                         </div>
                         <div className="col-sm-2">
                           <Label className="control-Label ">{this.state.Age}</Label>
                         </div>
                       </div>
                       
                     </div>
        <h4><b> B). Salary Particulars</b></h4>
        <div className='card'>
          <div className="row form-group">
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Total Emoluments p.m. (Salary and allowance)<span style={{ color: 'red' }}>*</span>  </Label>
            </div>
            <div className="col-sm-2">
              <TextField type='number'
                value={this.state.ExpenseDetails.TotalEmolumentspm}
                name="ExpenseDetails.TotalEmolumentspm"
                onChanged={(e: any) => this.handleInputChangeadd(event)} />
            </div>
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">25% of the total emoluments </Label>
            </div>
            <div className="col-sm-2">
              <TextField type='number' disabled
                value={this.state.ExpenseDetails.TwentyFiveofthetotalemoluments}
                name="ExpenseDetails.TwentyFiveofthetotalemoluments"
                onChanged={(e: any) => this.handleInputChangeadd(event)} />
            </div>
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Total deductions p.m. viz. Festival Advance, Personal Advance<span style={{ color: 'red' }}>*</span>  </Label>
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
              <Label className="control-Label font-weight-bold">Repayment tenure in EMI (Maximum 120) <span style={{ color: 'red' }}>*</span>  </Label>
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
              <Label className="control-Label font-weight-bold">Type of Vehicle<span style={{ color: 'red' }}>*</span> </Label>
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
              <Label className="control-Label font-weight-bold">Make/ Model <span style={{ color: 'red' }}>*</span>  </Label>
            </div>
            <div className="col-sm-2">
              <TextField
                value={this.state.ExpenseDetails.MakeModel}
                name="ExpenseDetails.MakeModel"
                onChanged={(e: any) => this.handleInputChangeadd(event)} />
            </div>
          </div>
          <div className="row form-group">
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Year of Manufacture<span style={{ color: 'red' }}>*</span>   </Label>
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
              <Label className="control-Label font-weight-bold">Cost of Vehicle<span style={{ color: 'red' }}>*</span>    </Label>
              <span style={{ color: 'red' }} hidden={!(this.state.ConditionOfVehicle == 'New')} > (as per enclosed invoice) </span>
              <span style={{ color: 'red' }} hidden={!(this.state.ConditionOfVehicle == 'Second Hand')}>  (as per enclosed valuation report from a Govt. approved value.) </span>
            </div>
            <div className="col-sm-2">
              { }
              {/* <TextField
                type="number"
                name="ExpenseDetails.CostofVehicle"
                value={this.state.ExpenseDetails.CostofVehicle || 0}
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
        CostofVehicle: numericValue ,//> 1000000 ? 1000000 : numericValue
      }
    }));
  }}
/>
            </div>

            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">
                Cost of Vehicle Attachments 
              </Label>
            </div>

            <div className="col-sm-2">
              <input type="file" multiple onChange={this.onFilesChange} />

              {NoteTempDocsColl.map((item) => (
                <div key={item.Id} style={{ marginTop: '5px', alignItems: 'center' }}>
                  <a
                    href={item.ServerRelativeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginRight: '10px', textDecoration: 'none' }}
                  >
                    {item.FileLeafRef}
                  </a>

                  <span
                    style={{
                      cursor: 'pointer',
                      color: 'red',
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}
                    onClick={() => this.removeExisting(item.Id)}
                    title="Remove"
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>

            {/* <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Cost of Vehicle Attachments<span style={{ color: 'red' }}>*</span>   </Label>
            </div>
                 <div className='col-sm-2'>
                <input type="file" multiple onChange={this.onFilesChange} />

                {
                  NoteTempDocsColl.map((item, index) => (
                      <div key={item.Id}>
                        <a href={item.ServerRelativeUrl} target="_new">
                          {item.FileLeafRef}
                        <DefaultButton onClick={() => this.removeExisting(item.Id)}>Remove</DefaultButton>

                        </a>
                      </div>
                
                  ))
                }
              </div> */}



          </div>
          <div className="row form-group">
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Name and Address of the Seller / Dealer<span style={{ color: 'red' }}>*</span>   </Label>
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
                value={this.state.ExpenseDetails.TotalLoanAmount || 0}

                name="ExpenseDetails.TotalLoanAmount"
                onChanged={(e: any) => this.handleInputChangeadd(event)}></TextField>

            </div>

            <div className="col-sm-2" hidden={!this.state.ExpectlifeShow && !this.state.ExpenseDetails.ExpectedlifeofVehicle}>
              <Label className="control-Label font-weight-bold">Expected life of Vehicle (in case of second hand vehicle)<span style={{ color: 'red' }}>*</span>   </Label>
            </div>
            <div className="col-sm-2" hidden={!this.state.ExpectlifeShow && !this.state.ExpenseDetails.ExpectedlifeofVehicle}>
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
                value={this.state.ExpenseDetails.AmountofLoanavailed}
                name="ExpenseDetails.AmountofLoanavailed"
                onChanged={(e: any) => this.handleInputChangeadd(event)}></TextField>                  </div>
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Date of Availment of Loan   </Label>
            </div>
            <div className="col-sm-2">
              <TextField type='date'
                value={this.state.ExpenseDetails.DateofAvailmentofLoan}
                name="ExpenseDetails.DateofAvailmentofLoan"
                onChanged={(e: any) => this.handleInputChangeadd(event)} />
            </div>
          </div>
          <div className="row form-group">
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Date of final repayment of loan  </Label>
            </div>
            <div className="col-sm-2">
              {/* <TextField type='date'
                value={this.state.ExpenseDetails.Dateoffinalrepaymentofloan}
                name="ExpenseDetails.Dateoffinalrepaymentofloan"
                onChanged={(e: any) => this.handleInputChangeadd(event)} /> */}

<input
                type="date"
                name="ExpenseDetails.Dateoffinalrepaymentofloan"
                value={this.state.ExpenseDetails.Dateoffinalrepaymentofloan || ''}
                min={this.state.ExpenseDetails.DateofAvailmentofLoan || ''}
                onChange={this.handleInputChangeadd}
              />

            </div>
              {/* <div className="col-sm-2">
                          <Label className="control-Label font-weight-bold">Total Loan Amount  </Label>
                        </div>
                        <div className="col-sm-2">
                          <TextField type='number'
                            name="ExpenseDetails.TotalLoanAmount"
                            onChanged={(e: any) => this.handleInputChangeadd(event)}></TextField>                 
                            
                             </div> */}
          </div>
        </div>
        <h4><b>E). Previous Personal Advance History </b> </h4>
        { }
        { }
        {this.state.vehicleRows && this.state.vehicleRows.map((row, index) => (
          <div className="card p-3 mb-3" key={index}>
            <div className="row mb-2">
              { }
              <div className="col-sm-1 d-flex flex-column justify-content-center">
                <Label className="control-label font-weight-bold">Sr No {index + 1}</Label>
                {/* <label className="control-label">{index + 1}</label> */}
              </div>
              { }
              <div className="col-sm-3">
                <Label className="control-label font-weight-bold">Date/Purpose of Withdrawal</Label>
                <TextField
                  multiline
                  value={row.DatePurposeofWithdrawal}
                  onChanged={(val) => this.handleRowChange(index, 'DatePurposeofWithdrawal', val)}
                />
              </div>
              { }
              <div className="col-sm-4">
                <Label className="control-label font-weight-bold">Date of Final Repayment</Label>
                <TextField
                  type="date"
                  value={row.PDatePurposeofWithdrawal}
                  onChanged={(val) => this.handleRowChange(index, 'PDatePurposeofWithdrawal', val)}
                />
                { }
              </div>
              <div className="col-sm-4">
                <Label className="control-label font-weight-bold">Amount</Label>
                <TextField
                  type="number"
                  value={row.PAmount}
                  onChanged={(val) => this.handleRowChange(index, 'PAmount', val)}
                />
              </div>
            </div>
            <div className="row mb-1">
              { }
              <div className="col-sm-1">
                { }
              </div>
              { }
              <div className="col-sm-3">
                <Label className="control-label font-weight-bold">Outstanding Loan Amount as on Date</Label>
                <TextField
                  type="number"
                  value={row.POutstandingLoanasOnDate}
                  onChanged={(val) => this.handleRowChange(index, 'POutstandingLoanasOnDate', val)}
                />
              </div>
              { }
              { }
              <div className="d-flex justify-content-end">
                <IconButton
                  iconProps={{ iconName: 'Add' }}
                  title="Add Row"
                  onClick={this.addRow}
                />
                {this.state.vehicleRows.length > 1 && (
                  <IconButton
                    iconProps={{ iconName: 'Delete' }}
                    title="Remove Row"
                    onClick={() => this.removeRow(index, this.state.vehicleRows)}
                  />
                )}
              </div>
            </div>
            <div className="row">
              { }
            </div>
          </div>
        ))}
        <div className='text-center'>
          { }
          <PrimaryButton type='button'
            onClick={() => this.BtnSubmitRequest('Submitted')}
            disabled={this.state.isSubmitting}
          >
            {this.state.isSubmitting ? <Spinner size={SpinnerSize.small} /> : "Submit"}
          </PrimaryButton>
          <PrimaryButton type='button'
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