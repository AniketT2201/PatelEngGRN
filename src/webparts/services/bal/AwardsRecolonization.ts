import { ISafetyPortalProps } from "../../services/interface/ISafetyPortalProps";
import SPCRUDOPS from '../dal/spcrudops';
import {  IAwardsRecolonization} from '../interface/IAwardsRecolonization';

export interface IAwardsRecolonizationOps {
    getAnnouncementsData(props: IAwardsRecolonization): Promise<IAwardsRecolonization[]>;
}

export default function AwardsRecolonizationOps() {
    const spCrudOps = SPCRUDOPS();

    const getAwardsRecolonizationData = async ( props: ISafetyPortalProps): Promise<IAwardsRecolonization[]> => {
        try {
            const spCrudOpsInstance = await spCrudOps;
            const results = await spCrudOpsInstance.getData(
                "AwardsRecolonization",
                "*,File/Name,EncodedAbsUrl,Modified",
                "File",
                "Status eq 'Active'",
                { column: 'ID', isAscending: false }, // Sorting by Modified in descending order
                props
            );
    
            console.log('Results from API:', results);
    
            const brr: Array<IAwardsRecolonization> = new Array<IAwardsRecolonization>();
            results.map((item: { Id: any; Name:any; File: unknown; Status: any; EncodedAbsUrl: any;NameofEmployee:any;Position:any; AwardsDescription:any;}) => {
                brr.push({
                    Id: item.Id,
                    Name:item.Name,
                    File: item.File,
                    Status: item.Status,
                    FileUrl: item.EncodedAbsUrl,
                    NameofEmployee:item.NameofEmployee,
                    Position:item.Position,
                    AwardsDescription:item.AwardsDescription
                });
            });
    
            console.log('Processed Data:', brr);
            return brr;
        } catch (error) {
            console.error('Error in getAnnouncementsData:', error.message);
            throw error;
        }
    };
    

    return {
        getAwardsRecolonizationData
    };
}
