import { IVehicleModuleProps } from '../../../webparts/vehicleModule/components/IVehicleModuleProps';
import { IList, Web } from "@pnp/sp/presets/all";
import { sp } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { ConsoleListener, Logger, LogLevel } from "@pnp/logging";
import { ENV_CONFIG } from '../../../Enviroment/envConfig';
export interface ISPCRUDOPS {
    addAttchmentInList(attFiles: File, listName: string, itemId: number, fileName: string, props: IVehicleModuleProps): any;
    getData(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean}, props: IVehicleModuleProps): Promise<any>;
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
    getAllItemsRecursively(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean}, items: any[], startItemId?: number, itemCount?: number, props?: IVehicleModuleProps): Promise<any>;
}
export default async function SPCRUDOPS(): Promise<ISPCRUDOPS> {
    const getData = async (listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string, orderby: {column: string, isAscending: boolean}, props: IVehicleModuleProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        const items: any[] = await web.lists.getByTitle(listName).items.select(columnsToRetrieve).expand(columnsToExpand).filter(filters).orderBy(orderby.column, orderby.isAscending).getAll();
        return items;
    };
    const getDataAnotherSiteCollection = async (listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string, orderby: {column: string, isAscending: boolean}, props: IVehicleModuleProps) => {
        // let web = Web("https://sharepointwebssse.eximbankindia.in/");
         let web = Web(ENV_CONFIG.rootSiteUrl);

       // let web = Web("https://sharepointweb.eximbankindia.in/"); for prod
        const items: any[] = await web.lists.getByTitle(listName).items.select(columnsToRetrieve).expand(columnsToExpand).filter(filters).orderBy(orderby.column, orderby.isAscending).getAll();
        return items;
    };
    const insertData = async (listName: string, data: any, props: IVehicleModuleProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        return await web.lists.getByTitle(listName).items.add(data).then(result => {
            return result;
        });
    };
    const updateData = async (listName: string, itemId: number, data: any, props: IVehicleModuleProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        return await web.lists.getByTitle(listName).items.getById(itemId).update(data).then(result => {
            return result;
        });
    };
    const deleteData = async (listName: string, itemId: number, props: IVehicleModuleProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        return await web.lists.getByTitle(listName).items.getById(itemId).delete().then(result => {
            return result;
        });
    };
    const getListInfo = async (listName: string, props: IVehicleModuleProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        const list = await web.lists.getByTitle(listName);
        const listInfo = await list.select("Id,Title")();
        return listInfo;
    };
    const getListData = async (listName: string, columnsToRetrieve: string, props: IVehicleModuleProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        const list = await web.lists.getByTitle(listName).items.select(columnsToRetrieve);
        //const listInfo = await list.select("Id,Title")();
        return list;
    };
    const batchInsert = async (listName: string, data: any, props: IVehicleModuleProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        let list = web.lists.getByTitle(listName);
        const entityTypeFullName = await list.getListItemEntityTypeFullName();
        let batch = web.createBatch();
        for (let d = 0; d < data.length; d++) {
            await list.items.inBatch(batch).add(data[d], entityTypeFullName).then(b => {
                console.log(b);
            });
        }
        return await batch.execute();
    };
    const batchUpdate = async (listName: string, data: any, props: IVehicleModuleProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        let list = web.lists.getByTitle(listName);
        const entityTypeFullName = await list.getListItemEntityTypeFullName();
        let batch = web.createBatch();
        for (let d = 0; d < data.length; d++) {
            await list.items.getById(data[d].Id).inBatch(batch).update(data[d], entityTypeFullName).then(b => {
                console.log(b);
            });
        }
        return await batch.execute();
    };
    const batchDelete = async (listName: string, data: any, props: IVehicleModuleProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        let list = web.lists.getByTitle(listName);
        const entityTypeFullName = await list.getListItemEntityTypeFullName();
        let batch = web.createBatch();
        for (let d = 0; d < data.length; d++) {
            await list.items.getById(data[d].Id).inBatch(batch).delete().then(b => {
                console.log(b);
            });
        }
        return await batch.execute();
    };
    const uploadFile = async (folderServerRelativeUrl: string, file: File, props: IVehicleModuleProps) => {
        Logger.subscribe(new ConsoleListener());
        Logger.activeLogLevel = LogLevel.Verbose;
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        let ticks = ((new Date().getTime() * 10000) + 621355968000000000);
        return await web.getFolderByServerRelativeUrl(folderServerRelativeUrl).files.addChunked(ticks.toString() + "_" + file.name, file, data => {
            Logger.log({ data: data, level: LogLevel.Verbose, message: "progress" });
        }, true);
    };
    const deleteFile = async (fileServerRelativeUrl: string, props: IVehicleModuleProps) => {
        Logger.subscribe(new ConsoleListener());
        Logger.activeLogLevel = LogLevel.Verbose;
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        return await web.getFileByServerRelativeUrl(fileServerRelativeUrl).delete().then(result => {
            return result;
        });
    };
    const currentProfile = async (props: IVehicleModuleProps) => {
        return await sp.profiles.myProperties.get().then((response)=>{
            //return await sp.web.currentUser.get().then((response)=>{
                console.log(response);
            return response;
          })
    };
    const currentUser = async (props: IVehicleModuleProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        return await web.currentUser.get().then((response)=>{
            //return await sp.web.currentUser.get().then((response)=>{
                console.log(response);
            return response;
          })
    };
    const currentUserGroup = async (props: IVehicleModuleProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        return await web.currentUser.groups.get().then((response)=>{
            //return await sp.web.currentUser.get().then((response)=>{
                console.log(response);
            return response;
          })
    };
    const getAllItemsRecursively = async (listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string, orderby: {column: string, isAscending: boolean}, items1: any[] = [], startItemId?: number, itemCount?: number, props?: IVehicleModuleProps) => {
        const query = startItemId > 0 ? `ID gt ${startItemId}` : "";
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        const items: any[] = await web.lists.getByTitle(listName).items.select(columnsToRetrieve).expand(columnsToExpand).filter(query).orderBy(orderby.column, orderby.isAscending).top(itemCount).getAll();
        if (items.length === 0) {
            return items1;
        }else{
            items1.push(...items);
            const lastItemId = items[items.length - 1].Id;
            return await this.getAllItemsRecursively(listName, columnsToRetrieve, columnsToExpand, filters, { column: 'Id', isAscending: true }, items1, lastItemId, 5000, props);                                    
        }
    };
    const addAttchmentInList = async (file: File, listName: string, itemId: number, fileName: string, props: IVehicleModuleProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        return await web.lists.getByTitle(listName).items.getById(itemId).attachmentFiles.add(fileName, file).then(result => {
            return result;
        });
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