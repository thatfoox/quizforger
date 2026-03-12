"use client";

import { useEffect, useRef, useState } from "react";
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

export default function SharedQuizPage() {
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
        // ignore fullscreen exit errors
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
      if (document.hidden) finishQuiz();
    }

    function handleBlur() {
      finishQuiz();
    }

    function handleFullscreenChange() {
      if (!document.fullscreenElement) {
        finishQuiz();
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

    function handleResize() {
      if (window.innerWidth < 900 || window.innerHeight < 600) {
        finishQuiz();
      }
    }

    window.history.pushState(null, "", window.location.href);

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("resize", handleResize);

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
      window.removeEventListener("resize", handleResize);

      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("copy", blockCopy);
      document.removeEventListener("paste", blockPaste);
      document.removeEventListener("cut", blockCut);
    };
  }, [submitting, first, last, className, quizId, quiz, answers]);

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
    <main className="min-h-screen bg-slate-900 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-10">
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
  );
}