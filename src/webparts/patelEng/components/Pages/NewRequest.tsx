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
import { BaseButton, Button, IPersonaProps } from 'office-ui-fabric-react';
import { DatePicker } from '@fluentui/react/lib/DatePicker';
import { DayOfWeek } from '@fluentui/react';

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
import { useFormikContext } from "formik";

import { TextField, MaskedTextField } from '@fluentui/react/lib/TextField';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  IconButton,
  PrimaryButton,
  DefaultButton,
  Stack,
  MessageBar,
  MessageBarType,
  Selection, 
  SelectionMode
} from "@fluentui/react";
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
  const [gridData, setGridData] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [peoplePickerKey, setPeoplePickerKey] = useState(0);


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

  // Selection for Grid
  const selection = React.useRef(
    new Selection({
      onSelectionChanged: () => {
        const selected = selection.current.getSelection() as any[];
        setSelectedItems(selected);
      }
    })
  );

//   async function onRequestInitiate(formValues: any) {
//     spCrudObj = await USESPCRUD();
//     setSPCRUD(spCrudObj);
//     let date = new Date();
// date.setDate(date.getDate() + 1);

// // Format the date as YYYY-MM-DD
// let futureDate = date.toISOString().split('T')[0];
// console.log(futureDate);
//     if(formValues.ReportDate >= futureDate){
//       alert ("Future date not allowed in the Report Date field")
//       return false
//     }
//     if(formValues.RecordDate >= futureDate){
//       alert ("Future date not allowed in the Received Date field")
//       return false
//     }
//     if(formValues.InvoiceDate >= futureDate){
//       alert ("Future date not allowed in the Invoice Date field")
//       return false
//     }
   
//     let onBehalf = 0;
//     let onBehalfEmail = "";
//     if (user === undefined) {
//       onBehalf = 0;
//       const reportingManagerEmail = props.currentSPContext.pageContext.legacyPageContext.userEmail;
//     }
//     else {
//       onBehalf = parseInt(user[0].id);
//       //let email=user[0].secondaryText;
//       const reportingManagerEmail = user[0].secondaryText;

//     }
//   //   var peoplePickerData = formValues.GroupApproverId.map(function (item.Id) {
//   //     return {
//   //         "Key": item.Id.toString(), // ID as a string
//   //         "Value": item.Title         // Display Name
//   //     };
//   // });
//   let useval=formValues.GroupApproverId.map(item => item.Id);

//     let PRRequest: any = {
//       //InitiatorNameId: item.InitiatorNameId,
//       'ReportDate': formValues.ReportDate
//       // , 'PlantCodeId': SelectPlantName[0].Id
//       , 'PlantCodeId': formValues.PlantCodeId

//       , 'ProjectName': formValues.ProjectName
//       , 'Location': formValues.Location
//       , 'MIRNO': '' + formValues.MIRNO
//       , 'RecdDate': formValues.RecordDate
//       , 'SupplierName': '' + formValues.SupplierName
//       , 'InvoiceChallanNo': '' + formValues.InvoiceNo
//       , 'InvoiceDate': formValues.InvoiceDate
//       , 'Description': '' + formValues.Descripition
//       , 'PONo': '' + formValues.PONo
//       , 'InvoiceValueIncludingTax': '' + formValues.invoicetaxnumber
//       , 'DetailedReason': '' + formValues.DetailedReason
//       , 'Nosofpendingdays': '' + formValues.NofoPendingdays
//       , 'ManualMIRdone': formValues.MRIManual
//       , 'ReasonforPendingId': formValues.PendingReasonId
//       , 'Remarks': formValues.Remark
//       , 'NameActiontobetakenbyId': onBehalf
//       //,"GroupApproverId":{result:SelectPlantName[0].GroupApprover}GroupApproverId
//       //,"GroupApproverId":{GroupApproverId}
//       ,"GroupApproverId": { "results": useval}

//     };

//     console.log(formValues);
//     console.log(PRRequest);
//     //return false;

//     await spCrudObj.insertData("PendingGRN", PRRequest, props).then(async (brrInsertResult) => {
//       alert("Pending GRN details submitted successfully")
//       history.push('/InitiatorLanding');


//     });

