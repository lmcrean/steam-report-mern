// NetworkBoard.jsx

// Import necessary libraries and hooks
import React, { useMemo, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext'; // Assuming you have this

// Define the NetworkBoard component
const NetworkBoard = () => {
  // State for loading
  const [loading, setLoading] = useState(true);
  const [networkData, setNetworkData] = useState([]);
  const [error, setError] = useState(null);
  const { username } = useContext(UserContext); // Get username from context
  const navigate = useNavigate();

  // Fetch network board data
  const fetchNetworkBoardData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/network-board');
      if (!response.ok) throw new Error('Failed to fetch network board data');
      const data = await response.json();
      setNetworkData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching network board data:', error);
      setError('Failed to load network board data');
      setLoading(false);
    }
  };

  // Delete user result
  const deleteUserResult = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/user-result/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete user result');
      
      await fetchNetworkBoardData();
      navigate('/quiz-start');
    } catch (error) {
      console.error('Error deleting user result:', error);
      setError('Failed to delete user result');
    }
  };

  // Calculate network board data using memoization
  const sortedNetworkData = useMemo(() => {
    return [...networkData].sort((a, b) => b.subjectScore - a.subjectScore);
  }, [networkData]);

  useEffect(() => {
    fetchNetworkBoardData();
  }, []);

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
                <tr key={entry.id} className={entry.username === username ? 'current-user' : ''}>
                  <td>{index + 1}</td>
                  <td>{entry.username}</td>
                  <td>{entry.bestSubject}</td>
                  <td>{entry.subjectScore}</td>
                  <td>{entry.bestPersonalityTrait}</td>
                  <td>{entry.personalityScore}</td>
                  <td>{entry.preferredEnvironment}</td>
                  <td>{new Date(entry.dateOfSubmission).toLocaleDateString()}</td>
                  <td>
                    {entry.username === username && (
                      <button 
                        className="delete-button"
                        onClick={() => deleteUserResult(entry.id)}
                      >
                        Delete
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