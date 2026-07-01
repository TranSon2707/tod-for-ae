# Truth or Dare Game

A single-screen Truth or Dare app for any number of players.

## Project structure

```
tod-game/
├── index.html                     # HTML entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
│
└── src/
    ├── main.jsx                   # React root — mounts <App />
    ├── App.jsx                    # Top-level component; setup ↔ game routing
    ├── index.css                  # Tailwind directives + CSS custom properties
    │
    ├── data/
    │   └── questionSets.js        # Built-in Classic and Spicy question sets
    │
    ├── hooks/
    │   └── useGameState.js        # All game state + action callbacks
    │
    └── components/
        ├── PlayerSetup.jsx        # Add / remove / reorder players
        ├── QuestionSetSelector.jsx # Pick a built-in set or upload a CSV
        ├── GameScreen.jsx         # Active game: draw cards, advance turns
        └── ui/
            └── index.jsx          # Reusable primitives: Button, Input, Badge, Separator
```

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Custom question sets (CSV upload)

Upload a `.csv` file with two columns:

| question text | truth or dare |
|---|---|
| What is your biggest fear? | truth |
| Do 20 jumping jacks | dare |

The header row is optional. The second column accepts `truth`, `dare`, `t`, or `d`.

## How the game works

1. **Setup** — add players (optional) and choose a question set.
2. **Playing** — tap **Next** to draw a card. The game tracks which questions
   each player has already answered so no one gets the same question twice.
3. **Finished** — once every player has answered every question, the game ends.
