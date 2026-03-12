type ImportPanelProps = {
  importCode: string;
  importError: string;
  onChangeImportCode: (value: string) => void;
  onImportFromCode: () => void;
  onLoadSample: () => void;
};

export default function ImportPanel({
  importCode,
  importError,
  onChangeImportCode,
  onImportFromCode,
  onLoadSample,
}: ImportPanelProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Import from LaTeX-style code
      </label>

      <textarea
        value={importCode}
        onChange={(e) => onChangeImportCode(e.target.value)}
        className="w-full min-h-[220px] rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
      />

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={onImportFromCode}
          className="px-5 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition"
        >
          Import from Code
        </button>

        <button
          onClick={onLoadSample}
          className="px-5 py-3 rounded-xl bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 transition"
        >
          Load Sample
        </button>
      </div>

      {importError && (
        <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-700">
          <span className="font-semibold">Import error:</span> {importError}
        </div>
      )}
    </div>
  );
}