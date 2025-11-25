import { ISafetyPortalProps } from "../../services/interface/ISafetyPortalProps";
import SPCRUDOPS from '../dal/spcrudops';
import { ITopbanner } from '../interface/ITopBanner';

export interface ITopBannerOps {
    getTopBannerData(props: ITopbanner): Promise<ITopbanner[]>;
}

export default function TopBannerOps() {
    const spCrudOps = SPCRUDOPS();

    const getTopBannerData = async ( props: ISafetyPortalProps): Promise<ITopbanner[]> => {
        try {
            const spCrudOpsInstance = await spCrudOps;
            const results = await spCrudOpsInstance.getData(
                "TopBanner",
                "*,File/Name,EncodedAbsUrl,Modified",
                "File",
                "Status eq 'Active'",
                { column: 'ID', isAscending: false }, // Sorting by Modified in descending order
                props
            );
    
            console.log('Results from API:', results);
    
            const brr: Array<ITopbanner> = new Array<ITopbanner>();
            results.map((item: { Id: any; Name:any; File: unknown; Status: any; EncodedAbsUrl: any; }) => {
                brr.push({
                    Id: item.Id,
                    Name:item.Name,
                    File: item.File,
                    Status: item.Status,
                    FileUrl: item.EncodedAbsUrl
                });
            });
    
            console.log('Processed Data:', brr);
            return brr;
        } catch (error) {
            console.error('Error in getTopBannerData:', error.message);
            throw error;
        }
    };
    

    return {
        getTopBannerData
    };
}
