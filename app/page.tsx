"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-10 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4">
              <Image
                src="/quizforge-logo.png"
                alt="QuizForge"
                width={120}
                height={120}
                className="quizforge-logo rounded-2xl"
                priority
              />
              <h1 className="text-5xl font-bold text-slate-900 tracking-tight">
                QuizForge
              </h1>
            </div>

            <p className="text-slate-600 mt-5 text-lg">
              Forge better quizzes. Run smarter classrooms.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <button
              onClick={() => router.push("/teacher")}
              className="quizforge-card rounded-3xl border border-slate-200 bg-slate-50 p-10 text-left hover:bg-slate-100 hover:shadow-md transition"
            >
              <div className="text-5xl mb-4">🧑🏻‍🏫</div>
              <h2 className="text-3xl font-bold text-slate-900">
                Teacher Portal
              </h2>
              <p className="text-slate-600 mt-3 text-lg">
                Create quizzes, manage library, and review results.
              </p>
            </button>

            <button
              onClick={() => router.push("/student")}
              className="quizforge-card rounded-3xl border border-slate-200 bg-slate-50 p-10 text-left hover:bg-slate-100 hover:shadow-md transition"
            >
              <div className="text-5xl mb-4">🎓</div>
              <h2 className="text-3xl font-bold text-slate-900">
                Student Portal
              </h2>
              <p className="text-slate-600 mt-3 text-lg">
                View your quiz results and check review status.
              </p>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}