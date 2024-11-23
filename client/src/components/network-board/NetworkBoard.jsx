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
  // 1. First, declare all hooks at the top level
  const { networkData, loading, error, fetchNetworkBoardData } = useGetNetworkBoard();
  const deleteUserResult = useDeleteResult(fetchNetworkBoardData);
  const { resetQuiz, resetToStart } = useResetQuizContext();
  const { state } = useContext(QuizContext);
  const navigate = useNavigate();

  // 2. Memoized values
  const sortedNetworkData = useMemo(() => {
    return [...networkData].sort((a, b) => b.subjectScore - a.subjectScore);
  }, [networkData]);

  // 3. Event handlers
  const handleDelete = async (id) => {
    const success = await deleteUserResult(id);
    if (success) {
      resetQuiz();
    }
  };

  const handleRestartQuiz = () => {
    resetToStart();
    navigate('/menu');
  };

  // 4. Format date function (not a hook)
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };
      return date.toLocaleString('en-GB', options);
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // 5. Effects
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchNetworkBoardData();
      } catch (err) {
        console.error('❌ Error fetching network data:', err);
      }
    };
    loadData();
  }, [fetchNetworkBoardData]);

  // 6. Render logic
  if (loading) {
    return <div className="loading">Loading network board...</div>;
  }

  if (error) {
    return <div className="error-message">Error loading network board: {error}</div>;
  }

  if (!networkData || networkData.length === 0) {
    return <div className="no-data">No network board data available</div>;
  }

  // 7. Component render
  return (
    <div className="network-board">
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
          {sortedNetworkData.map((entry) => (
            <tr key={entry.id} className={entry.username === state.username ? 'current-user' : ''}>
              <td>{entry.username}</td>
              <td>{entry.bestSubject}</td>
              <td>{entry.subjectScore}</td>
              <td>{entry.bestPersonalityTrait}</td>
              <td>{entry.personalityScore}</td>
              <td>{entry.preferredEnvironment}</td>
              <td>
                {formatDate(entry.timestamp) === 'Invalid Date' 
                  ? formatDate(entry.dateOfSubmission) 
                  : formatDate(entry.timestamp)}
              </td>
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
    </div>
  );
};

// Export the NetworkBoard component
export default NetworkBoard;