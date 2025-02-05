import { describe, test, expect, vi } from 'vitest';
import { TEST_CASES } from '../../testCases/quizInputs';
import { createMockPage, mockTestCase } from '../utils/testHelpers';
import { completeSubjectSection } from '../../../utils/quiz-runners/subjectSection';

describe('Subject Section Tests', () => {
  describe('Standard Flow - No Ties', () => {
    test('Case 1: Clear single winner - Math', () => {
      const testCase = TEST_CASES.set1_standardFlow.case1_clearWinners;
      const subjectScores = calculateSubjectScores(testCase.subjectAnswers);
      const maxScore = Math.max(...subjectScores.map(({ total }) => total));
      
      // Verify Math is highest
      const winner = subjectScores.find(({ total }) => total === maxScore);
      expect(winner.subject).toBe('Math');
      expect(winner.total).toBe(80); // 8/10 = 80%
      
      // Verify no ties
      const ties = subjectScores.filter(({ total }) => total === maxScore);
      expect(ties).toHaveLength(1);
    });
  });

  describe('Subject Tie Cases', () => {
    test('Case 1: Two-way subject tie - Math & Science', () => {
      const testCase = TEST_CASES.set3_subjectTieOnly.case1_twoWaySubjectTie;
      const subjectScores = calculateSubjectScores(testCase.subjectAnswers);
      const maxScore = Math.max(...subjectScores.map(({ total }) => total));
      
      // Verify both subjects tied at 70%
      const ties = subjectScores.filter(({ total }) => total === maxScore);
      expect(ties).toHaveLength(2);
      expect(ties.map(s => s.subject)).toEqual(expect.arrayContaining(['Math', 'Science']));
      expect(ties[0].total).toBe(70);
      expect(ties[1].total).toBe(70);
      
      // Verify preferred subject resolution
      const updatedScores = calculateSubjectScores(testCase.subjectAnswers, testCase.preferredSubject);
      const newWinner = updatedScores.find(({ subject }) => subject === testCase.preferredSubject);
      expect(newWinner.total).toBeGreaterThan(maxScore);
    });
  });

  describe('UI Interaction Tests', () => {
    let mockPage;
    const mockSubjectsData = {
      subject1: {
        questions: [
          { question: 'Question 1', correct_answer: 'Correct 1' },
          { question: 'Question 2', correct_answer: 'Correct 2' },
          { question: 'Question 3', correct_answer: 'Correct 3' }
        ]
      },
      subject2: {
        questions: [
          { question: 'Question 4', correct_answer: 'Correct 4' },
          { question: 'Question 5', correct_answer: 'Correct 5' },
          { question: 'Question 6', correct_answer: 'Correct 6' }
        ]
      }
    };

    beforeEach(() => {
      mockPage = createMockPage();
      mockPage.content.mockResolvedValue('<div>Mock Content</div>');
    });

    test('should handle question matching errors', async () => {
      // Mock locator to return unmatched question text
      mockPage.locator.mockReturnValue({
        first: () => ({ textContent: () => 'Question Header' }),
        textContent: () => 'Unmatched Question'
      });

      await expect(async () => {
        await completeSubjectSection(mockPage, mockTestCase.subjectAnswers, mockSubjectsData);
      }).rejects.toThrow('Could not find question data');
    });

    test('should handle answer selection errors', async () => {
      // Mock locator to return a valid question
      mockPage.locator.mockReturnValue({
        first: () => ({ textContent: () => 'Question Header' }),
        textContent: () => mockSubjectsData.subject1.questions[0].question
      });

      // Mock $$ to return answers that don't match correct_answer
      mockPage.$$.mockResolvedValue([
        { 
          textContent: () => Promise.resolve('Wrong 1'),
          click: vi.fn()
        },
        {
          textContent: () => Promise.resolve('Wrong 2'),
          click: vi.fn()
        }
      ]);

      await expect(async () => {
        await completeSubjectSection(mockPage, { subject1: [1] }, mockSubjectsData);
      }).rejects.toThrow('Could not find correct answer');
    });
  });
});

function calculateSubjectScores(answers, preferredSubject = null) {
  return Object.entries(answers).map(([subject, scores]) => ({
    subject,
    total: Math.round((scores.filter(Boolean).length / scores.length) * 100) +
      (subject === preferredSubject ? 1 : 0)
  }));
} 