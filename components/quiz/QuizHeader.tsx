type QuizHeaderProps = {
  title: string;
  current: number;
  total: number;
  progress: number;
  timeLimitMinutes?: number;
  timeLeft: number;
  formattedTime: string;
};

export default function QuizHeader({
  title,
  current,
  total,
  progress,
  timeLimitMinutes,
  timeLeft,
  formattedTime,
}: QuizHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 break-words">
            {title}
          </h1>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Question {current + 1} of {total}
          </p>
        </div>

        {timeLimitMinutes ? (
          <div
            className={`px-4 py-3 rounded-2xl border font-semibold text-sm sm:text-base w-fit ${
              timeLeft <= 60
                ? "bg-red-50 border-red-200 text-red-700"
                : timeLeft <= 180
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "bg-slate-50 border-slate-200 text-slate-700"
            }`}
          >
            Time Left: {formattedTime}
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between mb-2 gap-3">
        <p className="text-sm font-semibold text-slate-700">Progress</p>
        <p className="text-sm font-semibold text-slate-700 whitespace-nowrap">
          {Math.round(progress)}%
        </p>
      </div>

      <div className="w-full h-3 sm:h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}