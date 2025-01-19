import React, { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import CareerRecommendation from './CareerRecommendation';
import ScorePieChart from './ScorePieChart';
import { useNavigate } from 'react-router-dom';
import { useSubmitResults } from '../network-board/usePostResult';
import { usePrepareResult } from '../../context/usePrepareResult';
import NetworkBoardSubmitButton from '../network-board/NetworkBoardSubmitButton';

const QuizResults = () => {
  const { state } = useContext(QuizContext);
  const navigate = useNavigate();
  const submitResults = useSubmitResults();
  
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

  const handleSubmitToNetworkBoard = async () => {
    const success = await submitResults({
      maxSubjectName,
      maxPersonalityTrait,
      subjectPercentages,
      traitPercentages,
      preferredTrait,
      preferredSubject,
      preferredEnvironment
    });
    
    if (success) {
      navigate('/network-board');
    }
  };

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

  const relativeTraitPercentages = calculateRelativePercentages(traitPercentages);
  const relativeSubjectPercentages = calculateRelativePercentages(subjectPercentages);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Row 1: Heading and Images */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-2">Your Results</h2>
        <p className="text-center text-lg mb-8">{maxSubjectName} and {maxPersonalityTrait} are your best match!</p>
        <CareerRecommendation 
          maxSubjectScore={maxSubjectName}
          maxPersonalityScore={maxPersonalityTrait}
          subjectScore={subjectPercentages[maxSubjectName]}
          personalityScore={traitPercentages[maxPersonalityTrait]}
          layout="top-images"
        />
      </div>

      {/* Row 2: Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Column 1: Score Breakdowns */}
        <div className="space-y-8">
          {/* Personality Scores */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Personality Traits</h3>
            <div className="space-y-2">
              {Object.entries(traitPercentages).map(([trait, score]) => (
                <div key={trait} className="flex justify-between">
                  <span className={getTraitColor(trait, score)}>{trait}</span>
                  <span>{score}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Scores */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Subject Areas</h3>
            <div className="space-y-2">
              {Object.entries(subjectPercentages).map(([subject, score]) => (
                <div key={subject} className="flex justify-between">
                  <span className={getSubjectColor(subject, score)}>{subject}</span>
                  <span>{score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Environment and Feedback */}
        <div>
          <CareerRecommendation 
            maxSubjectScore={maxSubjectName}
            maxPersonalityScore={maxPersonalityTrait}
            subjectScore={traitPercentages[maxSubjectName]}
            personalityScore={traitPercentages[maxPersonalityTrait]}
            layout="content-only"
          />
        </div>

        {/* Column 3: Career Paths */}
        <div>
          <CareerRecommendation 
            maxSubjectScore={maxSubjectName}
            maxPersonalityScore={maxPersonalityTrait}
            subjectScore={traitPercentages[maxSubjectName]}
            personalityScore={traitPercentages[maxPersonalityTrait]}
            layout="career-paths-only"
          />
        </div>
      </div>

      {/* Row 3: Pie Charts */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-center mb-8">Detailed Score Breakdown</h3>
        <ScorePieChart 
          personalityData={relativeTraitPercentages}
          subjectData={relativeSubjectPercentages}
        />
      </div>

      {/* Network Board Submit Button */}
      <div className="flex justify-center network-board">
        <NetworkBoardSubmitButton onSubmit={handleSubmitToNetworkBoard} />
      </div>
    </div>
  );
};

export default QuizResults;