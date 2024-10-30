import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatScore } from './QuizResultsDataLogic.js';

// Constants for chart dimensions and styling
const CHART_HEIGHT = 400;
const CHART_MARGIN = { top: 20, right: 30, left: 20, bottom: 20 };

export const ResultsChart = ({ data, type = 'bar' }) => {
  if (!Array.isArray(data) || data.length === 0) {
    console.log('No data available for chart');
    return null;
  }

  // Debug log
  console.log('Chart data:', data);

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
              dataKey="trait"
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
            <Bar 
              dataKey="score"
              fill="#3B82F6"
              name="Score %"
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            />
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
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 4, fill: '#3B82F6' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export const PersonalityChart = ({ data }) => {
  // Ensure data is properly formatted
  const chartData = data.map(item => ({
    trait: item.trait || item.fullTrait?.substring(0, 3) || '',
    fullTrait: item.fullTrait,
    score: Number(item.score)
  }));

  // Debug log
  console.log('Personality chart data:', chartData);

  return (
    <div className="space-y-6">
      <ResultsChart data={chartData} type="bar" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chartData.map(item => (
          <ScoreCard 
            key={item.fullTrait}
            title={item.fullTrait}
            score={item.score}
          />
        ))}
      </div>
    </div>
  );
};

export const SubjectChart = ({ data }) => {
  // Ensure data is properly formatted
  const chartData = data.map(item => ({
    subject: item.subject,
    score: Number(item.score)
  }));

  // Debug log
  console.log('Subject chart data:', chartData);

  return (
    <div className="space-y-6">
      <ResultsChart data={chartData} type="line" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {chartData.map(item => (
          <ScoreCard 
            key={item.subject}
            title={item.subject}
            score={item.score}
          />
        ))}
      </div>
    </div>
  );
};

// Other components remain the same
export const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  return (
    <div className="bg-white p-2 shadow-lg border rounded">
      <p className="font-medium">{data.fullTrait || data.subject}</p>
      <p className="text-blue-600">Score: {formatScore(payload[0].value)}%</p>
    </div>
  );
};

export const ScoreCard = ({ title, score, extraClasses = '' }) => (
  <div className={`bg-gray-50 p-4 rounded-lg ${extraClasses}`}>
    <h4 className="font-medium text-gray-700">{title}</h4>
    <p className="text-blue-600 font-semibold text-xl">
      {formatScore(score)}%
    </p>
  </div>
);

export const ResultsSection = ({ title, children }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    {children}
  </div>
);