// Main Application for Kanji-zushi Puzzle Mode
import { PuzzleGame } from './puzzleEngine.js';
import { VALID_KANJI } from './gameData.js';
import { recordGame, getFormattedStats, resetStats } from './stats.js';

// DOM Elements
const elements = {
  netaCards: document.getElementById('netaCards'),
  shariCards: document.getElementById('shariCards'),
  currentScore: document.getElementById('currentScore'),
  kanjiCount: document.getElementById('kanjiCount'),
  remainingCombos: document.getElementById('remainingCombos'),
  previewNeta: document.getElementById('previewNeta'),
  previewShari: document.getElementById('previewShari'),
  previewResult: document.getElementById('previewResult'),
  formKanjiBtn: document.getElementById('formKanjiBtn'),
  clearBtn: document.getElementById('clearBtn'),
  undoBtn: document.getElementById('undoBtn'),
  giveUpBtn: document.getElementById('giveUpBtn'),
  newPuzzleBtn: document.getElementById('newPuzzleBtn'),
  hintBtn: document.getElementById('hintBtn'),
  message: document.getElementById('message'),
  formedKanjiSection: document.getElementById('formedKanjiSection'),
  formedList: document.getElementById('formedList'),
  summaryModal: document.getElementById('summaryModal'),
  finalScore: document.getElementById('finalScore'),
  optimalScore: document.getElementById('optimalScore'),
  efficiency: document.getElementById('efficiency'),
  finalKanjiCount: document.getElementById('finalKanjiCount'),
  optimalKanjiList: document.getElementById('optimalKanjiList'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  statsBtn: document.getElementById('statsBtn'),
  statsModal: document.getElementById('statsModal'),
  statsContent: document.getElementById('statsContent'),
  closeStatsBtn: document.getElementById('closeStatsBtn'),
  resetStatsBtn: document.getElementById('resetStatsBtn'),
  shareBtn: document.getElementById('shareBtn'),
  timedModeBtn: document.getElementById('timedModeBtn'),
  timerSection: document.getElementById('timerSection'),
  timerDisplay: document.getElementById('timerDisplay')
};

// Game instance
const game = new PuzzleGame();

// Timer state
let timerInterval = null;
let timeRemaining = 0;
let isTimedMode = false;

// Show message
function showMessage(text, type = 'info') {
  elements.message.textContent = text;
  elements.message.className = `message show ${type}`;
  setTimeout(() => {
    elements.message.classList.remove('show');
  }, 3000);
}

// Update score display
function updateScoreDisplay() {
  const oldScore = parseInt(elements.currentScore.textContent) || 0;
  const newScore = game.score;

  elements.currentScore.textContent = newScore;
  elements.kanjiCount.textContent = game.formedKanji.length;
  elements.remainingCombos.textContent = game.getRemainingValidCombinations().length;
  elements.undoBtn.disabled = !game.canUndo();

  // Animate score change
  if (newScore !== oldScore) {
    elements.currentScore.classList.add('updated');
    setTimeout(() => {
      elements.currentScore.classList.remove('updated');
    }, 300);
  }
}

// Render neta cards
function renderNetaCards() {
  elements.netaCards.innerHTML = '';
  game.puzzle.neta.forEach((neta, index) => {
    const card = document.createElement('div');
    card.className = 'card neta';
    card.dataset.id = neta.id;
    card.title = `${neta.name} (Press ${index + 1})`;

    // Add keyboard shortcut label
    const shortcutLabel = document.createElement('span');
    shortcutLabel.className = 'shortcut-label';
    shortcutLabel.textContent = index + 1;
    card.appendChild(shortcutLabel);

    // Add component text
    const componentText = document.createTextNode(neta.component);
    card.appendChild(componentText);

    if (game.usedNeta.has(neta.id)) {
      card.classList.add('used');
    } else if (game.selectedNeta && game.selectedNeta.id === neta.id) {
      card.classList.add('selected');
    }

    card.addEventListener('click', () => handleNetaClick(neta));
    elements.netaCards.appendChild(card);
  });
}

// Render shari cards
function renderShariCards() {
  elements.shariCards.innerHTML = '';
  const shariLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
  game.puzzle.shari.forEach((shari, index) => {
    const card = document.createElement('div');
    card.className = 'card shari';
    card.dataset.id = shari.id;

    // Add keyboard shortcut label
    const shortcutLabel = document.createElement('span');
    shortcutLabel.className = 'shortcut-label';
    shortcutLabel.textContent = shariLabels[index];
    card.appendChild(shortcutLabel);

    // Add component text
    const componentText = document.createTextNode(shari.component);
    card.appendChild(componentText);

    if (game.usedShari.has(shari.id)) {
      card.classList.add('used');
    } else if (game.selectedShari && game.selectedShari.id === shari.id) {
      card.classList.add('selected');
    }

    card.addEventListener('click', () => handleShariClick(shari));
    elements.shariCards.appendChild(card);
  });
}

// Update combination preview
function updatePreview() {
  if (game.selectedNeta) {
    elements.previewNeta.innerHTML = game.selectedNeta.component;
  } else {
    elements.previewNeta.innerHTML = '<span class="empty">Select neta</span>';
  }

  if (game.selectedShari) {
    elements.previewShari.innerHTML = game.selectedShari.component;
  } else {
    elements.previewShari.innerHTML = '<span class="empty">Select shari</span>';
  }

  // Check if combination is valid
  if (game.selectedNeta && game.selectedShari) {
    const match = VALID_KANJI.find(k =>
      k.neta === game.selectedNeta.id && k.shari === game.selectedShari.component
    );
    if (match) {
      elements.previewResult.textContent = match.kanji;
      elements.previewResult.classList.remove('invalid');
      elements.formKanjiBtn.disabled = false;
    } else {
      elements.previewResult.textContent = '✗';
      elements.previewResult.classList.add('invalid');
      elements.formKanjiBtn.disabled = true;
    }
  } else {
    elements.previewResult.textContent = '?';
    elements.previewResult.classList.remove('invalid');
    elements.formKanjiBtn.disabled = true;
  }
}

// Handle neta card click
function handleNetaClick(neta) {
  if (game.usedNeta.has(neta.id)) {
    showMessage('This neta card has already been used', 'error');
    return;
  }

  const result = game.selectNeta(neta);
  if (result.success) {
    renderNetaCards();
    updatePreview();
  }
}

// Handle shari card click
function handleShariClick(shari) {
  if (game.usedShari.has(shari.id)) {
    showMessage('This shari card has already been used', 'error');
    return;
  }

  const result = game.selectShari(shari);
  if (result.success) {
    renderShariCards();
    updatePreview();
  }
}

// Render formed kanji list
function renderFormedKanji() {
  if (game.formedKanji.length === 0) {
    elements.formedKanjiSection.style.display = 'none';
    return;
  }

  elements.formedKanjiSection.style.display = 'block';
  elements.formedList.innerHTML = '';

  game.formedKanji.forEach(k => {
    const item = document.createElement('div');
    item.className = 'formed-item';
    item.innerHTML = `
      <span class="formed-kanji-char">${k.kanji}</span>
      <span class="formed-strokes">${k.strokes} strokes</span>
    `;
    elements.formedList.appendChild(item);
  });
}

// Form kanji button handler
function handleFormKanji() {
  const result = game.tryFormKanji();

  if (result.success) {
    // Celebrate the kanji formation
    elements.previewResult.classList.add('celebrating');
    setTimeout(() => {
      elements.previewResult.classList.remove('celebrating');
    }, 600);

    showMessage(result.message, 'success');
    renderNetaCards();
    renderShariCards();
    updatePreview();
    updateScoreDisplay();
    renderFormedKanji();

    // Check if game is over
    if (game.isGameOver()) {
      setTimeout(() => showSummary(), 500);
    }
  } else {
    showMessage(result.message, 'error');
    // Shake the preview on error
    elements.previewResult.classList.add('invalid');
    setTimeout(() => {
      elements.previewResult.classList.remove('invalid');
    }, 400);
    updatePreview();
  }
}

// Clear selection
function handleClearSelection() {
  game.clearSelection();
  renderNetaCards();
  renderShariCards();
  updatePreview();
}

// Give up / end game
function handleGiveUp() {
  showSummary();
}

// Show hint
function handleHint() {
  const remainingCombos = game.getRemainingValidCombinations();
  if (remainingCombos.length === 0) {
    showMessage('No valid combinations remaining!', 'info');
    return;
  }

  // Pick a random valid combination as hint
  const hint = remainingCombos[Math.floor(Math.random() * remainingCombos.length)];
  const netaCard = game.puzzle.neta.find(n => n.id === hint.neta);

  showMessage(`Hint: Try ${netaCard.component} + ${hint.shari} = ${hint.kanji} (${hint.strokes} strokes)`, 'info');
}

// Undo last move
function handleUndo() {
  const result = game.undo();
  if (result.success) {
    showMessage(result.message, 'info');
    renderNetaCards();
    renderShariCards();
    updatePreview();
    updateScoreDisplay();
    renderFormedKanji();
  } else {
    showMessage(result.message, 'error');
  }
}

// Show game summary
function showSummary() {
  const summary = game.getGameSummary();

  // Record the game in statistics
  recordGame(summary.totalScore, summary.optimalScore, summary.formedKanji.length);

  elements.finalScore.textContent = summary.totalScore;
  elements.optimalScore.textContent = summary.optimalScore;
  elements.efficiency.textContent = `${summary.percentageOfOptimal}%`;
  elements.finalKanjiCount.textContent = summary.formedKanji.length;

  // Show optimal solution
  elements.optimalKanjiList.innerHTML = '';
  summary.optimalKanji.forEach(k => {
    const item = document.createElement('span');
    item.className = 'optimal-item';
    item.textContent = `${k.kanji} (${k.strokes})`;
    elements.optimalKanjiList.appendChild(item);
  });

  elements.summaryModal.classList.add('show');
}

// Show statistics
function showStats() {
  const stats = getFormattedStats();
  let html = '';

  for (const [label, value] of Object.entries(stats)) {
    html += `
      <div class="summary-stat">
        <span class="summary-label">${label}:</span>
        <span class="summary-value">${value}</span>
      </div>
    `;
  }

  elements.statsContent.innerHTML = html;
  elements.statsModal.classList.add('show');
}

// Reset statistics
function handleResetStats() {
  if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
    resetStats();
    showStats(); // Refresh the display
    showMessage('Statistics have been reset', 'info');
  }
}

