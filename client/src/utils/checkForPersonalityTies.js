/**
 * Checks for tied personality trait scores within a tolerance range
 * @param {Object} scores - Object containing personality trait scores
 * @param {number} tolerance - Acceptable difference to consider scores tied (default: 5)
 * @returns {string[]} Array of personality traits with tied highest scores
 */
export const checkForPersonalityTies = (scores, tolerance = 5) => {
  if (!scores || Object.keys(scores).length === 0) {
    return [];
  }

  // Convert string percentages to numbers if needed
  const numericScores = Object.entries(scores).reduce((acc, [key, value]) => {
    acc[key] = typeof value === 'string' ? parseFloat(value) : value;
    return acc;
  }, {});

  // Sort scores from highest to lowest
  const sortedScores = Object.entries(numericScores)
    .sort(([, a], [, b]) => b - a);
  
  const highestScore = sortedScores[0][1];
  
  // Return traits within tolerance of highest score
  return sortedScores
    .filter(([, score]) => Math.abs(score - highestScore) <= tolerance)
    .map(([trait]) => trait);
}; 