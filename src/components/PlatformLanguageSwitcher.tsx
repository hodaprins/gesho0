import { Languages, X, Search, Check, Globe } from 'lucide-react';
import { useState } from 'react';

type Lang = { code: string; name: string; native: string; flag: string; rtl?: boolean };

const LANGUAGES: Lang[] = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
];

export function PlatformLanguageSwitcher({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('en');

  if (!open) return null;

  const q = query.trim().toLowerCase();
  const filtered = LANGUAGES.filter(
    (l) => !q || l.name.toLowerCase().includes(q) || l.native.toLowerCase().includes(q) || l.code.includes(q)
  );

  const current = LANGUAGES.find((l) => l.code === selected);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <Languages className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">Language</h2>
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
              placeholder="Search languages..."
              className="w-full rounded-lg bg-slate-800 border border-slate-700 pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto px-3 py-3">
          {filtered.length === 0 && (
            <p className="text-center text-sm text-slate-500 py-8">No languages found.</p>
          )}
          {filtered.map((l) => {
            const active = l.code === selected;
            return (
              <button
                key={l.code}
                onClick={() => setSelected(l.code)}
                className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2.5 transition ${
                  active ? 'bg-indigo-600/20 border border-indigo-500/50' : 'border border-transparent hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{l.flag}</span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">{l.name}</p>
                    <p className="text-xs text-slate-400">{l.native}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {l.rtl && <span className="rounded bg-slate-700 px-1.5 py-0.5 text-[10px] font-medium text-slate-300">RTL</span>}
                  {active && <Check className="h-4 w-4 text-indigo-400" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 px-6 py-3">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <Globe className="h-3.5 w-3.5" />
            Current: <span className="text-slate-300">{current?.name}</span>
          </span>
          <button onClick={onClose} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlatformLanguageSwitcher;
