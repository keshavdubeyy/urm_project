"use client";

import { useEffect, useState } from "react";
import { SurveyResponse } from "@/types/survey";

interface DashboardStats {
  totalResponses: number;
  completedResponses: number;
  averageAge: number;
  genderDistribution: Record<string, number>;
  educationDistribution: Record<string, number>;
  aiUseFrequencyAvg: number;
  
  // Pre-task averages
  diaPreAvg: {
    unprotected: number;
    leftBehind: number;
    stayUpdated: number;
    needValidation: number;
    fearReplacement: number;
  };
  
  gseAvg: {
    solveDifficult: number;
    dealUnexpected: number;
    handleUnforeseen: number;
    severalSolutions: number;
  };
  
  moodPreAvg: {
    tense: number;
    fatigued: number;
    anxious: number;
    vigorous: number;
    confident: number;
  };
  
  // Task averages
  taskNoAIAvg: {
    tlxMental: number;
    tlxPhysical: number;
    tlxTemporal: number;
    tlxPerformance: number;
    tlxEffort: number;
    tlxFrustration: number;
    expConfident: number;
    expCreative: number;
    expSatisfied: number;
    avgResponseLength: number;
  };
  
  taskAIAvg: {
    tlxMental: number;
    tlxPhysical: number;
    tlxTemporal: number;
    tlxPerformance: number;
    tlxEffort: number;
    tlxFrustration: number;
    expConfident: number;
    expCreative: number;
    expSatisfied: number;
    expHelpful: number;
    expFeltDependent: number;
    avgIdeasFromAI: number;
    avgResponseLength: number;
  };
  
  // Post-task averages
  diaPostAvg: {
    unprotected: number;
    leftBehind: number;
    stayUpdated: number;
    needValidation: number;
    fearReplacement: number;
  };
  
  moodPostAvg: {
    tense: number;
    fatigued: number;
    anxious: number;
    vigorous: number;
    confident: number;
  };
  
  // Comparisons
  tlxComparison: {
    mental: { noAI: number; ai: number; diff: number };
    physical: { noAI: number; ai: number; diff: number };
    temporal: { noAI: number; ai: number; diff: number };
    performance: { noAI: number; ai: number; diff: number };
    effort: { noAI: number; ai: number; diff: number };
    frustration: { noAI: number; ai: number; diff: number };
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard');
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Dashboard API error:', errorData);
        throw new Error(
          errorData.details || errorData.error || 'Failed to fetch dashboard data'
        );
      }
      
