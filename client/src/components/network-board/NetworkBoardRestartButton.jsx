import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from '../../context/QuizContext';
import { useDeleteResult } from './useDeleteResult';
import { useResetQuizContext } from '../../context/useResetQuizContext';
import { AlertContext } from '../../App';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const NetworkBoardRestartButton = ({ onRefresh, resultId }) => {
  console.log('RestartButton received props:', { resultId });

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
      console.log('Restart attempt:', {
        username: state.username,
        resultId,
        stateId: state.id,
        hasUsername: Boolean(state.username),
        hasResultId: Boolean(resultId)
      });

      if (state.username && resultId) {
        console.log('Attempting to delete result with ID:', resultId);
        const success = await deleteUserResult(resultId);
        console.log('Delete result success:', success);
        
        if (success) {
          await onRefresh();
          showAlert('Quiz restarted and previous results deleted');
        } else {
          throw new Error('Failed to delete result');
        }
      } else {
        console.log('Missing required data:', {
          username: state.username,
          resultId
        });
      }
      resetQuiz();
      navigate('/menu');
    } catch (error) {
      console.error('Delete error:', error);
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
