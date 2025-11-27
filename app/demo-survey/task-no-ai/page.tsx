"use client";

import { useRouter } from "next/navigation";
import { useSurvey } from "@/context/SurveyContext";
import StepLayout from "@/components/StepLayout";

export default function DemoTaskNoAIPage() {
  const router = useRouter();
  const { survey } = useSurvey();

  const handleNext = () => {
    router.push("/demo-survey/task-no-ai/activity");
  };

  const handleBack = () => {
    router.push("/demo-survey/pre-task");
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
        title="Task A: Creative Writing (No AI)"
        subtitle="Instructions for the first creative task"
        currentStep={3}
        totalSteps={8}
        onNext={handleNext}
        onBack={handleBack}
        showBack
      >
        <div className="space-y-8">
          {/* Instructions */}
          <div className="apple-card p-8 space-y-6">
            <div>
              <h3 className="apple-heading-4 mb-4">📝 Your Task</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="apple-body text-blue-900 font-medium mb-3">
                  Generate as many ideas as you can for:
                </p>
                <p className="text-xl font-bold text-blue-900 mb-3">
                  "Ways to build a stronger sense of community in your neighborhood"
                </p>
                <p className="apple-caption text-blue-800">
                  Think of creative, practical, or innovative approaches that could help people 
                  connect with their neighbors and create a more cohesive community.
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h4 className="font-bold text-red-900 mb-3">🚫 Important: No AI Assistance</h4>
              <div className="space-y-2 text-red-800 text-sm">
                <p>• Do not use ChatGPT, Claude, Gemini, or any other AI tools</p>
                <p>• Do not use AI-powered writing assistants or suggestion features</p>
                <p>• Rely only on your own creativity and knowledge</p>
                <p>• Turn off or ignore any automatic AI suggestions in your browser or apps</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-3">⏱️ Time Limit</h4>
              <p className="text-gray-800">
                You will have <strong>exactly 3 minutes</strong> to generate as many ideas as possible. 
                Focus on quantity over quality – write down every idea that comes to mind!
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-bold text-green-900 mb-3">✍️ Format Tips</h4>
              <div className="space-y-2 text-green-800 text-sm">
                <p>• Write each idea on a new line or number them</p>
                <p>• Keep ideas brief but clear</p>
                <p>• Don't worry about spelling or grammar</p>
                <p>• If you get stuck, try different categories: events, spaces, activities, technology, etc.</p>
              </div>
            </div>
          </div>

          {/* Demo Note */}
          <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎭</span>
              <div>
                <h4 className="font-bold text-orange-900 mb-2">Demo Mode</h4>
                <p className="text-orange-800 text-sm">
                  In the actual survey, participants complete a real 3-minute writing task. 
                  For this demo, we'll show you pre-written sample responses that represent 
                  typical participant output.
                </p>
              </div>
            </div>
          </div>
        </div>
      </StepLayout>
    </>
  );
}