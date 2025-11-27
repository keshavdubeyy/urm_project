"use client";

import { useRouter } from "next/navigation";
import StepLayout from "@/components/StepLayout";

export default function DemoTaskAIPage() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/demo-survey/task-ai/activity");
  };

  const handleBack = () => {
    router.push("/demo-survey/task-no-ai/experience");
  };

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
        subtitle="Instructions for the AI-assisted creative writing task"
        currentStep={5}
        totalSteps={8}
        onNext={handleNext}
        onBack={handleBack}
        showBack
      >
        <div className="space-y-8">
          {/* Demo Info */}
          <div className="bg-orange-50 border border-orange-300 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎭</span>
              <div>
                <p className="font-bold text-orange-900">Demo Task B - With AI Assistance</p>
                <p className="text-orange-800 text-sm">
                  This demonstrates how participants would use AI to assist with the same creative writing prompt.
                </p>
              </div>
            </div>
          </div>

          {/* Main Task Instructions */}
          <div className="apple-card p-8">
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="apple-heading-3 mb-4">Task B: Creative Writing with AI</h3>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-bold text-blue-900 mb-3">Your Prompt (Same as Task A):</h4>
                <p className="text-lg text-blue-800 mb-4">
                  "Ways to build a stronger sense of community in your neighborhood"
                </p>
                <p className="text-sm text-blue-700">
                  <strong>Time Limit:</strong> 3 minutes (same as Task A)
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-bold text-green-900 mb-3">🤖 AI Assistance Available:</h4>
                <div className="space-y-3 text-green-800">
                  <p>• You may use ANY AI assistant (ChatGPT, Claude, Copilot, etc.)</p>
                  <p>• Ask for ideas, suggestions, or help brainstorming</p>
                  <p>• Use AI to expand on your thoughts</p>
                  <p>• Get help organizing or improving your ideas</p>
                  <p>• There are no restrictions on how you use AI</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-300 rounded-lg p-6">
                <h4 className="font-bold text-amber-900 mb-3">📝 Instructions:</h4>
                <div className="space-y-3 text-amber-800">
                  <p>1. <strong>Use AI however you find helpful</strong> for this creative task</p>
                  <p>2. <strong>Generate as many ideas as possible</strong> in 3 minutes</p>
                  <p>3. <strong>Focus on quantity and creativity</strong></p>
                  <p>4. You'll be asked about your AI usage afterward</p>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="font-bold text-gray-700 mb-3">🎯 Goal:</h4>
                <p className="text-gray-700">
                  Generate creative, practical ideas for building community. Use AI to help you 
                  think of more ideas, improve existing ones, or approach the problem from new angles.
                </p>
              </div>
            </div>
          </div>

          {/* Demo Explanation */}
          <div className="apple-card p-6 bg-purple-50 border border-purple-200">
            <div className="flex items-start gap-4">
              <div className="text-3xl">ℹ️</div>
              <div>
                <h4 className="font-bold text-purple-900 mb-2">Demo Note</h4>
                <p className="text-purple-800 text-sm">
                  In the real study, participants would actually use AI tools to help with this task. 
                  The demo will show a sample response that demonstrates typical AI-assisted output.
                </p>
              </div>
            </div>
          </div>
        </div>
      </StepLayout>
    </>
  );
}