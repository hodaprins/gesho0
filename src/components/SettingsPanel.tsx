import { Settings as SettingsIcon, X, Moon, Sun, Globe, Bell, Zap, Monitor } from 'lucide-react';

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  language: 'en' | 'ar';
  autoSave: boolean;
  showGrid: boolean;
  reducedMotion: boolean;
  defaultPlatform: 'ios' | 'android' | 'both';
  codeFontSize: number;
}

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  prefs: UserPreferences;
  onChange: (prefs: UserPreferences) => void;
}

export default function SettingsPanel({ open, onClose, prefs, onChange }: SettingsPanelProps) {
  if (!open) return null;

  const update = (key: keyof UserPreferences, value: string | number | boolean) => {
    onChange({ ...prefs, [key]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-100">Preferences</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <SettingRow icon={prefs.theme === 'dark' ? <Moon className="w-4 h-4" /> : prefs.theme === 'light' ? <Sun className="w-4 h-4" /> : <Monitor className="w-4 h-4" />} label="Theme">
            <div className="flex items-center gap-1 rounded-lg bg-slate-800 p-0.5">
              {(['light', 'dark', 'system'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => update('theme', t)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                    prefs.theme === t ? 'bg-slate-700 text-slate-100' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </SettingRow>

          <SettingRow icon={<Globe className="w-4 h-4" />} label="Language">
            <div className="flex items-center gap-1 rounded-lg bg-slate-800 p-0.5">
              {(['en', 'ar'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => update('language', l)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium uppercase transition-colors ${
                    prefs.language === l ? 'bg-slate-700 text-slate-100' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {l === 'en' ? 'English' : 'العربية'}
                </button>
              ))}
            </div>
          </SettingRow>

          <SettingRow icon={<Bell className="w-4 h-4" />} label="Auto-save">
            <Toggle value={prefs.autoSave} onChange={(v) => update('autoSave', v)} />
          </SettingRow>

          <SettingRow icon={<Monitor className="w-4 h-4" />} label="Show grid">
            <Toggle value={prefs.showGrid} onChange={(v) => update('showGrid', v)} />
          </SettingRow>

          <SettingRow icon={<Zap className="w-4 h-4" />} label="Reduced motion">
            <Toggle value={prefs.reducedMotion} onChange={(v) => update('reducedMotion', v)} />
          </SettingRow>

          <SettingRow icon={<Monitor className="w-4 h-4" />} label="Default platform">
            <div className="flex items-center gap-1 rounded-lg bg-slate-800 p-0.5">
              {(['ios', 'android', 'both'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => update('defaultPlatform', p)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                    prefs.defaultPlatform === p ? 'bg-slate-700 text-slate-100' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </SettingRow>

          <SettingRow icon={<SettingsIcon className="w-4 h-4" />} label="Code font size">
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={10}
                max={20}
                value={prefs.codeFontSize}
                onChange={(e) => update('codeFontSize', Number(e.target.value))}
                className="accent-cyan-500 w-24"
              />
              <span className="text-xs text-slate-300 font-mono w-8">{prefs.codeFontSize}px</span>
            </div>
          </SettingRow>
        </div>
      </div>
    </div>
  );
}

function SettingRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="text-slate-400">{icon}</span>
        <span className="text-sm text-slate-200">{label}</span>
      </div>
      {children}
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5.5 rounded-full transition-colors ${value ? 'bg-cyan-500' : 'bg-slate-700'}`}
      style={{ height: '22px', width: '40px' }}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </button>
  );
}
