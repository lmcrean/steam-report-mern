import { useCallback, useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../config/environment';

export const useSubmitResults = () => {
  const { state, updateState } = useContext(QuizContext);
  const navigate = useNavigate();

  const checkServerHealth = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/health`);
      const data = await response.json();
      return data.status === 'ok';
    } catch (error) {
      console.error('❌ Server health check failed:', error);
      return false;
    }
  };

  const submitResults = useCallback(async (results) => {
    try {
      // Check server health first
      const serverHealthy = await checkServerHealth();
      if (!serverHealthy) {
        throw new Error('Server is not responding');
      }

      // Get the environment from results
      const preferredEnvironment = results.preferredEnvironment;
      
      // Prepare payloads
      const contextPayload = {
        bestSubject: results.maxSubjectName,
        subjectScore: results.subjectPercentages[results.maxSubjectName],
        bestPersonalityTrait: results.maxPersonalityTrait,
        personalityScore: results.traitPercentages[results.maxPersonalityTrait],
        dateOfSubmission: new Date().toISOString(),
        preferredEnvironment: preferredEnvironment,
        section: 'network-board'
      };

      const apiPayload = {
        username: state.username,
        traitPercentages: results.traitPercentages,
        subjectPercentages: results.subjectPercentages,
        preferredTrait: results.preferredTrait,
        preferredSubject: results.preferredSubject,
        bestSubject: results.maxSubjectName,
        bestPersonalityTrait: results.maxPersonalityTrait,
        preferredEnvironment: preferredEnvironment,
        timestamp: new Date().toISOString()
      };

      // Make the request
      const response = await fetch(`${getApiUrl()}/api/user-result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload)
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(e => 'No error text available');
        throw new Error(`Server error: ${response.status}\nResponse: ${errorText}`);
      }

      const data = await response.json();

      updateState(contextPayload);
      navigate('/network-board');
      return true;
    } catch (error) {
      console.error('❌ Submit failed:', {
        message: error.message,
        type: error.name,
        status: error.response?.status,
        statusText: error.response?.statusText,
        serverRunning: await checkServerHealth(),
        endpoint: `${getApiUrl()}/api/user-result`
      });
      return false;
    }
  }, [updateState, state.username, navigate]);

  return submitResults;
}; 