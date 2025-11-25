import { ISafetyPortalProps } from "../../services/interface/ISafetyPortalProps";
import SPCRUDOPS from '../dal/spcrudops';
import { ICertificates } from '../interface/ICertificates';

export interface ICertificatesOps {
    getCertificatesData(props: ISafetyPortalProps): Promise<ICertificates[]>;
}

export default function CertificatesOps() {
    const spCrudOps = SPCRUDOPS();

    const getCertificatesData = async (props: ISafetyPortalProps): Promise<ICertificates[]> => {
        try {
            const spCrudOpsInstance = await spCrudOps;
            const results = await spCrudOpsInstance.getData(
                "Certificates",
                "*,Title,File/Name,File/EncodedAbsUrl,File/ServerRedirectedEmbedUrl,Status,Modified",
                "File",
                "Status eq 'Active'",
                { column: 'Modified', isAscending: true }, // Sorting by Modified in descending order
                props
            );

            console.log('Results from Policies API:', results);

            const brr: Array<ICertificates> = new Array<ICertificates>();
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
            console.error('Error in getCertificatesData:', error.message);
            throw error;
        }
    };

    return {
        getCertificatesData
    };
}
