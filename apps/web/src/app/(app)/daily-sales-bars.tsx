import type { DailySalesBucket } from "@/lib/analytics";

const cedis = (n: number) => "GH₵" + Math.round(n).toLocaleString();

export function DailySalesBars({ data }: { data: DailySalesBucket[] }) {
  const max = Math.max(...data.map((d) => d.total), 0);

  if (max === 0) {
    return (
      <p className="text-sm text-slate-500">
        No sales recorded in the last {data.length} days yet.
      </p>
    );
  }

  return (
    <div className="space-y-2.5">
      {data.map((day) => (
        <div key={day.date} className="flex items-center gap-3">
          <span className="w-14 shrink-0 text-xs text-slate-500">{day.label}</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${(day.total / max) * 100}%` }}
            />
          </div>
          <span className="w-20 shrink-0 text-right text-xs font-semibold text-slate-700">
            {cedis(day.total)}
          </span>
        </div>
      ))}
    </div>
  );
}
