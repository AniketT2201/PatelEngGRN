import { ISafetyPortalProps } from "../../services/interface/ISafetyPortalProps";
import SPCRUDOPS from '../dal/spcrudops';
import { IEvents } from '../interface/IEvents';

export interface IEventsOps {
    getCeoMessageData(props: IEvents): Promise<IEvents[]>;
}

export default function EventsOps() {
    const spCrudOps = SPCRUDOPS();

    const getEventsData = async (props: ISafetyPortalProps): Promise<IEvents[]> => {
        try {
            const spCrudOpsInstance = await spCrudOps;
            const results = await spCrudOpsInstance.getData(
                "Events",
                "*,File/Name,EncodedAbsUrl,Modified",
                "File",
                "Status eq 'Active'",
                { column: 'Modified', isAscending: false }, // Sorting by Modified in descending order
                props
            );

            console.log('Results from Events API:', results);

            const eventsArray: Array<IEvents> = [];
            const today = new Date();
            
            // Normalize today's date by setting the time to 00:00:00 (start of the day)
            today.setHours(0, 0, 0, 0);

            results.map((item: { 
                Id: any; 
                EventName: any; 
                EventDescription: any; 
                StartDate: any; 
                EndDate: any; 
                Status: any; 
                EncodedAbsUrl: any;
                EventDate: any;
                StartTime: any;
                EndTime: any;
                Modified: any;  // Ensure Modified is part of the data
            }) => {
                // Convert StartDate and EndDate to Date objects if they are not already Date objects
                const startDate = new Date(item.StartDate);
                const endDate = new Date(item.EndDate);

                // Ensure valid dates
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    console.error('Invalid date format:', { startDate, endDate });
                }

                // If the event starts and ends on the same day and the event is at night (EndDate is after 6 PM)
                if (startDate.toDateString() === endDate.toDateString() && endDate.getHours() >= 18) {
                    // Set EndDate to the end of the day (11:59:59 PM)
                    endDate.setHours(23, 59, 59, 999);
                }

                // Normalize the EndDate by setting it to 23:59:59 (end of the day)
                const normalizedEndDate = new Date(endDate);
                normalizedEndDate.setHours(23, 59, 59, 999);

                // Only include events that haven't ended yet or are happening today or in the future
                if (normalizedEndDate >= today) {
                    eventsArray.push({
                        Id: item.Id,
                        EventName: item.EventName,
                        StartDate: startDate.toISOString(), // Convert to ISO string if necessary
                        EndDate: normalizedEndDate.toISOString(), // Convert to ISO string if necessary
                        Status: item.Status,
                        FileUrl: item.EncodedAbsUrl,
                        EventDescription: item.EventDescription,
                        EventDate: item.EventDate,
                        StartTime: item.StartTime,
                        EndTime: item.EndTime
                    });
                }
            });

            // Sort events by StartDate in descending order to ensure the latest event is first
            eventsArray.sort((a, b) => new Date(b.StartDate).getTime() - new Date(a.StartDate).getTime());

            console.log('Processed Data:', eventsArray);
            return eventsArray;
        } catch (error) {
            console.error('Error in getCeoMessageData:', error.message);
            throw error;
        }
    };

    return {
        getEventsData
    };
}
