// import { ISafetyPortalProps } from '../../patelEnggHub/components/ISafetyPortalProps';
import { ISafetyPortalProps } from '../interface/ISafetyPortalProps';
import { IList, Web } from "@pnp/sp/presets/all";
import "@pnp/sp/lists";
import "@pnp/sp/items";
// import { Search } from "@pnp/sp/search";
import "@pnp/sp/search";
import { sp } from "@pnp/sp";
import { ISearchQuery, SearchResults, SearchQueryBuilder } from "@pnp/sp/search";
import { ConsoleListener, Logger, LogLevel } from "@pnp/logging";

export interface ISPCRUDOPS {
    getData(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean}, props: ISafetyPortalProps): Promise<any>;
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

export default async function SPCRUDOPS(): Promise<ISPCRUDOPS> {
    const getData = async (listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string, orderby: {column: string, isAscending: boolean}, props: ISafetyPortalProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        const items: any[] = await web.lists.getByTitle(listName).items.select(columnsToRetrieve).expand(columnsToExpand).filter(filters).orderBy(orderby.column, orderby.isAscending).get();
        return items;
    };

    const insertData = async (listName: string, data: any, props: ISafetyPortalProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        return await web.lists.getByTitle(listName).items.add(data).then(result => {
            return result;
        });
    };

    const updateData = async (listName: string, itemId: number, data: any, props: ISafetyPortalProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        return await web.lists.getByTitle(listName).items.getById(itemId).update(data).then(result => {
            return result;
        });
    };

    const deleteData = async (listName: string, itemId: number, props: ISafetyPortalProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        return await web.lists.getByTitle(listName).items.getById(itemId).delete().then(result => {
            return result;
        });
    };

    const getListInfo = async (listName: string, props: ISafetyPortalProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        const list = await web.lists.getByTitle(listName);
        const listInfo = await list.select("Id,Title")();

        return listInfo;
    };

    const batchInsert = async (listName: string, data: any, props: ISafetyPortalProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        let list = web.lists.getByTitle(listName);
        const entityTypeFullName = await list.getListItemEntityTypeFullName();
        let batch = web.createBatch();

        for (let d = 0; d < data.length; d++) {
            list.items.inBatch(batch).add(data[d], entityTypeFullName).then(b => {
                console.log(b);
            });
        }

        return await batch.execute();
    };

    const batchUpdate = async (listName: string, data: any, props: ISafetyPortalProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        let list = web.lists.getByTitle(listName);
        const entityTypeFullName = await list.getListItemEntityTypeFullName();
        let batch = web.createBatch();

        for (let d = 0; d < data.length; d++) {
            list.items.getById(data[d].Id).inBatch(batch).update(data[d], entityTypeFullName).then(b => {
                console.log(b);
            });
        }

        return await batch.execute();
    };

    const batchDelete = async (listName: string, data: any, props: ISafetyPortalProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        let list = web.lists.getByTitle(listName);
        const entityTypeFullName = await list.getListItemEntityTypeFullName();
        let batch = web.createBatch();

        for (let d = 0; d < data.length; d++) {
            list.items.getById(data[d].Id).inBatch(batch).delete().then(b => {
                console.log(b);
            });
        }

        return await batch.execute();
    };

    const uploadFile = async (folderServerRelativeUrl: string, file: File, props: ISafetyPortalProps) => {
        Logger.subscribe(new ConsoleListener());
        Logger.activeLogLevel = LogLevel.Verbose;

        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        var ticks = ((new Date().getTime() * 10000) + 621355968000000000);
        return await web.getFolderByServerRelativeUrl(folderServerRelativeUrl).files.addChunked(ticks.toString() + "_" + file.name, file, data => {
            Logger.log({ data: data, level: LogLevel.Verbose, message: "progress" });
        }, true);
    };

    const deleteFile = async (fileServerRelativeUrl: string, props: ISafetyPortalProps) => {
        Logger.subscribe(new ConsoleListener());
        Logger.activeLogLevel = LogLevel.Verbose;

        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);

        return await web.getFileByServerRelativeUrl(fileServerRelativeUrl).delete().then(result => {
            return result;
        });
    };

    const getNewNavigation = async (props: ISafetyPortalProps) => {

        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        //const results: SearchResults = await (await sp.search('contentclass:STS_Site contentclass:STS_Web'));
        const resultsNew : string =await web + "_api/navigation/menustate?mapprovidername='GlobalNavigationSwitchableProvider'&$filter=IsHidden eq 'false'"+get();
        // const resultsNew: SearchResults = await sp.search(<ISearchQuery>{
        //     Querytext: "GlobalNavigationSwitchableProvider",
        //     RowLimit: 100,
        //     EnableInterleaving: true,
        // });
        console.log(resultsNew);
        return resultsNew;

    };
    const getNavigation = async (props: ISafetyPortalProps) => {

        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        //const results: SearchResults = await (await sp.search('contentclass:STS_Site contentclass:STS_Web'));
        const results: SearchResults = await sp.search(<ISearchQuery>{
            // Querytext: "contentclass:STS_Site contentclass:STS_Web",
            Querytext:"https://dv5api.iniitian.com/api/leave/GetTeamList?empno=00015112",
            RowLimit: 100,
            EnableInterleaving: true,
        });
        console.log(results);
        return results;
    };
    const currentProfile = async (props: ISafetyPortalProps) => {
        return await sp.profiles.myProperties.get().then((response)=>{
            //return await sp.web.currentUser.get().then((response)=>{
                console.log(response);
            return response;
          });
    };
    const currentUserProfile = async (props: ISafetyPortalProps) => {
       // return await sp.profiles.myProperties.get().then((response)=>{
            // const queryUrl = `${props.currentSPContext.pageContext.web.absoluteUrl}/_api/web/currentuser/groups`;
            // const siteGroupsData = await props.currentSPContext.pageContext.get(queryUrl);
            // const siteGroups = (await siteGroupsData.json()).value;
            // siteGroups.forEach((siteGroup) => console.log(siteGroup)); 
            //return await sp.web.currentUser.get().then((response)=>{
            //     console.log(response);
            // return response;
          //})
    };
//Current User Belongs which Site Group    
    const getLoggedInSiteGroups = async (props: ISafetyPortalProps) => {
        //let web = Web("https://patelengineering365.sharepoint.com/sites/ArunIII");
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        const groupsItems: any[] = await web.currentUser.groups();
        return groupsItems;
    };

//Get All Group Name from Site

    const getAllSiteGroups = async (props: ISafetyPortalProps) => {
        //let web = Web("https://etgworld.sharepoint.com/sites/UAT_BPM");
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
       const groupsItems: any[] =await sp.web.siteGroups();
        return groupsItems;
    };

    // const currentUserGroup = async (props: ISafetyPortalProps) => {
    //     let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
    //     return await web.currentUser.groups.get().then((response)=>{
    //         //return await sp.web.currentUser.get().then((response)=>{
    //             console.log(response);
    //         return response;
    //       })
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
        // currentUserGroup,
        getAllSiteGroups
    };
}

function get() {
    throw new Error('Function not implemented.');
}
