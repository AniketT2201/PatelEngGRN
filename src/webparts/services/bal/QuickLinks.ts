import { ISafetyPortalProps } from "../../services/interface/ISafetyPortalProps";
import SPCRUDOPS from '../dal/spcrudops';
import { IQuickLinks } from '../interface/IQuickLinks';

export interface IQuickLinksOps {
    getQuickLinksData(props: ISafetyPortalProps): Promise<IQuickLinks[]>;
}

export default function QuickLinksOps() {
    const spCrudOps = SPCRUDOPS();

    const getQuickLinksData = async ( props: ISafetyPortalProps): Promise<IQuickLinks[]> => {
        try {
            const spCrudOpsInstance = await spCrudOps;
            const results = await spCrudOpsInstance.getData(
                "QuickLinks",
                "*,File/Name,EncodedAbsUrl,Modified",
                "File",
                "Status eq 'Active'",
                { column: 'ID', isAscending: false }, // Sorting by Modified in descending order
                props
            );
    
            console.log('Results from API:', results);
    
            const brr: Array<IQuickLinks> = new Array<IQuickLinks>();
            results.map((item: { Id: any; Name:any;LinkName:any; File: unknown; Status: any; EncodedAbsUrl: any; Url:any; }) => {
                brr.push({
                    Id: item.Id,
                    Name:item.Name,
                    LinkName:item.LinkName,
                    File: item.File,
                    Status: item.Status,
                    FileUrl: item.EncodedAbsUrl,
                    Url:item.Url
                });
            });
    
            console.log('Processed Data:', brr);
            return brr;
        } catch (error) {
            console.error('Error in getQuickLinksData:', error.message);
            throw error;
        }
    };
    

    return {
        getQuickLinksData
    };
}
