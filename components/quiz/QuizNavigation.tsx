type QuizNavigationProps = {
  current: number;
  total: number;
  submitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
};

export default function QuizNavigation({
  current,
  total,
  submitting,
  onPrevious,
  onNext,
  onFinish,
}: QuizNavigationProps) {
  const isLastQuestion = current === total - 1;

  return (
    <div className="flex justify-between mt-8">
      <button
        onClick={onPrevious}
        className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition disabled:opacity-50"
        disabled={current === 0 || submitting}
      >
        Previous
      </button>

      {isLastQuestion ? (
        <button
          onClick={onFinish}
          disabled={submitting}
          className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Finish"}
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={submitting}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
        >
          Next
        </button>
      )}
    </div>
  );
}