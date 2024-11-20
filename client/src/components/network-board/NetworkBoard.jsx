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
  const { username } = useContext(UserContext); // Get username from context
  const navigate = useNavigate();

  // Fetch network board data
  const fetchNetworkBoardData = async () => {
    try {
      const response = await fetch('/api/network-board');
      if (!response.ok) throw new Error('Failed to fetch network board data');
      const data = await response.json();
      setNetworkData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching network board data:', error);
      setLoading(false);
    }
  };

  // Collect and send user results
  const collectUserResultsData = async (quizResults, careerRecommendation) => {
    const userResult = {
      username,
      bestSubject: quizResults.bestSubject,
      subjectScore: quizResults.subjectScore,
      bestPersonalityTrait: quizResults.bestPersonalityTrait,
      personalityScore: quizResults.personalityScore,
      preferredEnvironment: careerRecommendation.preferredEnvironment,
      dateOfSubmission: new Date().toISOString()
    };

    return userResult;
  };

  // Send results to network board
  const sendUserResultToNetworkBoard = async (userResult) => {
    try {
      const response = await fetch('/api/user-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userResult)
      });
      
      if (!response.ok) throw new Error('Failed to submit user result');
      
      // Refresh network board data after submission
      await fetchNetworkBoardData();
    } catch (error) {
      console.error('Error submitting user result:', error);
    }
  };

  // Calculate network board data using memoization
  const getNetworkBoardData = useMemo(() => {
    // Retrieve the network board data from the AWS Lambda
    
    // Have demo entries in the frontend for testing. See collectUserResultsData for columns.

    // Return the sorted network board data
  }, [username, subjectAnswers]);



  // Function to delete user result
  const deleteUserResult = () => {
    // Logic to delete User Result from the Network Board AWS Lambda and redirect to quiz start
  };

  useEffect(() => {
    fetchNetworkBoardData();
  }, []);

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
              </tr>
            </thead>
            <tbody>
              {networkData.map((entry, index) => (
                <tr key={entry.id} className={entry.username === username ? 'current-user' : ''}>
                  <td>{index + 1}</td>
                  <td>{entry.username}</td>
                  <td>{entry.bestSubject}</td>
                  <td>{entry.subjectScore}</td>
                  <td>{entry.bestPersonalityTrait}</td>
                  <td>{entry.personalityScore}</td>
                  <td>{entry.preferredEnvironment}</td>
                  <td>{new Date(entry.dateOfSubmission).toLocaleDateString()}</td>
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