import { useState } from 'react';
import {
  Store,
  X,
  Image as ImageIcon,
  Tag,
  FileText,
  Copy,
  Check,
  Download,
} from 'lucide-react';
import type { AppRegion, ColorScheme } from '@/types/builder';

interface AppStoreAssetsProps {
  open: boolean;
  onClose: () => void;
  appName: string;
  appType: string;
  colorScheme: ColorScheme;
  regions: AppRegion[];
}

export default function AppStoreAssets({
  open,
  onClose,
  appName,
  appType,
  colorScheme,
  regions,
}: AppStoreAssetsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  if (!open) return null;

  const description = `${appName} is a powerful ${appType} application designed to make your life easier. ` +
    `With ${regions.length} beautifully crafted screens, it offers a seamless experience across iOS and Android. ` +
    `Key features include intuitive navigation, offline support, push notifications, and a clean modern interface. ` +
    `Download now and get started in seconds!`;

  const keywords = generateKeywords(appType, regions);
  const subtitle = generateSubtitle(appType);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-100">App Store Assets</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="rounded-xl bg-slate-800/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="w-4 h-4 text-slate-500" />
              <span className="text-xs uppercase tracking-wider text-slate-500">App Icon</span>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shrink-0"
                style={{ background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.secondary})` }}
              >
                {appName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold text-slate-200">{appName}</p>
                <p className="text-xs text-slate-500">{subtitle}</p>
                <div className="flex gap-1.5 mt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">1024x1024</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">PNG</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-800/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-500" />
                <span className="text-xs uppercase tracking-wider text-slate-500">Subtitle</span>
              </div>
              <button onClick={() => handleCopy(subtitle, 'subtitle')} className="text-slate-500 hover:text-slate-300">
                {copied === 'subtitle' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-sm text-slate-300">{subtitle}</p>
          </div>

          <div className="rounded-xl bg-slate-800/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" />
                <span className="text-xs uppercase tracking-wider text-slate-500">Description</span>
              </div>
              <button onClick={() => handleCopy(description, 'desc')} className="text-slate-500 hover:text-slate-300">
                {copied === 'desc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
          </div>

          <div className="rounded-xl bg-slate-800/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-500" />
                <span className="text-xs uppercase tracking-wider text-slate-500">Keywords</span>
              </div>
              <button onClick={() => handleCopy(keywords.join(', '), 'keywords')} className="text-slate-500 hover:text-slate-300">
                {copied === 'keywords' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((kw) => (
                <span key={kw} className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-400">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-slate-800/50 p-4">
            <span className="text-xs uppercase tracking-wider text-slate-500 mb-2 block">Screenshots</span>
            <div className="grid grid-cols-3 gap-2">
              {regions.slice(0, 6).map((region, i) => (
                <div
                  key={region.id}
                  className="aspect-[9/16] rounded-lg flex flex-col items-center justify-center p-2"
                  style={{ background: `linear-gradient(135deg, ${colorScheme.primary}20, ${colorScheme.secondary}20)` }}
                >
                  <span className="text-[10px] text-slate-400 mb-1">Screen {i + 1}</span>
                  <span className="text-xs font-semibold text-slate-300 text-center">{region.region_name}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 bg-slate-800 text-slate-200 text-sm font-medium hover:bg-slate-700 transition-colors">
            <Download className="w-4 h-4" />
            Download all assets
          </button>
        </div>
      </div>
    </div>
  );
}

function generateKeywords(appType: string, regions: AppRegion[]): string[] {
  const base: Record<string, string[]> = {
    ecommerce: ['shopping', 'store', 'buy', 'online shop', 'cart', 'products'],
    fitness: ['fitness', 'workout', 'health', 'exercise', 'gym', 'calories'],
    social: ['social', 'network', 'friends', 'chat', 'share', 'community'],
    todo: ['tasks', 'todo', 'productivity', 'organizer', 'reminders', 'planner'],
    finance: ['budget', 'finance', 'money', 'expenses', 'tracker', 'savings'],
    chat: ['messenger', 'chat', 'messages', 'talk', 'communication'],
    recipe: ['recipes', 'cooking', 'food', 'kitchen', 'meals', 'chef'],
    booking: ['booking', 'appointments', 'schedule', 'calendar', 'reservation'],
    education: ['learning', 'courses', 'education', 'study', 'lessons', 'quiz'],
    news: ['news', 'headlines', 'articles', 'updates', 'breaking'],
    music: ['music', 'player', 'songs', 'playlist', 'audio', 'streaming'],
    habit: ['habits', 'tracker', 'goals', 'streaks', 'routine', 'self-improvement'],
    general: ['app', 'mobile', 'utility', 'tools', 'everyday'],
  };
  return base[appType] ?? base.general;
}

function generateSubtitle(appType: string): string {
  const subtitles: Record<string, string> = {
    ecommerce: 'Shop smarter, not harder',
    fitness: 'Your personal fitness companion',
    social: 'Connect. Share. Discover.',
    todo: 'Get things done, beautifully',
    finance: 'Take control of your money',
    chat: 'Stay connected, instantly',
    recipe: 'Cook like a pro, every day',
    booking: 'Book anytime, anywhere',
    education: 'Learn anything, anywhere',
    news: 'Stay informed, every day',
    music: 'Your music, everywhere',
    habit: 'Build better habits daily',
    general: 'Everything you need, in one app',
  };
  return subtitles[appType] ?? subtitles.general;
}
