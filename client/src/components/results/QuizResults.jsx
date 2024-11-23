import React, { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import CareerRecommendation from './CareerRecommendation';
import { useNavigate } from 'react-router-dom';
import { useSubmitResults } from '../network-board/usePostResult';
import { usePrepareResult } from '../../context/usePrepareResult';

const QuizResults = () => {
  const { state } = useContext(QuizContext);
  const navigate = useNavigate();
  const submitResults = useSubmitResults();
  
  const { 
    traitPercentages,
    subjectPercentages,
    preferredTrait,
    preferredSubject
  } = state;
  
  console.log('🎯 QuizResults - Current State:', {
    traitPercentages,
    subjectPercentages,
    isReady: state.isReady
  });
  
  const { 
    maxPersonalityTrait,
    maxSubjectName,
    isReady
  } = usePrepareResult();
  
  console.log('📊 QuizResults - Prepared Results:', {
    maxPersonalityTrait,
    maxSubjectName,
    isReady
  });

  if (!isReady) {
    console.log('⏳ Results not ready yet');
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

  const handleSubmitResults = async () => {
    const results = {
      traitPercentages,
      subjectPercentages,
      preferredTrait,
      preferredSubject,
      maxPersonalityTrait,
      maxSubjectName,
      timestamp: new Date().toISOString()
    };

    await submitResults(results);
  };

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Your Results</h2>

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

      <CareerRecommendation 
        maxSubjectScore={maxSubjectName}
        maxPersonalityScore={maxPersonalityTrait}
      />

      {/* Add submission button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSubmitResults}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Share Results to Network Board
        </button>
      </div>
    </div>
  );
};

export default QuizResults;