export type McqQuestion = {
  id: number;
  type: "mcq";
  prompt: string;
  choices: string[];
  answer: number;
  points: number;
};

export type ShortQuestion = {
  id: number;
  type: "short";
  prompt: string;
  answer: string;
  points: number;
};

export type QuizQuestion = McqQuestion | ShortQuestion;

export type Quiz = {
  title: string;
  timeLimitMinutes?: number;
  randomizeQuestions?: boolean;
  randomizeChoices?: boolean;
  questions: QuizQuestion[];
};

export const defaultQuiz: Quiz = {
  title: "Algebra Practice",
  timeLimitMinutes: 10,
  randomizeQuestions: true,
  randomizeChoices: true,
  questions: [
    {
      id: 1,
      type: "mcq",
      prompt: "Which equation has slope −2 and y-intercept 5?",
      choices: [
        "y = -2x + 5",
        "y = 2x + 5",
        "y = -5x + 2",
        "y = 5x - 2",
      ],
      answer: 0,
      points: 1,
    },
    {
      id: 2,
      type: "mcq",
      prompt: "Solve: $x^2 - 5x + 6 = 0$",
      choices: [
        "$x = 2$ or $x = 3$",
        "$x = -2$ or $x = -3$",
        "$x = 1$ or $x = 6$",
        "$x = -1$ or $x = -6$",
      ],
      answer: 0,
      points: 1,
    },
    {
      id: 3,
      type: "short",
      prompt: "Write the perimeter of a square with side length $x$.",
      answer: "$4x$",
      points: 2,
    },
  ],
};