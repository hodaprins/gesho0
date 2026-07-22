import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  Loader2,
  Rocket,
  CheckCircle2,
  Palette,
  Code2,
  Database as DatabaseIcon,
  TestTube,
  Rocket as DeployIcon,
  Gauge,
  Bot,
  LayoutGrid,
  Layers,
  Workflow,
  BarChart3,
  Store,
  GitBranch,
  ArrowRight,
} from 'lucide-react';
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
  BuilderTab,
  ColorScheme,
} from '@/types/builder';
import PromptScreen from '@/components/PromptScreen';
import BuildStages from '@/components/BuildStages';
import PhonePreview from '@/components/PhonePreview';
import RegionModal from '@/components/RegionModal';
import Header from '@/components/Header';
import ProjectDashboard from '@/components/ProjectDashboard';
import CodeViewer from '@/components/CodeViewer';
import ThemeEditor from '@/components/ThemeEditor';
import ComponentLibrary from '@/components/ComponentLibrary';
import ScreenFlow from '@/components/ScreenFlow';
import AIChat from '@/components/AIChat';
// ScreenFlow is used in the design tab via the navigation flow view
import BuildMetrics from '@/components/BuildMetrics';
import AuditPanel from '@/components/AuditPanel';
import TestPanel from '@/components/TestPanel';
import DeployDialog from '@/components/DeployDialog';
import AppStoreAssets from '@/components/AppStoreAssets';
import VersionHistory from '@/components/VersionHistory';
import ExportPanel from '@/components/ExportPanel';

type View = 'prompt' | 'builder' | 'dashboard';

const BUILDER_TABS: { id: BuilderTab; label: string; icon: React.ReactNode }[] = [
  { id: 'design', label: 'Design', icon: <Palette className="w-3.5 h-3.5" /> },
  { id: 'code', label: 'Code', icon: <Code2 className="w-3.5 h-3.5" /> },
  { id: 'database', label: 'Data', icon: <DatabaseIcon className="w-3.5 h-3.5" /> },
  { id: 'test', label: 'Tests', icon: <TestTube className="w-3.5 h-3.5" /> },
  { id: 'audit', label: 'Audit', icon: <Gauge className="w-3.5 h-3.5" /> },
  { id: 'deploy', label: 'Deploy', icon: <DeployIcon className="w-3.5 h-3.5" /> },
];

