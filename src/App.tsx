import { useCallback, useEffect, useRef, useState } from 'react';
import { Sparkles, Loader2, Rocket, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  parsePrompt,
  STAGE_DEFINITIONS,
  stageLogs,
  platformLabel,
} from '@/lib/appEngine';
import type {
  AppRegion,
  BuildStage,
  Platform,
  Project,
  StageType,
} from '@/types/builder';
import PromptScreen from '@/components/PromptScreen';
import BuildStages from '@/components/BuildStages';
import PhonePreview from '@/components/PhonePreview';
import RegionModal from '@/components/RegionModal';
import Header from '@/components/Header';

type View = 'prompt' | 'builder';

export default function App() {
  const [view, setView] = useState<View>('prompt');
  const [project, setProject] = useState<Project | null>(null);
  const [stages, setStages] = useState<BuildStage[]>([]);
  const [regions, setRegions] = useState<AppRegion[]>([]);
  const [activeLog, setActiveLog] = useState('');
  const [modalRegion, setModalRegion] = useState<AppRegion | null>(null);
  const [recentProjectName, setRecentProjectName] = useState<string>();
  const buildTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleStart = useCallback(async (prompt: string, platform: Platform) => {
    const spec = parsePrompt(prompt);

    const { data: proj, error: projErr } = await supabase
      .from('projects')
      .insert({
        name: spec.appName,
        prompt,
        platform,
        app_type: spec.appType,
        status: 'building',
        config: { colorScheme: spec.colorScheme },
      })
      .select()
      .single();

    if (projErr || !proj) {
      throw new Error(projErr?.message ?? 'Failed to create project');
    }
    const projectRow = proj as unknown as Project;
    setProject(projectRow);
    setRecentProjectName(projectRow.name);
    setView('builder');

    const stageRows = STAGE_DEFINITIONS.map((s, i) => ({
      project_id: projectRow.id,
      stage_name: s.name,
      stage_type: s.type,
      status: 'pending',
      logs: '',
      sort_order: i,
    }));
    const { data: insertedStages, error: stageErr } = await supabase
      .from('build_stages')
      .insert(stageRows)
      .select();
    if (stageErr || !insertedStages) {
      throw new Error(stageErr?.message ?? 'Failed to create build stages');
    }
    setStages(insertedStages as unknown as BuildStage[]);

    const regionRows = spec.screens.map((screen, i) => ({
      project_id: projectRow.id,
      region_name: screen.name,
      region_type: screen.regionType,
      status: screen.intentionallyIncomplete ? 'incomplete' : 'complete',
      spec: screen,
      description: screen.description,
      sort_order: i,
    }));
    const { data: insertedRegions, error: regionErr } = await supabase
      .from('app_regions')
      .insert(regionRows)
      .select();
    if (regionErr || !insertedRegions) {
      throw new Error(regionErr?.message ?? 'Failed to create app regions');
    }
    setRegions(insertedRegions as unknown as AppRegion[]);

    runBuildPipeline(projectRow.id, spec.appType);
  }, []);

  const runBuildPipeline = useCallback((projectId: string, appType: string) => {
    const stageDefs = STAGE_DEFINITIONS;
    let stageIdx = 0;

    const runNextStage = () => {
      if (stageIdx >= stageDefs.length) {
        supabase.from('projects').update({ status: 'completed' }).eq('id', projectId);
        setActiveLog('Build complete. Your app is ready to explore.');
        return;
      }
      const def = stageDefs[stageIdx];
      const logs = stageLogs(def.type, appType);
      let logIdx = 0;

      setStages((prev) =>
        prev.map((s) =>
          s.stage_type === def.type ? { ...s, status: 'in_progress' } : s,
        ),
      );
      supabase
        .from('build_stages')
        .update({ status: 'in_progress' })
        .eq('project_id', projectId)
        .eq('stage_type', def.type);

      const streamLog = () => {
        if (logIdx < logs.length) {
          setActiveLog(logs[logIdx]);
          logIdx++;
          buildTimer.current = setTimeout(streamLog, 700);
        } else {
          setStages((prev) =>
            prev.map((s) =>
              s.stage_type === def.type ? { ...s, status: 'completed', logs: logs.join('\n') } : s,
            ),
          );
          supabase
            .from('build_stages')
            .update({ status: 'completed', logs: logs.join('\n') })
            .eq('project_id', projectId)
            .eq('stage_type', def.type);

          stageIdx++;
          buildTimer.current = setTimeout(runNextStage, 350);
        }
      };
      streamLog();
    };

    runNextStage();
  }, []);

  const handleRegionClick = (region: AppRegion) => {
    setModalRegion(region);
  };

  const handleCompleteRegion = async (regionId: string) => {
    setRegions((prev) =>
      prev.map((r) => (r.id === regionId ? { ...r, status: 'complete' } : r)),
    );
    await supabase.from('app_regions').update({ status: 'complete' }).eq('id', regionId);
    setModalRegion(null);
  };

  const handleNew = () => {
    if (buildTimer.current) clearTimeout(buildTimer.current);
    setProject(null);
    setStages([]);
    setRegions([]);
    setActiveLog('');
    setView('prompt');
  };

  useEffect(() => {
    return () => {
      if (buildTimer.current) clearTimeout(buildTimer.current);
    };
  }, []);

  const isBuilding = stages.some((s) => s.status === 'in_progress' || s.status === 'pending');
  const buildComplete = stages.length > 0 && stages.every((s) => s.status === 'completed');
  const incompleteRegions = regions.filter((r) => r.status === 'incomplete');

  if (view === 'prompt') {
    return (
      <PromptScreen
        onStart={handleStart}
        recentProjectName={recentProjectName}
      />
    );
  }

  const colorScheme = project?.config?.colorScheme ?? {
    primary: '#0f766e', secondary: '#14b8a6', accent: '#f59e0b',
    background: '#f0fdfa', surface: '#ffffff', text: '#042f2e',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        projectName={project?.name}
        appType={project?.app_type}
        onNew={handleNew}
        onHome={handleNew}
      />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Build stages */}
        <div className="w-full lg:w-80 xl:w-96 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/50 flex flex-col max-h-[50vh] lg:max-h-none">
          <BuildStages stages={stages} activeLog={activeLog} />
        </div>

        {/* Center: Phone preview */}
        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 p-4 min-h-[400px] relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 w-full flex items-center justify-center">
            <PhonePreview
              regions={regions}
              colorScheme={colorScheme}
              appName={project?.name ?? 'My App'}
              onRegionClick={handleRegionClick}
            />
          </div>
        </div>

        {/* Right: Status panel */}
        <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-950/50 p-4 max-h-[40vh] lg:max-h-none overflow-y-auto scrollbar-thin">
          <BuildStatusPanel
            isBuilding={isBuilding}
            buildComplete={buildComplete}
            incompleteCount={incompleteRegions.length}
            platform={project?.platform as Platform}
            appName={project?.name ?? ''}
          />
        </div>
      </div>

      <RegionModal
        region={modalRegion}
        onClose={() => setModalRegion(null)}
        onComplete={handleCompleteRegion}
      />
    </div>
  );
}

