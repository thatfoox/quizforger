"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { getCurrentTeacher } from "../../lib/teacher-auth";
import type { Quiz } from "../../lib/quiz-data";

import TeacherGuard from "../../components/auth/TeacherGuard";

type SavedQuizRow = {
  id: string;
  title: string;
  quiz_data: Quiz;
  created_at: string;
};

export default function LibraryPage() {
  const router = useRouter();

  const [quizzes, setQuizzes] = useState<SavedQuizRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  async function loadQuizzes() {
    setLoading(true);

    const teacher = await getCurrentTeacher();

    if (!teacher) {
      setError("You must sign in as a teacher.");
      setQuizzes([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("quizzes")
      .select("id, title, quiz_data, created_at")
      .eq("owner_id", teacher.id)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setQuizzes((data || []) as SavedQuizRow[]);
      setError("");
    }

    setLoading(false);
  }

  function useQuiz(id: string) {
    router.push(`/quiz/${id}/start`);
  }

  async function copyLink(id: string) {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/quiz/${id}/start`
      );
      alert("Quiz link copied.");
    } catch {
      alert("Could not copy quiz link.");
    }
  }

  async function deleteQuiz(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this saved quiz?"
    );

    if (!confirmed) return;

    setDeletingId(id);

    const { error } = await supabase.from("quizzes").delete().eq("id", id);

    if (error) {
      alert(`Could not delete quiz: ${error.message}`);
      setDeletingId(null);
      return;
    }

    await loadQuizzes();
    setDeletingId(null);
  }

  return (
    <TeacherGuard>
      {() => (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-10">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Quiz Library
                  </h1>
                  <p className="text-slate-600 mt-2">
                    Browse your saved quizzes and open them by shareable link.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => router.push("/teacher")}
                    className="px-5 py-3 rounded-xl bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 transition"
                  >
                    Back to Teacher Portal
                  </button>

                  <button
                    onClick={() => router.push("/create")}
                    className="px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
                  >
                    Create New Quiz
                  </button>
                </div>
              </div>

              {loading && (
                <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-6 text-slate-600">
                  Loading quizzes...
                </div>
              )}

              {!loading && error && (
                <div className="mt-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-700">
                  Could not load quizzes: {error}
                </div>
              )}

              {!loading && !error && quizzes.length === 0 && (
                <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-6 text-slate-600">
                  No saved quizzes yet.
                </div>
              )}

              {!loading && !error && quizzes.length > 0 && (
                <div className="mt-8 grid md:grid-cols-2 gap-5">
                  {quizzes.map((quizRow) => (
                    <div
                      key={quizRow.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
                    >
                      <h2 className="text-2xl font-bold text-slate-900">
                        {quizRow.title}
                      </h2>

                      <p className="text-slate-600 mt-2">
                        {quizRow.quiz_data?.questions?.length || 0} question
                        {(quizRow.quiz_data?.questions?.length || 0) === 1
                          ? ""
                          : "s"}
                      </p>

                      <p className="text-slate-500 text-sm mt-2">
                        Created:{" "}
                        {new Date(quizRow.created_at).toLocaleString()}
                      </p>

                      <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl bg-white border border-slate-200 px-4 py-3 text-slate-700">
                          <span className="font-semibold">Timer:</span>{" "}
                          {quizRow.quiz_data?.timeLimitMinutes
                            ? `${quizRow.quiz_data.timeLimitMinutes} min`
                            : "No timer"}
                        </div>

                        <div className="rounded-xl bg-white border border-slate-200 px-4 py-3 text-slate-700">
                          <span className="font-semibold">
                            Random Questions:
                          </span>{" "}
                          {quizRow.quiz_data?.randomizeQuestions
                            ? "Yes"
                            : "No"}
                        </div>

                        <div className="rounded-xl bg-white border border-slate-200 px-4 py-3 text-slate-700 sm:col-span-2">
                          <span className="font-semibold">
                            Random Choices:
                          </span>{" "}
                          {quizRow.quiz_data?.randomizeChoices ? "Yes" : "No"}
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          onClick={() => useQuiz(quizRow.id)}
                          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                        >
                          Start Quiz
                        </button>

                        <button
                          onClick={() => router.push(`/edit/${quizRow.id}`)}
                          className="px-4 py-2 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => copyLink(quizRow.id)}
                          className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
                        >
                          Copy Link
                        </button>

                        <button
                          onClick={() => deleteQuiz(quizRow.id)}
                          disabled={deletingId === quizRow.id}
                          className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50"
                        >
                          {deletingId === quizRow.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>

                      <div className="mt-5 rounded-xl bg-white border border-slate-200 px-4 py-3">
                        <p className="text-sm font-semibold text-slate-700 mb-2">
                          Preview
                        </p>

                        <ul className="space-y-2 text-sm text-slate-600">
                          {quizRow.quiz_data?.questions
                            ?.slice(0, 3)
                            .map((question) => (
                              <li key={question.id} className="line-clamp-2">
                                • {question.prompt}
                              </li>
                            ))}
                        </ul>

                        {(quizRow.quiz_data?.questions?.length || 0) > 3 && (
                          <p className="text-xs text-slate-500 mt-3">
                            + more questions...
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      )}
    </TeacherGuard>
  );
}