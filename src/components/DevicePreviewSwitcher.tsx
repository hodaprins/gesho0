import { useState } from 'react';
import { Smartphone, Tablet, X, Apple, Monitor } from 'lucide-react';
import type { AppRegion, ColorScheme, DeviceType } from '@/types/builder';
import PhonePreview from '@/components/PhonePreview';

interface DevicePreviewSwitcherProps {
  open: boolean;
  onClose: () => void;
  regions: AppRegion[];
  colorScheme: ColorScheme;
  appName: string;
}

const DEVICES: { id: DeviceType; label: string; width: number; height: number; icon: React.ReactNode }[] = [
  { id: 'iphone', label: 'iPhone 15 Pro', width: 393, height: 852, icon: <Apple className="w-5 h-5" /> },
  { id: 'android', label: 'Pixel 8', width: 412, height: 915, icon: <Smartphone className="w-5 h-5" /> },
  { id: 'tablet', label: 'iPad Pro', width: 1024, height: 1366, icon: <Tablet className="w-5 h-5" /> },
];

export default function DevicePreviewSwitcher({ open, onClose, regions, colorScheme, appName }: DevicePreviewSwitcherProps) {
  const [device, setDevice] = useState<DeviceType>('iphone');
  if (!open) return null;

  const current = DEVICES.find((d) => d.id === device)!;
  const scale = device === 'tablet' ? 0.4 : 0.7;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Monitor className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Device Preview</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center gap-1.5 px-5 py-2 border-b border-slate-800">
          {DEVICES.map((d) => (
            <button key={d.id} onClick={() => setDevice(d.id)} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${device === d.id ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}>
              {d.icon} {d.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin flex items-center justify-center p-6 bg-gradient-to-b from-slate-950 to-slate-900">
          <div className="relative" style={{ width: `${current.width * scale}px`, height: `${current.height * scale}px` }}>
            <div className="absolute inset-0 rounded-[2rem] border-[6px] border-slate-700 bg-black overflow-hidden shadow-2xl">
              <div className="w-full h-full overflow-hidden">
                <PhonePreview regions={regions} colorScheme={colorScheme} appName={appName} onRegionClick={() => {}} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800">
          <span className="text-xs text-slate-500">{current.label}</span>
          <span className="text-xs text-slate-500 font-mono">{current.width} × {current.height}px</span>
        </div>
      </div>
    </div>
  );
}