      const data = await response.json();
      console.log('Dashboard data loaded:', data.count, 'responses');
      setResponses(data.responses);
      setStats(calculateStats(data.responses));
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (responses: any[]): DashboardStats => {
    const completed = responses.filter(r => r.end_timestamp);
    const n = completed.length;

    if (n === 0) {
      return getEmptyStats();
    }

    const avg = (values: (number | undefined)[]) => {
      const valid = values.filter((v): v is number => v !== undefined && v !== null);
      return valid.length > 0 ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;
    };

    // Demographics
    const genderDist: Record<string, number> = {};
    const educationDist: Record<string, number> = {};
    
    completed.forEach(r => {
      if (r.gender) genderDist[r.gender] = (genderDist[r.gender] || 0) + 1;
      if (r.education_level) educationDist[r.education_level] = (educationDist[r.education_level] || 0) + 1;
    });

    // Parse JSON fields
    const parseJSON = (str: string | undefined) => {
      try {
        return str ? JSON.parse(str) : {};
      } catch {
        return {};
      }
    };

    // TLX Comparison
    const taskNoAIMental = completed.map(r => parseJSON(r.task_no_ai)?.tlx?.mental).filter(v => v);
    const taskAIMental = completed.map(r => parseJSON(r.task_ai)?.tlx?.mental).filter(v => v);

    return {
      totalResponses: responses.length,
      completedResponses: n,
      averageAge: avg(completed.map(r => r.age)),
      genderDistribution: genderDist,
      educationDistribution: educationDist,
      aiUseFrequencyAvg: avg(completed.map(r => r.ai_use_frequency)),

      diaPreAvg: {
        unprotected: avg(completed.map(r => parseJSON(r.dia_pre)?.unprotected)),
        leftBehind: avg(completed.map(r => parseJSON(r.dia_pre)?.leftBehind)),
        stayUpdated: avg(completed.map(r => parseJSON(r.dia_pre)?.stayUpdated)),
        needValidation: avg(completed.map(r => parseJSON(r.dia_pre)?.needValidation)),
        fearReplacement: avg(completed.map(r => parseJSON(r.dia_pre)?.fearReplacement)),
      },

      gseAvg: {
        solveDifficult: avg(completed.map(r => parseJSON(r.gse)?.solveDifficult)),
        dealUnexpected: avg(completed.map(r => parseJSON(r.gse)?.dealUnexpected)),
        handleUnforeseen: avg(completed.map(r => parseJSON(r.gse)?.handleUnforeseen)),
        severalSolutions: avg(completed.map(r => parseJSON(r.gse)?.severalSolutions)),
      },

      moodPreAvg: {
        tense: avg(completed.map(r => parseJSON(r.mood_pre)?.tense)),
        fatigued: avg(completed.map(r => parseJSON(r.mood_pre)?.fatigued)),
        anxious: avg(completed.map(r => parseJSON(r.mood_pre)?.anxious)),
        vigorous: avg(completed.map(r => parseJSON(r.mood_pre)?.vigorous)),
        confident: avg(completed.map(r => parseJSON(r.mood_pre)?.confident)),
      },

      taskNoAIAvg: {
        tlxMental: avg(completed.map(r => parseJSON(r.task_no_ai)?.tlx?.mental)),
        tlxPhysical: avg(completed.map(r => parseJSON(r.task_no_ai)?.tlx?.physical)),
        tlxTemporal: avg(completed.map(r => parseJSON(r.task_no_ai)?.tlx?.temporal)),
        tlxPerformance: avg(completed.map(r => parseJSON(r.task_no_ai)?.tlx?.performance)),
        tlxEffort: avg(completed.map(r => parseJSON(r.task_no_ai)?.tlx?.effort)),
        tlxFrustration: avg(completed.map(r => parseJSON(r.task_no_ai)?.tlx?.frustration)),
        expConfident: avg(completed.map(r => parseJSON(r.task_no_ai)?.experience?.confident)),
        expCreative: avg(completed.map(r => parseJSON(r.task_no_ai)?.experience?.creative)),
        expSatisfied: avg(completed.map(r => parseJSON(r.task_no_ai)?.experience?.satisfied)),
        avgResponseLength: avg(completed.map(r => parseJSON(r.task_no_ai)?.responseText?.length || 0)),
      },

      taskAIAvg: {
        tlxMental: avg(completed.map(r => parseJSON(r.task_ai)?.tlx?.mental)),
        tlxPhysical: avg(completed.map(r => parseJSON(r.task_ai)?.tlx?.physical)),
        tlxTemporal: avg(completed.map(r => parseJSON(r.task_ai)?.tlx?.temporal)),
        tlxPerformance: avg(completed.map(r => parseJSON(r.task_ai)?.tlx?.performance)),
        tlxEffort: avg(completed.map(r => parseJSON(r.task_ai)?.tlx?.effort)),
        tlxFrustration: avg(completed.map(r => parseJSON(r.task_ai)?.tlx?.frustration)),
        expConfident: avg(completed.map(r => parseJSON(r.task_ai)?.experience?.confident)),
        expCreative: avg(completed.map(r => parseJSON(r.task_ai)?.experience?.creative)),
        expSatisfied: avg(completed.map(r => parseJSON(r.task_ai)?.experience?.satisfied)),
        expHelpful: avg(completed.map(r => parseJSON(r.task_ai)?.experience?.helpful)),
        expFeltDependent: avg(completed.map(r => parseJSON(r.task_ai)?.experience?.feltDependent)),
        avgIdeasFromAI: avg(completed.map(r => parseJSON(r.task_ai)?.ideasFromAI)),
        avgResponseLength: avg(completed.map(r => parseJSON(r.task_ai)?.responseText?.length || 0)),
      },

      diaPostAvg: {
        unprotected: avg(completed.map(r => parseJSON(r.dia_post)?.unprotected)),
        leftBehind: avg(completed.map(r => parseJSON(r.dia_post)?.leftBehind)),
        stayUpdated: avg(completed.map(r => parseJSON(r.dia_post)?.stayUpdated)),
        needValidation: avg(completed.map(r => parseJSON(r.dia_post)?.needValidation)),
        fearReplacement: avg(completed.map(r => parseJSON(r.dia_post)?.fearReplacement)),
      },

      moodPostAvg: {
        tense: avg(completed.map(r => parseJSON(r.mood_post)?.tense)),
        fatigued: avg(completed.map(r => parseJSON(r.mood_post)?.fatigued)),
        anxious: avg(completed.map(r => parseJSON(r.mood_post)?.anxious)),
        vigorous: avg(completed.map(r => parseJSON(r.mood_post)?.vigorous)),
        confident: avg(completed.map(r => parseJSON(r.mood_post)?.confident)),
      },

      tlxComparison: {
        mental: {
          noAI: avg(completed.map(r => parseJSON(r.task_no_ai)?.tlx?.mental)),
          ai: avg(completed.map(r => parseJSON(r.task_ai)?.tlx?.mental)),
          diff: avg(completed.map(r => parseJSON(r.task_ai)?.tlx?.mental)) - avg(completed.map(r => parseJSON(r.task_no_ai)?.tlx?.mental)),
        },
        physical: {
          noAI: avg(completed.map(r => parseJSON(r.task_no_ai)?.tlx?.physical)),
          ai: avg(completed.map(r => parseJSON(r.task_ai)?.tlx?.physical)),
          diff: avg(completed.map(r => parseJSON(r.task_ai)?.tlx?.physical)) - avg(completed.map(r => parseJSON(r.task_no_ai)?.tlx?.physical)),
        },
        temporal: {
          noAI: avg(completed.map(r => parseJSON(r.task_no_ai)?.tlx?.temporal)),
          ai: avg(completed.map(r => parseJSON(r.task_ai)?.tlx?.temporal)),
          diff: avg(completed.map(r => parseJSON(r.task_ai)?.tlx?.temporal)) - avg(completed.map(r => parseJSON(r.task_no_ai)?.tlx?.temporal)),
        },
        performance: {
          noAI: avg(completed.map(r => parseJSON(r.task_no_ai)?.tlx?.performance)),
          ai: avg(completed.map(r => parseJSON(r.task_ai)?.tlx?.performance)),
          diff: avg(completed.map(r => parseJSON(r.task_ai)?.tlx?.performance)) - avg(completed.map(r => parseJSON(r.task_no_ai)?.tlx?.performance)),
        },
        effort: {
          noAI: avg(completed.map(r => parseJSON(r.task_no_ai)?.tlx?.effort)),
          ai: avg(completed.map(r => parseJSON(r.task_ai)?.tlx?.effort)),
          diff: avg(completed.map(r => parseJSON(r.task_ai)?.tlx?.effort)) - avg(completed.map(r => parseJSON(r.task_no_ai)?.tlx?.effort)),
        },
        frustration: {
          noAI: avg(completed.map(r => parseJSON(r.task_no_ai)?.tlx?.frustration)),
          ai: avg(completed.map(r => parseJSON(r.task_ai)?.tlx?.frustration)),
          diff: avg(completed.map(r => parseJSON(r.task_ai)?.tlx?.frustration)) - avg(completed.map(r => parseJSON(r.task_no_ai)?.tlx?.frustration)),
        },
      },
    };
  };

