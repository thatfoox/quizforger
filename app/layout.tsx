import "./globals.css";
import type { Metadata } from "next";
import AppNavbar from "../components/AppNavbar";
import { MathJaxContext } from "better-react-mathjax";
import HideNavbarWrapper from "../components/HideNavbarWrapper";

export const metadata: Metadata = {
  title: "QuizForge",
  description: "Forge Better Knowledge",
};

const mathJaxConfig = {
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MathJaxContext config={mathJaxConfig}>
          <HideNavbarWrapper>
            <AppNavbar />
          </HideNavbarWrapper>

          {children}
        </MathJaxContext>
      </body>
    </html>
  );
}