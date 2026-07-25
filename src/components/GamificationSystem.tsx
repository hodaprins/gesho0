import { Trophy, X, Flame, Star, Award, Users, Zap, Lock } from 'lucide-react';
import { useState } from 'react';

type Badge = { id: string; name: string; desc: string; icon: typeof Trophy; earned: boolean; progress: number };

export function GamificationSystem({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [points] = useState(4250);
  const [streak] = useState(12);

  if (!open) return null;

  const badges: Badge[] = [
    { id: 'first-deploy', name: 'First Deploy', desc: 'Deploy your first project', icon: Zap, earned: true, progress: 100 },
    { id: 'streak7', name: '7-day Streak', desc: 'Active 7 consecutive days', icon: Flame, earned: true, progress: 100 },
    { id: 'screens100', name: '100 Screens', desc: 'Build 100 screens total', icon: Star, earned: false, progress: 73 },
    { id: 'team-player', name: 'Team Player', desc: 'Invite 5 team members', icon: Users, earned: false, progress: 40 },
    { id: 'centurion', name: 'Centurion', desc: 'Reach 100 deploys', icon: Trophy, earned: false, progress: 28 },
    { id: 'legend', name: 'Legend', desc: 'Earn all other badges', icon: Award, earned: false, progress: 50 },
  ];

  const earnedCount = badges.filter((b) => b.earned).length;
  const nextLevel = 5000;
  const levelPct = Math.min(100, (points / nextLevel) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">Achievements</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-3">
              <p className="text-xs text-slate-400">Points</p>
              <p className="text-xl font-bold text-white">{points.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-3">
              <p className="text-xs text-slate-400 flex items-center gap-1"><Flame className="h-3 w-3 text-orange-400" /> Streak</p>
              <p className="text-xl font-bold text-white">{streak} days</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-3">
              <p className="text-xs text-slate-400">Badges</p>
              <p className="text-xl font-bold text-white">{earnedCount}/{badges.length}</p>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Level Progress</span>
              <span>{points} / {nextLevel.toLocaleString()}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-indigo-500 transition-all" style={{ width: `${levelPct}%` }} />
            </div>
          </div>
        </div>

        <div className="max-h-[45vh] overflow-y-auto px-6 pb-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {badges.map((b) => {
              const Icon = b.earned ? b.icon : Lock;
              return (
                <div
                  key={b.id}
                  className={`rounded-xl border p-4 text-center transition ${
                    b.earned ? 'border-amber-500/40 bg-amber-500/5' : 'border-slate-800 bg-slate-800/30'
                  }`}
                >
                  <div className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full ${
                    b.earned ? 'bg-amber-500/20' : 'bg-slate-800'
                  }`}>
                    <Icon className={`h-6 w-6 ${b.earned ? 'text-amber-400' : 'text-slate-600'}`} />
                  </div>
                  <p className={`text-sm font-semibold ${b.earned ? 'text-white' : 'text-slate-400'}`}>{b.name}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500 leading-tight">{b.desc}</p>
                  {!b.earned && (
                    <div className="mt-2">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
                        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${b.progress}%` }} />
                      </div>
                      <p className="mt-1 text-[10px] text-slate-500">{b.progress}%</p>
                    </div>
                  )}
                  {b.earned && <p className="mt-2 text-[10px] font-medium text-amber-400">Unlocked</p>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-800 px-6 py-3">
          <button onClick={onClose} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default GamificationSystem;
