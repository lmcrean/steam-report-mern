import React, { useContext, useState } from 'react';
import { QuizContext } from '../../context/QuizContext';
import CareerRecommendation from './CareerRecommendation';
import ScorePieChart from './ScorePieChart';
import PieChartModal from './PieChartModal';
import { useNavigate } from 'react-router-dom';
import { useSubmitResults } from '../network-board/usePostResult';
import { usePrepareResult } from '../../context/usePrepareResult';
import NetworkBoardSubmitButton from '../network-board/NetworkBoardSubmitButton';

const QuizResults = () => {
  const { state } = useContext(QuizContext);
  const navigate = useNavigate();
  const submitResults = useSubmitResults();
  const [showPieCharts, setShowPieCharts] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { 
    traitPercentages,
    subjectPercentages,
    preferredTrait,
    preferredSubject,
    preferredEnvironment
  } = state;

  const { 
    maxPersonalityTrait,
    maxSubjectName,
    isReady
  } = usePrepareResult();

  if (!isReady) {
    return <div>Preparing your results...</div>;
  }

  const getTraitColor = (trait, score) => {
    if (score === maxPersonalityTrait && trait === preferredTrait) {
      return 'text-purple-600';
    } else if (score === maxPersonalityTrait) {
      return 'text-green-600';
    }
    return 'text-blue-600';
  };

  const getSubjectColor = (subject, score) => {
    if (score === maxSubjectName && subject === preferredSubject) {
      return 'text-purple-600';
    } else if (score === maxSubjectName) {
      return 'text-green-600';
    }
    return 'text-blue-600';
  };

  // Calculate relative percentages for pie charts
  const calculateRelativePercentages = (scores) => {
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    return Object.entries(scores).reduce((acc, [key, value]) => {
      acc[key] = (value / total) * 100;
      return acc;
    }, {});
  };

  const ToggleSwitch = () => (
    <div className="flex items-center justify-center mb-6">
      <span className="mr-3 text-sm">Breakdown</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={showPieCharts}
          onChange={() => setShowPieCharts(!showPieCharts)}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      </label>
      <span className="ml-3 text-sm">Pie Chart</span>
    </div>
  );

  const ScoresSection = () => {
    const relativeTraitPercentages = calculateRelativePercentages(traitPercentages);
    const relativeSubjectPercentages = calculateRelativePercentages(subjectPercentages);

    return (
      <div className="w-full lg:w-1/4 space-y-8">
        <ToggleSwitch />
        {/* Personality Scores */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Personality Traits</h3>
          {showPieCharts ? (
            <div className="aspect-square w-full">
              <ScorePieChart 
                data={relativeTraitPercentages}
                onFullScreen={() => setIsModalOpen(true)}
              />
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(traitPercentages).map(([trait, score]) => (
                <div key={trait} className="flex justify-between">
                  <span className={getTraitColor(trait, score)}>{trait}</span>
                  <span>{score}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subject Scores */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Subject Areas</h3>
          {showPieCharts ? (
            <div className="aspect-square w-full">
              <ScorePieChart 
                data={relativeSubjectPercentages}
                onFullScreen={() => setIsModalOpen(true)}
              />
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(subjectPercentages).map(([subject, score]) => (
                <div key={subject} className="flex justify-between">
                  <span className={getSubjectColor(subject, score)}>{subject}</span>
                  <span>{score}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <PieChartModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          personalityData={relativeTraitPercentages}
          subjectData={relativeSubjectPercentages}
        />
      </div>
    );
  };

  const handleSubmitResults = async () => {
    const results = {
      traitPercentages,
      subjectPercentages,
      preferredTrait,
      preferredSubject,
      maxPersonalityTrait,
      maxSubjectName,
      preferredEnvironment,
      timestamp: new Date().toISOString()
    };

    try {
      await submitResults(results);
      navigate('/network-board');
    } catch (error) {
      console.error('Failed to submit results:', error);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Your Results</h2>
        
        {/* First Row - Top Scores */}
        <div className="mb-12">          
          <CareerRecommendation 
            maxSubjectScore={maxSubjectName}
            maxPersonalityScore={maxPersonalityTrait}
            layout="top-images"
          />
          <p className="text-center text-lg mb-8">{maxSubjectName} and {maxPersonalityTrait} were your top scores</p>
        </div>

        {/* Second Row - Detailed Information */}
        <div className="flex flex-col lg:flex-row gap-8">
          <ScoresSection />

          {/* Career Recommendations Section split into columns */}
          <div className="w-full lg:w-3/4 flex flex-col lg:flex-row gap-8">
            <CareerRecommendation 
              maxSubjectScore={maxSubjectName}
              maxPersonalityScore={maxPersonalityTrait}
              layout="split-content"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <NetworkBoardSubmitButton onSubmit={handleSubmitResults} />
      </div>
    </div>
  );
};

export default QuizResults;