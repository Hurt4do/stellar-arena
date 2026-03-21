"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl border border-black/10 bg-white px-4 text-[12px] text-black/85 placeholder:text-black/30 outline-none focus:border-neon-cyan/40 focus:shadow-[0_0_0_1px_rgba(0,179,212,0.12)]",
        className,
      )}
      {...props}
    />
  );
}

