import MathText from "../MathText";
import type { Quiz } from "../../lib/quiz-data";

type QuizPreviewPanelProps = {
  quizDraft: Quiz;
};

export default function QuizPreviewPanel({
  quizDraft,
}: QuizPreviewPanelProps) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8">
      <h2 className="text-3xl font-bold text-slate-900">Live Preview</h2>
      <p className="text-slate-600 mt-2">
        This is how the quiz looks right now.
      </p>

      <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-5">
        <p className="text-sm text-slate-500">Quiz title</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">
          {quizDraft.title || "Untitled Quiz"}
        </h3>
        <p className="text-slate-600 mt-2">
          {quizDraft.questions.length} question
          {quizDraft.questions.length === 1 ? "" : "s"}
        </p>

        <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-white border border-slate-200 px-4 py-3 text-slate-700">
            <span className="font-semibold">Time limit:</span>{" "}
            {quizDraft.timeLimitMinutes ? `${quizDraft.timeLimitMinutes} min` : "No timer"}
          </div>

          <div className="rounded-xl bg-white border border-slate-200 px-4 py-3 text-slate-700">
            <span className="font-semibold">Randomize questions:</span>{" "}
            {quizDraft.randomizeQuestions ? "Yes" : "No"}
          </div>

          <div className="rounded-xl bg-white border border-slate-200 px-4 py-3 text-slate-700">
            <span className="font-semibold">Randomize choices:</span>{" "}
            {quizDraft.randomizeChoices ? "Yes" : "No"}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {quizDraft.questions.map((question, index) => (
          <div
            key={question.id}
            className="rounded-2xl bg-slate-50 border border-slate-200 p-5"
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-sm font-semibold text-slate-500">
                Question {index + 1}
              </p>

              <span className="inline-flex rounded-full bg-slate-900 text-white px-3 py-1 text-xs font-semibold">
                {question.type === "mcq" ? "MCQ" : "Free Response"}
              </span>
            </div>

            <MathText
              text={question.prompt || "No prompt yet"}
              className="text-lg font-semibold text-slate-900 mb-4"
            />

            {question.type === "mcq" ? (
              <div className="space-y-2">
                {question.choices.map((choice, choiceIndex) => (
                  <div
                    key={choiceIndex}
                    className={`rounded-xl border px-4 py-3 ${
                      question.answer === choiceIndex
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                        : "bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    <div className="font-medium">
                      <MathText
                        text={`${choiceIndex + 1}. ${choice || "(empty choice)"}`}
                      />
                    </div>
                    {question.answer === choiceIndex && (
                      <span className="ml-2 text-sm font-semibold">
                        ✓ Correct
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700">
                <span className="font-semibold">Accepted answer:</span>{" "}
                <MathText
                  text={question.answer || "(empty answer)"}
                  className="inline"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <p className="text-sm font-semibold text-slate-700 mb-2">
          Quiz JSON Preview
        </p>
        <pre className="rounded-2xl bg-slate-900 text-slate-100 p-4 text-xs overflow-x-auto">
          {JSON.stringify(quizDraft, null, 2)}
        </pre>
      </div>
    </div>
  );
}