  const getEmptyStats = (): DashboardStats => ({
    totalResponses: 0,
    completedResponses: 0,
    averageAge: 0,
    genderDistribution: {},
    educationDistribution: {},
    aiUseFrequencyAvg: 0,
    diaPreAvg: { unprotected: 0, leftBehind: 0, stayUpdated: 0, needValidation: 0, fearReplacement: 0 },
    gseAvg: { solveDifficult: 0, dealUnexpected: 0, handleUnforeseen: 0, severalSolutions: 0 },
    moodPreAvg: { tense: 0, fatigued: 0, anxious: 0, vigorous: 0, confident: 0 },
    taskNoAIAvg: { tlxMental: 0, tlxPhysical: 0, tlxTemporal: 0, tlxPerformance: 0, tlxEffort: 0, tlxFrustration: 0, expConfident: 0, expCreative: 0, expSatisfied: 0, avgResponseLength: 0 },
    taskAIAvg: { tlxMental: 0, tlxPhysical: 0, tlxTemporal: 0, tlxPerformance: 0, tlxEffort: 0, tlxFrustration: 0, expConfident: 0, expCreative: 0, expSatisfied: 0, expHelpful: 0, expFeltDependent: 0, avgIdeasFromAI: 0, avgResponseLength: 0 },
    diaPostAvg: { unprotected: 0, leftBehind: 0, stayUpdated: 0, needValidation: 0, fearReplacement: 0 },
    moodPostAvg: { tense: 0, fatigued: 0, anxious: 0, vigorous: 0, confident: 0 },
    tlxComparison: {
      mental: { noAI: 0, ai: 0, diff: 0 },
      physical: { noAI: 0, ai: 0, diff: 0 },
      temporal: { noAI: 0, ai: 0, diff: 0 },
      performance: { noAI: 0, ai: 0, diff: 0 },
      effort: { noAI: 0, ai: 0, diff: 0 },
      frustration: { noAI: 0, ai: 0, diff: 0 },
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-apple-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="apple-card p-8 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-apple-gray-200 rounded w-1/4 mx-auto"></div>
              <div className="h-4 bg-apple-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-apple-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="apple-error-banner">
            <p className="apple-body text-red-800">
              <strong>Error:</strong> {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-apple-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="apple-card p-8">
          <h1 className="apple-heading-2 mb-4">Survey Analytics Dashboard</h1>
          <div className="flex gap-4 items-center">
            <button
              onClick={fetchData}
              className="apple-button-primary"
            >
              Refresh Data
            </button>
            <span className="apple-caption text-apple-gray-600">
              Last updated: {new Date().toLocaleString()}
            </span>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="apple-card p-6">
            <div className="apple-caption text-apple-gray-600 mb-2">Total Responses</div>
            <div className="text-3xl font-bold text-apple-blue">{stats?.totalResponses || 0}</div>
          </div>
          <div className="apple-card p-6">
            <div className="apple-caption text-apple-gray-600 mb-2">Completed</div>
            <div className="text-3xl font-bold text-green-600">{stats?.completedResponses || 0}</div>
          </div>
          <div className="apple-card p-6">
            <div className="apple-caption text-apple-gray-600 mb-2">Average Age</div>
            <div className="text-3xl font-bold text-apple-gray-900">{stats?.averageAge.toFixed(1) || 0}</div>
          </div>
          <div className="apple-card p-6">
            <div className="apple-caption text-apple-gray-600 mb-2">AI Use Frequency</div>
            <div className="text-3xl font-bold text-apple-orange">{stats?.aiUseFrequencyAvg.toFixed(1) || 0}/5</div>
          </div>
        </div>

        {/* Demographics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="apple-card p-6">
            <h3 className="apple-heading-4 mb-4">Gender Distribution</h3>
            <div className="space-y-2">
              {Object.entries(stats?.genderDistribution || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="apple-body capitalize">{key}</span>
                  <span className="apple-body font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="apple-card p-6">
            <h3 className="apple-heading-4 mb-4">Education Distribution</h3>
            <div className="space-y-2">
              {Object.entries(stats?.educationDistribution || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="apple-body uppercase">{key}</span>
                  <span className="apple-body font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* NASA-TLX Comparison */}
        <div className="apple-card p-6">
          <h3 className="apple-heading-3 mb-6">NASA-TLX Workload Comparison (Pre-AI vs Post-AI)</h3>
          <div className="space-y-4">
            {Object.entries(stats?.tlxComparison || {}).map(([key, values]) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-2">
                  <span className="apple-body font-semibold capitalize">{key}</span>
                  <span className={`apple-caption font-bold ${values.diff > 0 ? 'text-red-600' : values.diff < 0 ? 'text-green-600' : 'text-apple-gray-600'}`}>
                    {values.diff > 0 ? '+' : ''}{values.diff.toFixed(2)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="apple-caption text-apple-gray-600">Pre-AI: {values.noAI.toFixed(2)}</div>
                    <div className="w-full bg-apple-gray-200 rounded-full h-2">
                      <div className="bg-apple-orange h-2 rounded-full" style={{ width: `${(values.noAI / 21) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="apple-caption text-apple-gray-600">Post-AI: {values.ai.toFixed(2)}</div>
                    <div className="w-full bg-apple-gray-200 rounded-full h-2">
                      <div className="bg-apple-blue h-2 rounded-full" style={{ width: `${(values.ai / 21) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mood Comparison */}
        <div className="apple-card p-6">
          <h3 className="apple-heading-3 mb-6">Mood Assessment (Pre vs Post)</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {['tense', 'fatigued', 'anxious', 'vigorous', 'confident'].map((mood) => (
              <div key={mood} className="text-center">
                <div className="apple-caption text-apple-gray-600 capitalize mb-2">{mood}</div>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-apple-gray-600">Pre</div>
                    <div className="text-2xl font-bold text-apple-orange">
                      {stats?.moodPreAvg[mood as keyof typeof stats.moodPreAvg].toFixed(1) || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-apple-gray-600">Post</div>
                    <div className="text-2xl font-bold text-apple-blue">
                      {stats?.moodPostAvg[mood as keyof typeof stats.moodPostAvg].toFixed(1) || 0}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Dependency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="apple-card p-6">
            <h3 className="apple-heading-4 mb-4">AI Dependence (Pre-Task)</h3>
            <div className="space-y-3">
              {Object.entries(stats?.diaPreAvg || {}).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <span className="apple-caption capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="apple-caption font-bold">{value.toFixed(2)}/5</span>
                  </div>
                  <div className="w-full bg-apple-gray-200 rounded-full h-2">
                    <div className="bg-apple-orange h-2 rounded-full" style={{ width: `${(value / 5) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="apple-card p-6">
            <h3 className="apple-heading-4 mb-4">AI Dependence (Post-Task)</h3>
            <div className="space-y-3">
              {Object.entries(stats?.diaPostAvg || {}).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <span className="apple-caption capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="apple-caption font-bold">{value.toFixed(2)}/5</span>
                  </div>
                  <div className="w-full bg-apple-gray-200 rounded-full h-2">
                    <div className="bg-apple-blue h-2 rounded-full" style={{ width: `${(value / 5) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task Experience */}
        <div className="apple-card p-6">
          <h3 className="apple-heading-3 mb-6">Task Experience Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="apple-caption text-apple-gray-600 mb-2">Confident</div>
              <div className="flex justify-around">
                <div>
                  <div className="text-sm text-apple-gray-600">Pre-AI</div>
                  <div className="text-2xl font-bold text-apple-orange">{stats?.taskNoAIAvg.expConfident.toFixed(1)}</div>
                </div>
                <div>
                  <div className="text-sm text-apple-gray-600">Post-AI</div>
                  <div className="text-2xl font-bold text-apple-blue">{stats?.taskAIAvg.expConfident.toFixed(1)}</div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="apple-caption text-apple-gray-600 mb-2">Creative</div>
              <div className="flex justify-around">
                <div>
                  <div className="text-sm text-apple-gray-600">Pre-AI</div>
                  <div className="text-2xl font-bold text-apple-orange">{stats?.taskNoAIAvg.expCreative.toFixed(1)}</div>
                </div>
                <div>
                  <div className="text-sm text-apple-gray-600">Post-AI</div>
                  <div className="text-2xl font-bold text-apple-blue">{stats?.taskAIAvg.expCreative.toFixed(1)}</div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="apple-caption text-apple-gray-600 mb-2">Satisfied</div>
              <div className="flex justify-around">
                <div>
                  <div className="text-sm text-apple-gray-600">Pre-AI</div>
                  <div className="text-2xl font-bold text-apple-orange">{stats?.taskNoAIAvg.expSatisfied.toFixed(1)}</div>
                </div>
                <div>
                  <div className="text-sm text-apple-gray-600">Post-AI</div>
                  <div className="text-2xl font-bold text-apple-blue">{stats?.taskAIAvg.expSatisfied.toFixed(1)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI-Specific Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="apple-card p-6">
            <h3 className="apple-heading-4 mb-4">Post-AI Task Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="apple-body">AI Helpful</span>
                <span className="apple-body font-bold">{stats?.taskAIAvg.expHelpful.toFixed(2)}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="apple-body">Felt Dependent</span>
                <span className="apple-body font-bold">{stats?.taskAIAvg.expFeltDependent.toFixed(2)}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="apple-body">Avg Ideas from AI</span>
                <span className="apple-body font-bold">{stats?.taskAIAvg.avgIdeasFromAI.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <div className="apple-card p-6">
            <h3 className="apple-heading-4 mb-4">Response Length Comparison</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="apple-body">Pre-AI Avg Length</span>
                <span className="apple-body font-bold">{Math.round(stats?.taskNoAIAvg.avgResponseLength || 0)} chars</span>
              </div>
              <div className="flex justify-between">
                <span className="apple-body">Post-AI Avg Length</span>
                <span className="apple-body font-bold">{Math.round(stats?.taskAIAvg.avgResponseLength || 0)} chars</span>
              </div>
              <div className="flex justify-between">
                <span className="apple-body">Difference</span>
                <span className={`apple-body font-bold ${(stats?.taskAIAvg.avgResponseLength || 0) > (stats?.taskNoAIAvg.avgResponseLength || 0) ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.round((stats?.taskAIAvg.avgResponseLength || 0) - (stats?.taskNoAIAvg.avgResponseLength || 0))} chars
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
