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
  const isLast = current === total - 1;
  const isFirst = current === 0;

  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-between">
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirst || submitting}
        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 transition disabled:opacity-50"
      >
        Previous
      </button>

      {isLast ? (
        <button
          type="button"
          onClick={onFinish}
          disabled={submitting}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Quiz"}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={submitting}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition disabled:opacity-50"
        >
          Next
        </button>
      )}
    </div>
  );
}