export default function App() {
  const [view, setView] = useState<View>('prompt');
  const [project, setProject] = useState<Project | null>(null);
  const [stages, setStages] = useState<BuildStage[]>([]);
  const [regions, setRegions] = useState<AppRegion[]>([]);
  const [activeLog, setActiveLog] = useState('');
  const [modalRegion, setModalRegion] = useState<AppRegion | null>(null);
  const [recentProjectName, setRecentProjectName] = useState<string>();
  const [activeTab, setActiveTab] = useState<BuilderTab>('design');
  const [colorScheme, setColorScheme] = useState<ColorScheme>({
    primary: '#0f766e', secondary: '#14b8a6', accent: '#f59e0b',
    background: '#f0fdfa', surface: '#ffffff', text: '#042f2e',
  });
  const [deployOpen, setDeployOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);
  const [versionsOpen, setVersionsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
    setColorScheme(spec.colorScheme);
    setRecentProjectName(projectRow.name);
    setView('builder');
    setActiveTab('design');

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

  const handleAddElement = (regionId: string, element: import('@/types/builder').ScreenElement) => {
    setRegions((prev) =>
      prev.map((r) =>
        r.id === regionId
          ? { ...r, spec: { ...r.spec, elements: [...r.spec.elements, element] } }
          : r,
      ),
    );
  };

  const handleColorChange = (cs: ColorScheme) => {
    setColorScheme(cs);
    if (project) {
      supabase.from('projects').update({ config: { colorScheme: cs } }).eq('id', project.id);
    }
  };

  const handleOpenProject = (proj: Project) => {
    setProject(proj);
    if (proj.config?.colorScheme) setColorScheme(proj.config.colorScheme);
    setView('builder');
    supabase
      .from('build_stages')
      .select('*')
      .eq('project_id', proj.id)
      .order('sort_order')
      .then(({ data }) => {
        if (data) setStages(data as unknown as BuildStage[]);
      });
    supabase
      .from('app_regions')
      .select('*')
      .eq('project_id', proj.id)
      .order('sort_order')
      .then(({ data }) => {
        if (data) setRegions(data as unknown as AppRegion[]);
      });
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
    return <PromptScreen onStart={handleStart} recentProjectName={recentProjectName} />;
  }

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header
          onNew={handleNew}
          onHome={handleNew}
          onDashboard={() => setView('builder')}
        />
        <ProjectDashboard onOpen={handleOpenProject} onNew={handleNew} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        projectName={project?.name}
        appType={project?.app_type}
        onNew={handleNew}
        onHome={handleNew}
        onDashboard={() => setView('dashboard')}
        onDeploy={() => setDeployOpen(true)}
        onExport={() => setExportOpen(true)}
        onStore={() => setStoreOpen(true)}
        onVersions={() => setVersionsOpen(true)}
        buildComplete={buildComplete}
        showActions
      />

      {/* Builder tabs */}
      <div className="flex items-center gap-1 px-4 py-1.5 border-b border-slate-800 bg-slate-950/50 overflow-x-auto scrollbar-thin">
        {BUILDER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-slate-800 text-slate-100'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          {sidebarOpen ? 'Hide' : 'Show'} sidebar
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar: build pipeline */}
        {sidebarOpen && (
          <div className="w-72 shrink-0 border-r border-slate-800 bg-slate-950/50 flex flex-col max-h-[calc(100vh-120px)] hidden lg:flex">
            <BuildStages stages={stages} activeLog={activeLog} />
          </div>
        )}

        {/* Center: tab content */}
        <div className="flex-1 flex overflow-hidden min-w-0">
          {activeTab === 'design' && (
            <DesignTab
              regions={regions}
              colorScheme={colorScheme}
              appName={project?.name ?? 'My App'}
              onRegionClick={handleRegionClick}
              onColorChange={handleColorChange}
              onAddElement={handleAddElement}
            />
          )}
          {activeTab === 'code' && (
            <CodeViewer
              regions={regions}
              colorScheme={colorScheme}
              appName={project?.name ?? 'My App'}
            />
          )}
          {activeTab === 'database' && (
            <DatabaseTab regions={regions} appName={project?.name ?? 'My App'} />
          )}
          {activeTab === 'test' && (
            <TestPanel regions={regions} appName={project?.name ?? 'My App'} />
          )}
          {activeTab === 'audit' && (
            <AuditPanel
              regions={regions}
              colorScheme={colorScheme}
              platform={project?.platform ?? 'both'}
            />
          )}
          {activeTab === 'deploy' && (
            <DeployTab
              regions={regions}
              stages={stages}
              buildComplete={buildComplete}
              incompleteCount={incompleteRegions.length}
              onDeploy={() => setDeployOpen(true)}
              onExport={() => setExportOpen(true)}
              onStore={() => setStoreOpen(true)}
              onVersions={() => setVersionsOpen(true)}
            />
          )}
        </div>

        {/* Right sidebar: context panel */}
        <div className="w-80 shrink-0 border-l border-slate-800 bg-slate-950/50 flex flex-col max-h-[calc(100vh-120px)] hidden xl:flex">
          <RightSidebar
            activeTab={activeTab}
            regions={regions}
            stages={stages}
            colorScheme={colorScheme}
            platform={project?.platform as Platform}
            appName={project?.name ?? ''}
            appType={project?.app_type ?? 'general'}
            isBuilding={isBuilding}
            buildComplete={buildComplete}
            incompleteCount={incompleteRegions.length}
            onDeploy={() => setDeployOpen(true)}
          />
        </div>
      </div>

      <RegionModal
        region={modalRegion}
        onClose={() => setModalRegion(null)}
        onComplete={handleCompleteRegion}
      />
      <DeployDialog
        open={deployOpen}
        onClose={() => setDeployOpen(false)}
        platform={project?.platform as Platform}
        appName={project?.name ?? ''}
        buildComplete={buildComplete}
      />
      <AppStoreAssets
        open={storeOpen}
        onClose={() => setStoreOpen(false)}
        appName={project?.name ?? ''}
        appType={project?.app_type ?? 'general'}
        colorScheme={colorScheme}
        regions={regions}
      />
      <VersionHistory
        open={versionsOpen}
        onClose={() => setVersionsOpen(false)}
        appName={project?.name ?? ''}
        screenCount={regions.length}
      />
      <ExportPanel
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        regions={regions}
        colorScheme={colorScheme}
        appName={project?.name ?? ''}
      />
    </div>
  );
}

