import { IITMaster } from "../../INTERFACE/IITMaster";
import { IPatelEngProps } from "../../../components/IPatelEngProps";
import SPCRUDOPS from "../../DAL/spcrudops";
export interface IIITRequestsOps {
    getIITMasterData(props: IITMaster): Promise<IITMaster>;

    
}

export default function IITRequestsOps() {
    const spCrudOps = SPCRUDOPS();

    const getIITMasterData = async (strFilter: string, sorting: any,props: IPatelEngProps): Promise<IITMaster[]> => {
        return await (await spCrudOps).getData("IT"
            , "*,PlantCode/PlantCode,Category/Category,SubCategory/SubCategory,AddType/TypeName,BillingCycle/BillingCycle,BillingMonth/Month,Year/Year"
            , "PlantCode,Category,SubCategory,AddType,BillingCycle,BillingMonth,Year"
            , ""
          // , sorting,
         ,{ column: 'Order0', isAscending: true },
             props).then(results => {
                let brr: Array<IITMaster> = new Array<IITMaster>();
                results.map((item: {PlantCodeId?: number;
                    CategoryId?:number;
                    SubCategoryId?:number;
                    AddTypeId?:number;
                    Location :any;
                    OTC:any;
                    Recurring:any;
                    BillingCycleId?:number; 
                    Id:any;
                    BillingMonthId: number;
                    YearId: number;
                    //ApproverNameEMail?: string[];
                    Budgeted:any;
                    PONumber:any;
                    POValue:any;
                    Total:any;
                    Actual:any;
                    ProjectName:any;
                    }) => {
                    brr.push({
                        Id:item.Id,
                        PlantCodeId: item.PlantCodeId,
                        CategoryId: item.CategoryId,
                        SubCategoryId:item.SubCategoryId, 
                        AddTypeId:item.AddTypeId,
                        Location:item.Location,
                        OTC:item.OTC,
                        Recurring:item.Recurring,
                        BillingCycleId:item.BillingCycleId,
                        BillingMonthId:item.BillingMonthId,
                        YearId:item.YearId,
                        Budgeted:item.Budgeted,
                        PONumber:item.PONumber,
                        POValue:item.POValue,
                        Total:item.Total,
                        Actual:item.Actual,
                        ProjectName:item.ProjectName
                       
                    });
                });
                return brr;
            }
            );
    //});
};

return {
    getIITMasterData
    };
}