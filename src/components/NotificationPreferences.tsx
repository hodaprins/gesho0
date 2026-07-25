import { BellRing, X, Bell, Mail, Smartphone, Moon } from 'lucide-react';
import { useState } from 'react';

type Channel = 'inapp' | 'email' | 'push';
type EventKey = 'deploys' | 'comments' | 'errors' | 'mentions';

export function NotificationPreferences({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [channels, setChannels] = useState<Record<Channel, boolean>>({ inapp: true, email: true, push: false });
  const [events, setEvents] = useState<Record<EventKey, boolean>>({
    deploys: true, comments: true, errors: true, mentions: false,
  });
  const [quiet, setQuiet] = useState(true);
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('07:00');

  if (!open) return null;

  const channelList: { key: Channel; label: string; icon: typeof Bell }[] = [
    { key: 'inapp', label: 'In-App', icon: Bell },
    { key: 'email', label: 'Email', icon: Mail },
    { key: 'push', label: 'Push', icon: Smartphone },
  ];
  const eventList: { key: EventKey; label: string; desc: string }[] = [
    { key: 'deploys', label: 'Deploys', desc: 'Deployment started & completed' },
    { key: 'comments', label: 'Comments', desc: 'New comments on your work' },
    { key: 'errors', label: 'Errors', desc: 'Critical errors & failures' },
    { key: 'mentions', label: 'Mentions', desc: 'When you are @mentioned' },
  ];

  const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
    <button onClick={onClick} className={`relative h-5 w-9 rounded-full transition ${on ? 'bg-indigo-500' : 'bg-slate-700'}`}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${on ? 'left-4' : 'left-0.5'}`} />
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <BellRing className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-5 space-y-6">
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Channels</h3>
            <div className="grid grid-cols-3 gap-3">
              {channelList.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setChannels((c) => ({ ...c, [key]: !c[key] }))}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition ${
                    channels[key] ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-800/30'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${channels[key] ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className={`text-sm font-medium ${channels[key] ? 'text-white' : 'text-slate-400'}`}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Event Notifications</h3>
            <div className="space-y-2">
              {eventList.map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/30 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                  <Toggle on={events[key]} onClick={() => setEvents((e) => ({ ...e, [key]: !e[key] }))} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-indigo-400" />
                <span className="text-sm font-medium text-white">Quiet Hours</span>
              </div>
              <Toggle on={quiet} onClick={() => setQuiet((q) => !q)} />
            </div>
            {quiet && (
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="time" value={quietStart} onChange={(e) => setQuietStart(e.target.value)}
                  className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
                <span className="text-slate-500">to</span>
                <input
                  type="time" value={quietEnd} onChange={(e) => setQuietEnd(e.target.value)}
                  className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-800 px-6 py-3">
          <button onClick={onClose} className="rounded-lg px-4 py-1.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white">
            Cancel
          </button>
          <button onClick={onClose} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotificationPreferences;
