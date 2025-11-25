// import { ILocationMaster } from "../../INTERFACE/ILocationMaster";
import { IMonthMaster } from "../../INTERFACE/IMonthMaster";
import { IPatelEngProps } from "../../../components/IPatelEngProps";
import SPCRUDOPS from "../../DAL/spcrudops";

export interface IMonthRequestsOps {
    getMonthData(props: IMonthMaster): Promise<IMonthMaster>;
   
}
export default function MonthRequestsOps() {
    const spCrudOps = SPCRUDOPS();

    const getMonthData = async (strFilter: string, sorting: any,props: IPatelEngProps): Promise<IMonthMaster[]> => {
        return await (await spCrudOps).getData("MonthMaster"
            , "*,Month,Status,Title"
            , ""
            , ""
          // , sorting,
         ,{ column: 'Order0', isAscending: true },
             props).then(results => {
                let brr: Array<IMonthMaster> = new Array<IMonthMaster>();
                results.map((item: {  Month:any;
                    Title:any;
                    Id:any;
                    Status:any;
                    }) => {
                    brr.push({
                        Id:item.Id,
                        Month: item.Month,
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
    getMonthData
    };
}