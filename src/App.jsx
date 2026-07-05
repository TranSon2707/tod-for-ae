import { useState } from 'react';
import { Dices, ChevronRight, Beer } from 'lucide-react';
import { useGameState } from './hooks/useGameState.js';
import { PlayerSetup } from './components/PlayerSetup.jsx';
import { QuestionSetSelector } from './components/QuestionSetSelector.jsx';
import { GameScreen } from './components/GameScreen.jsx';
import { ThemeToggle } from './components/ThemeToggle.jsx';
import { Button, Separator } from './components/ui/index.jsx';

const TABS = ['players', 'questions'];

export default function App() {
  const {
    state,
    addPlayer,
    removePlayer,
    reorderPlayers,
    selectQuestionSet,
    addCustomQuestionSet,
    setGameMode,
    startGame,
    nextTurn,
    resetGame,
  } = useGameState();

  const [activeTab, setActiveTab] = useState('players');

  if (state.screen === 'playing' || state.screen === 'finished') {
    return (
      <div className="min-h-screen bg-background flex items-start justify-center">
        <div className="w-full max-w-lg bg-card min-h-screen shadow-sm">
          <GameScreen state={state} onNext={nextTurn} onReset={resetGame} />
        </div>
      </div>
    );
  }

  const playerTabLabel = state.players.length > 0
    ? `Players (${state.players.length})`
    : 'Players';

  return (
    <div className="min-h-screen bg-background flex items-start justify-center">
      <div className="w-full max-w-lg bg-card min-h-screen shadow-sm flex flex-col">

        {/* Header */}
        <div className="px-6 pt-8 pb-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <Dices size={20} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground leading-none">
                Truth or Dare
              </h1>
              <p className="text-muted-foreground text-xs mt-0.5">
                One screen, any number of players
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-border">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                'flex-1 py-3 text-sm font-medium capitalize transition-colors',
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary -mb-px'
                  : 'text-muted-foreground hover:text-foreground',
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
          {/* Game mode toggle */}
          <div className="grid grid-cols-2 gap-1 p-1 mb-4 bg-muted rounded-xl">
            <button
              onClick={() => setGameMode('classic')}
              className={[
                'flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors',
                state.gameMode === 'classic'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              <Dices size={14} /> Classic
            </button>
            <button
              onClick={() => setGameMode('drinking')}
              className={[
                'flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors',
                state.gameMode === 'drinking'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              <Beer size={14} /> Drinking Game
            </button>
          </div>

          {state.players.length === 0 && (
            <p className="text-xs text-muted-foreground text-center mb-3">
              No players added — questions will cycle freely.
            </p>
          )}
          <Button
            onClick={startGame}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-semibold rounded-xl shadow-sm"
          >
            Start Game <ChevronRight size={18} className="ml-1" />
          </Button>
        </div>

      </div>
    </div>
  );
}