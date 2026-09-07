"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { WIZARD_STEPS } from "@/data/wizard";

interface ProgressBarProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function ProgressBar({ currentStep, onStepClick }: ProgressBarProps) {
  return (
    <div className="w-full px-4 py-4">
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        {WIZARD_STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isClickable = step.id <= currentStep;

          return (
            <div key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={cn(
                  "flex flex-col items-center gap-1.5 transition-all duration-300",
                  isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-40"
                )}
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isCompleted
                      ? "var(--color-burgundy)"
                      : isActive
                        ? "var(--color-burgundy)"
                        : "var(--color-ivory-deep)",
                  }}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium transition-all duration-300",
                    isCompleted || isActive
                      ? "text-ivory"
                      : "text-charcoal-soft"
                  )}
                >
                  {isCompleted ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </motion.div>
                <span
                  className={cn(
                    "hidden text-[10px] font-medium sm:block",
                    isActive ? "text-burgundy" : "text-charcoal-soft/60"
                  )}
                >
                  {step.shortLabel}
                </span>
              </button>

              {index < WIZARD_STEPS.length - 1 && (
                <div className="relative mx-1 h-px w-4 sm:mx-2 sm:w-8 md:w-12">
                  <div className="absolute inset-0 bg-charcoal/10" />
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute inset-0 origin-left bg-burgundy"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
