import { useState, useCallback } from 'react';

export const useGetNetworkBoard = () => {
  const [networkData, setNetworkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNetworkBoardData = useCallback(async () => {
    console.log('🔄 Starting fetchNetworkBoardData');
    try {
      if (!navigator.onLine) {
        throw new Error('No internet connection');
      }

      console.log('📡 Making request to /api/network-board');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('http://localhost:8000/api/network-board', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      console.log('📥 Network board response:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✨ Network board data retrieved:', {
        totalItems: data?.length,
        sampleItems: data?.slice(0, 2).map(item => ({
          id: item.id,
          username: item.username,
          bestSubject: item.bestSubject,
          bestTrait: item.bestPersonalityTrait,
          dateField: item.dateOfSubmission,
          timestamp: item.timestamp,
          allDateFields: Object.keys(item).filter(key => 
            key.toLowerCase().includes('date') || 
            key.toLowerCase().includes('time')
          )
        }))
      });
      
      const processedData = data.map(item => {
        console.log('🕒 Processing item dates:', {
          id: item.id,
          dateOfSubmission: item.dateOfSubmission,
          timestamp: item.timestamp
        });
        return item;
      });
      
      setNetworkData(processedData);
      console.log('💾 Network data saved to state');
      setLoading(false);
      return processedData;
    } catch (error) {
      console.error('❌ Network board error:', {
        message: error.message,
        type: error.name,
        online: navigator.onLine,
        endpoint: 'http://localhost:8000/api/network-board'
      });
      setError(`Failed to load: ${error.message}`);
      setLoading(false);
      return null;
    }
  }, []);

  return {
    networkData,
    loading,
    error,
    fetchNetworkBoardData
  };
};
