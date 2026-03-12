"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Quiz } from "../../../lib/quiz-data";
import { supabase } from "../../../lib/supabase";
import { getCurrentTeacher } from "../../../lib/teacher-auth";
import { parseQuiz } from "../../../lib/parse-quiz";

import TeacherGuard from "../../../components/auth/TeacherGuard";
import ImportPanel from "../../../components/create/ImportPanel";
import EditorToolbar from "../../../components/create/EditorToolbar";
import QuestionEditorCard from "../../../components/create/QuestionEditorCard";
import QuizPreviewPanel from "../../../components/create/QuizPreviewPanel";

const sampleCode = `\\title{Mini Algebra Quiz}

\\question
\\type{mcq}
\\prompt{Which of these is a linear equation?}
\\choice{$y = 2x + 3$}
\\choice{$y = x^2 + 1$}
\\choice{$y = \\frac{1}{x}$}
\\choice{$y = \\sqrt{x}$}
\\answer{1}
\\points{1}

\\question
\\type{short}
\\prompt{Write the perimeter of a square with side length $x$.}
\\answer{$4x$}
\\points{2}`;

type QuizRow = {
  id: string;
  title: string;
  quiz_data: Quiz;
};

export default function EditQuizPage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [importCode, setImportCode] = useState(sampleCode);
  const [importError, setImportError] = useState("");

  const [quizDraft, setQuizDraft] = useState<Quiz>({
    title: "Loading Quiz...",
    timeLimitMinutes: 10,
    randomizeQuestions: true,
    randomizeChoices: true,
    questions: [],
  });

  useEffect(() => {
    async function loadQuiz() {
      const quizId = params?.id;

      if (!quizId || typeof quizId !== "string") {
        setLoading(false);
        return;
      }

      const teacher = await getCurrentTeacher();

      if (!teacher) {
        alert("You must sign in as a teacher.");
        router.push("/teacher-login");
        return;
      }

      const { data, error } = await supabase
        .from("quizzes")
        .select("id, title, quiz_data")
        .eq("id", quizId)
        .eq("owner_id", teacher.id)
        .single();

      if (error || !data) {
        alert("Could not load quiz.");
        setLoading(false);
        return;
      }

      const row = data as QuizRow;
      setQuizDraft({
        timeLimitMinutes: 10,
        randomizeQuestions: true,
        randomizeChoices: true,
        ...row.quiz_data,
      });
      setLoading(false);
    }

    loadQuiz();
  }, [params, router]);

  function updateTitle(value: string) {
    setQuizDraft((prev) => ({ ...prev, title: value }));
  }

  function updateTimeLimit(value: string) {
    const parsed = Number(value);

    setQuizDraft((prev) => ({
      ...prev,
      timeLimitMinutes:
        value.trim() === "" || Number.isNaN(parsed) || parsed <= 0
          ? undefined
          : parsed,
    }));
  }

  function updateRandomizeQuestions(value: boolean) {
    setQuizDraft((prev) => ({
      ...prev,
      randomizeQuestions: value,
    }));
  }

  function updateRandomizeChoices(value: boolean) {
    setQuizDraft((prev) => ({
      ...prev,
      randomizeChoices: value,
    }));
  }

  function addMcqQuestion() {
    setQuizDraft((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: Date.now(),
          type: "mcq",
          prompt: "",
          choices: ["", "", "", ""],
          answer: 0,
          points: 1,
        },
      ],
    }));
  }

  function addShortQuestion() {
    setQuizDraft((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: Date.now(),
          type: "short",
          prompt: "",
          answer: "",
          points: 1,
        },
      ],
    }));
  }

  function deleteQuestion(id: number) {
    setQuizDraft((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  }

  function updatePrompt(id: number, value: string) {
    setQuizDraft((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, prompt: value } : q
      ),
    }));
  }

  function updatePoints(id: number, value: number) {
    setQuizDraft((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, points: value } : q
      ),
    }));
  }

  function updateMcqChoice(
    questionId: number,
    choiceIndex: number,
    value: string
  ) {
    setQuizDraft((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id !== questionId || q.type !== "mcq") return q;

        const newChoices = [...q.choices];
        newChoices[choiceIndex] = value;

        return { ...q, choices: newChoices };
      }),
    }));
  }

  function updateMcqAnswer(questionId: number, answerIndex: number) {
    setQuizDraft((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId && q.type === "mcq"
          ? { ...q, answer: answerIndex }
          : q
      ),
    }));
  }

  function updateShortAnswer(questionId: number, value: string) {
    setQuizDraft((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId && q.type === "short"
          ? { ...q, answer: value }
          : q
      ),
    }));
  }

  function exportQuizJson() {
    const json = JSON.stringify(quizDraft, null, 2);
    navigator.clipboard.writeText(json);
    alert("Quiz JSON copied to clipboard.");
  }

  function validateQuiz() {
    if (!quizDraft.title.trim()) {
      alert("Please add a quiz title.");
      return false;
    }

    if (quizDraft.questions.length === 0) {
      alert("Please add at least one question.");
      return false;
    }

    const hasInvalidQuestion = quizDraft.questions.some((question) => {
      if (!question.prompt.trim()) return true;
      if (question.points <= 0) return true;

      if (question.type === "mcq") {
        return question.choices.some((choice) => !choice.trim());
      }

      return !question.answer.trim();
    });

    if (hasInvalidQuestion) {
      alert("Please complete all question fields before continuing.");
      return false;
    }

    return true;
  }

  function useThisQuiz() {
    if (!validateQuiz()) return;

    localStorage.setItem("customQuiz", JSON.stringify(quizDraft));
    alert("Quiz loaded. Opening quiz page.");
    router.push("/quiz");
  }

  async function saveQuizToLibrary() {
    if (!validateQuiz()) return;

    const quizId = params?.id;

    if (!quizId || typeof quizId !== "string") {
      alert("Quiz ID is invalid.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("quizzes")
      .update({
        title: quizDraft.title,
        quiz_data: quizDraft,
      })
      .eq("id", quizId);

    if (error) {
      alert(`Could not update quiz: ${error.message}`);
      setSaving(false);
      return;
    }

    alert("Quiz updated successfully.");
    setSaving(false);
  }

  function importFromCode() {
    try {
      const parsed = parseQuiz(importCode);
      setQuizDraft((prev) => ({
        ...prev,
        ...parsed,
        timeLimitMinutes: prev.timeLimitMinutes ?? 10,
        randomizeQuestions: prev.randomizeQuestions ?? true,
        randomizeChoices: prev.randomizeChoices ?? true,
      }));
      setImportError("");
      alert("Quiz imported into editor.");
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : "Could not parse quiz code."
      );
    }
  }

  function loadSample() {
    setImportCode(sampleCode);
    setImportError("");
  }

  return (
    <TeacherGuard>
      {() => (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/teacher")}
                className="px-5 py-3 rounded-xl bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 transition"
              >
                Back to Teacher Portal
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8">
                <EditorToolbar
                  saving={saving}
                  onUseThisQuiz={useThisQuiz}
                  onCopyQuizJson={exportQuizJson}
                  onSaveQuizToLibrary={saveQuizToLibrary}
                  onAddMcqQuestion={addMcqQuestion}
                  onAddShortQuestion={addShortQuestion}
                />

                <div className="mt-8">
                  <ImportPanel
                    importCode={importCode}
                    importError={importError}
                    onChangeImportCode={setImportCode}
                    onImportFromCode={importFromCode}
                    onLoadSample={loadSample}
                  />
                </div>

                <div className="mt-8 grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Quiz title
                    </label>
                    <input
                      type="text"
                      value={quizDraft.title}
                      onChange={(e) => updateTitle(e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Time limit (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quizDraft.timeLimitMinutes ?? ""}
                      onChange={(e) => updateTimeLimit(e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      placeholder="Example: 10"
                    />
                  </div>

                  <div className="flex flex-col gap-3 justify-end">
                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={quizDraft.randomizeQuestions ?? true}
                        onChange={(e) =>
                          updateRandomizeQuestions(e.target.checked)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-slate-900 font-medium">
                        Randomize Questions
                      </span>
                    </label>

                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={quizDraft.randomizeChoices ?? true}
                        onChange={(e) =>
                          updateRandomizeChoices(e.target.checked)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-slate-900 font-medium">
                        Randomize Choices
                      </span>
                    </label>
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  {quizDraft.questions.map((question, index) => (
                    <QuestionEditorCard
                      key={question.id}
                      question={question}
                      index={index}
                      onDelete={deleteQuestion}
                      onUpdatePrompt={updatePrompt}
                      onUpdatePoints={updatePoints}
                      onUpdateMcqChoice={updateMcqChoice}
                      onUpdateMcqAnswer={updateMcqAnswer}
                      onUpdateShortAnswer={updateShortAnswer}
                    />
                  ))}
                </div>
              </div>

              <QuizPreviewPanel quizDraft={quizDraft} />
            </div>
          </div>
        </main>
      )}
    </TeacherGuard>
  );
}