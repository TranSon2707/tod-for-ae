import { useState, useEffect } from 'react';
import { ArrowRight, Flame, CircleHelp, RotateCcw, Users } from 'lucide-react';
import { Badge } from './ui/index.jsx';
import { Button } from './ui/index.jsx';

/**
 * The active game screen: shows whose turn it is, draws the question card,
 * and handles the "finished" end-state.
 *
 * @param {{ screen, currentQuestion, currentPlayerIndex, players }} state
 * @param {() => void} onNext  - Draw the next question / advance turn.
 * @param {() => void} onReset - Return to the setup screen.
 */
export function GameScreen({ state, onNext, onReset }) {
  const { currentQuestion, currentPlayerIndex, players, screen } = state;

  // cardKey bumps on every new question to re-trigger the entrance animation.
  const [cardKey, setCardKey]                   = useState(0);
  const [currentPlayerName, setCurrentPlayerName] = useState(null);

  useEffect(() => {
    if (!currentQuestion) return;

    // The player whose name we show is the one who *just* drew the card
    // (i.e. the previous index before it incremented).
    const prevIndex = players.length > 0
      ? (currentPlayerIndex - 1 + players.length) % players.length
      : -1;

    setCurrentPlayerName(prevIndex >= 0 ? players[prevIndex]?.name ?? null : null);
    setCardKey((k) => k + 1);
  }, [currentQuestion]);

  const isFirstCard = !currentQuestion;
  const isTruth     = currentQuestion?.type === 'truth';

  // ── Finished screen ────────────────────────────────────────────────────────

  if (screen === 'finished') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 space-y-6">
        <div className="text-6xl">🎉</div>

        <div>
          <h2 className="text-2xl font-bold text-stone-800">Game Finished!</h2>
          <p className="text-stone-500 mt-2">
            Every player has answered every question. You've been playing for way too long!
          </p>
        </div>

        <Button
          onClick={onReset}
          className="bg-amber-500 hover:bg-amber-600 text-white px-8"
        >
          <RotateCcw size={16} className="mr-2" /> Start Over
        </Button>
      </div>
    );
  }

  // ── Active game screen ─────────────────────────────────────────────────────

  return (
    <div className="flex flex-col min-h-[70vh]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <Users size={14} />
          <span>
            {players.length > 0
              ? `${players.length} player${players.length !== 1 ? 's' : ''}`
              : 'No players'}
          </span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition-colors"
        >
          <RotateCcw size={12} /> Restart
        </button>
      </div>

      {/* Card area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {isFirstCard ? (
          /* Pre-game placeholder */
          <div className="text-center space-y-4 max-w-sm">
            <div className="text-5xl mb-2">🃏</div>
            <h2 className="text-xl font-bold text-stone-700">Ready to play!</h2>
            <p className="text-stone-400 text-sm">
              {players.length > 0
                ? `Starting with ${players[0].name}. Press Next to draw the first question.`
                : 'Press Next to draw the first question.'}
            </p>
          </div>
        ) : (
          /* Question card */
          <div
            key={cardKey}
            className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300"
          >
            {currentPlayerName && (
              <p className="text-center text-stone-400 text-sm font-medium mb-3 uppercase tracking-wider">
                {currentPlayerName}'s turn
              </p>
            )}

            <div
              className={[
                'relative rounded-2xl border-2 shadow-lg overflow-hidden cursor-pointer select-none',
                isTruth
                  ? 'border-sky-200 bg-gradient-to-br from-sky-50 to-blue-50'
                  : 'border-rose-200 bg-gradient-to-br from-rose-50 to-orange-50',
              ].join(' ')}
            >
              {/* Card type label */}
              <div className="flex items-center gap-2 px-5 pt-5 pb-3">
                {isTruth
                  ? <CircleHelp size={18} className="text-sky-500" />
                  : <Flame      size={18} className="text-rose-500" />
                }
                <Badge
                  className={[
                    'text-xs font-bold uppercase tracking-widest border-0',
                    isTruth
                      ? 'bg-sky-100 text-sky-700'
                      : 'bg-rose-100 text-rose-700',
                  ].join(' ')}
                >
                  {currentQuestion?.type}
                </Badge>
              </div>

              {/* Question text */}
              <div className="px-5 pb-6 min-h-[120px] flex items-center">
                <p className="text-stone-800 text-lg font-medium leading-snug">
                  {currentQuestion?.text}
                </p>
              </div>

              {/* Decorative corner accent */}
              <div
                className={[
                  'absolute top-0 right-0 w-16 h-16 opacity-10 rounded-bl-full',
                  isTruth ? 'bg-sky-500' : 'bg-rose-500',
                ].join(' ')}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="px-6 pb-8">
        <Button
          onClick={onNext}
          className="w-full bg-stone-900 hover:bg-stone-700 text-white h-12 text-base font-semibold rounded-xl"
        >
          {isFirstCard ? 'Start' : 'Next'}
          <ArrowRight size={18} className="ml-2" />
        </Button>

        {players.length > 0 && !isFirstCard && (
          <p className="text-center text-xs text-stone-400 mt-2">
            Next up:{' '}
            <span className="font-medium text-stone-500">
              {players[currentPlayerIndex]?.name}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
