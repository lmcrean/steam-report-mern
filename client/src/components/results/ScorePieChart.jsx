import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 rounded shadow">
        <p className="text-sm dark:text-white">{`${payload[0].name}: ${payload[0].value.toFixed(0)}%`}</p>
      </div>
    );
  }
  return null;
};

const PieChartSection = ({ data, title }) => {
  const chartData = Object.entries(data)
    .map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(1))
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white text-center">{title}</h3>
      <div className="h-[400px]" data-testid={`${title.toLowerCase().replace(' ', '-')}-chart`}>
        <ResponsiveContainer width="100%" height="100%" debounce={0}>
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name} (${value.toFixed(0)}%)`}
              labelLine={true}
              isAnimationActive={false}
              minAngle={5}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: 'currentColor' }}
              verticalAlign="bottom"
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const ScorePieChart = ({ personalityData, subjectData }) => {
  return (
    <div data-testid="charts-container" className="w-full">
      <h2 className="text-2xl font-bold mb-8 text-center">Detailed Score Breakdown</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PieChartSection 
          data={personalityData} 
          title="Personality Traits"
        />
        <PieChartSection 
          data={subjectData} 
          title="Subject Areas"
        />
      </div>
    </div>
  );
};

export default ScorePieChart; 