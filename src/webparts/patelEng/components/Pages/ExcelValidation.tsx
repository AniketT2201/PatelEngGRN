import * as React from "react";
import { useHistory } from "react-router-dom";
import * as XLSX from "xlsx";

import PendingGRNRequestsOps from '../../service/BAL/SPCRUD/GRNPending'
import PlantCodeRequestsOps from '../../service/BAL/SPCRUD/PlantCodeMaster';
import { IPendingGRN } from '../../service/INTERFACE/IPendingGRN';
import { IPatelEngProps } from "../IPatelEngProps";
import USESPCRUD, { ISPCRUD } from '../../service/BAL/SPCRUD/spcrud';
import { ISPCRUDOPS } from '../../service/DAL/spcrudops';
import './ExcelValidation.scss';
import ReasonRequestsOps from "../../service/BAL/SPCRUD/ReasonMaster";
import { formatCellValue, parseExcelDate } from "../../service/Utils/Helper";

export const GRNExcelUploadForm = (props: IPatelEngProps) => {
  const history = useHistory();
  const [spCrud, setSPCRUD] = React.useState<ISPCRUDOPS>();
  let spCrudObj: ISPCRUD;


  // ---------- Master Data ----------
  const [plantCodes, setPlantCodes] = React.useState<any[]>([]);
  const [reasons, setReasons] = React.useState<any[]>([]);
  const [users, setUsers] = React.useState<any[]>([]); // People picker users
  const [mastersLoaded, setMastersLoaded] = React.useState(false);

  // ---------- File + UI ----------
  const [file, setFile] = React.useState<File | null>(null);
  const [validRows, setValidRows] = React.useState<any[]>([]);
  const [invalidRows, setInvalidRows] = React.useState<any[]>([]);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [uploadedCount, setUploadedCount] = React.useState(0);

  // ---------- Load Master Data ----------
  React.useEffect(() => {
    (async () => {
      try {
        spCrudObj = await USESPCRUD();
        setSPCRUD(spCrudObj);

        const [plants, reason,  allUsers] = await Promise.all([
          PlantCodeRequestsOps().getPlantCodeData(props),
          ReasonRequestsOps().getReasonMasterDataAll(props),
          PendingGRNRequestsOps().getPendingGRNRequestsData("", {column: "Id"}, props) 
        ]);
        setPlantCodes(plants || []);
        setReasons(reason || []);
        setUsers(allUsers || []);
        setMastersLoaded(true);
        console.log("IDRR master data loaded");
      } catch (err) {
        console.error("Error loading master data", err);
        setMastersLoaded(false);
      }
    })();
  }, []);

  // ---------- Normalize Excel Headers ----------
  const normalizeRow = (rawRow: any) => {
    const mapKey = (k: string) =>
      k?.toString().trim().toLowerCase().replace(/[\s_./()=-]/g, "") ?? "";

    const normalized: any = {};

    const lookup: Record<string, string> = {
      reportdate: "ReportDate",
      projectname: "ProjectName",
      mirno: "MIRNO",
      recddate: "RecdDate",
      suppliername: "SupplierName",
      approverlevel: "ApproverLevel",
      invoicedate: "InvoiceDate",
      description: "Description",
      pono: "PONo",
      invoicevalueincludingtax: "InvoiceValueIncludingTax",
      invoicechallanno: "InvoiceChallanNo",
      manualmirdone: "ManualMIRdone",
      detailedreason: "DetailedReason",
      nosofpendingdays: "Nosofpendingdays",
      location: "Location",
      remarks: "Remarks",

      plantcode: "PlantCode",
      reasonforpending: "ReasonforPending",

      nameactiontobetakenby: "NameActiontobetakenby",
      //lastmodifiedby: "LastModifiedBy"
    };

    Object.keys(rawRow).forEach(k => {
      const mapped = lookup[mapKey(k)] ?? k;
      normalized[mapped] = rawRow[k];
    });

    return normalized;
  };


  // ---------- File Input ----------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  // ---------- Read Excel ----------
  const readExcel = () => {
    if (!file) return alert("Please select an Excel file");
    if (!mastersLoaded) return alert("Master data still loading — wait a moment.");

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let data = e.target?.result;
        const workbook = data instanceof ArrayBuffer
          ? XLSX.read(new Uint8Array(data), { type: "array" })
          : XLSX.read(data as string, { type: "binary" });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawRows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        if (!rawRows.length) return alert("Excel sheet is empty or headers mismatch");

        const rows = rawRows.map(r => normalizeRow(r));
        validateExcel(rows);
      } catch (err) {
        console.error("Excel Parse Error:", err);
        alert("Failed to parse Excel. See console for details.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // ---------- Validation ----------
  const validateExcel = (rows: any[]) => {
    const valid: any[] = [];
    const invalid: any[] = [];
    const errorList: string[] = [];

    const isDateField = (f: string) => f.toLowerCase().includes("date");
    const isNumericField = (f: string) => {
      const x = f.toLowerCase();
      return x.includes("no") || x.includes("value");
    };
    const isValidDate = (v: any) => !isNaN(new Date(v).getTime());

    rows.forEach((row, index) => {
      const rowNo = index + 1;
      const rowErrors: string[] = [];

      Object.keys(row).forEach(field => {
        const value = row[field];

        // ---------- Required ----------
        if (value === null || value === undefined || value === "") {
          rowErrors.push(`Row ${rowNo}: ${field} is required`);
          return;
        }

        // ---------- Date validation ----------
        if (isDateField(field)) {
          const parsed = parseExcelDate(value);
          if (!parsed) {
            rowErrors.push(
              `Row ${rowNo}: ${field} must be a valid date (dd/mm/yyyy)`
            );
          } else {
            // normalize date for later save (optional but recommended)
            row[field] = parsed.toISOString();
          }
          return;
        }

        // ---------- Numeric validation ----------
        if (isNumericField(field) && isNaN(Number(value))) {
          rowErrors.push(`Row ${rowNo}: ${field} must be numeric`);
          return;
        }
      });

      // ---------- Plant Code lookup ----------
      if (row.PlantCode) {
        if (isNaN(Number(row.PlantCode))) {
          rowErrors.push(`Row ${rowNo}: PlantCode must be numeric`);
        } else {
          const plant = plantCodes.find(
            p =>
              p.PlantCode?.toString().trim().toLowerCase() ===
              row.PlantCode?.toString().trim().toLowerCase()
          );
          if (!plant) {
            rowErrors.push(`Row ${rowNo}: PlantCode "${row.PlantCode}" not found`);
          }
        }
      }

      // ---------- Reason for Pending lookup ----------
      if (row.ReasonforPending) {
        const reason = reasons.find(
          r =>
            r.Reason?.trim().toLowerCase() ===
            row.ReasonforPending?.toString().trim().toLowerCase()
        );
        if (!reason) {
          rowErrors.push(
            `Row ${rowNo}: ReasonforPending "${row.ReasonforPending}" not found`
          );
        }
      }

      // -------- NameActiontobetakenby (People Picker) --------
      if (row.NameActiontobetakenby) {
        const person = users.find(
          u =>
            u.NameActiontobetakenby?.trim().toLowerCase() ===
            row.NameActiontobetakenby?.toString().trim().toLowerCase()
        );

        if (!person) {
          rowErrors.push(
            `Row ${rowNo}: NameActiontobetakenby "${row.NameActiontobetakenby}" not found`
          );
        }
      }

      // -------- Last Modified By (Editor) --------
      // if (row.LastModifiedBy) {
      //   const editor = users.find(
      //     u =>
      //       u.Editor?.trim().toLowerCase() ===
      //       row.LastModifiedBy?.toString().trim().toLowerCase()
      //   );

      //   if (!editor) {
      //     rowErrors.push(
      //       `Row ${rowNo}: LastModifiedBy "${row.LastModifiedBy}" not found`
      //     );
      //   }
      // }


      // ---------- Final classification ----------
      if (rowErrors.length) {
        invalid.push({ rowNo, row, errors: rowErrors });
        errorList.push(...rowErrors);
      } else {
        valid.push(row);
      }
    });

    setValidRows(valid);
    setInvalidRows(invalid);
    setErrors(errorList);

    alert(
      invalid.length
        ? `Validation completed with ${invalid.length} invalid rows.`
        : `Validation success — ${valid.length} rows valid.`
    );
  };



  // ---------- Download Template ----------
  const GetFileDownloadLink = () => {
    const fileUrl = "https://patelengineering365.sharepoint.com/sites/GRN/Shared%20Documents/GRNTemplate.xlsx";
    const link = document.createElement("a");
    link.href = fileUrl;
    link.target = "_blank";
    link.download = "ActionMasterTemplate.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ---------- Render ----------
  return (
    <div style={{width: "100%", height: "100%", display: "flex"}}>
      <div className="excel-wrapper">
        <h2>GRN Excel Import</h2>
        <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
        <button onClick={readExcel} disabled={!file || !mastersLoaded || uploading}>Read Excel</button>
        <button onClick={GetFileDownloadLink}>Download Template</button>
        {/* <button onClick={submitValidRows} disabled={uploading || validRows.length === 0}>
          {uploading ? `Uploading ${uploadedCount}/${validRows.length}` : "Upload Valid Rows"}
        </button> */}
        <div style={{ color: mastersLoaded ? "green" : "red" }}>
          {mastersLoaded ? "Masters Loaded" : "Loading masters..."}
        </div>
        {errors.length > 0 && (
          <div className="error-box">
            <strong>Validation Errors:</strong>
            {errors.slice(0, 100).map((e,i) => <div key={i}>{e}</div>)}
            {errors.length > 100 && <div>...and {errors.length-100} more</div>}
          </div>
        )}
        {validRows.length > 0 && (
          <div className="excel-table-wrapper">
            <h4>Valid Rows Preview</h4>
            <table>
              <thead>
                <tr>{Object.keys(validRows[0]).map((col,i)=><th key={i}>{col}</th>)}</tr>
              </thead>
              <tbody>
                {validRows.map((row, i) => (
                  <tr key={i}>
                    {Object.keys(validRows[0]).map((col, j) => (
                      <td key={j}>
                        {formatCellValue(col, row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className='d-flex btnall'>
          <button type="button" onClick={() => history.push('/initiatorLanding')} style={{ width: '12%' }}>Exit</button>
        </div>
      </div>
    </div>
  );
};
