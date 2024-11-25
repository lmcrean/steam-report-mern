import { useState, useCallback } from 'react';
import { getApiUrl } from '../../config/environment';

export const useGetNetworkBoard = () => {
  const [networkData, setNetworkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNetworkBoardData = useCallback(async () => {
    try {
      if (!navigator.onLine) {
        throw new Error('No internet connection');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${getApiUrl()}/api/network-board`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      const processedData = data.map(item => {
        return item;
      });
      
      setNetworkData(processedData);
      
      setLoading(false);
      return processedData;
    } catch (error) {
      console.error('❌ Network board error:', {
        message: error.message,
        type: error.name,
        online: navigator.onLine,
        endpoint: `${getApiUrl()}/api/network-board`
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
