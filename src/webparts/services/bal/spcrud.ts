import { IVehicleModuleProps } from '../../../webparts/vehicleModule/components/IVehicleModuleProps';
// import { Web } from "@pnp/sp/presets/all";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import useSPCRUDOPS, { ISPCRUDOPS } from '../../services/dal/spcrudops';
import SPCRUDOPS from '../../services/dal/spcrudops';
export interface ISPCRUD {
    getData(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, props: IVehicleModuleProps): Promise<any>;
    getDataAnotherSiteCollection(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, props: IVehicleModuleProps): Promise<any>;
    insertData(listName: string, data: any, props: IVehicleModuleProps): Promise<any>;
    updateData(listName: string, itemId: number, data: any, props: IVehicleModuleProps): Promise<any>;
    deleteData(listName: string, itemId: number, props: IVehicleModuleProps): Promise<any>;
    getListInfo(listName: string, props: IVehicleModuleProps): Promise<any>;
    getListData(listName: string, columnsToRetrieve: string, props: IVehicleModuleProps): Promise<any>;
    batchInsert(listName: string, data: any, props: IVehicleModuleProps): Promise<any>;
    batchUpdate(listName: string, data: any, props: IVehicleModuleProps): Promise<any>;
    batchDelete(listName: string, data: any, props: IVehicleModuleProps): Promise<any>;
    uploadFile(folderServerRelativeUrl: string, file: File, props: IVehicleModuleProps): Promise<any>;
    deleteFile(fileServerRelativeUrl: string, props: IVehicleModuleProps): Promise<any>;
    currentProfile(props: IVehicleModuleProps): Promise<any>;
    currentUser(props: IVehicleModuleProps): Promise<any>;
    currentUserGroup(props: IVehicleModuleProps): Promise<any>;
    addAttchmentInList(attFiles: File, listName: string, itemId: number, fileName: string, props: IVehicleModuleProps): Promise<any>;
    getAllItemsRecursively(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, items: any[], startItemId?: number, itemCount?: number, props?: IVehicleModuleProps): Promise<any>;
}
export default async function SPCRUD(): Promise<ISPCRUD> {
    const spCrudOps = SPCRUDOPS();
    const getData = async (listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, props: IVehicleModuleProps) => {
        const items: any[] = await (await spCrudOps).getData(listName, columnsToRetrieve, columnsToExpand, filters, orderby, props);
        return items;
    };
    const getDataAnotherSiteCollection = async (listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, props: IVehicleModuleProps) => {
        const items: any[] = await (await spCrudOps).getDataAnotherSiteCollection(listName, columnsToRetrieve, columnsToExpand, filters, orderby, props);
        return items;
    };
    const insertData = async (listName: string, data: any, props: IVehicleModuleProps) => {
        const result: any = await (await spCrudOps).insertData(listName, data, props);
        // await sp.web.lists.add("My new list");
        return result;
    };
    const updateData = async (listName: string, itemId: number, data: any, props: IVehicleModuleProps) => {
        const result: any = await (await spCrudOps).updateData(listName, itemId, data, props);
        return result;
    };
    const deleteData = async (listName: string, itemId: number, props: IVehicleModuleProps) => {
        const result: any = await (await spCrudOps).deleteData(listName, itemId, props);
        return result;
    };
    const getListInfo = async (listName: string, props: IVehicleModuleProps) => {
        const list: any = await (await spCrudOps).getListInfo(listName, props);
        return list;
    };
    const getListData = async (listName: string, columnsToRetrieve: string, props: IVehicleModuleProps) => {
        const list: any = await (await spCrudOps).getListData(listName, columnsToRetrieve, props);
        return list;
    };
    const batchInsert = async (listName: string, data: any, props: IVehicleModuleProps) => {
        const result: any = await (await spCrudOps).batchInsert(listName, data, props);
        return result;
    };
    const batchUpdate = async (listName: string, data: any, props: IVehicleModuleProps) => {
        const result: any = await (await spCrudOps).batchUpdate(listName, data, props);
        return result;
    };
    const batchDelete = async (listName: string, data: any, props: IVehicleModuleProps) => {
        const result: any = await (await spCrudOps).batchDelete(listName, data, props);
        return result;
    };
    const uploadFile = async (folderServerRelativeUrl: string, file: File, props: IVehicleModuleProps) => {
        const result: any = await (await spCrudOps).uploadFile(folderServerRelativeUrl, file, props);
        return result;
    };
    const deleteFile = async (fileServerRelativeUrl: string, props: IVehicleModuleProps) => {
        const result: any = await (await spCrudOps).deleteFile(fileServerRelativeUrl, props);
        return result;
    };
    const currentProfile = async (props: IVehicleModuleProps) => {
        const result: any = await (await spCrudOps).currentProfile( props);
        return result;
    };
    const currentUser = async (props: IVehicleModuleProps) => {
        const result: any = await (await spCrudOps).currentUser( props);
        return result;
    };
    const currentUserGroup = async (props: IVehicleModuleProps) => {
        const result: any = await (await spCrudOps).currentUserGroup( props);
        return result;
    };
    const getAllItemsRecursively = async (listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, items1: any[] = [], startItemId?: number, itemCount?: number, props?: IVehicleModuleProps) => {
        const items: any[] = await (await spCrudOps).getAllItemsRecursively(listName, columnsToRetrieve, columnsToExpand, filters, orderby, items1, startItemId, itemCount, props);
        return items;
    };
    const addAttchmentInList = async (attFiles: File, listName: string, itemId: number, fileName: string, props: IVehicleModuleProps) => {
        const result: any = await (await spCrudOps).addAttchmentInList(attFiles, listName, itemId, fileName, props);
        return result;
    };
    return {
        getData,
        getDataAnotherSiteCollection,
        insertData,
        updateData,
        deleteData,
        getListInfo,
        getListData,
        batchInsert,
        batchUpdate,
        batchDelete,
        uploadFile,
        deleteFile,
        currentProfile,
        currentUser,
        currentUserGroup,
        getAllItemsRecursively,
        addAttchmentInList
    };
}