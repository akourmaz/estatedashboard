/**
 * Build-time script: parse start-data/thetable.xlsx and generate catalog data.
 * Extracts hyperlinks from cells, not just display text like "Ссылка".
 * Source: thetable.xlsx, sheet "Лист1", columns A–Z.
 * 
 * Usage: node scripts/extract-data.js
 */

const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const EXCEL_PATH = path.resolve(__dirname, "../../start-data/thetable.xlsx");
const OUTPUT_DIR = path.resolve(__dirname, "../src/data/catalog");
const PROPERTIES_OUTPUT_PATH = path.resolve(OUTPUT_DIR, "properties.raw.json");
const METADATA_OUTPUT_PATH = path.resolve(OUTPUT_DIR, "metadata.json");

const NORMALIZATION_RULES = [
  {
    developer: "LISI DEVELOPMENT",
    commissionWithVAT: "6.4%",
  },
  {
    developer: "GRAND MAISON",
    project: "Calligraphy",
    deliveryYear: "2026",
    deliveryQuarter: "2 квартал",
  },
  {
    developer: "GREEN SIDE",
    deliveryYear: "2027",
  },
  {
    developer: "LIKE HOUSE",
    deliveryYear: "Сдан",
  },
  {
    developer: "TEMPO HOLDINHG",
    project: "Queen's Residence",
    deliveryYear: "2027",
  },
  {
    developer: "VR HOLDING",
    project: "Shekvetili Forest Beach",
    deliveryYear: "2028",
  },
];

const PHONE_PATTERN = /\+?\d[\d\s()\-]{7,}\d/g;

function normalizeMatchKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function cleanContactLabel(value) {
  return String(value || "")
    .replace(PHONE_PATTERN, " ")
    .replace(/^[,;:\-\s]+|[,;:\-\s]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePhone(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function applyPropertyOverrides(property) {
  const developerKey = normalizeMatchKey(property.developer);
  const projectKey = normalizeMatchKey(property.project);

  for (const rule of NORMALIZATION_RULES) {
    const developerMatches = developerKey === normalizeMatchKey(rule.developer);
    const projectMatches = !rule.project || projectKey === normalizeMatchKey(rule.project);

    if (!developerMatches || !projectMatches) {
      continue;
    }

    if (rule.commissionWithVAT) {
      property.commissionWithVAT = rule.commissionWithVAT;
    }

    if (rule.deliveryYear) {
      property.deliveryYear = rule.deliveryYear;
    }

    if (rule.deliveryQuarter) {
      property.deliveryQuarter = rule.deliveryQuarter;
    }
  }
}

function parseContacts(value) {
  if (!value) {
    return [];
  }

  const segments = String(value)
    .split(/[\r\n,]+/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  const contacts = [];
  let pendingLabel = "";
  let lastLabel = "";

  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    const nextSegment = segments[index + 1];
    const nextHasPhone = nextSegment ? PHONE_PATTERN.test(nextSegment) : false;
    PHONE_PATTERN.lastIndex = 0;

    const phoneMatches = segment.match(PHONE_PATTERN);

    if (phoneMatches && phoneMatches.length > 0) {
      const phone = normalizePhone(phoneMatches[0]);
      const label = cleanContactLabel(segment) || pendingLabel || lastLabel;

      contacts.push({
        label: label || undefined,
        phone,
      });

      if (label) {
        lastLabel = label;
      }

      pendingLabel = "";
      continue;
    }

    const labelChunk = cleanContactLabel(segment);
    if (!labelChunk) {
      continue;
    }

    if (contacts.length === 0) {
      pendingLabel = pendingLabel ? `${pendingLabel}, ${labelChunk}` : labelChunk;
      continue;
    }

    const lastContact = contacts[contacts.length - 1];
    if (!lastContact.label || nextHasPhone) {
      lastContact.label = lastContact.label
        ? `${lastContact.label}, ${labelChunk}`
        : labelChunk;
      lastLabel = lastContact.label;
      continue;
    }

    pendingLabel = pendingLabel ? `${pendingLabel}, ${labelChunk}` : labelChunk;
  }

  return contacts.filter((contact) => contact.phone);
}

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

  let sheetName = "Лист1";
  if (!workbook.SheetNames.includes(sheetName)) {
    sheetName = workbook.SheetNames[0];
  }

  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error("Sheet not found");
  }

  // Get the range of the sheet
  const range = XLSX.utils.decode_range(sheet["!ref"]);
  // Only process columns A(0) through Z(25); AA–AJ excluded
  const maxCol = Math.min(range.e.c, 25);
  console.log(`Sheet range: rows ${range.s.r}-${range.e.r}, cols ${range.s.c}-${maxCol} (AA-AJ excluded)`);

  // Log all hyperlinks found in the sheet
  let hyperlinkCount = 0;
  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= maxCol; c++) {
      const addr = XLSX.utils.encode_cell({ c, r });
      const cell = sheet[addr];
      if (cell && cell.l && cell.l.Target) {
        hyperlinkCount++;
      }
    }
  }
  console.log(`Found ${hyperlinkCount} hyperlinks in cells`);

  // thetable.xlsx: Row 0 = banner, Row 1 = column headers, data starts at row 2
  const dataStartRow = 2;
  const properties = [];

  for (let r = dataStartRow; r <= range.e.r; r++) {
    const developer = getCellValue(sheet, 0, r);  // A — Застройщик
    const project = getCellValue(sheet, 1, r);     // B — Объект

    // Skip empty rows
    if (!developer && !project) continue;

    const idx = r - dataStartRow;

    const property = {
      id: generatePropertyId(developer || "unknown", project || "unknown", idx),
      developer: developer,
      project: project,

      // Secondary-main text fields
      paymentTerms: getCellValue(sheet, 2, r),                       // C — ПВ и рассрочка
      commissionTerms: getCellValue(sheet, 3, r) || undefined,       // D — Выплата комиссии агентам

      // Links group (hyperlink extraction)
      links: {
        website: getLinkOrText(sheet, 4, r) || undefined,            // E — Официальный сайт
        whatsapp: getLinkOrText(sheet, 5, r) || undefined,           // F — WhatsApp
        googleDisk: getLinkOrText(sheet, 6, r) || undefined,         // G — Google Disk
        map: getLinkOrText(sheet, 7, r) || undefined,                // H — Карта
        priceList: getLinkOrText(sheet, 8, r) || undefined,          // I — Ссылка на прайс
      },

      // Primary fields
      finishing: getCellValue(sheet, 9, r),                          // J — Отделка
      propertyType: getCellValue(sheet, 10, r),                      // K — Тип

      // Secondary-main
      area: getCellValue(sheet, 11, r) || undefined,                 // L — Площадь
      deliveryQuarter: getCellValue(sheet, 12, r) || undefined,      // M — Месяц/квартал сдачи

      // Primary
      deliveryYear: getCellValue(sheet, 13, r),                      // N — Год сдачи
      renovationPrice: getCellValue(sheet, 14, r) || undefined,      // O — Ремонт

      // Secondary-main
      renovationCommission: getCellValue(sheet, 15, r) || undefined, // P — Как платят комиссию за ремонт

      // Secondary-extra
      guaranteedYield: getCellValue(sheet, 16, r) || undefined,      // Q — Гарантированная доходность

      // Primary
      location: getCellValue(sheet, 17, r),                          // R — Локация
      minPricePerSqm: getCellValue(sheet, 18, r) || undefined,      // S — Мин. цена квадрата

      // Secondary-main
      floors: getCellValue(sheet, 19, r) || undefined,               // T — Этажность
      mortgage: getCellValue(sheet, 20, r) || undefined,             // U — Ипотека

      // Secondary-extra
      trainingLink: getLinkOrText(sheet, 21, r) || undefined,        // V — Обучение по объекту
      comments: getCellValue(sheet, 22, r) || undefined,             // W — Комментарии и пожелания
      primaryContact: getCellValue(sheet, 23, r) || undefined,       // X — Основной контакт

      // Commissions
      commissionNet: getCellValue(sheet, 24, r),                     // Y — Комиссия агента чистыми
      commissionWithVAT: getCellValue(sheet, 25, r),                 // Z — Комиссия агента (с НДС)
    };

    applyPropertyOverrides(property);

    const contacts = parseContacts(property.primaryContact);
    if (contacts.length > 0) {
      property.contacts = contacts;
    }

    // Clean up undefined link fields
    Object.keys(property.links).forEach(key => {
      if (property.links[key] === undefined) delete property.links[key];
    });
    if (property.commissionTerms === undefined) delete property.commissionTerms;
    if (property.area === undefined) delete property.area;
    if (property.deliveryQuarter === undefined) delete property.deliveryQuarter;
    if (property.renovationPrice === undefined) delete property.renovationPrice;
    if (property.renovationCommission === undefined) delete property.renovationCommission;
    if (property.guaranteedYield === undefined) delete property.guaranteedYield;
    if (property.minPricePerSqm === undefined) delete property.minPricePerSqm;
    if (property.floors === undefined) delete property.floors;
    if (property.mortgage === undefined) delete property.mortgage;
    if (property.trainingLink === undefined) delete property.trainingLink;
    if (property.comments === undefined) delete property.comments;
    if (property.primaryContact === undefined) delete property.primaryContact;
    if (property.contacts === undefined) delete property.contacts;

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

  const metadata = {
    sourceFile: path.basename(EXCEL_PATH),
    sheetName,
    rowCount: properties.length,
    generatedAt: new Date().toISOString(),
  };

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  fs.writeFileSync(
    PROPERTIES_OUTPUT_PATH,
    JSON.stringify(properties, null, 2),
    "utf-8"
  );
  fs.writeFileSync(
    METADATA_OUTPUT_PATH,
    JSON.stringify(metadata, null, 2),
    "utf-8"
  );

  console.log(`\nWritten properties to: ${PROPERTIES_OUTPUT_PATH}`);
  console.log(`Written metadata to: ${METADATA_OUTPUT_PATH}`);
}

main();
