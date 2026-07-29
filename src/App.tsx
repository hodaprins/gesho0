/* =============================================================================
 * App.tsx — AppForge main application
 *
 * Owns the top-level view router and all shared app state:
 *   - view:           prompt | dashboard | builder
 *   - project:        the currently active Project (or null)
 *   - stages:         BuildStage[] for the active project
 *   - regions:        AppRegion[] (screens) for the active project
 *   - activeTab:      which builder tab is shown
 *   - colorScheme:    active palette
 *   - modal open flags, sidebar/command/search state, build log streaming
 *
 * Sections:
 *   1. Imports
 *   2. Constants & static data (build stages, color schemes)
 *   3. Screen generation helpers
 *   4. Utility helpers
 *   5. App component — state
 *   6. App component — key actions (start, build pipeline, open, new, etc.)
 *   7. App component — keyboard shortcuts
 *   8. App component — render (prompt / dashboard / builder)
 *   9. Builder sub-components (toolbar, sidebar, tab panels)
 *  10. Modal placeholder layer
 * ========================================================================== */

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from 'react';
import { Palette, Code as Code2, Database as DatabaseIcon, FlaskConical, ClipboardCheck, Rocket, Download, Table, Command as CommandIcon, Search, Settings, PanelLeftClose, PanelLeftOpen, Check, Circle, Loader as Loader2, Monitor, Smartphone, Tablet, Plus, Sparkles, ArrowRight, FileCode, Boxes, Layers, Eye, GitBranch, Terminal, ShieldCheck, Globe, Type, Image as ImageIcon, Bell, LayoutTemplate, Droplet, BarChart3, Users, GitPullRequest, Link2, KeyRound, Lock, Activity, MessageSquare, Accessibility, ScanLine, CalendarClock, FileText, Workflow, Flag, Languages, Globe as Globe2, Network, Route, Zap, Gauge, Package, SlidersHorizontal, Repeat2, Diff, Mail, MessageSquareText, Plug, BellRing, ScrollText, Stethoscope, Archive, ListChecks } from 'lucide-react';

import { supabase } from '@/lib/supabase';
import type {
  Project,
  BuildStage,
  AppRegion,
  ScreenSpec,
  ScreenElement,
  ColorScheme,
  BuilderTab,
} from '@/lib/types';
import PromptScreen from '@/components/PromptScreen';
import Header from '@/components/Header';
import ProjectDashboard from '@/components/ProjectDashboard';

/* ===========================================================================
 * 2. Constants & static data
 * ========================================================================= */

type AppView = 'prompt' | 'dashboard' | 'builder';

interface StageDefinition {
  name: string;
  type: string;
  logs: string[];
}

/** The six canonical build stages, in execution order. */
const BUILD_STAGES: StageDefinition[] = [
  {
    name: 'Architecture',
    type: 'architecture',
    logs: [
      'Analyzing prompt and selecting app scaffold…',
      'Choosing navigation pattern (tab bar + modal stack)…',
      'Defining module boundaries and dependency graph…',
      'Architecture blueprint locked. ✓',
    ],
  },
  {
    name: 'UI Components',
    type: 'ui',
    logs: [
      'Generating design tokens from color scheme…',
      'Scaffolding shared components (Button, Card, Input, List)…',
      'Composing screen layouts from element specs…',
      'Theming components with active palette…',
      'UI component library ready. ✓',
    ],
  },
  {
    name: 'API Layer',
    type: 'api',
    logs: [
      'Inferring data entities from screens…',
      'Generating typed API client + endpoints…',
      'Wiring auth + row-level security policies…',
      'API layer generated. ✓',
    ],
  },
  {
    name: 'Database',
    type: 'database',
    logs: [
      'Creating tables and relationships…',
      'Adding indexes for common query paths…',
      'Enabling Row Level Security…',
      'Seeding reference data…',
      'Database schema applied. ✓',
    ],
  },
  {
    name: 'Testing',
    type: 'testing',
    logs: [
      'Generating unit tests for components…',
      'Generating integration tests for API flows…',
      'Running test suite…',
      'All tests passing. ✓',
    ],
  },
  {
    name: 'Deployment',
    type: 'deployment',
    logs: [
      'Bundling production assets…',
      'Uploading to edge network…',
      'Provisioning preview environment…',
      'Deployment ready. ✓',
    ],
  },
];

interface ColorSchemeDefinition {
  id: string;
  name: string;
  scheme: ColorScheme;
  preview: string;
}

