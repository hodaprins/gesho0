import { Keyboard, X, Search, CornerDownLeft, Command } from 'lucide-react';
import { useState } from 'react';

type Shortcut = { keys: string; description: string };
type Category = { name: string; shortcuts: Shortcut[] };

const CATEGORIES: Category[] = [
  {
    name: 'Navigation',
    shortcuts: [
      { keys: 'G D', description: 'Go to Dashboard' },
      { keys: 'G P', description: 'Go to Projects' },
      { keys: 'G S', description: 'Go to Settings' },
      { keys: 'G A', description: 'Go to Analytics' },
    ],
  },
  {
    name: 'Editing',
    shortcuts: [
      { keys: '⌘ / Ctrl + S', description: 'Save changes' },
      { keys: '⌘ / Ctrl + Z', description: 'Undo last action' },
      { keys: '⌘ / Ctrl + Shift + Z', description: 'Redo action' },
      { keys: 'Delete', description: 'Delete selected item' },
    ],
  },
  {
    name: 'Views',
    shortcuts: [
      { keys: '⌘ / Ctrl + B', description: 'Toggle sidebar' },
      { keys: '⌘ / Ctrl + .', description: 'Toggle command palette' },
      { keys: '⌘ / Ctrl + \\', description: 'Toggle split view' },
      { keys: 'F', description: 'Toggle fullscreen' },
    ],
  },
  {
    name: 'Search',
    shortcuts: [
      { keys: '⌘ / Ctrl + F', description: 'Find in current view' },
      { keys: '⌘ / Ctrl + P', description: 'Quick open file' },
      { keys: '⌘ / Ctrl + Shift + P', description: 'Open command palette' },
      { keys: '/', description: 'Focus search bar' },
    ],
  },
];

export function KeyboardShortcutsMap({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');

  if (!open) return null;

  const q = query.trim().toLowerCase();
  const filtered = CATEGORIES.map((cat) => ({
    ...cat,
    shortcuts: cat.shortcuts.filter(
      (s) => !q || s.keys.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    ),
  })).filter((cat) => cat.shortcuts.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <Keyboard className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">Keyboard Shortcuts</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-3 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search shortcuts..."
              className="w-full rounded-lg bg-slate-800 border border-slate-700 pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="max-h-[55vh] overflow-y-auto px-6 py-4 space-y-6">
          {filtered.length === 0 && (
            <p className="text-center text-sm text-slate-500 py-8">No shortcuts match "{query}".</p>
          )}
          {filtered.map((cat) => (
            <div key={cat.name}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{cat.name}</h3>
              <div className="space-y-1.5">
                {cat.shortcuts.map((s) => (
                  <div key={s.keys} className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-800/60">
                    <span className="text-sm text-slate-200">{s.description}</span>
                    <kbd className="flex items-center gap-1 rounded-md bg-slate-800 border border-slate-700 px-2 py-1 text-xs font-mono text-slate-300">
                      <Command className="h-3 w-3" />
                      {s.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 px-6 py-3">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <CornerDownLeft className="h-3.5 w-3.5" /> Press ESC to close
          </span>
          <button onClick={onClose} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default KeyboardShortcutsMap;
