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
    <div className="w-full flex flex-col items-center mb-16">
      <h3 className="text-lg font-semibold mb-8 text-gray-900 dark:text-white text-center">{title}</h3>
      <div className="w-full max-w-[800px] aspect-[4/3] relative" data-testid={`${title.toLowerCase().replace(' ', '-')}-chart`}> 
        <ResponsiveContainer width="110%" height="100%" debounce={0}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius="70%"
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
              wrapperStyle={{ 
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: '0',
                width: '100%',
                marginTop: '40px',
                color: 'currentcolor'
              }}
              verticalAlign="bottom"
              align="center"
              layout="horizontal"
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const ScorePieChart = ({ personalityData, subjectData }) => {
  return (
    <div data-testid="charts-container" className="w-full max-w-[1200px] mx-auto px-4">
      <div className="flex flex-col">
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