import { describe, test, expect, vi } from 'vitest';
import { TEST_CASES } from '../../testCases/quizInputs';
import { createMockPage, mockTestCase } from '../utils/testHelpers';
import { handlePersonalityTieBreaker } from '../../../utils/quiz-runners/personalityTieBreaker';
import { handleSubjectTieBreaker } from '../../../utils/quiz-runners/subjectTieBreaker';

describe('Tie Breaker Tests', () => {
  describe('Both Personality and Subject Ties', () => {
    test('Case 1: Simple Double Tie', () => {
      const testCase = TEST_CASES.set4_subjectAndPersonalityTies.case1_simpleDoubleTie;
      
      // Test personality tie resolution
      const personalityScores = calculatePersonalityScores(testCase.personalityAnswers);
      const maxPersonalityScore = Math.max(...personalityScores.map(({ total }) => total));
      const personalityTies = personalityScores.filter(({ total }) => total === maxPersonalityScore);
      
      expect(personalityTies).toHaveLength(2);
      expect(personalityTies.map(t => t.trait)).toEqual(
        expect.arrayContaining(['Openness', 'Extraversion'])
      );
      
      // Verify personality tie resolution
      const updatedPersonalityScores = calculatePersonalityScores(
        testCase.personalityAnswers, 
        testCase.preferredTrait
      );
      const personalityWinner = updatedPersonalityScores.find(
        ({ trait }) => trait === testCase.preferredTrait
      );
      expect(personalityWinner.total).toBeGreaterThan(maxPersonalityScore);
      
      // Test subject tie resolution
      const subjectScores = calculateSubjectScores(testCase.subjectAnswers);
      const maxSubjectScore = Math.max(...subjectScores.map(({ total }) => total));
      const subjectTies = subjectScores.filter(({ total }) => total === maxSubjectScore);
      
      expect(subjectTies).toHaveLength(2);
      expect(subjectTies.map(s => s.subject)).toEqual(
        expect.arrayContaining(['Math', 'Science'])
      );
      
      // Verify subject tie resolution
      const updatedSubjectScores = calculateSubjectScores(
        testCase.subjectAnswers, 
        testCase.preferredSubject
      );
      const subjectWinner = updatedSubjectScores.find(
        ({ subject }) => subject === testCase.preferredSubject
      );
      expect(subjectWinner.total).toBeGreaterThan(maxSubjectScore);
    });
  });

  describe('UI Interaction Tests', () => {
    let mockPage;

    beforeEach(() => {
      mockPage = createMockPage();
      mockPage.content.mockResolvedValue('<div>Mock Content</div>');
      mockPage.screenshot.mockResolvedValue(Buffer.from('mock-screenshot'));
    });

    describe('Personality Tie Breaker', () => {
      test('should handle personality tie breaker successfully', async () => {
        const mockButton = {
          click: vi.fn().mockResolvedValue(undefined)
        };

        mockPage.waitForSelector.mockResolvedValue(true);
        mockPage.getByRole.mockReturnValue(mockButton);

        await handlePersonalityTieBreaker(mockPage, mockTestCase.preferredTrait);

        // Verify tie breaker screen was waited for
        expect(mockPage.waitForSelector).toHaveBeenCalledWith(
          'h2:has-text("We Found a Tie!")',
          expect.any(Object)
        );

        // Verify trait button was clicked
        expect(mockPage.getByRole).toHaveBeenCalledWith('button', {
          name: mockTestCase.preferredTrait,
          exact: true
        });

        // Verify confirm button was clicked
        expect(mockPage.getByRole).toHaveBeenCalledWith('button', {
          name: 'Confirm Selection',
          exact: true
        });

        expect(mockButton.click).toHaveBeenCalledTimes(2);
      });

      test('should handle missing tie breaker screen', async () => {
        mockPage.waitForSelector.mockRejectedValue(new Error('Timeout'));

        await expect(async () => {
          await handlePersonalityTieBreaker(mockPage, mockTestCase.preferredTrait);
        }).rejects.toThrow('Timeout');
      });
    });

    describe('Subject Tie Breaker', () => {
      test('should handle subject tie breaker successfully', async () => {
        const mockRadio = {
          click: vi.fn().mockResolvedValue(undefined)
        };

        mockPage.waitForSelector.mockResolvedValue(true);
        mockPage.getByRole.mockReturnValue(mockRadio);

        await handleSubjectTieBreaker(mockPage, mockTestCase.preferredSubject);

        // Verify tie breaker screen was waited for
        expect(mockPage.waitForSelector).toHaveBeenCalledWith(
          'h2:has-text("Your Strongest Subjects")',
          expect.any(Object)
        );

        // Verify subject radio was clicked
        expect(mockPage.getByRole).toHaveBeenCalledWith('radio', {
          name: mockTestCase.preferredSubject
        });

        // Verify confirm button was clicked
        expect(mockPage.getByRole).toHaveBeenCalledWith('button', {
          name: 'Confirm Selection'
        });

        expect(mockRadio.click).toHaveBeenCalledTimes(2);
      });

      test('should handle errors during subject tie breaker', async () => {
        mockPage.waitForSelector.mockResolvedValue(true);
        mockPage.getByRole.mockReturnValue(undefined);

        await expect(async () => {
          await handleSubjectTieBreaker(mockPage, mockTestCase.preferredSubject);
        }).rejects.toThrow('Cannot read properties of undefined');
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