import * as React from 'react';
// import { useState } from "react";
import { Formik, FormikProps } from 'formik';
import { useState, useEffect } from 'react';

// import { useHistory } from 'react-router-dom';
import { IPatelEngProps } from "../IPatelEngProps";
import { IPendingGRN } from '../../service/INTERFACE/IPendingGRN';
import PendingGRNRequestsOps from '../../service/BAL/SPCRUD/GRNPending'
import Utilities, { IUtilities } from '../../service/BAL/SPCRUD/utilities';
import { IPlantCodeMaster } from '../../service/INTERFACE/IPlantCodeMaster';
import PlantCodeRequestsOps from '../../service/BAL/SPCRUD/PlantCodeMaster'
//import useUtilities, { IUtilities } from '../../../services/bal/utilities';
import USESPCRUD, { ISPCRUD } from '../../service/BAL/SPCRUD/spcrud';
import { IReasonMaster } from '../../service/INTERFACE/IReasonMaster';
import ReasonRequestsOps from '../../service/BAL/SPCRUD/ReasonMaster';
import IPendingGRNRequestsOps from '../../service/BAL/SPCRUD/GRNPending'
// import { DatePicker } from '@fluentui/react-datepicker-compat';
// import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Link, useParams, useHistory } from 'react-router-dom';
import { BaseButton, Button, IPersonaProps } from 'office-ui-fabric-react';

// import Utilities from '../../services/BAL/SPCRUD/utilities';
import { ISPCRUDOPS } from '../../service/DAL/spcrudops';
import SPCRUDOPS from '../../service/DAL/spcrudops';
// import { ISPCRUD } from '../../service/BAL/SPCRUD/spcrud';
import './NewRequest.css'; // Import the CSS file
import { Icon } from '@fluentui/react/lib/Icon';
//  import { Link, useHistory } from 'react-router-dom';
import {
  Stack, IStackTokens, ITag, TagPicker, IBasePickerSuggestionsProps, IBasePicker, IInputProps, Checkbox,
  DetailsList, IColumn, FontIcon, SelectionMode, DetailsListLayoutMode, IDetailsHeaderProps, DetailsHeader, ConstrainMode
  , ICheckboxProps, MessageBar, MessageBarType, DatePicker, IDatePickerStrings
} from '@fluentui/react';
import { DayOfWeek } from '@fluentui/react';
 import { sp, IFolders, Folders } from "@pnp/sp/presets/all";
 import * as yup from 'yup';
import styles from '../PatelEng.module.scss';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import * as moment from 'moment';

// const [user, setUser] = React.useState<IPersonaProps[]>();
// import { BaseButton, Button, IPersonaProps } from 'office-ui-fabric-react';


//  import styles from '../Deviation.module.scss'
//  import styles from '../Deviation.module.scss'
//  import styles from '../Deviationuat'


//import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { TextField, MaskedTextField } from '@fluentui/react/lib/TextField';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';

const MRI: IDropdownOption[] = [
    { key: 'Yes', text: 'Yes' },
    { key: 'No', text: 'No' },
  ];
