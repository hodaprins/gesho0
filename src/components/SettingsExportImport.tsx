import { Download, X, Upload, FileJson, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export function SettingsExportImport({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState<string[]>(['general', 'notifications', 'appearance', 'security']);
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null);

  if (!open) return null;

  const categories: { key: string; label: string; count: number }[] = [
    { key: 'general', label: 'General', count: 8 },
    { key: 'notifications', label: 'Notifications', count: 12 },
    { key: 'appearance', label: 'Appearance', count: 6 },
    { key: 'security', label: 'Security', count: 5 },
    { key: 'integrations', label: 'Integrations', count: 9 },
    { key: 'billing', label: 'Billing', count: 4 },
  ];

  const toggle = (key: string) =>
    setSelected((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]));

  const handleExport = () => {
    const data = JSON.stringify({ exportedAt: new Date().toISOString(), categories: selected }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'platform-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    setImportMsg({ ok: true, text: 'Settings imported successfully. 3 categories updated.' });
    setTimeout(() => setImportMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <Download className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">Export & Import</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Categories to Include</h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(({ key, label, count }) => {
                const active = selected.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggle(key)}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2.5 transition ${
                      active ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-800/30'
                    }`}
                  >
                    <div className="text-left">
                      <p className={`text-sm font-medium ${active ? 'text-white' : 'text-slate-400'}`}>{label}</p>
                      <p className="text-[11px] text-slate-500">{count} settings</p>
                    </div>
                    <div className={`flex h-4 w-4 items-center justify-center rounded ${active ? 'bg-indigo-500' : 'border border-slate-600'}`}>
                      {active && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {importMsg && (
            <div className={`flex items-center gap-2 rounded-lg p-3 text-sm ${importMsg.ok ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {importMsg.text}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExport}
              disabled={selected.length === 0}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" /> Export JSON
            </button>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-700">
              <Upload className="h-4 w-4" /> Import File
              <input type="file" accept="application/json" className="hidden" onChange={handleImport} />
            </label>
          </div>

          <div className="rounded-lg bg-slate-800/50 p-3">
            <div className="flex items-center gap-2">
              <FileJson className="h-4 w-4 text-slate-400" />
              <span className="text-xs text-slate-400">
                {selected.length} of {categories.length} categories selected
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-800 px-6 py-3">
          <button onClick={onClose} className="rounded-lg bg-slate-800 px-4 py-1.5 text-sm font-medium text-slate-300 hover:bg-slate-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsExportImport;
