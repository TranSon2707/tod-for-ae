import { useRef } from 'react';
import { BookOpen, CircleCheck, Upload } from 'lucide-react';
import { Badge } from './ui/index.jsx';
import { Button } from './ui/index.jsx';

export function QuestionSetSelector({ questionSets, selectedId, onSelect, onUpload }) {
  const fileInputRef = useRef(null);
  
  // Parses raw CSV text into an array of question objects.
  function parseCSV(csvText) {
    const rows = parseCSVRows(csvText);
    const questions = [];

    if (rows.length === 0) return questions;

    // Skip header row if the first cell mentions "question"
    const startRow = rows[0][0]?.toLowerCase().includes('question') ? 1 : 0;

    for (let i = startRow; i < rows.length; i++) {
      const parts = rows[i];
      if (parts.length < 2) continue;

      const text = parts.slice(0, parts.length - 1).join(',').trim();
      const rawType = parts[parts.length - 1].trim().toLowerCase();
      const type = rawType === 'd' || rawType === 'dare' ? 'dare' : 'truth';

      if (text) {
        questions.push({ id: `custom-${i}`, text, type });
      }
    }

    return questions;
  }

  // Character-by-character CSV parser that correctly handles quoted fields,
  // embedded commas, embedded newlines, and escaped quotes ("").
  function parseCSVRows(csvText) {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
      const char = csvText[i];
      const next = csvText[i + 1];

      if (inQuotes) {
        if (char === '"' && next === '"') {
          field += '"';
          i++; // skip the escaped quote
        } else if (char === '"') {
          inQuotes = false;
        } else {
          field += char; // includes real newlines inside quotes
        }
      } else if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(field);
        field = '';
      } else if (char === '\r') {
        // skip, \n handles the row break
      } else if (char === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
      } else {
        field += char;
      }
    }

    // flush the last field/row (files often don't end with a trailing newline)
    if (field.length > 0 || row.length > 0) {
      row.push(field);
      rows.push(row);
    }

    // drop fully blank rows
    return rows.filter((r) => r.some((f) => f.trim() !== ''));
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <BookOpen size={18} className="text-primary" />
        <span className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
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
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-border bg-card hover:border-primary/40 hover:bg-accent',
              ].join(' ')}
            >
              {/* Selected indicator */}
              {isSelected ? (
                <CircleCheck size={16} className="text-primary shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-border shrink-0" />
              )}

              {/* Set info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground">{set.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {set.questions.length} questions
                </p>
              </div>

              {/* Truth / dare counts */}
              <div className="flex gap-1 shrink-0">
                <Badge className="bg-truth/15 text-truth border-0 text-xs">
                  {truthCount}T
                </Badge>
                <Badge className="bg-dare/15 text-dare border-0 text-xs">
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
          className="w-full border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/10"
        >
          <Upload size={14} className="mr-2" /> Upload CSV question set
        </Button>
        <p className="text-xs text-muted-foreground mt-1.5 text-center">
          Two columns:{' '}
          <code className="bg-muted px-1 rounded">question text</code> and{' '}
          <code className="bg-muted px-1 rounded">truth/dare</code>
        </p>
      </div>
    </div>
  );
}