/** Four switchable color schemes. */
const COLOR_SCHEMES: ColorSchemeDefinition[] = [
  {
    id: 'emerald',
    name: 'Emerald',
    preview: 'from-emerald-400 to-teal-500',
    scheme: {
      primary: '#10b981',
      secondary: '#14b8a6',
      accent: '#06b6d4',
      background: '#0b1120',
      surface: '#111827',
      text: '#e2e8f0',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    preview: 'from-sky-400 to-blue-500',
    scheme: {
      primary: '#0ea5e9',
      secondary: '#3b82f6',
      accent: '#6366f1',
      background: '#0b1120',
      surface: '#111827',
      text: '#e2e8f0',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    preview: 'from-orange-400 to-rose-500',
    scheme: {
      primary: '#f97316',
      secondary: '#f43f5e',
      accent: '#eab308',
      background: '#1a1025',
      surface: '#241430',
      text: '#f5e9f0',
    },
  },
  {
    id: 'mono',
    name: 'Mono',
    preview: 'from-slate-300 to-slate-500',
    scheme: {
      primary: '#e2e8f0',
      secondary: '#94a3b8',
      accent: '#cbd5e1',
      background: '#0b0f1a',
      surface: '#141a28',
      text: '#e2e8f0',
    },
  },
];

const DEFAULT_COLOR_SCHEME = COLOR_SCHEMES[0];

/* ===========================================================================
 * 3. Screen generation helpers
 * ========================================================================= */

/** Derive a compact app name from the raw prompt. */
function deriveAppName(prompt: string): string {
  const cleaned = prompt.trim().toLowerCase();
  const stop = new Set([
    'a', 'an', 'the', 'app', 'with', 'for', 'and', 'that', 'to', 'of', 'my',
    'your', 'simple', 'beautiful', 'modern', 'simple', 'easy',
  ]);
  const words = cleaned
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !stop.has(w));
  if (words.length === 0) return 'Untitled App';
  const name = words.slice(0, 3).map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
  return name || 'Untitled App';
}

/** Detect an app_type string from the prompt for the Project record. */
function detectAppType(prompt: string, platform: string): string {
  const p = prompt.toLowerCase();
  if (/\b(api|backend|service|webhook|server)\b/.test(p)) return 'api';
  if (platform === 'ios' || platform === 'android' || platform === 'both') return 'mobile';
  if (/\b(dashboard|admin|web|site|portal)\b/.test(p)) return 'web';
  return 'mobile';
}

let elementIdCounter = 0;
function eid(): string {
  elementIdCounter += 1;
  return `el_${elementIdCounter}_${Math.random().toString(36).slice(2, 8)}`;
}

function el(type: string, label: string, icon?: string): ScreenElement {
  return { id: eid(), type, label, icon };
}

/**
 * Generate screen specs from the prompt text by matching keyword signals.
 * Each screen maps 1:1 to an AppRegion. Some screens are intentionally
 * incomplete so the user has something to finish in the builder.
 */
function generateScreens(prompt: string): ScreenSpec[] {
  const p = prompt.toLowerCase();
  const screens: ScreenSpec[] = [];

  // Always include a home/landing screen.
  screens.push({
    name: 'Home',
    regionType: 'home',
    description: 'Primary landing surface with quick actions and summary content.',
    elements: [
      el('header', 'App Header', 'Sparkles'),
      el('search', 'Search', 'Search'),
      el('card', 'Featured Content', 'Boxes'),
      el('list', 'Recent Items', 'List'),
      el('tabbar', 'Bottom Navigation', 'LayoutTemplate'),
    ],
  });

  if (/\b(task|todo|kanban|board|reminder|checklist|habit|streak)\b/.test(p)) {
    screens.push({
      name: 'Tasks Board',
      regionType: 'board',
      description: 'Kanban-style board with draggable cards and status columns.',
      elements: [
        el('header', 'Board Title', 'Layers'),
        el('column', 'To Do', 'Circle'),
        el('column', 'In Progress', 'Loader2'),
        el('column', 'Done', 'Check'),
        el('fab', 'Add Task', 'Plus'),
      ],
    });
    screens.push({
      name: 'Task Detail',
      regionType: 'detail',
      description: 'Single task with subtasks, due date, and notes.',
      elements: [
        el('header', 'Task Title', 'FileText'),
        el('checkbox', 'Subtasks', 'CheckSquare'),
        el('datepicker', 'Due Date', 'CalendarClock'),
        el('textarea', 'Notes', 'FileText'),
      ],
      intentionallyIncomplete: true,
    });
  }

  if (/\b(shop|store|commerce|cart|product|checkout|catalog|buy)\b/.test(p)) {
    screens.push({
      name: 'Product Catalog',
      regionType: 'catalog',
      description: 'Grid of products with search, filters, and category chips.',
      elements: [
        el('search', 'Search Products', 'Search'),
        el('chips', 'Categories', 'Boxes'),
        el('grid', 'Product Grid', 'LayoutGrid'),
        el('tabbar', 'Bottom Navigation', 'LayoutTemplate'),
      ],
    });
    screens.push({
      name: 'Cart & Checkout',
      regionType: 'checkout',
      description: 'Shopping cart with line items and a one-tap checkout flow.',
      elements: [
        el('header', 'Your Cart', 'ShoppingCart'),
        el('list', 'Cart Items', 'List'),
        el('summary', 'Order Summary', 'Receipt'),
        el('button', 'Checkout', 'CreditCard'),
      ],
      intentionallyIncomplete: true,
    });
  }

  if (/\b(social|feed|post|like|comment|follow|timeline|community)\b/.test(p)) {
    screens.push({
      name: 'Feed',
      regionType: 'feed',
      description: 'Infinite-scroll timeline of posts with likes and comments.',
      elements: [
        el('header', 'Feed', 'MessageCircle'),
        el('stories', 'Stories', 'Circle'),
        el('feed', 'Post List', 'List'),
        el('fab', 'New Post', 'Plus'),
        el('tabbar', 'Bottom Navigation', 'LayoutTemplate'),
      ],
    });
    screens.push({
      name: 'Profile',
      regionType: 'profile',
      description: 'User profile with avatar, stats, and follow button.',
      elements: [
        el('avatar', 'Avatar', 'User'),
        el('stats', 'Stats Row', 'BarChart3'),
        el('button', 'Follow', 'UserPlus'),
        el('grid', 'Posts Grid', 'LayoutGrid'),
      ],
    });
  }

  if (/\b(fitness|workout|exercise|run|gym|calorie|health|step)\b/.test(p)) {
    screens.push({
      name: 'Workout Tracker',
      regionType: 'tracker',
      description: 'Today’s workout with exercise logging and rest timers.',
      elements: [
        el('header', 'Today’s Workout', 'Dumbbell'),
        el('ring', 'Progress Ring', 'Activity'),
        el('list', 'Exercises', 'List'),
        el('timer', 'Rest Timer', 'Timer'),
      ],
    });
    screens.push({
      name: 'Progress Charts',
      regionType: 'charts',
      description: 'Weekly progress charts and goal tracking.',
      elements: [
        el('header', 'Your Progress', 'BarChart3'),
        el('chart', 'Weekly Chart', 'BarChart3'),
        el('stat', 'Streak', 'Flame'),
        el('goal', 'Goal Setting', 'Target'),
      ],
      intentionallyIncomplete: true,
    });
  }

  if (/\b(finance|budget|expense|money|spending|account|transaction)\b/.test(p)) {
    screens.push({
      name: 'Dashboard',
      regionType: 'dashboard',
      description: 'Finance overview with account balances and spending insights.',
      elements: [
        el('header', 'Overview', 'LayoutDashboard'),
        el('stat', 'Total Balance', 'Wallet'),
        el('chart', 'Spending Chart', 'BarChart3'),
        el('list', 'Recent Transactions', 'List'),
      ],
    });
    screens.push({
      name: 'Budgets',
      regionType: 'budgets',
      description: 'Budget categories with progress bars and alerts.',
      elements: [
        el('header', 'Budgets', 'PieChart'),
        el('list', 'Category List', 'List'),
        el('progress', 'Progress Bars', 'ProgressBar'),
      ],
      intentionallyIncomplete: true,
    });
  }

  if (/\b(recipe|cook|food|meal|ingredient|kitchen)\b/.test(p)) {
    screens.push({
      name: 'Recipe Search',
      regionType: 'search',
      description: 'Search recipes by ingredient with curated collections.',
      elements: [
        el('search', 'Search by Ingredient', 'Search'),
        el('chips', 'Collections', 'Boxes'),
        el('grid', 'Recipe Grid', 'LayoutGrid'),
      ],
    });
    screens.push({
      name: 'Cooking Mode',
      regionType: 'cooking',
      description: 'Step-by-step cooking mode with timers and shopping list.',
      elements: [
        el('header', 'Step 1 of 6', 'ChefHat'),
        el('image', 'Step Image', 'Image'),
        el('timer', 'Step Timer', 'Timer'),
        el('button', 'Next Step', 'ArrowRight'),
      ],
      intentionallyIncomplete: true,
    });
  }

  if (/\b(chat|message|dm|dm|conversation|inbox)\b/.test(p)) {
    screens.push({
      name: 'Inbox',
      regionType: 'inbox',
      description: 'Conversation list with unread badges and previews.',
      elements: [
        el('search', 'Search Messages', 'Search'),
        el('list', 'Conversation List', 'List'),
        el('fab', 'New Message', 'Plus'),
      ],
    });
    screens.push({
      name: 'Conversation',
      regionType: 'conversation',
      description: 'Chat thread with bubbles, input, and attachments.',
      elements: [
        el('header', 'Contact Name', 'User'),
        el('feed', 'Message Bubbles', 'MessageCircle'),
        el('input', 'Message Input', 'Send'),
      ],
    });
  }

  // Always include a settings screen as a finishing touch.
  screens.push({
    name: 'Settings',
    regionType: 'settings',
    description: 'Preferences, account, and app configuration.',
    elements: [
      el('header', 'Settings', 'Settings'),
      el('row', 'Account', 'User'),
      el('row', 'Notifications', 'Bell'),
      el('row', 'Appearance', 'Palette'),
      el('row', 'About', 'Info'),
    ],
  });

  // If nothing domain-specific matched, add a generic detail screen.
  if (screens.length === 2) {
    screens.splice(1, 0, {
      name: 'Detail',
      regionType: 'detail',
      description: 'Primary content detail view for the app’s core entity.',
      elements: [
        el('header', 'Detail', 'FileText'),
        el('image', 'Hero Image', 'Image'),
        el('body', 'Content Body', 'FileText'),
        el('button', 'Primary Action', 'ArrowRight'),
      ],
      intentionallyIncomplete: true,
    });
  }

  return screens;
}

/* ===========================================================================
 * 4. Utility helpers
 * ========================================================================= */

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Apply the active color scheme to CSS custom properties on :root. */
function applyColorScheme(scheme: ColorScheme): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--color-primary', scheme.primary);
  root.style.setProperty('--color-secondary', scheme.secondary);
  root.style.setProperty('--color-accent', scheme.accent);
  root.style.setProperty('--color-background', scheme.background);
  root.style.setProperty('--color-surface', scheme.surface);
  root.style.setProperty('--color-text', scheme.text);
}

/* ===========================================================================
 * 5–8. App component
 * ========================================================================= */

