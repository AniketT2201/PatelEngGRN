

import SPCRUDOPS from '../dal/spcrudops';
import { ISubMenu } from '../interface/ISubMenu';
import { ISafetyPortalProps } from "../interface/ISafetyPortalProps";

export interface ISubMenuOps {
    getSubMenuData(props: ISubMenu): Promise<ISubMenu[]>;
}

export default function SubMenuOps() {
    const spCrudOps = SPCRUDOPS();

    const getSubMenuData = async ( props: ISafetyPortalProps): Promise<ISubMenu[]> => {
        try {
            const spCrudOpsInstance = await spCrudOps;
            const results = await spCrudOpsInstance.getData(
                "SubMenu",
                "*,GroupAccess/Id,GroupAccess/Title",
                "GroupAccess",
                "",
                { column: 'ID', isAscending: true }, // Sorting by Modified in descending order
                props
            );
    
            console.log('Results from API of SubMenu:', results);
    
            const brr: Array<ISubMenu> = new Array<ISubMenu>();
            results.map((item: { Id: any; Title: any; ParantId: unknown; DisplayOrder: any; Url: any; Link: any;GroupAccess:any}) => {
                brr.push({
                    Id: item.Id,
                    ParantId: item.ParantId,
                    DisplayOrder: item.DisplayOrder,
                    Url: item.Url ? item.Url.Url : '',
                    Link: item.Link,
                    Title:item.Title,
                    GroupAccess:item.GroupAccess
                });
            });
    
            console.log('Processed Data:', brr);
            return brr;
        } catch (error) {
            console.error('Error in getSubMenuData:', error.message);
            throw error;
        }
    };
    

    return {
        getSubMenuData
    };
}
