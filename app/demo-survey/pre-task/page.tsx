"use client";

import { useRouter } from "next/navigation";
import { useSurvey } from "@/context/SurveyContext";
import StepLayout from "@/components/StepLayout";
import LikertItem from "@/components/LikertItem";

export default function DemoPreTaskPage() {
  const router = useRouter();
  const { survey, setSurvey } = useSurvey();

  const handleNext = () => {
    router.push("/demo-survey/task-no-ai");
  };

  const handleBack = () => {
    router.push("/demo-survey/demographics");
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
        title="Pre-Task Questionnaires"
        subtitle="How you typically relate to AI and handle challenges"
        currentStep={2}
        totalSteps={8}
        onNext={handleNext}
        onBack={handleBack}
        showBack
      >
        <div className="space-y-12">
          {/* AI Dependence Scale */}
          <div className="apple-card bg-apple-gray-50 p-8 space-y-6">
            <div>
              <h3 className="apple-heading-4 mb-3">Your Relationship with AI</h3>
              <p className="apple-caption mb-6">
                Please rate how much you agree with each statement about AI in general.
              </p>
            </div>

            <div className="space-y-6">
              <LikertItem
                label="Without AI, I would feel unprotected from making mistakes."
                minLabel="Strongly disagree"
                maxLabel="Strongly agree"
                value={survey.diaPre?.unprotected || 3}
                onChange={(value) =>
                  setSurvey((prev) => ({
                    ...prev,
                    diaPre: { ...prev.diaPre, unprotected: value },
                  }))
                }
              />

              <LikertItem
                label="Without AI, I would be left behind by others."
                minLabel="Strongly disagree"
                maxLabel="Strongly agree"
                value={survey.diaPre?.leftBehind || 2}
                onChange={(value) =>
                  setSurvey((prev) => ({
                    ...prev,
                    diaPre: { ...prev.diaPre, leftBehind: value },
                  }))
                }
              />

              <LikertItem
                label="I need to stay updated with AI to keep up with others."
                minLabel="Strongly disagree"
                maxLabel="Strongly agree"
                value={survey.diaPre?.stayUpdated || 4}
                onChange={(value) =>
                  setSurvey((prev) => ({
                    ...prev,
                    diaPre: { ...prev.diaPre, stayUpdated: value },
                  }))
                }
              />

              <LikertItem
                label="I need AI to validate my ideas before I can trust them."
                minLabel="Strongly disagree"
                maxLabel="Strongly agree"
                value={survey.diaPre?.needValidation || 3}
                onChange={(value) =>
                  setSurvey((prev) => ({
                    ...prev,
                    diaPre: { ...prev.diaPre, needValidation: value },
                  }))
                }
              />

              <LikertItem
                label="I fear that AI will replace me in my work or studies."
                minLabel="Strongly disagree"
                maxLabel="Strongly agree"
                value={survey.diaPre?.fearReplacement || 2}
                onChange={(value) =>
                  setSurvey((prev) => ({
                    ...prev,
                    diaPre: { ...prev.diaPre, fearReplacement: value },
                  }))
                }
              />
            </div>
          </div>

          {/* Self-Efficacy Scale */}
          <div className="apple-card bg-apple-gray-50 p-8 space-y-6">
            <div>
              <h3 className="apple-heading-4 mb-3">How You Usually Handle Problems</h3>
              <p className="apple-caption mb-6">
                Please rate how true each statement is for you.
              </p>
            </div>

            <div className="space-y-6">
              <LikertItem
                label="I can always manage to solve difficult problems if I try hard enough."
                minLabel="Not at all true"
                maxLabel="Exactly true"
                value={survey.gse?.solveDifficult || 3}
                onChange={(value) =>
                  setSurvey((prev) => ({
                    ...prev,
                    gse: { ...prev.gse, solveDifficult: value },
                  }))
                }
              />

              <LikertItem
                label="I am confident that I could deal efficiently with unexpected events."
                minLabel="Not at all true"
                maxLabel="Exactly true"
                value={survey.gse?.dealUnexpected || 4}
                onChange={(value) =>
                  setSurvey((prev) => ({
                    ...prev,
                    gse: { ...prev.gse, dealUnexpected: value },
                  }))
                }
              />

              <LikertItem
                label="Thanks to my resourcefulness, I know how to handle unforeseen situations."
                minLabel="Not at all true"
                maxLabel="Exactly true"
                value={survey.gse?.handleUnforeseen || 3}
                onChange={(value) =>
                  setSurvey((prev) => ({
                    ...prev,
                    gse: { ...prev.gse, handleUnforeseen: value },
                  }))
                }
              />

              <LikertItem
                label="When I am confronted with a problem, I can usually find several solutions."
                minLabel="Not at all true"
                maxLabel="Exactly true"
                value={survey.gse?.severalSolutions || 4}
                onChange={(value) =>
                  setSurvey((prev) => ({
                    ...prev,
                    gse: { ...prev.gse, severalSolutions: value },
                  }))
                }
              />
            </div>
          </div>

          {/* Mood Scale */}
          <div className="apple-card bg-apple-gray-50 p-8 space-y-6">
            <div>
              <h3 className="apple-heading-4 mb-3">How You Feel Right Now</h3>
              <p className="apple-caption mb-6">
                Please rate how you feel at this moment.
              </p>
            </div>

            <div className="space-y-6">
              <LikertItem
                label="Tense"
                minLabel="Not at all"
                maxLabel="Extremely"
                value={survey.moodPre?.tense || 2}
                onChange={(value) =>
                  setSurvey((prev) => ({
                    ...prev,
                    moodPre: { ...prev.moodPre, tense: value },
                  }))
                }
              />

              <LikertItem
                label="Fatigued"
                minLabel="Not at all"
                maxLabel="Extremely"
                value={survey.moodPre?.fatigued || 3}
                onChange={(value) =>
                  setSurvey((prev) => ({
                    ...prev,
                    moodPre: { ...prev.moodPre, fatigued: value },
                  }))
                }
              />

              <LikertItem
                label="Anxious"
                minLabel="Not at all"
                maxLabel="Extremely"
                value={survey.moodPre?.anxious || 2}
                onChange={(value) =>
                  setSurvey((prev) => ({
                    ...prev,
                    moodPre: { ...prev.moodPre, anxious: value },
                  }))
                }
              />

              <LikertItem
                label="Vigorous"
                minLabel="Not at all"
                maxLabel="Extremely"
                value={survey.moodPre?.vigorous || 4}
                onChange={(value) =>
                  setSurvey((prev) => ({
                    ...prev,
                    moodPre: { ...prev.moodPre, vigorous: value },
                  }))
                }
              />

              <LikertItem
                label="Confident"
                minLabel="Not at all"
                maxLabel="Extremely"
                value={survey.moodPre?.confident || 4}
                onChange={(value) =>
                  setSurvey((prev) => ({
                    ...prev,
                    moodPre: { ...prev.moodPre, confident: value },
                  }))
                }
              />
            </div>
          </div>
        </div>
      </StepLayout>
    </>
  );
}