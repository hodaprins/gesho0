import { GitCompare, X, Check, Minus, Plus } from 'lucide-react';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNum?: number;
}

const DIFF: DiffLine[] = [
  { type: 'unchanged', content: 'import { useState } from "react";', lineNum: 1 },
  { type: 'unchanged', content: '', lineNum: 2 },
  { type: 'removed', content: 'export function LoginScreen() {', lineNum: 3 },
  { type: 'added', content: 'export function LoginScreen({ onSuccess }: Props) {', lineNum: 3 },
  { type: 'unchanged', content: '  const [email, setEmail] = useState("");', lineNum: 4 },
  { type: 'unchanged', content: '  const [password, setPassword] = useState("");', lineNum: 5 },
  { type: 'removed', content: '  const handleSubmit = () => {', lineNum: 6 },
  { type: 'added', content: '  const handleSubmit = async () => {', lineNum: 6 },
  { type: 'unchanged', content: '    if (!email || !password) return;', lineNum: 7 },
  { type: 'removed', content: '    console.log("logging in", email);', lineNum: 8 },
  { type: 'added', content: '    const result = await auth.signIn(email, password);', lineNum: 8 },
  { type: 'added', content: '    if (result.success && onSuccess) onSuccess(result.user);', lineNum: 9 },
  { type: 'unchanged', content: '  };', lineNum: 10 },
  { type: 'unchanged', content: '', lineNum: 11 },
  { type: 'added', content: '  return (', lineNum: 12 },
  { type: 'added', content: '    <View style={styles.container}>', lineNum: 13 },
  { type: 'removed', content: '    <div className="login-form">', lineNum: 12 },
  { type: 'unchanged', content: '      <input type="email" value={email} />', lineNum: 13 },
  { type: 'unchanged', content: '      <input type="password" value={password} />', lineNum: 14 },
  { type: 'added', content: '      <Button onPress={handleSubmit}>Sign In</Button>', lineNum: 15 },
  { type: 'removed', content: '      <button onClick={handleSubmit}>Sign In</button>', lineNum: 15 },
  { type: 'unchanged', content: '    </div>', lineNum: 16 },
  { type: 'added', content: '    </View>', lineNum: 16 },
  { type: 'unchanged', content: '  );', lineNum: 17 },
  { type: 'unchanged', content: '}', lineNum: 18 },
];

interface CodeDiffViewerProps {
  open: boolean;
  onClose: () => void;
}

const LINE_STYLES: Record<string, { bg: string; prefix: string; icon: React.ReactNode }> = {
  added: { bg: 'bg-emerald-500/10', prefix: '+', icon: <Plus className="w-3 h-3 text-emerald-400" /> },
  removed: { bg: 'bg-red-500/10', prefix: '-', icon: <Minus className="w-3 h-3 text-red-400" /> },
  unchanged: { bg: '', prefix: ' ', icon: null },
};

export default function CodeDiffViewer({ open, onClose }: CodeDiffViewerProps) {
  if (!open) return null;
  const added = DIFF.filter((l) => l.type === 'added').length;
  const removed = DIFF.filter((l) => l.type === 'removed').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><GitCompare className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Code Diff</h3></div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-emerald-400">+{added}</span>
            <span className="text-red-400">-{removed}</span>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex items-center gap-2 px-5 py-2 border-b border-slate-800">
          <span className="text-xs text-slate-500">LoginScreen.tsx</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">Modified</span>
          <span className="text-[10px] text-slate-600 ml-auto">v1.0.0 → v1.1.0</span>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin font-mono text-xs">
          {DIFF.map((line, i) => {
            const style = LINE_STYLES[line.type];
            return (
              <div key={i} className={`flex items-center gap-2 px-4 py-0.5 ${style.bg}`}>
                <span className="w-8 text-slate-600 text-right shrink-0">{line.lineNum ?? ''}</span>
                <span className={`w-4 shrink-0 ${line.type === 'added' ? 'text-emerald-400' : line.type === 'removed' ? 'text-red-400' : 'text-slate-700'}`}>{style.prefix}</span>
                <span className={`flex-1 ${line.type === 'added' ? 'text-emerald-300' : line.type === 'removed' ? 'text-red-300' : 'text-slate-400'}`}>{line.content || ' '}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 text-xs font-semibold"><Check className="w-3.5 h-3.5" /> Accept changes</button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"><X className="w-3.5 h-3.5" /> Reject</button>
        </div>
      </div>
    </div>
  );
}
