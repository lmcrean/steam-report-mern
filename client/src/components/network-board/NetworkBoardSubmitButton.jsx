import React from 'react';

const NetworkBoardSubmitButton = ({ onSubmit }) => {
  return (
    <button
      onClick={onSubmit}
      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200"
    >
      Share Results to Network Board
    </button>
  );
};

export default NetworkBoardSubmitButton; 