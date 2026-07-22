import { useState } from 'react';
import { LayoutTemplate, X, Plus } from 'lucide-react';
import { SCREEN_TEMPLATES, SCREEN_TEMPLATE_CATEGORIES } from '@/lib/screenTemplates';
import type { ScreenTemplateDef } from '@/lib/screenTemplates';

interface ScreenTemplatePickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (template: ScreenTemplateDef) => void;
}

export default function ScreenTemplatePicker({ open, onClose, onSelect }: ScreenTemplatePickerProps) {
  const [category, setCategory] = useState('all');

  if (!open) return null;

  const filtered = category === 'all'
    ? SCREEN_TEMPLATES
    : SCREEN_TEMPLATES.filter((t) => t.category === category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Screen Templates</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap px-5 py-3 border-b border-slate-800">
          {SCREEN_TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-xs px-2.5 py-1 rounded-full capitalize transition-colors ${
                category === cat
                  ? 'bg-slate-800 text-slate-100'
                  : 'text-slate-500 hover:text-slate-300 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filtered.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => {
                  onSelect(tmpl);
                  onClose();
                }}
                className="group rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-left hover:border-cyan-500/40 hover:bg-slate-900 transition-all animate-fade-in-up"
              >
                <div className="h-24 rounded-lg bg-slate-800/50 mb-2 flex flex-col gap-1 p-2 overflow-hidden">
                  {tmpl.elements.slice(0, 4).map((el, i) => {
                    const h = el.kind === 'header' ? 'h-2 w-3/4' : el.kind === 'input' ? 'h-1.5 w-full rounded' : el.kind === 'button' ? 'h-2 w-1/2 rounded' : el.kind === 'image' ? 'h-8 w-full rounded' : 'h-1 w-full rounded';
                    const bg = el.kind === 'button' ? 'bg-cyan-500/40' : el.kind === 'header' ? 'bg-slate-400/40' : 'bg-slate-600/40';
                    return <div key={i} className={`${h} ${bg}`} />;
                  })}
                </div>
                <p className="text-xs font-semibold text-slate-200 truncate">{tmpl.name}</p>
                <p className="text-[10px] text-slate-500 line-clamp-2">{tmpl.description}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 capitalize">{tmpl.category}</span>
                  <span className="text-[9px] text-slate-600 ml-auto flex items-center gap-0.5">
                    <Plus className="w-2.5 h-2.5" />
                    Add
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
