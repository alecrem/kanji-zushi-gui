// Puzzle Engine for Kanji-zushi
// Handles puzzle generation, validation, and scoring

import { NETA_CARDS, SHARI_CARDS, VALID_KANJI, findKanji } from './gameData.js';

// Fisher-Yates shuffle algorithm
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate a random puzzle
export function generatePuzzle(netaCount = 5, shariCount = 6) {
  let puzzle;
  let attempts = 0;
  const maxAttempts = 100;

  // Keep generating until we have at least one valid combination
  do {
    const shuffledNeta = shuffle(NETA_CARDS);
    const shuffledShari = shuffle(SHARI_CARDS);

    const dealtNeta = shuffledNeta.slice(0, netaCount);
    const dealtShari = shuffledShari.slice(0, shariCount);

    puzzle = {
      neta: dealtNeta,
      shari: dealtShari,
      timestamp: Date.now(),
      seed: Math.random().toString(36).substring(7)
    };

    attempts++;
  } while (findValidCombinations(puzzle).length === 0 && attempts < maxAttempts);

  if (attempts === maxAttempts) {
    console.warn('Could not generate puzzle with valid combinations after', maxAttempts, 'attempts');
  }

  return puzzle;
}

// Find all valid kanji that can be formed from the dealt cards
export function findValidCombinations(puzzle) {
  const combinations = [];

  for (const neta of puzzle.neta) {
    for (const shari of puzzle.shari) {
      const match = VALID_KANJI.find(k =>
        k.neta === neta.id && k.shari === shari.component
      );
      if (match) {
        combinations.push({
          ...match,
          netaCard: neta,
          shariCard: shari
        });
      }
    }
  }

  return combinations;
}

// Find the optimal solution (maximum score)
// This uses a greedy algorithm - not guaranteed to be optimal but works well for this game
export function findOptimalSolution(puzzle) {
  const validCombos = findValidCombinations(puzzle);

  if (validCombos.length === 0) {
    return { kanji: [], totalScore: 0 };
  }

  // Try to find the best combination using backtracking
  const usedNeta = new Set();
  const usedShari = new Set();
  const solution = [];

  // Sort by stroke count descending for greedy approach
  const sortedCombos = [...validCombos].sort((a, b) => b.strokes - a.strokes);

  // Greedy selection
  for (const combo of sortedCombos) {
    if (!usedNeta.has(combo.neta) && !usedShari.has(combo.shari)) {
      solution.push(combo);
      usedNeta.add(combo.neta);
      usedShari.add(combo.shari);
    }
  }

  const totalScore = solution.reduce((sum, k) => sum + k.strokes, 0);

  return {
    kanji: solution,
    totalScore
  };
}

// Actually find true optimal using exhaustive search (for small puzzles this is fine)
export function findTrueOptimalSolution(puzzle) {
  const validCombos = findValidCombinations(puzzle);

  if (validCombos.length === 0) {
    return { kanji: [], totalScore: 0 };
  }

  let bestSolution = [];
  let bestScore = 0;

  // Recursive backtracking to find optimal
  function backtrack(index, currentSolution, usedNeta, usedShari) {
    // Calculate current score
    const currentScore = currentSolution.reduce((sum, k) => sum + k.strokes, 0);
    if (currentScore > bestScore) {
      bestScore = currentScore;
      bestSolution = [...currentSolution];
    }

    // Try adding more kanji
    for (let i = index; i < validCombos.length; i++) {
      const combo = validCombos[i];
      if (!usedNeta.has(combo.neta) && !usedShari.has(combo.shari)) {
        usedNeta.add(combo.neta);
        usedShari.add(combo.shari);
        currentSolution.push(combo);

        backtrack(i + 1, currentSolution, usedNeta, usedShari);

        currentSolution.pop();
        usedNeta.delete(combo.neta);
        usedShari.delete(combo.shari);
      }
    }
  }

  backtrack(0, [], new Set(), new Set());

  return {
    kanji: bestSolution,
    totalScore: bestScore
  };
}

// Game state manager
export class PuzzleGame {
  constructor() {
    this.puzzle = null;
    this.selectedNeta = null;
    this.selectedShari = null;
    this.formedKanji = [];
    this.usedNeta = new Set();
    this.usedShari = new Set();
    this.score = 0;
    this.optimalSolution = null;
    this.history = []; // For undo functionality
  }

