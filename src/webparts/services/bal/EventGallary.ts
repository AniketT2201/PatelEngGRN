import { ISafetyPortalProps } from "../../services/interface/ISafetyPortalProps";
import SPCRUDOPS from '../dal/spcrudops';
import {IEventGallary  } from '../interface/IEventGallary';

export interface IEventGallaryOps {
    getEventGallaryData(props: IEventGallary): Promise<IEventGallary[]>;
}

export default function EventGallaryOps() {
    const spCrudOps = SPCRUDOPS();

    const getEventGallaryData = async ( props: ISafetyPortalProps): Promise<IEventGallary[]> => {
        try {
            const spCrudOpsInstance = await spCrudOps;
            const results = await spCrudOpsInstance.getData(
                "Events",
                "*,File/Name,EncodedAbsUrl,Modified",
                "File",
                "Status eq 'Active'",
                { column: 'Modified', isAscending: true }, // Sorting by Modified in descending order
                props
            );
    
            console.log('Results from API:', results);
    
            const brr: Array<IEventGallary> = new Array<IEventGallary>();
            results.map((item: { Id: any; Status: any; EncodedAbsUrl: any; }) => {
                brr.push({
                    Id: item.Id,
                    Status: item.Status,
                    FileUrl: item.EncodedAbsUrl
                });
            });
    
            console.log('Processed Data:', brr);
            return brr;
        } catch (error) {
            console.error('Error in Events:', error.message);
            throw error;
        }
    };
    

    return {
        getEventGallaryData
    };
}
