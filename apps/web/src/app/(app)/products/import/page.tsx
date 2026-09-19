"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Download, Upload, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cedis } from "../product-shared";
import {
  downloadImportTemplate,
  ImportFileError,
  parseImportFile,
  type ImportRow,
} from "../product-import-shared";

type Stage = "upload" | "preview" | "done";

export default function ImportProductsPage() {
  const router = useRouter();
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const [stage, setStage] = useState<Stage>("upload");
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importedCount, setImportedCount] = useState(0);

  const validRows = rows.filter((r) => r.errors.length === 0);
  const invalidRows = rows.filter((r) => r.errors.length > 0);

  async function ensureBusinessId() {
    if (businessId) return businessId;
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      router.push("/login");
      return null;
    }
    const { data: businesses } = await supabase
      .from("businesses")
      .select("id")
      .order("created_at", { ascending: true })
      .limit(1);
    const business = businesses?.[0];
    if (!business) {
      router.push("/onboarding");
      return null;
    }
    setBusinessId(business.id);
    return business.id;
  }

  async function handleFile(file: File) {
    setFileError(null);
    setParsing(true);
    try {
      await ensureBusinessId();
      const parsed = await parseImportFile(file);
      setRows(parsed);
      setStage("preview");
    } catch (err) {
      setFileError(err instanceof ImportFileError ? err.message : "Couldn't process that file.");
    } finally {
      setParsing(false);
    }
  }

  async function handleImport() {
    setImporting(true);
    setImportError(null);

    const id = await ensureBusinessId();
    if (!id) {
      setImporting(false);
      return;
    }

    const payload = validRows.map((r) => ({
      business_id: id,
      name: r.name,
      selling_price: r.selling_price,
      cost_price: r.cost_price,
      stock_quantity: r.stock_quantity,
      category: r.category,
      sku: r.sku,
      low_stock_threshold: r.low_stock_threshold,
    }));

    const { error } = await supabase.from("products").insert(payload);

    setImporting(false);
    if (error) {
      setImportError(error.message);
      return;
    }
    setImportedCount(payload.length);
    setStage("done");
  }

  function reset() {
    setStage("upload");
    setRows([]);
    setFileError(null);
    setImportError(null);
    setImportedCount(0);
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-5">
        <div className="text-sm font-medium text-slate-500">Products</div>
        <h1 className="text-2xl font-bold text-slate-900">Import products</h1>
        <p className="mt-1 text-sm text-slate-500">
          Upload a CSV or Excel file to add many products at once.
        </p>
      </div>

      {stage === "upload" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <button
            type="button"
            onClick={downloadImportTemplate}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            <Download className="h-4 w-4" />
            Download template
          </button>
          <p className="mt-1 text-xs text-slate-400">
            Columns: name (required), selling_price, cost_price, stock_quantity, category, sku,
            low_stock_threshold.
          </p>

          <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <Upload className="mx-auto h-8 w-8 text-slate-400" />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={parsing}
              className="mt-3 inline-flex items-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
            >
              {parsing ? "Reading file..." : "Choose file"}
            </button>
            <p className="mt-2 text-xs text-slate-400">CSV or XLSX, up to 5MB, 500 rows max.</p>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file) handleFile(file);
              }}
            />
          </div>

          {fileError && <p className="mt-3 text-sm text-red-600">{fileError}</p>}

          <div className="mt-6">
            <Link href="/products" className="text-sm font-medium text-slate-500 hover:text-slate-700">
              Cancel
            </Link>
          </div>
        </div>
      )}

      {stage === "preview" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-700">
            <span className="text-emerald-700">{validRows.length} valid rows</span>
            {" · "}
            <span className={invalidRows.length ? "text-red-600" : "text-slate-500"}>
              {invalidRows.length} rows with errors
            </span>
          </p>

          <div className="mt-4 max-h-[28rem] overflow-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2">Row</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Selling price</th>
                  <th className="px-3 py-2">Cost price</th>
                  <th className="px-3 py-2">Stock</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">SKU</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => (
                  <tr key={row.rowNumber} className={row.errors.length ? "bg-red-50/50" : undefined}>
                    <td className="px-3 py-2 text-slate-400">{row.rowNumber}</td>
                    <td className="px-3 py-2 text-slate-900">{row.name || "—"}</td>
                    <td className="px-3 py-2 text-slate-700">{cedis(row.selling_price)}</td>
                    <td className="px-3 py-2 text-slate-700">{cedis(row.cost_price)}</td>
                    <td className="px-3 py-2 text-slate-700">{row.stock_quantity}</td>
                    <td className="px-3 py-2 text-slate-700">{row.category ?? "—"}</td>
                    <td className="px-3 py-2 text-slate-700">{row.sku ?? "—"}</td>
                    <td className="px-3 py-2">
                      {row.errors.length === 0 ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Valid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600" title={row.errors.join(", ")}>
                          <XCircle className="h-3.5 w-3.5" /> {row.errors.join(", ")}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {importError && <p className="mt-3 text-sm text-red-600">Import failed: {importError}</p>}

          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button
              onClick={reset}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Choose a different file
            </button>
            <button
              onClick={handleImport}
              disabled={importing || validRows.length === 0}
              className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
            >
              {importing ? "Importing..." : `Import ${validRows.length} valid rows`}
            </button>
          </div>
        </div>
      )}

      {stage === "done" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
            <p className="text-lg font-semibold">Imported {importedCount} products</p>
          </div>
          {invalidRows.length > 0 && (
            <p className="mt-2 text-sm text-slate-500">
              Skipped {invalidRows.length} row{invalidRows.length === 1 ? "" : "s"} with errors:{" "}
              {invalidRows.map((r) => `row ${r.rowNumber} (${r.errors.join(", ")})`).join("; ")}
            </p>
          )}
          <div className="mt-6 flex gap-3">
            <button
              onClick={reset}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Import another file
            </button>
            <button
              onClick={() => router.push("/products")}
              className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Back to products
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