// Start new puzzle
function startNewPuzzle(seedString = null) {
  stopTimer(); // Stop any running timer
  game.newPuzzle(seedString);
  renderNetaCards();
  renderShariCards();
  updatePreview();
  updateScoreDisplay();
  renderFormedKanji();
  elements.summaryModal.classList.remove('show');

  // Clear seed from URL when starting a new random puzzle
  if (!seedString && window.location.search) {
    window.history.replaceState({}, '', window.location.pathname);
  }

  const seedInfo = seedString ? ` Seed: ${seedString}` : '';
  showMessage(`New puzzle! Optimal score: ${game.optimalSolution.totalScore} points possible${seedInfo}`, 'info');
}

// Share current puzzle
function handleShare() {
  const seed = game.getSeed();
  if (!seed) {
    showMessage('No puzzle to share', 'error');
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set('seed', seed);
  const shareUrl = url.toString();

  // Try to copy to clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareUrl).then(() => {
      showMessage(`Puzzle link copied! Seed: ${seed}`, 'success');
    }).catch(() => {
      showMessage(`Share URL: ${shareUrl}`, 'info');
    });
  } else {
    // Fallback for older browsers
    prompt('Copy this URL to share the puzzle:', shareUrl);
  }
}

// Check for seed in URL parameters
function checkUrlForSeed() {
  const params = new URLSearchParams(window.location.search);
  const seed = params.get('seed');
  return seed;
}

