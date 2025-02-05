import { describe, test, expect } from 'vitest';
import { TEST_CASES } from '../../testCases/quizInputs';

describe('Personality Section Tests', () => {
  describe('Standard Flow - No Ties', () => {
    test('Case 1: Clear single winners - Extraversion', () => {
      const testCase = TEST_CASES.set1_standardFlow.case1_clearWinners;
      const personalityScores = calculatePersonalityScores(testCase.personalityAnswers);
      const maxScore = Math.max(...personalityScores.map(({ total }) => total));
      
      // Verify Extraversion is highest
      const winner = personalityScores.find(({ total }) => total === maxScore);
      expect(winner.trait).toBe('Extraversion');
      expect(winner.total).toBe(89); // 40/45 = ~89%
      
      // Verify no ties
      const ties = personalityScores.filter(({ total }) => total === maxScore);
      expect(ties).toHaveLength(1);
    });
  });

  describe('Personality Tie Cases', () => {
    test('Case 1: Two-way personality tie - Openness & Extraversion', () => {
      const testCase = TEST_CASES.set2_personalityTieOnly.case1_twoWayTie;
      const personalityScores = calculatePersonalityScores(testCase.personalityAnswers);
      const maxScore = Math.max(...personalityScores.map(({ total }) => total));
      
      // Verify both traits tied at 89%
      const ties = personalityScores.filter(({ total }) => total === maxScore);
      expect(ties).toHaveLength(2);
      expect(ties.map(t => t.trait)).toEqual(expect.arrayContaining(['Openness', 'Extraversion']));
      expect(ties[0].total).toBe(89);
      expect(ties[1].total).toBe(89);
      
      // Verify preferred trait resolution
      const updatedScores = calculatePersonalityScores(testCase.personalityAnswers, testCase.preferredTrait);
      const newWinner = updatedScores.find(({ trait }) => trait === testCase.preferredTrait);
      expect(newWinner.total).toBeGreaterThan(maxScore);
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