import MathText from "../MathText";
import type { QuizQuestion } from "../../lib/quiz-data";

type QuestionCardProps = {
  question: QuizQuestion;
  currentAnswer: number | string | undefined;
  onChooseMcqAnswer: (index: number) => void;
  onChangeShortAnswer: (value: string) => void;
};

export default function QuestionCard({
  question,
  currentAnswer,
  onChooseMcqAnswer,
  onChangeShortAnswer,
}: QuestionCardProps) {
  return (
    <>
      <MathText
        text={question.prompt}
        className="text-2xl font-semibold text-slate-900 mb-6 leading-relaxed"
      />

      {question.type === "mcq" ? (
        <div className="space-y-3">
          {question.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => onChooseMcqAnswer(i)}
              className={`w-full text-left border rounded-2xl px-4 py-4 transition duration-200 transform ${
                currentAnswer === i
                  ? "bg-slate-900 text-white scale-[1.02] shadow-md border-slate-900"
                  : "bg-white text-slate-900 hover:bg-slate-100 hover:scale-[1.01] hover:shadow-md hover:border-slate-400"
              }`}
            >
              <MathText text={choice} className="font-medium" />
            </button>
          ))}
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={typeof currentAnswer === "string" ? currentAnswer : ""}
            onChange={(e) => onChangeShortAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full rounded-2xl border border-slate-300 px-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <p className="text-sm text-slate-500 mt-3">
            Capital letters and extra spaces will not matter.
          </p>
        </div>
      )}
    </>
  );
}