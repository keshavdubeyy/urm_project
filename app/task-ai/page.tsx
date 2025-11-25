"use client";

import { useRouter } from "next/navigation";
import StepLayout from "@/components/StepLayout";
import { useSurvey } from "@/context/SurveyContext";
import { getTaskDetails, getTaskNavigation } from "@/lib/experimentalDesign";

export default function TaskAIPage() {
  const router = useRouter();
  const { survey, setSurvey } = useSurvey();

  // Task 2 is always AI (fixed order)
  const condition = survey.experimentalCondition;
  const taskDetails = condition ? getTaskDetails(condition, 2) : null;

  // Fallback for missing condition
  const object = taskDetails?.object || "Paperclip";
  const objectLabel = taskDetails?.objectLabel || "Object B";
  const taskNumber = "2";
  const objectEmoji = object === "Paperclip" ? "📎✨" : "🧱✨";

  const handleStartTask = () => {
    setSurvey((prev) => ({
      ...prev,
      taskAI: {
        ...prev.taskAI,
        startTimestamp: new Date().toISOString(),
      },
    }));
    router.push("/task-ai/activity");
  };

  // Task 2 always goes back to Task 1 experience page (No-AI)
  const getBackHref = () => {
    return "/task-no-ai/experience";
  };

  return (
    <StepLayout
      currentStep={5}
      totalSteps={7}
      stepTitle={`Task ${taskNumber} — Uses for BRICK - Post-AI`}
      backHref={getBackHref()}
      showNext={false}
    >
      <div className="space-y-6">
        <div className="apple-success-banner">
          <div className="flex items-start gap-4">
            <div className="text-3xl">{objectEmoji}</div>
            <div className="flex-1 space-y-4">
              <h3 className="apple-heading-4 text-green-900">
                Task Instructions
              </h3>
              <ul className="space-y-3 apple-body text-green-800">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-lg">•</span>
                  <span>For the next <strong>1.5 minutes</strong>, list as many uses as you can for <strong>BRICK with AI support</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-lg">•</span>
                  <span><strong>You may use any AI assistant</strong> of your choice (ChatGPT, Claude, Copilot, Gemini, etc.).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-lg">•</span>
                  <span>You can use AI in <strong>any way you choose</strong> — for brainstorming, expanding ideas, or generating new ones.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-lg">•</span>
                  <span>Your <strong>final list must be typed</strong> in the text area provided on the next screen.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="apple-card bg-apple-blue bg-opacity-5 border-apple-blue p-6">
          <p className="apple-body text-apple-blue">
            <strong>Note:</strong> Once you click "Start Task", the 1.5-minute timer will begin immediately. 
            You can open your AI tool in another tab or window. Make sure you're ready before proceeding.
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
