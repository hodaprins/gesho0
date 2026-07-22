import { useState, useRef, useEffect } from 'react';
import { Bell, X, CheckCheck, Trash2 } from 'lucide-react';
import { generateNotifications } from '@/lib/analytics';

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
  appName: string;
}

const TYPE_COLORS: Record<string, string> = {
  success: 'bg-emerald-500/20 text-emerald-400',
  warning: 'bg-amber-500/20 text-amber-400',
  info: 'bg-cyan-500/20 text-cyan-400',
  error: 'bg-red-500/20 text-red-400',
};

export default function NotificationCenter({ open, onClose, appName }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState(generateNotifications(appName));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && ref.current) {
      ref.current.scrollTop = 0;
    }
  }, [open]);

  if (!open) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={ref}
        className="fixed right-4 top-16 z-50 w-80 rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[70vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-medium">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={markAllRead} className="text-slate-500 hover:text-slate-300 p-1" title="Mark all read">
              <CheckCheck className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-500">No notifications</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`group rounded-xl p-3 transition-colors cursor-pointer ${
                  n.read ? 'bg-slate-950/30' : 'bg-slate-800/40'
                } hover:bg-slate-800/60`}
                onClick={() => setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
              >
                <div className="flex items-start gap-2.5">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-slate-700' : 'bg-cyan-400 animate-pulse'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full capitalize ${TYPE_COLORS[n.type] ?? TYPE_COLORS.info}`}>
                        {n.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{n.body}</p>
                    <p className="text-[10px] text-slate-600 mt-1">{n.time}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(n.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
