import type { Quiz, QuizQuestion, McqQuestion } from "./quiz-data";

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function randomizeMcqChoices(question: McqQuestion): McqQuestion {
  const indexedChoices = question.choices.map((choice, index) => ({
    choice,
    originalIndex: index,
  }));

  const shuffled = shuffleArray(indexedChoices);
  const newChoices = shuffled.map((item) => item.choice);
  const newAnswer = shuffled.findIndex(
    (item) => item.originalIndex === question.answer
  );

  return {
    ...question,
    choices: newChoices,
    answer: newAnswer,
  };
}

export function randomizeQuizForAttempt(quiz: Quiz): Quiz {
  let questions: QuizQuestion[] = [...quiz.questions];

  const shouldRandomizeChoices = quiz.randomizeChoices ?? true;
  const shouldRandomizeQuestions = quiz.randomizeQuestions ?? true;

  if (shouldRandomizeChoices) {
    questions = questions.map((question) =>
      question.type === "mcq" ? randomizeMcqChoices(question) : question
    );
  }

  if (shouldRandomizeQuestions) {
    questions = shuffleArray(questions);
  }

  return {
    ...quiz,
    questions,
  };
}