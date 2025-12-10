import * as React from 'react';
import { useState } from "react";
import * as moment from 'moment'
import { Formik, FormikProps } from 'formik';
import { Icon } from '@fluentui/react/lib/Icon';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';
import ReactPaginate from 'react-paginate';
import { CSVLink } from "react-csv";
// import styles from '../Pages/NewRequest.scss';
// import { useHistory } from 'react-router-dom';
// import IPatelEngProps from '../Pages/IPatelEngProps'
import USESPCRUD, { ISPCRUD } from '../../service/BAL/SPCRUD/spcrud';
import { Link, useHistory } from 'react-router-dom';

import { IPatelEngProps } from "../IPatelEngProps";
// import { IBillCycleMaster } from '../../service/INTERFACE/IBillCycleMaster';
// import { ICategoryMaster } from '../../service/INTERFACE/ICategoryMaster';
// import { IITMaster } from '../../service/INTERFACE/IITMaster';
// import { ILocationMaster } from '../../service/INTERFACE/ILocationMaster';
// import { IMonthMaster } from '../../service/INTERFACE/IMonthMaster';
import { IPendingGRN } from '../../service/INTERFACE/IPendingGRN';
// import { IReasonMaster } from '../../service/INTERFACE/IReasonMaster';
// import { ITypeMaster } from '../../service/INTERFACE/ITypeMaster';
// import { IYearMaster } from '../../service/INTERFACE/IYearMaster';
import PendingGRNRequestsOps from '../../service/BAL/SPCRUD/GRNPending'
import Utilities, { IUtilities } from '../../service/BAL/SPCRUD/utilities';
// import Utilities from '../../service/BAL/SPCRUD/utilities';
//import ISPCRUDOPS from '../../service/DAL/spcrudops'

import { ISPCRUDOPS } from '../../service/DAL/spcrudops';
import SPCRUDOPS from '../../service/DAL/spcrudops';
import { IPlantCodeMaster } from '../../service/INTERFACE/IPlantCodeMaster';
import PlantCodeRequestsOps from '../../service/BAL/SPCRUD/PlantCodeMaster'
//import useUtilities, { IUtilities } from '../../../services/bal/utilities';
// import USESPCRUD, { ISPCRUD } from '../../service/BAL/SPCRUD/spcrud';
import { IReasonMaster } from '../../service/INTERFACE/IReasonMaster';
import ReasonRequestsOps from '../../service/BAL/SPCRUD/ReasonMaster';
// import { ISPCRUDOPS } from "../../services/DAL/spcrudops";
// import SPCRUDOPS from "../../services/DAL/spcrudops";
// import SPCRUDOPS from '../../service/DAL/spcrudops';
//import useUtilities, { IUtilities } from '../../../services/bal/utilities';
// import { ISPCRUDOPS } from "../../services/DAL/spcrudops";
import { Label } from '@fluentui/react/lib/Label';
import styles from '../PatelEng.module.scss';
import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';
import './Landing.scss';

//import ISPCRUDOPS from "../../service/DAL/spcrudops"
// import { Link, useHistory } from 'react-router-dom';

