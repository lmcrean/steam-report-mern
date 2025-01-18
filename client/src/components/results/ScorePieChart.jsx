import React, { useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand } from '@fortawesome/free-solid-svg-icons';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

/**
 * ScorePieChart Component
 * Renders a pie chart visualization of score data using Chart.js

 * 
 */
const ScorePieChart = ({ data, onFullScreen }) => {
  // Transform the input data into Chart.js compatible format
  const chartData = React.useMemo(() => ({
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data).map(value => parseFloat(value.toFixed(1))),
        backgroundColor: COLORS,
        borderColor: '#1a1f2e',
        borderWidth: 0,
      },
    ],
  }), [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    layout: {
      padding: {
        top: 30,
        right: 20,
        bottom: 20,
        left: 20
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#1f2937',
        titleColor: 'white',
        bodyColor: 'white',
        bodyFont: {
          size: 14,
        },
        padding: 12,
        cornerRadius: 4,
        displayColors: false,
        callbacks: {
          label: (context) => `${context.label}: ${context.raw.toFixed(0)}%`,
        },
      },
    },
  };

  return (
    <div className="relative w-full flex items-center justify-center" data-testid="pie-chart-container">
      <div className="relative w-full max-w-[300px] aspect-square">
        <button 
          onClick={onFullScreen}
          className="absolute top-2 right-2 z-20 p-2 text-white hover:text-blue-400 transition-colors bg-gray-800 rounded-full shadow-lg"
          aria-label="View full screen"
        >
          <FontAwesomeIcon icon={faExpand} className="w-4 h-4" />
        </button>
        <div className="w-full h-full">
          <Pie 
            data={chartData} 
            options={options}
            data-testid="pie-chart"
          /> {/* ISSUE - TODO: chartData does not render in test view 
          [ ] - add a test to check if the chartData retrieves the data as expected
          */}
        </div>
      </div>
    </div>
  );
};

export default ScorePieChart; 