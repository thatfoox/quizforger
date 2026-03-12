import QuestionReview from "./QuestionReview";
import type { Quiz } from "../../lib/quiz-data";

type Submission = {
  id: string;
  first_name: string;
  last_name: string;
  class_name?: string | null;
  score: number;
  auto_score?: number | null;
  final_score?: number | null;
  review_status?: string | null;
  total: number;
  answers: (number | string)[];
  submitted_at: string;
  manual_scores?: Record<string, number> | null;
};

type SubmissionCardProps = {
  submission: Submission;
  quiz: Quiz;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
  onSetManualScore: (submissionId: string, questionIndex: number, score: number) => void;
};

export default function SubmissionCard({
  submission,
  quiz,
  isOpen,
  onToggle,
  onDelete,
  isDeleting = false,
  onSetManualScore,
}: SubmissionCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {submission.first_name} {submission.last_name}
          </h2>
          <p className="text-slate-600 mt-1">
            Submitted: {new Date(submission.submitted_at).toLocaleString()}
          </p>
          {submission.class_name ? (
            <p className="text-slate-500 mt-1 text-sm">
              Class: {submission.class_name}
            </p>
          ) : null}

          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            <span className="inline-flex rounded-full bg-white border border-slate-300 px-3 py-1 text-slate-700 font-medium">
              Auto: {submission.auto_score ?? submission.score ?? 0}
            </span>
            <span className="inline-flex rounded-full bg-white border border-slate-300 px-3 py-1 text-slate-700 font-medium">
              Final: {submission.final_score ?? submission.score ?? 0} / {submission.total}
            </span>
            <span
              className={`inline-flex rounded-full px-3 py-1 font-medium ${
                submission.review_status === "reviewed"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {submission.review_status === "reviewed"
                ? "Reviewed"
                : "Under Review"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-semibold">
            Final Score: {submission.final_score ?? submission.score ?? 0} / {submission.total}
          </span>

          <button
            onClick={onToggle}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium hover:bg-slate-100 transition"
          >
            <span
              className={`inline-block transition-transform duration-300 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            >
              ▼
            </span>
            {isOpen ? "Hide Answers" : "Show Answers"}
          </button>

          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "🗑 Delete"}
          </button>
        </div>
      </div>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 mt-6"
            : "grid-rows-[0fr] opacity-0 mt-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-4">
            {quiz.questions.map((question, index) => (
              <QuestionReview
                key={question.id}
                question={question}
                submittedAnswer={submission.answers?.[index]}
                index={index}
                manualScore={
                  submission.manual_scores?.[String(index)] ?? 0
                }
                onSetManualScore={(questionIndex, score) =>
                  onSetManualScore(submission.id, questionIndex, score)
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}