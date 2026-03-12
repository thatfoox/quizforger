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
    <>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          {title}
        </h1>

        {timeLimitMinutes ? (
          <div
            className={`px-4 py-2 rounded-xl font-semibold ${
              timeLeft <= 60
                ? "bg-red-100 text-red-700"
                : "bg-slate-100 text-slate-800"
            }`}
          >
            Time Left: {formattedTime}
          </div>
        ) : null}
      </div>

      <p className="text-slate-700 mb-4 font-medium">
        Question {current + 1} of {total}
      </p>

      <div className="w-full h-3 bg-slate-200 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-slate-900 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
}