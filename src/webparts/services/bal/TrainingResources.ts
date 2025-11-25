import { ISafetyPortalProps } from "../../services/interface/ISafetyPortalProps";
import SPCRUDOPS from '../dal/spcrudops';
import { ITrainingResources } from '../interface/ITrainingResources';

export interface ITrainingResourcesOps {
    getTrainingResourcesData(props: ISafetyPortalProps): Promise<ITrainingResources[]>;
}

export default function TrainingResourcesOps() {
    const spCrudOps = SPCRUDOPS();

    const getTrainingResourcesData = async (props: ISafetyPortalProps): Promise<ITrainingResources[]> => {
        try {
            const spCrudOpsInstance = await spCrudOps;
            const results = await spCrudOpsInstance.getData(
                "TrainingResources",
                "*,Title,File/Name,File/EncodedAbsUrl,File/ServerRedirectedEmbedUrl,Status,Modified",
                "File",
                "Status eq 'Active'",
                { column: 'Modified', isAscending: false }, // Sorting by Modified in descending order
                props
            );

            console.log('Results from Training Resources API:', results);

            const brr: Array<ITrainingResources> = new Array<ITrainingResources>();
            results.map((item: { Id: any; Title: any; File: { Name: string, EncodedAbsUrl: string }; Status: any; EncodedAbsUrl: any;ServerRedirectedEmbedUrl: any;}) => {
                brr.push({
                    Id: item.Id,
                    Title: item.Title,
                    // Extract the file name, encoded URL, and embed URL
                    File: {
                        Name: item.File.Name, // File name
                        EncodedAbsUrl: item.File.EncodedAbsUrl, // File URL
                        // Embed URL or file type (for image)
                    },
                    Status: item.Status,
                    EncodedAbsUrl: item.EncodedAbsUrl,
                    ServerRedirectedEmbedUrl:item.ServerRedirectedEmbedUrl // This could be used if needed elsewhere
                });
            });

            console.log('Processed Data:', brr);
            return brr;
        } catch (error) {
            console.error('Error in getTrainingResourcesData:', error.message);
            throw error;
        }
    };

    return {
        getTrainingResourcesData
    };
}
