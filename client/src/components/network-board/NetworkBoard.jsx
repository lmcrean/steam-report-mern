// NetworkBoard.jsx

// Import necessary libraries and hooks
import React, { useMemo, useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from '../../context/QuizContext';
import { useGetNetworkBoard } from './useGetNetworkBoard';
import { useDeleteResult } from './useDeleteResult';
import { useResetQuizContext } from '../../context/useResetQuizContext';
import { AlertContext } from '../../App';
import NetworkBoardRestartButton from './NetworkBoardRestartButton';

// Define the NetworkBoard component
const NetworkBoard = () => {
  // 1. First, declare all hooks at the top level
  const { networkData, loading, error, fetchNetworkBoardData } = useGetNetworkBoard();
  const deleteUserResult = useDeleteResult(fetchNetworkBoardData);
  const { resetQuiz, resetToStart } = useResetQuizContext();
  const { state } = useContext(QuizContext);
  const navigate = useNavigate();
  const [deleteStatus, setDeleteStatus] = useState({ loading: false, error: null });
  const { showAlert } = useContext(AlertContext);

  // 2. Memoized values
  const sortedNetworkData = useMemo(() => {
    return [...networkData].sort((a, b) => b.subjectScore - a.subjectScore);
  }, [networkData]);

  // Add this memoized value to get the current user's result
  const currentUserResult = useMemo(() => {
    return sortedNetworkData.find(entry => entry.username === state.username);
  }, [sortedNetworkData, state.username]);

  // 3. Event handlers
  const handleDelete = async (id) => {
    setDeleteStatus({ loading: true, error: null });
    try {
      const success = await deleteUserResult(id);
      if (success) {
        await fetchNetworkBoardData();
        
        showAlert('Result successfully deleted');
        resetQuiz();
      } else {
        throw new Error('Failed to delete result');
      }
    } catch (error) {
      setDeleteStatus({ loading: false, error: error.message });
      showAlert(`Error deleting result: ${error.message}`);
    } finally {
      setDeleteStatus({ loading: false, error: null });
    }
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
        <NetworkBoardRestartButton 
          onRefresh={fetchNetworkBoardData}
          resultId={currentUserResult?.id}
        />
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
                  <>
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete(entry.id)}
                      disabled={deleteStatus.loading}
                    >
                      {deleteStatus.loading ? 'Deleting...' : 'Delete my result'}
                    </button>
                    {deleteStatus.error && (
                      <div className="error-message">
                        {deleteStatus.error}
                      </div>
                    )}
                  </>
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