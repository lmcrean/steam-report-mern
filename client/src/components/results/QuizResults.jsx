import React, { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';

const QuizResults = () => {
  const { state } = useContext(QuizContext);
  const { 
    personalityScores,
    subjectScores,
    preferredTrait,
    preferredSubject
  } = state;

  // Calculate max scores
  const maxPersonalityScore = Math.max(...Object.values(personalityScores));
  const maxSubjectScore = Math.max(...Object.values(subjectScores));

  const getTraitColor = (trait, score) => {
    if (score === maxPersonalityScore && trait === preferredTrait) {
      return 'text-purple-600';
    } else if (score === maxPersonalityScore) {
      return 'text-green-600';
    }
    return 'text-blue-600';
  };

  const getSubjectColor = (subject, score) => {
    if (score === maxSubjectScore && subject === preferredSubject) {
      return 'text-purple-600';
    } else if (score === maxSubjectScore) {
      return 'text-green-600';
    }
    return 'text-blue-600';
  };

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Your Results</h2>

      {/* Personality Scores */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Personality Traits</h3>
        <div className="space-y-2">
          {Object.entries(personalityScores).map(([trait, score]) => (
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
          {Object.entries(subjectScores).map(([subject, score]) => (
            <div key={subject} className="flex justify-between">
              <span className={getSubjectColor(subject, score)}>{subject}</span>
              <span>{score}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizResults;