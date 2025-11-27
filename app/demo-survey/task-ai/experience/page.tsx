"use client";

import { useRouter } from "next/navigation";
import { useSurvey } from "@/context/SurveyContext";
import StepLayout from "@/components/StepLayout";
import TlxItem from "@/components/TlxItem";
import LikertItem from "@/components/LikertItem";
import RadioGroup from "@/components/RadioGroup";

const DEMO_TLX_VALUES = {
  mentalDemand: 8, // Lower mental effort with AI
  physicalDemand: 3, // Still low physical effort  
  temporalDemand: 10, // Less time pressure with AI help
  performance: 18, // Much better performance
  effort: 7, // Less effort required with AI
  frustration: 3 // Much less frustration
};

const DEMO_EXPERIENCE_VALUES = {
  taskDifficulty: 2, // Much easier with AI
  taskEngagement: 5, // Still very engaged
  taskEnjoyment: 5, // Really enjoyed it with AI
  taskMotivation: 5, // Highly motivated
  taskConfidence: 5, // Very confident with AI help
  taskSatisfaction: 5 // Very satisfied with AI-assisted performance
};

const DEMO_AI_USAGE = {
  aiUsed: "yes",
  aiTools: ["ChatGPT", "Claude"],
  aiHelpfulness: 5,
  aiFrequency: 4,
  aiSatisfaction: 5,
  aiDependence: 4,
  aiTrust: 4
};

