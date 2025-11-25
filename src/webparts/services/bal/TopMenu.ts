

import SPCRUDOPS from '../dal/spcrudops';
import { ITopMenu } from '../interface/ITopMenu';
import { ISafetyPortalProps } from "../interface/ISafetyPortalProps";

export interface ITopMenuOps {
    getTopMenuData(props: ITopMenu): Promise<ITopMenu[]>;
}
export default function TopMenuOps() {
    const spCrudOps = SPCRUDOPS();

    const getTopMenuData = async ( props: ISafetyPortalProps): Promise<ITopMenu[]> => {
        try {
            const spCrudOpsInstance = await spCrudOps;
            const results = await spCrudOpsInstance.getData(
                "TopMenu",
                "*",
                "",
                "",
                { column: 'ID', isAscending: true }, // Sorting by Modified in descending order
                props
            );
    
            console.log('Results from API of TopMenu:', results);
    
            const brr: Array<ITopMenu> = new Array<ITopMenu>();
            results.map((item: { Id: any; Title: any; ParantId: unknown; DisplayOrder: any; Url: any; Link: any;}) => {
                brr.push({
                    Id: item.Id,
                    ParantId: item.ParantId,
                    DisplayOrder: item.DisplayOrder,
                   Url: item.Url ? item.Url.Description : '',
                    Link: item.Link,
                    Title:item.Title
                });
            });
    
            console.log('Processed Data:', brr);
            return brr;
        } catch (error) {
            console.error('Error in getTopMenuData:', error.message);
            throw error;
        }
    };
    

    return {
        getTopMenuData
    };
}
