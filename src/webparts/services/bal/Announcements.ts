import { ISafetyPortalProps } from "../../services/interface/ISafetyPortalProps";
import SPCRUDOPS from '../dal/spcrudops';
import {  IAnnouncements} from '../interface/IAnnouncements';

export interface IAnnouncementsOps {
    getAnnouncementsData(props: IAnnouncements): Promise<IAnnouncements[]>;
}

export default function AnnouncementsOps() {
    const spCrudOps = SPCRUDOPS();

    const getAnnouncementsData = async ( props: ISafetyPortalProps): Promise<IAnnouncements[]> => {
        try {
            const spCrudOpsInstance = await spCrudOps;
            const results = await spCrudOpsInstance.getData(
                "Announcements",
                "*,File/Name,EncodedAbsUrl,Modified",
                "File",
                "Status eq 'Active'",
                { column: 'ID', isAscending: false }, // Sorting by Modified in descending order
                props
            );
    
            console.log('Results from API:', results);
    
            const brr: Array<IAnnouncements> = new Array<IAnnouncements>();
            results.map((item: { Id: any; Name:any; File: unknown; Status: any; EncodedAbsUrl: any;Header:any;SubHeader:any; AnnouncementDescription:any;AnnouncementDate:any;}) => {
                brr.push({
                    Id: item.Id,
                    Name:item.Name,
                    File: item.File,
                    Status: item.Status,
                    FileUrl: item.EncodedAbsUrl,
                    Header:item.Header,
                    SubHeader:item.SubHeader,
                    AnnouncementDescription:item.AnnouncementDescription,
                    AnnouncementDate:item.AnnouncementDate
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
        getAnnouncementsData
    };
}
