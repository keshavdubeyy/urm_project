"use client";

import { useEffect, useState, useCallback } from "react";
import {
  calculateCronbachAlpha,
  pairedTTest,
  correlationMatrix,
  descriptiveStats,
  cohensD,
  AnalysisData,
} from "@/lib/statisticalAnalysis";

interface AnalysisResults {
  // Step 0: Data validation
  dataValidation: {
    totalParticipants: number;
    completeResponses: number;
    missingData: string[];
  };
  
  // Step 2: Reliability
  reliability: {
    diaPreAlpha: number;
    diaPostAlpha: number;
    gseAlpha: number;
    tlxNoAIAlpha: number;
    tlxAIAlpha: number;
  };
  
  // Step 3: Descriptives
  descriptives: {
    diaPreStats: any;
    gseStats: any;
    ideasNoAI: any;
    ideasAI: any;
    tlxNoAI: any;
    tlxAI: any;
  };
  
  // Step 4: Paired t-tests
  pairedTests: {
    ideasTest: any;
    tlxMentalTest: any;
    tlxEffortTest: any;
    tlxFrustrationTest: any;
    confidenceTest: any;
    creativityTest: any;
    satisfactionTest: any;
  };
  
  // Step 5: Correlations
  correlations: {
    noAIMatrix: any[];
    aiMatrix: any[];
    variableNames: string[];
  };
}

