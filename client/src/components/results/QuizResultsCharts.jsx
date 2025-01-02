// QuizResultsCharts.jsx
import React, { useEffect, useRef } from 'react';

import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell 
} from 'recharts';
import { formatScore } from './QuizResultsDataLogic.js';

const CHART_HEIGHT = 400;
const CHART_MARGIN = { top: 20, right: 30, left: 20, bottom: 20 };

const COLORS = {
  default: '#3B82F6',  // Blue
  highest: '#22C55E',  // Green
  preferred: '#8B5CF6', // Purple
};

export const ResultsChart = ({ data, type = 'bar', xKey, yKey }) => {
  if (!Array.isArray(data) || data.length === 0) {

    return null;
  }

  const maxScore = Math.max(...data.map(item => Number(item.score)));

  const getBarColor = (entry) => {
    if (entry.isPreferred) return COLORS.preferred;
    return Number(entry.score) === maxScore ? COLORS.highest : COLORS.default;
  };

  return (
    <div style={{ width: '100%', height: CHART_HEIGHT }} className="mb-6">
      <ResponsiveContainer>
        {type === 'bar' ? (
          <BarChart 
            data={data}
            margin={CHART_MARGIN}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey={xKey}
              tick={{ fontSize: 14 }}
              tickLine={false}
            />
            <YAxis 
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const data = payload[0].payload;
                const isHighest = Number(data.score) === maxScore;
                return (
                  <div className="bg-dark p-2 shadow-lg border rounded">
                    <p className="font-medium">
                      {data.fullTrait || data.trait || data.subject}
                      {data.isPreferred && ' (Preferred)'}
                    </p>
                    <p className={`font-semibold ${
                      data.isPreferred 
                        ? 'text-purple-600'
                        : isHighest 
                          ? 'text-green-600' 
                          : 'text-blue-600'
                    }`}>
                      Score: {formatScore(data.score)}%
                    </p>
                  </div>
                );
              }}
            />
            <Legend 
              formatter={() => 'Score %'} 
              iconType="none"
            />
            <Bar 
              dataKey={yKey}
              name="Score %"
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={getBarColor(entry)}
                />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <LineChart 
            data={data}
            margin={CHART_MARGIN}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="subject"
              tick={{ fontSize: 14 }}
              tickLine={false}
            />
            <YAxis 
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Score']}
              labelStyle={{ color: '#374151' }}
            />
            <Legend />
            <Line 
              type="monotone"
              dataKey="score"
              stroke={COLORS.default}
              strokeWidth={2}
              dot={{ r: 4, fill: COLORS.default }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export const PersonalityChart = ({ data }) => {
  const chartData = data.map(item => ({
    trait: item.trait || item.fullTrait?.substring(0, 3) || '',
    fullTrait: item.fullTrait,
    score: Number(item.score),
    isPreferred: item.isPreferred
  }));

  const maxScore = Math.max(...chartData.map(item => item.score));

  const prevChartDataRef = useRef();

  useEffect(() => {
    const prevChartData = prevChartDataRef.current;
    const concatenatedResults = chartData.map(item => `${item.fullTrait} - ${formatScore(item.score)}%`).join(', ');

    if (JSON.stringify(prevChartData) !== JSON.stringify(chartData)) {

      prevChartDataRef.current = chartData;
    }
  }, [chartData]);

  return (
    <div className="space-y-6">
      <ResultsChart data={chartData} type="bar" xKey="trait" yKey="score" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chartData.map(item => (
          <ScoreCard 
            key={item.trait}
            title={item.fullTrait}
            score={item.score}
            isHighest={item.score === maxScore}
            isPreferred={item.isPreferred}
          />
        ))}
      </div>
    </div>
  );
};

export const SubjectChart = ({ data }) => {
  const chartData = data.map(item => ({
    subject: item.subject,
    score: Number(item.score),
  }));

  const maxScore = Math.max(...chartData.map(item => item.score));

  const prevChartDataRef = useRef();

  useEffect(() => {
    const prevChartData = prevChartDataRef.current;
    const concatenatedResults = chartData.map(item => `${item.subject} - ${formatScore(item.score)}%`).join(', ');

    if (JSON.stringify(prevChartData) !== JSON.stringify(chartData)) {

      prevChartDataRef.current = chartData;
    }
  }, [chartData]);

  return (
    <div className="space-y-6">
      <ResultsChart data={chartData} type="bar" xKey="subject" yKey="score" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {chartData.map(item => (
          <ScoreCard 
            key={item.subject}
            title={item.subject}
            score={item.score}
            isHighest={item.score === maxScore}
            isPreferred={item.isPreferred}
          />
        ))}
      </div>
    </div>
  );
};

export const ScoreCard = ({ title, score, isHighest, isPreferred, extraClasses = '' }) => (
  <div 
    className={`p-4 rounded-lg transition-colors ${
      isPreferred
        ? 'bg-purple-50 dark:bg-purple-900/20'
        : isHighest 
          ? 'bg-green-50 dark:bg-green-900/20' 
          : 'bg-gray-50 dark:bg-slate-800'
    } ${extraClasses}`}
  >
    <h4 className="font-medium text-gray-700 dark:text-gray-200">
      {title}
      {isPreferred && (
        <span className="ml-2 text-sm text-purple-600 dark:text-purple-400">
          (Preferred)
        </span>
      )}
      {isHighest && !isPreferred && (
        <span className="ml-2 text-sm text-green-600 dark:text-green-400">
          (Highest)
        </span>
      )}
    </h4>
    <p className={`font-semibold text-xl ${
      isPreferred 
        ? 'text-purple-600 dark:text-purple-400'
        : isHighest 
          ? 'text-green-600 dark:text-green-400' 
          : 'text-blue-600 dark:text-blue-400'
    }`}>
      {formatScore(score)}%
    </p>
  </div>
);

export const ResultsSection = ({ title, children }) => (
  <div className="bg-dark dark:bg-slate-800 rounded-lg p-6 shadow-sm">
    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
      {title}
    </h3>
    {children}
  </div>
);