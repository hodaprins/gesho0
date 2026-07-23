import { Store, X, Check, Plus, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  color: string;
  installed: boolean;
  popular?: boolean;
}

const INTEGRATIONS: Integration[] = [
  { id: 'stripe', name: 'Stripe', category: 'Payments', description: 'Accept payments and manage subscriptions', icon: 'S', color: 'bg-indigo-500/20 text-indigo-400', installed: true, popular: true },
  { id: 'sendgrid', name: 'SendGrid', category: 'Email', description: 'Transactional email delivery', icon: 'SG', color: 'bg-cyan-500/20 text-cyan-400', installed: true },
  { id: 'twilio', name: 'Twilio', category: 'SMS', description: 'SMS and voice messaging', icon: 'T', color: 'bg-red-500/20 text-red-400', installed: true },
  { id: 'sentry', name: 'Sentry', category: 'Monitoring', description: 'Error tracking and performance', icon: 'Se', color: 'bg-amber-500/20 text-amber-400', installed: false, popular: true },
  { id: 'mixpanel', name: 'Mixpanel', category: 'Analytics', description: 'Product analytics and funnels', icon: 'M', color: 'bg-purple-500/20 text-purple-400', installed: false },
  { id: 'segment', name: 'Segment', category: 'Analytics', description: 'Customer data platform', icon: 'Se', color: 'bg-emerald-500/20 text-emerald-400', installed: false, popular: true },
  { id: 'algolia', name: 'Algolia', category: 'Search', description: 'Instant search and discovery', icon: 'A', color: 'bg-blue-500/20 text-blue-400', installed: false },
  { id: 'cloudinary', name: 'Cloudinary', category: 'Media', description: 'Image and video optimization', icon: 'C', color: 'bg-cyan-500/20 text-cyan-400', installed: false },
  { id: 'intercom', name: 'Intercom', category: 'Support', description: 'Customer messaging and support', icon: 'I', color: 'bg-blue-500/20 text-blue-400', installed: false },
  { id: 'datadog', name: 'Datadog', category: 'Monitoring', description: 'Infrastructure monitoring', icon: 'DD', color: 'bg-purple-500/20 text-purple-400', installed: false },
  { id: 'redis', name: 'Redis Cloud', category: 'Cache', description: 'Managed Redis caching', icon: 'R', color: 'bg-red-500/20 text-red-400', installed: true },
  { id: 'openai', name: 'OpenAI', category: 'AI', description: 'GPT models and embeddings', icon: 'AI', color: 'bg-emerald-500/20 text-emerald-400', installed: false, popular: true },
];

const CATEGORIES = ['All', 'Payments', 'Email', 'SMS', 'Monitoring', 'Analytics', 'Search', 'Media', 'Support', 'Cache', 'AI'];

interface IntegrationMarketplaceProps {
  open: boolean;
  onClose: () => void;
}

export default function IntegrationMarketplace({ open, onClose }: IntegrationMarketplaceProps) {
  const [category, setCategory] = useState('All');
  const [installed, setInstalled] = useState<Set<string>>(new Set(INTEGRATIONS.filter((i) => i.installed).map((i) => i.id)));
  if (!open) return null;

  const filtered = INTEGRATIONS.filter((i) => category === 'All' || i.category === category);

  const toggle = (id: string) => setInstalled((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Store className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Integrations</h3><span className="text-xs text-slate-500">{installed.size} installed</span></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center gap-1 px-5 py-2 border-b border-slate-800 overflow-x-auto scrollbar-thin">
          {CATEGORIES.map((c) => <button key={c} onClick={() => setCategory(c)} className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${category === c ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>{c}</button>)}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <div className="grid grid-cols-2 gap-2">
            {filtered.map((i) => (
              <div key={i.id} className="group rounded-xl border border-slate-800 bg-slate-950/40 p-3 hover:border-slate-700 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${i.color}`}>{i.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-slate-200 truncate">{i.name}</p>
                      {i.popular && <span className="text-[8px] px-1 rounded bg-amber-500/20 text-amber-400">POPULAR</span>}
                    </div>
                    <p className="text-[10px] text-slate-500 mb-2 line-clamp-2">{i.description}</p>
                    <button onClick={() => toggle(i.id)} className={`text-[10px] px-2 py-1 rounded-lg font-medium ${installed.has(i.id) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                      {installed.has(i.id) ? <span className="flex items-center gap-1"><Check className="w-2.5 h-2.5" />Installed</span> : 'Install'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
