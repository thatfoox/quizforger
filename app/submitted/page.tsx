"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function SubmittedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const first = searchParams.get("first") || "";
  const last = searchParams.get("last") || "";
  const autoScore = searchParams.get("auto_score") || "0";
  const total = searchParams.get("total") || "0";
  const reviewStatus = searchParams.get("review_status") || "pending";
  const code = searchParams.get("code") || "";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-10 text-center">
        <h1 className="text-4xl font-bold text-slate-900">Quiz Submitted</h1>

        <p className="text-slate-600 mt-4 text-lg">
          Thank you, {first} {last}.
        </p>

        <div className="mt-8 rounded-3xl bg-slate-50 border border-slate-200 p-8">
          <p className="text-sm text-slate-500">Auto-scored points so far</p>
          <p className="text-5xl font-bold text-slate-900 mt-2">
            {autoScore} / {total}
          </p>

          {reviewStatus === "pending" ? (
            <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-amber-800">
              Your free-response questions are still{" "}
              <span className="font-semibold">under review</span>. Your final
              score may change after teacher grading.
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800">
              Your quiz has been fully reviewed.
            </div>
          )}
        </div>

        <div className="mt-6 rounded-2xl bg-blue-50 border border-blue-200 p-5 text-blue-900">
          <p className="font-semibold">Your result access code</p>
          <p className="text-3xl font-bold mt-2 tracking-widest">
            {code || "NO-CODE"}
          </p>
          <p className="text-sm mt-2">
            Save this code. You will need it to check your results later.
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={() => router.push("/student")}
            className="px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
          >
            Back to Student Portal
          </button>
        </div>
      </div>
    </main>
  );
}