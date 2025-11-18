"use client";

import StepLayout from "@/components/StepLayout";
import LikertItem from "@/components/LikertItem";
import { useSurvey } from "@/context/SurveyContext";

export default function PreTaskPage() {
  const { survey, setSurvey } = useSurvey();

  return (
    <StepLayout
      currentStep={2}
      totalSteps={7}
      stepTitle="Pre-Task Questionnaire"
      nextHref="/task-no-ai"
      backHref="/demographics"
    >
      <div className="space-y-8">
        {/* Section 1: Dependence on AI Scale (DIA-PRE) */}
        <div className="apple-card bg-apple-gray-50 p-8 space-y-6">
          <div>
            <h3 className="apple-heading-4 mb-3">
              Your Use of AI
            </h3>
            <p className="apple-caption mb-6">
              Please rate how true each statement is for you.
            </p>
          </div>

          <div className="space-y-6">
            <LikertItem
              label="I feel unprotected when I do not have access to AI."
              minLabel="Not at all true"
              maxLabel="Completely true"
              value={survey.diaPre.unprotected}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  diaPre: { ...prev.diaPre, unprotected: value },
                }))
              }
            />

            <LikertItem
              label="I'm concerned about being left behind if I do not use AI."
              minLabel="Not at all true"
              maxLabel="Completely true"
              value={survey.diaPre.leftBehind}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  diaPre: { ...prev.diaPre, leftBehind: value },
                }))
              }
            />

            <LikertItem
              label="I do everything possible to stay updated with AI to remain relevant in my field."
              minLabel="Not at all true"
              maxLabel="Completely true"
              value={survey.diaPre.stayUpdated}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  diaPre: { ...prev.diaPre, stayUpdated: value },
                }))
              }
            />

            <LikertItem
              label="I constantly need validation or feedback from AI systems to feel confident in my decisions."
              minLabel="Not at all true"
              maxLabel="Completely true"
              value={survey.diaPre.needValidation}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  diaPre: { ...prev.diaPre, needValidation: value },
                }))
              }
            />

            <LikertItem
              label="I fear that AI might replace my current skills or abilities."
              minLabel="Not at all true"
              maxLabel="Completely true"
              value={survey.diaPre.fearReplacement}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  diaPre: { ...prev.diaPre, fearReplacement: value },
                }))
              }
            />
          </div>
        </div>

        {/* Section 2: General Self-Efficacy (GSE-4) */}
        <div className="apple-card bg-apple-gray-50 p-8 space-y-6">
          <div>
            <h3 className="apple-heading-4 mb-3">
              How You Usually Handle Problems
            </h3>
            <p className="apple-caption mb-6">
              Please rate how true each statement is for you.
            </p>
          </div>

          <div className="space-y-6">
            <LikertItem
              label="I can always manage to solve difficult problems if I try hard enough."
              minLabel="Not at all true"
              maxLabel="Exactly true"
              value={survey.gse.solveDifficult}
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
              value={survey.gse.dealUnexpected}
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
              value={survey.gse.handleUnforeseen}
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
              value={survey.gse.severalSolutions}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  gse: { ...prev.gse, severalSolutions: value },
                }))
              }
            />
          </div>
        </div>

        {/* Section 3: Baseline Mood Assessment */}
        <div className="apple-card bg-apple-gray-50 p-8 space-y-6">
          <div>
            <h3 className="apple-heading-4 mb-3">
              How You Feel Right Now
            </h3>
            <p className="apple-caption mb-6">
              Please rate how you feel at this moment.
            </p>
          </div>

          <div className="space-y-6">
            <LikertItem
              label="I feel tense."
              minLabel="Not at all"
              maxLabel="Extremely"
              value={survey.moodPre.tense}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  moodPre: { ...prev.moodPre, tense: value },
                }))
              }
            />

            <LikertItem
              label="I feel fatigued."
              minLabel="Not at all"
              maxLabel="Extremely"
              value={survey.moodPre.fatigued}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  moodPre: { ...prev.moodPre, fatigued: value },
                }))
              }
            />

            <LikertItem
              label="I feel anxious."
              minLabel="Not at all"
              maxLabel="Extremely"
              value={survey.moodPre.anxious}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  moodPre: { ...prev.moodPre, anxious: value },
                }))
              }
            />

            <LikertItem
              label="I feel vigorous."
              minLabel="Not at all"
              maxLabel="Extremely"
              value={survey.moodPre.vigorous}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  moodPre: { ...prev.moodPre, vigorous: value },
                }))
              }
            />

            <LikertItem
              label="I feel confident."
              minLabel="Not at all"
              maxLabel="Extremely"
              value={survey.moodPre.confident}
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
  );
}
