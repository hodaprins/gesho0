import { useState } from 'react';
import { Bell, Send, X, Check, Image as ImageIcon } from 'lucide-react';

interface PushComposerProps {
  open: boolean;
  onClose: () => void;
  appName: string;
}

export default function PushComposer({ open, onClose, appName }: PushComposerProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sent, setSent] = useState(false);

  if (!open) return null;

  const handleSend = () => {
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setTitle('');
      setBody('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-100">Push Notification</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification title..."
              maxLength={50}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-600"
            />
            <span className="text-[10px] text-slate-600 mt-0.5 block text-right">{title.length}/50</span>
          </div>

          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Notification body..."
              maxLength={150}
              className="w-full h-20 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-600 resize-none scrollbar-thin"
            />
            <span className="text-[10px] text-slate-600 mt-0.5 block text-right">{body.length}/150</span>
          </div>

          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Preview</p>
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {appName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-semibold text-slate-200">{appName}</span>
                  <span className="text-[10px] text-slate-600">now</span>
                </div>
                <p className="text-sm font-medium text-slate-100 truncate">{title || 'Notification title'}</p>
                <p className="text-xs text-slate-400 line-clamp-2">{body || 'Notification body text appears here...'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors">
              <ImageIcon className="w-3.5 h-3.5" />
              Add image
            </button>
            <div className="flex-1" />
            <button
              onClick={handleSend}
              disabled={!title.trim() || sent}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-amber-500/25 disabled:opacity-40 active:scale-95"
            >
              {sent ? (
                <>
                  <Check className="w-4 h-4" />
                  Sent!
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send to all users
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
