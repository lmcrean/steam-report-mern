// QuizResults.jsx
import React, { useEffect } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { useQuizResultsData } from './results/QuizResultsDataLogic';
import { 
  ResultsSection, 
  PersonalityChart, 
  SubjectChart
} from './results/QuizResultsCharts';
import CareerRecommendation from './results/CareerRecommendation';

const QuizResults = () => {
  const { 
    username, 
    personalityAnswers, 
    subjectAnswers, 
    startTime,
    completionTime,
    moveToNextSection,
    updateState,
    validateQuizCompletion
  } = useQuiz();

  const {
    personalityData,
    subjectData,
    highestPersonalityTrait,
    highestSubject,
    careerFeedback
  } = useQuizResultsData(personalityAnswers, subjectAnswers);

  // Update context with results
  useEffect(() => {
    if (validateQuizCompletion() && personalityData.length && subjectData.length) {
      updateState({
        results: {
          personalityScores: Object.fromEntries(
            personalityData.map(item => [item.fullTrait, item.score])
          ),
          subjectScores: Object.fromEntries(
            subjectData.map(item => [item.subject, item.score])
          ),
          highestPersonalityTrait,
          highestSubject,
          careerFeedback,
          timeTaken: completionTime ? new Date(completionTime) - new Date(startTime) : null
        }
      });
    }
  }, [personalityData, subjectData, updateState, validateQuizCompletion]);

  if (!validateQuizCompletion()) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-gray-600">Loading results...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <ResultsSection title="Your Results">
        <p className="text-gray-600">
          Hi {username}, here's your personalized career analysis based on your quiz responses.
        </p>
      </ResultsSection>

      {/* Personality Profile */}
      <ResultsSection title="Personality Profile">
        <PersonalityChart data={personalityData} />
      </ResultsSection>

      {/* Subject Performance */}
      <ResultsSection title="Subject Performance">
        <SubjectChart data={subjectData} />
      </ResultsSection>

      {/* Time Taken */}
      {startTime && completionTime && (
        <ResultsSection title="Quiz Statistics">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">
              Time taken: {Math.round((new Date(completionTime) - new Date(startTime)) / 60000)} minutes
            </p>
          </div>
        </ResultsSection>
      )}

      {/* Career Recommendations */}
      <ResultsSection title="Career Recommendations">
        <CareerRecommendation 
          careerFeedback={careerFeedback}
          highestPersonalityTrait={highestPersonalityTrait}
          highestSubject={highestSubject}
        />
      </ResultsSection>

      {/* Navigation */}
      <div className="flex justify-end">
        <button
          onClick={moveToNextSection}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Leaderboard
        </button>
      </div>
    </div>
  );
};

export default QuizResults;