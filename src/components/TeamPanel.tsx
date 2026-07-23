import { useState } from 'react';
import { Users, X, Plus, Trash2, Mail, Shield, Crown, User as UserIcon } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  status: 'active' | 'invited';
  lastActive: string;
}

const INITIAL: TeamMember[] = [
  { id: '1', name: 'You', email: 'you@appforge.dev', role: 'owner', status: 'active', lastActive: 'Now' },
  { id: '2', name: 'Sarah Chen', email: 'sarah@example.com', role: 'admin', status: 'active', lastActive: '5m ago' },
  { id: '3', name: 'Mike Ross', email: 'mike@example.com', role: 'editor', status: 'active', lastActive: '1h ago' },
  { id: '4', name: 'Lisa Wang', email: 'lisa@example.com', role: 'viewer', status: 'invited', lastActive: 'Pending' },
];

const ROLE_ICONS: Record<string, React.ReactNode> = { owner: <Crown className="w-3 h-3 text-amber-400" />, admin: <Shield className="w-3 h-3 text-cyan-400" />, editor: <UserIcon className="w-3 h-3 text-emerald-400" />, viewer: <UserIcon className="w-3 h-3 text-slate-400" /> };
const ROLE_COLORS: Record<string, string> = { owner: 'bg-amber-500/20 text-amber-400', admin: 'bg-cyan-500/20 text-cyan-400', editor: 'bg-emerald-500/20 text-emerald-400', viewer: 'bg-slate-700 text-slate-400' };

interface TeamPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function TeamPanel({ open, onClose }: TeamPanelProps) {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL);
  const [inviteEmail, setInviteEmail] = useState('');
  if (!open) return null;

  const invite = () => {
    if (!inviteEmail.trim()) return;
    setMembers((p) => [...p, { id: crypto.randomUUID(), name: inviteEmail.split('@')[0], email: inviteEmail, role: 'viewer', status: 'invited', lastActive: 'Pending' }]);
    setInviteEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Users className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Team</h3><span className="text-xs text-slate-500">{members.length} members</span></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {members.map((m) => (
            <div key={m.id} className="group flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-sm font-bold text-slate-300 shrink-0">{m.name.charAt(0).toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{m.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{m.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize flex items-center gap-1 ${ROLE_COLORS[m.role]}`}>{ROLE_ICONS[m.role]}{m.role}</span>
                {m.status === 'invited' && <span className="text-[10px] text-amber-400">Invited</span>}
                <span className="text-[10px] text-slate-600">{m.lastActive}</span>
                {m.role !== 'owner' && <button onClick={() => setMembers((p) => p.filter((x) => x.id !== m.id))} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <Mail className="w-4 h-4 text-slate-500" />
          <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && invite()} placeholder="Invite by email..." className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none" />
          <button onClick={invite} disabled={!inviteEmail.trim()} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 text-xs font-semibold disabled:opacity-40"><Plus className="w-3.5 h-3.5" /> Invite</button>
        </div>
      </div>
    </div>
  );
}
