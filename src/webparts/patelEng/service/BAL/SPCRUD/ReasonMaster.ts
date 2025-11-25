import { IReasonMaster } from "../../INTERFACE/IReasonMaster";
import { IPatelEngProps } from "../../../components/IPatelEngProps";
import SPCRUDOPS from "../../DAL/spcrudops";

export interface IReasonRequestsOps {
    getReasonMasterData(props: IReasonMaster): Promise<IReasonMaster>;
    getReasonMasterDataAll(props: IReasonMaster): Promise<IReasonMaster>;

    

    
}

export default function ReasonRequestsOps() {
    const spCrudOps = SPCRUDOPS();

    const getReasonMasterData = async (props: IPatelEngProps): Promise<IReasonMaster[]> => {
        return await (await spCrudOps).getData("ReasonMaster"
            , "*,Reason,Status,Title"
            , ""
            , "Status eq 'Active'"
          // , sorting,
         ,{ column: 'Order0', isAscending: true },
             props).then(results => {
                let brr: Array<IReasonMaster> = new Array<IReasonMaster>();
                results.map((item: { Status :any;
                    Reason :any;
                    Title:any;
                    Id:any;
                    }) => {
                    brr.push({
                        Id:item.Id,
                        Reason: item.Reason,
                        Status:item.Status, 
                        Title:item.Title
                       
                    });
                });
                return brr;
            }
            );
    //});
};
const getReasonMasterDataAll = async (props: IPatelEngProps): Promise<IReasonMaster[]> => {
    return await (await spCrudOps).getData("ReasonMaster"
        , "*,Reason,Status,Title"
        , ""
        , ""
      // , sorting,
     ,{ column: 'Order0', isAscending: true },
         props).then(results => {
            let brr: Array<IReasonMaster> = new Array<IReasonMaster>();
            results.map((item: { Status :any;
                Reason :any;
                Title:any;
                Id:any;
                }) => {
                brr.push({
                    Id:item.Id,
                    Reason: item.Reason,
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
    getReasonMasterData,getReasonMasterDataAll
    };
}