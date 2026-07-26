import { Network, X, Code, Play } from 'lucide-react';
import { useState } from 'react';

export default function GraphQLClientBuilder({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState(`query GetUsers {\n  users(limit: 10) {\n    id\n    name\n    email\n    posts {\n      title\n    }\n  }\n}`);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Network className="w-5 h-5 text-pink-400" /><h3 className="text-sm font-semibold text-slate-100">GraphQL Client Builder</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
          <div><label className="text-xs text-slate-500 mb-1 block">Endpoint</label><input defaultValue="https://api.example.com/graphql" className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200 font-mono" /></div>
          <div><label className="text-xs text-slate-500 mb-1 block flex items-center gap-1.5"><Code className="w-3 h-3" /> Query</label><textarea value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded-lg bg-slate-950/50 border border-slate-700 px-3 py-2 text-xs text-pink-400 font-mono h-32 resize-none" /></div>
          <div><h4 className="text-xs text-slate-500 mb-2">Caching Policy</h4><div className="grid grid-cols-3 gap-2">{['Apollo', 'urql', 'None'].map((c, i) => <button key={c} className={`rounded-lg p-2 text-xs text-center ${i === 0 ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-slate-800/50 text-slate-400 border border-slate-800'}`}>{c}</button>)}</div></div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><h4 className="text-xs text-pink-400 font-medium mb-1">Code Generation</h4><pre className="text-[10px] font-mono text-slate-300 whitespace-pre-wrap">{`// GraphQL Code Generator\nconst client = new ApolloClient({\n  uri: endpoint,\n  cache: new InMemoryCache()\n});\n\nconst { data } = useQuery(GET_USERS);`}</pre></div>
        </div>
        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800"><button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-pink-500/20 text-pink-400 text-xs font-medium"><Play className="w-3.5 h-3.5" /> Run Query</button><span className="text-xs text-slate-500">Generate TypeScript types</span></div>
      </div>
    </div>
  );
}
