# Kanji-zushi GUI

A web-based implementation of the Kanji-zushi card game, featuring a Puzzle Mode where players combine neta (left half) and shari (right half) cards to form valid Japanese kanji characters.

## What is Kanji-zushi?

Kanji-zushi is a competitive card game where players:
- Combine two types of cards to form Japanese kanji characters
- **Neta cards**: Left half components (radicals like 亻, 氵, 言, etc.)
- **Shari cards**: Right half components (木, 寺, 青, etc.)
- Score points based on the total stroke count of valid kanji formed

## Puzzle Mode

The puzzle mode is a single-player challenge where you:
1. Receive 5 random neta cards and 6 random shari cards
2. Find the best combinations to maximize your score
3. Each valid kanji scores its stroke count
4. Compare your score to the optimal solution

## Quick Start

### Run with npx (no installation required)
```bash
npx http-server src -p 3000
```
Then open http://localhost:3000 in your browser.

### Or using npm scripts
```bash
npm run serve
# or
npm start  # opens browser automatically
```

## How to Play

1. **Select a neta card** (left half) from your hand
2. **Select a shari card** (right half) from the table
3. If the combination forms a valid kanji, click **"Form Kanji"**
4. The kanji and its stroke count are added to your score
5. Used cards are removed from play
6. Continue until no more valid combinations exist, or click **"Give Up"**
7. See your final score compared to the optimal solution

## Project Structure

```
kanji-zushi-gui/
├── src/
│   ├── index.html          # Main game UI
│   ├── css/
│   │   └── style.css       # Game styling
│   └── js/
│       ├── app.js          # Main application logic
│       ├── gameData.js     # Card definitions and valid kanji
│       ├── puzzleEngine.js # Puzzle generation and game logic
│       └── stats.js        # Statistics tracking with localStorage
├── docs/                   # Game rules and documentation
└── package.json
```

## Valid Kanji

The game includes 71 valid kanji combinations from the 10 neta radicals:
- 亻 (person) - 9 kanji
- 氵 (water) - 12 kanji
- 彳 (step) - 4 kanji
- 土 (earth) - 3 kanji
- 扌 (hand) - 8 kanji
- 木 (tree) - 6 kanji
- 日 (sun) - 5 kanji
- 禾 (grain) - 5 kanji
- 糸 (thread) - 8 kanji
- 言 (speech) - 11 kanji

## Features

- **Random puzzle generation** - Each puzzle is unique
- **Real-time validation** - See if your combination is valid before submitting
- **Optimal solution calculator** - Compare your score to the best possible
- **Score tracking** - Track your progress and remaining valid moves
- **Undo functionality** - Made a mistake? Undo your last move
- **Hint system** - Stuck? Get a hint for a valid combination
- **Statistics tracking** - Track your lifetime stats (best score, average efficiency, perfect games)
- **Shareable puzzles** - Share specific puzzles with friends via URL
- **Responsive design** - Works on desktop and mobile

## Sharing Puzzles

Click the **Share** button to copy a URL that others can use to play the exact same puzzle. The URL contains a seed that reproduces the same card layout, so you can challenge friends to beat your score!

Example: `http://localhost:3000/?seed=m9k2x7abc123`

## Development

The game is built with vanilla JavaScript (ES6 modules), HTML5, and CSS3. No build tools or dependencies required.

To modify the game:
- Edit `src/js/gameData.js` to add/modify kanji combinations
- Edit `src/js/puzzleEngine.js` to change game logic
- Edit `src/js/app.js` to modify UI behavior
- Edit `src/css/style.css` to change appearance

## License

MIT License - see LICENSE file for details.

## Credits

- Game design: Kanji-zushi card game
- Implementation: Claude Code assistant
- Author: Alejandro Cremades
