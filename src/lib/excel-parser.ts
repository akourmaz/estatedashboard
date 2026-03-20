import * as XLSX from "xlsx";
import { Property } from "./types";
import { generatePropertyId } from "./utils";

/**
 * Parse an Excel file (.xlsx) and return an array of Property objects.
 * Reads the "РУС" sheet, skips header rows 1-3, maps columns A-Z by position.
 */
export function parseExcelFile(buffer: ArrayBuffer): Property[] {
  const workbook = XLSX.read(buffer, { type: "array" });

  // Try to find the "РУС" sheet, fallback to first sheet
  let sheetName = "РУС";
  if (!workbook.SheetNames.includes(sheetName)) {
    sheetName = workbook.SheetNames[0];
  }

  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error("В файле не найден лист с данными");
  }

  // Convert sheet to array of arrays (raw data)
  const rawData: (string | number | undefined)[][] = XLSX.utils.sheet_to_json(
    sheet,
    {
      header: 1,
      defval: "",
      raw: false,
    }
  );

  if (rawData.length <= 3) {
    throw new Error("В таблице не найдены данные об объектах");
  }

  // Skip first 3 rows (headers)
  const dataRows = rawData.slice(3);

  const properties: Property[] = [];

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    if (!row || row.length === 0) continue;

    const getString = (colIndex: number): string => {
      const val = row[colIndex];
      if (val === undefined || val === null) return "";
      return String(val).trim();
    };

    const developer = getString(0);
    const project = getString(1);

    // Skip rows without developer AND project (empty rows)
    if (!developer && !project) continue;

    const property: Property = {
      id: generatePropertyId(developer || "unknown", project || "unknown", i),
      developer,
      project,
      paymentTerms: getString(2),
      commissionTerms: getString(3),
      links: {
        website: getString(4) || undefined,
        whatsapp: getString(5) || undefined,
        googleDisk: getString(6) || undefined,
        map: getString(7) || undefined,
        priceList: getString(8) || undefined,
      },
      finishing: getString(9),
      propertyType: getString(10),
      area: getString(11),
      deliveryQuarter: getString(12),
      deliveryYear: getString(13),
      renovationPrice: getString(14) || undefined,
      renovationCommission: getString(15) || undefined,
      guaranteedYield: getString(16) || undefined,
      location: getString(17),
      minPricePerSqm: getString(18),
      floors: getString(19),
      mortgage: getString(20),
      trainingLink: getString(21) || undefined,
      comments: getString(22) || undefined,
      primaryContact: getString(23),
      commissionNet: getString(24),
      commissionWithVAT: getString(25),
    };

    properties.push(property);
  }

  if (properties.length === 0) {
    throw new Error("В таблице не найдены данные об объектах");
  }

  return properties;
}

/**
 * Validate that the file is an Excel file.
 */
export function isExcelFile(file: File): boolean {
  const validTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];
  const validExtensions = [".xlsx", ".xls"];

  const hasValidType = validTypes.includes(file.type);
  const hasValidExtension = validExtensions.some((ext) =>
    file.name.toLowerCase().endsWith(ext)
  );

  return hasValidType || hasValidExtension;
}