//   }

  // Function to add formdata into grid
  const addToGrid = async (formValues: any, formik: any) => {
  setErrorMsg("");

  // ---------- Date validation ----------
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const futureDate = date.toISOString().split("T")[0];

  if (formValues.ReportDate >= futureDate) {
    setErrorMsg("Future date not allowed in the Report Date field");
    return;
  }
  if (formValues.RecordDate >= futureDate) {
    setErrorMsg("Future date not allowed in the Received Date field");
    return;
  }
  if (formValues.InvoiceDate >= futureDate) {
    setErrorMsg("Future date not allowed in the Invoice Date field");
    return;
  }

  // ---------- People picker approvers ----------
  if (!formValues.GroupApproverId || formValues.GroupApproverId.length === 0) {
    setErrorMsg("Please select at least one approver.");
    return;
  }

  const GroupIds = formValues.GroupApproverId.map((item: any) => item.Id);

  // ---------- On behalf ----------
  let onBehalf = 0;
  if (user !== undefined) {
    onBehalf = parseInt(user[0].id);
  }

  // ---------- Add row ----------
  const row: any = {
    ReportDate: formValues.ReportDate,
    PlantCodeId: parseInt(formValues.PlantCodeId),
    ProjectName: formValues.ProjectName,
    Location: formValues.Location,

    MIRNO: formValues.MIRNO,
    RecdDate: formValues.RecordDate,
    SupplierName: formValues.SupplierName,
    InvoiceChallanNo: formValues.InvoiceNo,
    InvoiceDate: formValues.InvoiceDate,
    Description: formValues.Descripition,
    PONo: formValues.PONo,
    InvoiceValueIncludingTax: formValues.invoicetaxnumber,
    DetailedReason: formValues.DetailedReason,
    Nosofpendingdays: formValues.NofoPendingdays,
    ManualMIRdone: formValues.MRIManual,
    ReasonforPendingId: formValues.PendingReasonId,
    Remarks: formValues.Remark,

    NameActiontobetakenbyId: onBehalf,
    GroupIds
  };

  setGridData(prev => [...prev, row]);
  formik.resetForm();
  setUser([]);
  setPeoplePickerKey(k => k + 1);
};


  // Delete row from grid
  const deleteRow = (index: number) => {
    const updated = [...gridData];
    updated.splice(index, 1);
    setGridData(updated);
  };

  // Create columns for all grid entries
  const columns: IColumn[] = [
  { key: "reportDate", name: "Report Date", fieldName: "ReportDate", minWidth: 100 },
  { key: "plantCode", name: "Plant Code", fieldName: "PlantCodeId", minWidth: 90 },
  { key: "project", name: "Project Name", fieldName: "ProjectName", minWidth: 130 },
  { key: "location", name: "Location", fieldName: "Location", minWidth: 120 },

  { key: "mirNo", name: "MIR No", fieldName: "MIRNO", minWidth: 120 },
  { key: "recdDate", name: "Received Date", fieldName: "RecdDate", minWidth: 120 },
  { key: "supplier", name: "Supplier Name", fieldName: "SupplierName", minWidth: 160 },
  { key: "invoiceNo", name: "Invoice / Challan No", fieldName: "InvoiceChallanNo", minWidth: 170 },
  { key: "invoiceDate", name: "Invoice Date", fieldName: "InvoiceDate", minWidth: 120 },

  { key: "desc", name: "Description", fieldName: "Description", minWidth: 220 },
  { key: "poNo", name: "PO No", fieldName: "PONo", minWidth: 120 },
  {
    key: "invoiceValue",
    name: "Invoice Value (Incl. Tax)",
    fieldName: "InvoiceValueIncludingTax",
    minWidth: 190
  },
  {
    key: "detailedReason",
    name: "Detailed Reason",
    fieldName: "DetailedReason",
    minWidth: 220
  },
  {
    key: "pendingDays",
    name: "No. of Pending Days",
    fieldName: "Nosofpendingdays",
    minWidth: 160
  },
  {
    key: "manualMir",
    name: "Manual MIR Done",
    fieldName: "ManualMIRdone",
    minWidth: 150
  },
  {
    key: "pendingReason",
    name: "Reason for Pending",
    fieldName: "ReasonforPendingId",
    minWidth: 180
  },
  { key: "remarks", name: "Remarks", fieldName: "Remarks", minWidth: 180 },

  {
    key: "action",
    name: "Action",
    minWidth: 60,
    onRender: (_item, index) => (
      <IconButton
        iconProps={{ iconName: "Delete" }}
        title="Delete"
        ariaLabel="Delete"
        styles={{
          root: { color: "#a4262c", width: "fit-content", alignSelf: "center" },
          rootHovered: { color: "#750b1c" }
        }}
        onClick={() => deleteRow(index!)}
      />
    )
  }
];



  // Submit all grid data to SharePoint List
  const submitAll = async () => {
  if (selectedItems.length === 0) {
    setErrorMsg("Please select at least one record to submit.");
    return;
  }

  setIsSubmitting(true);

  try {
    const spCrudObj = await USESPCRUD();

    for (const item of selectedItems) {
      const payload = {
        ReportDate: item.ReportDate,
        PlantCodeId: item.PlantCodeId,
        ProjectName: item.ProjectName,
        Location: item.Location,

        MIRNO: "" + item.MIRNO,
        RecdDate: item.RecdDate,
        SupplierName: "" + item.SupplierName,
        InvoiceChallanNo: "" + item.InvoiceChallanNo,
        InvoiceDate: item.InvoiceDate,
        Description: "" + item.Description,
        PONo: "" + item.PONo,
        InvoiceValueIncludingTax: "" + item.InvoiceValueIncludingTax,
        DetailedReason: "" + item.DetailedReason,
        Nosofpendingdays: "" + item.Nosofpendingdays,
        ManualMIRdone: item.ManualMIRdone,
        ReasonforPendingId: item.ReasonforPendingId,
        Remarks: item.Remarks,

        NameActiontobetakenbyId: item.NameActiontobetakenbyId,
        GroupApproverId: { results: item.GroupIds }
      };

      await spCrudObj.insertData("PendingGRN", payload, props);
    }

    const count = selectedItems.length;
    alert(
      count === 1
        ? "1 Pending GRN record submitted successfully."
        : `${count} Pending GRN records submitted successfully.`
    );

    setGridData([]);
    history.push("/InitiatorLanding");

  } catch (error) {
    console.error(error);
    setErrorMsg("Error occurred while submitting Pending GRN data.");
  } finally {
    setIsSubmitting(false);
  }
};



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
    ProjectName: '',
    Location: '',
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
    Remark: '',
    NameOfAction:[],
    setUser:''


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

  function onChangeDate(selectedDate, formik) {
    if (!selectedDate) return;

    const today = new Date();

    // Normalize both dates
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const timeDiff = today.getTime() - selectedDate.getTime();
    const diffDays = Math.max(0, Math.floor(timeDiff / (1000 * 60 * 60 * 24)));

    formik.setFieldValue('NofoPendingdays', diffDays);
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
                    <DatePicker
                      id="txtReportDate"
                      placeholder="Enter or select a date"
                      allowTextInput={true}
                      firstDayOfWeek={DayOfWeek.Sunday}
                      maxDate={today}
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
                      {formik.errors.ReportDate && (
                        <div style={{
                          paddingTop: 0,
                          color: "#B2484D",
                          fontSize: ".75rem",
                          fontFamily: "Segoe UI"
                          }}>
                          {formik.errors.ReportDate}
                        </div>
                      )}
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
                      maxDate={today}
                      value={formik.values.RecordDate ? new Date(formik.values.RecordDate) : undefined}

                      onSelectDate={(date) => {
                        if (!date) return;

                        // Save date (same as old code behavior)
                        formik.setFieldValue('RecordDate', date.toISOString());

                        // OLD functionality: calculate pending days
                        onChangeDate(date, formik);
                      }}

                      onKeyDown={(e) => {
                        const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                        if (!/[0-9\/]/.test(e.key) && !allowedKeys.includes(e.key)) {
                          e.preventDefault();
                        }
                      }}

                      parseDateFromString={(input) => {
                        const today = new Date();
                        const parts = input.split(/[\/\-]/).map(p => p.trim()).filter(Boolean);

                        if (parts.length === 1) {
                          return new Date(today.getFullYear(), today.getMonth(), Number(parts[0]));
                        }

                        if (parts.length === 2) {
                          return new Date(today.getFullYear(), Number(parts[1]) - 1, Number(parts[0]));
                        }

                        if (parts.length === 3) {
                          let [day, month, year] = parts.map(Number);
                          if (!year || year < 100) year = today.getFullYear();
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

                    {formik.errors.RecordDate && (
                      <div style={{
                        paddingTop: 0,
                        color: "#B2484D",
                        fontSize: ".75rem",
                        fontFamily: "Segoe UI"
                      }}>
                        {formik.errors.RecordDate}
                      </div>
                    )}
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
                      maxDate={today}
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
                    {formik.errors.InvoiceDate && (
                      <div style={{
                        paddingTop: 0,
                        color: "#B2484D",
                        fontSize: ".75rem",
                        fontFamily: "Segoe UI"
                      }}>
                        {formik.errors.InvoiceDate}
                      </div>
                    )}
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
                      key={peoplePickerKey}
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

                  <PrimaryButton type='submit' style={{ width: '100px', background:'#c4291c' }} className={'pr1'} text="ADD" onClick={async () => {
                    formik.setFieldValue("condition", "Submitted");
                    formik.values.condition = "Submitted";
                    //formik.values.isDraft = false;
                    await formik.validateForm().then(async (frmResult) => {
                      //formik.isValid && 
                      if (Object.keys(frmResult).length <= 0) {
                        await addToGrid(formik.values, formik);
                      }
                    });
                  }} value={'Submitted'} iconProps={{ iconName: 'ADD' }} />

                  <button type="button" className="btn btn-secondary exitbtn" onClick={() => history.push('/initiatorLanding')} style={{ borderRadius: '2px', padding: '0px 30px !important', width: '100px' }}>Exit</button>
                </div>
              </div>
              {/* Error Message */}
            {errorMsg && (
              <MessageBar messageBarType={MessageBarType.error}>
                {errorMsg}
              </MessageBar>
            )}

            {/* GRID */}
            {gridData.length > 0 && (
              <Stack tokens={{ childrenGap: 15 }} styles={{ root: { marginTop: 30 } }}>
                <DetailsList
                  items={gridData}
                  columns={columns}
                  selection={selection.current}
                  selectionMode={SelectionMode.multiple}
                  layoutMode={DetailsListLayoutMode.fixedColumns}
                />

                <PrimaryButton
                  text={isSubmitting ? "Submitting..." : "Submit"}
                  onClick={submitAll}
                  disabled={isSubmitting}
                  styles={{
                    root: { backgroundColor: "#a4262c", width: "fit-content", alignSelf: "center" },
                    rootHovered: { backgroundColor: "#750b1c" }
                  }}
                />
              </Stack>
            )}
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


