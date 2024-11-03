"use client";

import { ReactNode } from "react";

export default function NotProvidedSpan({
  hover = false,
  children,
}: {
  hover?: boolean | null;
  children?: ReactNode | null;
}) {
  return (
    <span
      className={`${
        hover ? "hover:underline" : ""
      } text-muted-foreground text-xs`}
    >
      {children || "#NP"}
    </span>
  );
}
