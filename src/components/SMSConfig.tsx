import { MessageSquare, X, Check, Send, Smartphone } from 'lucide-react';
import { useState } from 'react';

interface SMSConfigProps {
  open: boolean;
  onClose: () => void;
}

const PROVIDERS = [
  { id: 'twilio', name: 'Twilio', connected: true, icon: 'T', color: 'bg-red-500/20 text-red-400' },
  { id: 'vonage', name: 'Vonage', connected: false, icon: 'V', color: 'bg-emerald-500/20 text-emerald-400' },
  { id: 'aws_sns', name: 'AWS SNS', connected: false, icon: 'A', color: 'bg-amber-500/20 text-amber-400' },
];

const TEMPLATES = [
  { id: 'otp', name: 'OTP Verification', body: 'Your {{appName}} verification code is: {{code}}. Valid for 10 minutes.' },
  { id: 'welcome', name: 'Welcome SMS', body: 'Hi {{name}}! Welcome to {{appName}}. Reply STOP to opt out.' },
  { id: 'reminder', name: 'Appointment Reminder', body: 'Reminder: You have an appointment tomorrow at {{time}}. Reply C to confirm.' },
];

export default function SMSConfig({ open, onClose }: SMSConfigProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('otp');
  const [testPhone, setTestPhone] = useState('');
  const [sent, setSent] = useState(false);
  if (!open) return null;

  const current = TEMPLATES.find((t) => t.id === selectedTemplate)!;

  const sendTest = () => { if (testPhone.trim()) { setSent(true); setTimeout(() => setSent(false), 3000); } };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><MessageSquare className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">SMS Configuration</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Providers</h4>
            <div className="space-y-1.5">
              {PROVIDERS.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${p.color}`}>{p.icon}</div>
                  <span className="text-sm text-slate-200 flex-1">{p.name}</span>
                  {p.connected ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center gap-1"><Check className="w-2.5 h-2.5" />Connected</span> : <button className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">Connect</button>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Templates</h4>
            <div className="flex items-center gap-1.5 mb-2">
              {TEMPLATES.map((t) => <button key={t.id} onClick={() => setSelectedTemplate(t.id)} className={`text-xs px-2.5 py-1 rounded-full ${selectedTemplate === t.id ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>{t.name}</button>)}
            </div>
            <textarea value={current.body} readOnly className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200 resize-none h-20" />
          </div>

          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Send Test SMS</h4>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-slate-500" />
              <input value={testPhone} onChange={(e) => setTestPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200 focus:outline-none" />
              <button onClick={sendTest} disabled={!testPhone.trim()} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 text-xs font-semibold disabled:opacity-40"><Send className="w-3.5 h-3.5" /> Send</button>
            </div>
            {sent && <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1"><Check className="w-3 h-3" /> Test SMS sent to {testPhone}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
