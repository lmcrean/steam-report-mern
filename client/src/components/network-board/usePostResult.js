import { useCallback, useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import { useNavigate } from 'react-router-dom';

export const useSubmitResults = () => {
  const { state, updateState } = useContext(QuizContext);
  const navigate = useNavigate();

  const submitResults = useCallback(async (results) => {
    try {
      // Prepare the context update payload
      const contextPayload = {
        bestSubject: results.maxSubjectName,
        subjectScore: results.subjectPercentages[results.maxSubjectName],
        bestPersonalityTrait: results.maxPersonalityTrait,
        personalityScore: results.traitPercentages[results.maxPersonalityTrait],
        dateOfSubmission: results.timestamp,
        section: 'network-board'
      };

      // Prepare the API payload
      const apiPayload = {
        username: state.username,
        traitPercentages: results.traitPercentages,
        subjectPercentages: results.subjectPercentages,
        preferredTrait: results.preferredTrait,
        preferredSubject: results.preferredSubject,
        bestSubject: results.maxSubjectName,
        bestPersonalityTrait: results.maxPersonalityTrait,
        timestamp: results.timestamp
      };

      // Update context state first
      updateState(contextPayload);

      // Make API request
      const response = await fetch('http://localhost:8000/api/user-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit to network board');
      }

      navigate('/network-board');
      return true;
    } catch (error) {
      console.error('Error submitting results:', error);
      return false;
    }
  }, [updateState, state.username, navigate]);

  return submitResults;
}; 