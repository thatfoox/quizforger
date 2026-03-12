"use client";

import { usePathname } from "next/navigation";

export default function HideNavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNavbar =
    pathname.startsWith("/quiz");

  if (hideNavbar) return null;

  return <>{children}</>;
}