//import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { TextField, MaskedTextField } from '@fluentui/react/lib/TextField';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
export const InitiatorLanding: React.FunctionComponent<IPatelEngProps> = (props: IPatelEngProps) => {
       const history = useHistory();
  
    const [spCrud, setSPCRUD] = React.useState<ISPCRUDOPS>();
   // const [spCrud, setSPCRUD] = React.useState<SPCRUDOPS>();

    const [utility, setUtility] = React.useState<IUtilities>();
    //const [ApproverMasterData, setApproverMasterCollData] = React.useState<IApproverMaster[]>();
    const [PendingGRNMasterData, setPendingGRNCollData] = React.useState<IPendingGRN[]>();
    const [workrequestCollFilter, setworkrequestCollFilter] = React.useState<IPendingGRN[]>();
    const [plantMasterCollData, setPlantCollData] = useState<IPlantCodeMaster[]>();
    const [ReasonCollData, setreasonCollData] = useState<IReasonMaster[]>();
  
    const [paginatedPurchaseRequestsColl, setPaginatedPurchaseRequestsColl] = React.useState<IPendingGRN[]>();
    const [inputValue, setInputValue] = useState("");
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [selectedStatus, setSelectedStatus] = React.useState<string>();

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
       setPaginatedPurchaseRequestsColl(PendingGRNMasterData.slice(itemOffset, endOffset));
       setPageCount(Math.ceil(PendingGRNMasterData.length / itemsPerPage));
  
      }
    }, [itemOffset, itemsPerPage]);
    const handlePageClick = (event: { selected: number; }) => {
      const newOffset = (event.selected * itemsPerPage) % PendingGRNMasterData.length;
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
  
  
    React.useEffect(() => {
      let resultarr = [];
      let Currentloggedinuser = props.currentSPContext.pageContext.legacyPageContext.userId;
      //let Currentloggedinuser = this.props.context.pageContext.legacyPageContext.userId;
      PendingGRNRequestsOps().getPendingGRNRequestsData("AuthorId eq " + props.currentSPContext.pageContext.legacyPageContext.userId +""
              ,{ column: 'Id', isAscending: false }, props).then((PendingGRNColl) => {
            setPendingGRNCollData(PendingGRNColl);
             //setPaginatedPurchaseRequestsColl(deviationColl);
             setPaginatedPurchaseRequestsColl(PendingGRNColl);
                const endOffset = itemOffset + itemsPerPage;
                console.log(`Loading items from ${itemOffset} to ${endOffset}`);
                if (PendingGRNColl !== undefined) {
                  setPaginatedPurchaseRequestsColl(PendingGRNColl.slice(itemOffset, endOffset));
                  setPageCount(Math.ceil(PendingGRNColl.length / itemsPerPage));
            
                }

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
  
  
      
      
     
  
      async function onBlockRequestSearch(filterValue: string) {
        util = await Utilities();
        setUtility(util);
        let filteredBlockRequest = await util.filterData(PendingGRNMasterData, filterValue, ['Id', 'PlantCode', 'ReportDate', 'ProjectName', 'MIRNO', 'RecdDate', 'ReasonforPending', 'SupplierName','InvoiceDate','Description', 'PONo', 'InvoiceValueIncludingTax', 'InvoiceChallanNo', 'ManualMIRdone', 'DetailedReason','Nosofpendingdays','Location','Remarks']);
        setPaginatedPurchaseRequestsColl(filteredBlockRequest);
      
        paginationConfig.currentPage = 1;
        paginationConfig.itemPerPage = 10;
        let iLastItem = (paginationConfig.currentPage * paginationConfig.itemPerPage);
      
        setPaginationConfig({
            currentPage: paginationConfig.currentPage
            , itemPerPage: paginationConfig.itemPerPage
            , indexOfLastItem: iLastItem
            , indexOfFirstItem: iLastItem - paginationConfig.itemPerPage
            , totalPages: Math.ceil(filteredBlockRequest.length / paginationConfig.itemPerPage)
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
                        alert ("Data has been deleted")
                        window.location.reload()
                      });
                } 
                else{

                }               
        // Filter out the item with the specified ID
       
        
      };
      let RoleCollPending
     async function onChangePendingReason(e,formik){
      spCrudObj = await USESPCRUD();
      setSPCRUD(spCrudObj);

      // let startdate=formValues.Fromdate;
      let selectedvalue = e.target.value;
      // let enddate=formValues.Enddate;
      if(selectedvalue==""){
        RoleCollPending = PendingGRNMasterData;
      }
      else{
        RoleCollPending = PendingGRNMasterData.filter((e) => e.ReasonforPendingId == selectedvalue);
      }

      //PendingGRNMasterData.ReportDate >= startdate && PendingGRNMasterData.ReportDate <= enddate;
      setPaginatedPurchaseRequestsColl(RoleCollPending);
     }

     let RoleCollPackage
     async function onChangePlantCode(e,formik){
      spCrudObj = await USESPCRUD();
      setSPCRUD(spCrudObj);

      // let startdate=formValues.Fromdate;
      let selectedvalue = e.target.value;
      // let enddate=formValues.Enddate;
      if(selectedvalue==""){
        RoleCollPackage = PendingGRNMasterData;
      }
      else{
      RoleCollPackage = PendingGRNMasterData.filter((e) => e.PlantCodeId == selectedvalue);
      }

      //PendingGRNMasterData.ReportDate >= startdate && PendingGRNMasterData.ReportDate <= enddate;
      setPaginatedPurchaseRequestsColl(RoleCollPackage);
     }
  
          async function onRequestInitiate(formValues: any) {
              spCrudObj = await USESPCRUD();
              setSPCRUD(spCrudObj);
      
              let startdate=formValues.Fromdate;
              let enddate=formValues.Enddate;

              //PendingGRNMasterData.ReportDate >= startdate && PendingGRNMasterData.ReportDate <= enddate;
              let RoleCollPackage1 = PendingGRNMasterData.filter((e) => e.ReportDate.split('T')[0] >= startdate && e.ReportDate.split('T')[0] <= enddate);
              setPaginatedPurchaseRequestsColl(RoleCollPackage1);
              // paginationConfig.currentPage = 1;
              // paginationConfig.itemPerPage = 10;
              // let iLastItem = (paginationConfig.currentPage * paginationConfig.itemPerPage);
            
              // setPaginationConfig({
              //     currentPage: paginationConfig.currentPage
              //     , itemPerPage: paginationConfig.itemPerPage
              //     , indexOfLastItem: iLastItem
              //     , indexOfFirstItem: iLastItem - paginationConfig.itemPerPage
              //     , totalPages: Math.ceil(RoleCollPackage.length)
              // });

               
            } 
            async function onRequestReset(formValues: any) {
             window.location.reload()

               
            } 

    function getFieldProps(formik: FormikProps<any>, field: string) {
      return { ...formik.getFieldProps(field), errorMessage: formik.errors[field] as string };
  }
  
  const initialvalues = {
    Response:''
      };
      
      const headers = [
        { label: "Report Date", key: "ReportDate" },
        { label: "Plant Code", key: "PlantCode" },
        { label: "Project Name", key: "ProjectName" },
        { label: "MIRNO", key: "MIRNO" },
        { label: "RecdDate", key: "RecdDate" },
        { label: "SupplierName", key: "SupplierName" },
        { label: "Invoice/Challan No", key: "InvoiceChallanNo" },
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
      return (
        <Formik initialValues={initialvalues}
      
        onSubmit={(values, helpers) => { }}>{
          formik => (
          <div className='main'>
  {/* className={styles.elementactions} */}
  <div className='element-actions'>
          <span className={ styles.btnnew} style={{background:'#c4291c', borderColor:'border-color'}}><Link to="/"><Icon iconName="AddTo" style={{fontSize:'18px', paddingRight:'7px', paddingTop:'3px',marginRight:'18px'}} /> New Request</Link></span>
          </div>
    <div  className={styles.innertabs}>
  
    <div className='p-3 my-2 bg-white shadow-sm border'>
              <h3 className={styles.headingh1 +' '+ 'elementheading'}>Initiator Dashboard</h3>
                <div className='mt-40'>
                  <div className='row mr--1' style={{display:'flex',flexWrap: 'wrap',marginRight: '15px'}}>
                  
                  { <><div className='col-md-3'>
                        <div className='form-group'>
                          <label className='col-form-label mr-2'>From date</label>
                          <input type='date' id='txtstartdate' className='form-control' {...getFieldProps(formik, 'Fromdate')} />
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='col-form-label mr-2'>End date</label>
                          <input type='date' id='txtenddate' className='form-control' {...getFieldProps(formik, 'Enddate')} />
                        </div>
                      </div>
                    
                        <div className='col-md-2 mt--4'>
                          <PrimaryButton
                            type='submit'
                            style={{ width: '147px' , background:' #c4291c'}}
                            className={styles.btnprimary + ' ' + 'pr1'}
                            text='Search'
                            onClick={async () => {
                              await onRequestInitiate(formik.values);
                            } }
                            value={'Submitted'}
                            iconProps={{ iconName: 'Search' }} />
                        </div>
                        <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='col-form-label mr-2'>Plant Code</label>
                          <select id='ddlPlantCode' className='form-control' {...getFieldProps(formik, 'PlantCodeId')} onChange={async (e) => {
                      // changed3 = e.target.value;

                      formik.setFieldValue('PlantCodeId', e.target.value);
                     await onChangePlantCode(e,formik);
                      //formik.handleChange("PlantCodeId");
                    }}>
                      <option value="">Select</option>
                      {plantMasterCollData !== undefined ? plantMasterCollData.map((Vend) => <option key={Vend.Id} value={Vend.Id}>{Vend.PlantCode}</option>) : ''}

                    </select>                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='form-group' style={{marginTop:'-10px'}}>
                          <label className='col-form-label mr-2'>Reason for <br/> Pending</label>
                          <select id='ddlPending' className='form-control' name='ddlPending'
                      {...getFieldProps(formik, 'PendingReasonId')}onChange={async (e) => {
                        // changed3 = e.target.value;
  
                        formik.setFieldValue('PendingReasonId', e.target.value);
                       await onChangePendingReason(e,formik);
                        //formik.handleChange("PlantCodeId");
                      }}
                     
                      >
                      <option value="">Select</option>
                      {ReasonCollData !== undefined ? ReasonCollData.map((Vend) => <option key={Vend.Id} value={Vend.Id}>{Vend.Reason}</option>) : ''}
                    </select>                        </div>
                      </div>
                    
                        <div className='col-md-3 mt--4'>
                          <PrimaryButton
                            type='submit'
                            style={{background:' #c4291c', width:'120px'}}
                            className={styles.btnprimary + ' ' + 'pr1'}
                            text='Search'
                            onClick={async () => {
                              await onRequestInitiate(formik.values);
                            } }
                            value={'Submitted'}
                            iconProps={{ iconName: 'Search' }} />

                            <PrimaryButton
                            type='submit'
                            style={{  background:' #c4291c' , width:'120px'}}
                            className={styles.btnprimary + ' ' + 'pr1'}
                            text='Reset'
                            onClick={async () => {
                              await onRequestReset(formik.values);
                            } }
                            value={'Submitted'}
                            iconProps={{ iconName: 'Reset' }} />
                        </div>
                        {/* <div className='col-md-1 mt--4'></div> */}
                        </>

                            
                            }
                           
                    <div className='col-md-2' style={{textAlign:'left', fontSize: "13px" , marginTop:'3px'}}>
                  <div className="excel" style={{border: '1px solid #c4291c',padding: "5px",width:'calc(100% - 40px)',backgroundColor:'#c4291c',borderRadius:'3px',height:'35px', textAlign:'center'}}>
                      {paginatedPurchaseRequestsColl != undefined && paginatedPurchaseRequestsColl.length > 0 ?
  
                        <CSVLink data={paginatedPurchaseRequestsColl} headers={headers} filename={'InitiatorLanding.csv'} style={{textDecoration: 'none',color:'white'}}>
                          {/* <span iconProps={{ iconName: 'ExcelLogoInverse' }} text='Export to Excel' ></span> */}
                          {/* <Icon iconName='ExcelDocument'>Export to Excel</Icon> */}
                          <Icon iconName="ExcelDocument"style={{color:'white'}} /> <span className='pl-2'style={{color:'#fff', paddingLeft:'7px'}}>Export to Excel</span>
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
                  
                
                    
                    
                    
                  </div> 
                 <div style={{overflowX: "auto", width :"100%"}}> 
                  <table className={styles.tblrequest + ' ' + styles.tablebordered}>
                                  <thead>
                                    <tr>
                                    <th>Report Date</th>
                                     <th>Plant Code</th>
                                      <th>Project Name</th>
                                    <th>MIR No</th>
                                    <th>Recd Date</th>
                                    <th>Supplier Name </th> 
                                    <th>Invoice/Challan No</th>
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
                                    <th>Edit </th> 
                                    <th>Delete </th> 
                                        {/* <th style={{width:'200px', textAlign:'center'}} >Approve</th> */}
                                        </tr>
                                  </thead>
    
                                  <tbody>


                                  {paginatedPurchaseRequestsColl!=undefined ? paginatedPurchaseRequestsColl.sort((a, b) => b.Id - a.Id).map((purchaseReqObj) =>
                                  <tr>
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

                                     
                                      <td style={{textAlign:'center'}}>
                                      {
                                      
                                    
                                        <Link to={'/EditRequest/' + purchaseReqObj.Id} >
                                        <Icon iconName="PageEdit"  className={styles.icon}  />
    
                                      </Link>
                                    
                                    }
                                    </td>
                                    <td style={{textAlign:'center'}}>
                                      {
                                      
                                    
                                      // <Link to={'/DeleteRequest/' + purchaseReqObj.Id}>
                                      <Icon iconName="Delete" className={styles.icon} onClick={() => handleDelete(purchaseReqObj.Id)} />
                                  // </Link>
                                    
                                    }
                                    </td>
                                      
                                      
                                
                                  </tr>
                                  ):[]}
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