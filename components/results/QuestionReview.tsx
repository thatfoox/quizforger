import MathText from "../MathText";

type McqQuestion = {
  id: number;
  type: "mcq";
  prompt: string;
  choices: string[];
  answer: number;
  points: number;
};

type ShortQuestion = {
  id: number;
  type: "short";
  prompt: string;
  answer: string;
  points: number;
};

type QuestionReviewProps = {
  question: McqQuestion | ShortQuestion;
  submittedAnswer: number | string | undefined;
  index: number;
  manualScore?: number;
  onSetManualScore?: (questionIndex: number, score: number) => void;
};

function normalizeText(text: string) {
  return text.trim().replace(/\s+/g, " ").toLowerCase();
}

export default function QuestionReview({
  question,
  submittedAnswer,
  index,
  manualScore,
  onSetManualScore,
}: QuestionReviewProps) {
  if (question.type === "mcq") {
    const selectedIndex =
      typeof submittedAnswer === "number" ? submittedAnswer : undefined;

    const correctIndex = question.answer;

    const selectedChoice =
      selectedIndex !== undefined
        ? question.choices[selectedIndex]
        : "No answer";

    const correctChoice = question.choices[correctIndex];
    const isCorrect = selectedIndex === correctIndex;

    return (
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <p className="text-sm font-semibold text-slate-500">
            Question {index + 1}
          </p>
          <span className="inline-flex rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-xs font-semibold">
            {question.points} point{question.points === 1 ? "" : "s"}
          </span>
        </div>

        <MathText
          text={question.prompt}
          className="text-lg font-semibold text-slate-900 mb-3"
        />

        <div className="space-y-2 text-sm">
          <div className="text-slate-700">
            <span className="font-semibold">Student answer:</span>{" "}
            <span
              className={
                isCorrect
                  ? "text-emerald-700 font-semibold"
                  : "text-red-700 font-semibold"
              }
            >
              <MathText text={selectedChoice} className="inline" />
            </span>
          </div>

          <div className="text-slate-700">
            <span className="font-semibold">Correct answer:</span>{" "}
            <span className="text-emerald-700 font-semibold">
              <MathText text={correctChoice} className="inline" />
            </span>
          </div>

          <p
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
              isCorrect
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isCorrect
              ? `Auto-graded: ${question.points}/${question.points}`
              : `Auto-graded: 0/${question.points}`}
          </p>
        </div>
      </div>
    );
  }

  const studentText =
    typeof submittedAnswer === "string" ? submittedAnswer : "No answer";

  const correctText = question.answer;

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <p className="text-sm font-semibold text-slate-500">
          Question {index + 1}
        </p>
        <span className="inline-flex rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-xs font-semibold">
          {question.points} point{question.points === 1 ? "" : "s"}
        </span>
      </div>

      <MathText
        text={question.prompt}
        className="text-lg font-semibold text-slate-900 mb-3"
      />

      <div className="space-y-2 text-sm">
        <div className="text-slate-700">
          <span className="font-semibold">Student answer:</span>{" "}
          <span className="text-slate-800 font-medium">
            <MathText text={studentText} className="inline" />
          </span>
        </div>

        <div className="text-slate-700">
          <span className="font-semibold">Expected answer:</span>{" "}
          <span className="text-slate-700">
            <MathText text={correctText} className="inline" />
          </span>
        </div>

        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-4">
          <p className="text-sm font-semibold text-amber-800 mb-3">
            Manual Review
          </p>

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: question.points + 1 }).map((_, score) => (
              <button
                key={score}
                onClick={() => onSetManualScore?.(index, score)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  manualScore === score
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-800 border border-slate-300 hover:bg-slate-100"
                }`}
              >
                {score}/{question.points}
              </button>
            ))}
          </div>

          <p className="text-xs text-amber-800 mt-3">
            Current teacher score:{" "}
            <span className="font-semibold">
              {manualScore ?? 0}/{question.points}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}