export default function DemoTaskAIExperiencePage() {
  const router = useRouter();
  const { survey, setSurvey } = useSurvey();

  // Auto-fill demo values
  const handleTlxChange = (dimension: string, value: number) => {
    setSurvey(prev => ({
      ...prev,
      taskAI: {
        ...prev.taskAI,
        tlx: { ...prev.taskAI?.tlx, [dimension]: value }
      }
    }));
  };

  const handleExperienceChange = (question: string, value: number) => {
    setSurvey(prev => ({
      ...prev,
      taskAI: {
        ...prev.taskAI,
        experience: { ...prev.taskAI?.experience, [question]: value }
      }
    }));
  };

  const handleAIUsageChange = (field: string, value: any) => {
    setSurvey(prev => ({
      ...prev,
      taskAI: {
        ...prev.taskAI,
        aiUsage: { ...prev.taskAI?.aiUsage, [field]: value }
      }
    }));
  };

  const handleNext = () => {
    router.push("/demo-survey/post-study");
  };

  const handleBack = () => {
    router.push("/demo-survey/task-ai/activity");
  };

  // Initialize with demo values
  if (!survey.taskAI?.tlx?.mentalDemand) {
    Object.entries(DEMO_TLX_VALUES).forEach(([key, value]) => {
      handleTlxChange(key, value);
    });
  }

  if (!survey.taskAI?.experience?.taskDifficulty) {
    Object.entries(DEMO_EXPERIENCE_VALUES).forEach(([key, value]) => {
      handleExperienceChange(key, value);
    });
  }

  if (!survey.taskAI?.aiUsage?.aiUsed) {
    Object.entries(DEMO_AI_USAGE).forEach(([key, value]) => {
      handleAIUsageChange(key, value);
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
        title="Task B: Experience Evaluation"
        subtitle="Rate your experience with the AI-assisted creative writing task"
        currentStep={7}
        totalSteps={8}
        onNext={handleNext}
        onBack={handleBack}
        showBack
      >
        <div className="space-y-12">
          {/* Demo Info */}
          <div className="bg-orange-50 border border-orange-300 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <p className="font-bold text-orange-900">AI Task Demo Responses</p>
                <p className="text-orange-800 text-sm">
                  These ratings show how AI assistance typically improves task experience 
                  (lower mental demand, higher performance, greater satisfaction).
                </p>
              </div>
            </div>
          </div>

          {/* NASA-TLX Section */}
          <div className="apple-card p-8">
            <h3 className="apple-heading-3 mb-2">NASA Task Load Index (TLX)</h3>
            <p className="apple-body text-apple-gray-600 mb-8">
              Rate the different aspects of your experience during the AI-assisted task:
            </p>
            
            <div className="space-y-8">
              <TlxItem
                dimension="mentalDemand"
                label="Mental Demand"
                description="How mentally demanding was the task?"
                lowAnchor="Very Low"
                highAnchor="Very High"
                value={survey.taskAI?.tlx?.mentalDemand || DEMO_TLX_VALUES.mentalDemand}
                onChange={handleTlxChange}
              />
              
              <TlxItem
                dimension="physicalDemand"
                label="Physical Demand"
                description="How physically demanding was the task?"
                lowAnchor="Very Low"
                highAnchor="Very High"
                value={survey.taskAI?.tlx?.physicalDemand || DEMO_TLX_VALUES.physicalDemand}
                onChange={handleTlxChange}
              />
              
              <TlxItem
                dimension="temporalDemand"
                label="Temporal Demand"
                description="How hurried or rushed was the pace of the task?"
                lowAnchor="Very Low"
                highAnchor="Very High"
                value={survey.taskAI?.tlx?.temporalDemand || DEMO_TLX_VALUES.temporalDemand}
                onChange={handleTlxChange}
              />
              
              <TlxItem
                dimension="performance"
                label="Performance"
                description="How successful were you in accomplishing what you were asked to do?"
                lowAnchor="Perfect"
                highAnchor="Failure"
                value={survey.taskAI?.tlx?.performance || DEMO_TLX_VALUES.performance}
                onChange={handleTlxChange}
              />
              
              <TlxItem
                dimension="effort"
                label="Effort"
                description="How hard did you have to work to accomplish your level of performance?"
                lowAnchor="Very Low"
                highAnchor="Very High"
                value={survey.taskAI?.tlx?.effort || DEMO_TLX_VALUES.effort}
                onChange={handleTlxChange}
              />
              
              <TlxItem
                dimension="frustration"
                label="Frustration"
                description="How insecure, discouraged, irritated, stressed, and annoyed were you?"
                lowAnchor="Very Low"
                highAnchor="Very High"
                value={survey.taskAI?.tlx?.frustration || DEMO_TLX_VALUES.frustration}
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
                value={survey.taskAI?.experience?.taskDifficulty || DEMO_EXPERIENCE_VALUES.taskDifficulty}
                onChange={(value) => handleExperienceChange('taskDifficulty', value)}
                leftLabel="Very Easy"
                rightLabel="Very Difficult"
              />
              
              <LikertItem
                question="How engaged were you with this task?"
                value={survey.taskAI?.experience?.taskEngagement || DEMO_EXPERIENCE_VALUES.taskEngagement}
                onChange={(value) => handleExperienceChange('taskEngagement', value)}
                leftLabel="Not Engaged"
                rightLabel="Very Engaged"
              />
              
              <LikertItem
                question="How much did you enjoy this task?"
                value={survey.taskAI?.experience?.taskEnjoyment || DEMO_EXPERIENCE_VALUES.taskEnjoyment}
                onChange={(value) => handleExperienceChange('taskEnjoyment', value)}
                leftLabel="Didn't Enjoy"
                rightLabel="Enjoyed Very Much"
              />
              
              <LikertItem
                question="How motivated were you to perform well on this task?"
                value={survey.taskAI?.experience?.taskMotivation || DEMO_EXPERIENCE_VALUES.taskMotivation}
                onChange={(value) => handleExperienceChange('taskMotivation', value)}
                leftLabel="Not Motivated"
                rightLabel="Very Motivated"
              />
              
              <LikertItem
                question="How confident were you in your ability to complete this task?"
                value={survey.taskAI?.experience?.taskConfidence || DEMO_EXPERIENCE_VALUES.taskConfidence}
                onChange={(value) => handleExperienceChange('taskConfidence', value)}
                leftLabel="Not Confident"
                rightLabel="Very Confident"
              />
              
              <LikertItem
                question="How satisfied are you with your performance on this task?"
                value={survey.taskAI?.experience?.taskSatisfaction || DEMO_EXPERIENCE_VALUES.taskSatisfaction}
                onChange={(value) => handleExperienceChange('taskSatisfaction', value)}
                leftLabel="Not Satisfied"
                rightLabel="Very Satisfied"
              />
            </div>
          </div>

          {/* AI Usage Questions */}
          <div className="apple-card p-8">
            <h3 className="apple-heading-3 mb-8">AI Usage Evaluation</h3>
            
            <div className="space-y-8">
              <div>
                <RadioGroup
                  question="Did you use AI assistance during this task?"
                  options={[
                    { value: "yes", label: "Yes, I used AI assistance" },
                    { value: "no", label: "No, I did not use AI assistance" }
                  ]}
                  value={survey.taskAI?.aiUsage?.aiUsed || DEMO_AI_USAGE.aiUsed}
                  onChange={(value) => handleAIUsageChange('aiUsed', value)}
                />
              </div>

              {survey.taskAI?.aiUsage?.aiUsed === 'yes' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Which AI tools did you use? (Check all that apply)
                    </label>
                    <div className="space-y-2">
                      {['ChatGPT', 'Claude', 'Copilot', 'Gemini', 'Other'].map(tool => (
                        <label key={tool} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={(survey.taskAI?.aiUsage?.aiTools || DEMO_AI_USAGE.aiTools).includes(tool)}
                            onChange={(e) => {
                              const currentTools = survey.taskAI?.aiUsage?.aiTools || DEMO_AI_USAGE.aiTools;
                              const newTools = e.target.checked 
                                ? [...currentTools, tool]
                                : currentTools.filter(t => t !== tool);
                              handleAIUsageChange('aiTools', newTools);
                            }}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">{tool}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <LikertItem
                    question="How helpful was AI assistance for this task?"
                    value={survey.taskAI?.aiUsage?.aiHelpfulness || DEMO_AI_USAGE.aiHelpfulness}
                    onChange={(value) => handleAIUsageChange('aiHelpfulness', value)}
                    leftLabel="Not Helpful"
                    rightLabel="Extremely Helpful"
                  />

                  <LikertItem
                    question="How frequently did you interact with AI during the task?"
                    value={survey.taskAI?.aiUsage?.aiFrequency || DEMO_AI_USAGE.aiFrequency}
                    onChange={(value) => handleAIUsageChange('aiFrequency', value)}
                    leftLabel="Rarely"
                    rightLabel="Very Frequently"
                  />

                  <LikertItem
                    question="How satisfied were you with the AI's responses?"
                    value={survey.taskAI?.aiUsage?.aiSatisfaction || DEMO_AI_USAGE.aiSatisfaction}
                    onChange={(value) => handleAIUsageChange('aiSatisfaction', value)}
                    leftLabel="Very Dissatisfied"
                    rightLabel="Very Satisfied"
                  />

                  <LikertItem
                    question="How dependent did you feel on AI assistance?"
                    value={survey.taskAI?.aiUsage?.aiDependence || DEMO_AI_USAGE.aiDependence}
                    onChange={(value) => handleAIUsageChange('aiDependence', value)}
                    leftLabel="Not Dependent"
                    rightLabel="Very Dependent"
                  />

                  <LikertItem
                    question="How much did you trust the AI's suggestions?"
                    value={survey.taskAI?.aiUsage?.aiTrust || DEMO_AI_USAGE.aiTrust}
                    onChange={(value) => handleAIUsageChange('aiTrust', value)}
                    leftLabel="No Trust"
                    rightLabel="Complete Trust"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </StepLayout>
    </>
  );
}