function BuildStatusPanel({
  isBuilding,
  buildComplete,
  incompleteCount,
  platform,
  appName,
}: {
  isBuilding: boolean;
  buildComplete: boolean;
  incompleteCount: number;
  platform: Platform;
  appName: string;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Status</h3>
        {isBuilding ? (
          <div className="flex items-center gap-2 text-sm text-cyan-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            Building...
          </div>
        ) : buildComplete ? (
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            Build complete
          </div>
        ) : (
          <div className="text-sm text-slate-500">Idle</div>
        )}
      </div>

      <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">App name</span>
          <span className="text-slate-300 font-medium">{appName}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Platform</span>
          <span className="text-slate-300 font-medium">{platformLabel(platform)}</span>
        </div>
      </div>

      {buildComplete && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Rocket className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-semibold text-slate-200">Ready to deploy</h4>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Your app has been built successfully. Tap incomplete regions to finish them.
          </p>
          {incompleteCount > 0 && (
            <div className="flex items-center gap-2 text-xs text-amber-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              {incompleteCount} region{incompleteCount > 1 ? 's' : ''} need completion
            </div>
          )}
          <button
            className="w-full rounded-lg py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-95"
            disabled={incompleteCount > 0}
          >
            {incompleteCount > 0 ? 'Complete all regions first' : 'Deploy to store'}
          </button>
        </div>
      )}

      <div className="text-xs text-slate-600 text-center pt-2">
        {incompleteCount > 0
          ? 'Tap highlighted regions in the preview to complete them'
          : 'All regions complete'}
      </div>
    </div>
  );
}
