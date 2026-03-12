type QuizOption = {
  id: string;
  title: string;
};

type ResultsFiltersProps = {
  quizOptions: QuizOption[];
  classOptions: string[];
  selectedQuizId: string;
  selectedClass: string;
  onChangeQuiz: (value: string) => void;
  onChangeClass: (value: string) => void;
};

export default function ResultsFilters({
  quizOptions,
  classOptions,
  selectedQuizId,
  selectedClass,
  onChangeQuiz,
  onChangeClass,
}: ResultsFiltersProps) {
  return (
    <div className="mt-6 grid md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Filter by quiz
        </label>
        <select
          value={selectedQuizId}
          onChange={(e) => onChangeQuiz(e.target.value)}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
        >
          <option value="all">All quizzes</option>
          {quizOptions.map((quiz) => (
            <option key={quiz.id} value={quiz.id}>
              {quiz.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Filter by class
        </label>
        <select
          value={selectedClass}
          onChange={(e) => onChangeClass(e.target.value)}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
        >
          <option value="all">All classes</option>
          {classOptions.map((className) => (
            <option key={className} value={className}>
              {className}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}