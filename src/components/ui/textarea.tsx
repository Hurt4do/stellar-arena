"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[12px] text-black/85 placeholder:text-black/30 outline-none focus:border-neon-cyan/40 focus:shadow-[0_0_0_1px_rgba(0,179,212,0.12)]",
        className,
      )}
      {...props}
    />
  );
}

