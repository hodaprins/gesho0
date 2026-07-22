import { useState } from 'react';
import { Database, X, RefreshCw, Check, Download } from 'lucide-react';
import { generateSeedData } from '@/lib/analytics';

interface SeedDataPanelProps {
  open: boolean;
  onClose: () => void;
  appType: string;
}

export default function SeedDataPanel({ open, onClose, appType }: SeedDataPanelProps) {
  const [generated, setGenerated] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  if (!open) return null;

  const tables = generateSeedData(appType);

  const handleRegenerate = () => {
    setRegenerating(true);
    setTimeout(() => {
      setRegenerating(false);
      setGenerated(true);
      setTimeout(() => setGenerated(false), 2000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Seed Data Generator</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4">
          <p className="text-xs text-slate-500">Generate sample data to populate your database for testing and demos.</p>

          {tables.map((table) => (
            <div key={table.table} className="rounded-xl border border-slate-800 bg-slate-950/50 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800 bg-slate-800/30">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-sm font-semibold text-slate-200 font-mono">{table.table}</span>
                <span className="text-xs text-slate-500 ml-auto">{table.rows.length} rows</span>
              </div>
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-800">
                      {Object.keys(table.rows[0]).map((col) => (
                        <th key={col} className="text-left px-3 py-2 text-slate-500 font-mono font-medium">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, i) => (
                      <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="px-3 py-2 text-slate-300 font-mono">{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          <div className="rounded-xl bg-slate-800/50 p-3">
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Generated SQL</h4>
            <div className="rounded-lg bg-[#0d1117] border border-slate-800 p-3 overflow-auto scrollbar-thin max-h-32">
              <pre className="text-[10px] font-mono text-slate-300 leading-relaxed">
{tables.map((t) =>
  t.rows.map((r) => `INSERT INTO ${t.table} (${Object.keys(r).join(', ')}) VALUES (${Object.values(r).map((v) => `'${v}'`).join(', ')});`).join('\n')
).join('\n')}
              </pre>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button
            onClick={handleRegenerate}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors"
          >
            {regenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Regenerate
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export SQL
          </button>
          <div className="flex-1" />
          <button
            onClick={handleRegenerate}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              generated
                ? 'bg-emerald-500 text-white'
                : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 hover:shadow-lg active:scale-95'
            }`}
          >
            {generated ? (
              <>
                <Check className="w-4 h-4" />
                Data inserted!
              </>
            ) : (
              'Insert into database'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
