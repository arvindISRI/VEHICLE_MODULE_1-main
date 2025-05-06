import { IVehicleModuleProps } from '../../../webparts/vehicleModule/components/IVehicleModuleProps';
import SPCRUDOPS from '../../services/dal/spcrudops';
import { IEmployeeMaster } from "../interface/IEmployeeMaster";
import { ICHSRequest } from "../interface/ICHSRequest";
export interface IEmployeeMasterOps {
    getUserDashboard(props: IVehicleModuleProps): Promise<ICHSRequest>;
    getUserApprovedDashboard(props: IVehicleModuleProps): Promise<ICHSRequest>;
    getUserRejectedDashboard(props: IVehicleModuleProps): Promise<ICHSRequest>;
    HR2getApproveDashboard(props: IVehicleModuleProps): Promise<ICHSRequest>;
    HR2getApproveApprovedDashboard(props: IVehicleModuleProps): Promise<ICHSRequest>;
    HR2getApproveRejectedDashboard(props: IVehicleModuleProps): Promise<ICHSRequest>;
    HR1getApproveDashboard(props: IVehicleModuleProps): Promise<ICHSRequest>;
    HR1getApproveApprovedDashboard(props: IVehicleModuleProps): Promise<ICHSRequest>;
    HR1getApproveRejectedDashboard(props: IVehicleModuleProps): Promise<ICHSRequest>;
    getAllEmployeeMaster(props: IVehicleModuleProps): Promise<IEmployeeMaster>;
    getEmployeeMaster(props: IVehicleModuleProps): Promise<IEmployeeMaster>;
    getEmployeeMasterId(strFilter: string, sorting: any, props: IVehicleModuleProps): Promise<IEmployeeMaster[]>;
}
export default function EmployeeOps() {
    const spCrudOps = SPCRUDOPS();
    const getEmployeeMaster = async (props: IVehicleModuleProps): Promise<IEmployeeMaster | null> => {
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
                    Id: firstResult.Id,
                    DateOfJoining:firstResult.DateOfJoining,
                    Age:firstResult.Age,
                    Limit:"",
                    Title: firstResult.Title,
                    EmployeeTitle: firstResult.Title,
                    EmployeeName: firstResult.EmployeeName,
                    EmployeeId: firstResult.Title,
                    FirstName: firstResult.FirstName,
                    MiddleName: firstResult.MiddleName,
                    LastName: firstResult.LastName,
                    UserName: firstResult.UserName,
                    CompanyEmail:firstResult.CompanyEmail,
                    Gender: firstResult.Gender,
                    OfficeLocation: firstResult.OfficeLocation,
                    CurrentOfficeLocation: firstResult.CurrentOfficeLocation.Title,
                    CurrentOfficeLocationId: firstResult.CurrentOfficeLocationId,
                    SubGroup: firstResult.CurrentOfficeLocation,
                    SubGroupId: firstResult.SubGroupId,
                    Unit: firstResult.Unit,
                    EmployeeType: firstResult.EmployeeType,
                    Scale: firstResult.Scale.Title,
                    Payscale: firstResult.Payscale.Title,
                    Grade: firstResult.Grade,
                    GradeId: firstResult.GradeId,
                    Designation: firstResult.Designation,
                    DesignationTitle: firstResult.Designation.Title,
                    DesignationId: firstResult.DesignationId,
                    // DateofBirth:firstResult.TempDOB,
                    DateofBirth: firstResult.DOB
                        ? `${new Date(firstResult.DOB).getDate()}-${new Date(firstResult.DOB).getMonth() + 1}-${new Date(firstResult.DOB).getFullYear()}`
                        : null,
                    //DateofBirth: results.TempDOB ? new Date(results.TempDOB) : null,
                    LoginUserDesignation: firstResult.LoginUserDesignation,
                    // Payscale: firstResult.Payscale,
                    ReportingManager: firstResult.ReportingManager,
                    AlternateReportingManager: firstResult.AlternateReportingManager,
                    Active: firstResult.Active,
                    Phone_x0020_No: firstResult.Phone_x0020_No,
                    MobileNo_x002e_: firstResult.MobileNo_x002e_,
                    AlternateEmail: firstResult.AlternateEmail,
                    LeaveLevel1: firstResult.LeaveLevel1,
                    LeaveLevel2: firstResult.LeaveLevel2,
                    LeaveLevel2Id: firstResult.LeaveLevel2Id,
                    LeaveLevel2val: firstResult.LeaveLevel2val,
                    Role: firstResult.Role,
                    BranchName: firstResult.BranchName,
                    HHApproverName: firstResult.HHApproverName,
                    LTCDate: firstResult.LTCDate,
                    TempDOB: firstResult.TempDOB,
                    EmpType: firstResult.EmpType,
                    AccountNo: firstResult.AccountNo,
                    IFSCCode: firstResult.IFSCCode,
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
    const getAllEmployeeMaster = async (props: IVehicleModuleProps): Promise<IEmployeeMaster | null> => {

        const EmployeeType="RETIRED";


        try {
            const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
            const encodedLoginName = encodeURIComponent(currentUser.LoginName);
            const results = await (await spCrudOps).getDataAnotherSiteCollection(
                "EmployeeMaster",
                "*, Title, AccountNo, IFSCCode, LeaveLevel1/Title,EmployeeType/Title, LeaveLevel2/Title, Scale/Title,Payscale/Title,LeaveLevel2/Name, Designation/Title, Grade/Grade, CurrentOfficeLocation/Title, SubGroup/ShortName, SubGroup/GroupName, SubGroup/Id, CashApprover/Title, NEFTApprover/Title, UserName/Name",
                "LeaveLevel1, LeaveLevel2, Designation, Grade, EmployeeType,Scale,Payscale,CurrentOfficeLocation, SubGroup, CashApprover, NEFTApprover, UserName",
                `EmployeeType/Title eq '${EmployeeType}'`,
                { column: "Id", isAscending: false },
                props
            );
            if (results && results.length > 0) {
                const firstResult = results;
                // const employee: IEmployeeMaster = {
                //     Id: firstResult.Id,
                //     Title: firstResult.Title,
                //     EmployeeTitle: firstResult.EmployeeTitle,
                //     EmployeeName: firstResult.EmployeeName,
                //     EmployeeId: firstResult.Title,
                //     FirstName: firstResult.FirstName,
                //     MiddleName: firstResult.MiddleName,
                //     LastName: firstResult.LastName,
                //     UserName: firstResult.UserName,
                //     Gender: firstResult.Gender,
                //     OfficeLocation: firstResult.OfficeLocation,
                //     CurrentOfficeLocation: firstResult.CurrentOfficeLocation,
                //     CurrentOfficeLocationId: firstResult.CurrentOfficeLocationId,
                //     SubGroup: firstResult.CurrentOfficeLocation,
                //     SubGroupId: firstResult.SubGroupId,
                //     Unit: firstResult.Unit,
                //     EmployeeType: firstResult.EmployeeType,
                //     Scale: firstResult.ScaleId,
                //     Grade: firstResult.Grade,
                //     GradeId: firstResult.GradeId,
                //     Designation: firstResult.Designation,
                //     DesignationTitle: firstResult.Designation.Title,
                //     DesignationId: firstResult.DesignationId,
                //     // DateofBirth:firstResult.TempDOB,
                //     DateofBirth: firstResult.DOB
                //         ? `${new Date(firstResult.DOB).getDate()}-${new Date(firstResult.DOB).getMonth() + 1}-${new Date(firstResult.DOB).getFullYear()}`
                //         : null,
                //     //DateofBirth: results.TempDOB ? new Date(results.TempDOB) : null,
                //     LoginUserDesignation: firstResult.LoginUserDesignation,
                //     Payscale: firstResult.Payscale,
                //     ReportingManager: firstResult.ReportingManager,
                //     AlternateReportingManager: firstResult.AlternateReportingManager,
                //     Active: firstResult.Active,
                //     Phone_x0020_No: firstResult.Phone_x0020_No,
                //     MobileNo_x002e_: firstResult.MobileNo_x002e_,
                //     CompanyEmail: firstResult.CompanyEmail,
                //     AlternateEmail: firstResult.AlternateEmail,
                //     LeaveLevel1: firstResult.LeaveLevel1,
                //     LeaveLevel2: firstResult.LeaveLevel2,
                //     LeaveLevel2Id: firstResult.LeaveLevel2Id,
                //     LeaveLevel2val: firstResult.LeaveLevel2val,
                //     Role: firstResult.Role,
                //     BranchName: firstResult.BranchName,
                //     HHApproverName: firstResult.HHApproverName,
                //     LTCDate: firstResult.LTCDate,
                //     TempDOB: firstResult.TempDOB,
                //     EmpType: firstResult.EmpType,
                //     AccountNo: firstResult.AccountNo,
                //     IFSCCode: firstResult.IFSCCode,
                //     map: function (arg0: (item: any) => { key: any; text: any; }): unknown {
                //         throw new Error('Function not implemented.');
                //     },
                //     employee2: undefined,
                //     employee1: undefined
                // };
                return firstResult;
            } else {
                console.warn("No employee found for the current user.");
                return null;
            }
        } catch (error) {
            console.error("Error in getEmployeeMaster:", error);
            return null;
        }
    };
    // const getEmployeeMasterById = async (props: IVehicleModuleProps): Promise<IEmployeeMaster | null> => {
    //     try {
    //         const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
    //         // const encodedLoginName = encodeURIComponent(currentUser.LoginName);
    //         const results = await (await spCrudOps).getData(
    //             "EmployeeMaster",
    //             "*, Title, AccountNo, IFSCCode, LeaveLevel1/Title,Scale/Title,Payscale/Title, LeaveLevel2/Title, LeaveLevel2/Name, Designation/Title, Grade/Grade, CurrentOfficeLocation/Title, SubGroup/ShortName, SubGroup/GroupName, SubGroup/Id, CashApprover/Title, NEFTApprover/Title, UserName/Name",
    //             "LeaveLevel1, LeaveLevel2, Designation, Grade,Scale,Payscale, CurrentOfficeLocation, SubGroup, CashApprover, NEFTApprover, UserName",
    //             `UserName/Name eq '${currentUser.LoginName}'`,
    //             { column: "Id", isAscending: false },
    //             props
    //         );
    //         if (results && results.length > 0) {
    //             const firstResult = results[0];
    //             const employee: IEmployeeMaster = {
    //                 Id: firstResult.Id,
    //                 Limit:"",
    //                 Title: firstResult.Title,
    //                 EmployeeTitle: firstResult.EmployeeTitle,
    //                 EmployeeName: firstResult.EmployeeName,
    //                 EmployeeId: firstResult.Title,
    //                 FirstName: firstResult.FirstName,
    //                 MiddleName: firstResult.MiddleName,
    //                 LastName: firstResult.LastName,
    //                 UserName: firstResult.UserName,
    //                 Gender: firstResult.Gender,
    //                 OfficeLocation: firstResult.OfficeLocation,
    //                 CurrentOfficeLocation: firstResult.CurrentOfficeLocation,
    //                 CurrentOfficeLocationId: firstResult.CurrentOfficeLocationId,
    //                 SubGroup: firstResult.CurrentOfficeLocation,
    //                 SubGroupId: firstResult.SubGroupId,
    //                 Unit: firstResult.Unit,
    //                 EmployeeType: firstResult.EmployeeType,
    //                 Scale: firstResult.Scale.Title,
    //                 Payscale: firstResult.Payscale.Title,
    //                 Grade: firstResult.Grade,
    //                 GradeId: firstResult.GradeId,
    //                 Designation: firstResult.Designation,
    //                 DesignationTitle: firstResult.Designation.Title,
    //                 DateofBirth: firstResult.TempDOB,
    //                 DesignationId: firstResult.DesignationId,
    //                 LoginUserDesignation: firstResult.LoginUserDesignation,
    //                 // Payscale: firstResult.Payscale,
    //                 ReportingManager: firstResult.ReportingManager,
    //                 AlternateReportingManager: firstResult.AlternateReportingManager,
    //                 Active: firstResult.Active,
    //                 Phone_x0020_No: firstResult.Phone_x0020_No,
    //                 MobileNo_x002e_: firstResult.MobileNo_x002e_,
    //                 CompanyEmail: firstResult.CompanyEmail,
    //                 AlternateEmail: firstResult.AlternateEmail,
    //                 LeaveLevel1: firstResult.LeaveLevel1,
    //                 LeaveLevel2: firstResult.LeaveLevel2,
    //                 LeaveLevel2Id: firstResult.LeaveLevel2Id,
    //                 LeaveLevel2val: firstResult.LeaveLevel2val,
    //                 Role: firstResult.Role,
    //                 BranchName: firstResult.BranchName,
    //                 HHApproverName: firstResult.HHApproverName,
    //                 LTCDate: firstResult.LTCDate,
    //                 TempDOB: firstResult.TempDOB,
    //                 EmpType: firstResult.EmpType,
    //                 AccountNo: firstResult.AccountNo,
    //                 IFSCCode: firstResult.IFSCCode,
    //                 Age:firstResult.Age,
    //                 map: function (arg0: (item: any) => { key: any; text: any; }): unknown {
    //                     throw new Error('Function not implemented.');
    //                 },
    //                 employee2: undefined,
    //                 employee1: undefined
    //             };
    //             return employee;
    //         } else {
    //             console.warn("No employee found for the current user.");
    //             return null;
    //         }
    //     } catch (error) {
    //         console.error("Error in getEmployeeMaster:", error);
    //         return null;
    //     }
    // };
    const getEmployeeMasterById = async (props: IVehicleModuleProps): Promise< ICHSRequest[]> => {        
        const emplinfo = await getEmployeeMaster(props);
         const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
        //  let status = "Pending";
         return await (await spCrudOps).getData("HealthCheckupService"
             , "*,Attachments,AttachmentFiles,Created,Author/Name"
             , "AttachmentFiles,Author"
             // , `EmployeeID eq '${emplinfo.Title}' and Status eq '${status}'`
             // , `Status eq '${status}' and Author/Name eq '${currentUser.LoginName}'`
             // , `Author/Name eq '${currentUser.LoginName}' and EmployeeID eq '${emplinfo.Title}'`
             , ''
             , { column:'Id',isAscending:false },props).then(UserPending => {
                 let brr: Array<ICHSRequest> = new Array<ICHSRequest>();
                 UserPending.sort((a, b) => b.Id - a.Id).map(item => {
                     brr.push({
                         ID: item.ID,
                         IsSpouseEximMember:item.IsSpouseEximMember,

                         HRApprovedAmount:item.HRApprovedAmount,

                         Title: item.Title,
                         Created: new Date(item.Created),
                         VoucherID: item.VoucherID,
                         AccountNo: item.AccountNo,
                         Amountclaimed: ''+item.Amountclaimed,
                         HR1Remark:item.HR1Remark,
                         HR2Remark:item.HR2Remark,
                         Approver: item.Approver,
                         CashApprover: item.CashApprover,
                         changeptym: item.changeptym,
                         ClaimFor: item.ClaimFor,
                         CNRejectedDate: item.CNRejectedDate,
                         DocumentLinks: item.DocumentLinks,
                         Documents: item.Documents,
                         EmployeeDesignation: item.EmployeeDesignation,
                         EmployeeGrade: item.EmployeeGrade,
                         EmployeeID: item.EmployeeID,
                         EmployeeName: item.EmployeeName,
                         EmployeeSubGroup: item.EmployeeSubGroup,
                         FirstApproverAppDate: item.FirstApproverAppDate,
                         FirstApproverRejectDate: item.FirstApproverRejectDate,
                         flag: item.flag,
                         GHRemark: item.GHRemark,
                         GHRemarks: item.GHRemarks,
                         GHStatus: item.GHStatus,
                         IFSCCode: item.IFSCCode,
                         EligibilityLimit:item.EligibilityLimit,
                         Level1: item.Level1,
                         Level2: item.Level2,
                         NEFTApprover: item.NEFTApprover,
                         OfficeLocation: item.OfficeLocation,
                         PaidDate: item.PaidDate,
                         PaymentType: item.PaymentType,
                         Remark: item.Remark,
                         Role: item.Role,
                         SendForApproval: item.SendForApproval,
                         Status: item.Status,
                         TAGRemark: item.TAGRemark,
                         TAGStatus: item.TAGStatus,
                         VendorDetails: item.VendorDetails,
                         Voucherdate: item.Voucherdate,
                         DependentType:item.DependentType,
                           FinalAmount:item.FinalAmount,
                         Scale:item.Scale,
                         EmployeeType:item.EmployeeType,
                         Designation:item.Designation,
                         Age:item.Age,
                         Limit:item.Limit,
                         AmountClaimed:item.AmountClaimed,
                         // Scale:item.Scale,
                         // EmployeeType:item.EmployeeType,
                         // Designation:item.Designation,
                         // Age:item.Age,
                         // Limit:item.Limit,
                         // AmountClaimed:item.AmountClaimed,
                          DateofBirth:item.DateofBirth!==undefined && item.DateofBirth!==null ? new Date(item.DateofBirth):null,
                         AttachmentFiles:item.AttachmentFiles
                     });
                 });
                 return brr;
             });
     };
    const getUserDashboard = async (props: IVehicleModuleProps): Promise<ICHSRequest[]> => {        
       const emplinfo = await getEmployeeMaster(props);
        const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
        let status = "Pending";
        return await (await spCrudOps).getData("PersonalAdvanceVehicle"
            , "*,Attachments,AttachmentFiles,Author/Name"
            , "AttachmentFiles,Author"
            // , `EmployeeID eq '${emplinfo.Title}' and Status eq '${status}'`
            // , `Status eq '${status}' and Author/Name eq '${currentUser.LoginName}'`
            // , `Author/Name eq '${currentUser.LoginName}' and EmployeeID eq '${emplinfo.Title}'`
            , `Status eq '${status}'  and EmployeeID eq '${emplinfo.Title}'`
            , { column:'Id',isAscending:false },props).then(UserPending => {
                let brr: Array<ICHSRequest> = new Array<ICHSRequest>();
                UserPending.sort((a, b) => b.Id - a.Id).map(item => {
                    brr.push({
                        ID: item.ID,
                        HRApprovedAmount:item.HRApprovedAmount,
                        IsSpouseEximMember:item.IsSpouseEximMember,
                        Created: new Date(item.Created),
                        EligibilityLimit:item.EligibilityLimit,
                        Title: item.Title,
                        VoucherID: item.VoucherID,
                        AccountNo: item.AccountNo,
                        Amountclaimed: ''+item.Amountclaimed,
                        Approver: item.Approver,
                        CashApprover: item.CashApprover,
                        changeptym: item.changeptym,
                        ClaimFor: item.ClaimFor,
                        CNRejectedDate: item.CNRejectedDate,
                        DocumentLinks: item.DocumentLinks,
                        Documents: item.Documents,
                        EmployeeDesignation: item.EmployeeDesignation,
                        EmployeeGrade: item.EmployeeGrade,
                        EmployeeID: item.EmployeeID,
                        EmployeeName: item.EmployeeName,
                        EmployeeSubGroup: item.EmployeeSubGroup,
                        FirstApproverAppDate: item.FirstApproverAppDate,
                        FirstApproverRejectDate: item.FirstApproverRejectDate,
                        flag: item.flag,
                        GHRemark: item.GHRemark,
                        GHRemarks: item.GHRemarks,
                        GHStatus: item.GHStatus,
                        IFSCCode: item.IFSCCode,
                        Level1: item.Level1,
                        Level2: item.Level2,
                        NEFTApprover: item.NEFTApprover,
                        OfficeLocation: item.OfficeLocation,
                        PaidDate: item.PaidDate,
                        PaymentType: item.PaymentType,
                        Remark: item.Remark,
                        Role: item.Role,
                        SendForApproval: item.SendForApproval,
                        Status: item.Status,
                        TAGRemark: item.TAGRemark,
                        TAGStatus: item.TAGStatus,
                        VendorDetails: item.VendorDetails,
                        Voucherdate: item.Voucherdate,
                        DependentType:item.DependentType,
                          FinalAmount:item.FinalAmount,
                        Scale:item.Scale,
                        EmployeeType:item.EmployeeType,
                        Designation:item.Designation,
                        Age:item.Age,
                        Limit:item.Limit,
                        AmountClaimed:item.AmountClaimed,
                        // FinalAmount:item.FinalAmount,
                        HR1Remark:item.HR1Remark,
                        HR2Remark:item.HR2Remark,
                        // Scale:item.Scale,
                        // EmployeeType:item.EmployeeType,
                        // Designation:item.Designation,
                        // Age:item.Age,
                        // Limit:item.Limit,
                        // AmountClaimed:item.AmountClaimed,
                         DateofBirth:item.DateofBirth!==undefined && item.DateofBirth!==null ? new Date(item.DateofBirth):null,
                        AttachmentFiles:item.AttachmentFiles
                    });
                });
                return brr;
            });
    };
    const getUserApprovedDashboard = async (props: IVehicleModuleProps): Promise<ICHSRequest[]> => {        
       const emplinfo1 = await getEmployeeMaster(props);
        let status = "Approved";
        const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
        return await (await spCrudOps).getData("HealthCheckupService"
            , "*,Attachments,AttachmentFiles,Author/Name"
            , "AttachmentFiles,Author"
            // , `EmployeeID eq '${emplinfo.Title}' and Status eq '${status}'`
            // , `Status eq '${status}' and Author/Name eq '${currentUser.LoginName}' and EmployeeID eq '${emplinfo.Title}'`
            , `Status eq '${status}' and EmployeeID eq '${emplinfo1.Title}'`
            , { column:'Id',isAscending:false },props).then(UserPending => {
                let brr: Array<ICHSRequest> = new Array<ICHSRequest>();
                UserPending.sort((a, b) => b.Id - a.Id).map(item => {
                    brr.push({
                        ID: item.ID,
                        HRApprovedAmount:item.HRApprovedAmount,

                        Created: new Date(item.Created),
                        EligibilityLimit:item.EligibilityLimit,
                        HR1Remark:item.HR1Remark,
                        HR2Remark:item.HR2Remark,
                        Title: item.Title,
                        VoucherID: item.VoucherID,
                        AccountNo: item.AccountNo,
                        Amountclaimed: ''+item.Amountclaimed,
                        Approver: item.Approver,
                        CashApprover: item.CashApprover,
                        changeptym: item.changeptym,
                        ClaimFor: item.ClaimFor,
                        CNRejectedDate: item.CNRejectedDate,
                        DocumentLinks: item.DocumentLinks,
                        Documents: item.Documents,
                        EmployeeDesignation: item.EmployeeDesignation,
                        EmployeeGrade: item.EmployeeGrade,
                        EmployeeID: item.EmployeeID,
                        EmployeeName: item.EmployeeName,
                        EmployeeSubGroup: item.EmployeeSubGroup,
                        FirstApproverAppDate: item.FirstApproverAppDate,
                        FirstApproverRejectDate: item.FirstApproverRejectDate,
                        flag: item.flag,
                        GHRemark: item.GHRemark,
                        GHRemarks: item.GHRemarks,
                        GHStatus: item.GHStatus,
                        IFSCCode: item.IFSCCode,
                        Level1: item.Level1,
                        Level2: item.Level2,
                        NEFTApprover: item.NEFTApprover,
                        OfficeLocation: item.OfficeLocation,
                        PaidDate: item.PaidDate,
                        PaymentType: item.PaymentType,
                        Remark: item.Remark,
                        Role: item.Role,
                        SendForApproval: item.SendForApproval,
                        Status: item.Status,
                        TAGRemark: item.TAGRemark,
                        TAGStatus: item.TAGStatus,
                        VendorDetails: item.VendorDetails,
                        Voucherdate: item.Voucherdate,
                        DependentType:item.DependentType,
                          FinalAmount:item.FinalAmount,
                        Scale:item.Scale,
                        EmployeeType:item.EmployeeType,
                        Designation:item.Designation,
                        Age:item.Age,
                        IsSpouseEximMember:item.IsSpouseEximMember,

                        Limit:item.Limit,
                        AmountClaimed:item.AmountClaimed,
                         DateofBirth:new Date(item.DateofBirth)||"",
                        AttachmentFiles:item.AttachmentFiles
                    });
                });
                return brr;
            });
    };
    const getUserRejectedDashboard = async (props: IVehicleModuleProps): Promise<ICHSRequest[]> => {        
       const emplinfo2 = await getEmployeeMaster(props);
        let status = "Rejected";
        const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
        return await (await spCrudOps).getData("HealthCheckupService"
            , "*,Attachments,AttachmentFiles,Author/Name"
            , "AttachmentFiles,Author"
            // , `EmployeeID eq '${emplinfo.Title}' and Status eq '${status}'`
            // , `Status eq '${status}' and Author/Name eq '${currentUser.LoginName}' and EmployeeID eq '${emplinfo.Title}'`
            , `Status eq '${status}' and EmployeeID eq '${emplinfo2.Title}'`
            , { column:'Id',isAscending:false },props).then(UserPending => {
                let brr: Array<ICHSRequest> = new Array<ICHSRequest>();
                UserPending.sort((a, b) => b.Id - a.Id).map(item => {
                    brr.push({
                        ID: item.ID,
                        HRApprovedAmount:item.HRApprovedAmount,

                        Title: item.Title,
                        Created: new Date(item.Created),
                        EligibilityLimit:item.EligibilityLimit,
                        HR1Remark:item.HR1Remark,
                        HR2Remark:item.HR2Remark,
                        VoucherID: item.VoucherID,
                        AccountNo: item.AccountNo,
                        Amountclaimed:''+ item.Amountclaimed,
                        Approver: item.Approver,
                        CashApprover: item.CashApprover,
                        changeptym: item.changeptym,
                        ClaimFor: item.ClaimFor,
                        CNRejectedDate: item.CNRejectedDate,
                        DocumentLinks: item.DocumentLinks,
                        Documents: item.Documents,
                        EmployeeDesignation: item.EmployeeDesignation,
                        EmployeeGrade: item.EmployeeGrade,
                        EmployeeID: item.EmployeeID,
                        EmployeeName: item.EmployeeName,
                        EmployeeSubGroup: item.EmployeeSubGroup,
                        FirstApproverAppDate: item.FirstApproverAppDate,
                        FirstApproverRejectDate: item.FirstApproverRejectDate,
                        flag: item.flag,
                        GHRemark: item.GHRemark,
                        GHRemarks: item.GHRemarks,
                        GHStatus: item.GHStatus,
                        IFSCCode: item.IFSCCode,
                        Level1: item.Level1,
                        Level2: item.Level2,
                        NEFTApprover: item.NEFTApprover,
                        OfficeLocation: item.OfficeLocation,
                        PaidDate: item.PaidDate,
                        PaymentType: item.PaymentType,
                        Remark: item.Remark,
                        Role: item.Role,
                        SendForApproval: item.SendForApproval,
                        Status: item.Status,
                        TAGRemark: item.TAGRemark,
                        TAGStatus: item.TAGStatus,
                        VendorDetails: item.VendorDetails,
                        Voucherdate: item.Voucherdate,
                        DependentType:item.DependentType,
                        // AmountClaimed:item.AmountClaimed,
                          FinalAmount:item.FinalAmount,
                        Scale:item.Scale,
                        EmployeeType:item.EmployeeType,
                        Designation:item.Designation,
                        Age:item.Age,
                        Limit:item.Limit,
                        AmountClaimed:item.AmountClaimed,
                         DateofBirth:new Date(item.DateofBirth)||"",
                         IsSpouseEximMember:item.IsSpouseEximMember,

                        AttachmentFiles:item.AttachmentFiles
                    });
                });
                return brr;
            });
    };
    const HR1getApproveDashboard = async (props: IVehicleModuleProps): Promise<ICHSRequest[]> => {        
      //  const emplinfo = await getEmployeeMaster(props);
        let HR1Status = "Pending with HR1";
        let FinalStatus = "Pending";
        const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
        return await (await spCrudOps).getData("HealthCheckupService"
            , "*,Attachments,AttachmentFiles,HR2ApproverName/Name"
            , "AttachmentFiles,HR2ApproverName"
            // , `EmployeeID eq '${emplinfo.Title}' and Status eq '${status}'`
            , `HR1Response eq '${HR1Status}' and Status eq '${FinalStatus}' and HR2ApproverName/Name ne '${currentUser.LoginName}' `
            , { column:'Id',isAscending:false },props).then(UserPending => {
                let brr: Array<ICHSRequest> = new Array<ICHSRequest>();
                UserPending.sort((a, b) => b.Id - a.Id).map(item => {
                    brr.push({
                        ID: item.ID,
                        HRApprovedAmount:item.HRApprovedAmount,

                        Created: new Date(item.Created),
                        EligibilityLimit:item.EligibilityLimit,
                        HR1Remark:item.HR1Remark,
                        HR2Remark:item.HR2Remark,
                        Title: item.Title,
                        VoucherID: item.VoucherID,
                        AccountNo: item.AccountNo,
                        Amountclaimed:''+ item.Amountclaimed,
                        Approver: item.Approver,
                        CashApprover: item.CashApprover,
                        changeptym: item.changeptym,
                        ClaimFor: item.ClaimFor,
                        CNRejectedDate: item.CNRejectedDate,
                        DocumentLinks: item.DocumentLinks,
                        Documents: item.Documents,
                        EmployeeDesignation: item.EmployeeDesignation,
                        EmployeeGrade: item.EmployeeGrade,
                        EmployeeID: item.EmployeeID,
                        EmployeeName: item.EmployeeName,
                        EmployeeSubGroup: item.EmployeeSubGroup,
                        FirstApproverAppDate: item.FirstApproverAppDate,
                        FirstApproverRejectDate: item.FirstApproverRejectDate,
                        flag: item.flag,
                        GHRemark: item.GHRemark,
                        GHRemarks: item.GHRemarks,
                        GHStatus: item.GHStatus,
                        IFSCCode: item.IFSCCode,
                        Level1: item.Level1,
                        Level2: item.Level2,
                        NEFTApprover: item.NEFTApprover,
                        OfficeLocation: item.OfficeLocation,
                        PaidDate: item.PaidDate,
                        PaymentType: item.PaymentType,
                        Remark: item.Remark,
                        Role: item.Role,
                        SendForApproval: item.SendForApproval,
                        Status: item.Status,
                        TAGRemark: item.TAGRemark,
                        TAGStatus: item.TAGStatus,
                        VendorDetails: item.VendorDetails,
                        Voucherdate: item.Voucherdate,
                        DependentType:item.DependentType,
                        // AmountClaimed:item.AmountClaimed,
                          FinalAmount:item.FinalAmount,
                        Scale:item.Scale,
                        EmployeeType:item.EmployeeType,
                        Designation:item.Designation,
                        Age:item.Age,
                        Limit:item.Limit,
                        AmountClaimed:item.AmountClaimed,
                        DateofBirth:(item.DateofBirth),
                        IsSpouseEximMember:item.IsSpouseEximMember,

                        AttachmentFiles:item.AttachmentFiles
                    });
                });
                return brr;
            });
    };
    const HR1getApproveApprovedDashboard = async (props: IVehicleModuleProps): Promise<ICHSRequest[]> => {        
      //  const emplinfo = await getEmployeeMaster(props);
        let status = "Approved by HR1";
        let FinalStatus="Approved"
        let Rejected="Rejected"
        const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
        return await (await spCrudOps).getData("HealthCheckupService"
            , "*,Attachments,AttachmentFiles,HR2ApproverName/Name"
            , "AttachmentFiles,HR2ApproverName"
            // , `EmployeeID eq '${emplinfo.Title}' and Status eq '${status}'`
            // , `HR1Response eq '${status}' and HR2ApproverName/Name ne '${currentUser.LoginName}'`
            // , `HR1Response eq '${status}' and (Status eq '${FinalStatus}' or Status ne '${Rejected}')`
            , `HR1Response eq '${status}' and (Status eq '${FinalStatus}' or Status ne '${Rejected}')`

            , { column:'Id',isAscending:false },props).then(UserPending => {
                let brr: Array<ICHSRequest> = new Array<ICHSRequest>();
                UserPending.sort((a, b) => b.Id - a.Id).map(item => {
                    brr.push({
                        ID: item.ID,
                        Title: item.Title,
                        HRApprovedAmount:item.HRApprovedAmount,

                        Created: new Date(item.Created),
                        EligibilityLimit:item.EligibilityLimit,
                        HR1Remark:item.HR1Remark,
                        HR2Remark:item.HR2Remark,
                        VoucherID: item.VoucherID,
                        AccountNo: item.AccountNo,
                        Amountclaimed:''+ item.Amountclaimed,
                        Approver: item.Approver,
                        CashApprover: item.CashApprover,
                        changeptym: item.changeptym,
                        ClaimFor: item.ClaimFor,
                        CNRejectedDate: item.CNRejectedDate,
                        DocumentLinks: item.DocumentLinks,
                        Documents: item.Documents,
                        EmployeeDesignation: item.EmployeeDesignation,
                        EmployeeGrade: item.EmployeeGrade,
                        EmployeeID: item.EmployeeID,
                        EmployeeName: item.EmployeeName,
                        EmployeeSubGroup: item.EmployeeSubGroup,
                        FirstApproverAppDate: item.FirstApproverAppDate,
                        FirstApproverRejectDate: item.FirstApproverRejectDate,
                        flag: item.flag,
                        GHRemark: item.GHRemark,
                        GHRemarks: item.GHRemarks,
                        GHStatus: item.GHStatus,
                        IFSCCode: item.IFSCCode,
                        Level1: item.Level1,
                        Level2: item.Level2,
                        NEFTApprover: item.NEFTApprover,
                        OfficeLocation: item.OfficeLocation,
                        PaidDate: item.PaidDate,
                        PaymentType: item.PaymentType,
                        Remark: item.Remark,
                         DateofBirth:new Date(item.DateofBirth)||"",
                        Role: item.Role,
                        SendForApproval: item.SendForApproval,
                        Status: item.Status,
                        TAGRemark: item.TAGRemark,
                        TAGStatus: item.TAGStatus,
                        VendorDetails: item.VendorDetails,
                        Voucherdate: item.Voucherdate,
                        DependentType:item.DependentType,
                        // AmountClaimed:item.AmountClaimed,
                          FinalAmount:item.FinalAmount,
                        Scale:item.Scale,
                        EmployeeType:item.EmployeeType,
                        Designation:item.Designation,
                        Age:item.Age,
                        Limit:item.Limit,
                        AmountClaimed:item.AmountClaimed,
                        AttachmentFiles:item.AttachmentFiles,
                        IsSpouseEximMember:item.IsSpouseEximMember,

                    });
                });
                return brr;
            });
    };
    const HR1getApproveRejectedDashboard = async (props: IVehicleModuleProps): Promise<ICHSRequest[]> => {        
      //  const emplinfo = await getEmployeeMaster(props);
        const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
        let status = "Rejected";
        return await (await spCrudOps).getData("HealthCheckupService"
            , "*,Attachments,AttachmentFiles,HR2ApproverName/Name"
            , "AttachmentFiles,HR2ApproverName"
            // , `EmployeeID eq '${emplinfo.Title}' and Status eq '${status}'`
            , `Status eq '${status}' and  HR2ApproverName/Name ne '${currentUser.LoginName}'`
            , { column:'Id',isAscending:false },props).then(UserPending => {
                let brr: Array<ICHSRequest> = new Array<ICHSRequest>();
                UserPending.sort((a, b) => b.Id - a.Id).map(item => {
                    brr.push({
                        ID: item.ID,
                        HRApprovedAmount:item.HRApprovedAmount,

                        Created: new Date(item.Created),
                        EligibilityLimit:item.EligibilityLimit,
                        HR1Remark:item.HR1Remark,
                        HR2Remark:item.HR2Remark,
                        Title: item.Title,
                        VoucherID: item.VoucherID,
                        AccountNo: item.AccountNo,
                        Amountclaimed:''+ item.Amountclaimed,
                        Approver: item.Approver,
                        CashApprover: item.CashApprover,
                        changeptym: item.changeptym,
                        ClaimFor: item.ClaimFor,
                        CNRejectedDate: item.CNRejectedDate,
                        DocumentLinks: item.DocumentLinks,
                        Documents: item.Documents,
                        EmployeeDesignation: item.EmployeeDesignation,
                        EmployeeGrade: item.EmployeeGrade,
                        EmployeeID: item.EmployeeID,
                        EmployeeName: item.EmployeeName,
                        EmployeeSubGroup: item.EmployeeSubGroup,
                        FirstApproverAppDate: item.FirstApproverAppDate,
                        FirstApproverRejectDate: item.FirstApproverRejectDate,
                        flag: item.flag,
                        GHRemark: item.GHRemark,
                        GHRemarks: item.GHRemarks,
                        GHStatus: item.GHStatus,
                        IFSCCode: item.IFSCCode,
                        Level1: item.Level1,
                        Level2: item.Level2,
                        NEFTApprover: item.NEFTApprover,
                        OfficeLocation: item.OfficeLocation,
                        PaidDate: item.PaidDate,
                        PaymentType: item.PaymentType,
                        Remark: item.Remark,
                        Role: item.Role,
                        SendForApproval: item.SendForApproval,
                        Status: item.Status,
                        TAGRemark: item.TAGRemark,
                        TAGStatus: item.TAGStatus,
                        VendorDetails: item.VendorDetails,
                        Voucherdate: item.Voucherdate,
                        DependentType:item.DependentType,
                        // AmountClaimed:item.AmountClaimed,
                          FinalAmount:item.FinalAmount,
                        Scale:item.Scale,
                        EmployeeType:item.EmployeeType,
                        Designation:item.Designation,
                        Age:item.Age,
                        Limit:item.Limit,
                        AmountClaimed:item.AmountClaimed,
                         DateofBirth:new Date(item.DateofBirth)||"",
                        AttachmentFiles:item.AttachmentFiles,
                        IsSpouseEximMember:item.IsSpouseEximMember,

                    });
                });
                return brr;
            });
    };
    const HR2getApproveDashboard = async (props: IVehicleModuleProps): Promise<ICHSRequest[]> => {        
      //  const emplinfo = await getEmployeeMaster(props);
        let HR2Status = "Pending with HR2";
        let HR1Status = "Approved by HR1";
        let FinalStatus = "Pending";
        const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
        return await (await spCrudOps).getData("HealthCheckupService"
            , "*,Attachments,AttachmentFiles,HR1ApproverName/Name"
            , "AttachmentFiles,HR1ApproverName"
            // , `EmployeeID eq '${emplinfo.Title}' and Status eq '${status}'`
            // , `HR2Response eq '${status}'`
            , `HR2Response eq '${HR2Status}' and HR1Response eq '${HR1Status}' and Status eq '${FinalStatus}' and HR1ApproverName/Name ne  '${currentUser.LoginName}'`
            , { column:'Id',isAscending:false },props).then(UserPending => {
                let brr: Array<ICHSRequest> = new Array<ICHSRequest>();
                UserPending.sort((a, b) => b.Id - a.Id).map(item => {
                    brr.push({
                        ID: item.ID,
                        Title: item.Title,
                        HRApprovedAmount:item.HRApprovedAmount,

                        Created: new Date(item.Created),
                        EligibilityLimit:item.EligibilityLimit,
                        HR1Remark:item.HR1Remark,
                        HR2Remark:item.HR2Remark,
                        VoucherID: item.VoucherID,
                        AccountNo: item.AccountNo,
                        Amountclaimed:''+ item.Amountclaimed,
                        Approver: item.Approver,
                        CashApprover: item.CashApprover,
                        changeptym: item.changeptym,
                        ClaimFor: item.ClaimFor,
                        CNRejectedDate: item.CNRejectedDate,
                        DocumentLinks: item.DocumentLinks,
                        Documents: item.Documents,
                        EmployeeDesignation: item.EmployeeDesignation,
                        EmployeeGrade: item.EmployeeGrade,
                        EmployeeID: item.EmployeeID,
                        EmployeeName: item.EmployeeName,
                        EmployeeSubGroup: item.EmployeeSubGroup,
                        FirstApproverAppDate: item.FirstApproverAppDate,
                        FirstApproverRejectDate: item.FirstApproverRejectDate,
                        flag: item.flag,
                        GHRemark: item.GHRemark,
                        GHRemarks: item.GHRemarks,
                        GHStatus: item.GHStatus,
                        IFSCCode: item.IFSCCode,
                        Level1: item.Level1,
                        Level2: item.Level2,
                        NEFTApprover: item.NEFTApprover,
                        OfficeLocation: item.OfficeLocation,
                        PaidDate: item.PaidDate,
                        PaymentType: item.PaymentType,
                        Remark: item.Remark,
                        Role: item.Role,
                        SendForApproval: item.SendForApproval,
                        Status: item.Status,
                        TAGRemark: item.TAGRemark,
                        TAGStatus: item.TAGStatus,
                        VendorDetails: item.VendorDetails,
                        Voucherdate: item.Voucherdate,
                        DependentType:item.DependentType,
                        // AmountClaimed:item.AmountClaimed,
                          FinalAmount:item.FinalAmount,
                        Scale:item.Scale,
                        EmployeeType:item.EmployeeType,
                        Designation:item.Designation,
                        Age:item.Age,
                        Limit:item.Limit,
                        AmountClaimed:item.AmountClaimed,
                         DateofBirth:new Date(item.DateofBirth)||"",
                        AttachmentFiles:item.AttachmentFiles,
                        IsSpouseEximMember:item.IsSpouseEximMember,

                    });
                });
                return brr;
            });
    };
    const HR2getApproveApprovedDashboard = async (props: IVehicleModuleProps): Promise<ICHSRequest[]> => {        
      //  const emplinfo = await getEmployeeMaster(props);
        let status = "Approved by HR2";
        let FinalStatus = "Approved";
        const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
        return await (await spCrudOps).getData("HealthCheckupService"
            , "*,Attachments,AttachmentFiles, HR1ApproverName/Name"
            , "AttachmentFiles,HR1ApproverName"
            // , `EmployeeID eq '${emplinfo.Title}' and Status eq '${status}'`
            , `Status eq '${FinalStatus}'`
            , { column:'Id',isAscending:false },props).then(UserPending => {
                let brr: Array<ICHSRequest> = new Array<ICHSRequest>();
                UserPending.sort((a, b) => b.Id - a.Id).map(item => {
                    brr.push({
                        ID: item.ID,
                        IsSpouseEximMember:item.IsSpouseEximMember,

                        Title: item.Title,
                        HRApprovedAmount:item.HRApprovedAmount,
                        Created: new Date(item.Created),
                        EligibilityLimit:item.EligibilityLimit,
                        HR1Remark:item.HR1Remark,
                        HR2Remark:item.HR2Remark,
                        VoucherID: item.VoucherID,
                        AccountNo: item.AccountNo,
                        Amountclaimed:''+ item.Amountclaimed,
                        Approver: item.Approver,
                        CashApprover: item.CashApprover,
                        changeptym: item.changeptym,
                        ClaimFor: item.ClaimFor,
                        CNRejectedDate: item.CNRejectedDate,
                        DocumentLinks: item.DocumentLinks,
                        Documents: item.Documents,
                        EmployeeDesignation: item.EmployeeDesignation,
                        EmployeeGrade: item.EmployeeGrade,
                        EmployeeID: item.EmployeeID,
                        EmployeeName: item.EmployeeName,
                        EmployeeSubGroup: item.EmployeeSubGroup,
                        FirstApproverAppDate: item.FirstApproverAppDate,
                        FirstApproverRejectDate: item.FirstApproverRejectDate,
                        flag: item.flag,
                        GHRemark: item.GHRemark,
                        GHRemarks: item.GHRemarks,
                        GHStatus: item.GHStatus,
                        IFSCCode: item.IFSCCode,
                        Level1: item.Level1,
                        Level2: item.Level2,
                        NEFTApprover: item.NEFTApprover,
                        OfficeLocation: item.OfficeLocation,
                        PaidDate: item.PaidDate,
                        PaymentType: item.PaymentType,
                        Remark: item.Remark,
                        Role: item.Role,
                        SendForApproval: item.SendForApproval,
                        Status: item.Status,
                        TAGRemark: item.TAGRemark,
                        TAGStatus: item.TAGStatus,
                        VendorDetails: item.VendorDetails,
                        Voucherdate: item.Voucherdate,
                        DependentType:item.DependentType,
                        // AmountClaimed:item.AmountClaimed,
                          FinalAmount:item.FinalAmount,
                        Scale:item.Scale,
                        EmployeeType:item.EmployeeType,
                        Designation:item.Designation,
                        Age:item.Age,
                        Limit:item.Limit,
                        AmountClaimed:item.AmountClaimed,
                         DateofBirth:new Date(item.DateofBirth)||"",
                        AttachmentFiles:item.AttachmentFiles
                    });
                });
                return brr;
            });
    };
    const HR2getApproveRejectedDashboard = async (props: IVehicleModuleProps): Promise<ICHSRequest[]> => {        
      //  const emplinfo = await getEmployeeMaster(props);
        const currentUser = await (await spCrudOps).currentUser(props); // Fetch the current user
        let status = "Rejected";
        return await (await spCrudOps).getData("HealthCheckupService"
            , "*,Attachments,AttachmentFiles,HR1ApproverName/Name"
            , "AttachmentFiles,HR1ApproverName"
            // , `EmployeeID eq '${emplinfo.Title}' and Status eq '${status}'`
            , `Status eq '${status}' and HR1ApproverName/Name ne '${currentUser.LoginName}'`
            , { column:'Id',isAscending:false },props).then(UserPending => {
                let brr: Array<ICHSRequest> = new Array<ICHSRequest>();
                UserPending.sort((a, b) => b.Id - a.Id).map(item => {
                    brr.push({
                        ID: item.ID,
                        Title: item.Title,
                        IsSpouseEximMember:item.IsSpouseEximMember,

                        HRApprovedAmount:item.HRApprovedAmount,

                        Created: new Date(item.Created),
                        EligibilityLimit:item.EligibilityLimit,
                        HR1Remark:item.HR1Remark,
                        HR2Remark:item.HR2Remark,
                        VoucherID: item.VoucherID,
                        AccountNo: item.AccountNo,
                        Amountclaimed:''+ item.Amountclaimed,
                        Approver: item.Approver,
                        CashApprover: item.CashApprover,
                        changeptym: item.changeptym,
                        ClaimFor: item.ClaimFor,
                        CNRejectedDate: item.CNRejectedDate,
                        DocumentLinks: item.DocumentLinks,
                        Documents: item.Documents,
                        EmployeeDesignation: item.EmployeeDesignation,
                        EmployeeGrade: item.EmployeeGrade,
                        EmployeeID: item.EmployeeID,
                        EmployeeName: item.EmployeeName,
                        EmployeeSubGroup: item.EmployeeSubGroup,
                        FirstApproverAppDate: item.FirstApproverAppDate,
                        FirstApproverRejectDate: item.FirstApproverRejectDate,
                        flag: item.flag,
                        GHRemark: item.GHRemark,
                        GHRemarks: item.GHRemarks,
                        GHStatus: item.GHStatus,
                        IFSCCode: item.IFSCCode,
                        Level1: item.Level1,
                        Level2: item.Level2,
                        NEFTApprover: item.NEFTApprover,
                        OfficeLocation: item.OfficeLocation,
                        PaidDate: item.PaidDate,
                        PaymentType: item.PaymentType,
                        Remark: item.Remark,
                        Role: item.Role,
                        SendForApproval: item.SendForApproval,
                        Status: item.Status,
                        TAGRemark: item.TAGRemark,
                        TAGStatus: item.TAGStatus,
                        VendorDetails: item.VendorDetails,
                        Voucherdate: item.Voucherdate,
                        DependentType:item.DependentType,
                        // AmountClaimed:item.AmountClaimed,
                          FinalAmount:item.FinalAmount,
                        Scale:item.Scale,
                        EmployeeType:item.EmployeeType,
                        Designation:item.Designation,
                        Age:item.Age,
                        Limit:item.Limit,
                        AmountClaimed:item.AmountClaimed,
                         DateofBirth:new Date(item.DateofBirth)||"",
                        AttachmentFiles:item.AttachmentFiles
                    });
                });
                return brr;
            });
    };
    return {
        getEmployeeMaster,
        getAllEmployeeMaster
       , getEmployeeMasterById,
       getUserDashboard,
       getUserApprovedDashboard,
       getUserRejectedDashboard,
       HR1getApproveDashboard,
       HR1getApproveApprovedDashboard,
       HR1getApproveRejectedDashboard,
       HR2getApproveDashboard,
       HR2getApproveApprovedDashboard,
       HR2getApproveRejectedDashboard
    };
}