// Timer functions
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
  elements.timerDisplay.textContent = formatTime(timeRemaining);

  // Remove previous state classes
  elements.timerDisplay.classList.remove('warning', 'danger');

  // Add warning/danger styling
  if (timeRemaining <= 10) {
    elements.timerDisplay.classList.add('danger');
  } else if (timeRemaining <= 30) {
    elements.timerDisplay.classList.add('warning');
  }
}

function startTimer(duration = 120) {
  stopTimer(); // Clear any existing timer
  timeRemaining = duration;
  isTimedMode = true;

  elements.timerSection.style.display = 'block';
  elements.timedModeBtn.textContent = 'Stop Timer';
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();

    if (timeRemaining <= 0) {
      stopTimer();
      showMessage('Time\'s up!', 'error');
      setTimeout(() => showSummary(), 500);
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  isTimedMode = false;
  elements.timerSection.style.display = 'none';
  elements.timedModeBtn.textContent = 'Timed Mode';
  elements.timerDisplay.classList.remove('warning', 'danger');
}

function handleTimedMode() {
  if (isTimedMode) {
    stopTimer();
    showMessage('Timer stopped', 'info');
  } else {
    startNewPuzzle();
    startTimer(120); // 2 minutes
    showMessage('Timed mode started! You have 2 minutes!', 'info');
  }
}

// Event listeners
elements.formKanjiBtn.addEventListener('click', handleFormKanji);
elements.clearBtn.addEventListener('click', handleClearSelection);
elements.undoBtn.addEventListener('click', handleUndo);
elements.hintBtn.addEventListener('click', handleHint);
elements.giveUpBtn.addEventListener('click', handleGiveUp);
elements.newPuzzleBtn.addEventListener('click', () => startNewPuzzle());
elements.closeModalBtn.addEventListener('click', () => startNewPuzzle());
elements.shareBtn.addEventListener('click', handleShare);
elements.timedModeBtn.addEventListener('click', handleTimedMode);
elements.statsBtn.addEventListener('click', showStats);
elements.closeStatsBtn.addEventListener('click', () => elements.statsModal.classList.remove('show'));
elements.resetStatsBtn.addEventListener('click', handleResetStats);

// Close modals on outside click
elements.summaryModal.addEventListener('click', (e) => {
  if (e.target === elements.summaryModal) {
    elements.summaryModal.classList.remove('show');
  }
});

elements.statsModal.addEventListener('click', (e) => {
  if (e.target === elements.statsModal) {
    elements.statsModal.classList.remove('show');
  }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  // Don't handle keyboard shortcuts when modals are open
  if (elements.summaryModal.classList.contains('show') ||
      elements.statsModal.classList.contains('show')) {
    if (e.key === 'Escape') {
      elements.summaryModal.classList.remove('show');
      elements.statsModal.classList.remove('show');
    }
    return;
  }

  // Number keys 1-5 for neta cards
  if (e.key >= '1' && e.key <= '5') {
    const index = parseInt(e.key) - 1;
    if (index < game.puzzle.neta.length) {
      handleNetaClick(game.puzzle.neta[index]);
    }
    return;
  }

  // Letter keys A-F for shari cards
  const shariKeys = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5 };
  if (shariKeys.hasOwnProperty(e.key.toLowerCase())) {
    const index = shariKeys[e.key.toLowerCase()];
    if (index < game.puzzle.shari.length) {
      handleShariClick(game.puzzle.shari[index]);
    }
    return;
  }

  // Other keyboard shortcuts
  switch (e.key.toLowerCase()) {
    case 'enter':
    case ' ':
      if (!elements.formKanjiBtn.disabled) {
        handleFormKanji();
      }
      e.preventDefault();
      break;
    case 'escape':
      handleClearSelection();
      break;
    case 'h':
      handleHint();
      break;
    case 'z':
      if (e.ctrlKey || e.metaKey) {
        handleUndo();
        e.preventDefault();
      }
      break;
    case 'n':
      startNewPuzzle();
      break;
    case 's':
      if (e.ctrlKey || e.metaKey) {
        handleShare();
        e.preventDefault();
      }
      break;
    case 't':
      handleTimedMode();
      break;
  }
});

// Initialize game
const urlSeed = checkUrlForSeed();
if (urlSeed) {
  startNewPuzzle(urlSeed);
  showMessage(`Loaded shared puzzle! Seed: ${urlSeed}`, 'success');
} else {
  startNewPuzzle();
}

console.log('Kanji-zushi Puzzle Mode initialized!');
console.log('Keyboard shortcuts: 1-5 for neta, A-F for shari, Enter to form, Esc to clear, H for hint, N for new puzzle');
