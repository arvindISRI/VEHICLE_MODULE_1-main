import { IVehicleModuleProps } from '../../../webparts/vehicleModule/components/IVehicleModuleProps';
import SPCRUDOPS from '../dal/spcrudops';
import {IEmployeeCHSLimitMaster  } from "../interface/IEmployeeCHSLimitMaster";
export interface IEmployeeCHSLimitMasterOps {
    getAllEmployeeCHSLimit(props: IVehicleModuleProps): Promise<IEmployeeCHSLimitMaster>;
}
export default function EmployeeCHSLimitMasterOps() {
    const spCrudOps = SPCRUDOPS();
    const getAllEmployeeCHSLimit = async (props: IVehicleModuleProps): Promise<IEmployeeCHSLimitMaster | null> => {
        try {
            const results = await (await spCrudOps).getDataAnotherSiteCollection(
                "EmployeeCHSLimitMaster",
                //  "*",
                "*,Scale/Title,Scale/Id,Designation/Title,Designation/Id",
                "Designation,Scale",
                // "",
                "",
                { column: "Id", isAscending: false },
                props
            );
            if (results && results.length > 0) {
                const firstResult = results;
                // const employee: IEmployeeCHSLimitMaster = {
                //     Id: firstResult.Id,
                //     Title: firstResult.Title,
                //     Limit: firstResult.Limit,
                //     EmployeeType: firstResult.EmployeeType,
                //     Sacle: firstResult.Sacle.Title,
                //     Designation: firstResult.Designation.Title
                //  };
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
    return {
        getAllEmployeeCHSLimit
    };
}