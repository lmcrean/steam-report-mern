/**
 * Checks for tied scores within a tolerance range
 * @param {Object} scores - Object containing score values
 * @param {number} tolerance - Acceptable difference to consider scores tied
 * @returns {string[]} Array of keys with tied highest scores
 */
export const checkForTies = (scores, tolerance) => {
  if (!scores || Object.keys(scores).length === 0) {
    return [];
  }

  // Convert string percentages to numbers if needed
  const numericScores = Object.entries(scores).reduce((acc, [key, value]) => {
    acc[key] = typeof value === 'string' ? parseFloat(value) : value;
    return acc;
  }, {});

  // Find highest score
  const highestScore = Math.max(...Object.values(numericScores));

  // Find all scores within tolerance of highest
  return Object.entries(numericScores)
    .filter(([_, score]) => highestScore - score <= tolerance)
    .map(([key]) => key);
}; 