export default function AnalysisPage() {
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<any[]>([]);

  const processData = useCallback((responses: any[]): AnalysisData[] => {
    return responses
      .filter(r => r.end_timestamp) // Only completed responses
      .map(r => {
        const parseJSON = (str: string | undefined) => {
          try {
            return str ? JSON.parse(str) : {};
          } catch {
            return {};
          }
        };

        const diaPre = parseJSON(r.dia_pre);
        const diaPost = parseJSON(r.dia_post);
        const gse = parseJSON(r.gse);
        const moodPre = parseJSON(r.mood_pre);
        const moodPost = parseJSON(r.mood_post);
        const taskNoAI = parseJSON(r.task_no_ai);
        const taskAI = parseJSON(r.task_ai);

        // Parse ideas from text
        const noAIText = taskNoAI.responseText || "";
        const aiText = taskAI.responseText || "";
        const noAIIdeas = noAIText.split('\n').filter((line: string) => line.trim().length > 0);
        const aiIdeas = aiText.split('\n').filter((line: string) => line.trim().length > 0);

        return {
          participantId: r.response_id,
          age: r.age,
          gender: r.gender,
          aiUseFrequency: r.ai_use_frequency,
          
          diaPre: {
            unprotected: diaPre.unprotected || 0,
            leftBehind: diaPre.leftBehind || 0,
            stayUpdated: diaPre.stayUpdated || 0,
            needValidation: diaPre.needValidation || 0,
            fearReplacement: diaPre.fearReplacement || 0,
          },
          
          gse: {
            solveDifficult: gse.solveDifficult || 0,
            dealUnexpected: gse.dealUnexpected || 0,
            handleUnforeseen: gse.handleUnforeseen || 0,
            severalSolutions: gse.severalSolutions || 0,
          },
          
          moodPre: {
            tense: moodPre.tense || 0,
            fatigued: moodPre.fatigued || 0,
            anxious: moodPre.anxious || 0,
            vigorous: moodPre.vigorous || 0,
            confident: moodPre.confident || 0,
          },
          
          taskNoAI: {
            ideas: noAIIdeas,
            ideaCount: noAIIdeas.length,
            tlx: {
              mental: taskNoAI.tlx?.mental || 0,
              physical: taskNoAI.tlx?.physical || 0,
              temporal: taskNoAI.tlx?.temporal || 0,
              performance: taskNoAI.tlx?.performance || 0,
              effort: taskNoAI.tlx?.effort || 0,
              frustration: taskNoAI.tlx?.frustration || 0,
            },
            experience: {
              confident: taskNoAI.experience?.confident || 0,
              creative: taskNoAI.experience?.creative || 0,
              satisfied: taskNoAI.experience?.satisfied || 0,
            },
          },
          
          taskAI: {
            ideas: aiIdeas,
            ideaCount: aiIdeas.length,
            tlx: {
              mental: taskAI.tlx?.mental || 0,
              physical: taskAI.tlx?.physical || 0,
              temporal: taskAI.tlx?.temporal || 0,
              performance: taskAI.tlx?.performance || 0,
              effort: taskAI.tlx?.effort || 0,
              frustration: taskAI.tlx?.frustration || 0,
            },
            experience: {
              confident: taskAI.experience?.confident || 0,
              creative: taskAI.experience?.creative || 0,
              satisfied: taskAI.experience?.satisfied || 0,
              helpful: taskAI.experience?.helpful || 0,
              feltDependent: taskAI.experience?.feltDependent || 0,
            },
            ideasFromAI: taskAI.ideasFromAI || 0,
          },
          
          diaPost: {
            unprotected: diaPost.unprotected || 0,
            leftBehind: diaPost.leftBehind || 0,
            stayUpdated: diaPost.stayUpdated || 0,
            needValidation: diaPost.needValidation || 0,
            fearReplacement: diaPost.fearReplacement || 0,
          },
          
          moodPost: {
            tense: moodPost.tense || 0,
            fatigued: moodPost.fatigued || 0,
            anxious: moodPost.anxious || 0,
            vigorous: moodPost.vigorous || 0,
            confident: moodPost.confident || 0,
          },
        };
      });
  }, []);

  const runAnalysis = useCallback((data: AnalysisData[]) => {
    console.log('[Analysis] Running complete analysis pipeline...');
    
    const n = data.length;
    
    // STEP 0: Data Validation
    console.log('[Analysis] Step 0: Data Validation');
    const missingData: string[] = [];
    data.forEach((p, i) => {
      if (!p.diaPre || !p.gse || !p.taskNoAI || !p.taskAI) {
        missingData.push(`Participant ${i + 1}: Missing core data`);
      }
    });

    // STEP 2: Reliability (Cronbach's Alpha)
    console.log('[Analysis] Step 2: Calculating Cronbach\'s Alpha...');
    
    const diaPreItems = [
      data.map(p => p.diaPre.unprotected),
      data.map(p => p.diaPre.leftBehind),
      data.map(p => p.diaPre.stayUpdated),
      data.map(p => p.diaPre.needValidation),
      data.map(p => p.diaPre.fearReplacement),
    ];
    
    const diaPostItems = [
      data.map(p => p.diaPost.unprotected),
      data.map(p => p.diaPost.leftBehind),
      data.map(p => p.diaPost.stayUpdated),
      data.map(p => p.diaPost.needValidation),
      data.map(p => p.diaPost.fearReplacement),
    ];
    
    const gseItems = [
      data.map(p => p.gse.solveDifficult),
      data.map(p => p.gse.dealUnexpected),
      data.map(p => p.gse.handleUnforeseen),
      data.map(p => p.gse.severalSolutions),
    ];
    
    const tlxNoAIItems = [
      data.map(p => p.taskNoAI.tlx.mental),
      data.map(p => p.taskNoAI.tlx.physical),
      data.map(p => p.taskNoAI.tlx.temporal),
      data.map(p => p.taskNoAI.tlx.performance),
      data.map(p => p.taskNoAI.tlx.effort),
      data.map(p => p.taskNoAI.tlx.frustration),
    ];
    
    const tlxAIItems = [
      data.map(p => p.taskAI.tlx.mental),
      data.map(p => p.taskAI.tlx.physical),
      data.map(p => p.taskAI.tlx.temporal),
      data.map(p => p.taskAI.tlx.performance),
      data.map(p => p.taskAI.tlx.effort),
      data.map(p => p.taskAI.tlx.frustration),
    ];

    // STEP 3: Descriptive Statistics
    console.log('[Analysis] Step 3: Computing descriptive statistics...');
    
    const diaPreAvg = data.map(p => 
      (p.diaPre.unprotected + p.diaPre.leftBehind + p.diaPre.stayUpdated + 
       p.diaPre.needValidation + p.diaPre.fearReplacement) / 5
    );
    
    const gseAvg = data.map(p =>
      (p.gse.solveDifficult + p.gse.dealUnexpected + 
       p.gse.handleUnforeseen + p.gse.severalSolutions) / 4
    );
    
    const tlxNoAIAvg = data.map(p =>
      (p.taskNoAI.tlx.mental + p.taskNoAI.tlx.physical + p.taskNoAI.tlx.temporal +
       p.taskNoAI.tlx.performance + p.taskNoAI.tlx.effort + p.taskNoAI.tlx.frustration) / 6
    );
    
    const tlxAIAvg = data.map(p =>
      (p.taskAI.tlx.mental + p.taskAI.tlx.physical + p.taskAI.tlx.temporal +
       p.taskAI.tlx.performance + p.taskAI.tlx.effort + p.taskAI.tlx.frustration) / 6
    );

    // STEP 4: Paired t-tests
    console.log('[Analysis] Step 4: Running paired t-tests...');
    
    const ideasNoAI = data.map(p => p.taskNoAI.ideaCount);
    const ideasAI = data.map(p => p.taskAI.ideaCount);
    
    const tlxMentalNoAI = data.map(p => p.taskNoAI.tlx.mental);
    const tlxMentalAI = data.map(p => p.taskAI.tlx.mental);
    
    const tlxEffortNoAI = data.map(p => p.taskNoAI.tlx.effort);
    const tlxEffortAI = data.map(p => p.taskAI.tlx.effort);
    
    const tlxFrustrationNoAI = data.map(p => p.taskNoAI.tlx.frustration);
    const tlxFrustrationAI = data.map(p => p.taskAI.tlx.frustration);
    
    const confidenceNoAI = data.map(p => p.taskNoAI.experience.confident);
    const confidenceAI = data.map(p => p.taskAI.experience.confident);
    
    const creativityNoAI = data.map(p => p.taskNoAI.experience.creative);
    const creativityAI = data.map(p => p.taskAI.experience.creative);
    
    const satisfactionNoAI = data.map(p => p.taskNoAI.experience.satisfied);
    const satisfactionAI = data.map(p => p.taskAI.experience.satisfied);

    // STEP 5: Correlation matrices
    console.log('[Analysis] Step 5: Computing correlation matrices...');
    
    const noAIVariables = [
      { name: 'DIA_Pre', values: diaPreAvg },
      { name: 'GSE', values: gseAvg },
      { name: 'TLX_NoAI', values: tlxNoAIAvg },
      { name: 'Confidence_NoAI', values: confidenceNoAI },
      { name: 'Ideas_NoAI', values: ideasNoAI },
    ];
    
    const aiVariables = [
      { name: 'DIA_Pre', values: diaPreAvg },
      { name: 'GSE', values: gseAvg },
      { name: 'TLX_AI', values: tlxAIAvg },
      { name: 'Confidence_AI', values: confidenceAI },
      { name: 'Ideas_AI', values: ideasAI },
      { name: 'AI_Helpful', values: data.map(p => p.taskAI.experience.helpful) },
      { name: 'AI_Dependent', values: data.map(p => p.taskAI.experience.feltDependent) },
    ];

    setResults({
      dataValidation: {
        totalParticipants: n,
        completeResponses: n,
        missingData,
      },
      reliability: {
        diaPreAlpha: calculateCronbachAlpha(diaPreItems),
        diaPostAlpha: calculateCronbachAlpha(diaPostItems),
        gseAlpha: calculateCronbachAlpha(gseItems),
        tlxNoAIAlpha: calculateCronbachAlpha(tlxNoAIItems),
        tlxAIAlpha: calculateCronbachAlpha(tlxAIItems),
      },
      descriptives: {
        diaPreStats: descriptiveStats(diaPreAvg),
        gseStats: descriptiveStats(gseAvg),
        ideasNoAI: descriptiveStats(ideasNoAI),
        ideasAI: descriptiveStats(ideasAI),
        tlxNoAI: descriptiveStats(tlxNoAIAvg),
        tlxAI: descriptiveStats(tlxAIAvg),
      },
      pairedTests: {
        ideasTest: pairedTTest(ideasNoAI, ideasAI),
        tlxMentalTest: pairedTTest(tlxMentalNoAI, tlxMentalAI),
        tlxEffortTest: pairedTTest(tlxEffortNoAI, tlxEffortAI),
        tlxFrustrationTest: pairedTTest(tlxFrustrationNoAI, tlxFrustrationAI),
        confidenceTest: pairedTTest(confidenceNoAI, confidenceAI),
        creativityTest: pairedTTest(creativityNoAI, creativityAI),
        satisfactionTest: pairedTTest(satisfactionNoAI, satisfactionAI),
      },
      correlations: {
        noAIMatrix: correlationMatrix(noAIVariables),
        aiMatrix: correlationMatrix(aiVariables),
        variableNames: noAIVariables.map(v => v.name),
      },
    });

    console.log('[Analysis] Analysis complete!');
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard', {
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      setRawData(data.responses);
      
      const processedData = processData(data.responses);
      runAnalysis(processedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [processData, runAnalysis]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  if (!results) {
    return null;
  }

  return (
    <div className="min-h-screen bg-apple-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="apple-card p-8">
          <h1 className="apple-heading-2 mb-4">Statistical Analysis Dashboard</h1>
          <p className="apple-body text-apple-gray-600">
            Complete analysis pipeline following the 8-step research protocol
          </p>
          <button
            onClick={fetchData}
            className="apple-button-primary mt-4"
          >
            Refresh Analysis
          </button>
        </div>

        {/* STEP 0: Data Validation */}
        <div className="apple-card p-6">
          <h2 className="apple-heading-3 mb-4">📊 Step 0: Data Validation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-apple-blue bg-opacity-10 p-4 rounded-lg">
              <div className="apple-caption text-apple-gray-600">Total Participants</div>
              <div className="text-3xl font-bold text-apple-blue">
                {results.dataValidation.totalParticipants}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="apple-caption text-apple-gray-600">Complete Responses</div>
              <div className="text-3xl font-bold text-green-600">
                {results.dataValidation.completeResponses}
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="apple-caption text-apple-gray-600">Missing Data Issues</div>
              <div className="text-3xl font-bold text-orange-600">
                {results.dataValidation.missingData.length}
              </div>
            </div>
          </div>
          {results.dataValidation.missingData.length > 0 && (
            <div className="mt-4 apple-warning-banner">
              <ul className="list-disc list-inside apple-caption">
                {results.dataValidation.missingData.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* STEP 2: Reliability */}
        <div className="apple-card p-6">
          <h2 className="apple-heading-3 mb-4">🔬 Step 2: Reliability (Cronbach's α)</h2>
          <div className="space-y-3">
            {[
              { label: 'DIA Pre-Task', value: results.reliability.diaPreAlpha },
              { label: 'DIA Post-Task', value: results.reliability.diaPostAlpha },
              { label: 'GSE Scale', value: results.reliability.gseAlpha },
              { label: 'TLX No-AI', value: results.reliability.tlxNoAIAlpha },
              { label: 'TLX AI', value: results.reliability.tlxAIAlpha },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="apple-body">{item.label}</span>
                <div className="flex items-center gap-4">
                  <span className="apple-body font-bold">α = {item.value.toFixed(3)}</span>
                  <span className={`apple-caption px-3 py-1 rounded-full ${
                    item.value >= 0.9 ? 'bg-green-100 text-green-800' :
                    item.value >= 0.8 ? 'bg-blue-100 text-blue-800' :
                    item.value >= 0.7 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.value >= 0.9 ? 'Excellent' :
                     item.value >= 0.8 ? 'Good' :
                     item.value >= 0.7 ? 'Acceptable' :
                     'Questionable'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STEP 3: Descriptive Statistics */}
        <div className="apple-card p-6">
          <h2 className="apple-heading-3 mb-4">📈 Step 3: Descriptive Statistics</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-apple-gray-200">
                  <th className="text-left py-2 apple-body font-bold">Variable</th>
                  <th className="text-right py-2 apple-body font-bold">Mean</th>
                  <th className="text-right py-2 apple-body font-bold">SD</th>
                  <th className="text-right py-2 apple-body font-bold">Min</th>
                  <th className="text-right py-2 apple-body font-bold">Max</th>
                  <th className="text-right py-2 apple-body font-bold">N</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'DIA Pre-Task', stats: results.descriptives.diaPreStats },
                  { label: 'GSE', stats: results.descriptives.gseStats },
                  { label: 'Ideas (No-AI)', stats: results.descriptives.ideasNoAI },
                  { label: 'Ideas (AI)', stats: results.descriptives.ideasAI },
                  { label: 'TLX (No-AI)', stats: results.descriptives.tlxNoAI },
                  { label: 'TLX (AI)', stats: results.descriptives.tlxAI },
                ].map((row) => (
                  <tr key={row.label} className="border-b border-apple-gray-100">
                    <td className="py-2 apple-body">{row.label}</td>
                    <td className="text-right py-2 apple-body">{row.stats.mean.toFixed(2)}</td>
                    <td className="text-right py-2 apple-body">{row.stats.std.toFixed(2)}</td>
                    <td className="text-right py-2 apple-body">{row.stats.min.toFixed(2)}</td>
                    <td className="text-right py-2 apple-body">{row.stats.max.toFixed(2)}</td>
                    <td className="text-right py-2 apple-body">{row.stats.n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* STEP 4: Paired T-Tests */}
        <div className="apple-card p-6">
          <h2 className="apple-heading-3 mb-4">🔍 Step 4: Paired T-Tests (No-AI vs AI)</h2>
          <div className="space-y-4">
            {[
              { label: 'Idea Count', test: results.pairedTests.ideasTest },
              { label: 'TLX Mental Demand', test: results.pairedTests.tlxMentalTest },
              { label: 'TLX Effort', test: results.pairedTests.tlxEffortTest },
              { label: 'TLX Frustration', test: results.pairedTests.tlxFrustrationTest },
              { label: 'Confidence', test: results.pairedTests.confidenceTest },
              { label: 'Creativity', test: results.pairedTests.creativityTest },
              { label: 'Satisfaction', test: results.pairedTests.satisfactionTest },
            ].map((item) => (
              <div key={item.label} className="bg-apple-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="apple-body font-semibold">{item.label}</span>
                  <span className={`apple-caption px-3 py-1 rounded-full ${
                    item.test.effect === 'p < .001' ? 'bg-red-100 text-red-800' :
                    item.test.effect === 'p < .01' ? 'bg-orange-100 text-orange-800' :
                    item.test.effect === 'p < .05' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.test.effect}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 apple-caption text-apple-gray-600">
                  <div>t({item.test.df}) = {item.test.tStatistic.toFixed(3)}</div>
                  <div>Mean Diff = {item.test.meanDiff.toFixed(3)}</div>
                  <div>p = {item.test.pValue.toFixed(4)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STEP 5: Correlation Matrix - No AI */}
        <div className="apple-card p-6">
          <h2 className="apple-heading-3 mb-4">🔗 Step 5A: Correlations (No-AI Condition)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-2 apple-caption">Variable</th>
                  {results.correlations.variableNames.map((name) => (
                    <th key={name} className="text-center py-2 apple-caption">{name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.correlations.noAIMatrix.map((row, i) => (
                  <tr key={row.name}>
                    <td className="py-2 apple-caption font-semibold">{row.name}</td>
                    {row.correlations.map((corr: number, j: number) => (
                      <td
                        key={j}
                        className="text-center py-2 apple-caption"
                        style={{
                          backgroundColor: i === j ? '#f3f4f6' : 
                            Math.abs(corr) > 0.7 ? '#fee2e2' :
                            Math.abs(corr) > 0.5 ? '#fed7aa' :
                            Math.abs(corr) > 0.3 ? '#fef3c7' :
                            '#ffffff'
                        }}
                      >
                        {corr.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="apple-caption text-apple-gray-600 mt-2">
            Color coding: Strong (|r| &gt; .7) = Red, Moderate (|r| &gt; .5) = Orange, Weak (|r| &gt; .3) = Yellow
          </p>
        </div>

        {/* STEP 5: Correlation Matrix - AI */}
        <div className="apple-card p-6">
          <h2 className="apple-heading-3 mb-4">🔗 Step 5B: Correlations (AI Condition)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-2 apple-caption">Variable</th>
                  {results.correlations.aiMatrix[0]?.correlations.map((_: any, i: number) => (
                    <th key={i} className="text-center py-2 apple-caption">
                      {results.correlations.aiMatrix[i]?.name || `Var ${i + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.correlations.aiMatrix.map((row, i) => (
                  <tr key={row.name}>
                    <td className="py-2 apple-caption font-semibold">{row.name}</td>
                    {row.correlations.map((corr: number, j: number) => (
                      <td
                        key={j}
                        className="text-center py-2 apple-caption"
                        style={{
                          backgroundColor: i === j ? '#f3f4f6' :
                            Math.abs(corr) > 0.7 ? '#fee2e2' :
                            Math.abs(corr) > 0.5 ? '#fed7aa' :
                            Math.abs(corr) > 0.3 ? '#fef3c7' :
                            '#ffffff'
                        }}
                      >
                        {corr.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Data Export */}
        <div className="apple-card p-6">
          <h2 className="apple-heading-3 mb-4">💾 Export Data</h2>
          <div className="flex gap-4">
            <button
              onClick={() => {
                const dataStr = JSON.stringify(results, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `analysis-results-${new Date().toISOString()}.json`;
                link.click();
              }}
              className="apple-button-primary"
            >
              Download Analysis Results (JSON)
            </button>
            <button
              onClick={() => {
                const csv = convertToCSV(rawData);
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `raw-data-${new Date().toISOString()}.csv`;
                link.click();
              }}
              className="apple-button-secondary"
            >
              Download Raw Data (CSV)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const rows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value).replace(/"/g, '""');
      return String(value).replace(/"/g, '""');
    }).map(v => `"${v}"`).join(',')
  );
  
  return [headers.join(','), ...rows].join('\n');
}
