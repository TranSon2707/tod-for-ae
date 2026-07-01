import { useState } from 'react';
import { Dices, ChevronRight } from 'lucide-react';
import { useGameState } from './hooks/useGameState.js';
import { PlayerSetup } from './components/PlayerSetup.jsx';
import { QuestionSetSelector } from './components/QuestionSetSelector.jsx';
import { GameScreen } from './components/GameScreen.jsx';
import { Button, Separator } from './components/ui/index.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// Setup screen tab labels
// ─────────────────────────────────────────────────────────────────────────────

const TABS = ['players', 'questions'];

// ─────────────────────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const {
    state,
    addPlayer,
    removePlayer,
    reorderPlayers,
    selectQuestionSet,
    addCustomQuestionSet,
    startGame,
    nextTurn,
    resetGame,
  } = useGameState();

  const [activeTab, setActiveTab] = useState('players');

  // ── Playing / finished ─────────────────────────────────────────────────────

  if (state.screen === 'playing' || state.screen === 'finished') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-start justify-center">
        <div className="w-full max-w-lg bg-white min-h-screen shadow-sm">
          <GameScreen state={state} onNext={nextTurn} onReset={resetGame} />
        </div>
      </div>
    );
  }

  // ── Setup screen ───────────────────────────────────────────────────────────

  const playerTabLabel = state.players.length > 0
    ? `Players (${state.players.length})`
    : 'Players';

  return (
    <div className="min-h-screen bg-stone-50 flex items-start justify-center">
      <div className="w-full max-w-lg bg-white min-h-screen shadow-sm flex flex-col">

        {/* Header */}
        <div className="px-6 pt-8 pb-5 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-sm">
              <Dices size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-900 leading-none">
                Truth or Dare
              </h1>
              <p className="text-stone-400 text-xs mt-0.5">
                One screen, any number of players
              </p>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-stone-100">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                'flex-1 py-3 text-sm font-medium capitalize transition-colors',
                activeTab === tab
                  ? 'text-amber-600 border-b-2 border-amber-500 -mb-px'
                  : 'text-stone-400 hover:text-stone-600',
              ].join(' ')}
            >
              {tab === 'players' ? playerTabLabel : 'Questions'}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 px-6 py-5 overflow-y-auto">
          {activeTab === 'players' ? (
            <PlayerSetup
              players={state.players}
              onAdd={addPlayer}
              onRemove={removePlayer}
              onReorder={reorderPlayers}
            />
          ) : (
            <QuestionSetSelector
              questionSets={state.questionSets}
              selectedId={state.selectedQuestionSetId}
              onSelect={selectQuestionSet}
              onUpload={addCustomQuestionSet}
            />
          )}
        </div>

        <Separator />

        {/* Start-game footer */}
        <div className="px-6 py-5">
          {state.players.length === 0 && (
            <p className="text-xs text-stone-400 text-center mb-3">
              No players added — questions will cycle freely.
            </p>
          )}
          <Button
            onClick={startGame}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white h-12 text-base font-semibold rounded-xl shadow-sm"
          >
            Start Game <ChevronRight size={18} className="ml-1" />
          </Button>
        </div>

      </div>
    </div>
  );
}