export const EditRequest: React.FunctionComponent<IPatelEngProps> = (props: IPatelEngProps) => {
  const { ArtIntId } = useParams<{ ArtIntId: string }>();

     const history = useHistory();
    const [spCrud, setSPCRUD] = React.useState<ISPCRUDOPS>();
    const [utility, setUtility] = React.useState<IUtilities>();
    const [plantMasterCollData, setPlantCollData] = useState<IPlantCodeMaster[]>();
    const [ReasonCollData, setreasonCollData] = useState<IReasonMaster[]>();
    const [testProduct, setProductText] = React.useState<string[]>([]);
    const [workrequestColl, setPedningdata] = useState<IPendingGRN[]>();
      const [user, setUser] = React.useState<IPersonaProps[]>();
    
    // const [workrequestColl, SelectPlantName] = useState<IPendingGRN[]>();

    
    ///const [workrequestColl, setworkrequestColl] = React.useState<IArtWorkRequestMaster[]>();


    

    const [testBrand, setBrandText] = React.useState<string[]>([]);

    const [currentDate] = useState(getDate());
  // workrequestColl == SelectPlantName
    let spCrudObj: ISPCRUD;
    let ProductText: any;
  let newColors = [];
  let changed2: any;
  let changed1: any;
  let BrandText: any;


    function getFieldProps(formik: FormikProps<any>, field: string) {
        return { ...formik.getFieldProps(field), errorMessage: formik.errors[field] as string };
    }

     const _getPeoplePickerItems = (item: IPersonaProps[]) => {
        setUser(item);
        let reportingManagerEmail: any[] = [];
        item.map((item) => {
          reportingManagerEmail.push(item.id)
        })
    
        if (item.length === 0) {
          reportingManagerEmail = [];
        }
    

      }

    async function onRequestInitiate(formValues: any) {
        spCrudObj = await USESPCRUD();
        setSPCRUD(spCrudObj);

        let date = new Date();
        date.setDate(date.getDate() + 1);
        
        // Format the date as YYYY-MM-DD
        let futureDate = date.toISOString().split('T')[0];
        console.log(futureDate);
        if(formValues.ReportDate >= futureDate){
          alert ("Future date not allowed in the Report Date field")
          return false
        }
        if(formValues.RecordDate >= futureDate){
          alert ("Future date not allowed in the Received Date field")
          return false
        }
        if(formValues.InvoiceDate >= futureDate){
          alert ("Future date not allowed in the Invoice Date field")
          return false
        }
        let useval;
        let onBehalf = 0;
        let onBehalfEmail = "";
        // if (user === undefined) {
        //   onBehalf = 0;
        //   const reportingManagerEmail = props.currentSPContext.pageContext.legacyPageContext.userEmail;
        // }
        // else {
        //   onBehalf = parseInt(user[0].id);
        //   //let email=user[0].secondaryText;
        //   const reportingManagerEmail = user[0].secondaryText;
    
        // }


        if(user === undefined)
          {
              if(workrequestColl[0].NameActiontobetakenbyEmail!==null && workrequestColl[0].NameActiontobetakenbyEmail!=="")
              {
                  onBehalf=workrequestColl[0].NameActiontobetakenbyId;
                  onBehalfEmail=workrequestColl[0].NameActiontobetakenbyEmail; 
                  
              }
              else
              {
                  onBehalf=0;
                  onBehalfEmail=props.currentSPContext.pageContext.legacyPageContext.userEmail;
              }
          }
          else{
              onBehalf=parseInt(user[0].id);
              onBehalfEmail=user[0].secondaryText;
          }

          if(formValues.GroupApproverId!=undefined){
          useval=formValues.GroupApproverId.map(item => item.Id);
          }
          else{
          useval=workrequestColl[0].GroupApproverId;

          }

         // setUser(workrequestColl[0].NameActiontobetakenbyEmail);

          //var user=workrequestColl[0].NameActiontobetakenbyEmail;
        let PRRequest: any = {
                        //InitiatorNameId: item.InitiatorNameId,
        'ReportDate':formValues.ReportDate
        , 'PlantCodeId': formValues.PlantCodeId
        , 'ProjectName':formValues.ProjectName
        , 'Location': formValues.Location
            ,'MIRNO':''+formValues.MIRNO
            ,'RecdDate': formValues.RecordDate
            ,'SupplierName':''+formValues.SupplierName
            ,'InvoiceChallanNo':''+formValues.InvoiceNo
            ,'InvoiceDate':formValues.InvoiceDate
           ,'Description':''+formValues.Descripition
           ,'PONo':''+formValues.PONo
           ,'InvoiceValueIncludingTax':''+formValues.invoicetaxnumber
           ,'DetailedReason':''+formValues.DetailedReason
           ,'Nosofpendingdays':''+formValues.NofoPendingdays
           ,'ManualMIRdone':formValues.MRIManual
           ,'ReasonforPendingId':formValues.ReasonforPendingId
           ,'Remarks':formValues.Remark
           , 'NameActiontobetakenbyId': onBehalf
           ,"GroupApproverId": { "results": useval}


            
         };
        
          console.log(formValues);
          console.log(PRRequest);
          //return false;

          // await spCrudObj.insertData("PendingGRN", PRRequest, props).then(async (brrInsertResult) => {
            await spCrudObj.updateData("PendingGRN", workrequestColl[0].Id, PRRequest, props).then(async (brrAppUpdateResult1) => {

            alert ("Pending GRN data updated successfully")
            history.push('/InitiatorLanding');

             
     });

      }
    
   
      const validate = yup.object().shape({
        ReportDate: yup.string().test(
          "ReportDate",
          "ReportDate is required",
          (custCode) => {
            if (custCode) {
              return true;
            } else {
              return false;
            }
          }),
          MIRNO: yup.string().test(
            "MIRNO",
            "MIRNO is required",
            (custCode) => {
              if (custCode) {
                return true;
              } else {
                return false;
              }
            }),
            RecordDate: yup.string().test(
                "RecordDate",
                "RecordDate is required",
                (custCode) => {
                  if (custCode) {
                    return true;
                  } else {
                    return false;
                  }
                }),
                InvoiceNo: yup.string().test(
                    "InvoiceNo",
                    "InvoiceNo is required",
                    (custCode) => {
                      if (custCode) {
                        return true;
                      } else {
                        return false;
                      }
                    }),
                    InvoiceDate: yup.string().test(
                      "InvoiceDate",
                      "InvoiceDate is required",
                      (custCode) => {
                        if (custCode) {
                          return true;
                        } else {
                          return false;
                        }
                      }),
                      SupplierName: yup.string().test(
                          "SupplierName",
                          "SupplierName is required",
                          (custCode) => {
                            if (custCode) {
                              return true;
                            } else {
                              return false;
                            }
                          }),
                          PONo: yup.string().test(
                            "PONo",
                            "PONo is required",
                            (custCode) => {
                              if (custCode) {
                                return true;
                              } else {
                                return false;
                              }
                            }),
                          invoicetaxnumber: yup.string().test(
                            "invoicetaxnumber",
                            "invoicetaxnumber is required",
                            (custCode) => {
                              if (custCode) {
                                return true;
                              } else {
                                return false;
                              }
                            }),
                            Descripition: yup.string().test(
                              "Descripition",
                              "Descripition is required",
                              (custCode) => {
                                if (custCode) {
                                  return true;
                                } else {
                                  return false;
                                }
                              }),
                              
                                  DetailedReason: yup.string().test(
                                    "DetailedReason",
                                    "DetailedReason is required",
                                    (custCode) => {
                                      if (custCode) {
                                        return true;
                                      } else {
                                        return false;
                                      }
                                    }),
                                    NofoPendingdays: yup.string().test(
                                        "NofoPendingdays",
                                        "Nos of pending days is required",
                                        (custCode) => {
                                          if (custCode) {
                                            return true;
                                          } else {
                                            return false;
                                          }
                                        }),
                                        MRIManual: yup.string().test(
                                            "MRIManual",
                                            "MRIManual is required",
                                            (custCode) => {
                                              if (custCode!="Select") {
                                                return true;
                                              } else {
                                                return false;
                                              }
                                            }),
                                            ReasonforPendingId: yup.string().test(
                                                "ReasonforPendingId",
                                                "ReasonforPendingId is required",
                                                (custCode) => {
                                                  if (custCode) {
                                                    return true;
                                                  } else {
                                                    return false;
                                                  }
                                                }),
                                                PlantCodeId: yup.string().test(
                                                    "PlantCodeId",
                                                    "PlantCodeId is required",
                                                    (custCode) => {
                                                      if (custCode) {
                                                        return true;
                                                      } else {
                                                        return false;
                                                      }
                                                    }),
                                                      // Remark: yup.string().test(
                                                      // "Remark",
                                                      // "Remark is required",
                                                      // (custCode) => {
                                                      //   if (custCode) {
                                                      //     return true;
                                                      //   } else {
                                                      //     return false;
                                                      //   }
                                                      // }),
                                                      NameOfAction: yup.array().test(
                                                              "NameOfAction",
                                                              "Enter atleast one user",
                                                              (custCode) => {
                                                                //user
                                                                if (custCode.length !== 0) {
                                                                  return true;
                                                                } else {
                                                                  return false;
                                                                }
                                                              })
          
    
      });

     const initialvalues = {

        ReportDate:'',
        PlantCodeId:'',
        MIRNO:'',
        RecordDate:'',
        SupplierName:'',
        InvoiceNo:'',
        InvoiceDate:'',
        Descripition:'',
        PONo:'',
        invoicetaxnumber:'',
        DetailedReason:'',
        NofoPendingdays:'',
        MRIManual:'',
        ReasonforPendingId:'',
        //Remark:'',
        NameOfAction:[]
        // user:[]
        //NameOfAction:''

        
      };

      function onChangeDate(e,formik){
        let date = new Date(e.target.value);
        let todaydate = new Date();
        const startDateObj = new Date(date);
    
        var timeDiff = new Date(todaydate).getTime() - new Date(date).getTime();
        //var diffDays = timeDiff / (1000 * 3600 * 24);
        var diffDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
       formik.setFieldValue('NofoPendingdays',diffDays)
   
   
       }

    function getDate() {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        return `${date}/${month}/${year}`;
    }
    // const workrequestColl: any
    // let workrequestColl;
    // SelectPlantName==workrequestColl;
   // const workrequestColl: any
   let GroupApproverId;
    function onChangeRequestType(e, formik) {
       
       // checkval = e.target.value;
        let selectedvalue = e.target.value;
        const workrequestColl = plantMasterCollData.filter((e) => e.Id === parseInt(selectedvalue))
        // formik.ProjectName = workrequestColl[0].ProjectName
        formik.setFieldValue('ProjectName',workrequestColl[0].ProjectName)
        formik.setFieldValue('Location',workrequestColl[0].Location)
        formik.setFieldValue('GroupApproverId', workrequestColl[0].GroupApprover)

        //  setFieldValue('ProjectName', workrequestColl != undefined ? workrequestColl[0].ProjectName:undefined);

         //workrequestColl=SelectPlantName

        // SelectPlantName = plantMasterCollData.filter((e) => e.Id === parseInt(selectedvalue))
         //const ProjectName = SelectPlantName[0].ProjectName
        //  setFieldValue('ProjectName', workrequestColl != undefined ? workrequestColl[0].ProjectName: undefined);

        
      }

    React.useEffect(() => {
        // let Currentloggedinuser = props.currentSPContext.pageContext.legacyPageContext.userEmail;
        PendingGRNRequestsOps().getPendingGRNRequestsDatafilter(ArtIntId, props).then(approvemasterres => {
          setPedningdata(approvemasterres)
        PlantCodeRequestsOps().getPlantCodeData(props).then((plantColl) => {
            setPlantCollData(plantColl);
            ReasonRequestsOps().getReasonMasterData(props).then((reasonColl) => {
                console.log(reasonColl);
                setreasonCollData(reasonColl);
            }, error => {
                console.log(error);
            })       
          }, error => {
            console.log(error);
        })  
        }, error => {
            console.log(error);
        })
        
    }, []);
    const today = new Date().toISOString().split('T')[0];

    return (
      <Formik initialValues={initialvalues}
        validationSchema={validate}
  
        onSubmit={(values, helpers) => { }}>{
          formik => (
            // <section >
            <div>
              {
                React.useEffect(() => {
                  let brandID = 0;
                  if (workrequestColl && workrequestColl[0]?.ReportDate) {
                    formik.setFieldValue('ReportDate', workrequestColl[0]?.ReportDate.split('T')[0]);
                  }
                  if (workrequestColl && workrequestColl[0]?.InvoiceDate) {
                    formik.setFieldValue('InvoiceDate', workrequestColl[0]?.InvoiceDate.split('T')[0]);
                  }
                  if (workrequestColl && workrequestColl[0]?.RecdDate) {
                    // <td>{moment(new Date(purchaseReqObj.RecdDate)).format('DD/MM/YYYY')}</td>
                    
                    formik.setFieldValue('RecordDate', workrequestColl[0]?.RecdDate.split('T')[0]);
                    //formik.setFieldValue('RecordDate',moment(new Date(workrequestColl[0].RecdDate)).format('DD/MM/YYYY'))
                  }
                  // if (workrequestColl && workrequestColl[0]?.NameActiontobetakenby) {
                  //   formik.setFieldValue('ddlPlantCode', workrequestColl[0]?.PlantCode);
                  // }
                  if (workrequestColl && workrequestColl[0]?.PlantCodeId) {
                    formik.setFieldValue('PlantCodeId', workrequestColl[0]?.PlantCodeId);
                  }

                  if (workrequestColl && workrequestColl[0]?.ReasonforPendingId) {
                    formik.setFieldValue('ReasonforPendingId', workrequestColl[0]?.ReasonforPendingId);
                  }

                  if (workrequestColl && workrequestColl[0]?.Editor) {
                    formik.setFieldValue('Editor', workrequestColl[0]?.Editor);
                  }

                  if (workrequestColl && workrequestColl[0]?.Modified) {
                    // formik.setFieldValue('Modified', workrequestColl[0]?.Modified);
                    formik.setFieldValue('Modified', workrequestColl[0]?.Modified.split('T')[0]);

                  }
                  // formik.setFieldValue('ReportDate', workrequestColl != undefined ? workrequestColl[0].ReportDate: undefined);
                 
                  formik.setFieldValue('ProjectName', workrequestColl != undefined ? workrequestColl[0].ProjectName:undefined);
                  formik.setFieldValue('Location', workrequestColl != undefined ? workrequestColl[0].Location : undefined);
                  formik.setFieldValue('MIRNO', workrequestColl != undefined ? workrequestColl[0].MIRNO : undefined);
                  // formik.setFieldValue('RecordDate', workrequestColl != undefined ? workrequestColl[0]?.RecdDate.split('T')[0] : undefined);
                  formik.setFieldValue('SupplierName', workrequestColl != undefined ? workrequestColl[0].SupplierName: undefined);
                  formik.setFieldValue('InvoiceNo', workrequestColl != undefined ? workrequestColl[0].InvoiceChallanNo : undefined);
  
                  // formik.setFieldValue('InvoiceDate', workrequestColl != undefined ? workrequestColl[0].InvoiceDate.split('T')[0] : undefined);
                  formik.setFieldValue('Descripition', workrequestColl != undefined ? workrequestColl[0].Description : undefined);
                  formik.setFieldValue('PONo', workrequestColl != undefined ? workrequestColl[0].PONo : undefined);
                  formik.setFieldValue('invoicetaxnumber', workrequestColl != undefined ? workrequestColl[0].InvoiceValueIncludingTax : undefined);
                 // formik.setFieldValue('MRIManual', (workrequestColl != undefined || workrequestColl[0].ManualMIRdone != null || workrequestColl[0].ManualMIRdone != "Select")? workrequestColl[0].ManualMIRdone : undefined);
                  //formik.setFieldValue('MRIManual', workrequestColl != "Select" ? workrequestColl[0].ManualMIRdone : undefined);

                  formik.setFieldValue('MRIManual', workrequestColl != undefined && workrequestColl[0].ManualMIRdone != null && workrequestColl[0].ManualMIRdone !="Select" ? workrequestColl[0].ManualMIRdone : undefined);
                  formik.setFieldValue('Remark', workrequestColl != undefined ? workrequestColl[0].Remarks: undefined);
                  formik.setFieldValue('DetailedReason', workrequestColl != undefined && workrequestColl[0].DetailedReason != null ? workrequestColl[0].DetailedReason : undefined);
                  formik.setFieldValue('NofoPendingdays', workrequestColl != undefined && workrequestColl[0].Nosofpendingdays != null ? workrequestColl[0].Nosofpendingdays : undefined);
                  var abc=[];
                 // abc.push()
                  formik.setFieldValue('NameOfAction', workrequestColl != undefined && workrequestColl[0].NameActiontobetakenby != null ? [workrequestColl[0].NameActiontobetakenbyEmail] : undefined);

                  
                }, [workrequestColl])
              }
              <div>
                <div className='con-box'>
                                <div className="new-request-container">
                                  <div className='row'>
                                    <div className='col-md-12'>
                                      <div className="text-center heading">
                                              <h4>MIS_1_Weekly Monthly Pending GRN Form</h4>
                                        </div>
                                    </div>
                                  </div>
                                  <div className='p-3 bg-white shadow-sm border'>
                
                                  <div className='form-group row'>
                
                                        <div className='col-md-3'>
                                            <label className='col-form-label'>Report date</label>
                                            <div>
                                            <DatePicker
                                              id="txtReportDate"
                                              placeholder="Enter or select a date"
                                              allowTextInput={true}
                                              firstDayOfWeek={DayOfWeek.Sunday}
                                              value={formik.values.ReportDate ? new Date(formik.values.ReportDate) : undefined}
                                              onSelectDate={(date) => formik.setFieldValue('ReportDate', date?.toISOString())}
                                              // BLOCK non-numeric input
                                              onKeyDown={(e) => {
                                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                                if (!/[0-9\/]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                                  e.preventDefault();
                                                }
                                              }}
                                              parseDateFromString={(input) => {
                                                const today = new Date();
                                                const parts = input.split(/[\/\-]/).map(p => p.trim()).filter(p => p !== "");
                                    
                                                // Case 1: user typed only day
                                                if (parts.length === 1 && /^\d{1,2}$/.test(parts[0])) {
                                                  const day = Number(parts[0]);
                                                  return new Date(today.getFullYear(), today.getMonth(), day);
                                                }
                                    
                                                // Case 2: user typed "day/month" 
                                                if (parts.length === 2 &&
                                                    /^\d{1,2}$/.test(parts[0]) &&
                                                    /^\d{1,2}$/.test(parts[1])) {
                                    
                                                  const day = Number(parts[0]);
                                                  const month = Number(parts[1]);
                                                  return new Date(today.getFullYear(), month - 1, day);  
                                                }
                                    
                                                // Case 3: user typed full date 
                                                if (parts.length === 3) {
                                                  let [day, month, year] = parts.map(Number);
                                    
                                                  // Fix missing/invalid year → default to current year
                                                  if (!year || year < 100) {
                                                    year = today.getFullYear();
                                                  }
                                    
                                                  return new Date(year, month - 1, day);
                                                }
                                    
                                                return undefined;
                                              }}
                                              formatDate={(date) =>
                                                date
                                                ? `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`
                                                : ''
                                              }             
                                              styles={{ root: { width: '100%' } }}
                                            />
                                            {/* <input id='txtreportdate' type='date' value={moment(workrequestColl !== undefined ? workrequestColl[0].ReportDate : '').format("DD-MMM-YYYY")} {...getFieldProps(formik, 'ReportDate')}></input> */}

                                            {formik.errors.ReportDate ? (
                                          <div
                                            style={{
                                              paddingTop: 0,
                                              color: "#B2484D",
                                              fontSize: ".75rem",
                                              fontFamily: "Segoe UI"
                                            }}
                                          >
                                            {JSON.stringify(formik.errors.ReportDate).replace(/"/g, '')}
                                          </div>
                                        ) : null}
                                            </div>
                                        </div>
                                        <br></br>
                
                                        <div className='col-md-3'>
                                            <label className='col-form-label'>Plant Code</label>
                                            <div>
                                           
                                      <select id='ddlPlantCode' className='form-control'{...getFieldProps(formik, 'PlantCodeId')} 
                                      onChange={async (e) => {
                                        formik.setFieldValue('PlantCodeId', e.target.value);
                                        await onChangeRequestType(e, formik);
                                        formik.handleChange("PlantCodeId");
                                      }}
                                      >
                                          <option value="">Select</option>
                                        {plantMasterCollData !== undefined ? plantMasterCollData.map((Vend) => <option key={Vend.Id} value={Vend.Id}>{Vend.PlantCode}</option>) : ''}
                
                                      </select>
                                      {formik.errors.PlantCodeId ? (
                                        <div
                                          style={{
                                            paddingTop: 0,
                                            color: "#B2484D",
                                            fontSize: ".75rem",
                                            fontFamily: "Segoe UI"
                                          }}
                                        >
                                          {JSON.stringify(formik.errors.PlantCodeId).replace(/"/g, '')}
                                        </div>
                                      ) : null}
                                            </div>
                                        </div>
                                        <br></br>
                
                                        <div className='col-md-3'>
                                            <label className='col-form-label'>Project Name</label>
                                            <div>
                                                <input
                                                    type="text"
                                                    className="form-control form-bd" 
                                              // value={workrequestColl !== undefined && workrequestColl[0] !== undefined ? workrequestColl[0].ProjectName : ''}
                                                   {...getFieldProps(formik, 'ProjectName')} readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='col-md-3'>
                                            <label className='col-form-label'>Location </label>
                                            <div>
                                                <input
                                                    type="text"
                                                    className="form-control form-bd" 
                                                     {...getFieldProps(formik, 'Location')} readOnly

                                                    //value={SelectPlantName !== undefined && SelectPlantName[0] !== undefined ? SelectPlantName[0].Location : ''}
                                                />
                                            </div>
                                     
                
                
                                    </div>
                                    </div>
                                    <div className='form-group row'>
                                    <div className='col-md-3'>
                                            <label className='col-form-label'>MIR NO.</label>
                                            <div>
                                            <input type='text' id='txtMIRNO' className='form-control'  {...getFieldProps(formik, 'MIRNO')}
                                              onKeyDown={(e) => {
                                                const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
                                                if (!/^[0-9]$/.test(e.key) && !allowed.includes(e.key)) {
                                                  e.preventDefault();
                                                }
                                              }}
                                              onInput={(e) => {
                                                const input = e.target as HTMLInputElement;  
                                                input.value = input.value.replace(/\D+/g, "");
                                                formik.setFieldValue("MIRNO", input.value);
                                              }}
                                            ></input>
                                            {formik.errors.MIRNO ? (
                                          <div
                                            style={{
                                              paddingTop: 0,
                                              color: "#B2484D",
                                              fontSize: ".75rem",
                                              fontFamily: "Segoe UI"
                                            }}
                                          >
                                            {JSON.stringify(formik.errors.MIRNO).replace(/"/g, '')}
                                          </div>
                                        ) : null}
                                            </div>
                                        </div>
                                        <br></br>
                
                                        <div className='col-md-3'>
                                            <label className='col-form-label'>Recd Date</label>
                                            <div>
                                            <DatePicker
                                              id="txtsirdate"
                                              placeholder="Enter or select a date"
                                              allowTextInput={true}
                                              firstDayOfWeek={DayOfWeek.Sunday}
                                              value={formik.values.RecordDate ? new Date(formik.values.RecordDate) : undefined}
                                              onSelectDate={(date) => formik.setFieldValue('RecordDate', date?.toISOString())}
                                              // BLOCK non-numeric input
                                              onKeyDown={(e) => {
                                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                                if (!/[0-9\/]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                                  e.preventDefault();
                                                }
                                              }}
                                              parseDateFromString={(input) => {
                                                const today = new Date();
                                                const parts = input.split(/[\/\-]/).map(p => p.trim()).filter(p => p !== "");
                        
                                                // Case 1: user typed only day
                                                if (parts.length === 1 && /^\d{1,2}$/.test(parts[0])) {
                                                  const day = Number(parts[0]);
                                                  return new Date(today.getFullYear(), today.getMonth(), day);
                                                }
                        
                                                // Case 2: user typed "day/month" 
                                                if (parts.length === 2 &&
                                                    /^\d{1,2}$/.test(parts[0]) &&
                                                    /^\d{1,2}$/.test(parts[1])) {
                        
                                                  const day = Number(parts[0]);
                                                  const month = Number(parts[1]);
                                                  return new Date(today.getFullYear(), month - 1, day);  
                                                }
                        
                                                // Case 3: user typed full date 
                                                if (parts.length === 3) {
                                                  let [day, month, year] = parts.map(Number);
                        
                                                  // Fix missing/invalid year → default to current year
                                                  if (!year || year < 100) {
                                                    year = today.getFullYear();
                                                  }
                        
                                                  return new Date(year, month - 1, day);
                                                }
                        
                                                return undefined;
                                              }}
                                              formatDate={(date) =>
                                                date
                                                  ? `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`
                                                  : ''
                                              }
                                              styles={{ root: { width: '100%' } }}
                                            />
                                            {formik.errors.RecordDate ? (
                                          <div
                                            style={{
                                              paddingTop: 0,
                                              color: "#B2484D",
                                              fontSize: ".75rem",
                                              fontFamily: "Segoe UI"
                                            }}
                                          >
                                            {JSON.stringify(formik.errors.RecordDate).replace(/"/g, '')}
                                          </div>
                                        ) : null}
                                            </div>
                                        </div>
                                        <br></br>
                
                                        <div className='col-md-3'>
                                            <label className='col-form-label'>Supplier Name</label>
                                            <div>
                                            <input type='text' id='txtSupplierName' className='form-control'  {...getFieldProps(formik, 'SupplierName')}></input>
                                            {formik.errors.SupplierName ? (
                                          <div
                                            style={{
                                              paddingTop: 0,
                                              color: "#B2484D",
                                              fontSize: ".75rem",
                                              fontFamily: "Segoe UI"
                                            }}
                                          >
                                            {JSON.stringify(formik.errors.SupplierName).replace(/"/g, '')}
                                          </div>
                                        ) : null}
                                            </div>
                                        </div>
                                        <div className='col-md-3'>
                                            <label className='col-form-label'>Invoice / Challan No </label>
                                            <div>
                                            <input type='text' id='txtInvoiceNo' className='form-control'  {...getFieldProps(formik, 'InvoiceNo')}
                                              onKeyDown={(e) => {
                                                const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
                                                if (!/^[0-9]$/.test(e.key) && !allowed.includes(e.key)) {
                                                  e.preventDefault();
                                                }
                                              }}
                                              onInput={(e) => {
                                                const input = e.target as HTMLInputElement;  
                                                input.value = input.value.replace(/\D+/g, "");
                                                formik.setFieldValue("InvoiceNo", input.value);
                                              }}
                                            ></input>
                                            {formik.errors.InvoiceNo ? (
                                          <div
                                            style={{
                                              paddingTop: 0,
                                              color: "#B2484D",
                                              fontSize: ".75rem",
                                              fontFamily: "Segoe UI"
                                            }}
                                          >
                                            {JSON.stringify(formik.errors.InvoiceNo).replace(/"/g, '')}
                                          </div>
                                        ) : null}
                                            </div>
                                        </div>
                
                
                                    </div>
                                    <div className='form-group row'>
                                        <div className='col-md-3'>
                                            <label className='col-form-label'>Invoice Date</label>
                                            <div>
                                            <DatePicker
                                              id="txtsirdate"
                                              placeholder="Enter or select a date"
                                              allowTextInput={true}
                                              firstDayOfWeek={DayOfWeek.Sunday}
                                              value={formik.values.InvoiceDate  ? new Date(formik.values.InvoiceDate) : undefined}
                                              onSelectDate={(date) => formik.setFieldValue('InvoiceDate', date?.toISOString())}
                                              // BLOCK non-numeric input
                                              onKeyDown={(e) => {
                                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                                if (!/[0-9\/]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                                  e.preventDefault();
                                                }
                                              }}
                                              parseDateFromString={(input) => {
                                                const today = new Date();
                                                const parts = input.split(/[\/\-]/).map(p => p.trim()).filter(p => p !== "");
                        
                                                // Case 1: user typed only day
                                                if (parts.length === 1 && /^\d{1,2}$/.test(parts[0])) {
                                                  const day = Number(parts[0]);
                                                  return new Date(today.getFullYear(), today.getMonth(), day);
                                                }
                        
                                                // Case 2: user typed "day/month" 
                                                if (parts.length === 2 &&
                                                    /^\d{1,2}$/.test(parts[0]) &&
                                                    /^\d{1,2}$/.test(parts[1])) {
                        
                                                  const day = Number(parts[0]);
                                                  const month = Number(parts[1]);
                                                  return new Date(today.getFullYear(), month - 1, day);  
                                                }
                        
                                                // Case 3: user typed full date 
                                                if (parts.length === 3) {
                                                  let [day, month, year] = parts.map(Number);
                        
                                                  // Fix missing/invalid year → default to current year
                                                  if (!year || year < 100) {
                                                    year = today.getFullYear();
                                                  }
                        
                                                  return new Date(year, month - 1, day);
                                                }
                        
                                                return undefined;
                                              }}
                                              formatDate={(date) =>
                                                date
                                                  ? `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`
                                                  : ''
                                              }
                                              styles={{ root: { width: '100%' } }}
                                            />
                                            {formik.errors.InvoiceDate ? (
                                          <div
                                            style={{
                                              paddingTop: 0,
                                              color: "#B2484D",
                                              fontSize: ".75rem",
                                              fontFamily: "Segoe UI"
                                            }}
                                          >
                                            {JSON.stringify(formik.errors.InvoiceDate).replace(/"/g, '')}
                                          </div>
                                        ) : null}
                                            </div>
                                        </div>
                                        <br></br>
                
                                        <div className='col-md-3'>
                                            <label className='col-form-label'>Description</label>
                                            <div>
                                            <input type='text' id='txtdescription' className='form-control'  {...getFieldProps(formik, 'Descripition')}></input>
                                            {formik.errors.Descripition ? (
                                          <div
                                            style={{
                                              paddingTop: 0,
                                              color: "#B2484D",
                                              fontSize: ".75rem",
                                              fontFamily: "Segoe UI"
                                            }}
                                          >
                                            {JSON.stringify(formik.errors.Descripition).replace(/"/g, '')}
                                          </div>
                                        ) : null}
                                            </div>
                                        </div>
                                        <br></br>
                
                                        <div className='col-md-3'>
                                            <label className='col-form-label'>P.O. No</label>
                                            <div>
                                            <input type='text' id='txtPONO' className='form-control'  {...getFieldProps(formik, 'PONo')}
                                              onKeyDown={(e) => {
                                                const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
                                                if (!/^[0-9]$/.test(e.key) && !allowed.includes(e.key)) {
                                                  e.preventDefault();
                                                }
                                              }}
                                              onInput={(e) => {
                                                const input = e.target as HTMLInputElement;  
                                                input.value = input.value.replace(/\D+/g, "");
                                                formik.setFieldValue("PONo", input.value);
                                              }}
                                            ></input>
                                            {formik.errors.PONo ? (
                                          <div
                                            style={{
                                              paddingTop: 0,
                                              color: "#B2484D",
                                              fontSize: ".75rem",
                                              fontFamily: "Segoe UI"
                                            }}
                                          >
                                            {JSON.stringify(formik.errors.PONo).replace(/"/g, '')}
                                          </div>
                                        ) : null}
                                            </div>
                                        </div>
                                        <div className='col-md-3'>
                                            <label className='col-form-label'>Invoice Value (Including Tax) </label>
                                            <div>
                                            <input type='number' id='txtinvoicetax' className='form-control'  {...getFieldProps(formik, 'invoicetaxnumber')}
                                              onKeyDown={(e) => {
                                                const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
                                                if (!/^[0-9]$/.test(e.key) && !allowed.includes(e.key)) {
                                                  e.preventDefault();
                                                }
                                              }}
                                              onInput={(e) => {
                                                const input = e.target as HTMLInputElement;  
                                                input.value = input.value.replace(/\D+/g, "");
                                                formik.setFieldValue("invoicetaxnumber", input.value);
                                              }}
                                            ></input>
                                            {formik.errors.invoicetaxnumber ? (
                                          <div
                                            style={{
                                              paddingTop: 0,
                                              color: "#B2484D",
                                              fontSize: ".75rem",
                                              fontFamily: "Segoe UI"
                                            }}
                                          >
                                            {JSON.stringify(formik.errors.invoicetaxnumber).replace(/"/g, '')}
                                          </div>
                                        ) : null}
                                            </div>
                                        </div>
                
                
                                    </div>
                                    <div className='form-group row'>
                                    <div className='col-md-3'>
                  <label className='col-form-label'>Manual-MIR done</label>
                  <select id='ddlmanualmri' className='form-control' {...getFieldProps(formik, 'MRIManual')} 
                  >
                    <option >Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {formik.errors.MRIManual ? (
                    <div
                      style={{
                        paddingTop: 0,
                        color: "#B2484D",
                        fontSize: ".75rem",
                        fontFamily: "Segoe UI"
                      }}
                    >
                      {JSON.stringify(formik.errors.MRIManual).replace(/"/g, '')}
                    </div>
                  ) : null}
                </div>
                                        <br></br>
                
                                        <div className='col-md-3'>
                                            <label className='col-form-label'>Reason for Pending</label>
                                            <div>
                                            <select id='ddlPending' className='form-control' name='ddlPending'
                                        {...getFieldProps(formik, 'ReasonforPendingId')}
                                        onChange={async (e) => {
                                          changed1 = e.target.value;
                                          formik.setFieldValue('ReasonforPendingId', e.target.value);
                                          //formik.handleChange1("ddlPending");
                                          newColors = ReasonCollData.filter(colors => colors.Id == e.target.value);
                                          formik.setFieldValue('ProductTxt', newColors[0].Reason);
                
                                          ProductText = newColors[0].Reason
                                          // await onChangeRequestTypeBrand(changed2,changed1)
                                          //updateState("Rejected", formik.values, bpmObj, Changed);
                                          setProductText(ProductText);
                                        }}>
                                         <option value="">Select</option>
                                        {ReasonCollData !== undefined ? ReasonCollData.map((Vend) => <option key={Vend.Id} value={Vend.Id}>{Vend.Reason}</option>) : ''}
                                      </select>
                                      {formik.errors.ReasonforPendingId ? (
                                        <div
                                          style={{
                                            paddingTop: 0,
                                            color: "#B2484D",
                                            fontSize: ".75rem",
                                            fontFamily: "Segoe UI"
                                          }}
                                        >
                                          {JSON.stringify(formik.errors.ReasonforPendingId).replace(/"/g, '')}
                                        </div>
                                      ) : null}
                                            </div>
                                        </div>
                                        <br></br> 
                
                                        <div className='col-md-3'>
                                            <label className='col-form-label'>Detailed Reason</label>
                                            <div>
                                            <textarea id='txtdetailedreason' className='form-control form-bd' {...getFieldProps(formik, 'DetailedReason')} />
                                            {formik.errors.DetailedReason ? (
                                          <div
                                            style={{
                                              paddingTop: 0,
                                              color: "#B2484D",
                                              fontSize: ".75rem",
                                              fontFamily: "Segoe UI"
                                            }}
                                          >
                                            {JSON.stringify(formik.errors.DetailedReason).replace(/"/g, '')}
                                          </div>
                                        ) : null}
                                            </div>
                                        </div>
                                        <div className='col-md-3'>
                                            <label className='col-form-label'>Nos of pending days</label>
                                            <div>
                                            <input type='number' id='txtnofodays' className='form-control'  {...getFieldProps(formik, 'NofoPendingdays')} readOnly></input>
                                            {formik.errors.NofoPendingdays ? (
                                          <div
                                            style={{
                                              paddingTop: 0,
                                              color: "#B2484D",
                                              fontSize: ".75rem",
                                              fontFamily: "Segoe UI"
                                            }}
                                          >
                                            {JSON.stringify(formik.errors.NofoPendingdays).replace(/"/g, '')}
                                          </div>
                                        ) : null}
                                            </div>
                                        </div>
                
                                        
                                    </div>
                                    <div className='form-group row'>
                    <div className='col-md-3'>
                            <label className='col-form-label'>Remark</label>
                            <div>
                            <textarea id='txtdetailReamark' className='form-control form-bd' {...getFieldProps(formik, 'Remark')} />
                            
                            </div>
                        </div>
                        <div className='col-md-3' >
                  {/* <div>On Behalf :-</div> */}
                  <div >
                    {/* <input id='txtonBehalf' type='text' {...getFieldProps(formik, 'OnBehalf')}></input> */}
                    <PeoplePicker
                      context={props.currentSPContext}
                      personSelectionLimit={1}
                      titleText="Name-Action to be taken by"
                      // tooltipDirectional={1}
                      {...getFieldProps(formik, 'NameOfAction')}
                      //onChange={_getPeoplePickerItems}
                      defaultSelectedUsers={[workrequestColl !== undefined ? workrequestColl[0].NameActiontobetakenbyEmail : '']}
                      onChange={(item) => {
                        _getPeoplePickerItems(item);
                        formik.setFieldValue('NameOfAction', item)}}
                      // onChange={async (e) => {
                      //   //changed3 = .value;
                      //   await _getPeoplePickerItems(e);
                      //reportingManagerEmail
                      // }}
                      principalTypes={[PrincipalType.User]}

                      ensureUser={true}
                      resolveDelay={1000}
                    />
                   {formik.errors.NameOfAction ? (
                      <div
                        style={{
                          paddingTop: 0,
                          color: "#B2484D",
                          fontSize: ".75rem",
                          fontFamily: "Segoe UI"
                        }}
                      >
                        {JSON.stringify(formik.errors.NameOfAction).replace(/"/g, '')}
                      </div>
                    ) : null}
                
                    
                  </div>
                  
                </div>   

                <div className='col-md-3'>
                            <label className='col-form-label'>Last Modified By</label>
                            <div>
                            <input type='text' readOnly className='form-control form-bd' {...getFieldProps(formik, 'Editor')} />
                            
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <label className='col-form-label'>Last Modified Date</label>
                            <div>
                            <input type='text' readOnly className='form-control form-bd' {...getFieldProps(formik, 'Modified')} />
                            
                            </div>
                        </div>           
                   
                    </div>
                                    
                                    <div className="row my-3">
                                      <div className='d-flex btnall'>
                
                                    <PrimaryButton type='submit' style={{width: '100px' , background:'#c4291c'}} className={'pr1'} text="Submit" onClick={async () => {
                                          formik.setFieldValue("condition", "Submitted");
                                         // formik.values.condition = "Submitted";
                                          //formik.values.isDraft = false;
                                          await formik.validateForm().then(async (frmResult) => {
                                            //formik.isValid && 
                                            if (Object.keys(frmResult).length <= 0) {
                                              await onRequestInitiate(formik.values);
                                            }
                                          });
                                        }} value={'Submitted'} iconProps={{ iconName: 'Submit' }} />
                
                                        <button type="button" className="btn btn-secondary exitbtn" onClick={() => history.push('/initiatorLanding')} style={{borderRadius:'2px',padding:'0px 30px !important',width: '100px'}}>Exit</button>
                                    </div>
                                  </div>
                                </div>
                                  </div>
                                </div>

              </div>
            </div>
          )
        }
      </Formik>
  
    );
};
// function _getPeoplePickerItems(items: any, arg1: any) {
//     throw new Error('Function not implemented.');
// }

