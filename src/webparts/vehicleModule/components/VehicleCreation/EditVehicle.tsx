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
      yearOfManufacture: '',
      yearOfManufacture1: '',
      isSubmitting: false,
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
  async componentDidMount() {
    let hashUrl = window.location.hash;
    let hashUrlSplit = hashUrl.split('/');
    let VMId = hashUrlSplit[2];
    this.setState({ VMId: VMId });
    await this.getAllPersonalAdvanceVehicle();
    await this.getAllPrevPersonalAdvanceHistory();
    await this.getCurrentUser();
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
  public getAllPersonalAdvanceVehicle = async (): Promise<IVehicleRequest | any> => {
    return await PersonalAdvanceVehicleMasterOps().getAllPersonalAdvanceVehicle(this.props).then(async (results) => {
      let employeeData = results;
      var currentEmpResult = employeeData.filter((item) => {
        return item.ID == +this.state.VMId;
      })
      if (currentEmpResult && currentEmpResult.length > 0) {
        this.setState({
          EmployeeInfodb: currentEmpResult,
          AllEmployeeCollObj: [],
          EmployeeName: currentEmpResult[0].EmployeeName,
          DateOfJoining: currentEmpResult[0].DateOfJoining ? new Date(currentEmpResult[0].DateOfJoining) : null,
          CurrentOfficeLocation: currentEmpResult[0].ResidenceAddress,
          EmployeeCode: '' + currentEmpResult[0].EmployeeCode,
          DesignationTitle: currentEmpResult[0].Designation,
          Age: (currentEmpResult[0].Age),
          ExpenseDetails: {
            TotalEmolumentspm: +currentEmpResult[0].TotalEmoluments,
            TwentyFiveofthetotalemoluments: +currentEmpResult[0].Emoluments25,
            Totaldeductions: +currentEmpResult[0].TotalDeductions,
            FityofNetemoluments: +currentEmpResult[0].NetEmoluments50,
            RepaymenttenureinEMI: currentEmpResult[0].EmiTenure,
            MakeModel: currentEmpResult[0].MakeModel,
            CostofVehicle: currentEmpResult[0].CostOfVehicle,
            NameandAddressoftheSeller: currentEmpResult[0].SellerDetails,
            AmountofLoanavailed: currentEmpResult[0].PrevLoanAmount ? +currentEmpResult[0].PrevLoanAmount : 0,
            DateofAvailmentofLoan: currentEmpResult[0].PrevLoanRepaymentDate ? new Date(currentEmpResult[0].PrevLoanRepaymentDate).toISOString().split('T')[0] : '',
            Dateoffinalrepaymentofloan: currentEmpResult[0].PrevLoanDate ? new Date(currentEmpResult[0].PrevLoanDate).toISOString().split('T')[0] : '',
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
  public handleInputChangeadd = (e) => {
    const { name, value } = e.target;
    const parsed = parseFloat(value);
    !isNaN(parsed) && isFinite(value) ? parsed : value;
    const numericValue = (value)
    let updatedExpenseDetails = {
      ...this.state.ExpenseDetails,
      [name.split('.')[1]]: numericValue
    };
    if (name == "ExpenseDetails.TotalEmolumentspm") {
      updatedExpenseDetails.TwentyFiveofthetotalemoluments = numericValue * 0.25;
    }
    const totalEmoluments = name == "ExpenseDetails.TotalEmolumentspm"
      ? numericValue
      : this.state.ExpenseDetails.TotalEmolumentspm || 0;
    const totalDeductions = name == "ExpenseDetails.Totaldeductions"
      ? numericValue
      : this.state.ExpenseDetails.Totaldeductions || 0;
    updatedExpenseDetails.FityofNetemoluments = (totalEmoluments - totalDeductions) * 0.5;
    this.setState({ ExpenseDetails: updatedExpenseDetails });
  };
  public BtnSaveAsDraft = async (SubmittionType) => {
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
        Id: RequestNoGenerate,
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
      const RequestNoGenerate = this.state.VMId;
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
  public BtnSubmitRequest = async (SubmittionType) => {
    const { ExpenseDetails, typeOfVehicle, ConditionOfVehicle, yearOfManufacture1, ExpectlifeShow } = this.state;
    const showAlert = (message) => {
      swal("Validation Error", message, "warning");
    };
    const isEmpty = (val) => val == '' || val == null || val == undefined || val == 0;
    if (isEmpty(ExpenseDetails.TotalEmolumentspm)) return showAlert('Please Fill Total Emoluments p.m. (Salary and allowance)');
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
        Status: "Pending",
        HR1Response: 'Pending with HR1',
        HR2Response: 'Pending with HR2',
        GHResponse: 'Pending with Group Head',
        DateOfJoining: this.state.DateOfJoining ? new Date(this.state.DateOfJoining) : null,
        ResidenceAddress: this.state.CurrentOfficeLocation,
        Designation: this.state.DesignationTitle,
        TotalEmoluments: +ExpenseDetails.TotalEmolumentspm,
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
      const newRows = this.state.vehicleRows.filter(row => row.isNew);
      const existingRows = this.state.vehicleRows.filter(row => !row.isNew && row.Id);
      if (existingRows.length > 0) {
        await this.UpdatePrevPersonalAdvanceHistory("PrevPersonalAdvanceHistory", RequestNoGenerate, existingRows);
      }
      if (newRows.length > 0) {
        await this.InsertPrevPersonalAdvanceHistory("PrevPersonalAdvanceHistory", RequestNoGenerate, newRows);
      }
      if (existingRows.length > 0 || newRows.length > 0) {
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
  public render(): React.ReactElement<IVehicleModuleProps> {
    return (
      <div >
        <h1>Edit Form</h1>
        <h4> <b> A). Service Particulars</b></h4>
        <div className='card'>
          <div className="row form-group">
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
              <Label className="control-Label font-weight-bold">Total Emoluments p.m. (Salary and allowance)<span style={{color:'red'}}>*</span>  </Label>
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
              <Label className="control-Label font-weight-bold">Total deductions p.m. viz. Festival Advance, Personal Advance<span style={{color:'red'}}>*</span>  </Label>
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
              <Label className="control-Label font-weight-bold">Repayment tenure in EMI (Maximum 120) <span style={{color:'red'}}>*</span>  </Label>
            </div>
            <div className="col-sm-2">
              <TextField type='number'
                value={this.state.ExpenseDetails.RepaymenttenureinEMI}
                name="ExpenseDetails.RepaymenttenureinEMI"
                onChanged={(e: any) => this.handleInputChangeadd(event)} />
            </div>
          </div>
        </div>
        <h4><b>C). Particulars of Vehicle </b></h4>
        <div className='card'>
          <div className="row form-group">
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Type of Vehicle<span style={{color:'red'}}>*</span> </Label>
            </div>
            <div className="col-sm-2">
              <Dropdown placeHolder="Select vehicle type" options={vehicleOptions}
                selectedKey={this.state.typeOfVehicle}
                onChanged={this.handleTypeOfVehicleChange}
              />
            </div>
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Whether new or second hand <span style={{color:'red'}}>*</span> </Label>
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
              <Label className="control-Label font-weight-bold">Make/ Model <span style={{color:'red'}}>*</span>  </Label>
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
              <Label className="control-Label font-weight-bold">Year of Manufacture<span style={{color:'red'}}>*</span>   </Label>
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
                            <Label className="control-Label font-weight-bold">Cost of Vehicle<span style={{color:'red'}}>*</span>    </Label>
              <span style={{color:'red'}} hidden={!(this.state.ConditionOfVehicle=='New')} > (as per enclosed invoice) </span>
                <span  style={{color:'red'}} hidden={!(this.state.ConditionOfVehicle=='Second Hand')}>  (as per enclosed valuation report from a Govt. approved value.) </span>
            </div>
            <div className="col-sm-2">
              { }
              <TextField
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
              />
            </div>
          </div>
          <div className="row form-group">
            <div className="col-sm-2">
              <Label className="control-Label font-weight-bold">Name and Address of the Seller / Dealer<span style={{color:'red'}}>*</span>   </Label>
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
            <div className="col-sm-2" hidden={!this.state.ExpectlifeShow && !this.state.ExpenseDetails.ExpectedlifeofVehicle}>
              <Label className="control-Label font-weight-bold">Expected life of Vehicle (in case of second hand vehicle)<span style={{color:'red'}}>*</span>   </Label>
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
              <TextField type='date'
                value={this.state.ExpenseDetails.Dateoffinalrepaymentofloan}
                name="ExpenseDetails.Dateoffinalrepaymentofloan"
                onChanged={(e: any) => this.handleInputChangeadd(event)} />  </div>
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
                <Label className="control-label font-weight-bold">Sr No</Label>
                <label className="control-label">{index + 1}</label>
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