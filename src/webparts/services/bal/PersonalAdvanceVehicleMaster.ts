import { IVehicleModuleProps } from '../../vehicleModule/components/IVehicleModuleProps';
import SPCRUDOPS from '../dal/spcrudops';
import { IEmployeeMaster } from "../interface/IEmployeeMaster";
import { IPrevPersonalAdvanceHistory } from '../interface/IPrevPersonalAdvanceHistory';
import { IVehicleRequest } from "../interface/IVehicleRequest";

export interface PersonalAdvanceVehicleMasterOps {
    getAllPersonalAdvanceVehicle(props: IVehicleModuleProps): Promise<IVehicleRequest>;
    getAllPrevPersonalAdvanceHistory(props: IVehicleModuleProps): Promise<IPrevPersonalAdvanceHistory>;



    getUserDashboard(props: IVehicleModuleProps): Promise<IVehicleRequest>;
    getUserApprovedDashboard(props: IVehicleModuleProps): Promise<IVehicleRequest>;
    getUserRejectedDashboard(props: IVehicleModuleProps): Promise<IVehicleRequest>;


    getHR1Dashboard(props: IVehicleModuleProps): Promise<IVehicleRequest>;
    getHR1ApprovedDashboard(props: IVehicleModuleProps): Promise<IVehicleRequest>;
    getHR1RejectedDashboard(props: IVehicleModuleProps): Promise<IVehicleRequest>;

    getHR2Dashboard(props: IVehicleModuleProps): Promise<IVehicleRequest>;
    getHR2ApprovedDashboard(props: IVehicleModuleProps): Promise<IVehicleRequest>;
    getHR2RejectedDashboard(props: IVehicleModuleProps): Promise<IVehicleRequest>;


    getGroupHeadDashboard(props: IVehicleModuleProps): Promise<IVehicleRequest>;
    getGroupHeadApprovedDashboard(props: IVehicleModuleProps): Promise<IVehicleRequest>;
    getGroupHeadRejectedDashboard(props: IVehicleModuleProps): Promise<IVehicleRequest>;


