import { useState } from 'react';
import { Share2, X, Copy, Check, Link, QrCode, Mail } from 'lucide-react';

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  appName: string;
}

export default function ShareDialog({ open, onClose, appName }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [expiry, setExpiry] = useState('7d');

  if (!open) return null;

  const slug = appName.toLowerCase().replace(/\s+/g, '-');
  const url = `https://preview.appforge.dev/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Share Preview</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">Preview Link</label>
            <div className="flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5">
              <Link className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="text-xs text-slate-300 font-mono flex-1 truncate">{url}</span>
              <button onClick={handleCopy} className="text-slate-400 hover:text-emerald-400 transition-colors shrink-0">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">Link Expiry</label>
            <div className="grid grid-cols-4 gap-2">
              {['1d', '7d', '30d', 'never'].map((e) => (
                <button
                  key={e}
                  onClick={() => setExpiry(e)}
                  className={`rounded-lg border py-2 text-xs font-medium transition-all ${
                    expiry === e
                      ? 'border-cyan-500 bg-cyan-500/10 text-slate-100'
                      : 'border-slate-800 bg-slate-900 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {e === 'never' ? 'Never' : e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Share via</label>
            <div className="grid grid-cols-3 gap-2">
              <ShareButton icon={<Link className="w-4 h-4" />} label="Copy link" onClick={handleCopy} />
              <ShareButton icon={<QrCode className="w-4 h-4" />} label="QR code" onClick={() => {}} />
              <ShareButton icon={<Mail className="w-4 h-4" />} label="Email" onClick={() => {}} />
            </div>
          </div>

          <div className="rounded-xl bg-slate-800/50 p-3 text-center">
            <p className="text-xs text-slate-500">
              Anyone with this link can view your app preview in their browser.
              {expiry !== 'never' && ` Link expires in ${expiry}.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShareButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 py-3 hover:border-slate-700 hover:bg-slate-800/50 transition-colors"
    >
      <span className="text-slate-400">{icon}</span>
      <span className="text-[10px] text-slate-400">{label}</span>
    </button>
  );
}
