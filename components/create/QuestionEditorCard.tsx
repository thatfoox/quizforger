import MathText from "../MathText";
import type { QuizQuestion } from "../../lib/quiz-data";

type QuestionEditorCardProps = {
  question: QuizQuestion;
  index: number;
  onDelete: (id: number) => void;
  onUpdatePrompt: (id: number, value: string) => void;
  onUpdatePoints: (id: number, value: number) => void;
  onUpdateMcqChoice: (
    questionId: number,
    choiceIndex: number,
    value: string
  ) => void;
  onUpdateMcqAnswer: (questionId: number, answerIndex: number) => void;
  onUpdateShortAnswer: (questionId: number, value: string) => void;
};

export default function QuestionEditorCard({
  question,
  index,
  onDelete,
  onUpdatePrompt,
  onUpdatePoints,
  onUpdateMcqChoice,
  onUpdateMcqAnswer,
  onUpdateShortAnswer,
}: QuestionEditorCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex rounded-full bg-slate-900 text-white px-3 py-1 text-xs font-semibold">
            Question {index + 1}
          </span>

          <span className="inline-flex rounded-full bg-white border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700">
            {question.type === "mcq" ? "MCQ" : "Free Response"}
          </span>
        </div>

        <button
          onClick={() => onDelete(question.id)}
          className="px-3 py-2 rounded-xl bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition"
        >
          Delete
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-4">
        <div className="md:col-span-3">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Prompt
          </label>
          <textarea
            value={question.prompt}
            onChange={(e) => onUpdatePrompt(question.id, e.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="Type the question here..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Points
          </label>
          <input
            type="number"
            min="1"
            value={question.points}
            onChange={(e) =>
              onUpdatePoints(
                question.id,
                Math.max(1, Number(e.target.value) || 1)
              )
            }
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="mt-3 rounded-xl bg-white border border-slate-200 px-4 py-3 text-slate-700">
          <MathText text={question.prompt || "(empty prompt)"} />
        </div>
      </div>

      {question.type === "mcq" ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-700">Choices</p>

          {question.choices.map((choice, choiceIndex) => (
            <div key={choiceIndex} className="space-y-2">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name={`correct-${question.id}`}
                  checked={question.answer === choiceIndex}
                  onChange={() => onUpdateMcqAnswer(question.id, choiceIndex)}
                  className="w-4 h-4"
                />

                <input
                  type="text"
                  value={choice}
                  onChange={(e) =>
                    onUpdateMcqChoice(question.id, choiceIndex, e.target.value)
                  }
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder={`Choice ${choiceIndex + 1}`}
                />
              </div>

              <div className="ml-7 rounded-xl bg-white border border-slate-200 px-4 py-3 text-slate-700">
                <MathText text={choice || "(empty choice)"} />
              </div>
            </div>
          ))}

          <p className="text-sm text-slate-500">
            Select the radio button for the correct answer.
          </p>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Expected answer
          </label>
          <input
            type="text"
            value={question.answer}
            onChange={(e) => onUpdateShortAnswer(question.id, e.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="Type the expected answer..."
          />
          <div className="mt-3 rounded-xl bg-white border border-slate-200 px-4 py-3 text-slate-700">
            <MathText text={question.answer || "(empty answer)"} />
          </div>
          <p className="text-sm text-slate-500 mt-2">
            This will be shown to the teacher during manual review.
          </p>
        </div>
      )}
    </div>
  );
}