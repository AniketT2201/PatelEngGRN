
// For parsing Excel date formats (serial numbers or dd/mm/yyyy strings) to JS Date mm/dd/yyyy
export const parseExcelDate = (value: any): Date | null => {
    if (!value) return null;

    // Case 1: Already a Date object (Excel sometimes does this)
    if (value instanceof Date) {
      return value;
    }

    // Case 2: Excel serial number
    if (typeof value === "number") {
      // Excel date starts from 1899-12-30
      return new Date(Math.round((value - 25569) * 86400 * 1000));
    }

    // Case 3: String dd/mm/yyyy
    if (typeof value === "string") {
      const parts = value.split("/");
      if (parts.length === 3) {
        const day = Number(parts[0]);
        const month = Number(parts[1]);
        const year = Number(parts[2]);

        if (!day || !month || !year) return null;

        return new Date(year, month - 1, day); // JS-safe
      }
    }
    return null;
  };

// Format cell value for display based on column type for date formats
export const formatCellValue = (col: string, value: any) => {
  if (value === null || value === undefined) return "";

  // ---------- Date columns ----------
  if (col.toLowerCase().includes("date")) {
    const d = new Date(value);
    return isNaN(d.getTime())
      ? value
      : d.toLocaleDateString("en-GB"); // dd/MM/yyyy
  }

  // ---------- Other ----------
  return value.toString();
};