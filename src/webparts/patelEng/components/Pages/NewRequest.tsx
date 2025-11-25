import * as React from 'react';
import { useState } from "react";
import { Formik, FormikProps } from 'formik';
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
// import differenceInDays from 'date-fns/difference_in_days';
import { BaseButton, Button, DatePicker, IPersonaProps } from 'office-ui-fabric-react';

// import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";

// import Utilities from '../../services/BAL/SPCRUD/utilities';
import { ISPCRUDOPS } from '../../service/DAL/spcrudops';
import SPCRUDOPS from '../../service/DAL/spcrudops';
// import { ISPCRUD } from '../../service/BAL/SPCRUD/spcrud';
import './NewRequest.css'; // Import the CSS file
import { Icon } from '@fluentui/react/lib/Icon';
import { Link, useHistory } from 'react-router-dom';
import { sp, IFolders, Folders } from "@pnp/sp/presets/all";
import * as yup from 'yup';
import styles from '../PatelEng.module.scss';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';

import { TextField, MaskedTextField } from '@fluentui/react/lib/TextField';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
const MRI: IDropdownOption[] = [
  { key: 'Yes', text: 'Yes' },
  { key: 'No', text: 'No' },
];
export const NewRequest: React.FunctionComponent<IPatelEngProps> = (props: IPatelEngProps) => {
  const history = useHistory();
  const [spCrud, setSPCRUD] = React.useState<ISPCRUDOPS>();
  const [utility, setUtility] = React.useState<IUtilities>();
  const [plantMasterCollData, setPlantCollData] = useState<IPlantCodeMaster[]>();
  const [ReasonCollData, setreasonCollData] = useState<IReasonMaster[]>();
  const [testProduct, setProductText] = React.useState<string[]>([]);

  const [testBrand, setBrandText] = React.useState<string[]>([]);
  const [user, setUser] = React.useState<IPersonaProps[]>();

  const [currentDate] = useState(getDate());
  let spCrudObj: ISPCRUD;
  let ProductText: any;
  let newColors = [];
  let changed2: any;
  let changed1: any;
  let BrandText: any;
  let changed3:any;


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
   
    let onBehalf = 0;
    let onBehalfEmail = "";
    if (user === undefined) {
      onBehalf = 0;
      const reportingManagerEmail = props.currentSPContext.pageContext.legacyPageContext.userEmail;
    }
    else {
      onBehalf = parseInt(user[0].id);
      //let email=user[0].secondaryText;
      const reportingManagerEmail = user[0].secondaryText;

    }
  //   var peoplePickerData = formValues.GroupApproverId.map(function (item.Id) {
  //     return {
  //         "Key": item.Id.toString(), // ID as a string
  //         "Value": item.Title         // Display Name
  //     };
  // });
  let useval=formValues.GroupApproverId.map(item => item.Id);

    let PRRequest: any = {
      //InitiatorNameId: item.InitiatorNameId,
      'ReportDate': formValues.ReportDate
      // , 'PlantCodeId': SelectPlantName[0].Id
      , 'PlantCodeId': formValues.PlantCodeId

      , 'ProjectName': formValues.ProjectName
      , 'Location': formValues.Location
      , 'MIRNO': '' + formValues.MIRNO
      , 'RecdDate': formValues.RecordDate
      , 'SupplierName': '' + formValues.SupplierName
      , 'InvoiceChallanNo': '' + formValues.InvoiceNo
      , 'InvoiceDate': formValues.InvoiceDate
      , 'Description': '' + formValues.Descripition
      , 'PONo': '' + formValues.PONo
      , 'InvoiceValueIncludingTax': '' + formValues.invoicetaxnumber
      , 'DetailedReason': '' + formValues.DetailedReason
      , 'Nosofpendingdays': '' + formValues.NofoPendingdays
      , 'ManualMIRdone': formValues.MRIManual
      , 'ReasonforPendingId': formValues.PendingReasonId
      , 'Remarks': formValues.Remark
      , 'NameActiontobetakenbyId': onBehalf
      //,"GroupApproverId":{result:SelectPlantName[0].GroupApprover}GroupApproverId
      //,"GroupApproverId":{GroupApproverId}
      ,"GroupApproverId": { "results": useval}

    };

    console.log(formValues);
    console.log(PRRequest);
    //return false;

    await spCrudObj.insertData("PendingGRN", PRRequest, props).then(async (brrInsertResult) => {
      alert("Pending GRN details submitted successfully")
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
        if (custCode) {
          return true;
        } else {
          return false;
        }
      }),
   
    PendingReasonId: yup.string().test(
      "PendingReasonId",
      "PendingReasonId is required",
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
    //   "Remark",
    //   "Remark is required",
    //   (custCode) => {
    //     if (custCode) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   }),
      NameOfAction: yup.array().test(
        "NameOfAction",
        "Enter atleast one user",
        (custCode) => {
          if (custCode.length !== 0) {
            return true;
          } else {
            return false;
          }
        })
      



  });

  const initialvalues = {

    ReportDate: '',
    PlantCodeId: '',
    MIRNO: '',
    RecordDate: '',
    SupplierName: '',
    InvoiceNo: '',
    InvoiceDate: '',
    Descripition: '',
    PONo: '',
    invoicetaxnumber: '',
    DetailedReason: '',
    NofoPendingdays: '',
    MRIManual: '',
    PendingReasonId: '',
    //Remark: '',
    NameOfAction:[]
    // setUser:''


  };



  function getDate() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return `${date}/${month}/${year}`;
  }
  let SelectPlantName;
 let GroupApproverId;
  function onChangeRequestType(e,formik) {

    // checkval = e.target.value;
    let selectedvalue = e.target.value;
    SelectPlantName = plantMasterCollData.filter((e) => e.Id === parseInt(selectedvalue))
    formik.setFieldValue('ProjectName', SelectPlantName[0].ProjectName)
    formik.setFieldValue('Location', SelectPlantName[0].Location)
    formik.setFieldValue('PlantCodeId', SelectPlantName[0].Id)
    formik.setFieldValue('GroupApproverId', SelectPlantName[0].GroupApprover)

  }

  function onChangeDate(e, formik) {
    let date = new Date(e.target.value);
    let todaydate = new Date();
    const startDateObj = new Date(date);

    var timeDiff = new Date(todaydate).getTime() - new Date(date).getTime();
    //var diffDays = timeDiff / (1000 * 3600 * 24);
    var diffDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    formik.setFieldValue('NofoPendingdays', diffDays)


  }

  React.useEffect(() => {
    // let Currentloggedinuser = props.currentSPContext.pageContext.legacyPageContext.userEmail;
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

  }, []);
  const today = new Date().toISOString().split('T')[0];
  return (
    <Formik initialValues={initialvalues}
      validationSchema={validate}
      onSubmit={(values, helpers) => { }}
    >
      {(formik: any) => (
        <div className='con-box'>
          <div className="new-request-container">
            <div className='row'>
              <div className='col-md-12' style={{padding:'0 8px'}}>
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
                    <input type='date' id='txtreportdate' max={today} className='form-control'  {...getFieldProps(formik, 'ReportDate')}></input>
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

                    <select id='ddlPlantCode' className='form-control' {...getFieldProps(formik, 'PlantCodeId')} onChange={async (e) => {
                      // changed3 = e.target.value;

                      formik.setFieldValue('PlantCodeId', e.target.value);
                      await onChangeRequestType(e,formik);
                      formik.handleChange("PlantCodeId");
                    }}>
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
                      // value={SelectPlantName !== undefined && SelectPlantName[0] !== undefined ? SelectPlantName[0].ProjectName : ''}
                      {...getFieldProps(formik, 'ProjectName')}

                      readOnly
                    />
                  </div>
                </div>
                <div className='col-md-3'>
                  <label className='col-form-label'>Location </label>
                  <div>
                    <input
                      type="text"
                      className="form-control form-bd"
                      // value={SelectPlantName !== undefined && SelectPlantName[0] !== undefined ? SelectPlantName[0].Location : ''}
                      {...getFieldProps(formik, 'Location')}

                      readOnly
                    />
                  </div>



                </div>
              </div>
              <div className='form-group row'>
                <div className='col-md-3'>
                  <label className='col-form-label'>MIR NO.</label>
                  <div>
                    <input type='text' id='txtMIRNO' className='form-control'  {...getFieldProps(formik, 'MIRNO')}></input>
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
                    <input type='date' id='txtrecorddate' max={today} className='form-control'  {...getFieldProps(formik, 'RecordDate')}
                      onChange={async (e) => {
                        formik.setFieldValue('RecordDate', e.target.value);
                        await onChangeDate(e, formik);
                      }}
                    ></input>
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
                  <label className='col-form-label'>Invoice/Challan No </label>
                  <div>
                    <input type='text' id='txtInvoiceNo' className='form-control'  {...getFieldProps(formik, 'InvoiceNo')}></input>
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
                    <input type='date' id='txtinvoicedate' max={today} className='form-control'  {...getFieldProps(formik, 'InvoiceDate')}></input>
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
                    <input type='text' id='txtPONO' className='form-control'  {...getFieldProps(formik, 'PONo')}></input>
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
                    <input type='number' id='txtinvoicetax' className='form-control'  {...getFieldProps(formik, 'invoicetaxnumber')}></input>
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
                      {...getFieldProps(formik, 'PendingReasonId')}
                      onChange={async (e) => {
                        changed1 = e.target.value;
                        formik.setFieldValue('PendingReasonId', e.target.value);
                        formik.handleChange1("ddlPending");
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
                    {formik.errors.PendingReasonId ? (
                      <div
                        style={{
                          paddingTop: 0,
                          color: "#B2484D",
                          fontSize: ".75rem",
                          fontFamily: "Segoe UI"
                        }}
                      >
                        {JSON.stringify(formik.errors.PendingReasonId).replace(/"/g, '')}
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
                    <input id='txtnofodays' className='form-control'  {...getFieldProps(formik, 'NofoPendingdays')} readOnly></input>

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
                <div className='col-md-3'>
                  {/* <div>On Behalf :-</div> */}
                  <div >
                    {/*className={styles.flex} <input id='txtonBehalf' type='text' {...getFieldProps(formik, 'OnBehalf')}></input> */}
                    
                    <PeoplePicker
                      context={props.currentSPContext}
                      personSelectionLimit={1}
                      titleText="Name-Action to be taken by"
                      tooltipDirectional={1}
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

              </div>

              <div className="row my-3">
                <div className='d-flex btnall'>

                  <PrimaryButton type='submit' style={{ width: '100px', background:'#c4291c' }} className={'pr1'} text="Submit" onClick={async () => {
                    formik.setFieldValue("condition", "Submitted");
                    formik.values.condition = "Submitted";
                    //formik.values.isDraft = false;
                    await formik.validateForm().then(async (frmResult) => {
                      //formik.isValid && 
                      if (Object.keys(frmResult).length <= 0) {
                        await onRequestInitiate(formik.values);
                      }
                    });
                  }} value={'Submitted'} iconProps={{ iconName: 'Submit' }} />

                  <button type="button" className="btn btn-secondary exitbtn" onClick={() => history.push('/initiatorLanding')} style={{ borderRadius: '2px', padding: '0px 30px !important', width: '100px' }}>Exit</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      )}
    </Formik>
  );
};

function getPeoplePickerItems(items: any, arg1: any) {
  throw new Error('Function not implemented.');
}


