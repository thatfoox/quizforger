"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

type SubmissionRow = {
  id: string;
  first_name: string;
  last_name: string;
  class_name: string | null;
  quiz_id: string | null;
  auto_score: number | null;
  final_score: number | null;
  total: number;
  review_status: string | null;
  submitted_at: string;
  quiz_snapshot: {
    title?: string;
  } | null;
};

export default function StudentResultsPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [className, setClassName] = useState("");
  const [accessCode, setAccessCode] = useState("");

  const [results, setResults] = useState<SubmissionRow[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !className.trim() ||
      !accessCode.trim()
    ) {
      alert("Please enter first name, second name, class, and access code.");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(false);

    const { data, error } = await supabase
      .from("submissions")
      .select(
        "id, first_name, last_name, class_name, quiz_id, auto_score, final_score, total, review_status, submitted_at, quiz_snapshot"
      )
      .eq("first_name", firstName.trim())
      .eq("last_name", lastName.trim())
      .eq("class_name", className.trim())
      .eq("result_access_code", accessCode.trim().toUpperCase())
      .order("submitted_at", { ascending: false });

    if (error) {
      setError(error.message);
      setResults([]);
      setLoading(false);
      setSearched(true);
      return;
    }

    setResults((data || []) as SubmissionRow[]);
    setLoading(false);
    setSearched(true);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Student Results Lookup
            </h1>
            <p className="text-slate-600 mt-2">
              Enter your first name, second name, class, and result access code.
            </p>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Access Code
              </label>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Example: K7P4XZ"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition disabled:opacity-50"
            >
              {loading ? "Searching..." : "Find My Results"}
            </button>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-700">
              Could not load results: {error}
            </div>
          )}

          {searched && !loading && !error && results.length === 0 && (
            <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-6 text-slate-600">
              No results found for that information.
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-8 space-y-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {result.quiz_snapshot?.title || "Quiz"}
                      </h2>
                      <p className="text-slate-600 mt-2">
                        Submitted:{" "}
                        {new Date(result.submitted_at).toLocaleString()}
                      </p>
                      <p className="text-slate-500 mt-1 text-sm">
                        Class: {result.class_name || "-"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex rounded-full bg-white border border-slate-300 px-3 py-1 text-slate-700 font-medium text-sm">
                        Auto: {result.auto_score ?? 0}
                      </span>

                      <span className="inline-flex rounded-full bg-slate-900 text-white px-3 py-1 font-medium text-sm">
                        Final: {result.final_score ?? 0} / {result.total}
                      </span>

                      <span
                        className={`inline-flex rounded-full px-3 py-1 font-medium text-sm ${
                          result.review_status === "reviewed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {result.review_status === "reviewed"
                          ? "Reviewed"
                          : "Under Review"}
                      </span>
                    </div>
                  </div>

                  {result.review_status !== "reviewed" && (
                    <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-amber-800 text-sm">
                      Your free-response questions are still under review. Your
                      final score may change.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}