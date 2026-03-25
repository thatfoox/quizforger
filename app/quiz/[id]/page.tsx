"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import type { Quiz } from "../../../lib/quiz-data";
import {
  calculateAutoScore,
  formatTime,
  getTotalPossiblePoints,
} from "../../../lib/quiz-utils";
import { randomizeQuizForAttempt } from "../../../lib/quiz-randomize";
import { generateResultCode } from "../../../lib/result-code";

import QuizHeader from "../../../components/quiz/QuizHeader";
import QuestionCard from "../../../components/quiz/QuestionCard";
import QuizNavigation from "../../../components/quiz/QuizNavigation";
import QuestionNavigator from "../../../components/quiz/QuestionNavigator";

type QuizRow = {
  id: string;
  title: string;
  quiz_data: Quiz;
};

function SharedQuizPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const quizId = typeof params?.id === "string" ? params.id : "";

  const first = searchParams.get("first") || "";
  const last = searchParams.get("last") || "";
  const className = searchParams.get("class") || "";

  const timerSubmittedRef = useRef(false);
  const submitLockRef = useRef(false);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | string)[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const [showExitWarning, setShowExitWarning] = useState(false);
  const [exitHandled, setExitHandled] = useState(false);

  useEffect(() => {
    async function loadQuiz() {
      if (!quizId) {
        setLoadingQuiz(false);
        return;
      }

      const { data, error } = await supabase
        .from("quizzes")
        .select("id, title, quiz_data")
        .eq("id", quizId)
        .single();

      if (error || !data) {
        console.error("Could not load quiz:", error);
        setLoadingQuiz(false);
        return;
      }

      const row = data as QuizRow;
      const randomizedQuiz = randomizeQuizForAttempt(row.quiz_data);

      setQuiz(randomizedQuiz);
      setCurrent(0);
      setAnswers([]);
      setTimeLeft(
        randomizedQuiz.timeLimitMinutes
          ? randomizedQuiz.timeLimitMinutes * 60
          : 0
      );
      setLoadingQuiz(false);
    }

    loadQuiz();
  }, [quizId]);

  function chooseMcqAnswer(index: number) {
    const updated = [...answers];
    updated[current] = index;
    setAnswers(updated);
  }

  function changeShortAnswer(value: string) {
    const updated = [...answers];
    updated[current] = value;
    setAnswers(updated);
  }

  function nextQuestion() {
    if (!quiz) return;
    if (current < quiz.questions.length - 1) {
      setCurrent(current + 1);
    }
  }

  function prevQuestion() {
    if (current > 0) {
      setCurrent(current - 1);
    }
  }

  function jumpToQuestion(index: number) {
    if (!quiz) return;
    if (index >= 0 && index < quiz.questions.length) {
      setCurrent(index);
    }
  }

  async function finishQuiz() {
    if (!quiz || submitLockRef.current) return;

    submitLockRef.current = true;
    setSubmitting(true);

    const autoScore = calculateAutoScore(quiz, answers);
    const totalPoints = getTotalPossiblePoints(quiz);
    const hasFrq = quiz.questions.some((q) => q.type === "short");
    const accessCode = generateResultCode();

    try {
      const { error } = await supabase.from("submissions").insert([
        {
          first_name: first,
          last_name: last,
          class_name: className,
          quiz_id: quizId || null,
          score: autoScore,
          auto_score: autoScore,
          final_score: autoScore,
          total: totalPoints,
          answers,
          quiz_snapshot: quiz,
          manual_scores: {},
          review_status: hasFrq ? "pending" : "reviewed",
          result_access_code: accessCode,
        },
      ]);

      if (error) {
        alert(`Could not save result: ${error.message}`);
        setSubmitting(false);
        submitLockRef.current = false;
        return;
      }

      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
      } catch {
        //
      }

      router.replace(
        `/submitted?first=${encodeURIComponent(
          first
        )}&last=${encodeURIComponent(last)}&auto_score=${autoScore}&total=${totalPoints}&review_status=${
          hasFrq ? "pending" : "reviewed"
        }&code=${encodeURIComponent(accessCode)}`
      );
    } catch {
      alert("Could not save result.");
      setSubmitting(false);
      submitLockRef.current = false;
    }
  }

  async function returnToFullscreen() {
    setShowExitWarning(false);
    setExitHandled(true);

    try {
      await document.documentElement.requestFullscreen();
    } catch {
      //
    }

    setTimeout(() => {
      setExitHandled(false);
    }, 400);
  }

  function confirmExitAndSubmit() {
    setShowExitWarning(false);
    setExitHandled(true);
    finishQuiz();
  }

  useEffect(() => {
    if (!quiz?.timeLimitMinutes || submitting) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          if (!timerSubmittedRef.current) {
            timerSubmittedRef.current = true;
            finishQuiz();
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quiz?.timeLimitMinutes, submitting]);

  useEffect(() => {
    if (submitting) return;

    function handleVisibilityChange() {
      if (document.hidden) {
        finishQuiz();
      }
    }

    function handleBlur() {
      finishQuiz();
    }

    function handleFullscreenChange() {
      if (!document.fullscreenElement && !submitting && !exitHandled) {
        setShowExitWarning(true);
      }
    }

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }

    function handlePopState() {
      window.history.pushState(null, "", window.location.href);
    }

    function blockContextMenu(e: MouseEvent) {
      e.preventDefault();
    }

    function blockCopy(e: ClipboardEvent) {
      e.preventDefault();
    }

    function blockPaste(e: ClipboardEvent) {
      e.preventDefault();
    }

    function blockCut(e: ClipboardEvent) {
      e.preventDefault();
    }

    window.history.pushState(null, "", window.location.href);

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("blur", handleBlur);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("copy", blockCopy);
    document.addEventListener("paste", blockPaste);
    document.addEventListener("cut", blockCut);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("blur", handleBlur);

      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("copy", blockCopy);
      document.removeEventListener("paste", blockPaste);
      document.removeEventListener("cut", blockCut);
    };
  }, [submitting, first, last, className, quizId, quiz, exitHandled]);

  if (loadingQuiz) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading quiz...
      </main>
    );
  }

  if (!quiz) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Quiz not found
      </main>
    );
  }

  const question = quiz.questions[current];

  const answeredCount = answers.filter((answer) => {
    if (typeof answer === "number") return true;
    if (typeof answer === "string") return answer.trim() !== "";
    return false;
  }).length;

  const progress = (answeredCount / quiz.questions.length) * 100;

  return (
    <>
      <main className="min-h-screen bg-slate-900 flex items-center justify-center px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-10">
        <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-4 sm:p-6 md:p-8">
          <QuizHeader
            title={quiz.title}
            current={current}
            total={quiz.questions.length}
            progress={progress}
            timeLimitMinutes={quiz.timeLimitMinutes}
            timeLeft={timeLeft}
            formattedTime={formatTime(timeLeft)}
          />

          <QuestionNavigator
            total={quiz.questions.length}
            current={current}
            answers={answers}
            onJumpToQuestion={jumpToQuestion}
          />

          <QuestionCard
            question={question}
            currentAnswer={answers[current]}
            onChooseMcqAnswer={chooseMcqAnswer}
            onChangeShortAnswer={changeShortAnswer}
          />

          <QuizNavigation
            current={current}
            total={quiz.questions.length}
            submitting={submitting}
            onPrevious={prevQuestion}
            onNext={nextQuestion}
            onFinish={finishQuiz}
          />
        </div>
      </main>

      {showExitWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              Exit Fullscreen?
            </h2>

            <p className="mt-4 text-slate-600">
              If you exit fullscreen, your quiz will be submitted immediately.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={returnToFullscreen}
                className="px-5 py-3 rounded-xl bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 transition"
              >
                Stay in Quiz
              </button>

              <button
                onClick={confirmExitAndSubmit}
                className="px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function SharedQuizPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          Loading quiz...
        </main>
      }
    >
      <SharedQuizPageContent />
    </Suspense>
  );
}