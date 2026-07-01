import { useState, useCallback } from 'react';
import { DEFAULT_QUESTION_SETS } from '../data/questionSets.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns a new array with elements in a random order (Fisher-Yates). */
function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Returns the initial (blank) game state. */
function createInitialState() {
  return {
    screen: 'setup',                      // 'setup' | 'playing' | 'finished'
    players: [],                          // { id, name, answeredQuestionIds: Set }
    currentPlayerIndex: 0,
    currentQuestion: null,
    questionQueue: [],                    // remaining questions to draw from
    allQuestions: [],                     // full question list for the active set
    selectedQuestionSetId: 'classic',
    questionSets: DEFAULT_QUESTION_SETS,
  };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Encapsulates all game state and the actions that mutate it.
 * Returns state + action callbacks ready for prop-drilling into components.
 */
export function useGameState() {
  const [state, setState] = useState(createInitialState);

  // ── Setup actions ─────────────────────────────────────────────────────────

  const addPlayer = useCallback((name) => {
    setState((prev) => ({
      ...prev,
      players: [
        ...prev.players,
        { id: `player-${Date.now()}`, name, answeredQuestionIds: new Set() },
      ],
    }));
  }, []);

  const removePlayer = useCallback((playerId) => {
    setState((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== playerId),
    }));
  }, []);

  const reorderPlayers = useCallback((reordered) => {
    setState((prev) => ({ ...prev, players: reordered }));
  }, []);

  const selectQuestionSet = useCallback((setId) => {
    setState((prev) => ({ ...prev, selectedQuestionSetId: setId }));
  }, []);

  const addCustomQuestionSet = useCallback((questionSet) => {
    setState((prev) => ({
      ...prev,
      questionSets: [...prev.questionSets, questionSet],
      selectedQuestionSetId: questionSet.id,
    }));
  }, []);

  // ── Game lifecycle ─────────────────────────────────────────────────────────

  const startGame = useCallback(() => {
    setState((prev) => {
      const activeSet = prev.questionSets.find(
        (s) => s.id === prev.selectedQuestionSetId,
      );
      if (!activeSet || activeSet.questions.length === 0) return prev;

      return {
        ...prev,
        screen: 'playing',
        allQuestions: activeSet.questions,
        questionQueue: shuffle(activeSet.questions),
        currentPlayerIndex: 0,
        currentQuestion: null,
        // Reset each player's answered-question tracker
        players: prev.players.map((p) => ({ ...p, answeredQuestionIds: new Set() })),
      };
    });
  }, []);

  const nextTurn = useCallback(() => {
    setState((prev) => {
      const noPlayers = prev.players.length === 0;
      const players   = prev.players;
      const playerIdx = noPlayers ? -1 : prev.currentPlayerIndex;
      const player    = noPlayers ? null : players[playerIdx];

      let queue    = [...prev.questionQueue];
      let deferred = []; // questions already answered by this player
      let question = null;

      if (noPlayers) {
        // Free-cycling mode: just take the next question from the queue.
        if (queue.length === 0) queue = shuffle(prev.allQuestions);
        question = queue.shift();
      } else {
        // Per-player mode: skip questions this player already answered.
        for (let i = 0; i < queue.length; i++) {
          const candidate = queue.shift();
          if (player.answeredQuestionIds.has(candidate.id)) {
            deferred.push(candidate);
          } else {
            question = candidate;
            break;
          }
        }

        if (!question) {
          // This player has seen all queued questions.
          // Check if every player has answered every question → game over.
          const allDone = players.every((p) =>
            prev.allQuestions.every((q) => p.answeredQuestionIds.has(q.id)),
          );
          if (allDone) return { ...prev, screen: 'finished' };

          // Reshuffle and try again.
          queue = shuffle(prev.allQuestions);
          deferred = [];
          for (let i = 0; i < queue.length; i++) {
            const candidate = queue.shift();
            if (player.answeredQuestionIds.has(candidate.id)) {
              deferred.push(candidate);
            } else {
              question = candidate;
              break;
            }
          }

          // Edge case: no valid question found → advance to next player.
          if (!question) {
            return {
              ...prev,
              currentPlayerIndex: (playerIdx + 1) % players.length,
            };
          }
        }
      }

      // Mark this question as answered for the current player.
      const updatedPlayers = player
        ? players.map((p, i) =>
            i === playerIdx
              ? { ...p, answeredQuestionIds: new Set([...p.answeredQuestionIds, question.id]) }
              : p,
          )
        : players;

      const nextPlayerIndex = noPlayers
        ? 0
        : (playerIdx + 1) % Math.max(players.length, 1);

      return {
        ...prev,
        questionQueue: [...queue, ...deferred],
        currentQuestion: question,
        currentPlayerIndex: nextPlayerIndex,
        players: updatedPlayers,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState((prev) => ({
      // Full reset but keep any custom question sets the user uploaded.
      ...createInitialState(),
      questionSets: prev.questionSets,
    }));
  }, []);

  return {
    state,
    addPlayer,
    removePlayer,
    reorderPlayers,
    selectQuestionSet,
    addCustomQuestionSet,
    startGame,
    nextTurn,
    resetGame,
  };
}
