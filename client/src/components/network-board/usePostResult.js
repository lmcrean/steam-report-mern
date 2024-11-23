import { useCallback, useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import { useNavigate } from 'react-router-dom';

export const useSubmitResults = () => {
  const { state, updateState } = useContext(QuizContext);
  const navigate = useNavigate();

  const checkServerHealth = async () => {
    try {
      const response = await fetch('http://localhost:8000/health');
      const data = await response.json();
      console.log('🏥 Server health check:', data);
      return data.status === 'ok';
    } catch (error) {
      console.error('❌ Server health check failed:', error);
      return false;
    }
  };

  const submitResults = useCallback(async (results) => {
    console.log('🚀 Starting submitResults');
    try {
      // Check server health first
      const serverHealthy = await checkServerHealth();
      if (!serverHealthy) {
        throw new Error('Server is not responding');
      }

      // Get the environment from results
      const preferredEnvironment = results.preferredEnvironment;

      console.log('🔄 Preferred Environment from State (currently FAILing to Render, expecting a result such as: collaborative and dynamic):\n' + preferredEnvironment);

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

      console.log('📦 Payloads prepared:\n' + 
        'Context Payload:\n' +
        JSON.stringify(contextPayload, null, 2) +
        '\n\nAPI Payload:\n' +
        JSON.stringify(apiPayload, null, 2)
      );

      // Make the request
      console.log('📤 Sending request to:', 'http://localhost:8000/api/user-result');
      const response = await fetch('http://localhost:8000/api/user-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload)
      });

      console.log('📥 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text().catch(e => 'No error text available');
        throw new Error(`Server error: ${response.status}\nResponse: ${errorText}`);
      }

      const data = await response.json();
      console.log('✨ Server response:', data);

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
        endpoint: 'http://localhost:8000/api/user-result'
      });
      return false;
    }
  }, [updateState, state.username, navigate]);

  return submitResults;
}; 