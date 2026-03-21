"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-oxanium tracking-widest font-semibold border",
  {
    variants: {
      variant: {
        cyan: "border-neon-cyan/30 text-neon-cyan bg-neon-cyan/10 shadow-[0_0_20px_rgba(0,179,212,0.16)]",
        purple:
          "border-neon-purple/25 text-neon-purple bg-neon-purple/10 shadow-[0_0_20px_rgba(179,92,255,0.20)]",
        gray: "border-black/10 text-black/70 bg-white",
        green: "border-emerald-400/25 text-emerald-300 bg-emerald-400/10",
      },
    },
    defaultVariants: {
      variant: "gray",
    },
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

