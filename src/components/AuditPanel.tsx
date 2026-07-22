import { useMemo } from 'react';
import { Gauge, AlertTriangle, CheckCircle2, Info, Shield, Search } from 'lucide-react';
import { runAudit, overallScore, scoreColor } from '@/lib/auditEngine';
import type { AppRegion, ColorScheme } from '@/types/builder';

interface AuditPanelProps {
  regions: AppRegion[];
  colorScheme: ColorScheme;
  platform: string;
}

export default function AuditPanel({ regions, colorScheme, platform }: AuditPanelProps) {
  const categories = useMemo(
    () => runAudit(regions, colorScheme, platform),
    [regions, colorScheme, platform],
  );
  const overall = overallScore(categories);
  const color = scoreColor(overall);

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Gauge className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-semibold text-slate-200">Quality Audit</h3>
      </div>

      <div className="flex items-center justify-center py-4">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeDasharray={`${(overall / 100) * 264} 264`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold" style={{ color }}>
              {overall}
            </span>
            <span className="text-[10px] text-slate-500 uppercase">Overall</span>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {categories.map((cat) => {
          const catColor = scoreColor(cat.score);
          return (
            <div
              key={cat.name}
              className="rounded-xl bg-slate-900 border border-slate-800 p-3 animate-fade-in-up"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CategoryIcon name={cat.name} />
                  <span className="text-sm font-medium text-slate-200">{cat.name}</span>
                </div>
                <span className="text-lg font-bold" style={{ color: catColor }}>
                  {cat.score}
                </span>
              </div>
              <div className="h-1 rounded-full bg-slate-800 overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${cat.score}%`, backgroundColor: catColor }}
                />
              </div>
              {cat.issues.length > 0 ? (
                <div className="space-y-1.5">
                  {cat.issues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <IssueIcon severity={issue.severity} />
                      <span className="text-slate-400 flex-1">{issue.message}</span>
                      {issue.element && (
                        <span className="text-[10px] text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded">
                          {issue.element}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  No issues found
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CategoryIcon({ name }: { name: string }) {
  switch (name) {
    case 'Accessibility':
      return <Info className="w-3.5 h-3.5 text-cyan-400" />;
    case 'Security':
      return <Shield className="w-3.5 h-3.5 text-red-400" />;
    case 'SEO & Discoverability':
      return <Search className="w-3.5 h-3.5 text-amber-400" />;
    default:
      return <Gauge className="w-3.5 h-3.5 text-emerald-400" />;
  }
}

function IssueIcon({ severity }: { severity: string }) {
  switch (severity) {
    case 'high':
      return <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />;
    case 'medium':
      return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />;
    default:
      return <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />;
  }
}
