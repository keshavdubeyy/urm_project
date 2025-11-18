"use client";

import { useRouter } from "next/navigation";
import StepLayout from "@/components/StepLayout";
import { useSurvey } from "@/context/SurveyContext";

export default function TaskNoAIPage() {
  const router = useRouter();
  const { setSurvey } = useSurvey();

  const handleStartTask = () => {
    setSurvey((prev) => ({
      ...prev,
      taskNoAI: {
        ...prev.taskNoAI,
        startTimestamp: new Date().toISOString(),
      },
    }));
    router.push("/task-no-ai/activity");
  };

  return (
    <StepLayout
      currentStep={4}
      totalSteps={7}
      stepTitle="Task A — Uses for a PAPERCLIP (No AI)"
      backHref="/pre-task"
      showNext={false}
    >
      <div className="space-y-6">
        <div className="apple-card bg-apple-orange bg-opacity-10 border-apple-orange p-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl">📎</div>
            <div className="flex-1 space-y-4">
              <h3 className="apple-heading-4 text-apple-orange">
                Task Instructions
              </h3>
              <ul className="space-y-3 apple-body text-orange-800">
                <li className="flex items-start gap-3">
                  <span className="text-apple-orange font-bold text-lg">•</span>
                  <span>For the next <strong>1.5 minutes</strong>, list as many uses as you can for a <strong>PAPERCLIP</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-apple-orange font-bold text-lg">•</span>
                  <span><strong>Do not use AI, search engines, or external tools.</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-apple-orange font-bold text-lg">•</span>
                  <span>Focus on generating as many <strong>creative and unique ideas</strong> as possible.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-apple-orange font-bold text-lg">•</span>
                  <span>Type each idea on a new line in the text area provided.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="apple-card bg-apple-blue bg-opacity-5 border-apple-blue p-6">
          <p className="apple-body text-apple-blue">
            <strong>Note:</strong> Once you click "Start Task", the 1.5-minute timer will begin immediately. 
            Make sure you're ready before proceeding.
          </p>
        </div>

        <div className="flex justify-center pt-6">
          <button
            type="button"
            onClick={handleStartTask}
            className="apple-button-primary px-10 py-4 text-lg"
          >
            Start Task
          </button>
        </div>
      </div>
    </StepLayout>
  );
}
