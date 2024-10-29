import React, { useMemo } from 'react';
import { useQuiz } from '../../context/QuizContext';

const QuizLeaderboard = () => {
  const { username, personalityAnswers, subjectAnswers } = useQuiz();

  // Calculate scores from context data
  const leaderboardData = useMemo(() => {
    // For demo, create some sample entries including the current user
    const demoEntries = [
      { username: 'Alex123', score: 42, bestSubject: 'Science' },
      { username: 'SamTest', score: 38, bestSubject: 'Math' },
      { username: 'TechPro', score: 35, bestSubject: 'Technology' }
    ];

    // Calculate current user's score
    const currentUserScore = subjectAnswers.filter(Boolean).length;
    const subjects = ['Science', 'Technology', 'English', 'Art', 'Math'];
    const subjectScores = subjects.map((_, i) => 
      subjectAnswers.slice(i * 10, (i + 1) * 10).filter(Boolean).length
    );
    const bestSubject = subjects[subjectScores.indexOf(Math.max(...subjectScores))];

    // Add current user's entry
    const currentUser = {
      username,
      score: currentUserScore,
      bestSubject
    };

    // Combine and sort all entries
    return [...demoEntries, currentUser]
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));
  }, [username, subjectAnswers]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
          Leaderboard
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Best Subject
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {leaderboardData.map((entry) => (
                <tr 
                  key={entry.username}
                  className={`${
                    entry.username === username 
                      ? 'bg-blue-50 dark:bg-blue-900/20' 
                      : 'hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {entry.rank}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {entry.username}
                    {entry.username === username && (
                      <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                        (You)
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {entry.score}/50
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {entry.bestSubject}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuizLeaderboard;