import "@pnp/sp/lists";
import "@pnp/sp/items";
// import { IPatelEngProps } from "../../components/IPatelEngProps";
import { IPatelEngProps } from "../../../components/IPatelEngProps";
import SPCRUDOPS from "../../DAL/spcrudops";
 
export interface ISPCRUD {
    getData(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, props: IPatelEngProps): Promise<any>;
    insertData(listName: string, data: any, props: IPatelEngProps): Promise<any>;
    updateData(listName: string, itemId: number, data: any, props: IPatelEngProps): Promise<any>;
    deleteData(listName: string, itemId: number, props: IPatelEngProps): Promise<any>;
    getListInfo(listName: string, props: IPatelEngProps): Promise<any>;
    getListData(listName: string, columnsToRetrieve: string, props: IPatelEngProps): Promise<any>;
    batchInsert(listName: string, data: any, props: IPatelEngProps): Promise<any>;
    batchUpdate(listName: string, data: any, props: IPatelEngProps): Promise<any>;
    batchDelete(listName: string, data: any, props: IPatelEngProps): Promise<any>;
    createFolder(listName: string, folderName: string, props: IPatelEngProps):Promise<any>;

    uploadFile(folderServerRelativeUrl: string, file: File, props: IPatelEngProps): Promise<any>;
    deleteFile(fileServerRelativeUrl: string, props: IPatelEngProps): Promise<any>;
    currentProfile(props: IPatelEngProps): Promise<any>;
    //currentUserProfile(props: IDeviationuatProps): Promise<any>;
    getLoggedInSiteGroups(props: IPatelEngProps): Promise<any>;
    getAllSiteGroups(props: IPatelEngProps): Promise<any>;
    getTopData(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, top: number, props: IPatelEngProps): Promise<any>;
     addAttchmentInList(attFiles: File, listName: string, itemId: number, fileName: string, props: IPatelEngProps): Promise<any>;

}

export default async function SPCRUD(): Promise<ISPCRUD> {
    const spCrudOps = SPCRUDOPS();

    const getData = async (listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, props: IPatelEngProps) => {
        const items: any[] = await (await spCrudOps).getData(listName, columnsToRetrieve, columnsToExpand, filters, orderby, props);
        return items;
    };

    const insertData = async (listName: string, data: any, props: IPatelEngProps) => {
        const result: any = await (await spCrudOps).insertData(listName, data, props);
        return result;
    };

    const updateData = async (listName: string, itemId: number, data: any, props: IPatelEngProps) => {
        const result: any = await (await spCrudOps).updateData(listName, itemId, data, props);
        return result;
    };

    const deleteData = async (listName: string, itemId: number, props: IPatelEngProps) => {
        const result: any = await (await spCrudOps).deleteData(listName, itemId, props);
        return result;
    };

    const getListInfo = async (listName: string, props: IPatelEngProps) => {
        const list: any = await (await spCrudOps).getListInfo(listName, props);
        return list;
    };

    const getListData = async (listName: string, columnsToRetrieve: string, props: IPatelEngProps) => {
        const list: any = await (await spCrudOps).getListData(listName, columnsToRetrieve, props);
        return list;
    };

    const batchInsert = async (listName: string, data: any, props: IPatelEngProps) => {
        const result: any = await (await spCrudOps).batchInsert(listName, data, props);
        return result;
    };

    const batchUpdate = async (listName: string, data: any, props: IPatelEngProps) => {
        const result: any = await (await spCrudOps).batchUpdate(listName, data, props);
        return result;
    };

    const batchDelete = async (listName: string, data: any, props: IPatelEngProps) => {
        const result: any = await (await spCrudOps).batchDelete(listName, data, props);
        return result;
    };
    const createFolder = async (listName: string, folderName: string, props: IPatelEngProps) => {
        const result: any = await (await spCrudOps).createFolder(listName, folderName, props);
        return result;
    };

    const uploadFile = async (folderServerRelativeUrl: string, file: File, props: IPatelEngProps) => {
        const result: any = await (await spCrudOps).uploadFile(folderServerRelativeUrl, file, props);
        return result;
    };

    const deleteFile = async (fileServerRelativeUrl: string, props: IPatelEngProps) => {
        const result: any = await (await spCrudOps).deleteFile(fileServerRelativeUrl, props);
        return result;
    };
    const currentProfile = async (props: IPatelEngProps) => {
        const result: any = await (await spCrudOps).currentProfile( props);
        return result;
    };
    // const currentUserProfile = async (props: IDeviationuatProps) => {
      
    //    // const queryUrl = "https://etgworld.sharepoint.com/sites/UAT_BPM/_api/web/currentuser/groups";
        
    //     const result: any = await (await spCrudOps).currentUserProfile( props);
    //     return result;
    // };
    
    const getLoggedInSiteGroups = async (props: IPatelEngProps) => {
        const groupItems: any[] = await (await spCrudOps).getLoggedInSiteGroups(props);
        return groupItems;
    };
    const getAllSiteGroups = async (props: IPatelEngProps) => {
        const groupItems: any[] = await (await spCrudOps).getAllSiteGroups(props);
        return groupItems;
    };
        const getTopData = async (listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, top: number, props: IPatelEngProps) => {
        const items: any[] = await (await spCrudOps).getTopData(listName, columnsToRetrieve, columnsToExpand, filters, orderby, top, props);
        return items;
    };
    const addAttchmentInList = async (attFiles: File, listName: string, itemId: number, fileName: string, props: IPatelEngProps) => {
        const result: any = await (await spCrudOps).addAttchmentInList(attFiles, listName, itemId, fileName, props);
        return result;
    };

    return {
        getData,
        insertData,
        updateData,
        deleteData,
        getListInfo,
        getListData,
        batchInsert,
        batchUpdate,
        batchDelete,
        createFolder,
        uploadFile,
        deleteFile,
        currentProfile,
      //  currentUserProfile,
        getLoggedInSiteGroups,
        getAllSiteGroups,
        getTopData,
        addAttchmentInList
        

    };
}