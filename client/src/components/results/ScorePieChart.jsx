import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand } from '@fortawesome/free-solid-svg-icons';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-2 rounded shadow border border-gray-700">
        <p className="text-sm text-white font-medium">{`${payload[0].name}: ${payload[0].value.toFixed(0)}%`}</p>
      </div>
    );
  }
  return null;
};

const ScorePieChart = ({ data, onFullScreen }) => {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(1))
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="relative w-full h-full min-h-[300px] md:min-h-[400px] flex items-center justify-center">
      <div className="relative w-full h-full max-w-[400px] max-h-[400px] aspect-square">
        <button 
          onClick={onFullScreen}
          className="absolute top-2 right-2 z-10 p-2 text-white hover:text-blue-400 transition-colors bg-gray-800 rounded-full shadow-lg"
          aria-label="View full screen"
        >
          <FontAwesomeIcon icon={faExpand} className="w-4 h-4" />
        </button>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius="95%"
              fill="#8884d8"
              paddingAngle={0}
              dataKey="value"
              minAngle={15}
              isAnimationActive={false}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="#1a1f2e"
                  strokeWidth={0}
                  className="recharts-sector"
                />
              ))}
            </Pie>
            <Tooltip 
              content={<CustomTooltip />}
              wrapperStyle={{ outline: 'none' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScorePieChart; 