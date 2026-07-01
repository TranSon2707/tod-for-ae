import { useState } from 'react';
import { Users, UserPlus, X, GripVertical } from 'lucide-react';
import { Badge } from './ui/index.jsx';
import { Button } from './ui/index.jsx';
import { Input } from './ui/index.jsx';

/**
 * Lets users add, remove, and reorder players before the game starts.
 *
 * @param {{ id: string, name: string }[]} players
 * @param {(name: string) => void}         onAdd
 * @param {(id: string) => void}           onRemove
 * @param {(players: []) => void}          onReorder
 */
export function PlayerSetup({ players, onAdd, onRemove, onReorder }) {
  const [inputValue, setInputValue] = useState('');
  const [dragFromIndex, setDragFromIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  function handleAdd() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setInputValue('');
  }

  function handleDrop() {
    if (dragFromIndex === null || dragOverIndex === null || dragFromIndex === dragOverIndex) {
      setDragFromIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...players];
    const [moved] = reordered.splice(dragFromIndex, 1);
    reordered.splice(dragOverIndex, 0, moved);
    onReorder(reordered);

    setDragFromIndex(null);
    setDragOverIndex(null);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Users size={18} className="text-amber-600" />
        <span className="font-semibold text-sm uppercase tracking-wider text-stone-500">
          Players
        </span>
        {players.length > 0 && (
          <Badge variant="secondary" className="ml-auto">
            {players.length}
          </Badge>
        )}
      </div>

      {/* Add-player input */}
      <div className="flex gap-2">
        <Input
          placeholder="Enter player name..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 border-stone-300 focus-visible:ring-amber-500"
        />
        <Button
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className="bg-amber-500 hover:bg-amber-600 text-white shrink-0"
        >
          <UserPlus size={16} className="mr-1" /> Add
        </Button>
      </div>

      {/* Player list */}
      {players.length === 0 ? (
        <p className="text-sm text-stone-400 italic text-center py-3 border border-dashed border-stone-200 rounded-lg">
          No players yet — add some above, or play without players.
        </p>
      ) : (
        <ul className="space-y-2">
          {players.map((player, index) => (
            <li
              key={player.id}
              draggable
              onDragStart={() => setDragFromIndex(index)}
              onDragOver={(e) => { e.preventDefault(); setDragOverIndex(index); }}
              onDrop={handleDrop}
              onDragEnd={() => { setDragFromIndex(null); setDragOverIndex(null); }}
              className={[
                'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all cursor-grab active:cursor-grabbing',
                dragOverIndex === index
                  ? 'border-amber-400 bg-amber-50 scale-[1.02]'
                  : 'border-stone-200 bg-white hover:border-stone-300',
                dragFromIndex === index ? 'opacity-40' : 'opacity-100',
              ].join(' ')}
            >
              <GripVertical size={14} className="text-stone-300 shrink-0" />
              <span className="flex-1 truncate">{player.name}</span>
              <button
                onClick={() => onRemove(player.id)}
                className="text-stone-300 hover:text-red-400 transition-colors ml-auto"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
