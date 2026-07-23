import { useState } from 'react';
import { Mail, X, Eye, Code2, Send } from 'lucide-react';

interface EmailTemplateEditorProps {
  open: boolean;
  onClose: () => void;
  appName: string;
}

const TEMPLATES = [
  { id: 'welcome', name: 'Welcome Email', subject: 'Welcome to {{appName}}!' },
  { id: 'reset', name: 'Password Reset', subject: 'Reset your password' },
  { id: 'verify', name: 'Email Verification', subject: 'Verify your email' },
  { id: 'invoice', name: 'Invoice Receipt', subject: 'Your receipt from {{appName}}' },
  { id: 'digest', name: 'Weekly Digest', subject: 'Your weekly summary' },
];

const DEFAULT_BODY = `Hi {{userName}},

Welcome to {{appName}}! We're excited to have you on board.

Here are a few things you can do to get started:
- Complete your profile
- Explore the dashboard
- Connect with your team

If you have any questions, just reply to this email.

Best regards,
The {{appName}} Team`;

export default function EmailTemplateEditor({ open, onClose, appName }: EmailTemplateEditorProps) {
  const [selected, setSelected] = useState('welcome');
  const [subject, setSubject] = useState(TEMPLATES[0].subject);
  const [body, setBody] = useState(DEFAULT_BODY);
  const [previewMode, setPreviewMode] = useState(false);
  if (!open) return null;

  const renderedSubject = subject.replace(/{{appName}}/g, appName).replace(/{{userName}}/g, 'John Doe');
  const renderedBody = body.replace(/{{appName}}/g, appName).replace(/{{userName}}/g, 'John Doe');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Mail className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Email Templates</h3></div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPreviewMode(!previewMode)} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700">{previewMode ? <Code2 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}{previewMode ? 'Edit' : 'Preview'}</button>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-44 border-r border-slate-800 overflow-y-auto scrollbar-thin py-2 shrink-0">
            {TEMPLATES.map((t) => (
              <button key={t.id} onClick={() => { setSelected(t.id); setSubject(t.subject); }} className={`w-full text-left px-3 py-2 text-xs transition-colors ${selected === t.id ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'}`}>
                <Mail className="w-3 h-3 inline mr-1.5 opacity-50" />{t.name}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
            {previewMode ? (
              <div className="max-w-md mx-auto rounded-xl border border-slate-700 bg-white p-6 shadow-lg">
                <div className="border-b border-slate-200 pb-3 mb-4">
                  <p className="text-xs text-slate-400">From: noreply@{appName.toLowerCase().replace(/\s+/g, '')}.com</p>
                  <p className="text-xs text-slate-400">Subject: <span className="text-slate-700 font-medium">{renderedSubject}</span></p>
                </div>
                <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">{renderedBody}</pre>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Subject</label>
                  <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Body <span className="text-slate-600">(supports &#123;&#123;appName&#125;&#125;, &#123;&#123;userName&#125;&#125;)</span></label>
                  <textarea value={body} onChange={(e) => setBody(e.target.value)} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 h-64 resize-none font-mono" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 text-xs font-semibold"><Send className="w-3.5 h-3.5" /> Send test email</button>
        </div>
      </div>
    </div>
  );
}
