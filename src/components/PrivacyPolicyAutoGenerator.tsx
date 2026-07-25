import { useState } from 'react';
import { FileText, X, Copy, Download, Check, Shield, Eye, Share2, Scale, Mail } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  content: string;
}

interface PrivacyPolicyAutoGeneratorProps {
  open: boolean;
  onClose: () => void;
  appName: string;
}

export default function PrivacyPolicyAutoGenerator({ open, onClose, appName }: PrivacyPolicyAutoGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState('1');
  if (!open) return null;

  const sections: Section[] = [
    { id: '1', title: 'Data Collected', content: `${appName} collects the following personal data:\n- Email address (account creation)\n- Display name (profile)\n- IP address (security & analytics)\n- Device type & browser (technical diagnostics)` },
    { id: '2', title: 'How We Use It', content: `We use your data to:\n- Provide and maintain the service\n- Authenticate your identity\n- Send transactional emails\n- Detect and prevent abuse` },
    { id: '3', title: 'Third Parties', content: `We share data with these processors:\n- Stripe (payment processing, PCI-DSS)\n- SendGrid (email delivery)\n- Supabase (database hosting)\nNo data is sold to third parties.` },
    { id: '4', title: 'Your Rights', content: `Under GDPR you have the right to:\n- Access your personal data\n- Request correction or erasure\n- Export your data (portability)\n- Withdraw consent at any time\n- Lodge a complaint with a supervisory authority` },
    { id: '5', title: 'Contact', content: `To exercise your rights or ask questions about this policy, contact us at:\nprivacy@${appName.toLowerCase().replace(/\s+/g, '')}.com\nWe respond within 30 days.` },
  ];

  const markdown = `# Privacy Policy\n\n**Last updated:** ${new Date().toLocaleDateString()}\n\n${sections.map((s) => `## ${s.title}\n\n${s.content}`).join('\n\n')}`;
  const activeSection = sections.find((s) => s.id === active)!;
  const SECTION_ICON: Record<string, React.ReactNode> = {
    '1': <Shield className="w-3.5 h-3.5 text-cyan-400" />, '2': <Eye className="w-3.5 h-3.5 text-violet-400" />, '3': <Share2 className="w-3.5 h-3.5 text-amber-400" />, '4': <Scale className="w-3.5 h-3.5 text-emerald-400" />, '5': <Mail className="w-3.5 h-3.5 text-cyan-400" />,
  };

  const copy = () => { navigator.clipboard?.writeText(markdown); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><FileText className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Privacy Policy Generator</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-5 py-3 border-b border-slate-800">
          <div className="rounded-lg bg-slate-800/50 p-2.5 flex items-center justify-between">
            <div><p className="text-[10px] text-slate-500">Generated for</p><p className="text-sm font-medium text-slate-200">{appName}</p></div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Auto-drafted</span>
          </div>
        </div>

        <div className="flex items-center gap-1 px-5 py-2 border-b border-slate-800 overflow-x-auto scrollbar-thin">
          {sections.map((s) => (
            <button key={s.id} onClick={() => setActive(s.id)} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all shrink-0 ${active === s.id ? 'bg-slate-700 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}>
              {SECTION_ICON[s.id]}{s.title}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="flex items-center gap-2 mb-2">{SECTION_ICON[activeSection.id]}<p className="text-sm font-semibold text-slate-100">{activeSection.title}</p></div>
            <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">{activeSection.content}</pre>
          </div>
          <div className="mt-3 rounded-lg bg-slate-800/30 border border-slate-800 p-3">
            <p className="text-[10px] uppercase text-slate-500 mb-1">Markdown preview</p>
            <pre className="text-[10px] font-mono text-slate-400 whitespace-pre-wrap leading-relaxed">## {activeSection.title}\n\n{activeSection.content}</pre>
          </div>
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button onClick={copy} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Copied!' : 'Copy Markdown'}
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 text-xs font-semibold ml-auto">
            <Download className="w-3.5 h-3.5" /> Export .md
          </button>
        </div>
      </div>
    </div>
  );
}
