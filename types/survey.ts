export interface SurveyResponse {
  // Top-level fields
  responseId: string;
  startTimestamp?: string;
  endTimestamp?: string;
  durationSeconds?: number;
  consent?: boolean;

  // Demographics
  age?: number;
  gender?: "male" | "female" | "nonbinary" | "prefer_not" | "self_describe";
  genderSelfDescribe?: string;
  educationLevel?: "hs" | "diploma" | "ug" | "pg" | "phd" | "other";
  educationOther?: string;
  aiUseFrequency?: number; // 1-5
  aiToolMostUsed?: string;

  // Pre-task scales (all 1-5)
  diaPre: {
    unprotected?: number;
    leftBehind?: number;
    stayUpdated?: number;
    needValidation?: number;
    fearReplacement?: number;
  };

  gse: {
    solveDifficult?: number;
    dealUnexpected?: number;
    handleUnforeseen?: number;
    severalSolutions?: number;
  };

  moodPre: {
    tense?: number;
    fatigued?: number;
    anxious?: number;
    vigorous?: number;
    confident?: number;
  };

  // Task A (No AI)
  taskNoAI: {
    startTimestamp?: string;
    endTimestamp?: string;
    responseText?: string;
    tlx?: {
      mental?: number;
      physical?: number;
      temporal?: number;
      performance?: number;
      effort?: number;
      frustration?: number;
    };
    experience?: {
      confident?: number;
      creative?: number;
      satisfied?: number;
    };
    fluency?: number;
    originality?: number;
    flexibility?: number;
    elaboration?: number;
  };

  // Task B (AI)
  taskAI: {
    startTimestamp?: string;
    endTimestamp?: string;
    responseText?: string;
    ideasFromAI?: number;
    tlx?: {
      mental?: number;
      physical?: number;
      temporal?: number;
      performance?: number;
      effort?: number;
      frustration?: number;
    };
    experience?: {
      confident?: number;
      creative?: number;
      satisfied?: number;
      helpful?: number;
      feltDependent?: number;
    };
    fluency?: number;
    originality?: number;
    flexibility?: number;
    elaboration?: number;
  };

  // Post-task scales (all 1-5)
  diaPost: {
    unprotected?: number;
    leftBehind?: number;
    stayUpdated?: number;
    needValidation?: number;
    fearReplacement?: number;
  };

  moodPost: {
    confident?: number;
    stressed?: number;
    satisfied?: number;
    creative?: number;
  };

  // Reflections
  reflections: {
    easierTask?: string;
    aiThoughtProcess?: string;
    finalComments?: string;
  };
}

export function getEmptySurveyResponse(): SurveyResponse {
  return {
    responseId: crypto.randomUUID(),
    diaPre: {},
    gse: {},
    moodPre: {},
    taskNoAI: {
      tlx: {},
      experience: {},
    },
    taskAI: {
      tlx: {},
      experience: {},
    },
    diaPost: {},
    moodPost: {},
    reflections: {},
  };
}
