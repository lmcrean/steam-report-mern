import { expect } from '@playwright/test';

export async function verifyResultsText(page, testCase) {
  // Wait for results section to be visible
  await page.waitForSelector('h2:has-text("Your Results")', { timeout: 5000 });

  // Calculate expected scores
  const personalityScores = Object.entries(testCase.personalityAnswers)
    .map(([trait, scores]) => ({
      trait,
      total: Math.round((scores.reduce((sum, score) => sum + score, 0) / 45) * 100)
    }));

  const subjectScores = Object.entries(testCase.subjectAnswers)
    .map(([subject, scores]) => ({
      subject,
      total: Math.round((scores.filter(Boolean).length / scores.length) * 100) +
        (subject === testCase.preferredSubject ? 1 : 0)
    }));

  // Find highest scores
  const maxPersonalityScore = Math.max(...personalityScores.map(({ total }) => total));
  const maxSubjectScore = Math.max(...subjectScores.map(({ total }) => total));

  // Verify each personality trait score
  for (const { trait, total } of personalityScores) {
    const scoreText = `${total}%`;
    await expect(page.getByText(scoreText, { exact: true })).toBeVisible();
    
    // Verify color classes
    const traitElement = page.getByText(trait, { exact: true });
    if (total === maxPersonalityScore && trait === testCase.preferredTrait) {
      // Should be purple for preferred trait
      await expect(traitElement).toHaveClass(/text-purple-600/);
    } else if (total === maxPersonalityScore) {
      // Should be green for highest score
      await expect(traitElement).toHaveClass(/text-green-600/);
    } else {
      // Should be blue for other scores
      await expect(traitElement).toHaveClass(/text-blue-600/);
    }
  }

  // Verify each subject score
  for (const { subject, total } of subjectScores) {
    const scoreText = `${total}%`;
    await expect(page.getByText(scoreText, { exact: true })).toBeVisible();
    
    // Verify color classes
    const subjectElement = page.getByText(subject, { exact: true });
    if (total === maxSubjectScore && subject === testCase.preferredSubject) {
      // Should be purple for preferred subject
      await expect(subjectElement).toHaveClass(/text-purple-600/);
    } else if (total === maxSubjectScore) {
      // Should be green for highest score
      await expect(subjectElement).toHaveClass(/text-green-600/);
    } else {
      // Should be blue for other scores
      await expect(subjectElement).toHaveClass(/text-blue-600/);
    }
  }
}
