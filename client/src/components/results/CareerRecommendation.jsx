// CareerRecommendation.jsx
import React from 'react';
import { ResultsSection } from './QuizResultsCharts';

const StrengthsCard = ({ highestPersonalityTrait, highestSubject }) => (
  <div className="bg-blue-50 p-4 rounded-lg">
    <h4 className="font-medium text-gray-700">Key Strengths</h4>
    <div className="mt-2 space-y-2">
      {highestPersonalityTrait && (
        <div>
          <span className="text-gray-600 font-medium">Strongest trait: </span>
          <span className="text-blue-600">{highestPersonalityTrait}</span>
        </div>
      )}
      {highestSubject && (
        <div>
          <span className="text-gray-600 font-medium">Best subject: </span>
          <span className="text-blue-600">{highestSubject}</span>
        </div>
      )}
    </div>
  </div>
);

const RecommendationCard = ({ feedback }) => (
  <div className="bg-green-50 p-4 rounded-lg">
    <h4 className="font-medium text-gray-700">Career Paths</h4>
    {feedback.environment && (
      <div className="mt-2 text-gray-600">
        <p className="font-medium">Ideal Work Environment:</p>
        <p>You thrive in {feedback.environment} environments where {feedback.thrive}.</p>
      </div>
    )}
    {feedback.feedback && (
      <div className="mt-4 text-gray-600">
        <p className="font-medium">Recommendation:</p>
        <p className="whitespace-pre-line">{feedback.feedback}</p>
      </div>
    )}
  </div>
);

const CareerSummary = ({ personalityTrait, subject }) => (
  <div className="bg-yellow-50 p-4 rounded-lg">
    <h4 className="font-medium text-gray-700">Quick Summary</h4>
    <p className="mt-2 text-gray-600">
      Based on your results, consider careers that combine your strong{' '}
      <span className="text-blue-600 font-medium">{subject?.toLowerCase()}</span> skills 
      with your{' '}
      <span className="text-blue-600 font-medium">{personalityTrait?.toLowerCase()}</span> tendencies.
    </p>
  </div>
);

const CareerRecommendation = ({ 
  careerFeedback, 
  highestPersonalityTrait, 
  highestSubject 
}) => {
  if (!highestPersonalityTrait || !highestSubject) {
    return (
      <ResultsSection title="Career Recommendations">
        <div className="text-center text-gray-600">
          Completing both quizzes is required for career recommendations.
        </div>
      </ResultsSection>
    );
  }

  return (
    <ResultsSection title="Career Recommendations">
      <div className="space-y-6">
        <StrengthsCard 
          highestPersonalityTrait={highestPersonalityTrait}
          highestSubject={highestSubject}
        />
        
        {careerFeedback && (
          <RecommendationCard feedback={careerFeedback} />
        )}
        
        <CareerSummary 
          personalityTrait={highestPersonalityTrait}
          subject={highestSubject}
        />
      </div>
    </ResultsSection>
  );
};

export default CareerRecommendation;