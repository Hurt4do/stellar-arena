"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

type Tone = "cyan" | "purple";

export function Slider({
  className,
  tone = "cyan",
  ...props
}: React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
  tone?: Tone;
}) {
  const rangeClass =
    tone === "cyan"
      ? "bg-neon-cyan/80 shadow-[0_0_22px_rgba(0,179,212,0.32)]"
      : "bg-neon-purple/80 shadow-[0_0_22px_rgba(179,92,255,0.45)]";

  const thumbClass =
    tone === "cyan"
      ? "bg-neon-cyan border-neon-cyan/25 shadow-[0_0_28px_rgba(0,179,212,0.33)]"
      : "bg-neon-purple border-neon-purple/25 shadow-[0_0_28px_rgba(179,92,255,0.45)]";

  return (
    <SliderPrimitive.Root
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="bg-black/10 relative h-1.5 w-full grow rounded-full">
        <SliderPrimitive.Range className={cn("absolute h-full rounded-full", rangeClass)} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          "block h-[18px] w-[18px] rounded-full border shadow-sm focus-visible:outline-none",
          thumbClass,
        )}
      />
    </SliderPrimitive.Root>
  );
}

