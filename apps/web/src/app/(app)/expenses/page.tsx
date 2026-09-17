import Link from "next/link";
import { requireBusiness } from "@/lib/business";
import { DeleteButton } from "./delete-button";

const cedis = (n: number) => "GH₵" + Number(n).toLocaleString();

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

export default async function ExpensesPage() {
  const { supabase, business } = await requireBusiness();

  const { data: expenses } = await supabase
    .from("expenses")
    .select("id, title, category, amount, spent_on, note")
    .eq("business_id", business.id)
    .order("spent_on", { ascending: false })
    .order("created_at", { ascending: false });

  const rows = expenses ?? [];
  const totalSpent = rows.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-medium text-slate-500">Expenses</div>
          <h1 className="text-3xl font-bold text-slate-900">Track business costs</h1>
        </div>
        <Link
          href="/expenses/new"
          className="inline-flex w-fit items-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-teal-800"
        >
          + Add Expense
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm text-slate-500">Total spent</div>
        <div className="mt-1 text-3xl font-bold text-slate-900">{cedis(totalSpent)}</div>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-slate-500">
          No expenses yet. Click Add Expense to record your first one.
        </p>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">Title</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">Category</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">Amount</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rows.map((expense) => (
                  <tr key={expense.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">{expense.title}</td>
                    <td className="px-4 py-3 text-slate-600">{expense.category}</td>
                    <td className="px-4 py-3 text-slate-900">{cedis(expense.amount)}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(expense.spent_on)}</td>
                    <td className="px-4 py-3 text-right">
                      <DeleteButton id={expense.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
