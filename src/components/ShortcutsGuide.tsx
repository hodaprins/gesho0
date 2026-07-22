import { Keyboard, X } from 'lucide-react';

interface ShortcutsGuideProps {
  open: boolean;
  onClose: () => void;
}

const SHORTCUTS: { keys: string; action: string; section: string }[] = [
  { keys: '⌘ K', action: 'Open command palette', section: 'Global' },
  { keys: '⌘ /', action: 'Search screens', section: 'Global' },
  { keys: '⌘ B', action: 'Toggle sidebar', section: 'Global' },
  { keys: '⌘ S', action: 'Save project', section: 'Global' },
  { keys: '⌘ Z', action: 'Undo', section: 'Editing' },
  { keys: '⌘ ⇧ Z', action: 'Redo', section: 'Editing' },
  { keys: '⌘ D', action: 'Duplicate element', section: 'Editing' },
  { keys: 'Delete', action: 'Remove element', section: 'Editing' },
  { keys: '1', action: 'Design tab', section: 'Navigation' },
  { keys: '2', action: 'Code tab', section: 'Navigation' },
  { keys: '3', action: 'Data tab', section: 'Navigation' },
  { keys: '4', action: 'Tests tab', section: 'Navigation' },
  { keys: '5', action: 'Audit tab', section: 'Navigation' },
  { keys: '6', action: 'Deploy tab', section: 'Navigation' },
  { keys: '⌘ E', action: 'Export code', section: 'Actions' },
  { keys: '⌘ ⇧ D', action: 'Deploy dialog', section: 'Actions' },
  { keys: '⌘ ⇧ S', action: 'App store assets', section: 'Actions' },
  { keys: '?', action: 'Show this help', section: 'Actions' },
];

export default function ShortcutsGuide({ open, onClose }: ShortcutsGuideProps) {
  if (!open) return null;

  const sections = Array.from(new Set(SHORTCUTS.map((s) => s.section)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Keyboard Shortcuts</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {sections.map((section) => (
            <div key={section}>
              <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2">{section}</h4>
              <div className="space-y-1.5">
                {SHORTCUTS.filter((s) => s.section === section).map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-slate-300">{s.action}</span>
                    <kbd className="text-xs text-slate-300 bg-slate-800 border border-slate-700 rounded px-2 py-1 font-mono">
                      {s.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