    getAllEmployeeMaster(props: IVehicleModuleProps): Promise<IEmployeeMaster>;
    getEmployeeMaster(props: IVehicleModuleProps): Promise<IEmployeeMaster>;
    getEmployeeMasterId(strFilter: string, sorting: any, props: IVehicleModuleProps): Promise<IEmployeeMaster[]>;
}
export default function EmployeeOps() {
    const spCrudOps = SPCRUDOPS();
    const getEmployeeMaster = async (props: IVehicleModuleProps): Promise<IEmployeeMaster | any> => {
        try {
            const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
            const encodedLoginName = encodeURIComponent(currentUser.LoginName);
            // const EmployeeType="CONTRACTUAL";
            const results = await (await spCrudOps).getDataAnotherSiteCollection(
                "EmployeeMaster",
                "*, Title, AccountNo, IFSCCode, LeaveLevel1/Title, LeaveLevel2/Title,Scale/Title,Payscale/Title, EmployeeType/Title,LeaveLevel2/Name, Designation/Title, Grade/Grade, CurrentOfficeLocation/Title, SubGroup/ShortName, SubGroup/GroupName, SubGroup/Id, CashApprover/Title, NEFTApprover/Title, UserName/Name",
                "LeaveLevel1, LeaveLevel2, Designation, Grade,Scale,Payscale,EmployeeType, CurrentOfficeLocation, SubGroup, CashApprover, NEFTApprover, UserName",
                `UserName/Name eq '${currentUser.LoginName}'`,
                { column: "Id", isAscending: false },
                props
            );
            if (results && results.length > 0) {
                const firstResult = results[0];
                const employee: IEmployeeMaster = {
                    Id: firstResult.Id || '',
                    DateOfJoining: firstResult.DateOfJoining || null,
                    Age: firstResult.Age || 0,
                    Limit: "",
                    Title: firstResult.Title || '',
                    EmployeeTitle: firstResult.Title || '',
                    EmployeeName: firstResult.EmployeeName || '',
                    EmployeeId: firstResult.Title || '',
                    DateOfConfirmation: firstResult.DateOfConfirmation
                        ? `${new Date(firstResult.DateOfConfirmation).getDate()}-${new Date(firstResult.DOB).getMonth() + 1}-${new Date(firstResult.DateOfConfirmation).getFullYear()}`
                        : null,
                    FirstName: firstResult.FirstName || '',
                    MiddleName: firstResult.MiddleName || '',
                    LastName: firstResult.LastName || '',
                    UserName: firstResult.UserName || '',
                    CompanyEmail: firstResult.CompanyEmail || '',
                    Gender: firstResult.Gender || '',
                    OfficeLocation: firstResult.OfficeLocation || '',
                    CurrentOfficeLocation: firstResult.CurrentOfficeLocation.Title || '',
                    CurrentOfficeLocationId: firstResult.CurrentOfficeLocationId || '',
                    SubGroup: firstResult.CurrentOfficeLocation || '',
                    SubGroupId: firstResult.SubGroupId || 0,
                    Unit: firstResult.Unit || '',
                    EmployeeType: firstResult.EmployeeType || '',
                    Scale: firstResult.Scale.Title || '',
                    Payscale: firstResult.Payscale.Title || '',
                    Grade: firstResult.Grade || '',
                    GradeId: firstResult.GradeId || '',
                    Designation: firstResult.Designation,
                    DesignationTitle: firstResult.Designation.Title,
                    DesignationId: firstResult.DesignationId,
                    // DateofBirth:firstResult.TempDOB,
                    DateofBirth: firstResult.DOB
                        ? `${new Date(firstResult.DOB).getDate()}-${new Date(firstResult.DOB).getMonth() + 1}-${new Date(firstResult.DOB).getFullYear()}`
                        : null,
                    //DateofBirth: results.TempDOB ? new Date(results.TempDOB) : null,
                    LoginUserDesignation: firstResult.LoginUserDesignation || '',
                    // Payscale: firstResult.Payscale,
                    ReportingManager: firstResult.ReportingManager || '',
                    AlternateReportingManager: firstResult.AlternateReportingManager || '',
                    Active: firstResult.Active,
                    Phone_x0020_No: firstResult.Phone_x0020_No || '',
                    MobileNo_x002e_: firstResult.MobileNo_x002e_ || '',
                    AlternateEmail: firstResult.AlternateEmail || '',
                    LeaveLevel1: firstResult.LeaveLevel1 || '',
                    LeaveLevel2: firstResult.LeaveLevel2 || '',
                    LeaveLevel2Id: firstResult.LeaveLevel2Id || '',
                    LeaveLevel2val: firstResult.LeaveLevel2val || '',
                    Role: firstResult.Role || '',
                    BranchName: firstResult.BranchName || '',
                    HHApproverName: firstResult.HHApproverName || '',
                    LTCDate: firstResult.LTCDate,
                    TempDOB: firstResult.TempDOB || null,
                    EmpType: firstResult.EmpType,
                    AccountNo: firstResult.AccountNo || 0,
                    IFSCCode: firstResult.IFSCCode || 0,
                    map: function (arg0: (item: any) => { key: any; text: any; }): unknown {
                        throw new Error('Function not implemented.');
                    },
                    employee2: undefined,
                    employee1: undefined
                };
                return employee;
            } else {
                console.warn("No employee found for the current user.");
                return null;
            }
        } catch (error) {
            console.error("Error in getEmployeeMaster:", error);
            return null;
        }
    };



    // const getAllPersonalAdvanceVehicle = async (props: IVehicleModuleProps): Promise<IVehicleRequest | null> => {
    //         try {
    //             const results = await (await spCrudOps).getDataAnotherSiteCollection(
    //                 "PersonalAdvanceVehicle",
    //                 //  "*",
    //                 "*,",
    //                 "",
    //                 // "",
    //                 "",
    //                 { column: "Id", isAscending: false },
    //                 props
    //             );
    //             if (results && results.length > 0) {
    //                 const firstResult = results;
    //                 // const employee: IEmployeeCHSLimitMaster = {
    //                 //     Id: firstResult.Id,
    //                 //     Title: firstResult.Title,
    //                 //     Limit: firstResult.Limit,
    //                 //     EmployeeType: firstResult.EmployeeType,
    //                 //     Sacle: firstResult.Sacle.Title,
    //                 //     Designation: firstResult.Designation.Title
    //                 //  };
    //                 return firstResult;
    //             } else {
    //                 console.warn("No employee found for the current user.");
    //                 return null;
    //             }
    //         } catch (error) {
    //             console.error("Error in getEmployeeMaster:", error);
    //             return null;
    //         }
    //     };

    const getAllPersonalAdvanceVehicle = async (props: IVehicleModuleProps): Promise<IPrevPersonalAdvanceHistory | any> => {
        // const emplinfo2 = await getEmployeeMaster(props);
        // let status = "Rejected";
        // const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
        return await (await spCrudOps).getData("PersonalAdvanceVehicle"
            , "*,Author/Name"
            , "Author"
            // , `EmployeeID eq '${emplinfo.Title}' and Status eq '${status}'`
            // , `Status eq '${status}' and Author/Name eq '${currentUser.LoginName}' and EmployeeID eq '${emplinfo.Title}'`
            , ""
            , { column: 'Id', isAscending: false }, props).then(UserPending => {
                let brr: Array<IVehicleRequest> = new Array<IVehicleRequest>();
                UserPending.sort((a, b) => b.Id - a.Id).map(item => {
                    brr.push({
                        ID: item.Id,
                         DateOfConfirmation: item.DateOfConfirmation,

                        IsConfirm	:item.IsConfirm,
                        TotalMarks:item.TotalMarks,
                        IsEmiLessThan50: item.IsEmiLessThan50,
                        VehicleLoanEMI:item.VehicleLoanEMI,
                        EligibleLoanAmount: item.EligibleLoanAmount,
                        ApplicationCorrect: item.ApplicationCorrect,
                        DisciplinaryProceedings:item.DisciplinaryProceedings,
                        SanctionAmount		: item.SanctionAmount,


                        HR1Response: item.HR1Response || '',
                        HR1Remark: item.HR1Remark || '',
                        HR2Response: item.HR2Response || '',
                        HR2Remark: item.HR2Remark || '',
                        GHResponse: item.GHResponse || '',
                        GHRemark: item.GHRemark || '',


                        SanctionAmountDate: item.SanctionAmountDate || null,
                        Created: item.Created,
                        Title: item.Title,
                        EmployeeID: item.EmployeeID,
                        EmployeeName: item.EmployeeName,
                        Status: item.Status,
                        EmployeeType: item.EmployeeType,
                        Designation: item.Designation,
                        Age: item.Age,
                        EmployeeCode: item.EmployeeCode,
                        DateOfJoining: item.DateOfJoining,
                        ResidenceAddress: item.ResidenceAddress,
                        TotalEmoluments: item.TotalEmoluments,
                        Emoluments25: item.Emoluments25,
                        TotalDeductions: item.TotalDeductions,
                        NetEmoluments50: item.NetEmoluments50,
                        EmiTenure: item.EmiTenure,
                        VehicleType: item.VehicleType,
                        VehicleCondition: item.VehicleCondition,
                        MakeModel: item.MakeModel,
                        ManufactureYear: item.ManufactureYear,
                        CostOfVehicle: item.CostOfVehicle,
                        ExpectedLife: item.ExpectedLife,
                        SellerDetails: item.SellerDetails,
                        PrevVehicleLoanType: item.PrevVehicleLoanType,
                        PrevLoanAmount: item.PrevLoanAmount,
                        PrevLoanDate: item.PrevLoanDate,
                        PrevLoanRepaymentDate: item.PrevLoanRepaymentDate,
                        ConfirmedDate: item.ConfirmedDate,
                       
                        EmiRepaymentAmount: item.EmiRepaymentAmount,
                        VehicleLoanCost: item.VehicleLoanCost,
                       
                        WithdrawalDetails: item.WithdrawalDetails,
                        WithdrawalAmount: item.WithdrawalAmount,
                        OutstandingLoan: item.OutstandingLoan,
                        FinalRepaymentDate: item.FinalRepaymentDate,
                        AmountofLoanAvailed: item.AmountofLoanAvailed,
                        DateofLoanAvailed: item.DateofLoanAvailed,
                    });
                });
                return brr;
            });
    };


    const getAllPrevPersonalAdvanceHistory = async (props: IVehicleModuleProps): Promise<IPrevPersonalAdvanceHistory[]> => {
        // const emplinfo2 = await getEmployeeMaster(props);
        // let status = "Rejected";
        // const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
        return await (await spCrudOps).getData("PrevPersonalAdvanceHistory"
            , "*,Author/Name,PersonalAdvanceVehicleId/Id"
            , "Author,PersonalAdvanceVehicleId"
            // , `EmployeeID eq '${emplinfo.Title}' and Status eq '${status}'`
            // , `Status eq '${status}' and Author/Name eq '${currentUser.LoginName}' and EmployeeID eq '${emplinfo.Title}'`
            , ""
            , { column: 'Id', isAscending: false }, props).then(UserPending => {
                let brr: Array<IPrevPersonalAdvanceHistory> = new Array<IPrevPersonalAdvanceHistory>();
                UserPending.sort((a, b) => b.Id - a.Id).map(item => {
                    brr.push({
                        ID: item.Id,
                        Created: item.Created,
                        Title: item.Title,
                        WithdrawalDetails: item.WithdrawalDetails,
                        WithdrawalAmount: item.WithdrawalAmount,
                        OutstandingLoan: item.OutstandingLoan,
                        FinalRepaymentDate: item.FinalRepaymentDate,
                        PersonalAdvanceVehicleId: item.PersonalAdvanceVehicleId,
                        ExpectedLife: item.ExpectedLife

                    });
                });
                return brr;
            });
    };

    // initiator Dashboard


    const getUserDashboard = async (props: IVehicleModuleProps): Promise<IVehicleRequest | any> => {
        const emplinfo = await getEmployeeMaster(props);
        const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
        let status = "Pending";
        let status1 = "Draft";

        return await (await spCrudOps).getData("PersonalAdvanceVehicle"
            , "*,Attachments,AttachmentFiles,Author/Name"
            , "AttachmentFiles,Author"
            // , `EmployeeID eq '${emplinfo.Title}' and Status eq '${status}'`
            // , `Status eq '${status}' and Author/Name eq '${currentUser.LoginName}'`
            // , `Author/Name eq '${currentUser.LoginName}' and EmployeeID eq '${emplinfo.Title}'`
            , `Status eq '${status}' or Status eq '${status1}'  and EmployeeCode eq '${emplinfo.Title}'`
            , { column: 'Id', isAscending: false }, props).then(UserPending => {
                let brr: Array<IVehicleRequest> = new Array<IVehicleRequest>();
                UserPending.sort((a, b) => b.Id - a.Id).map(item => {
                    brr.push({
                        ID: item.Id,
                        DateOfConfirmation: item.DateOfConfirmation,

                        IsConfirm	:item.IsConfirm,
                        TotalMarks:item.TotalMarks,
                        IsEmiLessThan50: item.IsEmiLessThan50,
                        VehicleLoanEMI:item.VehicleLoanEMI,
                        EligibleLoanAmount: item.EligibleLoanAmount,
                        ApplicationCorrect: item.ApplicationCorrect,
                        DisciplinaryProceedings:item.DisciplinaryProceedings,
                        SanctionAmount		: item.SanctionAmount,


                        HR1Response: item.HR1Response || '',
                        HR1Remark: item.HR1Remark || '',
                        HR2Response: item.HR2Response || '',
                        HR2Remark: item.HR2Remark || '',
                        GHResponse: item.GHResponse || '',
                        GHRemark: item.GHRemark || '',

                        SanctionAmountDate: item.SanctionAmountDate || null,

                        Created: item.Created,
                        Title: item.Title,
                        EmployeeID: item.EmployeeID,
                        EmployeeName: item.EmployeeName,
                        Status: item.Status,
                        EmployeeType: item.EmployeeType,
                        Designation: item.Designation,
                        Age: item.Age,
                        EmployeeCode: item.EmployeeCode,
                        DateOfJoining: item.DateOfJoining,
                        ResidenceAddress: item.ResidenceAddress,
                        TotalEmoluments: item.TotalEmoluments,
                        Emoluments25: item.Emoluments25,
                        TotalDeductions: item.TotalDeductions,
                        NetEmoluments50: item.NetEmoluments50,
                        EmiTenure: item.EmiTenure,
                        VehicleType: item.VehicleType,
                        VehicleCondition: item.VehicleCondition,
                        MakeModel: item.MakeModel,
                        ManufactureYear: item.ManufactureYear,
                        CostOfVehicle: item.CostOfVehicle,
                        ExpectedLife: item.ExpectedLife,
                        SellerDetails: item.SellerDetails,
                        PrevVehicleLoanType: item.PrevVehicleLoanType,
                        PrevLoanAmount: item.PrevLoanAmount,
                        PrevLoanDate: item.PrevLoanDate,
                        PrevLoanRepaymentDate: item.PrevLoanRepaymentDate,
                        ConfirmedDate: item.ConfirmedDate,
                       
                        EmiRepaymentAmount: item.EmiRepaymentAmount,
                        VehicleLoanCost: item.VehicleLoanCost,
                       
                        WithdrawalDetails: item.WithdrawalDetails,
                        WithdrawalAmount: item.WithdrawalAmount,
                        OutstandingLoan: item.OutstandingLoan,
                        FinalRepaymentDate: item.FinalRepaymentDate,
                        AmountofLoanAvailed: item.AmountofLoanAvailed,
                        DateofLoanAvailed: item.DateofLoanAvailed,
                    });
                });
                return brr;
            });
    };
    const getUserApprovedDashboard = async (props: IVehicleModuleProps): Promise<IVehicleRequest | any> => {
        const emplinfo1 = await getEmployeeMaster(props);
        let status = "Approved";
        const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
        return await (await spCrudOps).getData("PersonalAdvanceVehicle"
            , "*,Attachments,AttachmentFiles,Author/Name,HR2ApproverName/Name,GHApproverName/Name,HR1ApproverName/Name"
            , "AttachmentFiles,Author,HR2ApproverName,HR1ApproverName,GHApproverName"
            // , `EmployeeID eq '${emplinfo.Title}' and Status eq '${status}'`
            // , `Status eq '${status}' and Author/Name eq '${currentUser.LoginName}' and EmployeeID eq '${emplinfo.Title}'`
            , `Status eq '${status}' and EmployeeCode eq '${emplinfo1.Title}'`
            , { column: 'Id', isAscending: false }, props).then(UserPending => {
                let brr: Array<IVehicleRequest> = new Array<IVehicleRequest>();
                UserPending.sort((a, b) => b.Id - a.Id).map(item => {
                    brr.push({
                        ID: item.Id,
                         DateOfConfirmation: item.DateOfConfirmation,

                        IsConfirm	:item.IsConfirm,
                        TotalMarks:item.TotalMarks,
                        IsEmiLessThan50: item.IsEmiLessThan50,
                        VehicleLoanEMI:item.VehicleLoanEMI,
                        EligibleLoanAmount: item.EligibleLoanAmount,
                        ApplicationCorrect: item.ApplicationCorrect,
                        DisciplinaryProceedings:item.DisciplinaryProceedings,
                        SanctionAmount		: item.SanctionAmount,


                        HR1Response: item.HR1Response || '',
                        HR1Remark: item.HR1Remark || '',
                        HR2Response: item.HR2Response || '',
                        HR2Remark: item.HR2Remark || '',
                        GHResponse: item.GHResponse || '',
                        GHRemark: item.GHRemark || '',

                        SanctionAmountDate: item.SanctionAmountDate || null,

                        Created: item.Created,
                        Title: item.Title,
                        EmployeeID: item.EmployeeID,
                        EmployeeName: item.EmployeeName,
                        Status: item.Status,
                        EmployeeType: item.EmployeeType,
                        Designation: item.Designation,
                        Age: item.Age,
                        EmployeeCode: item.EmployeeCode,
                        DateOfJoining: item.DateOfJoining,
                        ResidenceAddress: item.ResidenceAddress,
                        TotalEmoluments: item.TotalEmoluments,
                        Emoluments25: item.Emoluments25,
                        TotalDeductions: item.TotalDeductions,
                        NetEmoluments50: item.NetEmoluments50,
                        EmiTenure: item.EmiTenure,
                        VehicleType: item.VehicleType,
                        VehicleCondition: item.VehicleCondition,
                        MakeModel: item.MakeModel,
                        ManufactureYear: item.ManufactureYear,
                        CostOfVehicle: item.CostOfVehicle,
                        ExpectedLife: item.ExpectedLife,
                        SellerDetails: item.SellerDetails,
                        PrevVehicleLoanType: item.PrevVehicleLoanType,
                        PrevLoanAmount: item.PrevLoanAmount,
                        PrevLoanDate: item.PrevLoanDate,
                        PrevLoanRepaymentDate: item.PrevLoanRepaymentDate,
                        ConfirmedDate: item.ConfirmedDate,
                       
                        EmiRepaymentAmount: item.EmiRepaymentAmount,
                        VehicleLoanCost: item.VehicleLoanCost,
                       
                        WithdrawalDetails: item.WithdrawalDetails,
                        WithdrawalAmount: item.WithdrawalAmount,
                        OutstandingLoan: item.OutstandingLoan,
                        FinalRepaymentDate: item.FinalRepaymentDate,
                        AmountofLoanAvailed: item.AmountofLoanAvailed,
                        DateofLoanAvailed: item.DateofLoanAvailed,
                    });
                });
                return brr;
            });
    };
    const getUserRejectedDashboard = async (props: IVehicleModuleProps): Promise<IVehicleRequest | any> => {
        const emplinfo2 = await getEmployeeMaster(props);
        let status = "Rejected";
        const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
        return await (await spCrudOps).getData("PersonalAdvanceVehicle"
            , "*,Attachments,AttachmentFiles,Author/Name,HR2ApproverName/Name,GHApproverName/Name,HR1ApproverName/Name"
            , "AttachmentFiles,Author,HR2ApproverName,HR1ApproverName,GHApproverName"
            // , `EmployeeID eq '${emplinfo.Title}' and Status eq '${status}'`
            // , `Status eq '${status}' and Author/Name eq '${currentUser.LoginName}' and EmployeeID eq '${emplinfo.Title}'`
            , `Status eq '${status}' and EmployeeCode eq '${emplinfo2.Title}'`
            , { column: 'Id', isAscending: false }, props).then(UserPending => {
                let brr: Array<IVehicleRequest> = new Array<IVehicleRequest>();
                UserPending.sort((a, b) => b.Id - a.Id).map(item => {
                    brr.push({
                        ID: item.Id,
                         DateOfConfirmation: item.DateOfConfirmation,

                        IsConfirm	:item.IsConfirm,
                        TotalMarks:item.TotalMarks,
                        IsEmiLessThan50: item.IsEmiLessThan50,
                        VehicleLoanEMI:item.VehicleLoanEMI,
                        EligibleLoanAmount: item.EligibleLoanAmount,
                        ApplicationCorrect: item.ApplicationCorrect,
                        DisciplinaryProceedings:item.DisciplinaryProceedings,
                        SanctionAmount		: item.SanctionAmount,


                        HR1Response: item.HR1Response || '',
                        HR1Remark: item.HR1Remark || '',
                        HR2Response: item.HR2Response || '',
                        HR2Remark: item.HR2Remark || '',
                        GHResponse: item.GHResponse || '',
                        GHRemark: item.GHRemark || '',

                        SanctionAmountDate: item.SanctionAmountDate || null,

                        Created: item.Created,
                        Title: item.Title,
                        EmployeeID: item.EmployeeID,
                        EmployeeName: item.EmployeeName,
                        Status: item.Status,
                        EmployeeType: item.EmployeeType,
                        Designation: item.Designation,
                        Age: item.Age,
                        EmployeeCode: item.EmployeeCode,
                        DateOfJoining: item.DateOfJoining,
                        ResidenceAddress: item.ResidenceAddress,
                        TotalEmoluments: item.TotalEmoluments,
                        Emoluments25: item.Emoluments25,
                        TotalDeductions: item.TotalDeductions,
                        NetEmoluments50: item.NetEmoluments50,
                        EmiTenure: item.EmiTenure,
                        VehicleType: item.VehicleType,
                        VehicleCondition: item.VehicleCondition,
                        MakeModel: item.MakeModel,
                        ManufactureYear: item.ManufactureYear,
                        CostOfVehicle: item.CostOfVehicle,
                        ExpectedLife: item.ExpectedLife,
                        SellerDetails: item.SellerDetails,
                        PrevVehicleLoanType: item.PrevVehicleLoanType,
                        PrevLoanAmount: item.PrevLoanAmount,
                        PrevLoanDate: item.PrevLoanDate,
                        PrevLoanRepaymentDate: item.PrevLoanRepaymentDate,
                        ConfirmedDate: item.ConfirmedDate,
                       
                        EmiRepaymentAmount: item.EmiRepaymentAmount,
                        VehicleLoanCost: item.VehicleLoanCost,
                       
                        WithdrawalDetails: item.WithdrawalDetails,
                        WithdrawalAmount: item.WithdrawalAmount,
                        OutstandingLoan: item.OutstandingLoan,
                        FinalRepaymentDate: item.FinalRepaymentDate,
                        AmountofLoanAvailed: item.AmountofLoanAvailed,
                        DateofLoanAvailed: item.DateofLoanAvailed,
                    });
                });
                return brr;
            });
    };


    // hr 1 dashboard

    const getHR1Dashboard = async (props: IVehicleModuleProps): Promise<IVehicleRequest | any> => {
        const emplinfo = await getEmployeeMaster(props);
        const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
        let HR1Status = "Pending with HR1";
        let FinalStatus = "Pending";

        // let status1 = "Draft";

        return await (await spCrudOps).getData("PersonalAdvanceVehicle"
            , "*,Attachments,AttachmentFiles,Author/Name,HR2ApproverName/Name,GHApproverName/Name,HR1ApproverName/Name"
            , "AttachmentFiles,Author,HR2ApproverName,HR1ApproverName,GHApproverName"
            // , `EmployeeID eq '${emplinfo.Title}' and Status eq '${status}'`
            , `HR1Response eq '${HR1Status}' and Status eq '${FinalStatus}' and HR2ApproverName/Name ne '${currentUser.LoginName}' and GHApproverName/Name ne '${currentUser.LoginName}'`
            , { column: 'Id', isAscending: false }, props).then(UserPending => {
                let brr: Array<IVehicleRequest> = new Array<IVehicleRequest>();
                UserPending.sort((a, b) => b.Id - a.Id).map(item => {
                    brr.push({
                        ID: item.Id,
                         DateOfConfirmation: item.DateOfConfirmation,

                        IsConfirm	:item.IsConfirm,
                        TotalMarks:item.TotalMarks,
                        IsEmiLessThan50: item.IsEmiLessThan50,
                        VehicleLoanEMI:item.VehicleLoanEMI,
                        EligibleLoanAmount: item.EligibleLoanAmount,
                        ApplicationCorrect: item.ApplicationCorrect,
                        DisciplinaryProceedings:item.DisciplinaryProceedings,
                        SanctionAmount		: item.SanctionAmount,


                        HR1Response: item.HR1Response || '',
                        HR1Remark: item.HR1Remark || '',
                        HR2Response: item.HR2Response || '',
                        HR2Remark: item.HR2Remark || '',
                        GHResponse: item.GHResponse || '',
                        GHRemark: item.GHRemark || '',

                        SanctionAmountDate: item.SanctionAmountDate || null,

                        Created: item.Created,
                        Title: item.Title,
                        EmployeeID: item.EmployeeID,
                        EmployeeName: item.EmployeeName,
                        Status: item.Status,
                        EmployeeType: item.EmployeeType,
                        Designation: item.Designation,
                        Age: item.Age,
                        EmployeeCode: item.EmployeeCode,
                        DateOfJoining: item.DateOfJoining,
                        ResidenceAddress: item.ResidenceAddress,
                        TotalEmoluments: item.TotalEmoluments,
                        Emoluments25: item.Emoluments25,
                        TotalDeductions: item.TotalDeductions,
                        NetEmoluments50: item.NetEmoluments50,
                        EmiTenure: item.EmiTenure,
                        VehicleType: item.VehicleType,
                        VehicleCondition: item.VehicleCondition,
                        MakeModel: item.MakeModel,
                        ManufactureYear: item.ManufactureYear,
                        CostOfVehicle: item.CostOfVehicle,
                        ExpectedLife: item.ExpectedLife,
                        SellerDetails: item.SellerDetails,
                        PrevVehicleLoanType: item.PrevVehicleLoanType,
                        PrevLoanAmount: item.PrevLoanAmount,
                        PrevLoanDate: item.PrevLoanDate,
                        PrevLoanRepaymentDate: item.PrevLoanRepaymentDate,
                        ConfirmedDate: item.ConfirmedDate,
                       
                        EmiRepaymentAmount: item.EmiRepaymentAmount,
                        VehicleLoanCost: item.VehicleLoanCost,
                       
                        WithdrawalDetails: item.WithdrawalDetails,
                        WithdrawalAmount: item.WithdrawalAmount,
                        OutstandingLoan: item.OutstandingLoan,
                        FinalRepaymentDate: item.FinalRepaymentDate,
                        AmountofLoanAvailed: item.AmountofLoanAvailed,
                        DateofLoanAvailed: item.DateofLoanAvailed,
                    });
                });
                return brr;
            });
    };
    const getHR1ApprovedDashboard = async (props: IVehicleModuleProps): Promise<IVehicleRequest | any> => {
        const emplinfo1 = await getEmployeeMaster(props);
        let status = "Approved by HR1";
        let FinalStatus = "Approved"
        let Rejected = "Rejected"
        const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
        return await (await spCrudOps).getData("PersonalAdvanceVehicle"
            , "*,Attachments,AttachmentFiles,Author/Name,HR2ApproverName/Name,GHApproverName/Name,HR1ApproverName/Name"
            , "AttachmentFiles,Author,HR2ApproverName,HR1ApproverName,GHApproverName"
            , `HR1Response eq '${status}' and (Status eq '${FinalStatus}' or Status ne '${Rejected}')`
            , { column: 'Id', isAscending: false }, props).then(UserPending => {
                let brr: Array<IVehicleRequest> = new Array<IVehicleRequest>();
                UserPending.sort((a, b) => b.Id - a.Id).map(item => {
                    brr.push({
                        ID: item.Id,
                         DateOfConfirmation: item.DateOfConfirmation,

                        IsConfirm	:item.IsConfirm,
                        TotalMarks:item.TotalMarks,
                        IsEmiLessThan50: item.IsEmiLessThan50,
                        VehicleLoanEMI:item.VehicleLoanEMI,
                        EligibleLoanAmount: item.EligibleLoanAmount,
                        ApplicationCorrect: item.ApplicationCorrect,
                        DisciplinaryProceedings:item.DisciplinaryProceedings,
                        SanctionAmount		: item.SanctionAmount,


                        HR1Response: item.HR1Response || '',
                        HR1Remark: item.HR1Remark || '',
                        HR2Response: item.HR2Response || '',
                        HR2Remark: item.HR2Remark || '',
                        GHResponse: item.GHResponse || '',
                        GHRemark: item.GHRemark || '',

                        SanctionAmountDate: item.SanctionAmountDate || null,

                        Created: item.Created,
                        Title: item.Title,
                        EmployeeID: item.EmployeeID,
                        EmployeeName: item.EmployeeName,
                        Status: item.Status,
                        EmployeeType: item.EmployeeType,
                        Designation: item.Designation,
                        Age: item.Age,
                        EmployeeCode: item.EmployeeCode,
                        DateOfJoining: item.DateOfJoining,
                        ResidenceAddress: item.ResidenceAddress,
                        TotalEmoluments: item.TotalEmoluments,
                        Emoluments25: item.Emoluments25,
                        TotalDeductions: item.TotalDeductions,
                        NetEmoluments50: item.NetEmoluments50,
                        EmiTenure: item.EmiTenure,
                        VehicleType: item.VehicleType,
                        VehicleCondition: item.VehicleCondition,
                        MakeModel: item.MakeModel,
                        ManufactureYear: item.ManufactureYear,
                        CostOfVehicle: item.CostOfVehicle,
                        ExpectedLife: item.ExpectedLife,
                        SellerDetails: item.SellerDetails,
                        PrevVehicleLoanType: item.PrevVehicleLoanType,
                        PrevLoanAmount: item.PrevLoanAmount,
                        PrevLoanDate: item.PrevLoanDate,
                        PrevLoanRepaymentDate: item.PrevLoanRepaymentDate,
                        ConfirmedDate: item.ConfirmedDate,
                       
                        EmiRepaymentAmount: item.EmiRepaymentAmount,
                        VehicleLoanCost: item.VehicleLoanCost,
                       
                        WithdrawalDetails: item.WithdrawalDetails,
                        WithdrawalAmount: item.WithdrawalAmount,
                        OutstandingLoan: item.OutstandingLoan,
                        FinalRepaymentDate: item.FinalRepaymentDate,
                        AmountofLoanAvailed: item.AmountofLoanAvailed,
                        DateofLoanAvailed: item.DateofLoanAvailed,
                    });
                });
                return brr;
            });
    };
    const getHR1RejectedDashboard = async (props: IVehicleModuleProps): Promise<IVehicleRequest | any> => {
        const emplinfo2 = await getEmployeeMaster(props);
        let status = "Rejected";
        const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
        return await (await spCrudOps).getData("PersonalAdvanceVehicle"
            , "*,Attachments,AttachmentFiles,HR2ApproverName/Name,GHApproverName/Name"
            , "AttachmentFiles,HR2ApproverName,GHApproverName"
            // , `EmployeeID eq '${emplinfo.Title}' and Status eq '${status}'`
            , `Status eq '${status}' and  HR2ApproverName/Name ne '${currentUser.LoginName}' and  GHApproverName/Name ne '${currentUser.LoginName}' `
            , { column: 'Id', isAscending: false }, props).then(UserPending => {
                let brr: Array<IVehicleRequest> = new Array<IVehicleRequest>();
                UserPending.sort((a, b) => b.Id - a.Id).map(item => {
                    brr.push({
                        ID: item.Id,
                         DateOfConfirmation: item.DateOfConfirmation,

                        IsConfirm	:item.IsConfirm,
                        TotalMarks:item.TotalMarks,
                        IsEmiLessThan50: item.IsEmiLessThan50,
                        VehicleLoanEMI:item.VehicleLoanEMI,
                        EligibleLoanAmount: item.EligibleLoanAmount,
                        ApplicationCorrect: item.ApplicationCorrect,
                        DisciplinaryProceedings:item.DisciplinaryProceedings,
                        SanctionAmount		: item.SanctionAmount,


                        HR1Response: item.HR1Response || '',
                        HR1Remark: item.HR1Remark || '',
                        HR2Response: item.HR2Response || '',
                        HR2Remark: item.HR2Remark || '',
                        GHResponse: item.GHResponse || '',
                        GHRemark: item.GHRemark || '',

                        SanctionAmountDate: item.SanctionAmountDate || null,

                        Created: item.Created,
                        Title: item.Title,
                        EmployeeID: item.EmployeeID,
                        EmployeeName: item.EmployeeName,
                        Status: item.Status,
                        EmployeeType: item.EmployeeType,
                        Designation: item.Designation,
                        Age: item.Age,
                        EmployeeCode: item.EmployeeCode,
                        DateOfJoining: item.DateOfJoining,
                        ResidenceAddress: item.ResidenceAddress,
                        TotalEmoluments: item.TotalEmoluments,
                        Emoluments25: item.Emoluments25,
                        TotalDeductions: item.TotalDeductions,
                        NetEmoluments50: item.NetEmoluments50,
                        EmiTenure: item.EmiTenure,
                        VehicleType: item.VehicleType,
                        VehicleCondition: item.VehicleCondition,
                        MakeModel: item.MakeModel,
                        ManufactureYear: item.ManufactureYear,
                        CostOfVehicle: item.CostOfVehicle,
                        ExpectedLife: item.ExpectedLife,
                        SellerDetails: item.SellerDetails,
                        PrevVehicleLoanType: item.PrevVehicleLoanType,
                        PrevLoanAmount: item.PrevLoanAmount,
                        PrevLoanDate: item.PrevLoanDate,
                        PrevLoanRepaymentDate: item.PrevLoanRepaymentDate,
                        ConfirmedDate: item.ConfirmedDate,
                       
                        EmiRepaymentAmount: item.EmiRepaymentAmount,
                        VehicleLoanCost: item.VehicleLoanCost,
                       
                        WithdrawalDetails: item.WithdrawalDetails,
                        WithdrawalAmount: item.WithdrawalAmount,
                        OutstandingLoan: item.OutstandingLoan,
                        FinalRepaymentDate: item.FinalRepaymentDate,
                        AmountofLoanAvailed: item.AmountofLoanAvailed,
                        DateofLoanAvailed: item.DateofLoanAvailed,
                    });
                });
                return brr;
            });
    };


    // hr 2 dashboard

    const getHR2Dashboard = async (props: IVehicleModuleProps): Promise<IVehicleRequest | any> => {
        const emplinfo = await getEmployeeMaster(props);
        const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
        let HR2Status = "Pending with HR2";
        let HR1Status = "Approved by HR1";
        let FinalStatus = "Pending";

        return await (await spCrudOps).getData("PersonalAdvanceVehicle"
            , "*,Attachments,AttachmentFiles,Author/Name,HR2ApproverName/Name,GHApproverName/Name,HR1ApproverName/Name"
            , "AttachmentFiles,Author,HR2ApproverName,HR1ApproverName,GHApproverName"
            // , `EmployeeID eq '${emplinfo.Title}' and Status eq '${status}'`
            // , `HR2Response eq '${status}'`
            , `HR2Response eq '${HR2Status}' and HR1Response eq '${HR1Status}' and Status eq '${FinalStatus}' and HR1ApproverName/Name ne  '${currentUser.LoginName}' and GHApproverName/Name ne  '${currentUser.LoginName}' `
            , { column: 'Id', isAscending: false }, props).then(UserPending => {
                let brr: Array<IVehicleRequest> = new Array<IVehicleRequest>();
                UserPending.sort((a, b) => b.Id - a.Id).map(item => {
                    brr.push({
                        ID: item.Id,
                         DateOfConfirmation: item.DateOfConfirmation,

                        IsConfirm	:item.IsConfirm,
                        TotalMarks:item.TotalMarks,
                        IsEmiLessThan50: item.IsEmiLessThan50,
                        VehicleLoanEMI:item.VehicleLoanEMI,
                        EligibleLoanAmount: item.EligibleLoanAmount,
                        ApplicationCorrect: item.ApplicationCorrect,
                        DisciplinaryProceedings:item.DisciplinaryProceedings,
                        SanctionAmount		: item.SanctionAmount,


                        HR1Response: item.HR1Response || '',
                        HR1Remark: item.HR1Remark || '',
                        HR2Response: item.HR2Response || '',
                        HR2Remark: item.HR2Remark || '',
                        GHResponse: item.GHResponse || '',
                        GHRemark: item.GHRemark || '',

                        SanctionAmountDate: item.SanctionAmountDate || null,

                        Created: item.Created,
                        Title: item.Title,
                        EmployeeID: item.EmployeeID,
                        EmployeeName: item.EmployeeName,
                        Status: item.Status,
                        EmployeeType: item.EmployeeType,
                        Designation: item.Designation,
                        Age: item.Age,
                        EmployeeCode: item.EmployeeCode,
                        DateOfJoining: item.DateOfJoining,
                        ResidenceAddress: item.ResidenceAddress,
                        TotalEmoluments: item.TotalEmoluments,
                        Emoluments25: item.Emoluments25,
                        TotalDeductions: item.TotalDeductions,
                        NetEmoluments50: item.NetEmoluments50,
                        EmiTenure: item.EmiTenure,
                        VehicleType: item.VehicleType,
                        VehicleCondition: item.VehicleCondition,
                        MakeModel: item.MakeModel,
                        ManufactureYear: item.ManufactureYear,
                        CostOfVehicle: item.CostOfVehicle,
                        ExpectedLife: item.ExpectedLife,
                        SellerDetails: item.SellerDetails,
                        PrevVehicleLoanType: item.PrevVehicleLoanType,
                        PrevLoanAmount: item.PrevLoanAmount,
                        PrevLoanDate: item.PrevLoanDate,
                        PrevLoanRepaymentDate: item.PrevLoanRepaymentDate,
                        ConfirmedDate: item.ConfirmedDate,
                       
                        EmiRepaymentAmount: item.EmiRepaymentAmount,
                        VehicleLoanCost: item.VehicleLoanCost,
                       
                        WithdrawalDetails: item.WithdrawalDetails,
                        WithdrawalAmount: item.WithdrawalAmount,
                        OutstandingLoan: item.OutstandingLoan,
                        FinalRepaymentDate: item.FinalRepaymentDate,
                        AmountofLoanAvailed: item.AmountofLoanAvailed,
                        DateofLoanAvailed: item.DateofLoanAvailed,
                    });
                });
                return brr;
            });
    };
    const getHR2ApprovedDashboard = async (props: IVehicleModuleProps): Promise<IVehicleRequest | any> => {
        const emplinfo1 = await getEmployeeMaster(props);
        let status = "Approved by HR2";
        let FinalStatus = "Approved";
        let Rejected = "Rejected";
        let GHstatus = "Pending with Group Head"
        const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
        return await (await spCrudOps).getData("PersonalAdvanceVehicle"
            , "*,Attachments,AttachmentFiles,Author/Name,HR2ApproverName/Name,GHApproverName/Name,HR1ApproverName/Name"
            , "AttachmentFiles,Author,HR2ApproverName,HR1ApproverName,GHApproverName"
            , `HR1Response eq '${status}'and GHResponse eq '${GHstatus}' or (Status eq '${FinalStatus}' or Status ne '${Rejected}')`
            , { column: 'Id', isAscending: false }, props).then(UserPending => {
                let brr: Array<IVehicleRequest> = new Array<IVehicleRequest>();
                UserPending.sort((a, b) => b.Id - a.Id).map(item => {
                    brr.push({
                        ID: item.Id,
                         DateOfConfirmation: item.DateOfConfirmation,

                        IsConfirm	:item.IsConfirm,
                        TotalMarks:item.TotalMarks,
                        IsEmiLessThan50: item.IsEmiLessThan50,
                        VehicleLoanEMI:item.VehicleLoanEMI,
                        EligibleLoanAmount: item.EligibleLoanAmount,
                        ApplicationCorrect: item.ApplicationCorrect,
                        DisciplinaryProceedings:item.DisciplinaryProceedings,
                        SanctionAmount		: item.SanctionAmount,


                        HR1Response: item.HR1Response || '',
                        HR1Remark: item.HR1Remark || '',
                        HR2Response: item.HR2Response || '',
                        HR2Remark: item.HR2Remark || '',
                        GHResponse: item.GHResponse || '',
                        GHRemark: item.GHRemark || '',

                        SanctionAmountDate: item.SanctionAmountDate || null,

                        Created: item.Created,
                        Title: item.Title,
                        EmployeeID: item.EmployeeID,
                        EmployeeName: item.EmployeeName,
                        Status: item.Status,
                        EmployeeType: item.EmployeeType,
                        Designation: item.Designation,
                        Age: item.Age,
                        EmployeeCode: item.EmployeeCode,
                        DateOfJoining: item.DateOfJoining,
                        ResidenceAddress: item.ResidenceAddress,
                        TotalEmoluments: item.TotalEmoluments,
                        Emoluments25: item.Emoluments25,
                        TotalDeductions: item.TotalDeductions,
                        NetEmoluments50: item.NetEmoluments50,
                        EmiTenure: item.EmiTenure,
                        VehicleType: item.VehicleType,
                        VehicleCondition: item.VehicleCondition,
                        MakeModel: item.MakeModel,
                        ManufactureYear: item.ManufactureYear,
                        CostOfVehicle: item.CostOfVehicle,
                        ExpectedLife: item.ExpectedLife,
                        SellerDetails: item.SellerDetails,
                        PrevVehicleLoanType: item.PrevVehicleLoanType,
                        PrevLoanAmount: item.PrevLoanAmount,
                        PrevLoanDate: item.PrevLoanDate,
                        PrevLoanRepaymentDate: item.PrevLoanRepaymentDate,
                        ConfirmedDate: item.ConfirmedDate,
                       
                        EmiRepaymentAmount: item.EmiRepaymentAmount,
                        VehicleLoanCost: item.VehicleLoanCost,
                       
                        WithdrawalDetails: item.WithdrawalDetails,
                        WithdrawalAmount: item.WithdrawalAmount,
                        OutstandingLoan: item.OutstandingLoan,
                        FinalRepaymentDate: item.FinalRepaymentDate,
                        AmountofLoanAvailed: item.AmountofLoanAvailed,
                        DateofLoanAvailed: item.DateofLoanAvailed,
                    });
                });
                return brr;
            });
    };
    const getHR2RejectedDashboard = async (props: IVehicleModuleProps): Promise<IVehicleRequest | any> => {
        const emplinfo2 = await getEmployeeMaster(props);
        let status = "Rejected";
        const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
        return await (await spCrudOps).getData("PersonalAdvanceVehicle"
            , "*,Attachments,AttachmentFiles,Author/Name,HR2ApproverName/Name,GHApproverName/Name,HR1ApproverName/Name"
            , "AttachmentFiles,Author,HR2ApproverName,HR1ApproverName,GHApproverName"
            // , `EmployeeID eq '${emplinfo.Title}' and Status eq '${status}'`
            // , `Status eq '${status}' and Author/Name eq '${currentUser.LoginName}' and EmployeeID eq '${emplinfo.Title}'`
            , `Status eq '${status}' and EmployeeCode eq '${emplinfo2.Title}'`
            , { column: 'Id', isAscending: false }, props).then(UserPending => {
                let brr: Array<IVehicleRequest> = new Array<IVehicleRequest>();
                UserPending.sort((a, b) => b.Id - a.Id).map(item => {
                    brr.push({
                        ID: item.Id,
                         DateOfConfirmation: item.DateOfConfirmation,

                        IsConfirm	:item.IsConfirm,
                        TotalMarks:item.TotalMarks,
                        IsEmiLessThan50: item.IsEmiLessThan50,
                        VehicleLoanEMI:item.VehicleLoanEMI,
                        EligibleLoanAmount: item.EligibleLoanAmount,
                        ApplicationCorrect: item.ApplicationCorrect,
                        DisciplinaryProceedings:item.DisciplinaryProceedings,
                        SanctionAmount		: item.SanctionAmount,


                        HR1Response: item.HR1Response || '',
                        HR1Remark: item.HR1Remark || '',
                        HR2Response: item.HR2Response || '',
                        HR2Remark: item.HR2Remark || '',
                        GHResponse: item.GHResponse || '',
                        GHRemark: item.GHRemark || '',

                        SanctionAmountDate: item.SanctionAmountDate || null,

                        Created: item.Created,
                        Title: item.Title,
                        EmployeeID: item.EmployeeID,
                        EmployeeName: item.EmployeeName,
                        Status: item.Status,
                        EmployeeType: item.EmployeeType,
                        Designation: item.Designation,
                        Age: item.Age,
                        EmployeeCode: item.EmployeeCode,
                        DateOfJoining: item.DateOfJoining,
                        ResidenceAddress: item.ResidenceAddress,
                        TotalEmoluments: item.TotalEmoluments,
                        Emoluments25: item.Emoluments25,
                        TotalDeductions: item.TotalDeductions,
                        NetEmoluments50: item.NetEmoluments50,
                        EmiTenure: item.EmiTenure,
                        VehicleType: item.VehicleType,
                        VehicleCondition: item.VehicleCondition,
                        MakeModel: item.MakeModel,
                        ManufactureYear: item.ManufactureYear,
                        CostOfVehicle: item.CostOfVehicle,
                        ExpectedLife: item.ExpectedLife,
                        SellerDetails: item.SellerDetails,
                        PrevVehicleLoanType: item.PrevVehicleLoanType,
                        PrevLoanAmount: item.PrevLoanAmount,
                        PrevLoanDate: item.PrevLoanDate,
                        PrevLoanRepaymentDate: item.PrevLoanRepaymentDate,
                        ConfirmedDate: item.ConfirmedDate,
                       
                        EmiRepaymentAmount: item.EmiRepaymentAmount,
                        VehicleLoanCost: item.VehicleLoanCost,
                       
                        WithdrawalDetails: item.WithdrawalDetails,
                        WithdrawalAmount: item.WithdrawalAmount,
                        OutstandingLoan: item.OutstandingLoan,
                        FinalRepaymentDate: item.FinalRepaymentDate,
                        AmountofLoanAvailed: item.AmountofLoanAvailed,
                        DateofLoanAvailed: item.DateofLoanAvailed,
                    });
                });
                return brr;
            });
    };


    // group head dashboard

    const getGroupHeadDashboard = async (props: IVehicleModuleProps): Promise<IVehicleRequest | any> => {
        const emplinfo = await getEmployeeMaster(props);
        const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
        let HR2Status = "Approved by HR2";
        let HR1Status = "Approved by HR1";
        let GHStatus = "Pending with Group Head";

        let FinalStatus = "Pending";

        return await (await spCrudOps).getData("PersonalAdvanceVehicle"
            , "*,Attachments,AttachmentFiles,Author/Name,HR2ApproverName/Name,GHApproverName/Name,HR1ApproverName/Name"
            , "AttachmentFiles,Author,HR2ApproverName,HR1ApproverName,GHApproverName"
            // , `EmployeeID eq '${emplinfo.Title}' and Status eq '${status}'`
            // , `HR2Response eq '${status}'`
            , `HR2Response eq '${HR2Status}' and GHResponse eq '${GHStatus}'  and HR1Response eq '${HR1Status}' and Status eq '${FinalStatus}' and HR1ApproverName/Name ne  '${currentUser.LoginName}' and HR2ApproverName/Name ne  '${currentUser.LoginName}' `
            , { column: 'Id', isAscending: false }, props).then(UserPending => {
                let brr: Array<IVehicleRequest> = new Array<IVehicleRequest>();
                UserPending.sort((a, b) => b.Id - a.Id).map(item => {
                    brr.push({
                        ID: item.Id,
                        Created: item.Created,
                        Title: item.Title,
                        EmployeeID: item.EmployeeID,
                        EmployeeName: item.EmployeeName,
                        Status: item.Status,
                        EmployeeType: item.EmployeeType,
                        Designation: item.Designation,
                        Age: item.Age,
                        EmployeeCode: item.EmployeeCode,
                        DateOfJoining: item.DateOfJoining,
                        ResidenceAddress: item.ResidenceAddress,
                        TotalEmoluments: item.TotalEmoluments,
                        Emoluments25: item.Emoluments25,
                        TotalDeductions: item.TotalDeductions,
                        NetEmoluments50: item.NetEmoluments50,
                        EmiTenure: item.EmiTenure,
                        VehicleType: item.VehicleType,
                        VehicleCondition: item.VehicleCondition,
                        MakeModel: item.MakeModel,
                        ManufactureYear: item.ManufactureYear,
                        CostOfVehicle: item.CostOfVehicle,
                        ExpectedLife: item.ExpectedLife,
                        SellerDetails: item.SellerDetails,
                        PrevVehicleLoanType: item.PrevVehicleLoanType,
                        PrevLoanAmount: item.PrevLoanAmount,
                        PrevLoanDate: item.PrevLoanDate,
                        PrevLoanRepaymentDate: item.PrevLoanRepaymentDate,
                        ConfirmedDate: item.ConfirmedDate,
                       
                        EmiRepaymentAmount: item.EmiRepaymentAmount,
                        VehicleLoanCost: item.VehicleLoanCost,
                       
                        WithdrawalDetails: item.WithdrawalDetails,
                        WithdrawalAmount: item.WithdrawalAmount,
                        OutstandingLoan: item.OutstandingLoan,
                        FinalRepaymentDate: item.FinalRepaymentDate,
                        AmountofLoanAvailed: item.AmountofLoanAvailed,
                        DateofLoanAvailed: item.DateofLoanAvailed,
                         DateOfConfirmation: item.DateOfConfirmation,

                        IsConfirm	:item.IsConfirm,
                        TotalMarks:item.TotalMarks,
                        IsEmiLessThan50: item.IsEmiLessThan50,
                        VehicleLoanEMI:item.VehicleLoanEMI,
                        EligibleLoanAmount: item.EligibleLoanAmount,
                        ApplicationCorrect: item.ApplicationCorrect,
                        DisciplinaryProceedings:item.DisciplinaryProceedings,
                        SanctionAmount		: item.SanctionAmount,


                        HR1Response: item.HR1Response || '',
                        HR1Remark: item.HR1Remark || '',
                        HR2Response: item.HR2Response || '',
                        HR2Remark: item.HR2Remark || '',
                        GHResponse: item.GHResponse || '',
                        GHRemark: item.GHRemark || '',

                        SanctionAmountDate: item.SanctionAmountDate || null,

                    });
                });
                return brr;
            });
    };
    const getGroupHeadApprovedDashboard = async (props: IVehicleModuleProps): Promise<IVehicleRequest | any> => {
        const emplinfo1 = await getEmployeeMaster(props);
        let status = "Approved";
        const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
        return await (await spCrudOps).getData("PersonalAdvanceVehicle"
            , "*,Attachments,AttachmentFiles,Author/Name,HR2ApproverName/Name,GHApproverName/Name,HR1ApproverName/Name"
            , "AttachmentFiles,Author,HR2ApproverName,HR1ApproverName,GHApproverName"
            // , `EmployeeID eq '${emplinfo.Title}' and Status eq '${status}'`
            // , `Status eq '${status}' and Author/Name eq '${currentUser.LoginName}' and EmployeeID eq '${emplinfo.Title}'`
            , `Status eq '${status}'`
            , { column: 'Id', isAscending: false }, props).then(UserPending => {
                let brr: Array<IVehicleRequest> = new Array<IVehicleRequest>();
                UserPending.sort((a, b) => b.Id - a.Id).map(item => {
                    brr.push({
                        ID: item.Id,
                         DateOfConfirmation: item.DateOfConfirmation,

                        IsConfirm	:item.IsConfirm,
                        TotalMarks:item.TotalMarks,
                        IsEmiLessThan50: item.IsEmiLessThan50,
                        VehicleLoanEMI:item.VehicleLoanEMI,
                        EligibleLoanAmount: item.EligibleLoanAmount,
                        ApplicationCorrect: item.ApplicationCorrect,
                        DisciplinaryProceedings:item.DisciplinaryProceedings,
                        SanctionAmount		: item.SanctionAmount,


                        HR1Response: item.HR1Response || '',
                        HR1Remark: item.HR1Remark || '',
                        HR2Response: item.HR2Response || '',
                        HR2Remark: item.HR2Remark || '',
                        GHResponse: item.GHResponse || '',
                        GHRemark: item.GHRemark || '',

                        SanctionAmountDate: item.SanctionAmountDate || null,

                        Created: item.Created,
                        Title: item.Title,
                        EmployeeID: item.EmployeeID,
                        EmployeeName: item.EmployeeName,
                        Status: item.Status,
                        EmployeeType: item.EmployeeType,
                        Designation: item.Designation,
                        Age: item.Age,
                        EmployeeCode: item.EmployeeCode,
                        DateOfJoining: item.DateOfJoining,
                        ResidenceAddress: item.ResidenceAddress,
                        TotalEmoluments: item.TotalEmoluments,
                        Emoluments25: item.Emoluments25,
                        TotalDeductions: item.TotalDeductions,
                        NetEmoluments50: item.NetEmoluments50,
                        EmiTenure: item.EmiTenure,
                        VehicleType: item.VehicleType,
                        VehicleCondition: item.VehicleCondition,
                        MakeModel: item.MakeModel,
                        ManufactureYear: item.ManufactureYear,
                        CostOfVehicle: item.CostOfVehicle,
                        ExpectedLife: item.ExpectedLife,
                        SellerDetails: item.SellerDetails,
                        PrevVehicleLoanType: item.PrevVehicleLoanType,
                        PrevLoanAmount: item.PrevLoanAmount,
                        PrevLoanDate: item.PrevLoanDate,
                        PrevLoanRepaymentDate: item.PrevLoanRepaymentDate,
                        ConfirmedDate: item.ConfirmedDate,
                       
                        EmiRepaymentAmount: item.EmiRepaymentAmount,
                        VehicleLoanCost: item.VehicleLoanCost,
                       
                        WithdrawalDetails: item.WithdrawalDetails,
                        WithdrawalAmount: item.WithdrawalAmount,
                        OutstandingLoan: item.OutstandingLoan,
                        FinalRepaymentDate: item.FinalRepaymentDate,
                        AmountofLoanAvailed: item.AmountofLoanAvailed,
                        DateofLoanAvailed: item.DateofLoanAvailed,
                    });
                });
                return brr;
            });
    };
    const getGroupHeadRejectedDashboard = async (props: IVehicleModuleProps): Promise<IVehicleRequest | any> => {
        const emplinfo2 = await getEmployeeMaster(props);
        let status = "Rejected";
        const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
        return await (await spCrudOps).getData("PersonalAdvanceVehicle"
            , "*,Attachments,AttachmentFiles,Author/Name,HR2ApproverName/Name,GHApproverName/Name,HR1ApproverName/Name"
            , "AttachmentFiles,Author,HR2ApproverName,HR1ApproverName,GHApproverName"
            // , `EmployeeID eq '${emplinfo.Title}' and Status eq '${status}'`
            // , `Status eq '${status}' and Author/Name eq '${currentUser.LoginName}' and EmployeeID eq '${emplinfo.Title}'`
            , `Status eq '${status}' and EmployeeCode eq '${emplinfo2.Title}'`
            , { column: 'Id', isAscending: false }, props).then(UserPending => {
                let brr: Array<IVehicleRequest> = new Array<IVehicleRequest>();
                UserPending.sort((a, b) => b.Id - a.Id).map(item => {
                    brr.push({
                        ID: item.Id,
                         DateOfConfirmation: item.DateOfConfirmation,

                        IsConfirm	:item.IsConfirm,
                        TotalMarks:item.TotalMarks,
                        IsEmiLessThan50: item.IsEmiLessThan50,
                        VehicleLoanEMI:item.VehicleLoanEMI,
                        EligibleLoanAmount: item.EligibleLoanAmount,
                        ApplicationCorrect: item.ApplicationCorrect,
                        DisciplinaryProceedings:item.DisciplinaryProceedings,
                        SanctionAmount		: item.SanctionAmount,


                        HR1Response: item.HR1Response || '',
                        HR1Remark: item.HR1Remark || '',
                        HR2Response: item.HR2Response || '',
                        HR2Remark: item.HR2Remark || '',
                        GHResponse: item.GHResponse || '',
                        GHRemark: item.GHRemark || '',

                        SanctionAmountDate: item.SanctionAmountDate || null,

                        Created: item.Created,
                        Title: item.Title,
                        EmployeeID: item.EmployeeID,
                        EmployeeName: item.EmployeeName,
                        Status: item.Status,
                        EmployeeType: item.EmployeeType,
                        Designation: item.Designation,
                        Age: item.Age,
                        EmployeeCode: item.EmployeeCode,
                        DateOfJoining: item.DateOfJoining,
                        ResidenceAddress: item.ResidenceAddress,
                        TotalEmoluments: item.TotalEmoluments,
                        Emoluments25: item.Emoluments25,
                        TotalDeductions: item.TotalDeductions,
                        NetEmoluments50: item.NetEmoluments50,
                        EmiTenure: item.EmiTenure,
                        VehicleType: item.VehicleType,
                        VehicleCondition: item.VehicleCondition,
                        MakeModel: item.MakeModel,
                        ManufactureYear: item.ManufactureYear,
                        CostOfVehicle: item.CostOfVehicle,
                        ExpectedLife: item.ExpectedLife,
                        SellerDetails: item.SellerDetails,
                        PrevVehicleLoanType: item.PrevVehicleLoanType,
                        PrevLoanAmount: item.PrevLoanAmount,
                        PrevLoanDate: item.PrevLoanDate,
                        PrevLoanRepaymentDate: item.PrevLoanRepaymentDate,
                        ConfirmedDate: item.ConfirmedDate,
                       
                        EmiRepaymentAmount: item.EmiRepaymentAmount,
                        VehicleLoanCost: item.VehicleLoanCost,
                       
                        WithdrawalDetails: item.WithdrawalDetails,
                        WithdrawalAmount: item.WithdrawalAmount,
                        OutstandingLoan: item.OutstandingLoan,
                        FinalRepaymentDate: item.FinalRepaymentDate,
                        AmountofLoanAvailed: item.AmountofLoanAvailed,
                        DateofLoanAvailed: item.DateofLoanAvailed,
                    });
                });
                return brr;
            });
    };

    return {
        getAllPersonalAdvanceVehicle,
        getAllPrevPersonalAdvanceHistory,
        getEmployeeMaster,
        getUserDashboard,
        getUserApprovedDashboard,
        getUserRejectedDashboard,

        getHR1Dashboard,
        getHR1ApprovedDashboard,
        getHR1RejectedDashboard,

        getHR2Dashboard,
        getHR2ApprovedDashboard,
        getHR2RejectedDashboard,


        getGroupHeadDashboard,
        getGroupHeadApprovedDashboard,
        getGroupHeadRejectedDashboard,



    };
}