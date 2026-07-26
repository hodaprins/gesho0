import { Video, X, Wifi, Server, Radio } from 'lucide-react';
import { useState } from 'react';

export default function WebRTCConfig({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [video, setVideo] = useState(true);
  const [audio, setAudio] = useState(true);
  const [codec, setCodec] = useState('VP9');
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Video className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">WebRTC Config</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setVideo(!video)} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 p-3"><div><p className="text-xs text-slate-200">Video</p><p className="text-[10px] text-slate-500">Camera stream</p></div><span className={`text-xs ${video ? 'text-emerald-400' : 'text-slate-600'}`}>{video ? 'ON' : 'OFF'}</span></button>
            <button onClick={() => setAudio(!audio)} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 p-3"><div><p className="text-xs text-slate-200">Audio</p><p className="text-[10px] text-slate-500">Microphone</p></div><span className={`text-xs ${audio ? 'text-emerald-400' : 'text-slate-600'}`}>{audio ? 'ON' : 'OFF'}</span></button>
          </div>
          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Codec Preference</h4>
            <div className="flex items-center gap-1.5">{['VP9', 'H264', 'AV1', 'Opus'].map(c => <button key={c} onClick={() => setCodec(c)} className={`text-xs px-2.5 py-1 rounded-full ${codec === c ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>{c}</button>)}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <h4 className="text-xs text-cyan-400 font-medium mb-2">ICE Servers</h4>
            <div className="space-y-1.5">
              {[{ type: 'STUN', url: 'stun:stun.l.google.com:19302', icon: Wifi }, { type: 'TURN', url: 'turn:turn.example.com:3478', icon: Server }].map(s => (
                <div key={s.url} className="flex items-center gap-2 rounded-lg bg-slate-800/50 p-2"><s.icon className="w-3 h-3 text-slate-500" /><span className="text-[10px] font-mono text-slate-300">{s.type}</span><code className="text-[10px] text-slate-500 flex-1 truncate">{s.url}</code></div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <h4 className="text-xs text-cyan-400 font-medium mb-2 flex items-center gap-1.5"><Radio className="w-3 h-3" /> Connection State</h4>
            <div className="flex items-center gap-2 text-xs">
              {['new', 'connecting', 'connected', 'disconnected', 'failed'].map((st, i) => (
                <div key={st} className="flex items-center gap-1"><div className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-emerald-400' : i < 2 ? 'bg-slate-600' : 'bg-slate-700'}`} /><span className={`text-[9px] ${i === 2 ? 'text-emerald-400' : 'text-slate-600'}`}>{st}</span>{i < 4 && <span className="text-slate-700">→</span>}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
