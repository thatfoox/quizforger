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
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
      <div className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed break-words">
        <MathText text={question.prompt} />
      </div>

      {question.type === "mcq" ? (
        <div className="mt-5 space-y-3">
          {question.choices.map((choice, index) => {
            const selected = currentAnswer === index;

            return (
              <button
                key={index}
                type="button"
                onClick={() => onChooseMcqAnswer(index)}
                className={`w-full text-left rounded-2xl border p-4 transition ${
                  selected
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                      selected
                        ? "border-blue-500 bg-blue-500"
                        : "border-slate-300"
                    }`}
                  >
                    {selected ? (
                      <div className="w-full h-full flex items-center justify-center text-white text-[10px]">
                        ●
                      </div>
                    ) : null}
                  </div>

                  <div className="text-sm sm:text-base text-slate-800 break-words">
                    <MathText text={choice} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-5">
          <textarea
            value={typeof currentAnswer === "string" ? currentAnswer : ""}
            onChange={(e) => onChangeShortAnswer(e.target.value)}
            rows={5}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none text-sm sm:text-base"
            placeholder="Type your answer here..."
          />
        </div>
      )}
    </div>
  );
}