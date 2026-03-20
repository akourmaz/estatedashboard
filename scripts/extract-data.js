/**
 * Build-time script: Parse start-data/table.xlsx and generate static JSON data.
 * Extracts hyperlinks from cells (not just display text "Ссылка").
 * 
 * Usage: node scripts/extract-data.js
 */

const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const EXCEL_PATH = path.resolve(__dirname, "../../start-data/table.xlsx");
const OUTPUT_PATH = path.resolve(__dirname, "../src/data/properties.json");

function generatePropertyId(developer, project, index) {
  const raw = `${developer}-${project}-${index}`;
  return crypto.createHash("md5").update(raw).digest("hex").slice(0, 8);
}

function getCellValue(sheet, col, row) {
  const addr = XLSX.utils.encode_cell({ c: col, r: row });
  const cell = sheet[addr];
  if (!cell) return "";
  // Get formatted/display text
  const val = cell.w !== undefined ? cell.w : (cell.v !== undefined ? String(cell.v) : "");
  return val.trim();
}

function getCellHyperlink(sheet, col, row) {
  const addr = XLSX.utils.encode_cell({ c: col, r: row });
  const cell = sheet[addr];
  if (!cell) return undefined;
  // Check for hyperlink
  if (cell.l && cell.l.Target) {
    return cell.l.Target;
  }
  // Also check sheet-level hyperlinks
  if (sheet["!hyperlinks"]) {
    const hl = sheet["!hyperlinks"].find(h => h.ref === addr);
    if (hl && hl.Target) return hl.Target;
  }
  // If the cell value itself looks like a URL, use it directly
  const val = cell.v !== undefined ? String(cell.v) : "";
  if (val.startsWith("http://") || val.startsWith("https://")) {
    return val.trim();
  }
  return undefined;
}

function getLinkOrText(sheet, col, row) {
  const hyperlink = getCellHyperlink(sheet, col, row);
  if (hyperlink) return hyperlink;
  const text = getCellValue(sheet, col, row);
  // If text is a URL, return it
  if (text.startsWith("http://") || text.startsWith("https://")) {
    return text;
  }
  // If text is "Ссылка", "Ccылка", "Cсылка" etc., it's a placeholder with no real link extracted
  if (/^[CСс]сылка$/i.test(text) || /^Ссылка$/i.test(text)) {
    return undefined; // placeholder without actual hyperlink
  }
  // If it's some other text (like "Яндекс", "Гугл" etc), it might be a map reference
  if (text && text !== "-" && text !== "") {
    // For map column, construct Yandex/Google maps search
    return undefined;
  }
  return undefined;
}

function main() {
  console.log("Reading Excel file:", EXCEL_PATH);
  
  const workbook = XLSX.read(fs.readFileSync(EXCEL_PATH), { 
    type: "buffer",
    cellStyles: true,
    cellFormula: false,
  });

  let sheetName = "РУС";
  if (!workbook.SheetNames.includes(sheetName)) {
    sheetName = workbook.SheetNames[0];
  }

  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error("Sheet not found");
  }

  // Get the range of the sheet
  const range = XLSX.utils.decode_range(sheet["!ref"]);
  console.log(`Sheet range: rows ${range.s.r}-${range.e.r}, cols ${range.s.c}-${range.e.c}`);

  // Log all hyperlinks found in the sheet
  let hyperlinkCount = 0;
  const hyperlinksMap = {};
  
  // Check individual cells for hyperlinks
  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = XLSX.utils.encode_cell({ c, r });
      const cell = sheet[addr];
      if (cell && cell.l && cell.l.Target) {
        hyperlinksMap[addr] = cell.l.Target;
        hyperlinkCount++;
      }
    }
  }
  console.log(`Found ${hyperlinkCount} hyperlinks in cells`);

  // Data starts at row 3 (0-indexed), i.e. row 4 in Excel (1-indexed)
  // Rows 0-2 are headers
  const dataStartRow = 3;
  const properties = [];

  for (let r = dataStartRow; r <= range.e.r; r++) {
    const developer = getCellValue(sheet, 0, r); // A
    const project = getCellValue(sheet, 1, r);    // B

    // Skip empty rows
    if (!developer && !project) continue;

    const idx = r - dataStartRow;

    const property = {
      id: generatePropertyId(developer || "unknown", project || "unknown", idx),
      developer: developer,
      project: project,
      paymentTerms: getCellValue(sheet, 2, r),       // C
      commissionTerms: getCellValue(sheet, 3, r),     // D
      links: {
        website: getLinkOrText(sheet, 4, r) || undefined,      // E - Сайт
        whatsapp: getLinkOrText(sheet, 5, r) || undefined,     // F - WhatsApp
        googleDisk: getLinkOrText(sheet, 6, r) || undefined,   // G - Google Disk
        map: getLinkOrText(sheet, 7, r) || undefined,          // H - Карта
        priceList: getLinkOrText(sheet, 8, r) || undefined,    // I - Прайс-лист
      },
      finishing: getCellValue(sheet, 9, r),           // J
      propertyType: getCellValue(sheet, 10, r),       // K
      area: getCellValue(sheet, 11, r),               // L
      deliveryQuarter: getCellValue(sheet, 12, r),    // M
      deliveryYear: getCellValue(sheet, 13, r),       // N
      renovationPrice: getCellValue(sheet, 14, r) || undefined,    // O
      renovationCommission: getCellValue(sheet, 15, r) || undefined, // P
      guaranteedYield: getCellValue(sheet, 16, r) || undefined,    // Q
      location: getCellValue(sheet, 17, r),           // R
      minPricePerSqm: getCellValue(sheet, 18, r),     // S
      floors: getCellValue(sheet, 19, r),             // T
      mortgage: getCellValue(sheet, 20, r),           // U
      trainingLink: getLinkOrText(sheet, 21, r) || undefined,      // V - Обучение
      comments: getCellValue(sheet, 22, r) || undefined,           // W
      primaryContact: getCellValue(sheet, 23, r),     // X
      commissionNet: getCellValue(sheet, 24, r),      // Y
      commissionWithVAT: getCellValue(sheet, 25, r),  // Z
    };

    // Clean up undefined fields
    Object.keys(property.links).forEach(key => {
      if (property.links[key] === undefined) delete property.links[key];
    });
    if (property.renovationPrice === undefined) delete property.renovationPrice;
    if (property.renovationCommission === undefined) delete property.renovationCommission;
    if (property.guaranteedYield === undefined) delete property.guaranteedYield;
    if (property.trainingLink === undefined) delete property.trainingLink;
    if (property.comments === undefined) delete property.comments;

    properties.push(property);
  }

  console.log(`Parsed ${properties.length} properties`);

  // Log sample to verify
  if (properties.length > 0) {
    const sample = properties[0];
    console.log("\nSample property:");
    console.log(`  Developer: ${sample.developer}`);
    console.log(`  Project: ${sample.project}`);
    console.log(`  Links:`, JSON.stringify(sample.links, null, 2));
  }

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write JSON
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(properties, null, 2), "utf-8");
  console.log(`\nWritten to: ${OUTPUT_PATH}`);
}

main();
