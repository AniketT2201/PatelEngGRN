import * as React from 'react';
import { useState } from "react";
import * as moment from 'moment'
import { Formik, FormikProps } from 'formik';
import { Icon } from '@fluentui/react/lib/Icon';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';
import ReactPaginate from 'react-paginate';
import { CSVLink } from "react-csv";
import USESPCRUD, { ISPCRUD } from '../../service/BAL/SPCRUD/spcrud';
import { Link, useHistory } from 'react-router-dom';
import { sp } from "@pnp/sp/presets/all";
import { IPatelEngProps } from "../IPatelEngProps";
import { IPendingGRN } from '../../service/INTERFACE/IPendingGRN';
import PendingGRNRequestsOps from '../../service/BAL/SPCRUD/GRNPending'
import Utilities, { IUtilities } from '../../service/BAL/SPCRUD/utilities';
import { ISPCRUDOPS } from '../../service/DAL/spcrudops';
import SPCRUDOPS from '../../service/DAL/spcrudops';
import { IPlantCodeMaster } from '../../service/INTERFACE/IPlantCodeMaster';
import PlantCodeRequestsOps from '../../service/BAL/SPCRUD/PlantCodeMaster'
import { IReasonMaster } from '../../service/INTERFACE/IReasonMaster';
import ReasonRequestsOps from '../../service/BAL/SPCRUD/ReasonMaster';
import { Label } from '@fluentui/react/lib/Label';
import styles from '../PatelEng.module.scss';
import Select from "react-select";
import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';
import './Landing.scss';
//Date
import { DatePicker } from '@fluentui/react/lib/DatePicker';
import { DayOfWeek } from '@fluentui/react';
import { TextField, MaskedTextField } from '@fluentui/react/lib/TextField';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
export const InitiatorLanding: React.FunctionComponent<IPatelEngProps> = (props: IPatelEngProps) => {
  const history = useHistory();

  const [spCrud, setSPCRUD] = React.useState<ISPCRUDOPS>();

  const [utility, setUtility] = React.useState<IUtilities>();
  const [PendingGRNMasterData, setPendingGRNCollData] = React.useState<IPendingGRN[]>();
  const [workrequestCollFilter, setworkrequestCollFilter] = React.useState<IPendingGRN[]>();
  const [plantMasterCollData, setPlantCollData] = useState<IPlantCodeMaster[]>();
  const [ReasonCollData, setreasonCollData] = useState<IReasonMaster[]>();

  const [paginatedPurchaseRequestsColl, setPaginatedPurchaseRequestsColl] = React.useState<IPendingGRN[]>();
  const [filteredData, setFilteredData] = useState<IPendingGRN[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [selectedStatus, setSelectedStatus] = React.useState<string>();
  const plantOptions = (plantMasterCollData ?? []).map((p) => ({
    value: String(p.Id),
    label: p.PlantCode
  }));
  // let spCrudObj: ISPCRUD;

  // const [Columns, setCoulmns] = React.useState<IColumn[]>();
  // const selectedStatus: string | undefined
  let itemsPerPage: number;
  itemsPerPage = 10;
  // let spCrudObj: ISPCRUDOPS;
  let spCrudObj: ISPCRUD;

  let util: IUtilities;
  const [paginationConfig, setPaginationConfig] = React.useState<{
    currentPage?: number
    , itemPerPage?: number
    , indexOfLastItem?: number
    , indexOfFirstItem?: number
    , totalPages?: number
  }>({
    currentPage: 1
    , itemPerPage: 10
    , indexOfLastItem: (1 * 10)//currentPage * itemPerPage
    , indexOfFirstItem: 10 - 10 //indexOfLastItem - itemPerPage
    , totalPages: 0
  });
  React.useEffect(() => {

    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    if (PendingGRNMasterData !== undefined) {
      setPaginatedPurchaseRequestsColl(filteredData.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(filteredData.length / itemsPerPage));

    }
  }, [itemOffset, itemsPerPage, filteredData]);
  const handlePageClick = (event: { selected: number; }) => {
    const newOffset = (event.selected * itemsPerPage) % filteredData.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };
  const handleUserInput = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setInputValue(e.target.value);
  };

  function _getPage(pageNo: number) {
    let iLastItem = (pageNo * paginationConfig.itemPerPage);
    setPaginationConfig({
      currentPage: pageNo
      , itemPerPage: paginationConfig.itemPerPage
      , indexOfLastItem: iLastItem
      , indexOfFirstItem: iLastItem - paginationConfig.itemPerPage
      , totalPages: Math.ceil(workrequestCollFilter.length / paginationConfig.itemPerPage)
    });
  }

  const _getKey = (item: any, index?: number): string => {
    return item.key;
  };
  let groupsItems;
  let groupsItems1;
  React.useEffect(() => {
    let resultarr = [];

    let groupsItems1;
    let updateddatavalue;
    //spCrudObj = await USESPCRUD();
    setSPCRUD(spCrudObj);
    let Currentloggedinuser = props.currentSPContext.pageContext.legacyPageContext.userId;



    getLoggedInSiteGroups()
    //let Currentloggedinuser = this.props.context.pageContext.legacyPageContext.userId;
    PendingGRNRequestsOps().getPendingGRNRequestsData(""
      , { column: 'Id', isAscending: true }, props).then((PendingGRNColl) => {
        let updateddatavalue = [];


        if (groupsItems.length > 0) {
          const userGroupIds = groupsItems.map(group => group.Id); // extract just the group IDs

          updateddatavalue = PendingGRNColl.filter(item =>
            item.GroupApproverId.some(id => userGroupIds.includes(id))
          );
        }



        setPendingGRNCollData(updateddatavalue);
        setFilteredData(updateddatavalue);
        //setPaginatedPurchaseRequestsColl(deviationColl);
        setPaginatedPurchaseRequestsColl(updateddatavalue);
        const endOffset = itemOffset + itemsPerPage;
        console.log(`Loading items from ${itemOffset} to ${endOffset}`);
        if (updateddatavalue !== undefined) {
          setPaginatedPurchaseRequestsColl(updateddatavalue.slice(itemOffset, endOffset));
          setPageCount(Math.ceil(updateddatavalue.length / itemsPerPage));

        }

        PlantCodeRequestsOps().getPlantCodeDataAll(props).then((plantColl) => {
          setPlantCollData(plantColl);
          ReasonRequestsOps().getReasonMasterDataAll(props).then((reasonColl) => {
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




  async function getLoggedInSiteGroups() {
    try {
      // Set up PnPjs with the SharePoint site URL
      const webUrl = props.currentSPContext.pageContext.web.absoluteUrl;

      sp.setup({
        sp: {
          baseUrl: webUrl,
        },
      });

      // Get the current user's groups
      groupsItems = await sp.web.currentUser.groups();

      // Return the groups
      return groupsItems;
    } catch (error) {
      console.error("Error fetching user groups:", error);
      return [];
    }
  }

  async function onBlockRequestSearch(filterValue: string) {
    util = await Utilities();
    setUtility(util);
    let filteredBlockRequest = await util.filterData(PendingGRNMasterData, filterValue, ['Id', 'PlantCode', 'ReportDate', 'ProjectName', 'MIRNO', 'RecdDate', 'ReasonforPending', 'SupplierName', 'InvoiceDate', 'Description', 'PONo', 'InvoiceValueIncludingTax', 'InvoiceChallanNo', 'ManualMIRdone', 'DetailedReason', 'Nosofpendingdays', 'Location', 'Remarks']);
    setPaginatedPurchaseRequestsColl(filteredBlockRequest);

    paginationConfig.currentPage = 1;
    paginationConfig.itemPerPage = 10;
    //let iLastItem = (paginationConfig.currentPage * paginationConfig.itemPerPage);

    setPaginationConfig({
      currentPage: paginationConfig.currentPage
      , itemPerPage: paginationConfig.itemPerPage
      //, indexOfLastItem: iLastItem
      //, indexOfFirstItem: iLastItem - paginationConfig.itemPerPage
      , totalPages: Math.ceil(filteredBlockRequest.length)
    });
  }


  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  async function handleDelete(itemId) {
    //  spCrudObj = async USESPCRUD();
    //         setSPCRUD(spCrudObj);
    spCrudObj = await USESPCRUD();
    setSPCRUD(spCrudObj);
    const isConfirmed = window.confirm("Are you sure you want to proceed?");
    if (isConfirmed) {
      let updatedItems = PendingGRNMasterData.filter(item => item.Id == itemId);
      // setItems(updatedItems);
      // deleteData(listName: string, itemId: number, props: IPatelEngProps): Promise<any>;
      spCrudObj.deleteData("PendingGRN", updatedItems[0].Id, props).then(async (brrAppUpdateResult) => {
        alert("Data has been deleted")
        window.location.reload()
      });
    }
    else {

    }
    // Filter out the item with the specified ID


  };
  let RoleCollPending
  async function onChangePendingReason(e, formik) {
    spCrudObj = await USESPCRUD();
    setSPCRUD(spCrudObj);

    // let startdate=formValues.Fromdate;
    let selectedvalue = e.target.value;
    // let enddate=formValues.Enddate;
    if (selectedvalue == "") {
      RoleCollPending = PendingGRNMasterData;
    }
    else {
      RoleCollPending = PendingGRNMasterData.filter((e) => e.ReasonforPendingId == selectedvalue);
    }

    //PendingGRNMasterData.ReportDate >= startdate && PendingGRNMasterData.ReportDate <= enddate;
    setPaginatedPurchaseRequestsColl(RoleCollPending);
  }

  let RoleCollPackage
  async function onChangePlantCode(e, formik) {
    spCrudObj = await USESPCRUD();
    setSPCRUD(spCrudObj);

    // let startdate=formValues.Fromdate;
    let selectedvalue = e.target.value;
    // let enddate=formValues.Enddate;
    if (selectedvalue == "") {
      RoleCollPackage = PendingGRNMasterData;
    }
    else {
      RoleCollPackage = PendingGRNMasterData.filter((e) => e.PlantCodeId == selectedvalue);
    }

    //PendingGRNMasterData.ReportDate >= startdate && PendingGRNMasterData.ReportDate <= enddate;
    setPaginatedPurchaseRequestsColl(RoleCollPackage);
  }

  const formatLocalDate = (dateStr) => {
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const onRequestInitiate = async (formValues: any) => {
    const { Fromdate, Enddate, PlantCodeId } = formValues;
    let filtered = PendingGRNMasterData || [];
    // ✅ Date filter
    if (Fromdate && Enddate) {
      filtered = filtered.filter((e) => {
        const reportDate = e.ReportDate.split('T')[0];
        return reportDate >= Fromdate.split('T')[0] &&
              reportDate <= Enddate.split('T')[0];
      });
    }
    // ✅ PlantCode filter (MULTI SELECT)
    if (PlantCodeId && PlantCodeId.length > 0) {
      filtered = filtered.filter(item =>
        PlantCodeId.includes(item.PlantCodeId?.toString())
      );
    }
    // ✅ Final result
    setFilteredData(filtered);
    setItemOffset(0);
  };
  async function onRequestReset(formValues: any) {
    window.location.reload()


  }

  function getFieldProps(formik: FormikProps<any>, field: string) {
    return { ...formik.getFieldProps(field), errorMessage: formik.errors[field] as string };
  }

  const initialvalues = {
    Response: '',
    Enddate:'',
    Fromdate:'',
    PlantCodeId: []
  };

  const headers = [
    { label: "Report Date", key: "ReportDate" },
    { label: "Plant Code", key: "PlantCode" },
    { label: "Project Name", key: "ProjectName" },
    { label: "MIRNO", key: "MIRNO" },
    { label: "RecdDate", key: "RecdDate" },
    { label: "SupplierName", key: "SupplierName" },
    { label: "Invoice / Challan No", key: "InvoiceChallanNo" },
    { label: "Invoice Date", key: "InvoiceDate" },
    { label: "Description", key: "Description" },
    { label: "P.O. NO", key: "PONo" },
    { label: "Invoice Value (Including Tax)", key: "InvoiceValueIncludingTax" },
    { label: "Manual-MIR done", key: "ManualMIRdone" },
    { label: "Reason for Pending", key: "ReasonforPending" },
    { label: "Detailed Reason", key: "DetailedReason" },
    { label: "Nos of pending days= (F-B)", key: "Nosofpendingdays" },
    { label: "Name-Action to be taken by", key: "NameActiontobetakenby" },
    { label: "Location", key: "Location" },
    { label: "Remarks", key: "Remarks" },
    { label: "Last Modified By", key: "Editor" },
    { label: "Last Modified", key: "Modified" }

  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Formik initialValues={initialvalues}

      onSubmit={(values, helpers) => { }}>{
        formik => (
          <div className='main'>
            {/* className={styles.elementactions} */}
            <div className='element-actions'>
              <span className={styles.btnnew} style={{ background: '#c4291c', borderColor: 'border-color' }}><Link to="/"><Icon iconName="AddTo" style={{ fontSize: '18px', paddingRight: '7px', paddingTop: '3px', marginRight: '18px' }} /> New Entry</Link></span>
            </div>
            <div className={styles.innertabs}>

              <div className='p-3 my-2 bg-white shadow-sm border'>
                <h3 className={styles.headingh1 + ' ' + 'elementheading'}>MIS_1_Weekly Monthly Pending GRN Dashboard</h3>
                <div className='mt-40'>
                  <div className='row mr--1' style={{ display: 'flex', flexWrap: 'wrap', marginRight: '15px' }}>

                    {<><div className='col-md-3'>
                      <div className='form-group'>
                        <label className='col-form-label mb-0'>Report From date</label>
                        <DatePicker
                          id="txtstartdate"
                          placeholder="Enter or select a date"
                          allowTextInput={true}
                          firstDayOfWeek={DayOfWeek.Sunday}
                          maxDate={today}
                          value={formik.values.Fromdate ? new Date(formik.values.Fromdate) : undefined}
                          onSelectDate={(date) => formik.setFieldValue('Fromdate', date?.toISOString())}
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
                      </div>
                    </div>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='col-form-label mb-0'>Report End date</label>
                          <DatePicker
                            id="txtenddate"
                            placeholder="Enter or select a date"
                            allowTextInput={true}
                            firstDayOfWeek={DayOfWeek.Sunday}
                            maxDate={today}
                            value={formik.values.Enddate ? new Date(formik.values.Enddate) : undefined}
                            onSelectDate={(date) => formik.setFieldValue('Enddate', date?.toISOString())}
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
                        </div>
                      </div>

                      <div className='col-md-2 mt--4'>
                        <PrimaryButton
                          type='submit'
                          style={{ width: '147px', background: ' #c4291c' }}
                          className={styles.btnprimary + ' ' + 'pr1'}
                          text='Search'
                          onClick={async () => {
                            await onRequestInitiate(formik.values);
                          }}
                          value={'Submitted'}
                          iconProps={{ iconName: 'Search' }} />
                      </div>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='col-form-label mr-2'>Plant Code</label>
                          <Select
                            options={plantOptions}
                            className={"plantCodeFromControl"}
                            isMulti                      
                            value={plantOptions.filter(opt =>
                              formik.values.PlantCodeId.includes(opt.value)
                            )}
                            onChange={(selected) => {
                              const values = selected ? selected.map(s => String(s.value)) : [];
                              formik.setFieldValue("PlantCodeId", values);
                            
                            }}
                          />
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='form-group' style={{ marginTop: '-10px' }}>
                          <label className='col-form-label mr-2'>Reason for <br /> Pending</label>
                          <select id='ddlPending' className='form-control' name='ddlPending'
                            {...getFieldProps(formik, 'PendingReasonId')} onChange={async (e) => {
                              // changed3 = e.target.value;

                              formik.setFieldValue('PendingReasonId', e.target.value);
                              await onChangePendingReason(e, formik);
                              //formik.handleChange("PlantCodeId");
                            }}

                          >
                            <option value="">Select</option>
                            {ReasonCollData !== undefined ? ReasonCollData.map((Vend) => <option key={Vend.Id} value={Vend.Id}>{Vend.Reason}</option>) : ''}
                          </select>  
                        </div>
                      </div>

                      <div className='col-md-3 mt--4'>
                        <PrimaryButton
                          type='submit'
                          style={{ background: ' #c4291c', width: '120px' }}
                          className={styles.btnprimary + ' ' + 'pr1'}
                          text='Search'
                          onClick={async () => {
                            await onRequestInitiate(formik.values);
                          }}
                          value={'Submitted'}
                          iconProps={{ iconName: 'Search' }} />

                        <PrimaryButton
                          type='submit'
                          style={{ background: ' #c4291c', width: '120px' }}
                          className={styles.btnprimary + ' ' + 'pr1'}
                          text='Reset'
                          onClick={async () => {
                            await onRequestReset(formik.values);
                          }}
                          value={'Submitted'}
                          iconProps={{ iconName: 'Reset' }} />
                      </div>
                      {/* <div className='col-md-1 mt--4'></div> */}
                    </>


                    }

                    <div className='col-md-2' style={{ textAlign: 'left', fontSize: "13px", marginTop: '3px' }}>
                      <div className="excel" style={{ border: '1px solid #c4291c', padding: "5px", width: 'calc(100% - 40px)', backgroundColor: '#c4291c', borderRadius: '3px', height: '35px', textAlign: 'center' }}>
                        {paginatedPurchaseRequestsColl != undefined && paginatedPurchaseRequestsColl.length > 0 ?

                          <CSVLink data={paginatedPurchaseRequestsColl} headers={headers} filename={'InitiatorLanding.csv'} style={{ textDecoration: 'none', color: 'white' }}>
                            {/* <span iconProps={{ iconName: 'ExcelLogoInverse' }} text='Export to Excel' ></span> */}
                            {/* <Icon iconName='ExcelDocument'>Export to Excel</Icon> */}
                            <Icon iconName="ExcelDocument" style={{ color: 'white' }} /> <span className='pl-2' style={{ color: '#fff', paddingLeft: '7px' }}>Export to Excel</span>
                          </CSVLink> :
                          ''}
                      </div>

                    </div>
                    <div className='col-md-3 mt--2'>
                      <Stack>
                        <SearchBox placeholder="Search" className="sbtn"
                          onSearch={newValue => onBlockRequestSearch(newValue)}
                          onClear={ev => onBlockRequestSearch('')}
                          onBlur={ev => onBlockRequestSearch(ev.target.value)} />
                      </Stack>
                    </div>
                    <div className="col-md-2" style={{textAlign:'left', fontSize: "13px" , marginTop:'3px'}}>
                      <div className="excel" onClick={() => history.push("/GRNExcelUploadForm")} style={{border: '1px solid #c4291c',padding: "5px",width:'calc(100% - 40px)',backgroundColor:'#c4291c',borderRadius:'3px',height:'35px', textAlign:'center'}}>
                        <Icon iconName="ExcelDocument" style={{color:'white'}}/> <span className='pl-2'style={{color:'#fff', paddingLeft:'7px'}}>Excel Validation</span>
                      </div>
                    </div>





                  </div>
                  <div style={{ overflowX: "auto", width: "100%" }}>
                    <table className={styles.tblrequest + ' ' + styles.tablebordered}>
                      <thead>
                        <tr>
                          <th>Edit </th>
                          <th>Delete </th>
                          <th>Report Date</th>
                          <th>Plant Code</th>
                          <th>Project Name</th>
                          <th>MIR No</th>
                          <th>Recd Date</th>
                          <th>Supplier Name </th>
                          <th>Invoice / Challan No</th>
                          <th>Invoice Date</th>
                          <th>Description </th>
                          <th>P.O. NO</th>
                          <th>Invoice Value (Including Tax)</th>
                          <th>Manual-MIR done</th>
                          <th>Reason for Pending</th>
                          <th>Detailed Reason</th>
                          <th>Nos of pending days= (F-B) </th>

                          <th>Name-Action to be taken by </th>
                          <th>Location </th>
                          <th>Remarks (If any)</th>
                          <th>Last Modified By </th>
                          <th>Last Modified Date</th>

                          {/* <th style={{width:'200px', textAlign:'center'}} >Approve</th> */}
                        </tr>
                      </thead>

                      <tbody>


                        {paginatedPurchaseRequestsColl != undefined ? paginatedPurchaseRequestsColl
                        ?.sort((a, b) => new Date(b.ReportDate).getTime() - new Date(a.ReportDate).getTime())
                        .map((purchaseReqObj) =>
                          <tr>
                            <td style={{ textAlign: 'center' }}>
                              {


                                <Link to={'/EditRequest/' + purchaseReqObj.Id} >
                                  <Icon iconName="PageEdit" className={styles.icon} />

                                </Link>

                              }
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {


                                // <Link to={'/DeleteRequest/' + purchaseReqObj.Id}>
                                <Icon iconName="Delete" className={styles.icon} onClick={() => handleDelete(purchaseReqObj.Id)} />
                                // </Link>

                              }
                            </td>
                            <td>{moment(new Date(purchaseReqObj.ReportDate)).format('DD/MM/YYYY')}</td>

                            {/* {(new Date(purchaseReqObj.ReportDate).toISOString().split('T')[0])} */}
                            {/* const [year, month, day] = purchaseReqObj.ReportDate.split('-'); */}
                            {/* {purchaseReqObj.ReportDate.format('DD/MM/YYYY')} */}

                            {/* {purchaseReqObj[0]?.ReportDate.split('T')[0]} */}


                            <td>
                              {purchaseReqObj.PlantCode}
                            </td>
                            <td>
                              {purchaseReqObj.ProjectName}
                            </td>
                            <td>
                              {purchaseReqObj.MIRNO}
                            </td>
                            <td>{moment(new Date(purchaseReqObj.RecdDate)).format('DD/MM/YYYY')}</td>


                            {/* <td>
                                       {new Date(purchaseReqObj.RecdDate).toISOString().split('T')[0]}


                                      </td> */}
                            <td>
                              {purchaseReqObj.SupplierName}
                            </td>
                            <td>
                              {purchaseReqObj.InvoiceChallanNo}
                            </td>
                            {/* <td>
                                      {new Date(purchaseReqObj.InvoiceDate).toISOString().split('T')[0]}

                                      </td> */}
                            <td>{moment(new Date(purchaseReqObj.InvoiceDate)).format('DD/MM/YYYY')}</td>

                            <td>
                              {purchaseReqObj.Description}
                            </td>
                            <td>
                              {purchaseReqObj.PONo}
                            </td>
                            <td>
                              {purchaseReqObj.InvoiceValueIncludingTax}
                            </td>
                            <td>
                              {purchaseReqObj.ManualMIRdone}
                            </td>

                            <td>
                              {purchaseReqObj.ReasonforPending}
                            </td>
                            <td>
                              {purchaseReqObj.DetailedReason}
                            </td>

                            <td>
                              {purchaseReqObj.Nosofpendingdays}
                            </td>
                            <td>
                              {purchaseReqObj.NameActiontobetakenby}
                            </td>
                            <td>
                              {purchaseReqObj.Location}
                            </td>
                            <td>
                              {purchaseReqObj.Remarks}
                            </td>
                            <td>
                              {purchaseReqObj.Editor}
                            </td>
                            <td>{moment(new Date(purchaseReqObj.Modified)).format('DD/MM/YYYY')}</td>






                          </tr>
                        ) : []}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
              <ReactPaginate
                breakLabel="..."
                nextLabel="Next"
                onPageChange={handlePageClick}
                pageRangeDisplayed={10}
                pageCount={pageCount}
                previousLabel="Previous"
                className='pagination'
                renderOnZeroPageCount={null}
              />
            </div>
          </div>
        )
      }
    </Formik>

  )
}

function async(arg0: (props: IPatelEngProps) => any[]) {
  throw new Error('Function not implemented.');
}
