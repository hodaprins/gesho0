import { useState, useMemo } from 'react';
import { Search, X, FileCode2, ArrowRight } from 'lucide-react';
import type { AppRegion } from '@/types/builder';

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
  regions: AppRegion[];
  onRegionSelect: (region: AppRegion) => void;
}

export default function GlobalSearch({ open, onClose, regions, onRegionSelect }: GlobalSearchProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    return regions
      .map((r) => {
        const nameMatch = r.region_name.toLowerCase().includes(lower);
        const descMatch = r.description.toLowerCase().includes(lower);
        const elementTypeMatches = r.spec.elements.filter(
          (e) =>
            e.label?.toLowerCase().includes(lower) ||
            e.placeholder?.toLowerCase().includes(lower) ||
            e.value?.toLowerCase().includes(lower),
        );
        const score = (nameMatch ? 100 : 0) + (descMatch ? 50 : 0) + elementTypeMatches.length * 10;
        return { region: r, score, elementTypeMatches };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [query, regions]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[10vh] px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search screens, elements, content..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto scrollbar-thin p-2">
          {query.trim() && results.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-500">No results for "{query}"</div>
          ) : !query.trim() ? (
            <div className="text-center py-8 text-sm text-slate-500">Start typing to search across all screens</div>
          ) : (
            results.map(({ region, elementTypeMatches }) => (
              <button
                key={region.id}
                onClick={() => {
                  onRegionSelect(region);
                  onClose();
                }}
                className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <FileCode2 className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{region.region_name}</p>
                  <p className="text-xs text-slate-500 truncate">{region.description}</p>
                  {elementTypeMatches.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {elementTypeMatches.slice(0, 3).map((el, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {el.label ?? el.placeholder}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 mt-1" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