  newPuzzle() {
    this.puzzle = generatePuzzle();
    this.selectedNeta = null;
    this.selectedShari = null;
    this.formedKanji = [];
    this.usedNeta = new Set();
    this.usedShari = new Set();
    this.score = 0;
    this.optimalSolution = findTrueOptimalSolution(this.puzzle);
    this.history = [];

    return this.puzzle;
  }

  selectNeta(netaCard) {
    if (this.usedNeta.has(netaCard.id)) {
      return { success: false, message: 'This neta card has already been used' };
    }
    this.selectedNeta = netaCard;
    return { success: true, selected: netaCard };
  }

  selectShari(shariCard) {
    if (this.usedShari.has(shariCard.id)) {
      return { success: false, message: 'This shari card has already been used' };
    }
    this.selectedShari = shariCard;
    return { success: true, selected: shariCard };
  }

  clearSelection() {
    this.selectedNeta = null;
    this.selectedShari = null;
  }

  tryFormKanji() {
    if (!this.selectedNeta || !this.selectedShari) {
      return { success: false, message: 'Please select both a neta and shari card' };
    }

    const match = VALID_KANJI.find(k =>
      k.neta === this.selectedNeta.id && k.shari === this.selectedShari.component
    );

    if (!match) {
      const result = {
        success: false,
        message: `${this.selectedNeta.component} + ${this.selectedShari.component} does not form a valid kanji`
      };
      this.clearSelection();
      return result;
    }

    // Save state for undo
    this.history.push({
      netaCard: this.selectedNeta,
      shariCard: this.selectedShari,
      kanji: match,
      score: this.score
    });

    // Valid kanji found!
    this.formedKanji.push({
      ...match,
      netaCard: this.selectedNeta,
      shariCard: this.selectedShari
    });
    this.usedNeta.add(this.selectedNeta.id);
    this.usedShari.add(this.selectedShari.id);
    this.score += match.strokes;

    const result = {
      success: true,
      kanji: match.kanji,
      strokes: match.strokes,
      totalScore: this.score,
      message: `Formed ${match.kanji} (${match.strokes} strokes)! Total score: ${this.score}`
    };

    this.clearSelection();
    return result;
  }

  undo() {
    if (this.history.length === 0) {
      return { success: false, message: 'Nothing to undo' };
    }

    const lastMove = this.history.pop();

    // Restore state
    this.formedKanji.pop();
    this.usedNeta.delete(lastMove.netaCard.id);
    this.usedShari.delete(lastMove.shariCard.id);
    this.score = lastMove.score;

    return {
      success: true,
      message: `Undid ${lastMove.kanji.kanji}. Score: ${this.score}`,
      undoneKanji: lastMove.kanji.kanji
    };
  }

  canUndo() {
    return this.history.length > 0;
  }

  getAvailableNeta() {
    return this.puzzle.neta.filter(n => !this.usedNeta.has(n.id));
  }

  getAvailableShari() {
    return this.puzzle.shari.filter(s => !this.usedShari.has(s.id));
  }

  getRemainingValidCombinations() {
    const availableNeta = this.getAvailableNeta();
    const availableShari = this.getAvailableShari();

    const combinations = [];
    for (const neta of availableNeta) {
      for (const shari of availableShari) {
        const match = VALID_KANJI.find(k =>
          k.neta === neta.id && k.shari === shari.component
        );
        if (match) {
          combinations.push(match);
        }
      }
    }
    return combinations;
  }

  isGameOver() {
    return this.getAvailableNeta().length === 0 ||
           this.getAvailableShari().length === 0 ||
           this.getRemainingValidCombinations().length === 0;
  }

  getGameSummary() {
    return {
      formedKanji: this.formedKanji,
      totalScore: this.score,
      optimalScore: this.optimalSolution.totalScore,
      optimalKanji: this.optimalSolution.kanji,
      percentageOfOptimal: this.optimalSolution.totalScore > 0
        ? Math.round((this.score / this.optimalSolution.totalScore) * 100)
        : 100,
      remainingCombinations: this.getRemainingValidCombinations().length
    };
  }
}
