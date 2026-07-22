import { useState } from 'react';
import { Download, X, FileCode2, FileArchive, Package, Check } from 'lucide-react';
import type { CodeTarget, AppRegion, ColorScheme } from '@/types/builder';
import { generateCode } from '@/lib/codeGenerator';

interface ExportPanelProps {
  open: boolean;
  onClose: () => void;
  regions: AppRegion[];
  colorScheme: ColorScheme;
  appName: string;
}

const TARGETS: { value: CodeTarget; label: string; icon: string; desc: string }[] = [
  { value: 'react-native', label: 'React Native', icon: 'react', desc: 'Cross-platform iOS + Android' },
  { value: 'flutter', label: 'Flutter', icon: 'flutter', desc: 'Google cross-platform SDK' },
  { value: 'swift', label: 'Swift / SwiftUI', icon: 'swift', desc: 'Native iOS app' },
  { value: 'kotlin', label: 'Kotlin / Jetpack', icon: 'kotlin', desc: 'Native Android app' },
  { value: 'web', label: 'Web / PWA', icon: 'web', desc: 'Progressive web app' },
];

export default function ExportPanel({ open, onClose, regions, colorScheme, appName }: ExportPanelProps) {
  const [selected, setSelected] = useState<CodeTarget>('react-native');
  const [exported, setExported] = useState(false);

  if (!open) return null;

  const completedRegions = regions.filter((r) => r.status === 'complete');
  const artifacts = generateCode(completedRegions, selected, colorScheme, appName);
  const totalLines = artifacts.reduce((sum, a) => sum + a.content.split('\n').length, 0);
  const totalSize = artifacts.reduce((sum, a) => sum + a.content.length, 0);

  const handleExport = () => {
    const allCode = artifacts.map((a) => `// ===== ${a.filename} =====\n${a.content}`).join('\n\n');
    const blob = new Blob([allCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appName.toLowerCase().replace(/\s+/g, '-')}-${selected}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Export Code</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Select Platform</h4>
            <div className="space-y-2">
              {TARGETS.map((target) => (
                <button
                  key={target.value}
                  onClick={() => setSelected(target.value)}
                  className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                    selected === target.value
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    <FileCode2 className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-200">{target.label}</p>
                    <p className="text-xs text-slate-500">{target.desc}</p>
                  </div>
                  {selected === target.value && (
                    <Check className="w-4 h-4 text-cyan-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-slate-800/50 p-3 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Files:</span>
              <span className="text-slate-300">{artifacts.length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Total lines:</span>
              <span className="text-slate-300">{totalLines.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Estimated size:</span>
              <span className="text-slate-300">{(totalSize / 1024).toFixed(1)} KB</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {artifacts.slice(0, 4).map((art) => (
              <div key={art.filename} className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-800/50 rounded px-2 py-1">
                <FileCode2 className="w-3 h-3" />
                {art.filename}
              </div>
            ))}
            {artifacts.length > 4 && (
              <span className="text-[10px] text-slate-600">+{artifacts.length - 4} more</span>
            )}
          </div>

          <button
            onClick={handleExport}
            className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-sm transition-all ${
              exported
                ? 'bg-emerald-500 text-white'
                : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.01]'
            } active:scale-95`}
          >
            {exported ? (
              <>
                <Check className="w-4 h-4" />
                Exported successfully!
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export {TARGETS.find((t) => t.value === selected)?.label} project
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
