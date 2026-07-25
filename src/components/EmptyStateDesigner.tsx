import { Inbox, X, Sparkles, Image as ImageIcon, Search } from 'lucide-react';
import { useState } from 'react';

interface EmptyStateTemplate {
  id: string;
  scenario: string;
  icon: string;
  title: string;
  message: string;
  cta: string;
  illustration: string;
}

const TEMPLATES: EmptyStateTemplate[] = [
  { id: '1', scenario: 'No search results', icon: '🔍', title: 'No results found', message: 'Try different keywords or adjust your filters', cta: 'Clear filters', illustration: 'search' },
  { id: '2', scenario: 'Empty inbox', icon: '📭', title: 'Your inbox is empty', message: 'When you receive messages, they will appear here', cta: 'Compose message', illustration: 'inbox' },
  { id: '3', scenario: 'No notifications', icon: '🔔', title: 'All caught up!', message: 'You have no new notifications right now', cta: 'Settings', illustration: 'bell' },
  { id: '4', scenario: 'No data yet', icon: '📊', title: 'No data to show', message: 'Start using the app to see your analytics here', cta: 'Get started', illustration: 'chart' },
  { id: '5', scenario: 'Offline', icon: '📡', title: 'You are offline', message: 'Some features may be unavailable. Reconnect to sync.', cta: 'Retry', illustration: 'wifi' },
  { id: '6', scenario: 'Error loading', icon: '⚠️', title: 'Something went wrong', message: 'We could not load this content. Please try again.', cta: 'Try again', illustration: 'error' },
  { id: '7', scenario: 'First time user', icon: '👋', title: 'Welcome!', message: 'Let us set up your profile to get started', cta: 'Set up profile', illustration: 'welcome' },
  { id: '8', scenario: 'No favorites', icon: '⭐', title: 'No favorites yet', message: 'Tap the star icon to save items here', cta: 'Browse', illustration: 'star' },
];

interface EmptyStateDesignerProps {
  open: boolean;
  onClose: () => void;
}

export default function EmptyStateDesigner({ open, onClose }: EmptyStateDesignerProps) {
  const [selected, setSelected] = useState(0);
  if (!open) return null;
  const current = TEMPLATES[selected];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Inbox className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Empty State Designer</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-40 border-r border-slate-800 overflow-y-auto scrollbar-thin py-2 shrink-0">
            {TEMPLATES.map((t, i) => <button key={t.id} onClick={() => setSelected(i)} className={`w-full text-left px-3 py-2 text-xs transition-colors ${i === selected ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}>{t.icon} {t.scenario}</button>)}
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
            <div className="rounded-2xl border border-slate-800 bg-white p-8 text-center mb-4">
              <div className="text-5xl mb-4">{current.icon}</div>
              <p className="text-base font-semibold text-slate-800 mb-2">{current.title}</p>
              <p className="text-sm text-slate-500 mb-4">{current.message}</p>
              <button className="px-4 py-2 rounded-lg bg-cyan-500 text-white text-sm font-medium">{current.cta}</button>
            </div>
            <div className="space-y-2">
              <div><label className="text-xs text-slate-500">Title</label><input defaultValue={current.title} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200 mt-1" /></div>
              <div><label className="text-xs text-slate-500">Message</label><textarea defaultValue={current.message} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200 mt-1 h-16 resize-none" /></div>
              <div><label className="text-xs text-slate-500">CTA Button Text</label><input defaultValue={current.cta} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200 mt-1" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
