import { useState } from 'react';
import { Network, X, Link, ChevronRight } from 'lucide-react';

interface GraphQLSchemaVisualDesignerProps {
  open: boolean;
  onClose: () => void;
}

type FieldKind = 'String' | 'ID' | 'Int' | 'Boolean' | 'DateTime' | '[User]' | '[Post]';

interface GqlField {
  name: string;
  kind: FieldKind;
  relation?: string;
}

interface GqlType {
  name: string;
  fields: GqlField[];
  color: string;
}

const TYPES: GqlType[] = [
  { name: 'User', color: 'border-cyan-500/40', fields: [
    { name: 'id', kind: 'ID' }, { name: 'name', kind: 'String' }, { name: 'email', kind: 'String' },
    { name: 'posts', kind: '[Post]', relation: 'Post' },
  ]},
  { name: 'Post', color: 'border-violet-500/40', fields: [
    { name: 'id', kind: 'ID' }, { name: 'title', kind: 'String' }, { name: 'createdAt', kind: 'DateTime' },
    { name: 'author', kind: '[User]', relation: 'User' },
  ]},
  { name: 'Comment', color: 'border-emerald-500/40', fields: [
    { name: 'id', kind: 'ID' }, { name: 'body', kind: 'String' }, { name: 'likes', kind: 'Int' },
    { name: 'post', kind: '[Post]', relation: 'Post' },
  ]},
];

const KIND_COLOR: Record<string, string> = {
  ID: 'text-amber-400', String: 'text-cyan-400', Int: 'text-emerald-400',
  Boolean: 'text-rose-400', DateTime: 'text-violet-400', '[User]': 'text-sky-400', '[Post]': 'text-sky-400',
};

export default function GraphQLSchemaVisualDesigner({ open, onClose }: GraphQLSchemaVisualDesignerProps) {
  const [selected, setSelected] = useState<string | null>('User');
  if (!open) return null;
  const relations = TYPES.flatMap((t) => t.fields.filter((f) => f.relation).map((f) => ({ from: t.name, to: f.relation! })));
  const uniqueRels = Array.from(new Set(relations.map((r) => `${r.from}→${r.to}`))).map((s) => { const [from, to] = s.split('→'); return { from, to }; });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-violet-400" />
            <h3 className="text-sm font-semibold text-slate-100">GraphQL Schema Visual Designer</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {TYPES.map((t) => (
              <button key={t.name} onClick={() => setSelected(t.name)}
                className={`rounded-xl border bg-slate-800/40 p-3 text-left transition-all ${t.color} ${selected === t.name ? 'ring-2 ring-cyan-500/40' : 'hover:border-slate-600'}`}>
                <p className="text-xs font-bold text-slate-100 font-mono">{t.name}</p>
                <p className="text-[10px] text-slate-500">{t.fields.length} fields</p>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {TYPES.map((t) => (
              <div key={t.name} className={`rounded-xl border ${t.color} bg-slate-800/30 p-3`}>
                <p className="text-xs font-bold text-slate-100 font-mono mb-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />{t.name}
                </p>
                <div className="space-y-1.5">
                  {t.fields.map((f) => (
                    <div key={f.name} className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-300 font-mono">{f.name}</span>
                      <span className={`text-[10px] font-mono ${KIND_COLOR[f.kind]}`}>{f.kind}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-800/30 p-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Link className="w-3 h-3" />Relations</p>
            <div className="space-y-1.5">
              {uniqueRels.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 font-mono">{r.from}</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span className="px-2 py-0.5 rounded bg-violet-500/15 text-violet-400 font-mono">{r.to}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
