"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function QuizStartPage() {
  const params = useParams();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [className, setClassName] = useState("");

  async function handleStart() {
    const quizId = params?.id;

    if (!quizId || typeof quizId !== "string") {
      alert("Quiz link is invalid.");
      return;
    }

    if (!firstName.trim() || !lastName.trim() || !className.trim()) {
      alert("Please enter first name, second name, and class.");
      return;
    }

    try {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      }
    } catch (error) {
      console.error("Could not enter fullscreen:", error);
    }

    router.push(
      `/quiz/${quizId}?first=${encodeURIComponent(
        firstName
      )}&last=${encodeURIComponent(lastName)}&class=${encodeURIComponent(
        className
      )}`
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Start Quiz
        </h1>

        <p className="text-slate-600 mb-8">
          Enter your first name, second name, and class before beginning.
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              First name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Enter first name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Second name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Enter second name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Class
            </label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Example: 9A"
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleStart}
            className="w-full px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
          >
            Start Quiz
          </button>
        </div>

        <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-amber-800 text-sm">
          Once the quiz starts, do not refresh, close, or leave the page.
        </div>
      </div>
    </main>
  );
}