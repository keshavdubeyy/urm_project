"use client";

import { useState } from "react";
import StepLayout from "@/components/StepLayout";
import TextInput from "@/components/TextInput";
import RadioGroup from "@/components/RadioGroup";
import LikertItem from "@/components/LikertItem";
import { useSurvey } from "@/context/SurveyContext";

export default function DemographicsPage() {
  const { survey, setSurvey } = useSurvey();
  const [showError, setShowError] = useState(false);
  const [ageError, setAgeError] = useState<string | null>(null);

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "transgender", label: "Transgender" },
    { value: "nonbinary", label: "Non-binary" },
    { value: "prefer_not", label: "Prefer not to say" },
    { value: "self_describe", label: "Prefer to self-describe" },
  ];

  const educationOptions = [
    { value: "hs", label: "High school / Intermediate" },
    { value: "diploma", label: "Diploma" },
    { value: "ug", label: "Undergraduate" },
    { value: "pg", label: "Postgraduate" },
    { value: "phd", label: "PhD" },
    { value: "other", label: "Other" },
  ];

  const handleAgeChange = (value: string) => {
    const age = parseInt(value);
    
    if (value === '' || isNaN(age)) {
      setAgeError(null);
      setSurvey((prev) => ({ ...prev, age: undefined }));
      return;
    }
    
    if (age < 18) {
      setAgeError('This study is only for participants aged 18 or older. You cannot proceed.');
      setSurvey((prev) => ({ ...prev, age: age }));
    } else {
      setAgeError(null);
      setSurvey((prev) => ({ ...prev, age: age }));
    }
  };

  const handleNext = () => {
    // Validate minimum age first
    if (survey.age && survey.age < 18) {
      setAgeError('This study is only for participants aged 18 or older. You cannot proceed.');
      return false;
    }
    
    // Validate required fields
    if (!survey.age || !survey.gender || !survey.educationLevel || !survey.aiUseFrequency) {
      setShowError(true);
      return false;
    }
    
    setShowError(false);
    return true;
  };

  return (
    <StepLayout
      currentStep={1}
      totalSteps={7}
      stepTitle="Demographics & Background"
      nextHref="/pre-task"
      backHref="/"
      onNext={handleNext}
    >
      <div className="space-y-6">
        {ageError && (
          <div className="apple-error-banner">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="apple-heading-4 text-red-900 mb-1">Ineligible for Study</h3>
                <p className="apple-caption text-red-800 font-medium">{ageError}</p>
              </div>
            </div>
          </div>
        )}
        
        {showError && !ageError && (
          <div className="apple-warning-banner">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="apple-heading-4 text-yellow-900 mb-1">Required Fields</h3>
                <p className="apple-caption text-yellow-800 font-medium">
                  Please complete all required fields before continuing.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Age */}
          <div className={ageError ? "apple-card bg-red-50 border-red-400 p-6" : ""}>
            <TextInput
              label="What is your age?"
              name="age"
              type="number"
              value={survey.age}
              onChange={handleAgeChange}
              placeholder="Enter your age"
              min={1}
              max={120}
              required
            />
          </div>

          {/* Gender */}
          <RadioGroup
            label="What is your gender?"
            name="gender"
            options={genderOptions}
            value={survey.gender}
            onChange={(value) =>
              setSurvey((prev) => ({
                ...prev,
                gender: value as typeof survey.gender,
                genderSelfDescribe: value !== "self_describe" ? undefined : prev.genderSelfDescribe,
              }))
            }
            required
          />

          {/* Gender self-describe */}
          {survey.gender === "self_describe" && (
            <div className="ml-8">
              <TextInput
                label="Please specify"
                name="genderSelfDescribe"
                value={survey.genderSelfDescribe}
                onChange={(value) =>
                  setSurvey((prev) => ({ ...prev, genderSelfDescribe: value }))
                }
                placeholder="Your gender identity"
              />
            </div>
          )}

          {/* Education Level */}
          <RadioGroup
            label="What is your current education?"
            name="educationLevel"
            options={educationOptions}
            value={survey.educationLevel}
            onChange={(value) =>
              setSurvey((prev) => ({
                ...prev,
                educationLevel: value as typeof survey.educationLevel,
                educationOther: value !== "other" ? undefined : prev.educationOther,
              }))
            }
            required
          />

          {/* Education other */}
          {survey.educationLevel === "other" && (
            <div className="ml-8">
              <TextInput
                label="Please specify"
                name="educationOther"
                value={survey.educationOther}
                onChange={(value) =>
                  setSurvey((prev) => ({ ...prev, educationOther: value }))
                }
                placeholder="Your education level"
              />
            </div>
          )}

          {/* AI Use Frequency */}
          <div className="pt-6 border-t border-apple-gray-200">
            <LikertItem
              label="How frequently do you use AI tools for academic work?"
              minLabel="Never"
              maxLabel="Daily"
              value={survey.aiUseFrequency}
              onChange={(value) =>
                setSurvey((prev) => ({ ...prev, aiUseFrequency: value }))
              }
              scaleMin={1}
              scaleMax={5}
              required
            />
          </div>

          {/* Most used AI tool */}
          <TextInput
            label="Which AI tool do you use most frequently?"
            name="aiToolMostUsed"
            value={survey.aiToolMostUsed}
            onChange={(value) =>
              setSurvey((prev) => ({ ...prev, aiToolMostUsed: value }))
            }
            placeholder="e.g., ChatGPT, Claude, Copilot, Gemini"
          />
        </div>
      </div>
    </StepLayout>
  );
}
