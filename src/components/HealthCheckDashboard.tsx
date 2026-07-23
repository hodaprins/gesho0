import { HeartPulse, X, Check, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'down' | 'pending';
  latency: number;
  uptime: number;
  lastCheck: string;
}

const SERVICES: Service[] = [
  { id: '1', name: 'API Gateway', status: 'healthy', latency: 42, uptime: 99.98, lastCheck: '5s ago' },
  { id: '2', name: 'PostgreSQL', status: 'healthy', latency: 8, uptime: 99.99, lastCheck: '5s ago' },
  { id: '3', name: 'Redis Cache', status: 'degraded', latency: 120, uptime: 97.32, lastCheck: '5s ago' },
  { id: '4', name: 'Auth Service', status: 'healthy', latency: 35, uptime: 99.95, lastCheck: '5s ago' },
  { id: '5', name: 'File Storage (S3)', status: 'healthy', latency: 88, uptime: 99.91, lastCheck: '5s ago' },
  { id: '6', name: 'Push Notification', status: 'down', latency: 0, uptime: 89.20, lastCheck: '5s ago' },
  { id: '7', name: 'Webhook Dispatcher', status: 'degraded', latency: 340, uptime: 94.50, lastCheck: '5s ago' },
  { id: '8', name: 'Email Service', status: 'healthy', latency: 55, uptime: 99.88, lastCheck: '5s ago' },
];

const STATUS_META: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  healthy: { color: 'border-emerald-500/30 bg-emerald-500/5', icon: <Check className="w-4 h-4 text-emerald-400" />, label: 'Healthy' },
  degraded: { color: 'border-amber-500/30 bg-amber-500/5', icon: <AlertTriangle className="w-4 h-4 text-amber-400" />, label: 'Degraded' },
  down: { color: 'border-red-500/30 bg-red-500/5', icon: <XCircle className="w-4 h-4 text-red-400" />, label: 'Down' },
  pending: { color: 'border-slate-600/30 bg-slate-600/5', icon: <Clock className="w-4 h-4 text-slate-400" />, label: 'Pending' },
};

interface HealthCheckDashboardProps {
  open: boolean;
  onClose: () => void;
}

export default function HealthCheckDashboard({ open, onClose }: HealthCheckDashboardProps) {
  if (!open) return null;
  const healthy = SERVICES.filter((s) => s.status === 'healthy').length;
  const avgUptime = (SERVICES.reduce((sum, s) => sum + s.uptime, 0) / SERVICES.length).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><HeartPulse className="w-5 h-5 text-emerald-400" /><h3 className="text-sm font-semibold text-slate-100">Health Checks</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-3 gap-2 px-5 py-3 border-b border-slate-800">
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-emerald-400">{healthy}</p><p className="text-[10px] text-slate-500">Healthy</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-slate-100">{avgUptime}%</p><p className="text-[10px] text-slate-500">Avg Uptime</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-red-400">{SERVICES.filter(s => s.status === 'down').length}</p><p className="text-[10px] text-slate-500">Down</p></div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {SERVICES.map((s) => (
            <div key={s.id} className={`rounded-xl border p-3 ${STATUS_META[s.status].color}`}>
              <div className="flex items-center gap-3">
                {STATUS_META[s.status].icon}
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-200">{s.name}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-0.5">
                    <span>{STATUS_META[s.status].label}</span>
                    {s.latency > 0 && <span className="font-mono">{s.latency}ms</span>}
                    <span className="font-mono">{s.uptime}% uptime</span>
                    <span>checked {s.lastCheck}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
