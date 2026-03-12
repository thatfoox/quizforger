type EditorToolbarProps = {
  saving: boolean;
  onUseThisQuiz: () => void;
  onCopyQuizJson: () => void;
  onSaveQuizToLibrary: () => void;
  onAddMcqQuestion: () => void;
  onAddShortQuestion: () => void;
};

export default function EditorToolbar({
  saving,
  onUseThisQuiz,
  onCopyQuizJson,
  onSaveQuizToLibrary,
  onAddMcqQuestion,
  onAddShortQuestion,
}: EditorToolbarProps) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Quiz Builder</h1>
          <p className="text-slate-600 mt-2">
            Import from code or build manually.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onUseThisQuiz}
            className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Use This Quiz
          </button>

          <button
            onClick={onSaveQuizToLibrary}
            disabled={saving}
            className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Quiz to Library"}
          </button>

          <button
            onClick={onCopyQuizJson}
            className="px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
          >
            Copy Quiz JSON
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={onAddMcqQuestion}
          className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Add MCQ
        </button>

        <button
          onClick={onAddShortQuestion}
          className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
        >
          Add Free Response
        </button>
      </div>
    </>
  );
}