import { Type, RotateCcw } from 'lucide-react';
import type { ColorScheme } from '@/types/builder';

export interface TypographyConfig {
  fontFamily: string;
  headingSize: number;
  bodySize: number;
  headingWeight: number;
  bodyWeight: number;
  lineHeight: number;
  letterSpacing: number;
}

interface TypographyEditorProps {
  config: TypographyConfig;
  onChange: (config: TypographyConfig) => void;
  colorScheme: ColorScheme;
}

const FONTS = [
  { name: 'Inter', stack: 'Inter, system-ui, sans-serif' },
  { name: 'Roboto', stack: 'Roboto, system-ui, sans-serif' },
  { name: 'Poppins', stack: 'Poppins, system-ui, sans-serif' },
  { name: 'SF Pro', stack: '-apple-system, BlinkMacSystemFont, sans-serif' },
  { name: 'Georgia', stack: 'Georgia, serif' },
  { name: 'Mono', stack: 'ui-monospace, SFMono-Regular, monospace' },
];

const DEFAULT: TypographyConfig = {
  fontFamily: 'Inter, system-ui, sans-serif',
  headingSize: 24,
  bodySize: 14,
  headingWeight: 700,
  bodyWeight: 400,
  lineHeight: 1.5,
  letterSpacing: 0,
};

export default function TypographyEditor({ config, onChange, colorScheme }: TypographyEditorProps) {
  const update = (key: keyof TypographyConfig, value: string | number) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <Type className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-semibold text-slate-200">Typography</h3>
      </div>

      <div>
        <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Font Family</label>
        <div className="grid grid-cols-2 gap-2">
          {FONTS.map((font) => (
            <button
              key={font.name}
              onClick={() => update('fontFamily', font.stack)}
              className={`rounded-lg border px-3 py-2 text-left transition-all ${
                config.fontFamily === font.stack
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-slate-800 bg-slate-900 hover:border-slate-700'
              }`}
            >
              <p className="text-sm text-slate-200" style={{ fontFamily: font.stack }}>{font.name}</p>
              <p className="text-[10px] text-slate-500" style={{ fontFamily: font.stack }}>The quick brown fox</p>
            </button>
          ))}
        </div>
      </div>

      <SliderRow
        label="Heading Size"
        value={config.headingSize}
        min={16}
        max={40}
        unit="px"
        onChange={(v) => update('headingSize', v)}
      />
      <SliderRow
        label="Body Size"
        value={config.bodySize}
        min={10}
        max={20}
        unit="px"
        onChange={(v) => update('bodySize', v)}
      />
      <SliderRow
        label="Heading Weight"
        value={config.headingWeight}
        min={300}
        max={900}
        step={100}
        onChange={(v) => update('headingWeight', v)}
      />
      <SliderRow
        label="Body Weight"
        value={config.bodyWeight}
        min={300}
        max={700}
        step={100}
        onChange={(v) => update('bodyWeight', v)}
      />
      <SliderRow
        label="Line Height"
        value={config.lineHeight}
        min={1}
        max={2}
        step={0.05}
        onChange={(v) => update('lineHeight', v)}
      />
      <SliderRow
        label="Letter Spacing"
        value={config.letterSpacing}
        min={-2}
        max={4}
        step={0.5}
        unit="px"
        onChange={(v) => update('letterSpacing', v)}
      />

      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Preview</p>
        <div
          className="rounded-xl p-4 space-y-2"
          style={{
            background: colorScheme.background,
            color: colorScheme.text,
            fontFamily: config.fontFamily,
            lineHeight: config.lineHeight,
            letterSpacing: `${config.letterSpacing}px`,
          }}
        >
          <h4 style={{ fontSize: `${config.headingSize}px`, fontWeight: config.headingWeight, color: colorScheme.primary }}>
            Welcome to the app
          </h4>
          <p style={{ fontSize: `${config.bodySize}px`, fontWeight: config.bodyWeight }}>
            This is how your body text will look. Adjust the sliders above to fine-tune the appearance.
          </p>
        </div>
      </div>

      <button
        onClick={() => onChange(DEFAULT)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors w-full justify-center"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset to defaults
      </button>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs text-slate-400">{label}</label>
        <span className="text-xs text-slate-300 font-mono">{value}{unit ?? ''}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-cyan-500"
      />
    </div>
  );
}
