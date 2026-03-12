"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { getCurrentTeacher } from "../../lib/teacher-auth";
import { defaultQuiz } from "../../lib/quiz-data";
import type { Quiz } from "../../lib/quiz-data";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import TeacherGuard from "../../components/auth/TeacherGuard";
import ResultsToolbar from "../../components/results/ResultsToolbar";
import ResultsFilters from "../../components/results/ResultsFilters";
import ResultsSummary from "../../components/results/ResultsSummary";
import ResultsEmptyState from "../../components/results/ResultsEmptyState";
import ResultsList from "../../components/results/ResultsList";

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

type QuizOption = {
  id: string;
  title: string;
};

export default function ResultsPage() {
  const router = useRouter();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [quizOptions, setQuizOptions] = useState<QuizOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [deletingSubmissionId, setDeletingSubmissionId] = useState<
    string | null
  >(null);

  const [selectedQuizId, setSelectedQuizId] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");

  useEffect(() => {
    loadResults();
    loadQuizOptions();
  }, []);

  async function loadResults() {
    setLoading(true);

    const teacher = await getCurrentTeacher();

    if (!teacher) {
      setError("You must sign in as a teacher.");
      setSubmissions([]);
      setLoading(false);
      return;
    }

    const { data: ownedQuizzes, error: quizError } = await supabase
      .from("quizzes")
      .select("id")
      .eq("owner_id", teacher.id);

    if (quizError) {
      setError(quizError.message);
      setSubmissions([]);
      setLoading(false);
      return;
    }

    const ownedQuizIds = (ownedQuizzes || []).map((q) => q.id);

    if (ownedQuizIds.length === 0) {
      setSubmissions([]);
      setError("");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("submissions")
      .select(
        "id, first_name, last_name, class_name, quiz_id, score, auto_score, final_score, total, answers, submitted_at, quiz_snapshot, manual_scores, review_status"
      )
      .in("quiz_id", ownedQuizIds)
      .order("submitted_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setSubmissions((data || []) as Submission[]);
      setError("");
    }

    setLoading(false);
  }

  async function loadQuizOptions() {
    const teacher = await getCurrentTeacher();

    if (!teacher) return;

    const { data, error } = await supabase
      .from("quizzes")
      .select("id, title")
      .eq("owner_id", teacher.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setQuizOptions((data || []) as QuizOption[]);
    }
  }

  function toggleOpen(id: string) {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  async function deleteAllResults() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all currently filtered quiz submissions?"
    );

    if (!confirmed) return;

    setDeleting(true);

    const idsToDelete = filteredSubmissions.map((submission) => submission.id);

    if (idsToDelete.length === 0) {
      setDeleting(false);
      return;
    }

    const { error } = await supabase
      .from("submissions")
      .delete()
      .in("id", idsToDelete);

    if (error) {
      alert(`Could not delete results: ${error.message}`);
      setDeleting(false);
      return;
    }

    setOpenIds([]);
    await loadResults();
    setDeleting(false);
  }

  async function deleteSingleSubmission(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this submission?"
    );

    if (!confirmed) return;

    setDeletingSubmissionId(id);

    const { error } = await supabase
      .from("submissions")
      .delete()
      .eq("id", id);

    if (error) {
      alert(`Could not delete submission: ${error.message}`);
      setDeletingSubmissionId(null);
      return;
    }

    setOpenIds((prev) => prev.filter((item) => item !== id));
    await loadResults();
    setDeletingSubmissionId(null);
  }

  async function setManualScore(
    submissionId: string,
    questionIndex: number,
    scoreForQuestion: number
  ) {
    const submission = submissions.find((s) => s.id === submissionId);
    if (!submission) return;

    const quiz = submission.quiz_snapshot || defaultQuiz;
    const updatedManualScores = {
      ...(submission.manual_scores || {}),
      [String(questionIndex)]: scoreForQuestion,
    };

    const frqIndexes = quiz.questions
      .map((q, i) => (q.type === "short" ? i : -1))
      .filter((i) => i !== -1);

    const manualTotal = frqIndexes.reduce(
      (sum, index) => sum + (updatedManualScores[String(index)] ?? 0),
      0
    );

    const autoScore = submission.auto_score ?? submission.score ?? 0;
    const finalScore = autoScore + manualTotal;

    const allReviewed = frqIndexes.every(
      (index) => updatedManualScores[String(index)] !== undefined
    );

    const reviewStatus = allReviewed ? "reviewed" : "pending";

    const { error } = await supabase
      .from("submissions")
      .update({
        manual_scores: updatedManualScores,
        final_score: finalScore,
        score: finalScore,
        review_status: reviewStatus,
      })
      .eq("id", submissionId);

    if (error) {
      alert(`Could not update FRQ review: ${error.message}`);
      return;
    }

    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === submissionId
          ? {
              ...item,
              manual_scores: updatedManualScores,
              final_score: finalScore,
              score: finalScore,
              review_status: reviewStatus,
            }
          : item
      )
    );
  }

  const classOptions = useMemo(() => {
    const classes = Array.from(
      new Set(
        submissions
          .map((submission) => submission.class_name?.trim())
          .filter((value): value is string => Boolean(value))
      )
    ).sort((a, b) => a.localeCompare(b));

    return classes;
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((submission) => {
      const matchesQuiz =
        selectedQuizId === "all" || submission.quiz_id === selectedQuizId;

      const matchesClass =
        selectedClass === "all" || submission.class_name === selectedClass;

      return matchesQuiz && matchesClass;
    });
  }, [submissions, selectedQuizId, selectedClass]);

  function downloadCSV() {
    if (filteredSubmissions.length === 0) return;

    const headers = [
      "First Name",
      "Second Name",
      "Class",
      "Quiz ID",
      "Auto Score",
      "Final Score",
      "Review Status",
      "Total",
      "Submitted At",
    ];

    const rows = filteredSubmissions.map((submission) => [
      submission.first_name,
      submission.last_name,
      submission.class_name || "",
      submission.quiz_id || "",
      submission.auto_score ?? 0,
      submission.final_score ?? submission.score ?? 0,
      submission.review_status || "pending",
      submission.total,
      new Date(submission.submitted_at).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "quiz-results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function downloadPDF() {
    if (filteredSubmissions.length === 0) return;

    const doc = new jsPDF();

    const averageScore =
      filteredSubmissions.length > 0
        ? (
            filteredSubmissions.reduce(
              (sum, s) => sum + (s.final_score ?? s.score ?? 0),
              0
            ) / filteredSubmissions.length
          ).toFixed(2)
        : "0";

    const selectedQuizTitle =
      selectedQuizId === "all"
        ? "All Quizzes"
        : quizOptions.find((quiz) => quiz.id === selectedQuizId)?.title ||
          "Selected Quiz";

    doc.setFontSize(20);
    doc.text("Quiz Results", 14, 18);

    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Quiz Filter: ${selectedQuizTitle}`, 14, 34);
    doc.text(
      `Class Filter: ${
        selectedClass === "all" ? "All Classes" : selectedClass
      }`,
      14,
      40
    );
    doc.text(`Total Submissions: ${filteredSubmissions.length}`, 14, 46);
    doc.text(`Average Final Score: ${averageScore}`, 14, 52);

    const tableRows = filteredSubmissions.map((submission) => [
      submission.first_name,
      submission.last_name,
      submission.class_name || "-",
      `${submission.auto_score ?? 0}`,
      `${submission.final_score ?? submission.score ?? 0} / ${submission.total}`,
      submission.review_status || "pending",
      new Date(submission.submitted_at).toLocaleString(),
    ]);

    autoTable(doc, {
      startY: 60,
      head: [
        [
          "First Name",
          "Second Name",
          "Class",
          "Auto",
          "Final Score",
          "Status",
          "Submitted At",
        ],
      ],
      body: tableRows,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [15, 23, 42],
      },
    });

    doc.save("quiz-results.pdf");
  }

  const hasFilteredResults = filteredSubmissions.length > 0;

  return (
    <TeacherGuard>
      {() => (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-10">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/teacher")}
                className="px-5 py-3 rounded-xl bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 transition"
              >
                Back to Teacher Portal
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8">
              <ResultsToolbar
                loading={loading}
                deleting={deleting}
                hasSubmissions={hasFilteredResults}
                onDownloadPDF={downloadPDF}
                onDownloadCSV={downloadCSV}
                onDeleteAll={deleteAllResults}
              />

              <ResultsFilters
                quizOptions={quizOptions}
                classOptions={classOptions}
                selectedQuizId={selectedQuizId}
                selectedClass={selectedClass}
                onChangeQuiz={setSelectedQuizId}
                onChangeClass={setSelectedClass}
              />

              {!loading && !error && (
                <ResultsSummary count={filteredSubmissions.length} />
              )}

              <ResultsEmptyState
                loading={loading}
                error={error}
                hasResults={hasFilteredResults}
              />

              {!loading && !error && hasFilteredResults && (
                <ResultsList
                  submissions={filteredSubmissions}
                  openIds={openIds}
                  deletingSubmissionId={deletingSubmissionId}
                  onToggle={toggleOpen}
                  onDelete={deleteSingleSubmission}
                  onSetManualScore={setManualScore}
                />
              )}
            </div>
          </div>
        </main>
      )}
    </TeacherGuard>
  );
}