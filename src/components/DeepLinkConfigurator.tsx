import { useState } from 'react';
import { Link2, X, Plus, Trash2, Copy, Check } from 'lucide-react';
import type { AppRegion } from '@/types/builder';

interface DeepLink {
  id: string;
  scheme: string;
  path: string;
  screen: string;
  params: string;
}

interface DeepLinkConfiguratorProps {
  open: boolean;
  onClose: () => void;
  appName: string;
  regions: AppRegion[];
}

export default function DeepLinkConfigurator({ open, onClose, appName, regions }: DeepLinkConfiguratorProps) {
  const [links, setLinks] = useState<DeepLink[]>([
    { id: '1', scheme: appName.toLowerCase().replace(/\s+/g, ''), path: '/home', screen: regions[0]?.region_name ?? 'Home', params: '' },
    { id: '2', scheme: appName.toLowerCase().replace(/\s+/g, ''), path: '/profile/:id', screen: regions[1]?.region_name ?? 'Profile', params: 'id: string' },
    { id: '3', scheme: appName.toLowerCase().replace(/\s+/g, ''), path: '/settings', screen: 'Settings', params: '' },
  ]);
  const [copied, setCopied] = useState(false);
  if (!open) return null;

  const scheme = appName.toLowerCase().replace(/\s+/g, '');

  const handleCopy = (text: string) => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Link2 className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Deep Links</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-5 py-3 border-b border-slate-800">
          <div className="rounded-lg bg-slate-800/50 p-2 flex items-center gap-2">
            <span className="text-xs text-slate-500">URL Scheme:</span>
            <code className="text-xs text-cyan-400 font-mono">{scheme}://</code>
            <button onClick={() => handleCopy(`${scheme}://`)} className="ml-auto text-slate-500 hover:text-slate-300">{copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {links.map((link) => (
            <div key={link.id} className="group rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <code className="text-xs text-cyan-400 font-mono">{scheme}://{link.path}</code>
                <button onClick={() => setLinks((p) => p.filter((l) => l.id !== link.id))} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <span className="px-1.5 py-0.5 rounded bg-slate-800">→ {link.screen}</span>
                {link.params && <span className="px-1.5 py-0.5 rounded bg-slate-800 font-mono">params: {link.params}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button onClick={() => setLinks((p) => [...p, { id: crypto.randomUUID(), scheme, path: '/new', screen: regions[0]?.region_name ?? 'Home', params: '' }])} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"><Plus className="w-3.5 h-3.5" /> Add deep link</button>
          <span className="text-xs text-slate-500">{links.length} routes</span>
        </div>
      </div>
    </div>
  );
}