function DesignTab({
  regions,
  colorScheme,
  appName,
  onRegionClick,
  onColorChange,
  onAddElement,
}: {
  regions: AppRegion[];
  colorScheme: ColorScheme;
  appName: string;
  onRegionClick: (r: AppRegion) => void;
  onColorChange: (cs: ColorScheme) => void;
  onAddElement: (regionId: string, el: import('@/types/builder').ScreenElement) => void;
}) {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const selectedRegion = regions.find((r) => r.id === selectedRegionId) ?? regions[0];

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Component library */}
      <div className="w-56 shrink-0 border-r border-slate-800 bg-slate-950/30">
        <ComponentLibrary
          onAdd={(el) => selectedRegion && onAddElement(selectedRegion.id, el)}
        />
      </div>

      {/* Phone preview */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 p-4 min-h-[400px] relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 w-full flex items-center justify-center">
          <PhonePreview
            regions={regions}
            colorScheme={colorScheme}
            appName={appName}
            onRegionClick={onRegionClick}
          />
        </div>
      </div>

      {/* Theme editor + screen flow */}
      <div className="w-64 shrink-0 border-l border-slate-800 bg-slate-950/30 overflow-y-auto scrollbar-thin">
        <div className="border-b border-slate-800">
          <div className="px-4 pt-3 pb-2">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Active Screen</p>
            <select
              value={selectedRegionId ?? ''}
              onChange={(e) => setSelectedRegionId(e.target.value)}
              className="w-full rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 px-2 py-1.5 focus:outline-none"
            >
              {regions.map((r) => (
                <option key={r.id} value={r.id}>{r.region_name}</option>
              ))}
            </select>
          </div>
        </div>
        <ThemeEditor colorScheme={colorScheme} onChange={onColorChange} />
      </div>
    </div>
  );
}

