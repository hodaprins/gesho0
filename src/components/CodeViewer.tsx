import { useMemo, useState } from 'react';
import { FileCode2, Copy, Check, Download, ChevronDown } from 'lucide-react';
import { generateCode, syntaxHighlight } from '@/lib/codeGenerator';
import type { AppRegion, CodeTarget, ColorScheme } from '@/types/builder';

interface CodeViewerProps {
  regions: AppRegion[];
  colorScheme: ColorScheme;
  appName: string;
}

const TARGETS: { value: CodeTarget; label: string }[] = [
  { value: 'react-native', label: 'React Native' },
  { value: 'flutter', label: 'Flutter' },
  { value: 'swift', label: 'Swift (iOS)' },
  { value: 'kotlin', label: 'Kotlin (Android)' },
  { value: 'web', label: 'Web (HTML)' },
];

export default function CodeViewer({ regions, colorScheme, appName }: CodeViewerProps) {
  const [target, setTarget] = useState<CodeTarget>('react-native');
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);
  const [targetMenuOpen, setTargetMenuOpen] = useState(false);

  const artifacts = useMemo(
    () => generateCode(regions.filter((r) => r.status === 'complete'), target, colorScheme, appName),
    [regions, target, colorScheme, appName],
  );

  const safeIdx = Math.min(activeFile, artifacts.length - 1);
  const current = artifacts[safeIdx];

  const handleCopy = () => {
    if (current) {
      navigator.clipboard.writeText(current.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!current) return;
    const blob = new Blob([current.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = current.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FileCode2 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200">Generated Code</h3>
        </div>
        <div className="relative">
          <button
            onClick={() => setTargetMenuOpen(!targetMenuOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
          >
            {TARGETS.find((t) => t.value === target)?.label}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {targetMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setTargetMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 rounded-lg border border-slate-700 bg-slate-900 shadow-xl py-1 min-w-[160px]">
                {TARGETS.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => {
                      setTarget(t.value);
                      setActiveFile(0);
                      setTargetMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                      target === t.value
                        ? 'text-cyan-400 bg-slate-800'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-48 border-r border-slate-800 bg-slate-950/50 overflow-y-auto scrollbar-thin py-2">
          {artifacts.map((art, i) => (
            <button
              key={art.filename}
              onClick={() => setActiveFile(i)}
              className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center gap-2 ${
                i === safeIdx
                  ? 'bg-slate-800/60 text-cyan-400 border-r-2 border-cyan-400'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{art.filename}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-950/30">
            <span className="text-xs text-slate-500 font-mono">{current?.filename}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <Download className="w-3 h-3" />
                Download
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto scrollbar-thin bg-[#0d1117] p-4">
            <pre className="text-xs font-mono leading-relaxed">
              <code
                dangerouslySetInnerHTML={{
                  __html: current
                    ? syntaxHighlight(current.content, current.language)
                    : '<span class="text-slate-600">// No code generated yet</span>',
                }}
              />
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
