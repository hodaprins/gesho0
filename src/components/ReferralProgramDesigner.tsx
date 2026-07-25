import { Gift, X, Plus, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

interface Milestone {
  id: string;
  referrals: number;
  reward: string;
}

interface ReferralProgramDesignerProps {
  open: boolean;
  onClose: () => void;
}

const INITIAL_MILESTONES: Milestone[] = [
  { id: crypto.randomUUID(), referrals: 3, reward: '1 month free' },
  { id: crypto.randomUUID(), referrals: 10, reward: 'Pro upgrade' },
  { id: crypto.randomUUID(), referrals: 25, reward: 'Exclusive swag pack' },
];

export default function ReferralProgramDesigner({ open, onClose }: ReferralProgramDesignerProps) {
  const [rewardType, setRewardType] = useState('Credit');
  const [amount, setAmount] = useState(10);
  const [dualSided, setDualSided] = useState(true);
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);

  if (!open) return null;

  const addMilestone = () => setMilestones((p) => [...p, { id: crypto.randomUUID(), referrals: 5, reward: 'New reward' }]);
  const removeMilestone = (id: string) => setMilestones((p) => p.filter((m) => m.id !== id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Gift className="w-5 h-5 text-rose-400" /><h3 className="text-sm font-semibold text-slate-100">Referral Program Designer</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div className="rounded-xl border-2 border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-pink-500/5 p-4 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Referral Offer</p>
            <p className="text-2xl font-bold text-rose-400">${amount} {rewardType}</p>
            <p className="text-xs text-slate-400 mt-1">{dualSided ? 'Dual-sided — both referrer & referee get rewarded' : 'One-sided — referrer only'}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Reward Type</label>
              <select value={rewardType} onChange={(e) => setRewardType(e.target.value)} className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500">
                <option>Credit</option><option>Discount</option><option>Cash</option><option>Free months</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Amount</label>
              <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500" />
            </div>
          </div>

          <button onClick={() => setDualSided((p) => !p)} className="w-full flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2.5">
            <span className="text-xs text-slate-300 flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-rose-400" /> Dual-sided rewards</span>
            <span className={`relative w-9 h-5 rounded-full transition-colors ${dualSided ? 'bg-rose-500' : 'bg-slate-700'}`}><span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${dualSided ? 'left-4.5' : 'left-0.5'}`} /></span>
          </button>

          <div>
            <div className="flex items-center justify-between mb-2"><h4 className="text-xs text-slate-500 uppercase tracking-wider">Milestone Rewards</h4><button onClick={addMilestone} className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300"><Plus className="w-3 h-3" /> Add</button></div>
            <div className="space-y-1.5">
              {milestones.map((m) => (
                <div key={m.id} className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/40 p-2">
                  <span className="text-[10px] text-slate-500 w-12">At</span>
                  <input type="number" value={m.referrals} onChange={(e) => setMilestones((p) => p.map((x) => x.id === m.id ? { ...x, referrals: Number(e.target.value) } : x))} className="w-14 rounded border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-rose-500" />
                  <span className="text-[10px] text-slate-500">refs</span>
                  <input value={m.reward} onChange={(e) => setMilestones((p) => p.map((x) => x.id === m.id ? { ...x, reward: e.target.value } : x))} className="flex-1 rounded border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-rose-500" />
                  <button onClick={() => removeMilestone(m.id)} className="text-slate-600 hover:text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
