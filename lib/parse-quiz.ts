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

export type ParsedQuestion = McqQuestion | ShortQuestion;

export type ParsedQuiz = {
  title: string;
  questions: ParsedQuestion[];
};

function extractSingle(line: string, tag: string): string | null {
  const regex = new RegExp(`^\\\\${tag}\\{([\\s\\S]*)\\}$`);
  const match = line.match(regex);
  return match ? match[1].trim() : null;
}

export function parseQuiz(input: string): ParsedQuiz {
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let title = "Untitled Quiz";
  const questions: ParsedQuestion[] = [];

  let i = 0;
  let questionId = 1;

  while (i < lines.length) {
    const line = lines[i];

    const parsedTitle = extractSingle(line, "title");
    if (parsedTitle) {
      title = parsedTitle;
      i++;
      continue;
    }

    if (line === "\\question") {
      i++;

      let type: "mcq" | "short" | null = null;
      let prompt = "";
      const choices: string[] = [];
      let answerRaw: string | null = null;
      let points = 1;

      while (i < lines.length && lines[i] !== "\\question") {
        const currentLine = lines[i];

        const parsedType = extractSingle(currentLine, "type");
        if (parsedType === "mcq" || parsedType === "short") {
          type = parsedType;
          i++;
          continue;
        }

        const parsedPrompt = extractSingle(currentLine, "prompt");
        if (parsedPrompt !== null) {
          prompt = parsedPrompt;
          i++;
          continue;
        }

        const parsedChoice = extractSingle(currentLine, "choice");
        if (parsedChoice !== null) {
          choices.push(parsedChoice);
          i++;
          continue;
        }

        const parsedAnswer = extractSingle(currentLine, "answer");
        if (parsedAnswer !== null) {
          answerRaw = parsedAnswer;
          i++;
          continue;
        }

        const parsedPoints = extractSingle(currentLine, "points");
        if (parsedPoints !== null) {
          const parsedNumber = Number(parsedPoints);
          if (!Number.isNaN(parsedNumber) && parsedNumber > 0) {
            points = parsedNumber;
          }
          i++;
          continue;
        }

        i++;
      }

      if (!type) {
        throw new Error(`Question ${questionId}: missing \\type{...}`);
      }

      if (!prompt) {
        throw new Error(`Question ${questionId}: missing \\prompt{...}`);
      }

      if (answerRaw === null) {
        throw new Error(`Question ${questionId}: missing \\answer{...}`);
      }

      if (type === "mcq") {
        if (choices.length < 2) {
          throw new Error(
            `Question ${questionId}: MCQ questions need at least 2 \\choice{...} lines`
          );
        }

        const answerNumber = Number(answerRaw);

        if (
          Number.isNaN(answerNumber) ||
          !Number.isInteger(answerNumber) ||
          answerNumber < 1 ||
          answerNumber > choices.length
        ) {
          throw new Error(
            `Question ${questionId}: MCQ \\answer{...} must be a number from 1 to ${choices.length}`
          );
        }

        questions.push({
          id: questionId,
          type: "mcq",
          prompt,
          choices,
          answer: answerNumber - 1,
          points,
        });
      } else {
        questions.push({
          id: questionId,
          type: "short",
          prompt,
          answer: answerRaw,
          points,
        });
      }

      questionId++;
      continue;
    }

    i++;
  }

  if (questions.length === 0) {
    throw new Error("No questions found.");
  }

  return {
    title,
    questions,
  };
}