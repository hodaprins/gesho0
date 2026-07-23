import { useState } from 'react';
import { HardDrive, X, Upload, Trash2, FileImage, FileVideo, FileText, Search } from 'lucide-react';

interface StorageFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: string;
  url: string;
  uploadedAt: string;
}

const INITIAL: StorageFile[] = [
  { id: '1', name: 'app-logo.png', type: 'image', size: '24 KB', url: 'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&w=100', uploadedAt: '2h ago' },
  { id: '2', name: 'hero-banner.jpg', type: 'image', size: '156 KB', url: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=100', uploadedAt: '5h ago' },
  { id: '3', name: 'onboarding.mp4', type: 'video', size: '2.4 MB', url: '', uploadedAt: '1d ago' },
  { id: '4', name: 'terms.pdf', type: 'document', size: '88 KB', url: '', uploadedAt: '3d ago' },
  { id: '5', name: 'profile-default.png', type: 'image', size: '12 KB', url: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100', uploadedAt: '1w ago' },
];

const TYPE_ICONS: Record<string, React.ReactNode> = { image: <FileImage className="w-4 h-4" />, video: <FileVideo className="w-4 h-4" />, document: <FileText className="w-4 h-4" /> };
const TYPE_COLORS: Record<string, string> = { image: 'text-cyan-400', video: 'text-amber-400', document: 'text-emerald-400' };

interface StorageManagerProps {
  open: boolean;
  onClose: () => void;
}

export default function StorageManager({ open, onClose }: StorageManagerProps) {
  const [files, setFiles] = useState<StorageFile[]>(INITIAL);
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [search, setSearch] = useState('');
  if (!open) return null;

  const filtered = files.filter((f) => (filter === 'all' || f.type === filter) && f.name.toLowerCase().includes(search.toLowerCase()));
  const totalSize = '2.7 MB';
  const sizeLimit = '1 GB';
  const usedPercent = 0.27;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><HardDrive className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Storage</h3><span className="text-xs text-slate-500">{totalSize} / {sizeLimit}</span></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-5 py-3 border-b border-slate-800 space-y-2">
          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full" style={{ width: `${usedPercent * 100}%` }} /></div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files..." className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none" />
            </div>
            <button onClick={() => setFilter('all')} className={`text-xs px-2 py-1 rounded-full ${filter === 'all' ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>All</button>
            {(['image', 'video', 'document'] as const).map((t) => <button key={t} onClick={() => setFilter(t)} className={`text-xs px-2 py-1 rounded-full capitalize ${filter === t ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>{t}</button>)}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filtered.map((f) => (
              <div key={f.id} className="group rounded-xl border border-slate-800 bg-slate-950/40 p-2 hover:border-slate-700 transition-colors">
                <div className="aspect-square rounded-lg bg-slate-800 flex items-center justify-center mb-2 overflow-hidden relative">
                  {f.type === 'image' && f.url ? <img src={f.url} alt={f.name} className="w-full h-full object-cover" /> : <div className={TYPE_COLORS[f.type]}>{TYPE_ICONS[f.type]}</div>}
                  <button onClick={() => setFiles((p) => p.filter((x) => x.id !== f.id))} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Trash2 className="w-3 h-3" /></button>
                </div>
                <p className="text-xs text-slate-300 font-mono truncate">{f.name}</p>
                <p className="text-[10px] text-slate-600">{f.size} · {f.uploadedAt}</p>
              </div>
            ))}
            <button className="aspect-square rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center gap-1.5 text-slate-500 hover:text-slate-300 hover:border-slate-600 transition-colors">
              <Upload className="w-6 h-6" /><span className="text-xs">Upload</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
