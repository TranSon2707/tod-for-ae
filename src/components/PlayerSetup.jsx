import { useState } from 'react';
import { Users, UserPlus, X, GripVertical } from 'lucide-react';
import { Badge } from './ui/index.jsx';
import { Button } from './ui/index.jsx';
import { Input } from './ui/index.jsx';

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
        <Users size={18} className="text-primary" />
        <span className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
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
          className="flex-1 focus-visible:ring-primary"
        />
        <Button
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
        >
          <UserPlus size={16} className="mr-1" /> Add
        </Button>
      </div>

      {/* Player list */}
      {players.length === 0 ? (
        <p className="text-sm text-muted-foreground italic text-center py-3 border border-dashed border-border rounded-lg">
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
                  ? 'border-primary bg-primary/10 scale-[1.02]'
                  : 'border-border bg-card hover:border-primary/40',
                dragFromIndex === index ? 'opacity-40' : 'opacity-100',
              ].join(' ')}
            >
              <GripVertical size={14} className="text-muted-foreground shrink-0" />
              <span className="flex-1 truncate text-foreground">{player.name}</span>
              <button
                onClick={() => onRemove(player.id)}
                className="text-muted-foreground hover:text-destructive transition-colors ml-auto"
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