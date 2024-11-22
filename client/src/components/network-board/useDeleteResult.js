import { useCallback } from 'react';

export const useDeleteResult = (onDeleteSuccess) => {
  const deleteUserResult = useCallback(async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/user-result/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user result');
      }

      // Call the success callback (usually to refresh the network board data)
      if (onDeleteSuccess) {
        await onDeleteSuccess();
      }

      return true;
    } catch (error) {
      console.error('Error deleting user result:', error);
      return false;
    }
  }, [onDeleteSuccess]);

  return deleteUserResult;
};
