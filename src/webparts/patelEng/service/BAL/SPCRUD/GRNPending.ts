import { IPendingGRN } from "../../INTERFACE/IPendingGRN";
import { IPatelEngProps } from "../../../components/IPatelEngProps";
import SPCRUDOPS from "../../DAL/spcrudops";
// import { string } from "yup";

export interface IPendingGRNRequestsOps {
    getPendingGRNRequestsData(strFilter: string, sorting: any,props: IPendingGRN): Promise<IPendingGRN>;
    getPendingGRNRequestsDatafilter(props: IPendingGRN): Promise<IPendingGRN>;
    
}
export default function PendingGRNRequestsOps() {
    const spCrudOps = SPCRUDOPS();

    const getPendingGRNRequestsData = async (strFilter: string, sorting: any,props: IPatelEngProps): Promise<IPendingGRN[]> => {
        return await (await spCrudOps).getData("PendingGRN"
            , "*,PlantCode/PlantCode,PlantCode/Id,ReasonforPending/Reason,ReasonforPending/Id,NameActiontobetakenby/Title,NameActiontobetakenby/EMail,Editor/Title,Editor/EMail,NameActiontobetakenby/Id,GroupApprover/Title,GroupApprover/Id"
            , "PlantCode,ReasonforPending,NameActiontobetakenby,Editor,GroupApprover"
            , strFilter
           // , sorting
           , sorting,
         //,{ column: 'Order0', isAscending: true },
             props).then(results => {
                let brr: Array<IPendingGRN> = new Array<IPendingGRN>();
                results.map((item: { Id: any; PlantCode: any; ReportDate: any; ProjectName: any; MIRNO: any; RecdDate: any;ReasonforPending: any; SupplierName: any; ApproverLevel: any; InvoiceDate: any; Description: any; PONo: any; InvoiceValueIncludingTax: any; InvoiceChallanNo: any;ManualMIRdone: any;
                    DetailedReason: any;
                    Nosofpendingdays:any;
                    //NameActiontobetakenby:any;
                    Location:any;Remarks:any;NameActiontobetakenby:any;Editor:any;Modified:any;
                    NameActiontobetakenbyId:any;
                    GroupApproverId:any;
                    }) => {
                    brr.push({
                        Id:item.Id,
                        PlantCode: item.PlantCode.PlantCode,
                        PlantCodeId:item.PlantCode.Id,

                        ReportDate:item.ReportDate, 
                        ProjectName:item.ProjectName,
                        MIRNO :item.MIRNO,
                        RecdDate:item.RecdDate,
                        ReasonforPending :item.ReasonforPending.Reason,
                        ReasonforPendingId:item.ReasonforPending.Id,

                        SupplierName:item.SupplierName,
                        ApproverLevel:item.ApproverLevel,
                        InvoiceDate:item.InvoiceDate,
                        Description:item.Description,
                        PONo:item.PONo,
                        InvoiceValueIncludingTax:item.InvoiceValueIncludingTax,
                        InvoiceChallanNo:item.InvoiceChallanNo,
                        ManualMIRdone: item.ManualMIRdone,
                        DetailedReason: item.DetailedReason,
                        Nosofpendingdays:item.Nosofpendingdays,
                     NameActiontobetakenby:item.NameActiontobetakenby.Title,
                    NameActiontobetakenbyId:item.NameActiontobetakenby.Id,
                     NameActiontobetakenbyEmail:item.NameActiontobetakenby !== undefined ? item.NameActiontobetakenby.EMail : '',


                        Location:item.Location,
                        Remarks:item.Remarks,
                        Editor:item.Editor.Title,
                        Modified:item.Modified,
                        //GroupApprover:item.G,
                        GroupApproverId:item.GroupApproverId


                        
                       
                    });
                });
                return brr;
            }
            );
    //});
};
const getPendingGRNRequestsDatafilter = async (ArtId: string | number,props: IPatelEngProps): Promise<IPendingGRN[]> => {
    return await (await spCrudOps).getData("PendingGRN"
        , "*,PlantCode/PlantCode,PlantCode/Id,ReasonforPending/Reason,ReasonforPending/Id,NameActiontobetakenby/Title,NameActiontobetakenby/EMail,Editor/Title,Editor/EMail,NameActiontobetakenby/Id,GroupApprover/Title,GroupApprover/Id"
        , "PlantCode,ReasonforPending,NameActiontobetakenby,Editor,GroupApprover"
        , "Id eq '"+ArtId+"'"
      // , sorting,
     ,{ column: 'Order0', isAscending: true },
         props).then(results => {
            let brr: Array<IPendingGRN> = new Array<IPendingGRN>();
            results.map((item: { Id: any; PlantCode: any; ReportDate: any; ProjectName: any; MIRNO: any; RecdDate: any;ReasonforPending: any; SupplierName: any; ApproverLevel: any; InvoiceDate: any; Description: any; PONo: any; InvoiceValueIncludingTax: any; InvoiceChallanNo: any;ManualMIRdone: any;
                DetailedReason: any;
                Nosofpendingdays:any;
                //NameActiontobetakenby:any;
                Location:any;Remarks:any;NameActiontobetakenby:any;Editor:any;Modified:any;
                NameActiontobetakenbyId:any;GroupApproverId:any;
                }) => {
                brr.push({
                    Id:item.Id,
                    PlantCode: item.PlantCode.PlantCode,
                    PlantCodeId:item.PlantCode.Id,
                    //ReportDate:item.ReportDate !== undefined ? new Date(item.ReportDate): null, 
                    ReportDate:item.ReportDate, 

                    ProjectName:item.ProjectName,
                    MIRNO :item.MIRNO,
                    RecdDate:item.RecdDate,
                    ReasonforPending :item.ReasonforPending.Reason,
                    ReasonforPendingId:item.ReasonforPending.Id,
                    SupplierName:item.SupplierName,
                    ApproverLevel:item.ApproverLevel,
                    InvoiceDate:item.InvoiceDate,
                    Description:item.Description,
                    PONo:item.PONo,
                    InvoiceValueIncludingTax:item.InvoiceValueIncludingTax,
                    InvoiceChallanNo:item.InvoiceChallanNo,
                    ManualMIRdone: item.ManualMIRdone,
                    DetailedReason: item.DetailedReason,
                    Nosofpendingdays:item.Nosofpendingdays,
                    NameActiontobetakenby:item.NameActiontobetakenby.Title,
                    NameActiontobetakenbyId:item.NameActiontobetakenby.Id,

                    NameActiontobetakenbyEmail:item.NameActiontobetakenby !== undefined ? item.NameActiontobetakenby.EMail : '',

                    Location:item.Location,
                    Remarks:item.Remarks,
                    Editor:item.Editor.Title,
                    Modified:item.Modified,
                    //GroupApprover:item.GroupApprover,
                    GroupApproverId:item.GroupApproverId


                    
                   
                });
            });
            return brr;
        }
        );
//});
};

return {
    getPendingGRNRequestsData,getPendingGRNRequestsDatafilter
    };
}