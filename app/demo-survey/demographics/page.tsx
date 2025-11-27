"use client";

import { useRouter } from "next/navigation";
import { useSurvey } from "@/context/SurveyContext";
import StepLayout from "@/components/StepLayout";
import RadioGroup from "@/components/RadioGroup";
import TextInput from "@/components/TextInput";

export default function DemoDemographicsPage() {
  const router = useRouter();
  const { survey, setSurvey } = useSurvey();

  const handleNext = () => {
    router.push("/demo-survey/pre-task");
  };

  const handleBack = () => {
    router.push("/demo-survey");
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
        title="Demographics"
        subtitle="Basic information about you"
        currentStep={1}
        totalSteps={8}
        onNext={handleNext}
        onBack={handleBack}
        showBack
      >
        <div className="space-y-8">
          {/* Age */}
          <div className="apple-card bg-apple-gray-50 p-6">
            <TextInput
              label="Age"
              type="number"
              value={survey.age?.toString() || "28"}
              onChange={(value) => setSurvey(prev => ({ ...prev, age: parseInt(value) || 28 }))}
              placeholder="28"
            />
          </div>

          {/* Gender */}
          <div className="apple-card bg-apple-gray-50 p-6">
            <RadioGroup
              label="Gender"
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "non-binary", label: "Non-binary" },
                { value: "prefer-not-to-say", label: "Prefer not to say" },
                { value: "other", label: "Other / Self-describe" },
              ]}
              value={survey.gender || "non-binary"}
              onChange={(value) => setSurvey(prev => ({ ...prev, gender: value }))}
            />
          </div>

          {/* Education */}
          <div className="apple-card bg-apple-gray-50 p-6">
            <RadioGroup
              label="Highest level of education completed"
              options={[
                { value: "high-school", label: "High school or equivalent" },
                { value: "some-college", label: "Some college, no degree" },
                { value: "associates", label: "Associate's degree" },
                { value: "bachelors", label: "Bachelor's degree" },
                { value: "masters", label: "Master's degree" },
                { value: "doctorate", label: "Doctoral degree" },
                { value: "professional", label: "Professional degree" },
              ]}
              value={survey.education_level || "masters"}
              onChange={(value) => setSurvey(prev => ({ ...prev, education_level: value }))}
            />
          </div>

          {/* AI Use Frequency */}
          <div className="apple-card bg-apple-gray-50 p-6">
            <RadioGroup
              label="How often do you use AI tools in your work or studies?"
              options={[
                { value: "1", label: "Never" },
                { value: "2", label: "Rarely (once a month or less)" },
                { value: "3", label: "Sometimes (2-3 times a month)" },
                { value: "4", label: "Often (weekly)" },
                { value: "5", label: "Very often (daily)" },
              ]}
              value={survey.ai_use_frequency?.toString() || "4"}
              onChange={(value) => setSurvey(prev => ({ ...prev, ai_use_frequency: parseInt(value) }))}
            />
          </div>
        </div>
      </StepLayout>
    </>
  );
}