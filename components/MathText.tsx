"use client";

import { MathJax } from "better-react-mathjax";

type MathTextProps = {
  text: string;
  className?: string;
};

export default function MathText({
  text,
  className = "",
}: MathTextProps) {
  return (
    <div className={className}>
      <MathJax dynamic>{text}</MathJax>
    </div>
  );
}