import { useState, useCallback } from 'react';

export const useGetNetworkBoard = () => {
  const [networkData, setNetworkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNetworkBoardData = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/network-board');
      if (!response.ok) throw new Error('Failed to fetch network board data');
      const data = await response.json();
      setNetworkData(data);
      setLoading(false);
      return data;
    } catch (error) {
      console.error('Error fetching network board data:', error);
      setError('Failed to load network board data');
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
