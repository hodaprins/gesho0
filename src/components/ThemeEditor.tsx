import { useState } from 'react';
import { Palette, Check, RotateCcw } from 'lucide-react';
import type { ColorScheme } from '@/types/builder';

interface ThemeEditorProps {
  colorScheme: ColorScheme;
  onChange: (cs: ColorScheme) => void;
}

const PRESETS: { name: string; scheme: ColorScheme }[] = [
  { name: 'Emerald', scheme: { primary: '#0f766e', secondary: '#14b8a6', accent: '#f59e0b', background: '#f0fdfa', surface: '#ffffff', text: '#042f2e' } },
  { name: 'Ocean', scheme: { primary: '#0284c7', secondary: '#38bdf8', accent: '#fbbf24', background: '#f0f9ff', surface: '#ffffff', text: '#082f49' } },
  { name: 'Sunset', scheme: { primary: '#ea580c', secondary: '#f59e0b', accent: '#dc2626', background: '#fff7ed', surface: '#ffffff', text: '#1c1917' } },
  { name: 'Forest', scheme: { primary: '#16a34a', secondary: '#22c55e', accent: '#0ea5e9', background: '#f0fdf4', surface: '#ffffff', text: '#052e16' } },
  { name: 'Rose', scheme: { primary: '#db2777', secondary: '#f43f5e', accent: '#8b5cf6', background: '#fdf2f8', surface: '#ffffff', text: '#500724' } },
  { name: 'Midnight', scheme: { primary: '#1e293b', secondary: '#475569', accent: '#dc2626', background: '#f1f5f9', surface: '#ffffff', text: '#020617' } },
  { name: 'Royal', scheme: { primary: '#2563eb', secondary: '#0ea5e9', accent: '#f59e0b', background: '#f8fafc', surface: '#ffffff', text: '#0f172a' } },
  { name: 'Crimson', scheme: { primary: '#dc2626', secondary: '#f97316', accent: '#16a34a', background: '#fef2f2', surface: '#ffffff', text: '#450a0a' } },
];

const COLOR_KEYS: { key: keyof ColorScheme; label: string }[] = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'accent', label: 'Accent' },
  { key: 'background', label: 'Background' },
  { key: 'surface', label: 'Surface' },
  { key: 'text', label: 'Text' },
];

export default function ThemeEditor({ colorScheme, onChange }: ThemeEditorProps) {
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const updateColor = (key: keyof ColorScheme, value: string) => {
    onChange({ ...colorScheme, [key]: value });
    setActivePreset(null);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin p-4 space-y-5">
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-semibold text-slate-200">Design System</h3>
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Color Presets</h4>
        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map((preset) => {
            const isActive = activePreset === preset.name;
            return (
              <button
                key={preset.name}
                onClick={() => {
                  onChange(preset.scheme);
                  setActivePreset(preset.name);
                }}
                className="group relative rounded-lg p-2 border transition-all hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${preset.scheme.primary}, ${preset.scheme.secondary})`,
                  borderColor: isActive ? '#fff' : 'transparent',
                }}
              >
                {isActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <span className="text-[9px] text-white/90 font-medium block mt-6">{preset.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Custom Colors</h4>
        <div className="space-y-2">
          {COLOR_KEYS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <label className="text-xs text-slate-400 w-20">{label}</label>
              <div className="relative flex-1">
                <input
                  type="color"
                  value={colorScheme[key]}
                  onChange={(e) => updateColor(key, e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="h-8 rounded-lg border border-slate-700 flex items-center px-3 gap-2 cursor-pointer"
                  style={{ backgroundColor: colorScheme[key] }}
                >
                  <span className="text-[10px] font-mono uppercase" style={{ color: contrastText(colorScheme[key]) }}>
                    {colorScheme[key]}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Preview</h4>
        <div className="rounded-xl p-4 space-y-2" style={{ backgroundColor: colorScheme.background }}>
          <div className="rounded-lg p-3" style={{ backgroundColor: colorScheme.surface }}>
            <p className="text-xs" style={{ color: colorScheme.text }}>Card component</p>
            <p className="text-lg font-bold" style={{ color: colorScheme.primary }}>Heading text</p>
          </div>
          <button
            className="w-full rounded-lg py-2 text-xs font-semibold text-white"
            style={{ backgroundColor: colorScheme.primary }}
          >
            Primary button
          </button>
          <button
            className="w-full rounded-lg py-2 text-xs font-semibold border"
            style={{ borderColor: colorScheme.secondary, color: colorScheme.secondary }}
          >
            Secondary button
          </button>
        </div>
      </div>

      <button
        onClick={() => {
          onChange(PRESETS[0].scheme);
          setActivePreset(PRESETS[0].name);
        }}
        className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset
      </button>
    </div>
  );
}

function contrastText(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}
