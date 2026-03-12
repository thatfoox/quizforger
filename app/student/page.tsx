"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function StudentPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-10 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-10">

          <div className="flex items-center justify-between flex-wrap gap-4">

            <div className="flex items-center gap-4">
              <Image
                src="/quizforge-logo.png"
                alt="QuizForge"
                width={64}
                height={64}
                className="quizforge-logo rounded-xl"
              />

              <div>
                <h1 className="text-4xl font-bold text-slate-900">
                  Student Portal
                </h1>
                <p className="text-slate-600 mt-1">
                  View your quiz scores and review status.
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push("/")}
              className="px-5 py-3 rounded-xl bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 transition"
            >
              Back to Home
            </button>

          </div>

          <div className="mt-12">

            <button
              onClick={() => router.push("/student-results")}
              className="quizforge-card rounded-3xl border border-slate-200 bg-slate-50 p-10 text-left hover:bg-slate-100 hover:shadow-md transition w-full"
            >
              <div className="text-5xl mb-4">📄</div>
              <h2 className="text-3xl font-bold text-slate-900">
                Find My Results
              </h2>
              <p className="text-slate-600 mt-3 text-lg">
                Enter your name, class, and access code to view your quiz results.
              </p>
            </button>

          </div>
        </div>
      </div>
    </main>
  );
}