import React, { useEffect, useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculatePersonalityScores, calculateSubjectScores, convertScoreToPercentage } from '../../utils/scoreCalculator';
import { getCareerFeedback } from '../../data/feedbackDatabase';

const QuizResults = () => {
  const { username, personalityAnswers, subjectAnswers, moveToNextSection } = useQuiz();
  const [personalityScores, setPersonalityScores] = useState({});
  const [subjectScores, setSubjectScores] = useState({});
  const [careerFeedback, setCareerFeedback] = useState(null);

  useEffect(() => {
    if (personalityAnswers.length && subjectAnswers.length) {
      const pScores = calculatePersonalityScores(personalityAnswers);
      const sScores = calculateSubjectScores(subjectAnswers);
      
      setPersonalityScores(pScores);
      setSubjectScores(sScores);

      // Get highest scores
      const highestPersonalityTrait = Object.entries(pScores)
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];
      
      const highestSubject = Object.entries(sScores)
        .filter(([key]) => key !== 'Total')
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];

      // Get career feedback based on highest scores
      const feedback = getCareerFeedback(highestSubject, highestPersonalityTrait);
      setCareerFeedback(feedback);
    }
  }, [personalityAnswers, subjectAnswers]);

  const personalityData = Object.entries(personalityScores).map(([trait, score]) => ({
    trait,
    score: convertScoreToPercentage(score, 45)
  }));

  const subjectData = Object.entries(subjectScores)
    .filter(([key]) => key !== 'Total')
    .map(([subject, score]) => ({
      subject,
      score: (score / 10) * 100
    }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-2">Your Results</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Hi {username}, here's your personalized career analysis based on your quiz responses.
        </p>
      </div>

      {/* Personality Profile */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Personality Profile</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <BarChart data={personalityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="trait" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#3B82F6" name="Score %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Subject Performance</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <LineChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3B82F6" 
                name="Score %"
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Career Recommendations */}
      {careerFeedback && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Career Recommendations</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300">
                Ideal Work Environment
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                You thrive in {careerFeedback.environment} environments where {careerFeedback.thrive}.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300">
                Career Recommendation
              </h4>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {careerFeedback.feedback}
              </p>
            </div>
          </div>
        </div>
      )}

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