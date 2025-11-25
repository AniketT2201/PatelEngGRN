import { IBillCycleMaster } from "../../INTERFACE/IBillCycleMaster";
import { IPatelEngProps } from "../../../components/IPatelEngProps";
import SPCRUDOPS from "../../DAL/spcrudops";

export interface IBillCycleRequestsOps {
    getBicycleData(props: IBillCycleMaster): Promise<IBillCycleMaster>;

    
}
export default function BillCycleRequestsOps() {
    const spCrudOps = SPCRUDOPS();

    const getBicycleData = async (strFilter: string, sorting: any,props: IPatelEngProps): Promise<IBillCycleMaster[]> => {
        return await (await spCrudOps).getData("BillCycleMaster"
            , "*,BillingCycle,Status,Title"
            , ""
            , ""
          // , sorting,
         ,{ column: 'Order0', isAscending: true },
             props).then(results => {
                let brr: Array<IBillCycleMaster> = new Array<IBillCycleMaster>();
                results.map((item: { Id: any; BillingCycle :any;
                    Status:any;
                    Title:any;
                    }) => {
                    brr.push({
                        Id:item.Id,
                        BillingCycle: item.BillingCycle,
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
    getBicycleData
    };
}