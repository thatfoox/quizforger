type ResultsToolbarProps = {
  loading: boolean;
  deleting: boolean;
  hasSubmissions: boolean;
  onDownloadPDF: () => void;
  onDownloadCSV: () => void;
  onDeleteAll: () => void;
};

export default function ResultsToolbar({
  loading,
  deleting,
  hasSubmissions,
  onDownloadPDF,
  onDownloadCSV,
  onDeleteAll,
}: ResultsToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Quiz Results</h1>
        <p className="text-slate-600 mt-2">
          Student submissions with expandable answers.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onDownloadPDF}
          disabled={loading || !hasSubmissions}
          className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Download PDF
        </button>

        <button
          onClick={onDownloadCSV}
          disabled={loading || !hasSubmissions}
          className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Download CSV
        </button>

        <button
          onClick={onDeleteAll}
          disabled={deleting || loading || !hasSubmissions}
          className="px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? "Deleting..." : "Delete All Results"}
        </button>
      </div>
    </div>
  );
}