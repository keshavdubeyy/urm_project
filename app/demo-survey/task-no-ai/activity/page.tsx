"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSurvey } from "@/context/SurveyContext";
import StepLayout from "@/components/StepLayout";
import TextArea from "@/components/TextArea";
import Timer from "@/components/Timer";

const DEMO_RESPONSE = `1. Create a community garden where neighbors can grow vegetables together
2. Start a neighborhood tool-sharing library
3. Organize monthly block parties with potluck dinners
4. Set up a local skills exchange program
5. Create a neighborhood walking group for fitness and socializing
6. Establish a community bulletin board for announcements
7. Start a neighborhood book club that meets in different homes
8. Organize seasonal decoration contests
9. Create a local childcare co-op for working parents
10. Set up outdoor movie nights in a common area`;

export default function DemoTaskNoAIActivityPage() {
  const router = useRouter();
  const { survey, setSurvey } = useSurvey();
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showDemo, setShowDemo] = useState(true);

  const handleStart = () => {
    setShowDemo(false);
    setIsActive(true);
    // Auto-fill the response immediately in demo mode
    setSurvey(prev => ({
      ...prev,
      taskNoAI: {
        ...prev.taskNoAI,
        responseText: DEMO_RESPONSE
      }
    }));
    // Auto-complete after 3 seconds for demo
    setTimeout(() => {
      setIsActive(false);
      setIsComplete(true);
    }, 3000);
  };

  const handleNext = () => {
    router.push("/demo-survey/task-no-ai/experience");
  };

  const handleBack = () => {
    router.push("/demo-survey/task-no-ai");
  };

  if (showDemo) {
    return (
      <>
        {/* Demo Banner */}
        <div className="bg-orange-500 text-white py-2 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="font-bold">🎭 Demo Version – For Presentation Only</span>
          </div>
        </div>

        <StepLayout
          title="Task A: Creative Writing (No AI)"
          subtitle="Ready to start the 3-minute writing task"
          currentStep={3}
          totalSteps={8}
          onNext={handleStart}
          onBack={handleBack}
          showBack
          nextLabel="Start Demo Task"
        >
          <div className="space-y-8">
            <div className="apple-card p-8 text-center space-y-6">
              <div className="text-6xl mb-4">⏱️</div>
              <h3 className="apple-heading-3">Ready to Begin?</h3>
              <p className="apple-body text-apple-gray-600 max-w-md mx-auto">
                Click "Start Demo Task" to see how the 3-minute creative writing task works. 
                The response will be automatically filled with sample data.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="font-bold text-blue-900 mb-2">Your prompt:</p>
                <p className="text-lg text-blue-800">
                  "Ways to build a stronger sense of community in your neighborhood"
                </p>
              </div>
            </div>
          </div>
        </StepLayout>
      </>
    );
  }

  return (
    <>
      {/* Demo Banner */}
      <div className="bg-orange-500 text-white py-2 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-bold">🎭 Demo Version – For Presentation Only</span>
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="apple-card p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="apple-heading-2 mb-2">Task A: Creative Writing (No AI)</h1>
              <p className="apple-body text-apple-gray-600">
                Generate ideas for: "Ways to build a stronger sense of community in your neighborhood"
              </p>
            </div>

            {/* Timer */}
            <div className="mb-8">
              <Timer 
                initialTime={180}
                isActive={isActive}
                onComplete={() => {
                  setIsActive(false);
                  setIsComplete(true);
                }}
              />
            </div>

            {/* Writing Area */}
            <div className="mb-8">
              <TextArea
                label="Your Ideas"
                value={survey.taskNoAI?.responseText || DEMO_RESPONSE}
                onChange={(value) => setSurvey(prev => ({
                  ...prev,
                  taskNoAI: { ...prev.taskNoAI, responseText: value }
                }))}
                placeholder="List your ideas here..."
                rows={12}
                disabled={!isActive}
              />
            </div>

            {/* Demo Status */}
            <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-bold text-green-900">Demo Task Complete!</p>
                  <p className="text-green-800 text-sm">
                    Sample response has been automatically filled. In the real survey, 
                    participants would type their own ideas during the 3-minute timer.
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="apple-button-secondary"
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                className="apple-button-primary"
              >
                Continue to Experience Questions →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}