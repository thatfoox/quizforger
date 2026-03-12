"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentTeacher } from "../../lib/teacher-auth";

type TeacherUser = {
  id: string;
  email?: string;
};

type TeacherGuardProps = {
  children: (teacher: TeacherUser) => React.ReactNode;
};

export default function TeacherGuard({ children }: TeacherGuardProps) {
  const router = useRouter();
  const [teacher, setTeacher] = useState<TeacherUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkTeacher() {
      try {
        const user = await getCurrentTeacher();

        if (!mounted) return;

        if (!user) {
          router.replace("/teacher-login");
          return;
        }

        setTeacher({
          id: user.id,
          email: user.email,
        });
      } catch {
        if (mounted) {
          router.replace("/teacher-login");
        }
      } finally {
        if (mounted) {
          setChecking(false);
        }
      }
    }

    checkTeacher();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (checking || !teacher) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-10 text-slate-700">
          Checking teacher access...
        </div>
      </main>
    );
  }

  return <>{children(teacher)}</>;
}