function DatabaseTab({ regions, appName }: { regions: AppRegion[]; appName: string }) {
  const tables = generateSchema(regions, appName);
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin p-6 bg-slate-950/30">
      <div className="flex items-center gap-2 mb-4">
        <DatabaseIcon className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-semibold text-slate-200">Database Schema</h3>
        <span className="text-xs text-slate-500 ml-auto">{tables.length} tables</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {tables.map((table) => (
          <div key={table.name} className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden animate-fade-in-up">
            <div className="px-3 py-2 border-b border-slate-800 bg-slate-800/50 flex items-center gap-2">
              <DatabaseIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-sm font-semibold text-slate-200">{table.name}</span>
            </div>
            <div className="p-2 space-y-1">
              {table.columns.map((col) => (
                <div key={col.name} className="flex items-center justify-between text-xs px-2 py-1 rounded hover:bg-slate-800/50">
                  <span className="text-slate-300 font-mono">{col.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-mono text-[10px]">{col.type}</span>
                    {col.isPrimary && <span className="text-[8px] px-1 rounded bg-amber-500/20 text-amber-400">PK</span>}
                    {col.isForeign && <span className="text-[8px] px-1 rounded bg-cyan-500/20 text-cyan-400">FK</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Generated SQL</h4>
        <div className="rounded-xl border border-slate-800 bg-[#0d1117] p-4 overflow-auto scrollbar-thin">
          <pre className="text-xs font-mono text-slate-300 leading-relaxed">{generateSQL(tables)}</pre>
        </div>
      </div>
    </div>
  );
}

function DeployTab({
  regions,
  stages,
  buildComplete,
  incompleteCount,
  onDeploy,
  onExport,
  onStore,
  onVersions,
}: {
  regions: AppRegion[];
  stages: BuildStage[];
  buildComplete: boolean;
  incompleteCount: number;
  onDeploy: () => void;
  onExport: () => void;
  onStore: () => void;
  onVersions: () => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin p-6 bg-slate-950/30">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <DeployIcon className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-200">Deployment</h3>
        </div>

        <DeployCard
          title="Deploy to Cloud"
          description="Build and deploy your app to preview, staging, or production."
          icon={<Rocket className="w-5 h-5" />}
          onClick={onDeploy}
          disabled={!buildComplete && incompleteCount > 0}
          status={buildComplete ? 'Ready' : `${incompleteCount} pending`}
        />

        <DeployCard
          title="Export Code"
          description="Download source code for React Native, Flutter, Swift, Kotlin, or Web."
          icon={<Code2 className="w-5 h-5" />}
          onClick={onExport}
          status="5 targets"
        />

        <DeployCard
          title="App Store Assets"
          description="Generate app icon, screenshots, description, and keywords for store listing."
          icon={<Store className="w-5 h-5" />}
          onClick={onStore}
          status="Auto-generated"
        />

        <DeployCard
          title="Version History"
          description="View change log and version timeline of your project."
          icon={<GitBranch className="w-5 h-5" />}
          onClick={onVersions}
          status="7 versions"
        />

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-3">Build Summary</h4>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-bold text-slate-100">{regions.length}</p>
              <p className="text-xs text-slate-500">Screens</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">{stages.length}</p>
              <p className="text-xs text-slate-500">Build Steps</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">
                {stages.filter((s) => s.status === 'completed').length}
              </p>
              <p className="text-xs text-slate-500">Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeployCard({
  title,
  description,
  icon,
  onClick,
  disabled,
  status,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  status: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4 text-left hover:border-slate-700 hover:bg-slate-900/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed group animate-fade-in-up"
    >
      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-slate-200">{title}</h4>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <div className="text-right shrink-0">
        <span className="text-xs text-slate-400">{status}</span>
        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all mt-1" />
      </div>
    </button>
  );
}

function RightSidebar({
  activeTab,
  regions,
  stages,
  colorScheme,
  platform,
  appName,
  appType,
  isBuilding,
  buildComplete,
  incompleteCount,
  onDeploy,
}: {
  activeTab: BuilderTab;
  regions: AppRegion[];
  stages: BuildStage[];
  colorScheme: ColorScheme;
  platform: Platform;
  appName: string;
  appType: string;
  isBuilding: boolean;
  buildComplete: boolean;
  incompleteCount: number;
  onDeploy: () => void;
}) {
  if (activeTab === 'audit') {
    return <BuildMetrics regions={regions} stages={stages} />;
  }
  if (activeTab === 'deploy') {
    return (
      <div className="p-4 space-y-3">
        <BuildStatusPanel
          isBuilding={isBuilding}
          buildComplete={buildComplete}
          incompleteCount={incompleteCount}
          platform={platform}
          appName={appName}
          onDeploy={onDeploy}
        />
      </div>
    );
  }
  return (
    <AIChat appName={appName} appType={appType} screenCount={regions.length} />
  );
}

function BuildStatusPanel({
  isBuilding,
  buildComplete,
  incompleteCount,
  platform,
  appName,
  onDeploy,
}: {
  isBuilding: boolean;
  buildComplete: boolean;
  incompleteCount: number;
  platform: Platform;
  appName: string;
  onDeploy: () => void;
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
            onClick={onDeploy}
            disabled={incompleteCount > 0}
            className="w-full rounded-lg py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
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

function generateSchema(regions: AppRegion[], appName: string) {
  const tables: { name: string; columns: { name: string; type: string; isPrimary?: boolean; isForeign?: boolean }[] }[] = [
    {
      name: 'users',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true },
        { name: 'email', type: 'text' },
        { name: 'name', type: 'text' },
        { name: 'created_at', type: 'timestamptz' },
      ],
    },
    {
      name: appName.toLowerCase().replace(/\s+/g, '_') + '_data',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true },
        { name: 'user_id', type: 'uuid', isForeign: true },
        { name: 'title', type: 'text' },
        { name: 'status', type: 'text' },
        { name: 'created_at', type: 'timestamptz' },
      ],
    },
  ];
  const hasAuth = regions.some((r) => r.region_type === 'auth');
  if (!hasAuth) tables.shift();
  return tables;
}

function generateSQL(tables: { name: string; columns: { name: string; type: string; isPrimary?: boolean; isForeign?: boolean }[] }[]): string {
  return tables
    .map(
      (t) =>
        `CREATE TABLE ${t.name} (\n${t.columns
          .map(
            (c) =>
              `  ${c.name} ${c.type}${c.isPrimary ? ' PRIMARY KEY DEFAULT gen_random_uuid()' : ''}${c.isForeign ? ` REFERENCES ${t.name === 'users' ? 'profiles' : 'users'}(id)` : ''}`,
          )
          .join(',\n')}\n);`,
    )
    .join('\n\n');
}
