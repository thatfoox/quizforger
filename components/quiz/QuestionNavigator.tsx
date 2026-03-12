type QuestionNavigatorProps = {
  total: number;
  current: number;
  answers: (number | string)[];
  onJumpToQuestion: (index: number) => void;
};

export default function QuestionNavigator({
  total,
  current,
  answers,
  onJumpToQuestion,
}: QuestionNavigatorProps) {
  function isAnswered(index: number) {
    const answer = answers[index];

    if (typeof answer === "number") return true;
    if (typeof answer === "string") return answer.trim().length > 0;

    return false;
  }

  return (
    <div className="mb-8">
      <p className="text-sm font-semibold text-slate-700 mb-3">
        Question Navigator
      </p>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: total }).map((_, index) => {
          const active = index === current;
          const answered = isAnswered(index);

          let classes =
            "w-10 h-10 rounded-xl text-sm font-semibold transition border ";

          if (active) {
            classes += "bg-slate-900 text-white border-slate-900";
          } else if (answered) {
            classes += "bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200";
          } else {
            classes += "bg-white text-slate-700 border-slate-300 hover:bg-slate-100";
          }

          return (
            <button
              key={index}
              onClick={() => onJumpToQuestion(index)}
              className={classes}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
        <span>
          <span className="inline-block w-3 h-3 rounded bg-slate-900 mr-2 align-middle" />
          Current
        </span>
        <span>
          <span className="inline-block w-3 h-3 rounded bg-emerald-200 mr-2 align-middle" />
          Answered
        </span>
        <span>
          <span className="inline-block w-3 h-3 rounded bg-white border border-slate-300 mr-2 align-middle" />
          Not answered
        </span>
      </div>
    </div>
  );
}