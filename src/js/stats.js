// Statistics tracking for Kanji-zushi Puzzle Mode
// Uses localStorage to persist player statistics

const STORAGE_KEY = 'kanji_zushi_stats';

// Default stats structure
const defaultStats = {
  gamesPlayed: 0,
  totalScore: 0,
  bestScore: 0,
  bestEfficiency: 0,
  totalKanjiFormed: 0,
  averageScore: 0,
  averageEfficiency: 0,
  perfectGames: 0, // 100% efficiency
  lastPlayed: null
};

// Load stats from localStorage
export function loadStats() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultStats, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn('Could not load stats from localStorage:', e);
  }
  return { ...defaultStats };
}

// Save stats to localStorage
export function saveStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.warn('Could not save stats to localStorage:', e);
  }
}

// Update stats after a game
export function recordGame(playerScore, optimalScore, kanjiCount) {
  const stats = loadStats();
  const efficiency = optimalScore > 0 ? Math.round((playerScore / optimalScore) * 100) : 100;

  stats.gamesPlayed++;
  stats.totalScore += playerScore;
  stats.totalKanjiFormed += kanjiCount;
  stats.bestScore = Math.max(stats.bestScore, playerScore);
  stats.bestEfficiency = Math.max(stats.bestEfficiency, efficiency);
  stats.averageScore = Math.round(stats.totalScore / stats.gamesPlayed);
  stats.averageEfficiency = Math.round(
    ((stats.averageEfficiency * (stats.gamesPlayed - 1)) + efficiency) / stats.gamesPlayed
  );
  if (efficiency === 100) {
    stats.perfectGames++;
  }
  stats.lastPlayed = new Date().toISOString();

  saveStats(stats);
  return stats;
}

// Reset all statistics
export function resetStats() {
  saveStats(defaultStats);
  return { ...defaultStats };
}

// Get formatted stats for display
export function getFormattedStats() {
  const stats = loadStats();
  return {
    'Games Played': stats.gamesPlayed,
    'Total Score': stats.totalScore,
    'Best Score': stats.bestScore,
    'Average Score': stats.averageScore,
    'Best Efficiency': `${stats.bestEfficiency}%`,
    'Average Efficiency': `${stats.averageEfficiency}%`,
    'Perfect Games': stats.perfectGames,
    'Total Kanji Formed': stats.totalKanjiFormed,
    'Last Played': stats.lastPlayed ? new Date(stats.lastPlayed).toLocaleDateString() : 'Never'
  };
}
