import { useMemo, useState } from 'react';
import {
  TestTube,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ChevronDown,
  ChevronRight,
  Play,
  RefreshCw,
} from 'lucide-react';
import { generateTests, testSummary } from '@/lib/testEngine';
import type { AppRegion } from '@/types/builder';

interface TestPanelProps {
  regions: AppRegion[];
  appName: string;
}

export default function TestPanel({ regions, appName }: TestPanelProps) {
  const [expandedSuites, setExpandedSuites] = useState<Set<string>>(new Set(['Widget Tests']));
  const [runCount, setRunCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const results = useMemo(
    () => generateTests(regions, appName),
    [regions, appName, runCount],
  );
  const summary = testSummary(results);

  const suites = useMemo(() => {
    const map: Record<string, typeof results> = {};
    for (const r of results) {
      if (!map[r.suite]) map[r.suite] = [];
      map[r.suite].push(r);
    }
    return map;
  }, [results]);

  const toggleSuite = (suite: string) => {
    setExpandedSuites((prev) => {
      const next = new Set(prev);
      if (next.has(suite)) next.delete(suite);
      else next.add(suite);
      return next;
    });
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setRunCount((c) => c + 1);
      setIsRunning(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <TestTube className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200">Test Suite</h3>
        </div>
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          {isRunning ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5" />
          )}
          {isRunning ? 'Running...' : 'Run Tests'}
        </button>
      </div>

      <div className="px-4 py-3 border-b border-slate-800">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="rounded-lg bg-slate-900 border border-slate-800 py-2">
            <p className="text-lg font-bold text-emerald-400">{summary.passed}</p>
            <p className="text-[10px] text-slate-500">Passed</p>
          </div>
          <div className="rounded-lg bg-slate-900 border border-slate-800 py-2">
            <p className="text-lg font-bold text-red-400">{summary.failed}</p>
            <p className="text-[10px] text-slate-500">Failed</p>
          </div>
          <div className="rounded-lg bg-slate-900 border border-slate-800 py-2">
            <p className="text-lg font-bold text-slate-400">{summary.skipped}</p>
            <p className="text-[10px] text-slate-500">Skipped</p>
          </div>
          <div className="rounded-lg bg-slate-900 border border-slate-800 py-2">
            <p className="text-lg font-bold text-cyan-400">{summary.passRate}%</p>
            <p className="text-[10px] text-slate-500">Pass Rate</p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-slate-500">{summary.total} tests total</span>
          <span className="text-slate-500">{(summary.totalDuration / 1000).toFixed(2)}s total</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2">
        {Object.entries(suites).map(([suiteName, suiteResults]) => {
          const isExpanded = expandedSuites.has(suiteName);
          const suitePassed = suiteResults.filter((r) => r.status === 'pass').length;
          const suiteFailed = suiteResults.filter((r) => r.status === 'fail').length;
          return (
            <div key={suiteName} className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
              <button
                onClick={() => toggleSuite(suiteName)}
                className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-slate-800/50 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                )}
                <span className="text-sm font-medium text-slate-200 flex-1 text-left">{suiteName}</span>
                <span className="text-xs text-emerald-400">{suitePassed}</span>
                {suiteFailed > 0 && (
                  <span className="text-xs text-red-400">{suiteFailed}</span>
                )}
              </button>
              {isExpanded && (
                <div className="border-t border-slate-800 divide-y divide-slate-800/50">
                  {suiteResults.map((result, i) => (
                    <div key={i} className="flex items-center gap-2.5 px-3 py-2 animate-fade-in-up">
                      <TestStatusIcon status={result.status} />
                      <span className="text-xs text-slate-300 flex-1 truncate">{result.name}</span>
                      <span className="text-[10px] text-slate-600 font-mono">{result.duration}ms</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TestStatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'pass':
      return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
    case 'fail':
      return <XCircle className="w-4 h-4 text-red-400 shrink-0" />;
    default:
      return <MinusCircle className="w-4 h-4 text-slate-600 shrink-0" />;
  }
}
