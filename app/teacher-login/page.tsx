"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInTeacher } from "../../lib/teacher-auth";

export default function TeacherLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password.");
      return;
    }

    setLoading(true);

    const { error } = await signInTeacher(email.trim(), password);

    if (error) {
      alert(`Could not sign in: ${error.message}`);
      setLoading(false);
      return;
    }

    router.push("/teacher");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-10 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-10">
        <h1 className="text-4xl font-bold text-slate-900">Teacher Login</h1>
        <p className="text-slate-600 mt-3">
          Sign in to access quiz creation, library, and results.
        </p>

        <div className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="teacher@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Enter password"
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </div>
    </main>
  );
}