// NetworkBoard.jsx

// Import necessary libraries and hooks
import React, { useMemo, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from '../../context/QuizContext';
import { useGetNetworkBoard } from './useGetNetworkBoard';
import { useDeleteResult } from './useDeleteResult';
import { useResetQuizContext } from '../../context/useResetQuizContext';

// Define the NetworkBoard component
const NetworkBoard = () => {
  const { networkData, loading, error, fetchNetworkBoardData } = useGetNetworkBoard();
  const deleteUserResult = useDeleteResult(fetchNetworkBoardData);
  const { resetQuiz, resetToStart } = useResetQuizContext();
  const { state } = useContext(QuizContext);
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const success = await deleteUserResult(id);
    if (success) {
      resetQuiz(); // Complete reset after successful deletion
    }
  };

  const handleRestartQuiz = () => {
    resetToStart(); // Partial reset for restart
    navigate('/menu');
  };

  // Calculate network board data using memoization
  const sortedNetworkData = useMemo(() => {
    return [...networkData].sort((a, b) => b.subjectScore - a.subjectScore);
  }, [networkData]);

  useEffect(() => {
    fetchNetworkBoardData();
  }, [fetchNetworkBoardData]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Render the component
  return (
    <div className="network-board">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h2>Network Board</h2>
          <div className="actions-container">
            <button 
              className="restart-quiz-button"
              onClick={handleRestartQuiz}
            >
              Restart Quiz
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Best Subject</th>
                <th>Subject Score</th>
                <th>Best Personality Trait</th>
                <th>Personality Score</th>
                <th>Preferred Environment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedNetworkData.map((entry, index) => (
                <tr key={entry.id} className={entry.username === state.username ? 'current-user' : ''}>
                  <td>{index + 1}</td>
                  <td>{entry.username}</td>
                  <td>{entry.bestSubject}</td>
                  <td>{entry.subjectScore}</td>
                  <td>{entry.bestPersonalityTrait}</td>
                  <td>{entry.personalityScore}</td>
                  <td>{entry.preferredEnvironment}</td>
                  <td>{new Date(entry.dateOfSubmission).toLocaleDateString()}</td>
                  <td>
                    {entry.username === state.username && (
                      <button 
                        className="delete-button"
                        onClick={() => handleDelete(entry.id)}
                      >
                        Delete my result
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

// Export the NetworkBoard component
export default NetworkBoard;