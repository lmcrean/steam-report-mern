import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from '../../context/QuizContext';
import { useDeleteResult } from './useDeleteResult';
import { useResetQuizContext } from '../../context/useResetQuizContext';
import { AlertContext } from '../../App';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const NetworkBoardRestartButton = ({ onRefresh, resultId }) => {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { state } = useContext(QuizContext);
  const { showAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  const deleteUserResult = useDeleteResult(onRefresh);
  const { resetQuiz } = useResetQuizContext();

  const handleRestart = async () => {
    setIsDeleting(true);
    try {
      if (state.username && resultId) {
        
        const success = await deleteUserResult(resultId);
        
        if (success) {
          await onRefresh();
          showAlert('Quiz restarted and previous results deleted');
        } else {
          throw new Error('Failed to delete result');
        }
      }

      // Reset quiz state
      resetQuiz();
      
      // Use navigate instead of window.location
      navigate('/menu');
      
    } catch (error) {
      console.error('Error in handleRestart:', error);
      showAlert(`Error restarting quiz: ${error.message}`);
    } finally {
      setIsDeleting(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <Button 
        className="restart-quiz-button"
        onClick={() => setShowModal(true)}
      >
        Restart Quiz
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Restart Quiz?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This will delete your current results and start a new quiz.
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
          <Button 
            className="confirm-delete"
            variant="danger"
            onClick={handleRestart}
            disabled={isDeleting}
          >
            {isDeleting ? 'Restarting...' : 'Restart Quiz'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NetworkBoardRestartButton;
