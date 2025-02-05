import { describe, test, expect, vi } from 'vitest';
import { TEST_CASES } from '../../testCases/quizInputs';
import { createMockPage, mockTestCase } from '../utils/testHelpers';
import { verifyResultsText } from '../../../utils/quiz-runners/resultsTextCheck';
import { verifyCareerRecommendations } from '../../../utils/quiz-runners/careerRecommendation';
import { verifyNetworkBoard } from '../../../utils/quiz-runners/networkBoard';

// Mock the feedback database
vi.mock('../../../../src/data/feedbackDatabase', () => ({
  feedbackDatabase: {
    'subject1 and trait1': {
      recommendedCareers: ['Career 1', 'Career 2', 'Career 3']
    }
  }
}));

describe('Quiz Results Tests', () => {
  describe('Standard Flow Results', () => {
    test('Case 1: Clear Winners Results Display', () => {
      const testCase = TEST_CASES.set1_standardFlow.case1_clearWinners;
      
      // Calculate final scores
      const personalityScores = calculatePersonalityScores(testCase.personalityAnswers);
      const subjectScores = calculateSubjectScores(testCase.subjectAnswers);
      
      // Get winners
      const personalityWinner = getWinner(personalityScores);
      const subjectWinner = getWinner(subjectScores);
      
      // Verify winners match expected results
      expect(`${subjectWinner.subject} and ${personalityWinner.trait}`).toBe(testCase.topScores);
      
      // Verify exact scores
      expect(personalityWinner.trait).toBe('Extraversion');
      expect(personalityWinner.total).toBe(89);
      expect(subjectWinner.subject).toBe('Math');
      expect(subjectWinner.total).toBe(80);
    });
  });

  describe('Tie Resolution Results', () => {
    test('Case 1: Two-way Personality Tie Resolution Results', () => {
      const testCase = TEST_CASES.set2_personalityTieOnly.case1_twoWayTie;
      
      // Calculate initial scores
      const personalityScores = calculatePersonalityScores(testCase.personalityAnswers);
      const subjectScores = calculateSubjectScores(testCase.subjectAnswers);
      
      // Verify initial tie
      const initialTies = personalityScores.filter(
        ({ total }) => total === Math.max(...personalityScores.map(s => s.total))
      );
      expect(initialTies).toHaveLength(2);
      
      // Calculate resolved scores
      const resolvedPersonalityScores = calculatePersonalityScores(
        testCase.personalityAnswers,
        testCase.preferredTrait
      );
      
      // Get final winners
      const personalityWinner = getWinner(resolvedPersonalityScores);
      const subjectWinner = getWinner(subjectScores);
      
      // Verify final results match expected
      expect(`${subjectWinner.subject} and ${personalityWinner.trait}`).toBe(testCase.topScores);
      expect(personalityWinner.trait).toBe(testCase.preferredTrait);
    });
  });

  describe('UI Interaction Tests', () => {
    let mockPage;

    beforeEach(() => {
      mockPage = createMockPage();
      mockPage.content.mockResolvedValue('<div>Mock Content</div>');
      mockPage.$$eval.mockImplementation((selector, callback) => {
        const mockElements = [
          { querySelector: () => ({ textContent: 'trait1' }), textContent: '89%' },
          { querySelector: () => ({ textContent: 'trait2' }), textContent: '78%' },
          { querySelector: () => ({ textContent: 'trait3' }), textContent: '67%' }
        ];
        return callback(mockElements);
      });
    });

    describe('Results Text Verification', () => {
      test('should verify results text successfully', async () => {
        await verifyResultsText(mockPage, mockTestCase);

        expect(mockPage.waitForSelector).toHaveBeenCalledWith(
          'h2:has-text("Your Results")',
          expect.any(Object)
        );
      });

      test('should handle missing results section', async () => {
        mockPage.waitForSelector.mockRejectedValue(new Error('Timeout'));

        await expect(async () => {
          await verifyResultsText(mockPage, mockTestCase);
        }).rejects.toThrow('Timeout');
      });
    });

    describe('Career Recommendations Verification', () => {
      test('should verify career recommendations successfully', async () => {
        const mockButton = {
          click: vi.fn().mockResolvedValue(undefined)
        };

        mockPage.waitForSelector.mockImplementation((selector) => {
          if (selector === 'button:has-text("Share Results to Network Board")') {
            return mockButton;
          }
          return true;
        });

        await verifyCareerRecommendations(mockPage, mockTestCase);

        // Verify career recommendations are displayed
        expect(mockPage.waitForSelector).toHaveBeenCalledWith(
          'text=subject1 and trait1',
          expect.any(Object)
        );

        // Verify share button click
        expect(mockPage.waitForSelector).toHaveBeenCalledWith(
          'button:has-text("Share Results to Network Board")',
          expect.any(Object)
        );

        expect(mockButton.click).toHaveBeenCalled();
      });

      test('should handle invalid career combination', async () => {
        const invalidTestCase = {
          ...mockTestCase,
          topScores: 'invalid and invalid'
        };

        await expect(async () => {
          await verifyCareerRecommendations(mockPage, invalidTestCase);
        }).rejects.toThrow('No career recommendations found');
      });
    });

    describe('Network Board Verification', () => {
      test('should verify network board successfully', async () => {
        mockPage.$$.mockResolvedValue(['row1', 'row2', 'row3']);
        mockPage.evaluate.mockImplementation((callback, count) => {
          window._initialRowCount = count;
          return Promise.resolve();
        });

        await verifyNetworkBoard(mockPage);

        expect(mockPage.waitForLoadState).toHaveBeenCalledWith('networkidle');
        expect(mockPage.$$).toHaveBeenCalledWith('table tbody tr');
      });

      test('should handle empty network board', async () => {
        mockPage.$$.mockResolvedValue([]);
        mockPage.evaluate.mockImplementation((callback, count) => {
          window._initialRowCount = count;
          return Promise.resolve();
        });

        await verifyNetworkBoard(mockPage);

        expect(mockPage.waitForLoadState).toHaveBeenCalledWith('networkidle');
        expect(mockPage.$$).toHaveBeenCalledWith('table tbody tr');
      });
    });
  });
});

function calculatePersonalityScores(answers, preferredTrait = null) {
  return Object.entries(answers).map(([trait, scores]) => ({
    trait,
    total: Math.round(((scores.reduce((sum, score) => sum + score, 0) + 
      (trait === preferredTrait ? 1 : 0)) / 45) * 100)
  }));
}

function calculateSubjectScores(answers, preferredSubject = null) {
  return Object.entries(answers).map(([subject, scores]) => ({
    subject,
    total: Math.round((scores.filter(Boolean).length / scores.length) * 100) +
      (subject === preferredSubject ? 1 : 0)
  }));
}

function getWinner(scores) {
  return scores.reduce((winner, current) => 
    current.total > winner.total ? current : winner
  );
} 