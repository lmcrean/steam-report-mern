import React, { useEffect, useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import { useQuizResultsData } from './results/QuizResultsDataLogic';
import { 
  ResultsSection, 
  PersonalityChart, 
  SubjectChart
} from './results/QuizResultsCharts';
import CareerRecommendation from './results/CareerRecommendation';

const QuizResults = () => {
  const { state, updateState } = useContext(QuizContext);
  const { 
    personalityScores,
    subjectScores,
    preferredTrait,
    preferredSubject,
    startTime,
    completionTime
  } = state;

  const {
    personalityData,
    subjectData,
    highestPersonalityTrait,
    highestSubject,
    careerFeedback
  } = useQuizResultsData(
    personalityScores,
    subjectScores,
    preferredTrait,
    preferredSubject
  );

  useEffect(() => {
    if (personalityData.length && subjectData.length) {
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
          preferredTrait,
          preferredSubject,
          careerFeedback,
          timeTaken: completionTime ? new Date(completionTime) - new Date(startTime) : null
        }
      });
    }
  }, [personalityData, subjectData]);

  if (!personalityData.length || !subjectData.length) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Loading results...
        </p>
      </div>
    );
  }

  // Calculate time taken in minutes
  const timeTakenMinutes = startTime && completionTime 
    ? Math.round((new Date(completionTime) - new Date(startTime)) / 60000) 
    : null;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <ResultsSection title="Your Results">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Hi {state.username}, here's your personalized career analysis based on your quiz responses
            {(preferredTrait || preferredSubject) && ' and preferences'}.
          </p>
          
          {/* Preferences Display */}
          {(preferredTrait || preferredSubject) && (
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-purple-700 dark:text-purple-300 font-medium">
                Your Selected Preferences:
              </p>
              <ul className="mt-2 space-y-1 text-purple-600 dark:text-purple-200">
                {preferredTrait && (
                  <li>• Personality Trait: {preferredTrait}</li>
                )}
                {preferredSubject && (
                  <li>• Subject Area: {preferredSubject}</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </ResultsSection>

      {/* Personality Profile */}
      <ResultsSection title="Personality Profile">
        <PersonalityChart data={personalityData} />
      </ResultsSection>

      {/* Subject Performance */}
      <ResultsSection title="Subject Performance">
        <SubjectChart data={subjectData} />
      </ResultsSection>

      {/* Quiz Statistics */}
      {timeTakenMinutes && (
        <ResultsSection title="Quiz Statistics">
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300">
              Time taken: {timeTakenMinutes} minutes
            </p>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Sections completed: Personality Assessment, Subject Knowledge
              {(preferredTrait || preferredSubject) && ', Preference Selection'}
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
          preferredTrait={preferredTrait}
          preferredSubject={preferredSubject}
        />
      </ResultsSection>

      {/* Navigation */}
      <div className="flex justify-end">
        <button
          onClick={state.moveToNextSection}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          View Leaderboard
        </button>
      </div>
    </div>
  );
};

export default QuizResults;