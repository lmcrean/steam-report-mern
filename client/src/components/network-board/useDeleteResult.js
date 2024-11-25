import { useCallback } from 'react';
import { getApiUrl } from '../../config/environment';

export const useDeleteResult = (onDeleteSuccess) => {
  const deleteUserResult = useCallback(async (id) => {
    console.log('useDeleteResult called with ID:', id);

    if (!id) {
      console.error('No ID provided to deleteUserResult');
      return false;
    }

    try {
      const response = await fetch(`${getApiUrl()}/api/user-result/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Delete response:', {
        ok: response.ok,
        status: response.status
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to delete user result: ${errorData}`);
      }

      if (onDeleteSuccess) {
        await onDeleteSuccess();
      }

      return true;
    } catch (error) {
      // More specific error handling
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        console.error('CORS or network error:', error);
        throw new Error('Network error - please check server connection');
      }
      console.error('Error in deleteUserResult:', error);
      return false;
    }
  }, [onDeleteSuccess]);

  return deleteUserResult;
};
