type ResultsSummaryProps = {
  count: number;
};

export default function ResultsSummary({ count }: ResultsSummaryProps) {
  return (
    <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-slate-700 text-sm">
      Showing <span className="font-semibold">{count}</span> filtered submission
      {count === 1 ? "" : "s"}.
    </div>
  );
}