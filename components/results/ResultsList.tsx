import SubmissionCard from "./SubmissionCard";
import { defaultQuiz } from "../../lib/quiz-data";
import type { Quiz } from "../../lib/quiz-data";

type Submission = {
  id: string;
  first_name: string;
  last_name: string;
  class_name: string | null;
  quiz_id: string | null;
  score: number;
  auto_score?: number | null;
  final_score?: number | null;
  total: number;
  answers: (number | string)[];
  submitted_at: string;
  quiz_snapshot: Quiz | null;
  manual_scores?: Record<string, number> | null;
  review_status?: string | null;
};

type ResultsListProps = {
  submissions: Submission[];
  openIds: string[];
  deletingSubmissionId: string | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSetManualScore: (submissionId: string, questionIndex: number, score: number) => void;
};

export default function ResultsList({
  submissions,
  openIds,
  deletingSubmissionId,
  onToggle,
  onDelete,
  onSetManualScore,
}: ResultsListProps) {
  return (
    <div className="mt-8 space-y-4">
      {submissions.map((submission) => (
        <div key={submission.id}>
          <div className="mb-2 px-1 text-sm text-slate-600">
            <span className="font-semibold">Class:</span>{" "}
            {submission.class_name || "-"}
          </div>

          <SubmissionCard
            submission={submission}
            quiz={submission.quiz_snapshot || defaultQuiz}
            isOpen={openIds.includes(submission.id)}
            onToggle={() => onToggle(submission.id)}
            onDelete={() => onDelete(submission.id)}
            isDeleting={deletingSubmissionId === submission.id}
            onSetManualScore={onSetManualScore}
          />
        </div>
      ))}
    </div>
  );
}