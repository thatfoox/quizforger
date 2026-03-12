type ResultsEmptyStateProps = {
  loading: boolean;
  error: string;
  hasResults: boolean;
};

export default function ResultsEmptyState({
  loading,
  error,
  hasResults,
}: ResultsEmptyStateProps) {
  if (loading) {
    return (
      <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-6 text-slate-600">
        Loading results...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-700">
        Could not load results: {error}
      </div>
    );
  }

  if (!hasResults) {
    return (
      <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-6 text-slate-600">
        No submissions found for the current filters.
      </div>
    );
  }

  return null;
}