export const smoothScore = (scores: number[], windowSize = 6): number => {
  if (scores.length === 0) {
    return 0;
  }

  const window = scores.slice(-windowSize);
  const sum = window.reduce((acc, value) => acc + value, 0);
  return Math.round(sum / window.length);
};
