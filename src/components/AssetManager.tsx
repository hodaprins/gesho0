import { useState } from 'react';
import { Image as ImageIcon, Upload, Search, Trash2, X, Copy } from 'lucide-react';

interface AssetManagerProps {
  open: boolean;
  onClose: () => void;
}

const STOCK_IMAGES = [
  { id: '1', url: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400', label: 'Team working' },
  { id: '2', url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400', label: 'Business meeting' },
  { id: '3', url: 'https://images.pexels.com/photos/2014773/pexels-photo-2014773.jpeg?auto=compress&cs=tinysrgb&w=400', label: 'Food plate' },
  { id: '4', url: 'https://images.pexels.com/photos/260352/pexels-photo-260352.jpeg?auto=compress&cs=tinysrgb&w=400', label: 'Macbook on desk' },
  { id: '5', url: 'https://images.pexels.com/photos/1851415/pexels-photo-1851415.jpeg?auto=compress&cs=tinysrgb&w=400', label: 'Coffee shop' },
  { id: '6', url: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=400', label: 'Mountain view' },
  { id: '7', url: 'https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400', label: 'Elephants' },
  { id: '8', url: 'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&w=400', label: 'Concert crowd' },
  { id: '9', url: 'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=400', label: 'Night sky' },
  { id: '10', url: 'https://images.pexels.com/photos/3573555/pexels-photo-3573555.jpeg?auto=compress&cs=tinysrgb&w=400', label: 'Restaurant food' },
  { id: '11', url: 'https://images.pexels.com/photos/2102416/pexels-photo-2102416.jpeg?auto=compress&cs=tinysrgb&w=400', label: 'Fitness gym' },
  { id: '12', url: 'https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&cs=tinysrgb&w=400', label: 'Person at desk' },
];

export default function AssetManager({ open, onClose }: AssetManagerProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const filtered = STOCK_IMAGES.filter((img) =>
    img.label.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Asset Library</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stock photos..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-600"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {filtered.map((img) => (
              <div
                key={img.id}
                className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                  selected === img.url ? 'border-cyan-500' : 'border-transparent hover:border-slate-700'
                }`}
                onClick={() => setSelected(img.url)}
              >
                <img src={img.url} alt={img.label} className="w-full h-24 object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(img.url);
                    }}
                    className="text-[10px] text-white flex items-center gap-1 bg-slate-800/80 rounded px-2 py-1"
                  >
                    <Copy className="w-3 h-3" />
                    {copied ? 'Copied!' : 'Copy URL'}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 text-center py-1 bg-slate-900 truncate">{img.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800">
          <span className="text-xs text-slate-500">{filtered.length} assets available</span>
          <button
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload custom
          </button>
        </div>
      </div>
    </div>
  );
}
