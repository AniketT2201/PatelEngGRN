import { ISafetyPortalProps } from "../../services/interface/ISafetyPortalProps";
import SPCRUDOPS from '../dal/spcrudops';
import {ICeoMessage  } from '../interface/ICeoMessage';

export interface ICeoMessageOps {
    getCeoMessageData(props: ICeoMessage): Promise<ICeoMessage[]>;
}

export default function CeoMessageOps() {
    const spCrudOps = SPCRUDOPS();

    const getCeoMessageData = async ( props: ISafetyPortalProps): Promise<ICeoMessage[]> => {
        try {
            const spCrudOpsInstance = await spCrudOps;
            const results = await spCrudOpsInstance.getData(
                "CeoMessage",
                "*,File/Name,EncodedAbsUrl,Modified",
                "File",
                "Status eq 'Active'",
                { column: 'ID', isAscending: false }, // Sorting by Modified in descending order
                props
            );
    
            console.log('Results from API:', results);
    
            const brr: Array<ICeoMessage> = new Array<ICeoMessage>();
            results.map((item: { Id: any; Name:any; CeoMessage:any; File: unknown; Status: any; EncodedAbsUrl: any; }) => {
                brr.push({
                    Id: item.Id,
                    Name:item.Name,
                    File: item.File,
                    Status: item.Status,
                    FileUrl: item.EncodedAbsUrl,
                    CeoMessage:item.CeoMessage
                });
            });
    
            console.log('Processed Data:', brr);
            return brr;
        } catch (error) {
            console.error('Error in getCeoMessageData:', error.message);
            throw error;
        }
    };
    

    return {
        getCeoMessageData
    };
}
