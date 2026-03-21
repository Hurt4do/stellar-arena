"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-[12px] font-oxanium tracking-widest font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neon-cyan disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-neon-cyan text-black shadow-[0_0_0_1px_rgba(0,179,212,0.22),0_0_30px_rgba(0,179,212,0.19)] hover:opacity-95",
        secondary:
          "bg-white/70 text-black border border-black/10 hover:bg-white",
        ghost: "bg-transparent text-black/70 hover:bg-black/5 hover:text-black",
        outline: "bg-transparent text-black border border-black/15 hover:bg-black/5",
        purple:
          "bg-neon-purple text-black shadow-[0_0_0_1px_rgba(179,92,255,0.28),0_0_30px_rgba(179,92,255,0.25)] hover:opacity-95",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

