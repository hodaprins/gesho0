import { useState } from 'react';
import { Rocket, X, CheckCircle2, Loader2, Globe, Apple, Smartphone, ExternalLink } from 'lucide-react';
import type { DeployEnvironment, Platform } from '@/types/builder';

interface DeployDialogProps {
  open: boolean;
  onClose: () => void;
  platform: Platform;
  appName: string;
  buildComplete: boolean;
}

export default function DeployDialog({
  open,
  onClose,
  platform,
  appName,
  buildComplete,
}: DeployDialogProps) {
  const [env, setEnv] = useState<DeployEnvironment>('preview');
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [step, setStep] = useState(0);

  if (!open) return null;

  const steps = [
    'Bundling application...',
    'Running production optimizations...',
    'Uploading to build server...',
    'Generating signed binary...',
    `Deploying to ${env}...`,
    'Deployment complete!',
  ];

  const handleDeploy = () => {
    setDeploying(true);
    setStep(0);
    setDeployed(false);
    steps.forEach((_, i) => {
      setTimeout(() => {
        setStep(i);
        if (i === steps.length - 1) {
          setDeployed(true);
          setDeploying(false);
        }
      }, i * 900);
    });
  };

  const handleClose = () => {
    setDeployed(false);
    setDeploying(false);
    setStep(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={deploying ? undefined : handleClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-100">Deploy {appName}</h3>
          </div>
          {!deploying && (
            <button onClick={handleClose} className="text-slate-500 hover:text-slate-300">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-5 space-y-5">
          {!deploying && !deployed && (
            <>
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Environment</h4>
                <div className="grid grid-cols-3 gap-2">
                  {(['preview', 'staging', 'production'] as const).map((e) => (
                    <button
                      key={e}
                      onClick={() => setEnv(e)}
                      className={`rounded-xl border p-3 text-center transition-all ${
                        env === e
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-medium text-slate-200 capitalize">{e}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Target Platforms</h4>
                <div className="flex items-center gap-2">
                  {(platform === 'ios' || platform === 'both') && (
                    <div className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300">
                      <Apple className="w-4 h-4" /> iOS
                    </div>
                  )}
                  {(platform === 'android' || platform === 'both') && (
                    <div className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300">
                      <Smartphone className="w-4 h-4" /> Android
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300">
                    <Globe className="w-4 h-4" /> Web
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-slate-800/50 p-3 text-xs text-slate-400 space-y-1">
                <div className="flex justify-between"><span>Bundle size:</span><span className="text-slate-300">2.3 MB</span></div>
                <div className="flex justify-between"><span>Min API level:</span><span className="text-slate-300">23 (Android 6.0)</span></div>
                <div className="flex justify-between"><span>Min iOS:</span><span className="text-slate-300">14.0</span></div>
                <div className="flex justify-between"><span>Build mode:</span><span className="text-slate-300">Release</span></div>
              </div>

              {!buildComplete && (
                <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2 text-xs text-amber-400">
                  Build is not complete. Some screens may be missing in the deployed app.
                </div>
              )}

              <button
                onClick={handleDeploy}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 font-semibold text-sm transition-all hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.01] active:scale-95"
              >
                <Rocket className="w-4 h-4" />
                Deploy to {env}
              </button>
            </>
          )}

          {deploying && (
            <div className="space-y-3 py-2">
              {steps.map((s, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <div key={i} className={`flex items-center gap-3 ${done || active ? 'opacity-100' : 'opacity-30'}`}>
                    {done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : active ? (
                      <Loader2 className="w-5 h-5 text-cyan-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-700 shrink-0" />
                    )}
                    <span className={`text-sm ${done ? 'text-slate-400' : active ? 'text-slate-100' : 'text-slate-600'}`}>
                      {s}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {deployed && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-100">Deployed successfully!</h4>
                <p className="text-sm text-slate-400 mt-1">Your app is live on {env}</p>
              </div>
              <div className="rounded-xl bg-slate-800 p-3 space-y-2 text-left">
                {env !== 'production' && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Preview URL:</span>
                    <span className="text-xs text-cyan-400 font-mono flex items-center gap-1">
                      https://{appName.toLowerCase().replace(/\s+/g, '-')}.{env}.appforge.dev
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Build ID:</span>
                  <span className="text-xs text-slate-300 font-mono">AF-{Date.now().toString(36).toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Version:</span>
                  <span className="text-xs text-slate-300">1.0.0</span>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-full rounded-xl py-2.5 bg-slate-800 text-slate-200 text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
