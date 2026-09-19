import Papa from "papaparse";
import * as XLSX from "xlsx";
import { DEFAULT_LOW_STOCK_THRESHOLD } from "./product-shared";

export const MAX_IMPORT_FILE_BYTES = 5 * 1024 * 1024;
export const MAX_IMPORT_ROWS = 500;

export const IMPORT_TEMPLATE_HEADERS = [
  "name",
  "selling_price",
  "cost_price",
  "stock_quantity",
  "category",
  "sku",
  "low_stock_threshold",
] as const;

export const IMPORT_TEMPLATE_CSV =
  IMPORT_TEMPLATE_HEADERS.join(",") + "\nBlack Dress,150,90,20,Fashion,BD-001,5\n";

type CanonicalField = (typeof IMPORT_TEMPLATE_HEADERS)[number];

export type ImportRow = {
  rowNumber: number;
  name: string;
  selling_price: number;
  cost_price: number;
  stock_quantity: number;
  category: string | null;
  sku: string | null;
  low_stock_threshold: number;
  errors: string[];
};

function normalizeHeader(header: string) {
  return header.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

const CANONICAL_BY_NORMALIZED: Record<string, CanonicalField> = Object.fromEntries(
  IMPORT_TEMPLATE_HEADERS.map((field) => [normalizeHeader(field), field])
) as Record<string, CanonicalField>;

// Accepts raw cell values from either CSV (strings) or Excel (strings, numbers,
// or booleans depending on cell formatting) and cleans out currency/formatting noise.
function cleanNumber(raw: unknown): { value: number | null; error: string | null } {
  if (raw === null || raw === undefined) return { value: null, error: null };

  if (typeof raw === "number") {
    if (!Number.isFinite(raw)) return { value: null, error: "not a number" };
    if (raw < 0) return { value: null, error: "negative number" };
    return { value: raw, error: null };
  }

  const trimmed = String(raw).trim();
  if (!trimmed) return { value: null, error: null };

  // Strip currency symbols/codes and thousands separators (e.g. "GH₵1,200.00" -> "1200.00").
  const cleaned = trimmed.replace(/[^0-9.\-]/g, "");
  if (!cleaned) return { value: null, error: "not a number" };

  const parsed = Number(cleaned);
  if (Number.isNaN(parsed)) return { value: null, error: "not a number" };
  if (parsed < 0) return { value: null, error: "negative number" };
  return { value: parsed, error: null };
}

function cleanText(raw: unknown): string | null {
  if (raw === null || raw === undefined) return null;
  const trimmed = String(raw).trim();
  return trimmed || null;
}

async function readCsv(file: File): Promise<Record<string, unknown>[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, unknown>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (err: Error) => reject(err),
    });
  });
}

async function readExcel(file: File): Promise<Record<string, unknown>[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) return [];
  const sheet = workbook.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
}

export class ImportFileError extends Error {}

export async function parseImportFile(file: File): Promise<ImportRow[]> {
  const isCsv = file.name.toLowerCase().endsWith(".csv");
  const isExcel = file.name.toLowerCase().endsWith(".xlsx");
  if (!isCsv && !isExcel) {
    throw new ImportFileError("Please upload a .csv or .xlsx file.");
  }
  if (file.size > MAX_IMPORT_FILE_BYTES) {
    throw new ImportFileError("File is too large — please keep it under 5MB.");
  }

  let rawRows: Record<string, unknown>[];
  try {
    rawRows = isCsv ? await readCsv(file) : await readExcel(file);
  } catch {
    throw new ImportFileError("Couldn't read that file. Make sure it's a valid CSV or Excel file.");
  }

  if (rawRows.length === 0) {
    throw new ImportFileError("No data rows found in the file.");
  }
  if (rawRows.length > MAX_IMPORT_ROWS) {
    throw new ImportFileError(
      `This file has ${rawRows.length} rows, which is over the ${MAX_IMPORT_ROWS}-row limit. Please split it into smaller files.`
    );
  }

  const rawHeaders = Object.keys(rawRows[0]);
  const headerToField = new Map<string, CanonicalField>();
  for (const rawHeader of rawHeaders) {
    const field = CANONICAL_BY_NORMALIZED[normalizeHeader(rawHeader)];
    if (field && !headerToField.has(rawHeader)) headerToField.set(rawHeader, field);
  }

  const mappedFields = new Set(headerToField.values());
  if (!mappedFields.has("name")) {
    throw new ImportFileError(
      "Couldn't find a \"name\" column in the file. Check it against the template."
    );
  }

  return rawRows.map((raw, index) => {
    const byField = new Map<CanonicalField, unknown>();
    for (const [rawHeader, field] of headerToField) {
      byField.set(field, raw[rawHeader]);
    }

    const errors: string[] = [];

    const name = cleanText(byField.get("name")) ?? "";
    if (!name) errors.push("missing name");

    const sellingPrice = cleanNumber(byField.get("selling_price"));
    if (sellingPrice.error) errors.push(`selling_price: ${sellingPrice.error}`);

    const costPrice = cleanNumber(byField.get("cost_price"));
    if (costPrice.error) errors.push(`cost_price: ${costPrice.error}`);

    const stockQuantity = cleanNumber(byField.get("stock_quantity"));
    if (stockQuantity.error) errors.push(`stock_quantity: ${stockQuantity.error}`);

    const lowStockThreshold = cleanNumber(byField.get("low_stock_threshold"));
    if (lowStockThreshold.error) errors.push(`low_stock_threshold: ${lowStockThreshold.error}`);

    return {
      rowNumber: index + 2, // +1 for header row, +1 for 1-based numbering
      name,
      selling_price: sellingPrice.value ?? 0,
      cost_price: costPrice.value ?? 0,
      stock_quantity: Math.round(stockQuantity.value ?? 0),
      category: cleanText(byField.get("category")),
      sku: cleanText(byField.get("sku")),
      low_stock_threshold: Math.round(lowStockThreshold.value ?? DEFAULT_LOW_STOCK_THRESHOLD),
      errors,
    };
  });
}

export function downloadImportTemplate() {
  const blob = new Blob([IMPORT_TEMPLATE_CSV], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "product-import-template.csv";
  link.click();
  URL.revokeObjectURL(url);
}
