"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = {
  href: string;
  label: string;
};

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function AppNavbar() {
  const pathname = usePathname();

  const isTeacherSection =
    pathname === "/teacher" ||
    pathname.startsWith("/create") ||
    pathname.startsWith("/library") ||
    pathname.startsWith("/result") ||
    pathname.startsWith("/edit");

  const isStudentSection =
    pathname === "/student" ||
    pathname.startsWith("/student-results");

  let links: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/teacher", label: "Teacher" },
    { href: "/student", label: "Student" },
  ];

  let portalLabel = "";

  if (isTeacherSection) {
    portalLabel = "Teacher Portal";
    links = [
      { href: "/teacher", label: "Teacher Home" },
      { href: "/create", label: "Create" },
      { href: "/library", label: "Library" },
      { href: "/result", label: "Results" },
    ];
  }

  if (isStudentSection) {
    portalLabel = "Student Portal";
    links = [
      { href: "/student", label: "Student Home" },
      { href: "/student-results", label: "My Results" },
    ];
  }

  return (
    <nav className="w-full border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/quizforge-logo.png"
              alt="QuizForge"
              width={42}
              height={42}
              className="quizforge-logo rounded-xl"
              priority
            />
            <span className="text-2xl font-bold tracking-tight text-slate-900 hover:text-slate-700 transition">
              QuizForge
            </span>
          </Link>

          {portalLabel ? (
            <span className="inline-flex rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-xs font-semibold">
              {portalLabel}
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                isActive(pathname, link.href)
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}