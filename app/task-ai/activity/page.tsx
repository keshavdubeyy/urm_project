"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Timer from "@/components/Timer";
import { useSurvey } from "@/context/SurveyContext";
import { getTaskDetails } from "@/lib/experimentalDesign";

export default function TaskAIActivityPage() {
  const router = useRouter();
  const { survey, setSurvey } = useSurvey();
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Task 2 is always AI (fixed order)
  const condition = survey.experimentalCondition;
  const taskDetails = condition ? getTaskDetails(condition, 2) : null;

  // Fallback for missing condition
  const object = taskDetails?.object || "Paperclip";
  const objectLabel = taskDetails?.objectLabel || "Object B";
  const taskNumber = "2";
  const currentStep = 5;

  const handleTimerComplete = () => {
    setIsTimeUp(true);
    setIsTimerActive(false);
  };

  const handleNext = () => {
    setSurvey((prev) => ({
      ...prev,
      taskAI: {
        ...prev.taskAI,
        endTimestamp: new Date().toISOString(),
      },
    }));
    router.push("/task-ai/experience");
  };

  return (
    <div className="min-h-screen bg-apple-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Progress */}
        <div className="apple-card p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-apple-gray-600 tracking-tight">Progress</span>
            <span className="text-sm font-bold text-apple-gray-900">
              Step {currentStep + 1} of 7
            </span>
          </div>
          <div className="apple-progress-bar">
            <div
              className="apple-progress-fill"
              style={{ width: `${((currentStep + 1) / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* Timer */}
        <Timer duration={90} onComplete={handleTimerComplete} isActive={isTimerActive} />

        {/* Time up message */}
        {isTimeUp && (
          <div className="apple-error-banner text-center">
            <p className="apple-body text-red-800 font-semibold">
              ⏰ Time is up! Please submit your response now.
            </p>
          </div>
        )}

        {/* Task content */}
        <div className="apple-card p-8 sm:p-10 lg:p-12">
          <h2 className="apple-heading-3 mb-8">
            Task {taskNumber} — Uses for BRICK - Post-AI
          </h2>

          <div className="space-y-6">
            <div>
              <label htmlFor="responses" className="apple-label">
                List your ideas below (one per line):
              </label>
              <textarea
                id="responses"
                value={survey.taskAI.responseText ?? ""}
                onChange={(e) =>
                  setSurvey((prev) => ({
                    ...prev,
                    taskAI: {
                      ...prev.taskAI,
                      responseText: e.target.value,
                    },
                  }))
                }
                rows={15}
                className="apple-textarea font-mono text-sm"
                placeholder="Type or paste your ideas here...&#10;&#10;Example:&#10;- Hold papers together&#10;- Reset button on devices&#10;- Makeshift lock pick&#10;..."
              />
            </div>

            <div className="apple-success-banner">
              <p className="apple-body text-green-800">
                <strong>Reminder:</strong> You can use AI (ChatGPT, Claude, Copilot, etc.) to brainstorm, 
                expand on ideas, or generate completely new ones. Just make sure to record your final list here!
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 sm:gap-6 pb-8">
          <button
            type="button"
            onClick={() => router.push("/task-ai")}
            className="apple-button-secondary text-center min-w-[140px] sm:min-w-[180px]"
          >
            Back to Instructions
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="apple-button-primary text-center min-w-[140px] sm:min-w-[180px]"
          >
            {isTimeUp ? "Next (Time's Up)" : "Submit & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
