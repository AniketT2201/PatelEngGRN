import { ILocationMaster } from "../../INTERFACE/ILocationMaster";
import { IPatelEngProps } from "../../../components/IPatelEngProps";
import SPCRUDOPS from "../../DAL/spcrudops";

export interface IILocationRequestsOps {
    getLocationData(props: ILocationMaster): Promise<ILocationMaster>;
   
}
export default function LocationRequestsOps() {
    const spCrudOps = SPCRUDOPS();

    const getLocationData = async (strFilter: string, sorting: any,props: IPatelEngProps): Promise<ILocationMaster[]> => {
        return await (await spCrudOps).getData("LocationMaster"
            , "*,BillingCycle,Status,Title"
            , ""
            , ""
          // , sorting,
         ,{ column: 'Order0', isAscending: true },
             props).then(results => {
                let brr: Array<ILocationMaster> = new Array<ILocationMaster>();
                results.map((item: { Location:any;
                    Title:any;
                    Id:any;
                    Status:any;
                    }) => {
                    brr.push({
                        Id:item.Id,
                        Location: item.Location,
                        Status:item.Status, 
                        Title:item.Title
                       
                    });
                });
                return brr;
            }
            );
    //});
};

return {
    getLocationData
    };
}