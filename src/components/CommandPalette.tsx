import { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, CornerDownLeft } from 'lucide-react';

export interface Command {
  id: string;
  label: string;
  shortcut?: string;
  icon?: React.ReactNode;
  section: string;
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  commands: Command[];
}

export default function CommandPalette({ open, onClose, commands }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.section.toLowerCase().includes(query.toLowerCase()),
  );

  const sections = Array.from(new Set(filtered.map((c) => c.section)));

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = filtered[selectedIdx];
        if (cmd) {
          cmd.action();
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, filtered, selectedIdx, onClose]);

  if (!open) return null;

  let runningIdx = -1;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIdx(0);
            }}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <kbd className="text-[10px] text-slate-500 border border-slate-700 rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto scrollbar-thin p-2">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-500">No commands found</div>
          ) : (
            sections.map((section) => (
              <div key={section} className="mb-1">
                <p className="text-[10px] uppercase tracking-wider text-slate-600 px-3 py-1.5">{section}</p>
                {filtered
                  .filter((c) => c.section === section)
                  .map((cmd) => {
                    runningIdx++;
                    const idx = runningIdx;
                    const isSelected = idx === selectedIdx;
                    return (
                      <button
                        key={cmd.id}
                        onMouseEnter={() => setSelectedIdx(idx)}
                        onClick={() => {
                          cmd.action();
                          onClose();
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                          isSelected ? 'bg-slate-800' : 'hover:bg-slate-800/50'
                        }`}
                      >
                        <span className="text-slate-400 shrink-0">{cmd.icon}</span>
                        <span className="text-sm text-slate-200 flex-1">{cmd.label}</span>
                        {cmd.shortcut && (
                          <kbd className="text-[10px] text-slate-500 border border-slate-700 rounded px-1.5 py-0.5">
                            {cmd.shortcut}
                          </kbd>
                        )}
                        {isSelected && <CornerDownLeft className="w-3 h-3 text-slate-500" />}
                      </button>
                    );
                  })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-800 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <ArrowRight className="w-3 h-3 rotate-90" /> Navigate
          </span>
          <span>Press Enter to select</span>
        </div>
      </div>
    </div>
  );
}
