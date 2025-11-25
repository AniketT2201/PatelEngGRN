import { ISafetyPortalProps } from '../interface/ISafetyPortalProps';
//import { Web } from "@pnp/sp/presets/all";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import useSPCRUDOPS, { ISPCRUDOPS } from '../../services/dal/spcrudops';
import SPCRUDOPS from '../../services/dal/spcrudops';


export interface ISPCRUD {
    getData(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, props: ISafetyPortalProps): Promise<any>;
    insertData(listName: string, data: any, props: ISafetyPortalProps): Promise<any>;
    updateData(listName: string, itemId: number, data: any, props: ISafetyPortalProps): Promise<any>;
    deleteData(listName: string, itemId: number, props: ISafetyPortalProps): Promise<any>;
    getListInfo(listName: string, props: ISafetyPortalProps): Promise<any>;
    batchInsert(listName: string, data: any, props: ISafetyPortalProps): Promise<any>;
    batchUpdate(listName: string, data: any, props: ISafetyPortalProps): Promise<any>;
    batchDelete(listName: string, data: any, props: ISafetyPortalProps): Promise<any>;
    uploadFile(folderServerRelativeUrl: string, file: File, props: ISafetyPortalProps): Promise<any>;
    deleteFile(fileServerRelativeUrl: string, props: ISafetyPortalProps): Promise<any>;
    getNavigation(props: ISafetyPortalProps): Promise<any>;
    getNewNavigation(props: ISafetyPortalProps): Promise<any>;
    currentProfile(props: ISafetyPortalProps): Promise<any>;
    currentUserProfile(props: ISafetyPortalProps): Promise<any>;
    getLoggedInSiteGroups(props: ISafetyPortalProps): Promise<any>;
    getAllSiteGroups(props: ISafetyPortalProps): Promise<any>;
    // currentUserGroup(props: ISafetyPortalProps): Promise<any>;

}

export default async function SPCRUD(): Promise<ISPCRUD> {
    const spCrudOps = SPCRUDOPS();

    const getData = async (listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, props: ISafetyPortalProps) => {
        const items: any[] = await (await spCrudOps).getData(listName, columnsToRetrieve, columnsToExpand, filters, orderby, props);
        return items;
    };

    const insertData = async (listName: string, data: any, props: ISafetyPortalProps) => {
        const result: any = await (await spCrudOps).insertData(listName, data, props);
        return result;
    };

    const updateData = async (listName: string, itemId: number, data: any, props: ISafetyPortalProps) => {
        const result: any = await (await spCrudOps).updateData(listName, itemId, data, props);
        return result;
    };

    const deleteData = async (listName: string, itemId: number, props: ISafetyPortalProps) => {
        const result: any = await (await spCrudOps).deleteData(listName, itemId, props);
        return result;
    };

    const getListInfo = async (listName: string, props: ISafetyPortalProps) => {
        const list: any = await (await spCrudOps).getListInfo(listName, props);
        return list;
    };

    const batchInsert = async (listName: string, data: any, props: ISafetyPortalProps) => {
        const result: any = await (await spCrudOps).batchInsert(listName, data, props);
        return result;
    };

    const batchUpdate = async (listName: string, data: any, props: ISafetyPortalProps) => {
        const result: any = await (await spCrudOps).batchUpdate(listName, data, props);
        return result;
    };

    const batchDelete = async (listName: string, data: any, props: ISafetyPortalProps) => {
        const result: any = await (await spCrudOps).batchDelete(listName, data, props);
        return result;
    };
    const uploadFile = async (folderServerRelativeUrl: string, file: File, props: ISafetyPortalProps) => {
        const result: any = await (await spCrudOps).uploadFile(folderServerRelativeUrl, file, props);
        return result;
    };
    const deleteFile = async (fileServerRelativeUrl: string, props: ISafetyPortalProps) => {
        const result: any = await (await spCrudOps).deleteFile(fileServerRelativeUrl, props);
        return result;
    };
    const getNavigation = async (props: ISafetyPortalProps) => {
        const result: any = await (await spCrudOps).getNavigation(props);
        return result;
    };    
    const getNewNavigation = async (props: ISafetyPortalProps) => {
        const result: any = await (await spCrudOps).getNewNavigation(props);
        return result;
    };

    const currentProfile = async (props: ISafetyPortalProps) => {
        const result: any = await (await spCrudOps).currentProfile( props);
        return result;
    };
    const currentUserProfile = async (props: ISafetyPortalProps) => {
      
       // const queryUrl = "https://etgworld.sharepoint.com/sites/UAT_BPM/_api/web/currentuser/groups";
        
        const result: any = await (await spCrudOps).currentUserProfile( props);
        return result;
    };
    const getLoggedInSiteGroups = async (props: ISafetyPortalProps) => {
        const groupItems: any[] = await (await spCrudOps).getLoggedInSiteGroups(props);
        return groupItems;
    };
    const getAllSiteGroups = async (props: ISafetyPortalProps) => {
        const groupItems: any[] = await (await spCrudOps).getAllSiteGroups(props);
        return groupItems;
    };
    // const currentUserGroup = async (props: ISafetyPortalProps) => {
    //     const result: any = await (await spCrudOps).currentUserGroup( props);
    //     return result;
    // };


    return {
        getData,
        insertData,
        updateData,
        deleteData,
        getListInfo,
        batchInsert,
        batchUpdate,
        batchDelete,
        uploadFile,
        deleteFile,
        getNavigation,
        getNewNavigation,
        currentProfile,
        currentUserProfile,
        getLoggedInSiteGroups,
        getAllSiteGroups,
        // currentUserGroup
    };
}