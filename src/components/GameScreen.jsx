import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Flame, CircleHelp, RotateCcw, Users } from 'lucide-react';
import { Badge } from './ui/index.jsx';
import { Button } from './ui/index.jsx';

const FLIP_DURATION_MS = 700; // keep in sync with the `card-flip` keyframes in index.css

export function GameScreen({ state, onNext, onReset }) {
  const { currentQuestion, currentPlayerIndex, players, screen } = state;

  const [displayedQuestion, setDisplayedQuestion]     = useState(null);
  const [displayedPlayerName, setDisplayedPlayerName] = useState(null);
  const [isFlipping, setIsFlipping]                   = useState(false);

  const swapTimeoutRef = useRef(null);
  const endTimeoutRef  = useRef(null);

  useEffect(() => {
    if (!currentQuestion || currentQuestion === displayedQuestion) return;

    const prevIndex = players.length > 0
      ? (currentPlayerIndex - 1 + players.length) % players.length
      : -1;
    const incomingPlayerName = prevIndex >= 0 ? players[prevIndex]?.name ?? null : null;

    // Very first card: just settle in, no lift/flip to fly in from.
    if (!displayedQuestion) {
      setDisplayedQuestion(currentQuestion);
      setDisplayedPlayerName(incomingPlayerName);
      return;
    }

    clearTimeout(swapTimeoutRef.current);
    clearTimeout(endTimeoutRef.current);
    setIsFlipping(true);

    // Swap content exactly when the card is edge-on (90deg) and invisible.
    swapTimeoutRef.current = setTimeout(() => {
      setDisplayedQuestion(currentQuestion);
      setDisplayedPlayerName(incomingPlayerName);
    }, FLIP_DURATION_MS / 2);

    // Drop the class once the animation finishes so it can replay next time.
    endTimeoutRef.current = setTimeout(() => {
      setIsFlipping(false);
    }, FLIP_DURATION_MS);

    return () => {
      clearTimeout(swapTimeoutRef.current);
      clearTimeout(endTimeoutRef.current);
    };
  }, [currentQuestion]);

  const isFirstCard = !displayedQuestion;
  const isTruth     = displayedQuestion?.type === 'truth';

  // ── Finished screen ────────────────────────────────────────────────────────

  if (screen === 'finished') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 space-y-6">
        <div className="text-6xl">🎉</div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Game Finished!</h2>
          <p className="text-muted-foreground mt-2">
            Every player has answered every question. You've been playing for way too long!
          </p>
        </div>
        <Button
          onClick={onReset}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
        >
          <RotateCcw size={16} className="mr-2" /> Start Over
        </Button>
      </div>
    );
  }

  // ── Active game screen ───────────────────────────────────────────────────

  return (
    <div className="flex flex-col min-h-[70vh]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users size={14} />
          <span>
            {players.length > 0
              ? `${players.length} player${players.length !== 1 ? 's' : ''}`
              : 'No players'}
          </span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw size={12} /> Restart
        </button>
      </div>

      {/* Card area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {isFirstCard ? (
          <div className="text-center space-y-4 max-w-sm">
            <div className="text-5xl mb-2">🃏</div>
            <h2 className="text-xl font-bold text-foreground">Ready to play!</h2>
            <p className="text-muted-foreground text-sm">
              {players.length > 0
                ? `Starting with ${players[0].name}. Press Next to draw the first question.`
                : 'Press Next to draw the first question.'}
            </p>
          </div>
        ) : (
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
            {displayedPlayerName && (
              <p className="text-center text-muted-foreground text-sm font-medium mb-3 uppercase tracking-wider">
                {displayedPlayerName}'s turn
              </p>
            )}

            <div className="card-flip-stage">
              <div
                className={[
                  'relative rounded-2xl border-2 shadow-lg overflow-hidden cursor-pointer select-none',
                  isTruth
                    ? 'border-truth/30 bg-gradient-to-br from-truth/10 to-truth/5'
                    : 'border-dare/30 bg-gradient-to-br from-dare/10 to-dare/5',
                  isFlipping ? 'animate-card-flip' : '',
                ].join(' ')}
              >
                <div className="flex items-center gap-2 px-5 pt-5 pb-3">
                  {isTruth
                    ? <CircleHelp size={18} className="text-truth" />
                    : <Flame      size={18} className="text-dare" />
                  }
                  <Badge
                    className={[
                      'text-xs font-bold uppercase tracking-widest border-0',
                      isTruth ? 'bg-truth/15 text-truth' : 'bg-dare/15 text-dare',
                    ].join(' ')}
                  >
                    {displayedQuestion?.type}
                  </Badge>
                </div>

                <div className="px-5 pb-6 min-h-[120px] flex items-center">
                  <p className="text-foreground text-lg font-medium leading-snug whitespace-pre-line">
                    {displayedQuestion?.text}
                  </p>
                </div>

                <div
                  className={[
                    'absolute top-0 right-0 w-16 h-16 opacity-10 rounded-bl-full',
                    isTruth ? 'bg-truth' : 'bg-dare',
                  ].join(' ')}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="px-6 pb-8">
        <Button
          onClick={onNext}
          disabled={isFlipping}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-semibold rounded-xl"
        >
          {isFirstCard ? 'Start' : 'Next'}
          <ArrowRight size={18} className="ml-2" />
        </Button>

        {players.length > 0 && !isFirstCard && (
          <p className="text-center text-xs text-muted-foreground mt-2">
            Next up:{' '}
            <span className="font-medium text-foreground">
              {players[currentPlayerIndex]?.name}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
