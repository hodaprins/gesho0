import { Mail, X, Calendar, FileText, Eye } from 'lucide-react';
import { useState } from 'react';

type Frequency = 'daily' | 'weekly' | 'monthly';
type Section = 'deploys' | 'activity' | 'analytics' | 'errors' | 'team';

export function EmailDigestSettings({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [frequency, setFrequency] = useState<Frequency>('weekly');
  const [sections, setSections] = useState<Record<Section, boolean>>({
    deploys: true, activity: true, analytics: false, errors: true, team: false,
  });

  if (!open) return null;

  const freqs: { key: Frequency; label: string; desc: string }[] = [
    { key: 'daily', label: 'Daily', desc: 'Every morning at 8:00' },
    { key: 'weekly', label: 'Weekly', desc: 'Mondays at 9:00' },
    { key: 'monthly', label: 'Monthly', desc: '1st of each month' },
  ];
  const sectList: { key: Section; label: string; desc: string }[] = [
    { key: 'deploys', label: 'Deployments', desc: 'Recent & scheduled deploys' },
    { key: 'activity', label: 'Activity Summary', desc: 'Key actions across projects' },
    { key: 'analytics', label: 'Analytics', desc: 'Traffic & usage highlights' },
    { key: 'errors', label: 'Error Report', desc: 'Critical issues this period' },
    { key: 'team', label: 'Team Updates', desc: 'Member additions & roles' },
  ];

  const activeCount = Object.values(sections).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">Email Digest</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-5 space-y-6">
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Calendar className="h-3.5 w-3.5" /> Frequency
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {freqs.map(({ key, label, desc }) => (
                <button
                  key={key}
                  onClick={() => setFrequency(key)}
                  className={`rounded-xl border p-3 text-left transition ${
                    frequency === key ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-800/30 hover:border-slate-700'
                  }`}
                >
                  <p className={`text-sm font-semibold ${frequency === key ? 'text-white' : 'text-slate-300'}`}>{label}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <FileText className="h-3.5 w-3.5" /> Content Sections
            </h3>
            <div className="space-y-2">
              {sectList.map(({ key, label, desc }) => (
                <label key={key} className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-800 bg-slate-800/30 px-4 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                  <input
                    type="checkbox" checked={sections[key]}
                    onChange={(e) => setSections((s) => ({ ...s, [key]: e.target.checked }))}
                    className="h-4 w-4 accent-indigo-500"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4">
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Eye className="h-3.5 w-3.5" /> Preview
            </h3>
            <div className="rounded-lg bg-slate-900 p-3 border border-slate-800">
              <p className="text-sm font-semibold text-white">
                Your {frequency} digest
              </p>
              <p className="text-xs text-slate-500 mb-2">{activeCount} sections included</p>
              <div className="space-y-1">
                {sectList.filter((s) => sections[s.key]).map((s) => (
                  <div key={s.key} className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    {s.label}
                  </div>
                ))}
                {activeCount === 0 && <p className="text-xs text-slate-500">No sections selected.</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-800 px-6 py-3">
          <button onClick={onClose} className="rounded-lg px-4 py-1.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white">
            Cancel
          </button>
          <button onClick={onClose} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailDigestSettings;