export default function App() {
  /* ---- View & core entity state ---- */
  const [view, setView] = useState<AppView>('prompt');
  const [project, setProject] = useState<Project | null>(null);
  const [stages, setStages] = useState<BuildStage[]>([]);
  const [regions, setRegions] = useState<AppRegion[]>([]);
  const [activeTab, setActiveTab] = useState<BuilderTab>('design');

  /* ---- Theming ---- */
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    DEFAULT_COLOR_SCHEME.scheme
  );
  const [activeSchemeId, setActiveSchemeId] = useState<string>(
    DEFAULT_COLOR_SCHEME.id
  );

  /* ---- Builder chrome ---- */
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [devicePreview, setDevicePreview] = useState<'mobile' | 'tablet' | 'desktop'>(
    'mobile'
  );

  /* ---- Command palette & search ---- */
  const [commandOpen, setCommandOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  /* ---- Build streaming ---- */
  const [activeLog, setActiveLog] = useState<string>('');
  const [building, setBuilding] = useState(false);
  const buildTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---- Dashboard recent-project hint ---- */
  const [recentProjectName, setRecentProjectName] = useState<string | undefined>();

  /* ---- Misc loading/error for project open ---- */
  const [openError, setOpenError] = useState<string | null>(null);

  /* ---- Modal open flags ---- */
  // Build tooling
  const [exportOpen, setExportOpen] = useState(false);
  const [deployOpen, setDeployOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);
  const [versionsOpen, setVersionsOpen] = useState(false);
  // Design
  const [screenTemplatesOpen, setScreenTemplatesOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [typographyOpen, setTypographyOpen] = useState(false);
  const [assetsOpen, setAssetsOpen] = useState(false);
  const [designTokensOpen, setDesignTokensOpen] = useState(false);
  const [componentInspectorOpen, setComponentInspectorOpen] = useState(false);
  // Engagement / distribution
  const [pushNotificationsOpen, setPushNotificationsOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [deepLinksOpen, setDeepLinksOpen] = useState(false);
  const [analyticsEventsOpen, setAnalyticsEventsOpen] = useState(false);
  // Data / backend
  const [apiExplorerOpen, setApiExplorerOpen] = useState(false);
  const [seedDataOpen, setSeedDataOpen] = useState(false);
  const [dataExplorerOpen, setDataExplorerOpen] = useState(false);
  const [envVarsOpen, setEnvVarsOpen] = useState(false);
  const [webhooksOpen, setWebhooksOpen] = useState(false);
  const [scheduledTasksOpen, setScheduledTasksOpen] = useState(false);
  const [cacheManagerOpen, setCacheManagerOpen] = useState(false);
  // Quality / ops
  const [errorMonitorOpen, setErrorMonitorOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [a11yCheckerOpen, setA11yCheckerOpen] = useState(false);
  const [securityScannerOpen, setSecurityScannerOpen] = useState(false);
  const [auditTrailOpen, setAuditTrailOpen] = useState(false);
  const [healthChecksOpen, setHealthChecksOpen] = useState(false);
  const [backupsOpen, setBackupsOpen] = useState(false);
  const [logViewerOpen, setLogViewerOpen] = useState(false);
  // Team / release
  const [teamManagementOpen, setTeamManagementOpen] = useState(false);
  const [releaseNotesOpen, setReleaseNotesOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [projectSettingsOpen, setProjectSettingsOpen] = useState(false);
  // Experimentation
  const [abTestingOpen, setAbTestingOpen] = useState(false);
  const [aBTestingOpen, setABTestingOpen] = useState(false); // alias variant
  const [featureFlagsOpen, setFeatureFlagsOpen] = useState(false);
  const [localizationOpen, setLocalizationOpen] = useState(false);
  const [navGraphOpen, setNavGraphOpen] = useState(false);
  const [userJourneyOpen, setUserJourneyOpen] = useState(false);
  // Devops / infra
  const [ciPipelineOpen, setCIPipelineOpen] = useState(false);
  const [customDomainsOpen, setCustomDomainsOpen] = useState(false);
  const [oauthProvidersOpen, setOAuthProvidersOpen] = useState(false);
  const [rateLimitingOpen, setRateLimitingOpen] = useState(false);
  const [dependenciesOpen, setDependenciesOpen] = useState(false);
  const [appConfigOpen, setAppConfigOpen] = useState(false);
  const [integrationsOpen, setIntegrationsOpen] = useState(false);
  // Misc tools
  const [bulkActionsOpen, setBulkActionsOpen] = useState(false);
  const [codeDiffOpen, setCodeDiffOpen] = useState(false);
  const [apiKeysOpen, setApiKeysOpen] = useState(false);
  const [smsConfigOpen, setSmsConfigOpen] = useState(false);
  const [webhookTesterOpen, setWebhookTesterOpen] = useState(false);
  const [formBuilderOpen, setFormBuilderOpen] = useState(false);
  // Global
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  /* -------------------------------------------------------------------------
   * 6. Key actions
   * ----------------------------------------------------------------------- */

  /** Start a brand-new build from a prompt + platform. */
  const handleStart = useCallback(
    async (prompt: string, platform: string) => {
      const appType = detectAppType(prompt, platform);
      const name = deriveAppName(prompt);
      const scheme = DEFAULT_COLOR_SCHEME.scheme;

      // 1. Insert the project row.
      const { data: projRow, error: projErr } = await supabase
        .from('projects')
        .insert({
          name,
          prompt,
          platform,
          app_type: appType,
          status: 'building',
          config: { colorScheme: scheme },
        })
        .select()
        .single();

      if (projErr || !projRow) {
        throw new Error(projErr?.message ?? 'Failed to create project.');
      }

      const newProject = projRow as Project;
      setProject(newProject);
      setRecentProjectName(newProject.name);
      setColorScheme(scheme);
      setActiveSchemeId(DEFAULT_COLOR_SCHEME.id);

      // 2. Insert build stages.
      const stageRows = BUILD_STAGES.map((s, i) => ({
        project_id: newProject.id,
        stage_name: s.name,
        stage_type: s.type,
        status: 'pending' as const,
        logs: '',
        sort_order: i,
      }));

      const { data: insertedStages, error: stagesErr } = await supabase
        .from('build_stages')
        .insert(stageRows)
        .select();

      if (stagesErr || !insertedStages) {
        throw new Error(stagesErr?.message ?? 'Failed to create build stages.');
      }
      setStages(insertedStages as BuildStage[]);

      // 3. Generate screens and insert app regions.
      const screens = generateScreens(prompt);
      const regionRows = screens.map((spec, i) => ({
        project_id: newProject.id,
        region_name: spec.name,
        region_type: spec.regionType,
        status: spec.intentionallyIncomplete ? 'incomplete' : 'complete',
        spec,
        description: spec.description,
        sort_order: i,
      }));

      const { data: insertedRegions, error: regionsErr } = await supabase
        .from('app_regions')
        .insert(regionRows)
        .select();

      if (regionsErr || !insertedRegions) {
        throw new Error(regionsErr?.message ?? 'Failed to create app regions.');
      }
      const regionList = insertedRegions as AppRegion[];
      setRegions(regionList);
      setSelectedRegionId(regionList[0]?.id ?? null);

      // 4. Move to the builder and kick off the pipeline.
      setView('builder');
      setActiveTab('design');
      setBuilding(true);
      void runBuildPipeline(newProject.id, appType);
    },
    []
  );

  /**
   * Sequentially walk each build stage, updating its status in Supabase and
   * in local state, with simulated log streaming for a live-build feel.
   */
  const runBuildPipeline = useCallback(
    async (projectId: string, _appType: string) => {
      for (let i = 0; i < BUILD_STAGES.length; i++) {
        const def = BUILD_STAGES[i];

        // Mark in_progress.
        setActiveLog(`${def.name}: starting…`);
        const { data: inProg } = await supabase
          .from('build_stages')
          .update({ status: 'in_progress' })
          .eq('project_id', projectId)
          .eq('stage_type', def.type)
          .select()
          .single();

        setStages((prev) =>
          prev.map((s) =>
            s.stage_type === def.type && s.project_id === projectId
              ? { ...(inProg as BuildStage ?? s), status: 'in_progress' }
              : s
          )
        );

        // Stream logs line by line.
        let accumulated = '';
        for (const line of def.logs) {
          accumulated += (accumulated ? '\n' : '') + line;
          setActiveLog(`${def.name}\n${accumulated}`);
          await sleep(420 + Math.random() * 480);
        }

        // Mark completed.
        const { data: done } = await supabase
          .from('build_stages')
          .update({ status: 'completed', logs: accumulated })
          .eq('project_id', projectId)
          .eq('stage_type', def.type)
          .select()
          .single();

        setStages((prev) =>
          prev.map((s) =>
            s.stage_type === def.type && s.project_id === projectId
              ? { ...(done as BuildStage ?? s), status: 'completed', logs: accumulated }
              : s
          )
        );
      }

      // Flip the project to ready.
      await supabase
        .from('projects')
        .update({ status: 'ready', updated_at: new Date().toISOString() })
        .eq('id', projectId);

      setProject((prev) =>
        prev && prev.id === projectId
          ? { ...prev, status: 'ready', updated_at: new Date().toISOString() }
          : prev
      );
      setBuilding(false);
      setActiveLog('');
    },
    []
  );

  /** Mark a region (screen) as complete. */
  const handleCompleteRegion = useCallback(
    async (regionId: string) => {
      const region = regions.find((r) => r.id === regionId);
      if (!region) return;

      setRegions((prev) =>
        prev.map((r) => (r.id === regionId ? { ...r, status: 'complete' } : r))
      );

      await supabase
        .from('app_regions')
        .update({ status: 'complete' })
        .eq('id', regionId);
    },
    [regions]
  );

  /** Load an existing project (from the dashboard) + its stages and regions. */
  const handleOpenProject = useCallback(async (proj: Project) => {
    setOpenError(null);
    setProject(proj);
    setRecentProjectName(proj.name);
    setColorScheme(proj.config?.colorScheme ?? DEFAULT_COLOR_SCHEME.scheme);

    // Resolve matching scheme id.
    const matched = COLOR_SCHEMES.find(
      (cs) =>
        cs.scheme.primary === proj.config?.colorScheme?.primary
    );
    setActiveSchemeId(matched?.id ?? DEFAULT_COLOR_SCHEME.id);

    try {
      const [stagesRes, regionsRes] = await Promise.all([
        supabase
          .from('build_stages')
          .select('*')
          .eq('project_id', proj.id)
          .order('sort_order', { ascending: true }),
        supabase
          .from('app_regions')
          .select('*')
          .eq('project_id', proj.id)
          .order('sort_order', { ascending: true }),
      ]);

      if (stagesRes.error) throw stagesRes.error;
      if (regionsRes.error) throw regionsRes.error;

      setStages((stagesRes.data ?? []) as BuildStage[]);
      const regionList = (regionsRes.data ?? []) as AppRegion[];
      setRegions(regionList);
      setSelectedRegionId(regionList[0]?.id ?? null);

      const allDone =
        regionList.length > 0 && regionList.every((r) => r.status === 'complete');
      setBuilding(!allDone && proj.status === 'building');

      setActiveTab('design');
      setView('builder');
    } catch (err) {
      setOpenError(
        err instanceof Error ? err.message : 'Failed to load project data.'
      );
      setView('builder');
    }
  }, []);

  /** Reset everything and go back to the prompt screen. */
  const handleNew = useCallback(() => {
    if (buildTimer.current) {
      clearTimeout(buildTimer.current);
      buildTimer.current = null;
    }
    setProject(null);
    setStages([]);
    setRegions([]);
    setSelectedRegionId(null);
    setActiveTab('design');
    setActiveLog('');
    setBuilding(false);
    setOpenError(null);
    setColorScheme(DEFAULT_COLOR_SCHEME.scheme);
    setActiveSchemeId(DEFAULT_COLOR_SCHEME.id);
    setView('prompt');
  }, []);

  const handleHome = useCallback(() => {
    if (project) setView('builder');
    else setView('prompt');
  }, [project]);

  const handleDashboard = useCallback(() => setView('dashboard'), []);

  /** Switch the active color scheme and persist it on the project. */
  const handleColorSchemeChange = useCallback(
    (def: ColorSchemeDefinition) => {
      setColorScheme(def.scheme);
      setActiveSchemeId(def.id);
      applyColorScheme(def.scheme);
      if (project) {
        void supabase
          .from('projects')
          .update({ config: { colorScheme: def.scheme } })
          .eq('id', project.id);
        setProject((prev) =>
          prev ? { ...prev, config: { colorScheme: def.scheme } } : prev
        );
      }
    },
    [project]
  );

  /* -------------------------------------------------------------------------
   * 7. Keyboard shortcuts
   * ----------------------------------------------------------------------- */

  useEffect(() => {
    applyColorScheme(colorScheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      // ⌘K — command palette
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((o) => !o);
        return;
      }
      // ⌘/ — search
      if (mod && e.key === '/') {
        e.preventDefault();
        setSearchOpen((o) => !o);
        return;
      }
      // ⌘B — toggle sidebar
      if (mod && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setSidebarOpen((o) => !o);
        return;
      }
      // ⌘Z — undo (placeholder)
      if (mod && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        return;
      }
      // ⌘⇧Z — redo (placeholder)
      if (mod && e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        return;
      }
      // ⌘E — export
      if (mod && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setExportOpen(true);
        return;
      }
      // ⌘⇧D — deploy
      if (mod && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setDeployOpen(true);
        return;
      }
      // ⌘⇧S — store
      if (mod && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setStoreOpen(true);
        return;
      }

      // ? — shortcuts help (only when not typing in a field)
      const target = e.target as HTMLElement | null;
      const typing =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable;
      if (!mod && !typing && e.key === '?') {
        e.preventDefault();
        setShortcutsOpen(true);
        return;
      }

      // 1–6 — switch tabs (only in builder view, not while typing)
      if (!mod && !typing && view === 'builder' && /^[1-6]$/.test(e.key)) {
        e.preventDefault();
        const tabs: BuilderTab[] = ['design', 'code', 'database', 'test', 'audit', 'deploy'];
        setActiveTab(tabs[Number(e.key) - 1]);
        return;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [view]);

  // Cleanup any pending build timer on unmount.
  useEffect(() => {
    return () => {
      if (buildTimer.current) clearTimeout(buildTimer.current);
    };
  }, []);

  /* -------------------------------------------------------------------------
   * 8. Render
   * ----------------------------------------------------------------------- */

  const buildComplete =
    stages.length > 0 && stages.every((s) => s.status === 'completed');

  /* ---- Prompt view ---- */
  if (view === 'prompt') {
    return (
      <>
        <PromptScreen onStart={handleStart} recentProjectName={recentProjectName} />
        <ModalLayer
          modals={[
            { open: settingsOpen, onClose: () => setSettingsOpen(false), title: 'Settings' },
            { open: shortcutsOpen, onClose: () => setShortcutsOpen(false), title: 'Keyboard shortcuts' },
            { open: commandOpen, onClose: () => setCommandOpen(false), title: 'Command palette' },
            { open: searchOpen, onClose: () => setSearchOpen(false), title: 'Search' },
          ]}
        />
      </>
    );
  }

  /* ---- Dashboard view ---- */
  if (view === 'dashboard') {
    return (
      <>
        <Header
          onNew={handleNew}
          onHome={handleHome}
          onDashboard={handleDashboard}
          showActions={false}
        />
        <ProjectDashboard onOpen={handleOpenProject} onNew={handleNew} />
        <ModalLayer
          modals={[
            { open: settingsOpen, onClose: () => setSettingsOpen(false), title: 'Settings' },
            { open: shortcutsOpen, onClose: () => setShortcutsOpen(false), title: 'Keyboard shortcuts' },
            { open: commandOpen, onClose: () => setCommandOpen(false), title: 'Command palette' },
            { open: searchOpen, onClose: () => setSearchOpen(false), title: 'Search' },
          ]}
        />
      </>
    );
  }

  /* ---- Builder view ---- */
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Header
        projectName={project?.name}
        appType={project?.app_type}
        onNew={handleNew}
        onHome={handleHome}
        onDashboard={handleDashboard}
        onDeploy={() => setDeployOpen(true)}
        onExport={() => setExportOpen(true)}
        onStore={() => setStoreOpen(true)}
        onVersions={() => setVersionsOpen(true)}
        buildComplete={buildComplete}
        showActions
      />

      {openError && (
        <div className="border-b border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-300">
          {openError}
        </div>
      )}

      <BuilderToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        onCommand={() => setCommandOpen(true)}
        onSearch={() => setSearchOpen(true)}
        onSettings={() => setSettingsOpen(true)}
        buildComplete={buildComplete}
        building={building}
      />

      <div className="flex flex-1 overflow-hidden">
        <BuilderSidebar
          open={sidebarOpen}
          regions={regions}
          selectedRegionId={selectedRegionId}
          onSelect={setSelectedRegionId}
          onComplete={handleCompleteRegion}
          onAddScreen={() => setScreenTemplatesOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <BuilderContent
            activeTab={activeTab}
            project={project}
            stages={stages}
            regions={regions}
            selectedRegionId={selectedRegionId}
            onSelectRegion={setSelectedRegionId}
            onCompleteRegion={handleCompleteRegion}
            colorScheme={colorScheme}
            activeSchemeId={activeSchemeId}
            onSchemeChange={handleColorSchemeChange}
            devicePreview={devicePreview}
            onDeviceChange={setDevicePreview}
            onOpenColorPicker={() => setColorPickerOpen(true)}
            onOpenTypography={() => setTypographyOpen(true)}
            onOpenAssets={() => setAssetsOpen(true)}
            onOpenDesignTokens={() => setDesignTokensOpen(true)}
            onOpenApiExplorer={() => setApiExplorerOpen(true)}
            onOpenSeedData={() => setSeedDataOpen(true)}
            onOpenDataExplorer={() => setDataExplorerOpen(true)}
            onOpenDeploy={() => setDeployOpen(true)}
            onOpenExport={() => setExportOpen(true)}
            building={building}
            activeLog={activeLog}
          />
        </main>
      </div>

      {/* ---- Full modal layer ---- */}
      <ModalLayer
        modals={[
          // Build tooling
          { open: exportOpen, onClose: () => setExportOpen(false), title: 'Export' },
          { open: deployOpen, onClose: () => setDeployOpen(false), title: 'Deploy' },
          { open: storeOpen, onClose: () => setStoreOpen(false), title: 'Store assets' },
          { open: versionsOpen, onClose: () => setVersionsOpen(false), title: 'Version history' },
          // Design
          { open: screenTemplatesOpen, onClose: () => setScreenTemplatesOpen(false), title: 'Screen templates' },
          { open: colorPickerOpen, onClose: () => setColorPickerOpen(false), title: 'Color picker' },
          { open: typographyOpen, onClose: () => setTypographyOpen(false), title: 'Typography' },
          { open: assetsOpen, onClose: () => setAssetsOpen(false), title: 'Assets' },
          { open: designTokensOpen, onClose: () => setDesignTokensOpen(false), title: 'Design tokens' },
          { open: componentInspectorOpen, onClose: () => setComponentInspectorOpen(false), title: 'Component inspector' },
          // Engagement / distribution
          { open: pushNotificationsOpen, onClose: () => setPushNotificationsOpen(false), title: 'Push notifications' },
          { open: onboardingOpen, onClose: () => setOnboardingOpen(false), title: 'Onboarding' },
          { open: deepLinksOpen, onClose: () => setDeepLinksOpen(false), title: 'Deep links' },
          { open: analyticsEventsOpen, onClose: () => setAnalyticsEventsOpen(false), title: 'Analytics events' },
          // Data / backend
          { open: apiExplorerOpen, onClose: () => setApiExplorerOpen(false), title: 'API explorer' },
          { open: seedDataOpen, onClose: () => setSeedDataOpen(false), title: 'Seed data' },
          { open: dataExplorerOpen, onClose: () => setDataExplorerOpen(false), title: 'Data explorer' },
          { open: envVarsOpen, onClose: () => setEnvVarsOpen(false), title: 'Environment variables' },
          { open: webhooksOpen, onClose: () => setWebhooksOpen(false), title: 'Webhooks' },
          { open: scheduledTasksOpen, onClose: () => setScheduledTasksOpen(false), title: 'Scheduled tasks' },
          { open: cacheManagerOpen, onClose: () => setCacheManagerOpen(false), title: 'Cache manager' },
          // Quality / ops
          { open: errorMonitorOpen, onClose: () => setErrorMonitorOpen(false), title: 'Error monitor' },
          { open: commentsOpen, onClose: () => setCommentsOpen(false), title: 'Comments' },
          { open: a11yCheckerOpen, onClose: () => setA11yCheckerOpen(false), title: 'Accessibility checker' },
          { open: securityScannerOpen, onClose: () => setSecurityScannerOpen(false), title: 'Security scanner' },
          { open: auditTrailOpen, onClose: () => setAuditTrailOpen(false), title: 'Audit trail' },
          { open: healthChecksOpen, onClose: () => setHealthChecksOpen(false), title: 'Health checks' },
          { open: backupsOpen, onClose: () => setBackupsOpen(false), title: 'Backups' },
          { open: logViewerOpen, onClose: () => setLogViewerOpen(false), title: 'Log viewer' },
          // Team / release
          { open: teamManagementOpen, onClose: () => setTeamManagementOpen(false), title: 'Team management' },
          { open: releaseNotesOpen, onClose: () => setReleaseNotesOpen(false), title: 'Release notes' },
          { open: notificationsOpen, onClose: () => setNotificationsOpen(false), title: 'Notifications' },
          { open: projectSettingsOpen, onClose: () => setProjectSettingsOpen(false), title: 'Project settings' },
          // Experimentation
          { open: abTestingOpen, onClose: () => setAbTestingOpen(false), title: 'A/B testing' },
          { open: aBTestingOpen, onClose: () => setABTestingOpen(false), title: 'A/B testing' },
          { open: featureFlagsOpen, onClose: () => setFeatureFlagsOpen(false), title: 'Feature flags' },
          { open: localizationOpen, onClose: () => setLocalizationOpen(false), title: 'Localization' },
          { open: navGraphOpen, onClose: () => setNavGraphOpen(false), title: 'Navigation graph' },
          { open: userJourneyOpen, onClose: () => setUserJourneyOpen(false), title: 'User journey' },
          // Devops / infra
          { open: ciPipelineOpen, onClose: () => setCIPipelineOpen(false), title: 'CI pipeline' },
          { open: customDomainsOpen, onClose: () => setCustomDomainsOpen(false), title: 'Custom domains' },
          { open: oauthProvidersOpen, onClose: () => setOAuthProvidersOpen(false), title: 'OAuth providers' },
          { open: rateLimitingOpen, onClose: () => setRateLimitingOpen(false), title: 'Rate limiting' },
          { open: dependenciesOpen, onClose: () => setDependenciesOpen(false), title: 'Dependencies' },
          { open: appConfigOpen, onClose: () => setAppConfigOpen(false), title: 'App config' },
          { open: integrationsOpen, onClose: () => setIntegrationsOpen(false), title: 'Integrations' },
          // Misc tools
          { open: bulkActionsOpen, onClose: () => setBulkActionsOpen(false), title: 'Bulk actions' },
          { open: codeDiffOpen, onClose: () => setCodeDiffOpen(false), title: 'Code diff' },
          { open: apiKeysOpen, onClose: () => setApiKeysOpen(false), title: 'API keys' },
          { open: smsConfigOpen, onClose: () => setSmsConfigOpen(false), title: 'SMS config' },
          { open: webhookTesterOpen, onClose: () => setWebhookTesterOpen(false), title: 'Webhook tester' },
          { open: formBuilderOpen, onClose: () => setFormBuilderOpen(false), title: 'Form builder' },
          // Global
          { open: settingsOpen, onClose: () => setSettingsOpen(false), title: 'Settings' },
          { open: shortcutsOpen, onClose: () => setShortcutsOpen(false), title: 'Keyboard shortcuts' },
          { open: commandOpen, onClose: () => setCommandOpen(false), title: 'Command palette' },
          { open: searchOpen, onClose: () => setSearchOpen(false), title: 'Search' },
        ]}
      />
    </div>
  );
}

/* ===========================================================================
 * 9. Builder sub-components
 * ========================================================================= */

interface BuilderToolbarProps {
  activeTab: BuilderTab;
  onTabChange: (tab: BuilderTab) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onCommand: () => void;
  onSearch: () => void;
  onSettings: () => void;
  buildComplete: boolean;
  building: boolean;
}

const TAB_DEFS: { id: BuilderTab; label: string; icon: typeof Palette }[] = [
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'code', label: 'Code', icon: Code2 },
  { id: 'database', label: 'Database', icon: DatabaseIcon },
  { id: 'test', label: 'Test', icon: FlaskConical },
  { id: 'audit', label: 'Audit', icon: ClipboardCheck },
  { id: 'deploy', label: 'Deploy', icon: Rocket },
];

function BuilderToolbar({
  activeTab,
  onTabChange,
  sidebarOpen,
  onToggleSidebar,
  onCommand,
  onSearch,
  onSettings,
  buildComplete,
  building,
}: BuilderToolbarProps) {
  return (
    <div className="sticky top-16 z-40 flex items-center justify-between gap-2 border-b border-slate-800 bg-slate-900/80 px-3 py-2 backdrop-blur">
      {/* Left: tabs */}
      <div className="flex items-center gap-1">
        {TAB_DEFS.map((tab, i) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              title={`${tab.label} (${i + 1})`}
              className={[
                'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition',
                active
                  ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200',
              ].join(' ')}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right: build status + utilities */}
      <div className="flex items-center gap-1.5">
        {building && (
          <span className="mr-1 hidden items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300 ring-1 ring-amber-500/30 sm:inline-flex">
            <Loader2 className="h-3 w-3 animate-spin" />
            Building…
          </span>
        )}
        {buildComplete && !building && (
          <span className="mr-1 hidden items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/30 sm:inline-flex">
            <Check className="h-3 w-3" />
            Build ready
          </span>
        )}

        <button
          onClick={onCommand}
          title="Command palette (⌘K)"
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          <CommandIcon className="h-3.5 w-3.5" />
          <kbd className="hidden text-[10px] text-slate-500 sm:inline">⌘K</kbd>
        </button>
        <button
          onClick={onSearch}
          title="Search (⌘/)"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <Search className="h-4 w-4" />
        </button>
        <button
          onClick={onSettings}
          title="Settings"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <Settings className="h-4 w-4" />
        </button>
        <button
          onClick={onToggleSidebar}
          title="Toggle sidebar (⌘B)"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          {sidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

interface BuilderSidebarProps {
  open: boolean;
  regions: AppRegion[];
  selectedRegionId: string | null;
  onSelect: (id: string) => void;
  onComplete: (id: string) => void;
  onAddScreen: () => void;
}

function BuilderSidebar({
  open,
  regions,
  selectedRegionId,
  onSelect,
  onComplete,
  onAddScreen,
}: BuilderSidebarProps) {
  if (!open) return null;

  const incompleteCount = regions.filter((r) => r.status === 'incomplete').length;

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900/40">
      <div className="flex items-center justify-between px-4 pb-2 pt-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Layers className="h-3.5 w-3.5" />
          Screens
        </div>
        <button
          onClick={onAddScreen}
          title="Add screen"
          className="rounded-md p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {regions.length === 0 ? (
        <div className="px-4 py-8 text-center text-xs text-slate-600">
          No screens yet. Start a build to generate them.
        </div>
      ) : (
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-4">
          {regions.map((region) => {
            const active = region.id === selectedRegionId;
            const incomplete = region.status === 'incomplete';
            return (
              <button
                key={region.id}
                onClick={() => onSelect(region.id)}
                className={[
                  'group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition',
                  active
                    ? 'bg-slate-800 text-white ring-1 ring-slate-700'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200',
                ].join(' ')}
              >
                {incomplete ? (
                  <Circle className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                ) : (
                  <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                )}
                <span className="flex-1 truncate">{region.region_name}</span>
                {incomplete && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onComplete(region.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        onComplete(region.id);
                      }
                    }}
                    title="Mark complete"
                    className="rounded p-0.5 text-slate-500 opacity-0 transition group-hover:opacity-100 hover:text-emerald-400"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      )}

      {incompleteCount > 0 && (
        <div className="border-t border-slate-800 px-4 py-3 text-xs text-slate-500">
          {incompleteCount} screen{incompleteCount === 1 ? '' : 's'} need
          {incompleteCount === 1 ? 's' : ''} finishing
        </div>
      )}
    </aside>
  );
}

/* ---- Builder content router ---- */

interface BuilderContentProps {
  activeTab: BuilderTab;
  project: Project | null;
  stages: BuildStage[];
  regions: AppRegion[];
  selectedRegionId: string | null;
  onSelectRegion: (id: string) => void;
  onCompleteRegion: (id: string) => void;
  colorScheme: ColorScheme;
  activeSchemeId: string;
  onSchemeChange: (def: ColorSchemeDefinition) => void;
  devicePreview: 'mobile' | 'tablet' | 'desktop';
  onDeviceChange: (d: 'mobile' | 'tablet' | 'desktop') => void;
  onOpenColorPicker: () => void;
  onOpenTypography: () => void;
  onOpenAssets: () => void;
  onOpenDesignTokens: () => void;
  onOpenApiExplorer: () => void;
  onOpenSeedData: () => void;
  onOpenDataExplorer: () => void;
  onOpenDeploy: () => void;
  onOpenExport: () => void;
  building: boolean;
  activeLog: string;
}

function BuilderContent(props: BuilderContentProps) {
  switch (props.activeTab) {
    case 'design':
      return <DesignPanel {...props} />;
    case 'code':
      return <CodePanel project={props.project} regions={props.regions} />;
    case 'database':
      return (
        <DatabasePanel
          project={props.project}
          onOpenApiExplorer={props.onOpenApiExplorer}
          onOpenSeedData={props.onOpenSeedData}
          onOpenDataExplorer={props.onOpenDataExplorer}
        />
      );
    case 'test':
      return <TestPanel stages={props.stages} regions={props.regions} />;
    case 'audit':
      return <AuditPanel regions={props.regions} />;
    case 'deploy':
      return (
        <DeployPanel
          project={props.project}
          buildComplete={
            props.stages.length > 0 &&
            props.stages.every((s) => s.status === 'completed')
          }
          building={props.building}
          activeLog={props.activeLog}
          onOpenDeploy={props.onOpenDeploy}
          onOpenExport={props.onOpenExport}
        />
      );
    default:
      return null;
  }
}

/* ---- Design tab ---- */

function DesignPanel({
  regions,
  selectedRegionId,
  onSelectRegion,
  onCompleteRegion,
  colorScheme,
  activeSchemeId,
  onSchemeChange,
  devicePreview,
  onDeviceChange,
  onOpenColorPicker,
  onOpenTypography,
  onOpenAssets,
  onOpenDesignTokens,
  building,
  activeLog,
}: BuilderContentProps) {
  const selected = regions.find((r) => r.id === selectedRegionId) ?? regions[0];

  if (building && regions.length === 0) {
    return (
      <PanelShell title="Design">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          <p className="mt-4 text-sm text-slate-400">Generating your screens…</p>
          {activeLog && (
            <pre className="mt-4 max-w-lg whitespace-pre-wrap rounded-lg border border-slate-800 bg-slate-900/60 p-4 text-left font-mono text-xs text-slate-400">
              {activeLog}
            </pre>
          )}
        </div>
      </PanelShell>
    );
  }

  if (regions.length === 0) {
    return (
      <PanelShell title="Design">
        <EmptyState
          icon={<Boxes className="h-8 w-8" />}
          title="No screens yet"
          description="Start a build or add a screen template to begin designing."
        />
      </PanelShell>
    );
  }

  const deviceWidth =
    devicePreview === 'mobile' ? 360 : devicePreview === 'tablet' ? 768 : 1024;

  return (
    <PanelShell title="Design">
      {/* Sub-toolbar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900/60 p-1">
          {(['mobile', 'tablet', 'desktop'] as const).map((d) => {
            const Icon = d === 'mobile' ? Smartphone : d === 'tablet' ? Tablet : Monitor;
            return (
              <button
                key={d}
                onClick={() => onDeviceChange(d)}
                className={[
                  'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition',
                  devicePreview === d
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200',
                ].join(' ')}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="capitalize">{d}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5">
          <ToolbarChip icon={<Droplet className="h-3.5 w-3.5" />} label="Colors" onClick={onOpenColorPicker} />
          <ToolbarChip icon={<Type className="h-3.5 w-3.5" />} label="Type" onClick={onOpenTypography} />
          <ToolbarChip icon={<ImageIcon className="h-3.5 w-3.5" />} label="Assets" onClick={onOpenAssets} />
          <ToolbarChip icon={<Palette className="h-3.5 w-3.5" />} label="Tokens" onClick={onOpenDesignTokens} />
        </div>
      </div>

      {/* Color scheme switcher */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Scheme
        </span>
        {COLOR_SCHEMES.map((cs) => (
          <button
            key={cs.id}
            onClick={() => onSchemeChange(cs)}
            title={cs.name}
            className={[
              'flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition',
              activeSchemeId === cs.id
                ? 'border-slate-600 bg-slate-800 text-white'
                : 'border-slate-700 text-slate-400 hover:text-slate-200',
            ].join(' ')}
          >
            <span
              className={`h-3 w-3 rounded-full bg-gradient-to-br ${cs.preview}`}
            />
            {cs.name}
          </button>
        ))}
      </div>

      {/* Screen preview */}
      {selected && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col items-center">
            <div
              className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 shadow-xl"
              style={{ width: deviceWidth, maxWidth: '100%' }}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">
                  {selected.region_name}
                </h3>
                {selected.status === 'incomplete' && (
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300 ring-1 ring-amber-500/30">
                    Needs finishing
                  </span>
                )}
              </div>
              <div
                className="space-y-2 rounded-xl p-4"
                style={{ background: colorScheme.surface, color: colorScheme.text }}
              >
                {selected.spec.elements.map((elm) => (
                  <div
                    key={elm.id}
                    className="flex items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-2.5"
                  >
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-md text-xs"
                      style={{ background: colorScheme.primary, color: colorScheme.background }}
                    >
                      {elm.icon ?? '□'}
                    </span>
                    <span className="text-sm" style={{ color: colorScheme.text }}>
                      {elm.label}
                    </span>
                    <span className="ml-auto rounded bg-slate-700/60 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
                      {elm.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Screen list */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              All screens
            </h4>
            {regions.map((r) => {
              const active = r.id === selected.id;
              return (
                <button
                  key={r.id}
                  onClick={() => onSelectRegion(r.id)}
                  className={[
                    'flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition',
                    active
                      ? 'border-slate-600 bg-slate-800/80 text-white'
                      : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200',
                  ].join(' ')}
                >
                  {r.status === 'incomplete' ? (
                    <Circle className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                  ) : (
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  )}
                  <span className="flex-1 truncate">{r.region_name}</span>
                </button>
              );
            })}

            {selected.status === 'incomplete' && (
              <button
                onClick={() => onCompleteRegion(selected.id)}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
              >
                <Check className="h-4 w-4" />
                Mark screen complete
              </button>
            )}
          </div>
        </div>
      )}
    </PanelShell>
  );
}

/* ---- Code tab ---- */

function CodePanel({
  project,
  regions,
}: {
  project: Project | null;
  regions: AppRegion[];
}) {
  const code = generateCodePreview(project, regions);

  return (
    <PanelShell title="Code">
      <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
        <FileCode className="h-4 w-4" />
        <span>Generated TypeScript · auto-synced with your screens</span>
      </div>
      <pre className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 p-4 font-mono text-xs leading-relaxed text-slate-300">
        <code>{code}</code>
      </pre>
    </PanelShell>
  );
}

function generateCodePreview(project: Project | null, regions: AppRegion[]): string {
  const name = project?.name ?? 'App';
  const lines: string[] = [
    `// ${name} — generated by AppForge`,
    `// ${regions.length} screen(s)`,
    '',
    "import { createClient } from '@supabase/supabase-js';",
    '',
    'export const supabase = createClient(',
    '  import.meta.env.VITE_SUPABASE_URL,',
    '  import.meta.env.VITE_SUPABASE_ANON_KEY,',
    ');',
    '',
  ];

  regions.forEach((r) => {
    lines.push(`// ${r.region_name} — ${r.region_type}`);
    lines.push(`export interface ${toPascal(r.region_type)}Screen {`);
    r.spec.elements.forEach((elm) => {
      lines.push(`  ${toCamel(elm.label)}: ${inferType(elm.type)};`);
    });
    lines.push('}');
    lines.push('');
  });

  lines.push('export const screens = [');
  regions.forEach((r) => {
    lines.push(`  { name: '${r.region_name}', type: '${r.region_type}', complete: ${r.status === 'complete'} },`);
  });
  lines.push('];');

  return lines.join('\n');
}

function toPascal(s: string): string {
  return s
    .split(/[^a-zA-Z0-9]/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('') || 'Screen';
}

function toCamel(s: string): string {
  const p = toPascal(s);
  return p[0].toLowerCase() + p.slice(1);
}

function inferType(type: string): string {
  switch (type) {
    case 'checkbox':
      return 'boolean';
    case 'datepicker':
    case 'timer':
      return 'Date';
    case 'stat':
    case 'progress':
      return 'number';
    case 'list':
    case 'feed':
    case 'grid':
    case 'column':
      return 'unknown[]';
    default:
      return 'string';
  }
}

/* ---- Database tab ---- */

function DatabasePanel({
  project,
  onOpenApiExplorer,
  onOpenSeedData,
  onOpenDataExplorer,
}: {
  project: Project | null;
  onOpenApiExplorer: () => void;
  onOpenSeedData: () => void;
  onOpenDataExplorer: () => void;
}) {
  const tables = inferTables(project);

  return (
    <PanelShell title="Database">
      <div className="mb-4 flex items-center gap-2">
        <ToolbarChip icon={<Terminal className="h-3.5 w-3.5" />} label="API Explorer" onClick={onOpenApiExplorer} />
        <ToolbarChip icon={<Boxes className="h-3.5 w-3.5" />} label="Seed Data" onClick={onOpenSeedData} />
        <ToolbarChip icon={<Eye className="h-3.5 w-3.5" />} label="Data Explorer" onClick={onOpenDataExplorer} />
      </div>

      {tables.length === 0 ? (
        <EmptyState
          icon={<DatabaseIcon className="h-8 w-8" />}
          title="No schema inferred yet"
          description="Once your build completes, inferred tables will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {tables.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
            >
              <div className="mb-3 flex items-center gap-2">
                <Table className="h-4 w-4 text-emerald-400" />
                <h3 className="font-mono text-sm font-semibold text-white">{t.name}</h3>
              </div>
              <ul className="space-y-1.5">
                {t.columns.map((c) => (
                  <li
                    key={c.name}
                    className="flex items-center justify-between font-mono text-xs"
                  >
                    <span className="text-slate-300">{c.name}</span>
                    <span className="text-slate-500">{c.type}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </PanelShell>
  );
}

function inferTables(project: Project | null): { name: string; columns: { name: string; type: string }[] }[] {
  const base = [
    {
      name: 'profiles',
      columns: [
        { name: 'id', type: 'uuid (pk)' },
        { name: 'email', type: 'text' },
        { name: 'full_name', type: 'text' },
        { name: 'avatar_url', type: 'text' },
        { name: 'created_at', type: 'timestamptz' },
      ],
    },
  ];
  const p = (project?.prompt ?? '').toLowerCase();
  const extra: typeof base = [];

  if (/\b(task|todo|habit|reminder|checklist)\b/.test(p)) {
    extra.push({
      name: 'tasks',
      columns: [
        { name: 'id', type: 'uuid (pk)' },
        { name: 'user_id', type: 'uuid (fk)' },
        { name: 'title', type: 'text' },
        { name: 'status', type: 'text' },
        { name: 'due_date', type: 'timestamptz' },
        { name: 'sort_order', type: 'int' },
      ],
    });
  }
  if (/\b(shop|store|commerce|cart|product|catalog)\b/.test(p)) {
    extra.push({
      name: 'products',
      columns: [
        { name: 'id', type: 'uuid (pk)' },
        { name: 'name', type: 'text' },
        { name: 'price', type: 'numeric' },
        { name: 'image_url', type: 'text' },
        { name: 'category', type: 'text' },
      ],
    });
    extra.push({
      name: 'orders',
      columns: [
        { name: 'id', type: 'uuid (pk)' },
        { name: 'user_id', type: 'uuid (fk)' },
        { name: 'total', type: 'numeric' },
        { name: 'status', type: 'text' },
        { name: 'created_at', type: 'timestamptz' },
      ],
    });
  }
  if (/\b(social|feed|post|comment)\b/.test(p)) {
    extra.push({
      name: 'posts',
      columns: [
        { name: 'id', type: 'uuid (pk)' },
        { name: 'author_id', type: 'uuid (fk)' },
        { name: 'content', type: 'text' },
        { name: 'image_url', type: 'text' },
        { name: 'likes_count', type: 'int' },
        { name: 'created_at', type: 'timestamptz' },
      ],
    });
  }
  if (/\b(finance|budget|expense|transaction)\b/.test(p)) {
    extra.push({
      name: 'transactions',
      columns: [
        { name: 'id', type: 'uuid (pk)' },
        { name: 'user_id', type: 'uuid (fk)' },
        { name: 'amount', type: 'numeric' },
        { name: 'category', type: 'text' },
        { name: 'date', type: 'timestamptz' },
      ],
    });
  }

  return [...base, ...extra];
}

/* ---- Test tab ---- */

function TestPanel({
  stages,
  regions,
}: {
  stages: BuildStage[];
  regions: AppRegion[];
}) {
  const testStage = stages.find((s) => s.stage_type === 'testing');
  const passed = regions.length;
  const total = regions.length + 4; // +4 generic suites
  const allPass = testStage?.status === 'completed';

  return (
    <PanelShell title="Test">
      <div className="mb-5 grid grid-cols-3 gap-4">
        <StatCard label="Tests passed" value={allPass ? `${passed}` : '—'} icon={<Check className="h-4 w-4" />} tone="emerald" />
        <StatCard label="Total suites" value={`${total}`} icon={<FlaskConical className="h-4 w-4" />} tone="sky" />
        <StatCard label="Coverage" value={allPass ? '94%' : '—'} icon={<BarChart3 className="h-4 w-4" />} tone="violet" />
      </div>

      <div className="space-y-2">
        {regions.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-slate-200">{r.region_name} screen renders</span>
            </div>
            <span className="text-xs font-medium text-emerald-300">Pass</span>
          </div>
        ))}
        {['Auth flow', 'Navigation', 'API client', 'RLS policies'].map((suite) => (
          <div
            key={suite}
            className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              {allPass ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
              )}
              <span className="text-sm text-slate-200">{suite}</span>
            </div>
            <span
              className={[
                'text-xs font-medium',
                allPass ? 'text-emerald-300' : 'text-amber-300',
              ].join(' ')}
            >
              {allPass ? 'Pass' : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

/* ---- Audit tab ---- */

function AuditPanel({ regions }: { regions: AppRegion[] }) {
  const incomplete = regions.filter((r) => r.status === 'incomplete');
  const items = [
    { label: 'All screens complete', done: incomplete.length === 0 && regions.length > 0 },
    { label: 'Row Level Security enabled', done: true },
    { label: 'Environment variables set', done: false },
    { label: 'App icons generated', done: true },
    { label: 'Privacy policy added', done: false },
    { label: 'Crash reporting configured', done: true },
  ];

  return (
    <PanelShell title="Audit">
      <div className="mb-5 flex items-center gap-2 text-sm text-slate-400">
        <ShieldCheck className="h-4 w-4 text-emerald-400" />
        Pre-launch checklist — resolve open items before shipping.
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3"
          >
            {item.done ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Circle className="h-4 w-4 text-amber-400" />
            )}
            <span className="text-sm text-slate-200">{item.label}</span>
          </li>
        ))}
      </ul>

      {incomplete.length > 0 && (
        <div className="mt-5 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-300">
          {incomplete.length} screen{incomplete.length === 1 ? '' : 's'} still need
          {incomplete.length === 1 ? 's' : ''} finishing:{' '}
          {incomplete.map((r) => r.region_name).join(', ')}
        </div>
      )}
    </PanelShell>
  );
}

/* ---- Deploy tab ---- */

function DeployPanel({
  project,
  buildComplete,
  building,
  activeLog,
  onOpenDeploy,
  onOpenExport,
}: {
  project: Project | null;
  buildComplete: boolean;
  building: boolean;
  activeLog: string;
  onOpenDeploy: () => void;
  onOpenExport: () => void;
}) {
  return (
    <PanelShell title="Deploy">
      {building && (
        <div className="mb-5 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
            Build in progress…
          </div>
          {activeLog && (
            <pre className="whitespace-pre-wrap font-mono text-xs text-slate-400">
              {activeLog}
            </pre>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DeployCard
          icon={<Rocket className="h-5 w-5" />}
          title="Deploy to edge"
          description="Ship a live preview URL in seconds."
          disabled={!buildComplete || building}
          onClick={onOpenDeploy}
          primary
        />
        <DeployCard
          icon={<Download className="h-5 w-5" />}
          title="Export code"
          description="Download the full source as a ZIP."
          disabled={!buildComplete}
          onClick={onOpenExport}
        />
        <DeployCard
          icon={<Globe className="h-5 w-5" />}
          title="Custom domain"
          description="Connect your own domain name."
          disabled={!buildComplete}
          onClick={() => {}}
        />
      </div>

      {project && (
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h4 className="mb-2 text-sm font-semibold text-white">Project status</h4>
          <div className="flex flex-wrap gap-3 text-xs">
            <StatusPill label="Status" value={project.status} />
            <StatusPill label="Platform" value={project.platform} />
            <StatusPill label="Type" value={project.app_type} />
          </div>
        </div>
      )}
    </PanelShell>
  );
}

/* ---- Shared small components ---- */

function PanelShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <h2 className="mb-5 text-lg font-semibold tracking-tight text-white">{title}</h2>
      {children}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-500 ring-1 ring-slate-700">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-400">{description}</p>
    </div>
  );
}

function ToolbarChip({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/60 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  tone: 'emerald' | 'sky' | 'violet';
}) {
  const toneCls =
    tone === 'emerald'
      ? 'text-emerald-400 bg-emerald-500/10 ring-emerald-500/30'
      : tone === 'sky'
      ? 'text-sky-400 bg-sky-500/10 ring-sky-500/30'
      : 'text-violet-400 bg-violet-500/10 ring-violet-500/30';
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className={`mb-2 inline-flex rounded-lg p-1.5 ring-1 ${toneCls}`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function DeployCard({
  icon,
  title,
  description,
  onClick,
  disabled,
  primary,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        'group flex flex-col items-start gap-3 rounded-xl border p-5 text-left transition disabled:cursor-not-allowed disabled:opacity-50',
        primary
          ? 'border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10'
          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700',
      ].join(' ')}
    >
      <span
        className={[
          'flex h-10 w-10 items-center justify-center rounded-lg',
          primary ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300',
        ].join(' ')}
      >
        {icon}
      </span>
      <div>
        <div className="text-sm font-semibold text-white">{title}</div>
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-1 group-hover:text-slate-300" />
    </button>
  );
}

function StatusPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-1 text-slate-300">
      <span className="text-slate-500">{label}:</span>
      <span className="font-medium capitalize">{value}</span>
    </span>
  );
}

/* ===========================================================================
 * 10. Modal placeholder layer
 * ========================================================================= */

interface ModalEntry {
  open: boolean;
  onClose: () => void;
  title: string;
}

/**
 * Renders every modal in the app using the simple open/onClose pattern.
 * Each entry renders as a styled placeholder that can later be swapped for a
 * real component without changing the wiring in App.
 */
function ModalLayer({ modals }: { modals: ModalEntry[] }) {
  return (
    <>
      {modals.map((m, i) =>
        m.open ? (
          <div
            key={`${m.title}-${i}`}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={m.onClose}
            />
            <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">{m.title}</h3>
                <button
                  onClick={m.onClose}
                  className="rounded-md p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                  aria-label="Close"
                >
                  <Plus className="h-4 w-4 rotate-45" />
                </button>
              </div>
              <p className="text-sm text-slate-300">
                {m.title} dialog
              </p>
              <p className="mt-2 text-xs text-slate-500">
                This panel is wired up and ready — drop in the full UI here.
              </p>
            </div>
          </div>
        ) : null
      )}
    </>
  );
}
