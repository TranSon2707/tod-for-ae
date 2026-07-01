import { useRef } from 'react';
import { BookOpen, CircleCheck, Upload } from 'lucide-react';
import { Badge } from './ui/index.jsx';
import { Button } from './ui/index.jsx';

/**
 * Displays available question sets and allows uploading a custom CSV set.
 *
 * @param {{ id, name, questions }[]} questionSets
 * @param {string}                    selectedId
 * @param {(id: string) => void}      onSelect
 * @param {(set: object) => void}     onUpload
 */
export function QuestionSetSelector({ questionSets, selectedId, onSelect, onUpload }) {
  const fileInputRef = useRef(null);

  // ── CSV parsing ────────────────────────────────────────────────────────────

  function parseCSV(csvText) {
    const lines = csvText.split(/\r?\n/).filter((l) => l.trim());
    const questions = [];

    // Skip header row if it contains the word "question"
    const startRow = lines[0]?.toLowerCase().includes('question') ? 1 : 0;

    for (let i = startRow; i < lines.length; i++) {
      const parts = lines[i].split(',');
      if (parts.length < 2) continue;

      const text = parts
        .slice(0, parts.length - 1)
        .join(',')
        .trim()
        .replace(/^"|"$/g, '');

      const rawType = parts[parts.length - 1]
        .trim()
        .toLowerCase()
        .replace(/^"|"$/g, '');

      const type = rawType === 'd' || rawType === 'dare' ? 'dare' : 'truth';

      if (text) {
        questions.push({ id: `custom-${i}`, text, type });
      }
    }

    return questions;
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const questions = parseCSV(ev.target?.result);
      if (questions.length === 0) return;

      onUpload({
        id: `custom-${Date.now()}`,
        name: file.name.replace('.csv', ''),
        questions,
      });
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <BookOpen size={18} className="text-amber-600" />
        <span className="font-semibold text-sm uppercase tracking-wider text-stone-500">
          Question Set
        </span>
      </div>

      {/* Question-set selector cards */}
      <div className="grid gap-2">
        {questionSets.map((set) => {
          const truthCount = set.questions.filter((q) => q.type === 'truth').length;
          const dareCount  = set.questions.filter((q) => q.type === 'dare').length;
          const isSelected = set.id === selectedId;

          return (
            <button
              key={set.id}
              onClick={() => onSelect(set.id)}
              className={[
                'flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all',
                isSelected
                  ? 'border-amber-400 bg-amber-50 shadow-sm'
                  : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50',
              ].join(' ')}
            >
              {/* Selected indicator */}
              {isSelected ? (
                <CircleCheck size={16} className="text-amber-500 shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-stone-300 shrink-0" />
              )}

              {/* Set info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-stone-800">{set.name}</p>
                <p className="text-xs text-stone-400 mt-0.5">
                  {set.questions.length} questions
                </p>
              </div>

              {/* Truth / dare counts */}
              <div className="flex gap-1 shrink-0">
                <Badge className="bg-sky-100 text-sky-700 border-0 text-xs">
                  {truthCount}T
                </Badge>
                <Badge className="bg-rose-100 text-rose-700 border-0 text-xs">
                  {dareCount}D
                </Badge>
              </div>
            </button>
          );
        })}
      </div>

      {/* CSV upload */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-dashed border-stone-300 text-stone-500 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50"
        >
          <Upload size={14} className="mr-2" /> Upload CSV question set
        </Button>
        <p className="text-xs text-stone-400 mt-1.5 text-center">
          Two columns:{' '}
          <code className="bg-stone-100 px-1 rounded">question text</code> and{' '}
          <code className="bg-stone-100 px-1 rounded">truth/dare</code>
        </p>
      </div>
    </div>
  );
}
