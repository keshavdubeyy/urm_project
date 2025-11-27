"use client";

import { useRouter } from "next/navigation";
import { useSurvey } from "@/context/SurveyContext";
import StepLayout from "@/components/StepLayout";
import LikertItem from "@/components/LikertItem";

const DEMO_POST_VALUES = {
  // Post-task DIA (slightly higher after AI exposure)
  reliesAI: 4, // Up from 3
  aiDecisions: 3, // Up from 2  
  aiGuidance: 4, // Up from 3
  trustAI: 4, // Same as pre
  aiSupport: 3, // Up from 2
  confidenceAI: 4, // Same as pre
  dependsAI: 3, // Up from 2
  
  // Mood (slightly more positive after successful AI task)
  alertness: 4, // Up from 3
  calmness: 4, // Same
  contentedness: 4, // Up from 3
  energeticness: 4, // Up from 3
  refreshed: 4, // Same
  relaxed: 4, // Same
  satisfied: 4, // Up from 3
  tranquil: 4 // Same
};

export default function DemoPostStudyPage() {
  const router = useRouter();
  const { survey, setSurvey } = useSurvey();

  const handleDIAChange = (question: string, value: number) => {
    setSurvey(prev => ({
      ...prev,
      postTask: {
        ...prev.postTask,
        dia: { ...prev.postTask?.dia, [question]: value }
      }
    }));
  };

  const handleMoodChange = (question: string, value: number) => {
    setSurvey(prev => ({
      ...prev,
      postTask: {
        ...prev.postTask,
        mood: { ...prev.postTask?.mood, [question]: value }
      }
    }));
  };

  const handleNext = () => {
    router.push("/demo-survey/thank-you");
  };

  const handleBack = () => {
    router.push("/demo-survey/task-ai/experience");
  };

  // Initialize with demo values
  if (!survey.postTask?.dia?.reliesAI) {
    Object.entries(DEMO_POST_VALUES).forEach(([key, value]) => {
      if (['reliesAI', 'aiDecisions', 'aiGuidance', 'trustAI', 'aiSupport', 'confidenceAI', 'dependsAI'].includes(key)) {
        handleDIAChange(key, value);
      } else {
        handleMoodChange(key, value);
      }
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
        title="Post-Study Questionnaires"
        subtitle="Final questions about your current state after completing both tasks"
        currentStep={8}
        totalSteps={8}
        onNext={handleNext}
        onBack={handleBack}
        showBack
      >
        <div className="space-y-12">
          {/* Demo Info */}
          <div className="bg-orange-50 border border-orange-300 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <p className="font-bold text-orange-900">Post-Study Demo Responses</p>
                <p className="text-orange-800 text-sm">
                  These ratings show typical changes after AI exposure: slight increases in 
                  AI dependence attitudes and improved mood from successful task completion.
                </p>
              </div>
            </div>
          </div>

          {/* Dependence on AI (Post) */}
          <div className="apple-card p-8">
            <h3 className="apple-heading-3 mb-2">Dependence on AI - After Tasks</h3>
            <p className="apple-body text-apple-gray-600 mb-8">
              Now that you've completed both tasks, please rate how much you agree with each statement:
            </p>
            
            <div className="space-y-8">
              <LikertItem
                question="I rely on AI to help me with my work and daily tasks"
                value={survey.postTask?.dia?.reliesAI || DEMO_POST_VALUES.reliesAI}
                onChange={(value) => handleDIAChange('reliesAI', value)}
                leftLabel="Strongly Disagree"
                rightLabel="Strongly Agree"
              />
              
              <LikertItem
                question="I turn to AI to help me make decisions"
                value={survey.postTask?.dia?.aiDecisions || DEMO_POST_VALUES.aiDecisions}
                onChange={(value) => handleDIAChange('aiDecisions', value)}
                leftLabel="Strongly Disagree"
                rightLabel="Strongly Agree"
              />
              
              <LikertItem
                question="I look to AI for guidance when I'm unsure about something"
                value={survey.postTask?.dia?.aiGuidance || DEMO_POST_VALUES.aiGuidance}
                onChange={(value) => handleDIAChange('aiGuidance', value)}
                leftLabel="Strongly Disagree"
                rightLabel="Strongly Agree"
              />
              
              <LikertItem
                question="I trust AI to provide me with accurate information and advice"
                value={survey.postTask?.dia?.trustAI || DEMO_POST_VALUES.trustAI}
                onChange={(value) => handleDIAChange('trustAI', value)}
                leftLabel="Strongly Disagree"
                rightLabel="Strongly Agree"
              />
              
              <LikertItem
                question="I find AI to be a valuable source of support and assistance"
                value={survey.postTask?.dia?.aiSupport || DEMO_POST_VALUES.aiSupport}
                onChange={(value) => handleDIAChange('aiSupport', value)}
                leftLabel="Strongly Disagree"
                rightLabel="Strongly Agree"
              />
              
              <LikertItem
                question="I feel confident in my ability to use AI effectively"
                value={survey.postTask?.dia?.confidenceAI || DEMO_POST_VALUES.confidenceAI}
                onChange={(value) => handleDIAChange('confidenceAI', value)}
                leftLabel="Strongly Disagree"
                rightLabel="Strongly Agree"
              />
              
              <LikertItem
                question="I depend on AI to help me accomplish my goals"
                value={survey.postTask?.dia?.dependsAI || DEMO_POST_VALUES.dependsAI}
                onChange={(value) => handleDIAChange('dependsAI', value)}
                leftLabel="Strongly Disagree"
                rightLabel="Strongly Agree"
              />
            </div>
          </div>

          {/* Mood Scale (Post) */}
          <div className="apple-card p-8">
            <h3 className="apple-heading-3 mb-2">Current Mood - After Tasks</h3>
            <p className="apple-body text-apple-gray-600 mb-8">
              How do you feel right now, after completing both tasks?
            </p>
            
            <div className="space-y-8">
              <LikertItem
                question="Alert"
                value={survey.postTask?.mood?.alertness || DEMO_POST_VALUES.alertness}
                onChange={(value) => handleMoodChange('alertness', value)}
                leftLabel="Not at all"
                rightLabel="Extremely"
              />
              
              <LikertItem
                question="Calm"
                value={survey.postTask?.mood?.calmness || DEMO_POST_VALUES.calmness}
                onChange={(value) => handleMoodChange('calmness', value)}
                leftLabel="Not at all"
                rightLabel="Extremely"
              />
              
              <LikertItem
                question="Content"
                value={survey.postTask?.mood?.contentedness || DEMO_POST_VALUES.contentedness}
                onChange={(value) => handleMoodChange('contentedness', value)}
                leftLabel="Not at all"
                rightLabel="Extremely"
              />
              
              <LikertItem
                question="Energetic"
                value={survey.postTask?.mood?.energeticness || DEMO_POST_VALUES.energeticness}
                onChange={(value) => handleMoodChange('energeticness', value)}
                leftLabel="Not at all"
                rightLabel="Extremely"
              />
              
              <LikertItem
                question="Refreshed"
                value={survey.postTask?.mood?.refreshed || DEMO_POST_VALUES.refreshed}
                onChange={(value) => handleMoodChange('refreshed', value)}
                leftLabel="Not at all"
                rightLabel="Extremely"
              />
              
              <LikertItem
                question="Relaxed"
                value={survey.postTask?.mood?.relaxed || DEMO_POST_VALUES.relaxed}
                onChange={(value) => handleMoodChange('relaxed', value)}
                leftLabel="Not at all"
                rightLabel="Extremely"
              />
              
              <LikertItem
                question="Satisfied"
                value={survey.postTask?.mood?.satisfied || DEMO_POST_VALUES.satisfied}
                onChange={(value) => handleMoodChange('satisfied', value)}
                leftLabel="Not at all"
                rightLabel="Extremely"
              />
              
              <LikertItem
                question="Tranquil"
                value={survey.postTask?.mood?.tranquil || DEMO_POST_VALUES.tranquil}
                onChange={(value) => handleMoodChange('tranquil', value)}
                leftLabel="Not at all"
                rightLabel="Extremely"
              />
            </div>
          </div>

          {/* Change Indicator */}
          <div className="apple-card p-6 bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-4">
              <div className="text-3xl">📈</div>
              <div>
                <h4 className="font-bold text-blue-900 mb-2">Expected Changes</h4>
                <div className="text-blue-800 text-sm space-y-1">
                  <p>• <strong>AI Dependence:</strong> Typically increases slightly after AI exposure</p>
                  <p>• <strong>Mood:</strong> Often improves after successful task completion</p>
                  <p>• <strong>These changes</strong> contribute to the AI Dependence Score calculation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StepLayout>
    </>
  );
}