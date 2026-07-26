import { Nfc, X, Tag, Link, FileText } from 'lucide-react';
import { useState } from 'react';

const NDEF_TYPES = [
  { id: 'uri', name: 'URI', icon: <Link className="w-4 h-4" />, desc: 'Open a URL on tap' },
  { id: 'text', name: 'Plain Text', icon: <FileText className="w-4 h-4" />, desc: 'Display text message' },
  { id: 'app', name: 'App Launch', icon: <Tag className="w-4 h-4" />, desc: 'Launch specific app' },
  { id: 'vcf', name: 'Contact Card', icon: <FileText className="w-4 h-4" />, desc: 'Share vCard contact' },
];

export default function NFCConfigurator({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [type, setType] = useState('uri');
  const [payload, setPayload] = useState('https://example.com');
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Nfc className="w-5 h-5 text-blue-400" /><h3 className="text-sm font-semibold text-slate-100">NFC Tag Configurator</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">NDEF Message Type</h4>
            <div className="grid grid-cols-2 gap-2">
              {NDEF_TYPES.map((t) => <button key={t.id} onClick={() => setType(t.id)} className={`rounded-xl border p-3 text-left transition-colors ${type === t.id ? 'border-blue-500/30 bg-blue-500/5' : 'border-slate-800 bg-slate-950/40'}`}>{t.icon}<p className="text-xs text-slate-200 mt-1.5">{t.name}</p><p className="text-[10px] text-slate-500">{t.desc}</p></button>)}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Payload</label>
            <input value={payload} onChange={(e) => setPayload(e.target.value)} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200 font-mono" />
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <p className="text-xs text-slate-500 mb-1">NDEF Hex Preview:</p>
            <code className="text-[10px] font-mono text-blue-400 break-all">D1 01 {payload.length.toString(16).padStart(2, '0').toUpperCase()} 55 01 {payload.split('').map(c => c.charCodeAt(0).toString(16)).join(' ').toUpperCase()}</code>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
            <p className="text-xs text-amber-400">Tag Tech Filter</p>
            <p className="text-[10px] text-slate-500 mt-1">android.nfc.tech.Ndef, android.nfc.tech.NfcA, android.nfc.tech.NfcB</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-medium"><Nfc className="w-3.5 h-3.5" /> Write to Tag</button>
        </div>
      </div>
    </div>
  );
}
