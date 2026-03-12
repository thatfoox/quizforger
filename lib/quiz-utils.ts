import type { Quiz } from "./quiz-data";

export function normalizeText(text: string) {
  return text.trim().replace(/\s+/g, " ").toLowerCase();
}

export function calculateAutoScore(
  quiz: Quiz,
  answers: (number | string)[]
): number {
  let score = 0;

  quiz.questions.forEach((question, i) => {
    const givenAnswer = answers[i];

    if (question.type === "mcq" && givenAnswer === question.answer) {
      score += question.points;
    }
  });

  return score;
}

export function getTotalPossiblePoints(quiz: Quiz): number {
  return quiz.questions.reduce((sum, question) => sum + question.points, 0);
}

export function getFrqPendingPoints(quiz: Quiz): number {
  return quiz.questions
    .filter((question) => question.type === "short")
    .reduce((sum, question) => sum + question.points, 0);
}

export function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}