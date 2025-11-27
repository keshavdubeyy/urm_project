"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSurvey } from "@/context/SurveyContext";
import StepLayout from "@/components/StepLayout";
import TextArea from "@/components/TextArea";
import Timer from "@/components/Timer";

const DEMO_AI_RESPONSE = `1. Create a community garden where neighbors can grow vegetables together
2. Start a neighborhood tool-sharing library
3. Organize monthly block parties with potluck dinners
4. Set up a local skills exchange program (e.g., tutoring, repairs, cooking classes)
5. Create a neighborhood walking group for fitness and socializing
6. Establish a community bulletin board for announcements and connections
7. Start a neighborhood book club that rotates between different homes
8. Organize seasonal decoration contests to build friendly competition
9. Create a local childcare co-op for working parents
10. Set up outdoor movie nights in a common area or park
11. Launch a "neighbor helping neighbor" network for elderly or disabled residents
12. Create community art projects like murals or sculpture installations
13. Establish regular coffee meetups at local cafes or in homes
14. Start a neighborhood cleanup day with post-cleanup celebrations
15. Create a community social media group or newsletter
16. Organize skill-sharing workshops (home repairs, cooking, technology)
17. Set up a little free library or book exchange boxes
18. Create themed community challenges (sustainability, fitness, creativity)
19. Establish a community emergency preparedness group
20. Start intergenerational programs connecting seniors with families`;

export default function DemoTaskAIActivityPage() {
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
      taskAI: {
        ...prev.taskAI,
        responseText: DEMO_AI_RESPONSE
      }
    }));
    // Auto-complete after 3 seconds for demo
    setTimeout(() => {
      setIsActive(false);
      setIsComplete(true);
    }, 3000);
  };

  const handleNext = () => {
    router.push("/demo-survey/task-ai/experience");
  };

  const handleBack = () => {
    router.push("/demo-survey/task-ai");
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
          title="Task B: Creative Writing (WITH AI)"
          subtitle="Ready to start the 3-minute AI-assisted writing task"
          currentStep={6}
          totalSteps={8}
          onNext={handleStart}
          onBack={handleBack}
          showBack
          nextLabel="Start Demo Task"
        >
          <div className="space-y-8">
            <div className="apple-card p-8 text-center space-y-6">
              <div className="text-6xl mb-4">🤖⏱️</div>
              <h3 className="apple-heading-3">Ready for AI-Assisted Task?</h3>
              <p className="apple-body text-apple-gray-600 max-w-md mx-auto">
                Click "Start Demo Task" to see how participants would use AI assistance 
                for the same creative writing prompt. The response shows typical AI-enhanced output.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <p className="font-bold text-green-900 mb-2">Same prompt with AI help:</p>
                <p className="text-lg text-green-800">
                  "Ways to build a stronger sense of community in your neighborhood"
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>AI Tools Available:</strong> ChatGPT, Claude, Copilot, or any AI assistant
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

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="apple-card p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="apple-heading-2 mb-2 flex items-center justify-center gap-3">
                <span>🤖</span>
                Task B: Creative Writing (WITH AI)
              </h1>
              <p className="apple-body text-apple-gray-600">
                Generate ideas for: "Ways to build a stronger sense of community in your neighborhood"
              </p>
              <p className="text-sm text-green-700 mt-2">
                ✨ AI assistance enabled - Use any AI tool to help brainstorm!
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
                label="Your AI-Assisted Ideas"
                value={survey.taskAI?.responseText || DEMO_AI_RESPONSE}
                onChange={(value) => setSurvey(prev => ({
                  ...prev,
                  taskAI: { ...prev.taskAI, responseText: value }
                }))}
                placeholder="Use AI to help generate ideas..."
                rows={15}
                disabled={!isActive}
              />
            </div>

            {/* Demo Status */}
            <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-bold text-green-900">Demo AI Task Complete!</p>
                  <p className="text-green-800 text-sm">
                    Sample AI-assisted response filled (20 ideas vs. 10 without AI). 
                    Real participants would use actual AI tools during the timed session.
                  </p>
                </div>
              </div>
            </div>

            {/* AI Usage Simulation */}
            <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💭</span>
                <div>
                  <p className="font-bold text-blue-900">Simulated AI Interaction:</p>
                  <div className="text-blue-800 text-sm space-y-2 mt-2">
                    <p><em>"AI, help me brainstorm community building ideas..."</em></p>
                    <p><em>"Can you expand on skill-sharing concepts?"</em></p>
                    <p><em>"Suggest intergenerational activities..."</em></p>
                  </div>
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