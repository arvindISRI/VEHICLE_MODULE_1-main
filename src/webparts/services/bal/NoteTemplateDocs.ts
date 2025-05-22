import { IVehicleModuleProps } from '../../vehicleModule/components/IVehicleModuleProps';
import SPCRUDOPS from '../dal/spcrudops';
import { INoteTemplateDocs } from "../interface/INoteTemplateDocs";


export interface INoteTemplateDocsOps {
    getNoteTemplateDocsDocument(brrId: string | number, props: IVehicleModuleProps): Promise<INoteTemplateDocs[]>;
}

export default function NoteTemplateDocsDocumentOps() {
    const spCrudOps = SPCRUDOPS();

    const getNoteTemplateDocsDocument = async (brrId: string | number, props: IVehicleModuleProps): Promise<INoteTemplateDocs[]> => {
        return await (await spCrudOps).getData("VehicleCostAttachments"
            , "Id,Title,PersonalAdvanceVehicleId/Id,FileLeafRef,File/ServerRelativeUrl,File_x0020_Type,UniqueId"
            , "PersonalAdvanceVehicleId,File"
            , "PersonalAdvanceVehicleId/Id eq " + brrId + ""
            , { column: 'Id', isAscending: false }, props).then(results => {
                let brr: Array<INoteTemplateDocs> = new Array<INoteTemplateDocs>();
                results.map(item => {
                    brr.push({
                        Id: item.Id,
                        Title: item.Title,
                        FileLeafRef: item.FileLeafRef,
                        ServerRelativeUrl: item.File.ServerRelativeUrl,
                        EditViewServerRelativeUrl: item.File.ServerRelativeUrl !== null || undefined ? props.currentSPContext.pageContext.web.absoluteUrl + "/_layouts/15/WopiFrame.aspx?sourcedoc={"+ item.UniqueId +"}&file="+item.FileLeafRef+"&action=default" : null,
                        File_x0020_Type: item.File_x0020_Type,
                        isChecked: false
                    });
                });
                return brr;
            });
    };

    return {
        getNoteTemplateDocsDocument
    };
}