const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const EXCEL_PATH = path.resolve(__dirname, "../../start-data/thetable.xlsx");
const OUTPUT_DIR = path.resolve(__dirname, "../../start-data/raw-thetable");
const OUTPUT_PATH = path.resolve(OUTPUT_DIR, "thetable.raw.json");

function getCellDisplayValue(cell) {
  if (!cell) return null;
  if (cell.w !== undefined) return cell.w;
  if (cell.v !== undefined) return cell.v;
  return null;
}

function getCellRawValue(cell) {
  if (!cell || cell.v === undefined) return null;
  return cell.v;
}

function getCellHyperlink(cell) {
  if (!cell || !cell.l || !cell.l.Target) return undefined;
  return cell.l.Target;
}

function getCellFormula(cell) {
  if (!cell || !cell.f) return undefined;
  return cell.f;
}

function getColumns(sheet, range, headerRowIndex) {
  const columns = [];

  for (let columnIndex = range.s.c; columnIndex <= range.e.c; columnIndex += 1) {
    const address = XLSX.utils.encode_cell({ c: columnIndex, r: headerRowIndex });
    const cell = sheet[address];

    columns.push({
      index: columnIndex,
      letter: XLSX.utils.encode_col(columnIndex),
      header: getCellDisplayValue(cell),
      headerRaw: getCellRawValue(cell),
    });
  }

  return columns;
}

function getRows(sheet, range, columns) {
  const rows = [];

  for (let rowIndex = range.s.r; rowIndex <= range.e.r; rowIndex += 1) {
    const cells = columns.map((column) => {
      const address = XLSX.utils.encode_cell({ c: column.index, r: rowIndex });
      const cell = sheet[address];
      const cellData = {
        address,
        columnIndex: column.index,
        columnLetter: column.letter,
        header: column.header,
        value: getCellDisplayValue(cell),
        rawValue: getCellRawValue(cell),
      };

      const hyperlink = getCellHyperlink(cell);
      if (hyperlink !== undefined) {
        cellData.hyperlink = hyperlink;
      }

      const formula = getCellFormula(cell);
      if (formula !== undefined) {
        cellData.formula = formula;
      }

      return cellData;
    });

    rows.push({
      rowIndex,
      rowNumber: rowIndex + 1,
      cells,
    });
  }

  return rows;
}

function main() {
  const workbook = XLSX.read(fs.readFileSync(EXCEL_PATH), {
    type: "buffer",
    cellFormula: true,
    cellStyles: true,
  });

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  if (!sheet || !sheet["!ref"]) {
    throw new Error("Unable to read thetable.xlsx worksheet range.");
  }

  const range = XLSX.utils.decode_range(sheet["!ref"]);
  const headerRowIndex = 1;
  const dataStartRowIndex = 2;
  const columns = getColumns(sheet, range, headerRowIndex);
  const rows = getRows(sheet, range, columns);
  const hyperlinkCount = rows.reduce((count, row) => {
    return count + row.cells.filter((cell) => cell.hyperlink !== undefined).length;
  }, 0);

  const payload = {
    sourceFile: path.basename(EXCEL_PATH),
    exportedAt: new Date().toISOString(),
    workbook: {
      sheetNames: workbook.SheetNames,
      activeSheetName: sheetName,
    },
    sheet: {
      name: sheetName,
      range: sheet["!ref"],
      totalRows: range.e.r - range.s.r + 1,
      totalColumns: range.e.c - range.s.c + 1,
      headerRowIndex,
      headerRowNumber: headerRowIndex + 1,
      dataStartRowIndex,
      dataStartRowNumber: dataStartRowIndex + 1,
      hyperlinkCount,
    },
    columns,
    rows,
  };

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(payload, null, 2), "utf-8");

  console.log(`Exported ${rows.length} worksheet rows to ${OUTPUT_PATH}`);
}

main();