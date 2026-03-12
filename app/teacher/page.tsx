"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOutTeacher } from "../../lib/teacher-auth";
import TeacherGuard from "../../components/auth/TeacherGuard";

export default function TeacherPage() {
  const router = useRouter();

  async function handleSignOut() {
    await signOutTeacher();
    router.push("/teacher-login");
  }

  return (
    <TeacherGuard>
      {(teacher) => (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-10 flex items-center justify-center">
          <div className="w-full max-w-6xl">
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
                      Teacher Portal
                    </h1>
                    <p className="text-slate-600 mt-1">
                      Signed in as {teacher.email}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => router.push("/")}
                    className="px-5 py-3 rounded-xl bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 transition"
                  >
                    Back to Home
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                  >
                    Sign Out
                  </button>
                </div>
              </div>

              <div className="mt-12 grid md:grid-cols-3 gap-6">

                <button
                  onClick={() => router.push("/create")}
                  className="quizforge-card rounded-3xl border border-slate-200 bg-slate-50 p-8 text-left hover:bg-slate-100 hover:shadow-md transition"
                >
                  <div className="text-4xl mb-4">✍️</div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Create Quiz
                  </h2>
                  <p className="text-slate-600 mt-3">
                    Build quizzes manually or import them from code.
                  </p>
                </button>

                <button
                  onClick={() => router.push("/library")}
                  className="quizforge-card rounded-3xl border border-slate-200 bg-slate-50 p-8 text-left hover:bg-slate-100 hover:shadow-md transition"
                >
                  <div className="text-4xl mb-4">📚</div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Quiz Library
                  </h2>
                  <p className="text-slate-600 mt-3">
                    Browse saved quizzes and edit them.
                  </p>
                </button>

                <button
                  onClick={() => router.push("/result")}
                  className="quizforge-card rounded-3xl border border-slate-200 bg-slate-50 p-8 text-left hover:bg-slate-100 hover:shadow-md transition"
                >
                  <div className="text-4xl mb-4">📊</div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Results
                  </h2>
                  <p className="text-slate-600 mt-3">
                    Review student submissions and scores.
                  </p>
                </button>

              </div>
            </div>
          </div>
        </main>
      )}
    </TeacherGuard>
  );
}