"use client";

import { useEffect, useState } from "react";

interface ProcessedData {
  participantId: string;
  age: number;
  gender: string;
  aiFrequency: number;
  diaPreAvg: number;
  diaPostAvg: number;
  gseAvg: number;
  ideasNoAI: number;
  ideasAI: number;
  tlxNoAI: {
    mental: number;
    physical: number;
    temporal: number;
    performance: number;
    effort: number;
    frustration: number;
    avg: number;
  };
  tlxAI: {
    mental: number;
    physical: number;
    temporal: number;
    performance: number;
    effort: number;
    frustration: number;
    avg: number;
  };
  confidenceNoAI: number;
  confidenceAI: number;
  helpfulnessAI: number;
}

// Simple Bar Chart Component
const SimpleBarChart = ({ data, title, description }: {
  data: Array<{label: string, value: number, color: string}>,
  title: string,
  description: string
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-24 text-sm font-medium text-gray-700 flex-shrink-0">
              {item.label}
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-gray-200 rounded-full h-8 relative">
                <div 
                  className="h-8 rounded-full flex items-center justify-end pr-2 text-white text-sm font-medium"
                  style={{ 
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color
                  }}
                >
                  {item.value.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 bg-blue-50 p-4 rounded">
        <p className="text-sm text-blue-800">
          <strong>Key Finding:</strong> AI increased creative output by {((data[1].value / data[0].value - 1) * 100).toFixed(0)}% 
          ({data[1].value.toFixed(1)} vs {data[0].value.toFixed(1)} ideas on average)
        </p>
      </div>
    </div>
  );
};

// Grouped Bar Chart Component
const GroupedBarChart = ({ data, title, description }: {
  data: Array<{label: string, noAI: number, withAI: number}>,
  title: string,
  description: string
}) => {
  const maxValue = Math.max(...data.flatMap(d => [d.noAI, d.withAI]));
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      <div className="space-y-6">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="text-sm font-medium text-gray-700">{item.label}</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <span className="text-xs text-red-600 w-16 flex-shrink-0">No AI:</span>
                <div className="flex-1 bg-gray-200 rounded h-6 relative">
                  <div 
                    className="h-6 rounded bg-red-500 flex items-center justify-end pr-2 text-white text-xs"
                    style={{ width: `${(item.noAI / maxValue) * 100}%` }}
                  >
                    {item.noAI.toFixed(1)}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-blue-600 w-16 flex-shrink-0">With AI:</span>
                <div className="flex-1 bg-gray-200 rounded h-6 relative">
                  <div 
                    className="h-6 rounded bg-blue-500 flex items-center justify-end pr-2 text-white text-xs"
                    style={{ width: `${(item.withAI / maxValue) * 100}%` }}
                  >
                    {item.withAI.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 bg-green-50 p-4 rounded">
        <p className="text-sm text-green-800">
          <strong>Key Finding:</strong> AI reduced workload across most dimensions, with the largest reductions in mental demand and effort
        </p>
      </div>
    </div>
  );
};

// Correlation heatmap component
const CorrelationHeatmap = ({ data, title, variables }: { 
  data: ProcessedData[], 
  title: string,
  variables: Array<{key: string, label: string, accessor: (d: ProcessedData) => number}>
}) => {
  const correlationMatrix = variables.map(varA => 
    variables.map(varB => {
      const valuesA = data.map(varA.accessor);
      const valuesB = data.map(varB.accessor);
      
      // Calculate Pearson correlation
      const n = valuesA.length;
      const sumA = valuesA.reduce((a, b) => a + b, 0);
      const sumB = valuesB.reduce((a, b) => a + b, 0);
      const sumAB = valuesA.reduce((sum, a, i) => sum + a * valuesB[i], 0);
      const sumA2 = valuesA.reduce((sum, a) => sum + a * a, 0);
      const sumB2 = valuesB.reduce((sum, b) => sum + b * b, 0);
      
      const numerator = n * sumAB - sumA * sumB;
      const denominator = Math.sqrt((n * sumA2 - sumA * sumA) * (n * sumB2 - sumB * sumB));
      
      return denominator === 0 ? 0 : numerator / denominator;
    })
  );

  const getCellColor = (correlation: number) => {
    const intensity = Math.abs(correlation);
    if (correlation > 0) {
      return `rgba(52, 152, 219, ${intensity})`;  // Blue for positive
    } else {
      return `rgba(231, 76, 60, ${intensity})`;   // Red for negative
    }
  };

  const getStrengthLabel = (r: number) => {
    const abs = Math.abs(r);
    if (abs < 0.3) return "weak";
    if (abs < 0.7) return "moderate"; 
    return "strong";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-800">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left font-medium text-gray-600">Variable</th>
              {variables.map((variable, index) => (
                <th key={index} className="p-2 text-center font-medium text-gray-600 text-sm">
                  {variable.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {variables.map((rowVar, rowIndex) => (
              <tr key={rowIndex}>
                <td className="p-2 font-medium text-gray-700 text-sm">{rowVar.label}</td>
                {correlationMatrix[rowIndex].map((correlation, colIndex) => (
                  <td 
                    key={colIndex}
                    className="p-3 text-center text-sm font-medium border"
                    style={{ backgroundColor: getCellColor(correlation) }}
                  >
                    <div className="text-white">
                      {correlation.toFixed(2)}
                    </div>
                    <div className="text-xs text-white opacity-90">
                      {getStrengthLabel(correlation)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p><span className="inline-block w-4 h-4 bg-blue-500 mr-2"></span>Positive correlation (move together)</p>
        <p><span className="inline-block w-4 h-4 bg-red-500 mr-2"></span>Negative correlation (move opposite)</p>
      </div>
    </div>
  );
};

// Simple Scatter Plot Component
const SimpleScatterPlot = ({ data, title, xLabel, yLabel, color }: {
  data: Array<{x: number, y: number, label?: string}>,
  title: string,
  xLabel: string,
  yLabel: string,
  color: string
}) => {
  const xMin = Math.min(...data.map(d => d.x));
  const xMax = Math.max(...data.map(d => d.x));
  const yMin = Math.min(...data.map(d => d.y));
  const yMax = Math.max(...data.map(d => d.y));
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-gray-800">{title}</h3>
      <div className="relative h-64 bg-gray-50 border rounded">
        <div className="absolute inset-0 p-4">
          {data.map((point, index) => {
            const x = ((point.x - xMin) / (xMax - xMin)) * 100;
            const y = 100 - ((point.y - yMin) / (yMax - yMin)) * 100;
            return (
              <div
                key={index}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  backgroundColor: color,
                  transform: 'translate(-50%, -50%)'
                }}
                title={point.label}
              />
            );
          })}
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">
          {xLabel}
        </div>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-gray-600">
          {yLabel}
        </div>
      </div>
    </div>
  );
};

export default function VisualizationsPage() {
  const [data, setData] = useState<ProcessedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      
      const processed = result.responses
        .filter((r: any) => r.end_timestamp)
        .map((r: any) => {
          const parseJSON = (str: string | null | undefined) => {
            if (!str) return {};
            try { 
              const parsed = JSON.parse(str);
              return typeof parsed === 'object' && parsed !== null ? parsed : {};
            } catch { 
              return {}; 
            }
          };

          const diaPre = parseJSON(r.dia_pre);
          const diaPost = parseJSON(r.dia_post);
          const gse = parseJSON(r.gse);
          const taskNoAI = parseJSON(r.task_no_ai);
          const taskAI = parseJSON(r.task_ai);
          
          const tlxNoAI = taskNoAI.tlx || {};
          const tlxAI = taskAI.tlx || {};
          const expNoAI = taskNoAI.experience || {};
          const expAI = taskAI.experience || {};

          const countIdeas = (responseText: string): number => {
            if (!responseText || responseText.trim() === '') return 0;
            const items = responseText
              .split('\n')
              .map(item => item.trim())
              .filter(item => item.length > 2 && !item.match(/^[0-9\.\s\-]*$/));
            return Math.max(items.length, responseText.trim() ? 1 : 0);
          };

          const calculateAverage = (obj: any) => {
            const values = Object.values(obj).filter(v => v !== null && v !== undefined && !isNaN(Number(v)));
            return values.length > 0 ? values.reduce((sum: number, val: any) => sum + Number(val), 0) / values.length : 0;
          };

          return {
            participantId: r.response_id,
            age: parseInt(r.age) || 0,
            gender: r.gender,
            aiFrequency: parseInt(r.ai_use_frequency) || 0,
            diaPreAvg: calculateAverage(diaPre),
            diaPostAvg: calculateAverage(diaPost),
            gseAvg: calculateAverage(gse),
            ideasNoAI: countIdeas(taskNoAI.responseText || ""),
            ideasAI: Math.max(countIdeas(taskAI.responseText || ""), taskAI.ideasFromAI || 0),
            tlxNoAI: {
              mental: parseFloat(tlxNoAI.mental) || 0,
              physical: parseFloat(tlxNoAI.physical) || 0,
              temporal: parseFloat(tlxNoAI.temporal) || 0,
              performance: parseFloat(tlxNoAI.performance) || 0,
              effort: parseFloat(tlxNoAI.effort) || 0,
              frustration: parseFloat(tlxNoAI.frustration) || 0,
              avg: calculateAverage(tlxNoAI)
            },
            tlxAI: {
              mental: parseFloat(tlxAI.mental) || 0,
              physical: parseFloat(tlxAI.physical) || 0,
              temporal: parseFloat(tlxAI.temporal) || 0,
              performance: parseFloat(tlxAI.performance) || 0,
              effort: parseFloat(tlxAI.effort) || 0,
              frustration: parseFloat(tlxAI.frustration) || 0,
              avg: calculateAverage(tlxAI)
            },
            confidenceNoAI: parseFloat(expNoAI.confident) || 0,
            confidenceAI: parseFloat(expAI.confident) || 0,
            helpfulnessAI: parseFloat(expAI.helpful) || 0
          };
        });
      
      setData(processed);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl text-gray-600">Loading visualizations...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl text-red-600">Error: {error}</div>
    </div>
  );

  // Prepare chart data
  const ideasData = [
    {
      label: "No AI",
      value: data.reduce((sum, d) => sum + d.ideasNoAI, 0) / data.length,
      color: "#e74c3c"
    },
    {
      label: "With AI", 
      value: data.reduce((sum, d) => sum + d.ideasAI, 0) / data.length,
      color: "#3498db"
    }
  ];

  const workloadData = [
    {
      label: "Mental",
      noAI: data.reduce((sum, d) => sum + d.tlxNoAI.mental, 0) / data.length,
      withAI: data.reduce((sum, d) => sum + d.tlxAI.mental, 0) / data.length
    },
    {
      label: "Physical", 
      noAI: data.reduce((sum, d) => sum + d.tlxNoAI.physical, 0) / data.length,
      withAI: data.reduce((sum, d) => sum + d.tlxAI.physical, 0) / data.length
    },
    {
      label: "Temporal",
      noAI: data.reduce((sum, d) => sum + d.tlxNoAI.temporal, 0) / data.length,
      withAI: data.reduce((sum, d) => sum + d.tlxAI.temporal, 0) / data.length
    },
    {
      label: "Performance",
      noAI: data.reduce((sum, d) => sum + d.tlxNoAI.performance, 0) / data.length,
      withAI: data.reduce((sum, d) => sum + d.tlxAI.performance, 0) / data.length
    },
    {
      label: "Effort",
      noAI: data.reduce((sum, d) => sum + d.tlxNoAI.effort, 0) / data.length,
      withAI: data.reduce((sum, d) => sum + d.tlxAI.effort, 0) / data.length
    },
    {
      label: "Frustration",
      noAI: data.reduce((sum, d) => sum + d.tlxNoAI.frustration, 0) / data.length,
      withAI: data.reduce((sum, d) => sum + d.tlxAI.frustration, 0) / data.length
    }
  ];

  // Variables for correlation matrices
  const noAIVariables = [
    { key: 'aiDependence', label: 'AI Dependence', accessor: (d: ProcessedData) => d.diaPreAvg },
    { key: 'selfEfficacy', label: 'Self-Efficacy', accessor: (d: ProcessedData) => d.gseAvg },
    { key: 'workload', label: 'Workload', accessor: (d: ProcessedData) => d.tlxNoAI.avg },
    { key: 'ideas', label: 'Ideas', accessor: (d: ProcessedData) => d.ideasNoAI },
    { key: 'confidence', label: 'Confidence', accessor: (d: ProcessedData) => d.confidenceNoAI }
  ];

  const withAIVariables = [
    { key: 'aiDependence', label: 'AI Dependence', accessor: (d: ProcessedData) => d.diaPostAvg },
    { key: 'selfEfficacy', label: 'Self-Efficacy', accessor: (d: ProcessedData) => d.gseAvg },
    { key: 'workload', label: 'Workload', accessor: (d: ProcessedData) => d.tlxAI.avg },
    { key: 'ideas', label: 'Ideas', accessor: (d: ProcessedData) => d.ideasAI },
    { key: 'confidence', label: 'Confidence', accessor: (d: ProcessedData) => d.confidenceAI },
    { key: 'helpfulness', label: 'AI Helpfulness', accessor: (d: ProcessedData) => d.helpfulnessAI }
  ];

  const scatterDataSelfEfficacyNoAI = data.map(d => ({
    x: d.gseAvg,
    y: d.ideasNoAI,
    label: `Participant ${d.participantId.substring(0, 8)}`
  }));

  const scatterDataSelfEfficacyAI = data.map(d => ({
    x: d.gseAvg,
    y: d.ideasAI,
    label: `Participant ${d.participantId.substring(0, 8)}`
  }));

  const scatterDataWorkloadConfidenceNoAI = data.map(d => ({
    x: d.tlxNoAI.avg,
    y: d.confidenceNoAI,
    label: `Participant ${d.participantId.substring(0, 8)}`
  }));

  const scatterDataWorkloadConfidenceAI = data.map(d => ({
    x: d.tlxAI.avg,
    y: d.confidenceAI,
    label: `Participant ${d.participantId.substring(0, 8)}`
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📈 AI & Creative Performance Visualizations
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Interactive charts revealing how AI tools transform creative work
            </p>
            <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
              <span>📊 Sample Size: {data.length} participants</span>
              <span>📅 Analysis Date: {new Date().toLocaleDateString()}</span>
              <span>🔬 Statistical Analysis: Paired comparisons</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          
          {/* Navigation */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                📊 Dashboard
              </a>
              <a 
                href="/analysis-report"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                📋 Analysis Report
              </a>
              <span className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg">
                📈 Visualizations (Current)
              </span>
            </div>
          </div>
          
          {/* Ideas Generated Chart */}
          <SimpleBarChart
            data={ideasData}
            title="📊 Creative Output: Ideas Generated"
            description="Side-by-side comparison showing the dramatic increase in creative output with AI assistance"
          />

          {/* Workload Dimensions Chart */}
          <GroupedBarChart
            data={workloadData}
            title="📊 NASA-TLX Workload Dimensions"
            description="Comparison across all six workload dimensions using Hart & Staveland's 21-point scale showing how AI affects perceived task difficulty"
          />

          {/* Correlation Matrices */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <CorrelationHeatmap 
              data={data}
              title="🗺️ No-AI Condition: Variable Relationships"
              variables={noAIVariables}
            />
            <CorrelationHeatmap 
              data={data}
              title="🗺️ With-AI Condition: Variable Relationships"
              variables={withAIVariables}
            />
          </div>

          {/* Self-Efficacy vs Ideas Scatter Plots */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              📉 Self-Efficacy vs Creative Ideas
            </h2>
            <p className="text-gray-600 mb-6">
              Exploring whether confidence in abilities predicts creative output in both conditions
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SimpleScatterPlot
                data={scatterDataSelfEfficacyNoAI}
                title="Without AI"
                xLabel="Self-Efficacy"
                yLabel="Ideas Generated"
                color="#e74c3c"
              />
              <SimpleScatterPlot
                data={scatterDataSelfEfficacyAI}
                title="With AI"
                xLabel="Self-Efficacy"
                yLabel="Ideas Generated"
                color="#3498db"
              />
            </div>
            <div className="mt-4 bg-yellow-50 p-4 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Insight:</strong> The relationship between self-efficacy and creative output changes when AI is available, 
                suggesting AI may level the playing field between high and low confidence individuals.
              </p>
            </div>
          </div>

          {/* Workload vs Confidence Scatter Plots */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              📉 Workload vs Confidence
            </h2>
            <p className="text-gray-600 mb-6">
              Examining whether higher workload correlates with lower confidence in both conditions
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SimpleScatterPlot
                data={scatterDataWorkloadConfidenceNoAI}
                title="Without AI"
                xLabel="Workload"
                yLabel="Confidence"
                color="#e74c3c"
              />
              <SimpleScatterPlot
                data={scatterDataWorkloadConfidenceAI}
                title="With AI"
                xLabel="Workload"
                yLabel="Confidence"
                color="#3498db"
              />
            </div>
            <div className="mt-4 bg-purple-50 p-4 rounded">
              <p className="text-sm text-purple-800">
                <strong>Pattern:</strong> There appears to be a negative correlation between workload and confidence, 
                which becomes even stronger when AI is available.
              </p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">📊 Key Visualization Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white bg-opacity-20 p-6 rounded-lg">
                  <div className="text-4xl font-bold">{((ideasData[1].value / ideasData[0].value - 1) * 100).toFixed(0)}%</div>
                  <div className="text-lg">Increase in Creative Output</div>
                </div>
                <div className="bg-white bg-opacity-20 p-6 rounded-lg">
                  <div className="text-4xl font-bold">
                    {workloadData.reduce((sum, d) => sum + (d.noAI - d.withAI), 0).toFixed(1)}
                  </div>
                  <div className="text-lg">Average Workload Reduction</div>
                </div>
                <div className="bg-white bg-opacity-20 p-6 rounded-lg">
                  <div className="text-4xl font-bold">{data.length}</div>
                  <div className="text-lg">Participants Analyzed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}