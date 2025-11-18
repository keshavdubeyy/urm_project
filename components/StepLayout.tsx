"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface StepLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  onNext?: () => void | boolean;
  onBack?: () => void;
  nextHref?: string;
  backHref?: string;
  nextLabel?: string;
  backLabel?: string;
  showNext?: boolean;
  showBack?: boolean;
}

export default function StepLayout({
  children,
  currentStep,
  totalSteps,
  stepTitle,
  onNext,
  onBack,
  nextHref,
  backHref,
  nextLabel = "Next",
  backLabel = "Back",
  showNext = true,
  showBack = true,
}: StepLayoutProps) {
  const router = useRouter();

  const handleNext = () => {
    let shouldProceed = true;
    
    if (onNext) {
      const result = onNext();
      if (result === false) {
        shouldProceed = false;
      }
    }
    
    if (shouldProceed && nextHref) {
      router.push(nextHref);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
    if (backHref) {
      router.push(backHref);
    }
  };

  return (
    <div className="min-h-screen bg-apple-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Progress Indicator */}
        <div className="apple-card p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-apple-gray-600 tracking-tight">Progress</span>
            <span className="text-sm font-bold text-apple-gray-900">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <div className="apple-progress-bar">
            <div
              className="apple-progress-fill"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content Card */}
        <div className="apple-card p-8 sm:p-10 lg:p-12">
          <h2 className="apple-heading-3 mb-10">
            {stepTitle}
          </h2>
          <div className="space-y-8">
            {children}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 sm:gap-6 pb-8">
          {showBack ? (
            backHref ? (
              <Link
                href={backHref}
                onClick={onBack}
                className="apple-button-secondary text-center min-w-[140px] sm:min-w-[160px]"
              >
                {backLabel}
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleBack}
                className="apple-button-secondary text-center min-w-[140px] sm:min-w-[160px]"
              >
                {backLabel}
              </button>
            )
          ) : (
            <div className="hidden sm:block" />
          )}

          {showNext &&
            (nextHref ? (
              <button
                type="button"
                onClick={handleNext}
                className="apple-button-primary text-center min-w-[140px] sm:min-w-[160px]"
              >
                {nextLabel}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="apple-button-primary text-center min-w-[140px] sm:min-w-[160px]"
              >
                {nextLabel}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
