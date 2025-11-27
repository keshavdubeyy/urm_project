"use client";

import { useRouter } from "next/navigation";
import { useSurvey } from "@/context/SurveyContext";
import StepLayout from "@/components/StepLayout";
import TlxItem from "@/components/TlxItem";
import LikertItem from "@/components/LikertItem";

const DEMO_TLX_VALUES = {
  mentalDemand: 14, // High mental effort
  physicalDemand: 3, // Low physical effort  
  temporalDemand: 17, // High time pressure
  performance: 12, // Good performance
  effort: 15, // High effort required
  frustration: 8 // Moderate frustration
};

const DEMO_EXPERIENCE_VALUES = {
  taskDifficulty: 4, // Somewhat difficult
  taskEngagement: 5, // Very engaged
  taskEnjoyment: 4, // Enjoyed it
  taskMotivation: 4, // Well motivated
  taskConfidence: 3, // Somewhat confident
  taskSatisfaction: 4 // Satisfied with performance
};

export default function DemoTaskNoAIExperiencePage() {
  const router = useRouter();
  const { survey, setSurvey } = useSurvey();

  // Auto-fill demo values
  const handleTlxChange = (dimension: string, value: number) => {
    setSurvey(prev => ({
      ...prev,
      taskNoAI: {
        ...prev.taskNoAI,
        tlx: { ...prev.taskNoAI?.tlx, [dimension]: value }
      }
    }));
  };

  const handleExperienceChange = (question: string, value: number) => {
    setSurvey(prev => ({
      ...prev,
      taskNoAI: {
        ...prev.taskNoAI,
        experience: { ...prev.taskNoAI?.experience, [question]: value }
      }
    }));
  };

  const handleNext = () => {
    router.push("/demo-survey/task-ai");
  };

  const handleBack = () => {
    router.push("/demo-survey/task-no-ai/activity");
  };

  // Initialize with demo values
  if (!survey.taskNoAI?.tlx?.mentalDemand) {
    Object.entries(DEMO_TLX_VALUES).forEach(([key, value]) => {
      handleTlxChange(key, value);
    });
  }

  if (!survey.taskNoAI?.experience?.taskDifficulty) {
    Object.entries(DEMO_EXPERIENCE_VALUES).forEach(([key, value]) => {
      handleExperienceChange(key, value);
    });
  }

  return (
    <>
      {/* Demo Banner */}
      <div className="bg-orange-500 text-white py-2 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-bold">🎭 Demo Version – For Presentation Only</span>
        </div>
      </div>

      <StepLayout
        title="Task A: Experience Evaluation"
        subtitle="Rate your experience with the creative writing task (without AI assistance)"
        currentStep={4}
        totalSteps={8}
        onNext={handleNext}
        onBack={handleBack}
        showBack
      >
        <div className="space-y-12">
          {/* Demo Info */}
          <div className="bg-orange-50 border border-orange-300 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎭</span>
              <div>
                <p className="font-bold text-orange-900">Pre-filled Demo Responses</p>
                <p className="text-orange-800 text-sm">
                  These ratings simulate a participant's experience after completing 
                  the creative writing task without AI assistance.
                </p>
              </div>
            </div>
          </div>

          {/* NASA-TLX Section */}
          <div className="apple-card p-8">
            <h3 className="apple-heading-3 mb-2">NASA Task Load Index (TLX)</h3>
            <p className="apple-body text-apple-gray-600 mb-8">
              Rate the different aspects of your experience during the task:
            </p>
            
            <div className="space-y-8">
              <TlxItem
                dimension="mentalDemand"
                label="Mental Demand"
                description="How mentally demanding was the task?"
                lowAnchor="Very Low"
                highAnchor="Very High"
                value={survey.taskNoAI?.tlx?.mentalDemand || DEMO_TLX_VALUES.mentalDemand}
                onChange={handleTlxChange}
              />
              
              <TlxItem
                dimension="physicalDemand"
                label="Physical Demand"
                description="How physically demanding was the task?"
                lowAnchor="Very Low"
                highAnchor="Very High"
                value={survey.taskNoAI?.tlx?.physicalDemand || DEMO_TLX_VALUES.physicalDemand}
                onChange={handleTlxChange}
              />
              
              <TlxItem
                dimension="temporalDemand"
                label="Temporal Demand"
                description="How hurried or rushed was the pace of the task?"
                lowAnchor="Very Low"
                highAnchor="Very High"
                value={survey.taskNoAI?.tlx?.temporalDemand || DEMO_TLX_VALUES.temporalDemand}
                onChange={handleTlxChange}
              />
              
              <TlxItem
                dimension="performance"
                label="Performance"
                description="How successful were you in accomplishing what you were asked to do?"
                lowAnchor="Perfect"
                highAnchor="Failure"
                value={survey.taskNoAI?.tlx?.performance || DEMO_TLX_VALUES.performance}
                onChange={handleTlxChange}
              />
              
              <TlxItem
                dimension="effort"
                label="Effort"
                description="How hard did you have to work to accomplish your level of performance?"
                lowAnchor="Very Low"
                highAnchor="Very High"
                value={survey.taskNoAI?.tlx?.effort || DEMO_TLX_VALUES.effort}
                onChange={handleTlxChange}
              />
              
              <TlxItem
                dimension="frustration"
                label="Frustration"
                description="How insecure, discouraged, irritated, stressed, and annoyed were you?"
                lowAnchor="Very Low"
                highAnchor="Very High"
                value={survey.taskNoAI?.tlx?.frustration || DEMO_TLX_VALUES.frustration}
                onChange={handleTlxChange}
              />
            </div>
          </div>

          {/* Experience Questions */}
          <div className="apple-card p-8">
            <h3 className="apple-heading-3 mb-8">Task Experience</h3>
            
            <div className="space-y-8">
              <LikertItem
                question="How difficult was this task for you?"
                value={survey.taskNoAI?.experience?.taskDifficulty || DEMO_EXPERIENCE_VALUES.taskDifficulty}
                onChange={(value) => handleExperienceChange('taskDifficulty', value)}
                leftLabel="Very Easy"
                rightLabel="Very Difficult"
              />
              
              <LikertItem
                question="How engaged were you with this task?"
                value={survey.taskNoAI?.experience?.taskEngagement || DEMO_EXPERIENCE_VALUES.taskEngagement}
                onChange={(value) => handleExperienceChange('taskEngagement', value)}
                leftLabel="Not Engaged"
                rightLabel="Very Engaged"
              />
              
              <LikertItem
                question="How much did you enjoy this task?"
                value={survey.taskNoAI?.experience?.taskEnjoyment || DEMO_EXPERIENCE_VALUES.taskEnjoyment}
                onChange={(value) => handleExperienceChange('taskEnjoyment', value)}
                leftLabel="Didn't Enjoy"
                rightLabel="Enjoyed Very Much"
              />
              
              <LikertItem
                question="How motivated were you to perform well on this task?"
                value={survey.taskNoAI?.experience?.taskMotivation || DEMO_EXPERIENCE_VALUES.taskMotivation}
                onChange={(value) => handleExperienceChange('taskMotivation', value)}
                leftLabel="Not Motivated"
                rightLabel="Very Motivated"
              />
              
              <LikertItem
                question="How confident were you in your ability to complete this task?"
                value={survey.taskNoAI?.experience?.taskConfidence || DEMO_EXPERIENCE_VALUES.taskConfidence}
                onChange={(value) => handleExperienceChange('taskConfidence', value)}
                leftLabel="Not Confident"
                rightLabel="Very Confident"
              />
              
              <LikertItem
                question="How satisfied are you with your performance on this task?"
                value={survey.taskNoAI?.experience?.taskSatisfaction || DEMO_EXPERIENCE_VALUES.taskSatisfaction}
                onChange={(value) => handleExperienceChange('taskSatisfaction', value)}
                leftLabel="Not Satisfied"
                rightLabel="Very Satisfied"
              />
            </div>
          </div>
        </div>
      </StepLayout>
    </>
  );
}