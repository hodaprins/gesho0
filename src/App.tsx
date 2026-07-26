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
  Bell,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Keyboard,
  Share2,
  Command as CommandIcon,
  Image as ImageIcon,
  Type,
  LayoutTemplate,
  Send,
  Bug,
  MessageSquare,
  Activity,
  TrendingUp,
  Zap,
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
  ScreenElement,
} from '@/types/builder';
import CommandPalette, { type Command } from '@/components/CommandPalette';
import TypographyEditor, { type TypographyConfig } from '@/components/TypographyEditor';
import SettingsPanel, { type UserPreferences } from '@/components/SettingsPanel';
import { useHistory } from '@/lib/useHistory';
import ABTestingPanel from '@/components/ABTestingPanel';
import AIAnomalyDetector from '@/components/AIAnomalyDetector';
import AIAppValuationCalculator from '@/components/AIAppValuationCalculator';
import AIChat from '@/components/AIChat';
import AICognitiveLoadAnalyzer from '@/components/AICognitiveLoadAnalyzer';
import AICompetitorGapAnalyzer from '@/components/AICompetitorGapAnalyzer';
import AICritiquePersona from '@/components/AICritiquePersona';
import AIFrictionScore from '@/components/AIFrictionScore';
import AIHeatmapPredictor from '@/components/AIHeatmapPredictor';
import AIMonetizationStrategist from '@/components/AIMonetizationStrategist';
import AISecurityPatchRecommender from '@/components/AISecurityPatchRecommender';
import APIKeyManager from '@/components/APIKeyManager';
import AccessibilityChecker from '@/components/AccessibilityChecker';
import ActivityLog from '@/components/ActivityLog';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import AnalyticsEvents from '@/components/AnalyticsEvents';
import ApiExplorer from '@/components/ApiExplorer';
import AppConfigEditor from '@/components/AppConfigEditor';
import AppMarketSizingTool from '@/components/AppMarketSizingTool';
import AppStoreAssets from '@/components/AppStoreAssets';
import AppStoreRankingPredictor from '@/components/AppStoreRankingPredictor';
import AssetManager from '@/components/AssetManager';
import AuditPanel from '@/components/AuditPanel';
import AuditTrailPanel from '@/components/AuditTrailPanel';
import BackupManager from '@/components/BackupManager';
import BatteryImpactProfiler from '@/components/BatteryImpactProfiler';
import BuildMetrics from '@/components/BuildMetrics';
import BuildStages from '@/components/BuildStages';
import BulkActionsPanel from '@/components/BulkActionsPanel';
import BundleSizeTreemap from '@/components/BundleSizeTreemap';
import CIPipelineVisualizer from '@/components/CIPipelineVisualizer';
import CacheManager from '@/components/CacheManager';
import CodeDiffViewer from '@/components/CodeDiffViewer';
import { CodeReviewAssignment } from '@/components/CodeReviewAssignment';
import CodeViewer from '@/components/CodeViewer';
import { CollaborativeEditingPanel } from '@/components/CollaborativeEditingPanel';
import ColorPsychologyEngine from '@/components/ColorPsychologyEngine';
import CommentsPanel from '@/components/CommentsPanel';
import CompetitiveLandscapeMapper from '@/components/CompetitiveLandscapeMapper';
import ComponentInspector from '@/components/ComponentInspector';
import ComponentLibrary from '@/components/ComponentLibrary';
import ComponentStorybook from '@/components/ComponentStorybook';
import ContextMenuBar from '@/components/ContextMenuBar';
import CookieConsentDesigner from '@/components/CookieConsentDesigner';
import CrossDeviceScreenshotDiff from '@/components/CrossDeviceScreenshotDiff';
import CustomDomainConfig from '@/components/CustomDomainConfig';
import CustomizableDashboard from '@/components/CustomizableDashboard';
import DataExplorer from '@/components/DataExplorer';
import DataFlowVisualizer from '@/components/DataFlowVisualizer';
import DataRetentionPolicyBuilder from '@/components/DataRetentionPolicyBuilder';
import DatabaseMigrationManager from '@/components/DatabaseMigrationManager';
import DeepLinkConfigurator from '@/components/DeepLinkConfigurator';
import DependencyManager from '@/components/DependencyManager';
import DeployDialog from '@/components/DeployDialog';
import { DesignReviewSystem } from '@/components/DesignReviewSystem';
import DesignTokensManager from '@/components/DesignTokensManager';
import DevicePreviewSwitcher from '@/components/DevicePreviewSwitcher';
import EdgeFunctionVisualBuilder from '@/components/EdgeFunctionVisualBuilder';
import EmailDigestSettings from '@/components/EmailDigestSettings';
import EmailTemplateEditor from '@/components/EmailTemplateEditor';
import EmptyStateDesigner from '@/components/EmptyStateDesigner';
import EncryptionAuditDashboard from '@/components/EncryptionAuditDashboard';
import EnvVarsManager from '@/components/EnvVarsManager';
import ErrorMonitor from '@/components/ErrorMonitor';
import ExportPanel from '@/components/ExportPanel';
import FeatureFlagsManager from '@/components/FeatureFlagsManager';
import { FeatureRequestBoard } from '@/components/FeatureRequestBoard';
import { FeedbackCollector } from '@/components/FeedbackCollector';
import FontSizeAdjuster from '@/components/FontSizeAdjuster';
import FormBuilder from '@/components/FormBuilder';
import GDPRComplianceScanner from '@/components/GDPRComplianceScanner';
import GamificationSystem from '@/components/GamificationSystem';
import GlobalSearch from '@/components/GlobalSearch';
import GraphQLSchemaVisualDesigner from '@/components/GraphQLSchemaVisualDesigner';
import GrowthLoopVisualizer from '@/components/GrowthLoopVisualizer';
import Header from '@/components/Header';
import HealthCheckDashboard from '@/components/HealthCheckDashboard';
import ImageCompressionSettings from '@/components/ImageCompressionSettings';
import IntegrationMarketplace from '@/components/IntegrationMarketplace';
import { InteractiveRoadmap } from '@/components/InteractiveRoadmap';
import InvestorPitchDeckGenerator from '@/components/InvestorPitchDeckGenerator';
import KeyboardShortcutsMap from '@/components/KeyboardShortcutsMap';
import LighthouseScorePredictor from '@/components/LighthouseScorePredictor';
import LocalizationEditor from '@/components/LocalizationEditor';
import LogViewer from '@/components/LogViewer';
import MemoryLeakVisualizer from '@/components/MemoryLeakVisualizer';
import MicroInteractionLibrary from '@/components/MicroInteractionLibrary';
import MiniMapNavigator from '@/components/MiniMapNavigator';
import MobileResponsivePreview from '@/components/MobileResponsivePreview';
import NavigationGraph from '@/components/NavigationGraph';
import NetworkConditionSimulator from '@/components/NetworkConditionSimulator';
import NotificationCenter from '@/components/NotificationCenter';
import NotificationPreferences from '@/components/NotificationPreferences';
import OAuthProvidersConfig from '@/components/OAuthProvidersConfig';
import OfflineFirstSyncDesigner from '@/components/OfflineFirstSyncDesigner';
import OnboardingBuilder from '@/components/OnboardingBuilder';
import OnboardingTour from '@/components/OnboardingTour';
import PIIDataScanner from '@/components/PIIDataScanner';
import PageTransitionConfig from '@/components/PageTransitionConfig';
import PenetrationTestReportGenerator from '@/components/PenetrationTestReportGenerator';
import PerformanceProfiler from '@/components/PerformanceProfiler';
import PermissionMatrixVisualizer from '@/components/PermissionMatrixVisualizer';
import PhonePreview from '@/components/PhonePreview';
import { PinnedFavoritesBar } from '@/components/PinnedFavoritesBar';
import { PlatformAnalytics } from '@/components/PlatformAnalytics';
import PlatformLanguageSwitcher from '@/components/PlatformLanguageSwitcher';
import PredictiveChurnIndicator from '@/components/PredictiveChurnIndicator';
import PricingStrategyABTester from '@/components/PricingStrategyABTester';
import PrivacyPolicyAutoGenerator from '@/components/PrivacyPolicyAutoGenerator';
import ProjectDashboard from '@/components/ProjectDashboard';
import ProjectSettings from '@/components/ProjectSettings';
import PromptScreen from '@/components/PromptScreen';
import PushComposer from '@/components/PushComposer';
import RateLimitConfig from '@/components/RateLimitConfig';
import ReducedMotionSettings from '@/components/ReducedMotionSettings';
import ReferralProgramDesigner from '@/components/ReferralProgramDesigner';
import RegionModal from '@/components/RegionModal';
import ReleaseNotesGenerator from '@/components/ReleaseNotesGenerator';
import ResponsiveBreakpointDebugger from '@/components/ResponsiveBreakpointDebugger';
import RetinaDisplaySettings from '@/components/RetinaDisplaySettings';
import RevenueProjectionEngine from '@/components/RevenueProjectionEngine';
import ReviewSentimentAnalyzer from '@/components/ReviewSentimentAnalyzer';
import SMSConfig from '@/components/SMSConfig';
import ScheduledTasks from '@/components/ScheduledTasks';
import ScreenFlow from '@/components/ScreenFlow';
import ScreenTemplatePicker from '@/components/ScreenTemplatePicker';
import SecurityScanner from '@/components/SecurityScanner';
import SeedDataPanel from '@/components/SeedDataPanel';
import SettingsExportImport from '@/components/SettingsExportImport';
import ShareDialog from '@/components/ShareDialog';
import ShortcutsGuide from '@/components/ShortcutsGuide';
import SkeletonLoadingPreview from '@/components/SkeletonLoadingPreview';
import SmartCacheIndicator from '@/components/SmartCacheIndicator';
import SmartDesignSystemGenerator from '@/components/SmartDesignSystemGenerator';
import { SprintPlanner } from '@/components/SprintPlanner';
import StorageManager from '@/components/StorageManager';
import SyntheticUserSimulator from '@/components/SyntheticUserSimulator';
import TeamPanel from '@/components/TeamPanel';
import TemplatesGallery from '@/components/TemplatesGallery';
import TestPanel from '@/components/TestPanel';
import ThemeEditor from '@/components/ThemeEditor';
import TimelineAnimationComposer from '@/components/TimelineAnimationComposer';
import UndoTimeline from '@/components/UndoTimeline';
import UserJourneyMapper from '@/components/UserJourneyMapper';
import VersionHistory from '@/components/VersionHistory';
import ViralCoefficientCalculator from '@/components/ViralCoefficientCalculator';
import VisualGestureBuilder from '@/components/VisualGestureBuilder';
import VisualRegexBuilder from '@/components/VisualRegexBuilder';
import VisualStateMachineEditor from '@/components/VisualStateMachineEditor';
import VoiceCommandPanel from '@/components/VoiceCommandPanel';
import WebSocketEventDesigner from '@/components/WebSocketEventDesigner';
import WebhookManager from '@/components/WebhookManager';
import WebhookTester from '@/components/WebhookTester';
import { WorkspaceSwitcher } from '@/components/WorkspaceSwitcher';
import AICodeCompletion from '@/components/AICodeCompletion';
import ARCoreSceneConfig from '@/components/ARCoreSceneConfig';
import ARKitSceneConfig from '@/components/ARKitSceneConfig';
import AVIFConverter from '@/components/AVIFConverter';
import AWSAmplifySetup from '@/components/AWSAmplifySetup';
import AndroidKeystoreManager from '@/components/AndroidKeystoreManager';
import AndroidWidgetBuilder from '@/components/AndroidWidgetBuilder';
import AppAttestationConfig from '@/components/AppAttestationConfig';
import AppleWatchBuilder from '@/components/AppleWatchBuilder';
import BiometricAuthConfig from '@/components/BiometricAuthConfig';
import ContainerQueriesBuilder from '@/components/ContainerQueriesBuilder';
import CoreMLModelIntegrator from '@/components/CoreMLModelIntegrator';
import DarkModeDesigner from '@/components/DarkModeDesigner';
import DynamicColorThemes from '@/components/DynamicColorThemes';
import DynamicIslandConfig from '@/components/DynamicIslandConfig';
import E2EEConfig from '@/components/E2EEConfig';
import ESLintConfigEditor from '@/components/ESLintConfigEditor';
import EdgeFunctionDeployer from '@/components/EdgeFunctionDeployer';
import EnergyMetricsPanel from '@/components/EnergyMetricsPanel';
import FaceIDConfig from '@/components/FaceIDConfig';
import FirebaseConfig from '@/components/FirebaseConfig';
import FoldableSupportConfig from '@/components/FoldableSupportConfig';
import GitHubActionsBuilder from '@/components/GitHubActionsBuilder';
import GlassmorphismDesigner from '@/components/GlassmorphismDesigner';
import GraphQLClientBuilder from '@/components/GraphQLClientBuilder';
import JetpackComposePreview from '@/components/JetpackComposePreview';
import KotlinCodeGenerator from '@/components/KotlinCodeGenerator';
import LiDARScannerConfig from '@/components/LiDARScannerConfig';
import LottieAnimationImporter from '@/components/LottieAnimationImporter';
import MLKitIntegrator from '@/components/MLKitIntegrator';
import MaterialDesign3ThemeBuilder from '@/components/MaterialDesign3ThemeBuilder';
import MicroInteractionsStudio from '@/components/MicroInteractionsStudio';
import ModuleFederationConfig from '@/components/ModuleFederationConfig';
import NFCConfigurator from '@/components/NFCConfigurator';
import NeumorphismDesigner from '@/components/NeumorphismDesigner';
import OAuthConfig from '@/components/OAuthConfig';
import OTAUpdateManager from '@/components/OTAUpdateManager';
import OnDeviceLLMConfig from '@/components/OnDeviceLLMConfig';
import PWAConfigurator from '@/components/PWAConfigurator';
import PredictiveAnalyticsConfig from '@/components/PredictiveAnalyticsConfig';
import PrettierConfigEditor from '@/components/PrettierConfigEditor';
import R8ProGuardConfig from '@/components/R8ProGuardConfig';
import RiveAnimationImporter from '@/components/RiveAnimationImporter';
import SFSymbolsBrowser from '@/components/SFSymbolsBrowser';
import SentryConfig from '@/components/SentryConfig';
import ServiceWorkerManager from '@/components/ServiceWorkerManager';
import SonarQubeIntegration from '@/components/SonarQubeIntegration';
import SwiftCodeGenerator from '@/components/SwiftCodeGenerator';
import SwiftUIPreview from '@/components/SwiftUIPreview';
import TensorFlowLiteConfig from '@/components/TensorFlowLiteConfig';
import ViewTransitionsAPI from '@/components/ViewTransitionsAPI';
import WCAGComplianceChecker from '@/components/WCAGComplianceChecker';
import WearOSBuilder from '@/components/WearOSBuilder';
import WebAssemblyCompiler from '@/components/WebAssemblyCompiler';
import WebNotificationsConfig from '@/components/WebNotificationsConfig';
import WebRTCConfig from '@/components/WebRTCConfig';
import WebShareAPITester from '@/components/WebShareAPITester';
import WebVitalsMonitor from '@/components/WebVitalsMonitor';
import WidgetKitBuilder from '@/components/WidgetKitBuilder';
import GRPCServiceBuilder from '@/components/gRPCServiceBuilder';
import { Target, ShieldCheck, FlaskConical, Globe, Flag, GitBranch as GitBranchIcon, Route, FormInput, Network, Webhook, Clock, Database as DbIconExplore, SlidersHorizontal, Accessibility as A11yIcon, Users, FileText, Link2, KeyRound, Monitor, HardDrive, Mail, Terminal, HeartPulse, HardDriveDownload, ScrollText, Gauge as GaugeIcon, Zap as ZapIcon, Package, Settings2, ListChecks, GitCompare, Store as StoreIcon, Send as SendIcon, MessageSquare as SmsIcon } from 'lucide-react';

type View = 'prompt' | 'builder' | 'dashboard';

const BUILDER_TABS: { id: BuilderTab; label: string; icon: React.ReactNode }[] = [
  { id: 'design', label: 'Design', icon: <Palette className="w-3.5 h-3.5" /> },
  { id: 'code', label: 'Code', icon: <Code2 className="w-3.5 h-3.5" /> },
  { id: 'database', label: 'Data', icon: <DatabaseIcon className="w-3.5 h-3.5" /> },
  { id: 'test', label: 'Tests', icon: <TestTube className="w-3.5 h-3.5" /> },
  { id: 'audit', label: 'Audit', icon: <Gauge className="w-3.5 h-3.5" /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
  { id: 'performance', label: 'Profiler', icon: <Zap className="w-3.5 h-3.5" /> },
  { id: 'deploy', label: 'Deploy', icon: <DeployIcon className="w-3.5 h-3.5" /> },
];

const DEFAULT_PREFS: UserPreferences = {
  theme: 'dark',
  language: 'en',
  autoSave: true,
  showGrid: false,
  reducedMotion: false,
  defaultPlatform: 'both',
  codeFontSize: 13,
};

const DEFAULT_TYPOGRAPHY: TypographyConfig = {
  fontFamily: 'Inter, system-ui, sans-serif',
  headingSize: 24,
  bodySize: 14,
  headingWeight: 700,
  bodyWeight: 400,
  lineHeight: 1.5,
  letterSpacing: 0,
};

export default function App() {
  const [view, setView] = useState<View>('prompt');
  const [project, setProject] = useState<Project | null>(null);
  const [stages, setStages] = useState<BuildStage[]>([]);
  const { state: regions, set: setRegions, undo, redo, canUndo, canRedo } = useHistory<AppRegion[]>([]);
  const [activeLog, setActiveLog] = useState('');
  const [modalRegion, setModalRegion] = useState<AppRegion | null>(null);
  const [recentProjectName, setRecentProjectName] = useState<string>();
  const [activeTab, setActiveTab] = useState<BuilderTab>('design');
  const [colorScheme, setColorScheme] = useState<ColorScheme>({
    primary: '#0f766e', secondary: '#14b8a6', accent: '#f59e0b',
    background: '#f0fdfa', surface: '#ffffff', text: '#042f2e',
  });
  const [typography, setTypography] = useState<TypographyConfig>(DEFAULT_TYPOGRAPHY);
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFS);

  const [deployDialogOpen, setdeployDialogOpen] = useState(false);
  const [exportPanelOpen, setexportPanelOpen] = useState(false);
  const [commandPaletteOpen, setcommandPaletteOpen] = useState(false);
  const [assetManagerOpen, setassetManagerOpen] = useState(false);
  const [typographyEditorOpen, settypographyEditorOpen] = useState(false);
  const [screenTemplatePickerOpen, setscreenTemplatePickerOpen] = useState(false);
  const [pushComposerOpen, setpushComposerOpen] = useState(false);
  const [onboardingBuilderOpen, setonboardingBuilderOpen] = useState(false);
  const [apiExplorerOpen, setapiExplorerOpen] = useState(false);
  const [seedDataPanelOpen, setseedDataPanelOpen] = useState(false);
  const [errorMonitorOpen, seterrorMonitorOpen] = useState(false);
  const [commentsPanelOpen, setcommentsPanelOpen] = useState(false);
  const [shareDialogOpen, setshareDialogOpen] = useState(false);
  const [settingsPanelOpen, setsettingsPanelOpen] = useState(false);
  const [shortcutsGuideOpen, setshortcutsGuideOpen] = useState(false);
  const [localizationEditorOpen, setlocalizationEditorOpen] = useState(false);
  const [featureFlagsManagerOpen, setfeatureFlagsManagerOpen] = useState(false);
  const [webhookManagerOpen, setwebhookManagerOpen] = useState(false);
  const [scheduledTasksOpen, setscheduledTasksOpen] = useState(false);
  const [designTokensManagerOpen, setdesignTokensManagerOpen] = useState(false);
  const [teamPanelOpen, setteamPanelOpen] = useState(false);
  const [releaseNotesGeneratorOpen, setreleaseNotesGeneratorOpen] = useState(false);
  const [deepLinkConfiguratorOpen, setdeepLinkConfiguratorOpen] = useState(false);
  const [envVarsManagerOpen, setenvVarsManagerOpen] = useState(false);
  const [devicePreviewSwitcherOpen, setdevicePreviewSwitcherOpen] = useState(false);
  const [securityScannerOpen, setsecurityScannerOpen] = useState(false);
  const [emailTemplateEditorOpen, setemailTemplateEditorOpen] = useState(false);
  const [storageManagerOpen, setstorageManagerOpen] = useState(false);
  const [healthCheckDashboardOpen, sethealthCheckDashboardOpen] = useState(false);
  const [backupManagerOpen, setbackupManagerOpen] = useState(false);
  const [auditTrailPanelOpen, setauditTrailPanelOpen] = useState(false);
  const [customDomainConfigOpen, setcustomDomainConfigOpen] = useState(false);
  const [rateLimitConfigOpen, setrateLimitConfigOpen] = useState(false);
  const [cacheManagerOpen, setcacheManagerOpen] = useState(false);
  const [appConfigEditorOpen, setappConfigEditorOpen] = useState(false);
  const [bulkActionsPanelOpen, setbulkActionsPanelOpen] = useState(false);
  const [codeDiffViewerOpen, setcodeDiffViewerOpen] = useState(false);
  const [aBTestingPanelOpen, setaBTestingPanelOpen] = useState(false);
  const [aIAnomalyDetectorOpen, setaIAnomalyDetectorOpen] = useState(false);
  const [aIAppValuationCalculatorOpen, setaIAppValuationCalculatorOpen] = useState(false);
  const [aIChatOpen, setaIChatOpen] = useState(false);
  const [aICognitiveLoadAnalyzerOpen, setaICognitiveLoadAnalyzerOpen] = useState(false);
  const [aICompetitorGapAnalyzerOpen, setaICompetitorGapAnalyzerOpen] = useState(false);
  const [aICritiquePersonaOpen, setaICritiquePersonaOpen] = useState(false);
  const [aIFrictionScoreOpen, setaIFrictionScoreOpen] = useState(false);
  const [aIHeatmapPredictorOpen, setaIHeatmapPredictorOpen] = useState(false);
  const [aIMonetizationStrategistOpen, setaIMonetizationStrategistOpen] = useState(false);
  const [aISecurityPatchRecommenderOpen, setaISecurityPatchRecommenderOpen] = useState(false);
  const [aPIKeyManagerOpen, setaPIKeyManagerOpen] = useState(false);
  const [accessibilityCheckerOpen, setaccessibilityCheckerOpen] = useState(false);
  const [activityLogOpen, setactivityLogOpen] = useState(false);
  const [analyticsDashboardOpen, setanalyticsDashboardOpen] = useState(false);
  const [analyticsEventsOpen, setAnalyticsEventsOpen] = useState(false);
  const [appMarketSizingToolOpen, setappMarketSizingToolOpen] = useState(false);
  const [appStoreAssetsOpen, setappStoreAssetsOpen] = useState(false);
  const [appStoreRankingPredictorOpen, setappStoreRankingPredictorOpen] = useState(false);
  const [auditPanelOpen, setauditPanelOpen] = useState(false);
  const [batteryImpactProfilerOpen, setbatteryImpactProfilerOpen] = useState(false);
  const [buildMetricsOpen, setbuildMetricsOpen] = useState(false);
  const [buildStagesOpen, setbuildStagesOpen] = useState(false);
  const [bundleSizeTreemapOpen, setbundleSizeTreemapOpen] = useState(false);
  const [cIPipelineVisualizerOpen, setcIPipelineVisualizerOpen] = useState(false);
  const [codeReviewAssignmentOpen, setcodeReviewAssignmentOpen] = useState(false);
  const [codeViewerOpen, setcodeViewerOpen] = useState(false);
  const [collaborativeEditingPanelOpen, setcollaborativeEditingPanelOpen] = useState(false);
  const [colorPsychologyEngineOpen, setcolorPsychologyEngineOpen] = useState(false);
  const [competitiveLandscapeMapperOpen, setcompetitiveLandscapeMapperOpen] = useState(false);
  const [componentInspectorOpen, setcomponentInspectorOpen] = useState(false);
  const [componentLibraryOpen, setcomponentLibraryOpen] = useState(false);
  const [componentStorybookOpen, setcomponentStorybookOpen] = useState(false);
  const [contextMenuBarOpen, setcontextMenuBarOpen] = useState(false);
  const [cookieConsentDesignerOpen, setcookieConsentDesignerOpen] = useState(false);
  const [crossDeviceScreenshotDiffOpen, setcrossDeviceScreenshotDiffOpen] = useState(false);
  const [customizableDashboardOpen, setcustomizableDashboardOpen] = useState(false);
  const [dataExplorerOpen, setDataExplorerOpen] = useState(false);
  const [dataFlowVisualizerOpen, setdataFlowVisualizerOpen] = useState(false);
  const [dataRetentionPolicyBuilderOpen, setdataRetentionPolicyBuilderOpen] = useState(false);
  const [databaseMigrationManagerOpen, setdatabaseMigrationManagerOpen] = useState(false);
  const [dependencyManagerOpen, setdependencyManagerOpen] = useState(false);
  const [designReviewSystemOpen, setdesignReviewSystemOpen] = useState(false);
  const [edgeFunctionVisualBuilderOpen, setedgeFunctionVisualBuilderOpen] = useState(false);
  const [emailDigestSettingsOpen, setemailDigestSettingsOpen] = useState(false);
  const [emptyStateDesignerOpen, setemptyStateDesignerOpen] = useState(false);
  const [encryptionAuditDashboardOpen, setencryptionAuditDashboardOpen] = useState(false);
  const [featureRequestBoardOpen, setfeatureRequestBoardOpen] = useState(false);
  const [feedbackCollectorOpen, setfeedbackCollectorOpen] = useState(false);
  const [fontSizeAdjusterOpen, setfontSizeAdjusterOpen] = useState(false);
  const [formBuilderOpen, setFormBuilderOpen] = useState(false);
  const [gDPRComplianceScannerOpen, setgDPRComplianceScannerOpen] = useState(false);
  const [gamificationSystemOpen, setgamificationSystemOpen] = useState(false);
  const [globalSearchOpen, setglobalSearchOpen] = useState(false);
  const [graphQLSchemaVisualDesignerOpen, setgraphQLSchemaVisualDesignerOpen] = useState(false);
  const [growthLoopVisualizerOpen, setgrowthLoopVisualizerOpen] = useState(false);
  const [headerOpen, setheaderOpen] = useState(false);
  const [imageCompressionSettingsOpen, setimageCompressionSettingsOpen] = useState(false);
  const [integrationMarketplaceOpen, setintegrationMarketplaceOpen] = useState(false);
  const [interactiveRoadmapOpen, setinteractiveRoadmapOpen] = useState(false);
  const [investorPitchDeckGeneratorOpen, setinvestorPitchDeckGeneratorOpen] = useState(false);
  const [keyboardShortcutsMapOpen, setkeyboardShortcutsMapOpen] = useState(false);
  const [lighthouseScorePredictorOpen, setlighthouseScorePredictorOpen] = useState(false);
  const [logViewerOpen, setLogViewerOpen] = useState(false);
  const [memoryLeakVisualizerOpen, setmemoryLeakVisualizerOpen] = useState(false);
  const [microInteractionLibraryOpen, setmicroInteractionLibraryOpen] = useState(false);
  const [miniMapNavigatorOpen, setminiMapNavigatorOpen] = useState(false);
  const [mobileResponsivePreviewOpen, setmobileResponsivePreviewOpen] = useState(false);
  const [navigationGraphOpen, setnavigationGraphOpen] = useState(false);
  const [networkConditionSimulatorOpen, setnetworkConditionSimulatorOpen] = useState(false);
  const [notificationCenterOpen, setnotificationCenterOpen] = useState(false);
  const [notificationPreferencesOpen, setnotificationPreferencesOpen] = useState(false);
  const [oAuthProvidersConfigOpen, setoAuthProvidersConfigOpen] = useState(false);
  const [offlineFirstSyncDesignerOpen, setofflineFirstSyncDesignerOpen] = useState(false);
  const [onboardingTourOpen, setonboardingTourOpen] = useState(false);
  const [pIIDataScannerOpen, setpIIDataScannerOpen] = useState(false);
  const [pageTransitionConfigOpen, setpageTransitionConfigOpen] = useState(false);
  const [penetrationTestReportGeneratorOpen, setpenetrationTestReportGeneratorOpen] = useState(false);
  const [performanceProfilerOpen, setperformanceProfilerOpen] = useState(false);
  const [permissionMatrixVisualizerOpen, setpermissionMatrixVisualizerOpen] = useState(false);
  const [phonePreviewOpen, setphonePreviewOpen] = useState(false);
  const [pinnedFavoritesBarOpen, setpinnedFavoritesBarOpen] = useState(false);
  const [platformAnalyticsOpen, setplatformAnalyticsOpen] = useState(false);
  const [platformLanguageSwitcherOpen, setplatformLanguageSwitcherOpen] = useState(false);
  const [predictiveChurnIndicatorOpen, setpredictiveChurnIndicatorOpen] = useState(false);
  const [pricingStrategyABTesterOpen, setpricingStrategyABTesterOpen] = useState(false);
  const [privacyPolicyAutoGeneratorOpen, setprivacyPolicyAutoGeneratorOpen] = useState(false);
  const [projectDashboardOpen, setprojectDashboardOpen] = useState(false);
  const [projectSettingsOpen, setProjectSettingsOpen] = useState(false);
  const [promptScreenOpen, setpromptScreenOpen] = useState(false);
  const [reducedMotionSettingsOpen, setreducedMotionSettingsOpen] = useState(false);
  const [referralProgramDesignerOpen, setreferralProgramDesignerOpen] = useState(false);
  const [regionModalOpen, setregionModalOpen] = useState(false);
  const [responsiveBreakpointDebuggerOpen, setresponsiveBreakpointDebuggerOpen] = useState(false);
  const [retinaDisplaySettingsOpen, setretinaDisplaySettingsOpen] = useState(false);
  const [revenueProjectionEngineOpen, setrevenueProjectionEngineOpen] = useState(false);
  const [reviewSentimentAnalyzerOpen, setreviewSentimentAnalyzerOpen] = useState(false);
  const [sMSConfigOpen, setsMSConfigOpen] = useState(false);
  const [screenFlowOpen, setscreenFlowOpen] = useState(false);
  const [settingsExportImportOpen, setsettingsExportImportOpen] = useState(false);
  const [skeletonLoadingPreviewOpen, setskeletonLoadingPreviewOpen] = useState(false);
  const [smartCacheIndicatorOpen, setsmartCacheIndicatorOpen] = useState(false);
  const [smartDesignSystemGeneratorOpen, setsmartDesignSystemGeneratorOpen] = useState(false);
  const [sprintPlannerOpen, setsprintPlannerOpen] = useState(false);
  const [syntheticUserSimulatorOpen, setsyntheticUserSimulatorOpen] = useState(false);
  const [templatesGalleryOpen, settemplatesGalleryOpen] = useState(false);
  const [testPanelOpen, settestPanelOpen] = useState(false);
  const [themeEditorOpen, setthemeEditorOpen] = useState(false);
  const [timelineAnimationComposerOpen, settimelineAnimationComposerOpen] = useState(false);
  const [undoTimelineOpen, setundoTimelineOpen] = useState(false);
  const [userJourneyMapperOpen, setuserJourneyMapperOpen] = useState(false);
  const [versionHistoryOpen, setversionHistoryOpen] = useState(false);
  const [viralCoefficientCalculatorOpen, setviralCoefficientCalculatorOpen] = useState(false);
  const [visualGestureBuilderOpen, setvisualGestureBuilderOpen] = useState(false);
  const [visualRegexBuilderOpen, setvisualRegexBuilderOpen] = useState(false);
  const [visualStateMachineEditorOpen, setvisualStateMachineEditorOpen] = useState(false);
  const [voiceCommandPanelOpen, setvoiceCommandPanelOpen] = useState(false);
  const [webSocketEventDesignerOpen, setwebSocketEventDesignerOpen] = useState(false);
  const [webhookTesterOpen, setWebhookTesterOpen] = useState(false);
  const [workspaceSwitcherOpen, setworkspaceSwitcherOpen] = useState(false);
  const [a11yOpen, setA11yOpen] = useState(false);
  const [abTestingOpen, setAbTestingOpen] = useState(false);
  const [apiKeysOpen, setApiKeysOpen] = useState(false);
  const [apiOpen, setApiOpen] = useState(false);
  const [appConfigOpen, setAppConfigOpen] = useState(false);
  const [assetOpen, setAssetOpen] = useState(false);
  const [auditTrailOpen, setAuditTrailOpen] = useState(false);
  const [backupOpen, setBackupOpen] = useState(false);
  const [bulkActionsOpen, setBulkActionsOpen] = useState(false);
  const [cIPipelineOpen, setCIPipelineOpen] = useState(false);
  const [cacheOpen, setCacheOpen] = useState(false);
  const [codeDiffOpen, setCodeDiffOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [customDomainOpen, setCustomDomainOpen] = useState(false);
  const [dbMigrationOpen, setDbMigrationOpen] = useState(false);
  const [deepLinkOpen, setDeepLinkOpen] = useState(false);
  const [deployOpen, setDeployOpen] = useState(false);
  const [depsOpen, setDepsOpen] = useState(false);
  const [designTokensOpen, setDesignTokensOpen] = useState(false);
  const [devicePreviewOpen, setDevicePreviewOpen] = useState(false);
  const [emailTemplateOpen, setEmailTemplateOpen] = useState(false);
  const [envVarsOpen, setEnvVarsOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [featureFlagsOpen, setFeatureFlagsOpen] = useState(false);
  const [healthCheckOpen, setHealthCheckOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [integrationsOpen, setIntegrationsOpen] = useState(false);
  const [journeyOpen, setJourneyOpen] = useState(false);
  const [localizationOpen, setLocalizationOpen] = useState(false);
  const [navGraphOpen, setNavGraphOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [oauthOpen, setOauthOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [pushOpen, setPushOpen] = useState(false);
  const [rateLimitOpen, setRateLimitOpen] = useState(false);
  const [releaseNotesOpen, setReleaseNotesOpen] = useState(false);
  const [scheduledOpen, setScheduledOpen] = useState(false);
  const [screenTemplateOpen, setScreenTemplateOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [seedOpen, setSeedOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [smsOpen, setSmsOpen] = useState(false);
  const [storageOpen, setStorageOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [typographyOpen, setTypographyOpen] = useState(false);
  const [versionsOpen, setVersionsOpen] = useState(false);
  const [webhookOpen, setWebhookOpen] = useState(false);
  const [aICodeCompletionOpen, setaICodeCompletionOpen] = useState(false);
  const [aRCoreSceneConfigOpen, setaRCoreSceneConfigOpen] = useState(false);
  const [aRKitSceneConfigOpen, setaRKitSceneConfigOpen] = useState(false);
  const [aVIFConverterOpen, setaVIFConverterOpen] = useState(false);
  const [aWSAmplifySetupOpen, setaWSAmplifySetupOpen] = useState(false);
  const [androidKeystoreManagerOpen, setandroidKeystoreManagerOpen] = useState(false);
  const [androidWidgetBuilderOpen, setandroidWidgetBuilderOpen] = useState(false);
  const [appAttestationConfigOpen, setappAttestationConfigOpen] = useState(false);
  const [appleWatchBuilderOpen, setappleWatchBuilderOpen] = useState(false);
  const [biometricAuthConfigOpen, setbiometricAuthConfigOpen] = useState(false);
  const [containerQueriesBuilderOpen, setcontainerQueriesBuilderOpen] = useState(false);
  const [coreMLModelIntegratorOpen, setcoreMLModelIntegratorOpen] = useState(false);
  const [darkModeDesignerOpen, setdarkModeDesignerOpen] = useState(false);
  const [dynamicColorThemesOpen, setdynamicColorThemesOpen] = useState(false);
  const [dynamicIslandConfigOpen, setdynamicIslandConfigOpen] = useState(false);
  const [e2EEConfigOpen, sete2EEConfigOpen] = useState(false);
  const [eSLintConfigEditorOpen, seteSLintConfigEditorOpen] = useState(false);
  const [edgeFunctionDeployerOpen, setedgeFunctionDeployerOpen] = useState(false);
  const [energyMetricsPanelOpen, setenergyMetricsPanelOpen] = useState(false);
  const [faceIDConfigOpen, setfaceIDConfigOpen] = useState(false);
  const [firebaseConfigOpen, setfirebaseConfigOpen] = useState(false);
  const [foldableSupportConfigOpen, setfoldableSupportConfigOpen] = useState(false);
  const [gitHubActionsBuilderOpen, setgitHubActionsBuilderOpen] = useState(false);
  const [glassmorphismDesignerOpen, setglassmorphismDesignerOpen] = useState(false);
  const [graphQLClientBuilderOpen, setgraphQLClientBuilderOpen] = useState(false);
  const [jetpackComposePreviewOpen, setjetpackComposePreviewOpen] = useState(false);
  const [kotlinCodeGeneratorOpen, setkotlinCodeGeneratorOpen] = useState(false);
  const [liDARScannerConfigOpen, setliDARScannerConfigOpen] = useState(false);
  const [lottieAnimationImporterOpen, setlottieAnimationImporterOpen] = useState(false);
  const [mLKitIntegratorOpen, setmLKitIntegratorOpen] = useState(false);
  const [materialDesign3ThemeBuilderOpen, setmaterialDesign3ThemeBuilderOpen] = useState(false);
  const [microInteractionsStudioOpen, setmicroInteractionsStudioOpen] = useState(false);
  const [moduleFederationConfigOpen, setmoduleFederationConfigOpen] = useState(false);
  const [nFCConfiguratorOpen, setnFCConfiguratorOpen] = useState(false);
  const [neumorphismDesignerOpen, setneumorphismDesignerOpen] = useState(false);
  const [oAuthConfigOpen, setoAuthConfigOpen] = useState(false);
  const [oTAUpdateManagerOpen, setoTAUpdateManagerOpen] = useState(false);
  const [onDeviceLLMConfigOpen, setonDeviceLLMConfigOpen] = useState(false);
  const [pWAConfiguratorOpen, setpWAConfiguratorOpen] = useState(false);
  const [predictiveAnalyticsConfigOpen, setpredictiveAnalyticsConfigOpen] = useState(false);
  const [prettierConfigEditorOpen, setprettierConfigEditorOpen] = useState(false);
  const [r8ProGuardConfigOpen, setr8ProGuardConfigOpen] = useState(false);
  const [riveAnimationImporterOpen, setriveAnimationImporterOpen] = useState(false);
  const [sFSymbolsBrowserOpen, setsFSymbolsBrowserOpen] = useState(false);
  const [sentryConfigOpen, setsentryConfigOpen] = useState(false);
  const [serviceWorkerManagerOpen, setserviceWorkerManagerOpen] = useState(false);
  const [sonarQubeIntegrationOpen, setsonarQubeIntegrationOpen] = useState(false);
  const [swiftCodeGeneratorOpen, setswiftCodeGeneratorOpen] = useState(false);
  const [swiftUIPreviewOpen, setswiftUIPreviewOpen] = useState(false);
  const [tensorFlowLiteConfigOpen, settensorFlowLiteConfigOpen] = useState(false);
  const [viewTransitionsAPIOpen, setviewTransitionsAPIOpen] = useState(false);
  const [wCAGComplianceCheckerOpen, setwCAGComplianceCheckerOpen] = useState(false);
  const [wearOSBuilderOpen, setwearOSBuilderOpen] = useState(false);
  const [webAssemblyCompilerOpen, setwebAssemblyCompilerOpen] = useState(false);
  const [webNotificationsConfigOpen, setwebNotificationsConfigOpen] = useState(false);
  const [webRTCConfigOpen, setwebRTCConfigOpen] = useState(false);
  const [webShareAPITesterOpen, setwebShareAPITesterOpen] = useState(false);
  const [webVitalsMonitorOpen, setwebVitalsMonitorOpen] = useState(false);
  const [widgetKitBuilderOpen, setwidgetKitBuilderOpen] = useState(false);
  const [gRPCServiceBuilderOpen, setGRPCServiceBuilderOpen] = useState(false);
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

    if (projErr || !proj) throw new Error(projErr?.message ?? 'Failed to create project');
    const projectRow = proj as unknown as Project;
    setProject(projectRow);
    setColorScheme(spec.colorScheme);
    setRecentProjectName(projectRow.name);
    setView('builder');
    setActiveTab('design');

    const stageRows = STAGE_DEFINITIONS.map((s, i) => ({
      project_id: projectRow.id, stage_name: s.name, stage_type: s.type,
      status: 'pending', logs: '', sort_order: i,
    }));
    const { data: insertedStages, error: stageErr } = await supabase
      .from('build_stages').insert(stageRows).select();
    if (stageErr || !insertedStages) throw new Error(stageErr?.message ?? 'Failed to create build stages');
    setStages(insertedStages as unknown as BuildStage[]);

    const regionRows = spec.screens.map((screen, i) => ({
      project_id: projectRow.id, region_name: screen.name, region_type: screen.regionType,
      status: screen.intentionallyIncomplete ? 'incomplete' : 'complete',
      spec: screen, description: screen.description, sort_order: i,
    }));
    const { data: insertedRegions, error: regionErr } = await supabase
      .from('app_regions').insert(regionRows).select();
    if (regionErr || !insertedRegions) throw new Error(regionErr?.message ?? 'Failed to create app regions');
    setRegions(insertedRegions as unknown as AppRegion[], true);

    runBuildPipeline(projectRow.id, spec.appType);
  }, [setRegions]);

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

      setStages((prev) => prev.map((s) => s.stage_type === def.type ? { ...s, status: 'in_progress' } : s));
      supabase.from('build_stages').update({ status: 'in_progress' }).eq('project_id', projectId).eq('stage_type', def.type);

      const streamLog = () => {
        if (logIdx < logs.length) {
          setActiveLog(logs[logIdx]);
          logIdx++;
          buildTimer.current = setTimeout(streamLog, 700);
        } else {
          setStages((prev) => prev.map((s) => s.stage_type === def.type ? { ...s, status: 'completed', logs: logs.join('\n') } : s));
          supabase.from('build_stages').update({ status: 'completed', logs: logs.join('\n') }).eq('project_id', projectId).eq('stage_type', def.type);
          stageIdx++;
          buildTimer.current = setTimeout(runNextStage, 350);
        }
      };
      streamLog();
    };
    runNextStage();
  }, []);

  const handleCompleteRegion = async (regionId: string) => {
    setRegions((prev) => prev.map((r) => (r.id === regionId ? { ...r, status: 'complete' } : r)));
    await supabase.from('app_regions').update({ status: 'complete' }).eq('id', regionId);
    setModalRegion(null);
  };

  const handleAddElement = (regionId: string, element: ScreenElement) => {
    setRegions((prev) => prev.map((r) =>
      r.id === regionId ? { ...r, spec: { ...r.spec, elements: [...r.spec.elements, element] } } : r,
    ));
  };

  const handleAddScreenFromTemplate = (template: any) => {
    if (!project) return;
    const newRegion: AppRegion = {
      id: crypto.randomUUID(),
      project_id: project.id,
      region_name: template.name,
      region_type: template.regionType,
      status: 'complete',
      spec: { name: template.name, regionType: template.regionType, elements: template.elements, description: template.description },
      description: template.description,
      sort_order: regions.length,
      created_at: new Date().toISOString(),
    };
    setRegions((prev) => [...prev, newRegion]);
  };

  const handleColorChange = (cs: ColorScheme) => {
    setColorScheme(cs);
    if (project) supabase.from('projects').update({ config: { colorScheme: cs } }).eq('id', project.id);
  };

  const handleOpenProject = (proj: Project) => {
    setProject(proj);
    if (proj.config?.colorScheme) setColorScheme(proj.config.colorScheme);
    setView('builder');
    supabase.from('build_stages').select('*').eq('project_id', proj.id).order('sort_order').then(({ data }) => {
      if (data) setStages(data as unknown as BuildStage[]);
    });
    supabase.from('app_regions').select('*').eq('project_id', proj.id).order('sort_order').then(({ data }) => {
      if (data) setRegions(data as unknown as AppRegion[], true);
    });
  };

  const handleNew = () => {
    if (buildTimer.current) clearTimeout(buildTimer.current);
    setProject(null);
    setStages([]);
    setRegions([], true);
    setActiveLog('');
    setView('prompt');
  };

  useEffect(() => {
    return () => { if (buildTimer.current) clearTimeout(buildTimer.current); };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    if (view !== 'builder') return;
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === 'k') { e.preventDefault(); setCommandOpen(true); }
      else if (meta && e.key === '/') { e.preventDefault(); setSearchOpen(true); }
      else if (meta && e.key === 'b') { e.preventDefault(); setSidebarOpen(s => !s); }
      else if (meta && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      else if (meta && e.shiftKey && e.key === 'z') { e.preventDefault(); redo(); }
      else if (meta && e.key === 'e') { e.preventDefault(); setExportOpen(true); }
      else if (meta && e.shiftKey && e.key === 'd') { e.preventDefault(); setDeployOpen(true); }
      else if (meta && e.shiftKey && e.key === 's') { e.preventDefault(); setStoreOpen(true); }
      else if (e.key === '?' && !meta) { e.preventDefault(); setShortcutsOpen(true); }
      else if (!meta && ['1','2','3','4','5','6'].includes(e.key)) {
        const tabs: BuilderTab[] = ['design','code','database','test','audit','deploy'];
        const idx = parseInt(e.key) - 1;
        if (tabs[idx]) setActiveTab(tabs[idx]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [view, undo, redo]);

  const isBuilding = stages.some((s) => s.status === 'in_progress' || s.status === 'pending');
  const buildComplete = stages.length > 0 && stages.every((s) => s.status === 'completed');
  const incompleteRegions = regions.filter((r) => r.status === 'incomplete');

  const commands: Command[] = [
    { id: 'search', label: 'Search screens', shortcut: '⌘/', icon: <SearchIcon className="w-4 h-4" />, section: 'Navigation', action: () => setSearchOpen(true) },
    { id: 'design', label: 'Go to Design tab', shortcut: '1', icon: <Palette className="w-4 h-4" />, section: 'Navigation', action: () => setActiveTab('design') },
    { id: 'code', label: 'Go to Code tab', shortcut: '2', icon: <Code2 className="w-4 h-4" />, section: 'Navigation', action: () => setActiveTab('code') },
    { id: 'database', label: 'Go to Data tab', shortcut: '3', icon: <DatabaseIcon className="w-4 h-4" />, section: 'Navigation', action: () => setActiveTab('database') },
    { id: 'test', label: 'Go to Tests tab', shortcut: '4', icon: <TestTube className="w-4 h-4" />, section: 'Navigation', action: () => setActiveTab('test') },
    { id: 'audit', label: 'Go to Audit tab', shortcut: '5', icon: <Gauge className="w-4 h-4" />, section: 'Navigation', action: () => setActiveTab('audit') },
    { id: 'analytics', label: 'Go to Analytics', icon: <BarChart3 className="w-4 h-4" />, section: 'Navigation', action: () => setActiveTab('analytics') },
    { id: 'performance', label: 'Go to Profiler', icon: <Zap className="w-4 h-4" />, section: 'Navigation', action: () => setActiveTab('performance') },
    { id: 'deploy', label: 'Go to Deploy tab', shortcut: '6', icon: <DeployIcon className="w-4 h-4" />, section: 'Navigation', action: () => setActiveTab('deploy') },
    { id: 'deploy-dialog', label: 'Deploy to cloud', shortcut: '⌘⇧D', icon: <Rocket className="w-4 h-4" />, section: 'Actions', action: () => setDeployOpen(true) },
    { id: 'export', label: 'Export code', shortcut: '⌘E', icon: <Code2 className="w-4 h-4" />, section: 'Actions', action: () => setExportOpen(true) },
    { id: 'store', label: 'App store assets', shortcut: '⌘⇧S', icon: <Store className="w-4 h-4" />, section: 'Actions', action: () => setStoreOpen(true) },
    { id: 'versions', label: 'Version history', icon: <GitBranch className="w-4 h-4" />, section: 'Actions', action: () => setVersionsOpen(true) },
    { id: 'share', label: 'Share preview link', icon: <Share2 className="w-4 h-4" />, section: 'Actions', action: () => setShareOpen(true) },
    { id: 'assets', label: 'Open asset library', icon: <ImageIcon className="w-4 h-4" />, section: 'Design', action: () => setAssetOpen(true) },
    { id: 'typography', label: 'Edit typography', icon: <Type className="w-4 h-4" />, section: 'Design', action: () => setTypographyOpen(true) },
    { id: 'screen-templates', label: 'Add screen from template', icon: <LayoutTemplate className="w-4 h-4" />, section: 'Design', action: () => setScreenTemplateOpen(true) },
    { id: 'push', label: 'Compose push notification', icon: <Send className="w-4 h-4" />, section: 'Engagement', action: () => setPushOpen(true) },
    { id: 'onboarding', label: 'Build onboarding flow', icon: <Sparkles className="w-4 h-4" />, section: 'Engagement', action: () => setOnboardingOpen(true) },
    { id: 'api', label: 'Explore API endpoints', icon: <Code2 className="w-4 h-4" />, section: 'Backend', action: () => setApiOpen(true) },
    { id: 'seed', label: 'Generate seed data', icon: <DatabaseIcon className="w-4 h-4" />, section: 'Backend', action: () => setSeedOpen(true) },
    { id: 'errors', label: 'View error monitor', icon: <Bug className="w-4 h-4" />, section: 'Monitoring', action: () => setErrorOpen(true) },
    { id: 'comments', label: 'Open comments', icon: <MessageSquare className="w-4 h-4" />, section: 'Collaboration', action: () => setCommentsOpen(true) },
    { id: 'settings', label: 'Open preferences', icon: <SettingsIcon className="w-4 h-4" />, section: 'Settings', action: () => setSettingsOpen(true) },
    { id: 'shortcuts', label: 'Keyboard shortcuts', shortcut: '?', icon: <Keyboard className="w-4 h-4" />, section: 'Settings', action: () => setShortcutsOpen(true) },
    { id: 'undo', label: 'Undo', shortcut: '⌘Z', icon: <ArrowRight className="w-4 h-4 rotate-180" />, section: 'Editing', action: undo },
    { id: 'redo', label: 'Redo', shortcut: '⌘⇧Z', icon: <ArrowRight className="w-4 h-4" />, section: 'Editing', action: redo },
    { id: 'ab-testing', label: 'A/B Testing', icon: <FlaskConical className="w-4 h-4" />, section: 'Testing', action: () => setAbTestingOpen(true) },
    { id: 'localization', label: 'Localization Editor', icon: <Globe className="w-4 h-4" />, section: 'Content', action: () => setLocalizationOpen(true) },
    { id: 'feature-flags', label: 'Feature Flags', icon: <Flag className="w-4 h-4" />, section: 'Backend', action: () => setFeatureFlagsOpen(true) },
    { id: 'ci-pipeline', label: 'CI/CD Pipeline', icon: <GitBranchIcon className="w-4 h-4" />, section: 'DevOps', action: () => setCIPipelineOpen(true) },
    { id: 'journey', label: 'User Journey Mapper', icon: <Route className="w-4 h-4" />, section: 'Analytics', action: () => setJourneyOpen(true) },
    { id: 'form-builder', label: 'Form Builder', icon: <FormInput className="w-4 h-4" />, section: 'Design', action: () => setFormBuilderOpen(true) },
    { id: 'nav-graph', label: 'Navigation Graph', icon: <Network className="w-4 h-4" />, section: 'Design', action: () => setNavGraphOpen(true) },
    { id: 'webhooks', label: 'Webhook Manager', icon: <Webhook className="w-4 h-4" />, section: 'Backend', action: () => setWebhookOpen(true) },
    { id: 'scheduled', label: 'Scheduled Tasks', icon: <Clock className="w-4 h-4" />, section: 'Backend', action: () => setScheduledOpen(true) },
    { id: 'data-explorer', label: 'Data Explorer', icon: <DbIconExplore className="w-4 h-4" />, section: 'Backend', action: () => setDataExplorerOpen(true) },
    { id: 'inspector', label: 'Component Inspector', icon: <SlidersHorizontal className="w-4 h-4" />, section: 'Design', action: () => setInspectorOpen(true) },
    { id: 'design-tokens', label: 'Design Tokens', icon: <Palette className="w-4 h-4" />, section: 'Design', action: () => setDesignTokensOpen(true) },
    { id: 'a11y', label: 'Accessibility Checker', icon: <A11yIcon className="w-4 h-4" />, section: 'Quality', action: () => setA11yOpen(true) },
    { id: 'team', label: 'Team Management', icon: <Users className="w-4 h-4" />, section: 'Collaboration', action: () => setTeamOpen(true) },
    { id: 'release-notes', label: 'Release Notes', icon: <FileText className="w-4 h-4" />, section: 'Deploy', action: () => setReleaseNotesOpen(true) },
    { id: 'deep-links', label: 'Deep Link Configurator', icon: <Link2 className="w-4 h-4" />, section: 'Deploy', action: () => setDeepLinkOpen(true) },
    { id: 'env-vars', label: 'Environment Variables', icon: <KeyRound className="w-4 h-4" />, section: 'DevOps', action: () => setEnvVarsOpen(true) },
    { id: 'device-preview', label: 'Device Preview Switcher', icon: <Monitor className="w-4 h-4" />, section: 'Design', action: () => setDevicePreviewOpen(true) },
    { id: 'analytics-events', label: 'Analytics Events & Funnels', icon: <Target className="w-4 h-4" />, section: 'Analytics', action: () => setAnalyticsEventsOpen(true) },
    { id: 'security', label: 'Security Scanner', icon: <ShieldCheck className="w-4 h-4" />, section: 'Quality', action: () => setSecurityOpen(true) },
    { id: 'db-migrations', label: 'Database Migrations', icon: <DatabaseIcon className="w-4 h-4" />, section: 'Backend', action: () => setDbMigrationOpen(true) },
    { id: 'email-templates', label: 'Email Templates', icon: <Mail className="w-4 h-4" />, section: 'Content', action: () => setEmailTemplateOpen(true) },
    { id: 'storage', label: 'Storage Manager', icon: <HardDrive className="w-4 h-4" />, section: 'Backend', action: () => setStorageOpen(true) },
    { id: 'logs', label: 'Log Viewer', icon: <Terminal className="w-4 h-4" />, section: 'Monitoring', action: () => setLogViewerOpen(true) },
    { id: 'health', label: 'Health Checks', icon: <HeartPulse className="w-4 h-4" />, section: 'Monitoring', action: () => setHealthCheckOpen(true) },
    { id: 'backups', label: 'Backup Manager', icon: <HardDriveDownload className="w-4 h-4" />, section: 'DevOps', action: () => setBackupOpen(true) },
    { id: 'audit-trail', label: 'Audit Trail', icon: <ScrollText className="w-4 h-4" />, section: 'Security', action: () => setAuditTrailOpen(true) },
    { id: 'domains', label: 'Custom Domains', icon: <Globe className="w-4 h-4" />, section: 'Deploy', action: () => setCustomDomainOpen(true) },
    { id: 'oauth', label: 'OAuth Providers', icon: <KeyRound className="w-4 h-4" />, section: 'Auth', action: () => setOauthOpen(true) },
    { id: 'rate-limit', label: 'Rate Limiting', icon: <GaugeIcon className="w-4 h-4" />, section: 'Backend', action: () => setRateLimitOpen(true) },
    { id: 'cache', label: 'Cache Manager', icon: <ZapIcon className="w-4 h-4" />, section: 'Backend', action: () => setCacheOpen(true) },
    { id: 'deps', label: 'Dependencies', icon: <Package className="w-4 h-4" />, section: 'DevOps', action: () => setDepsOpen(true) },
    { id: 'app-config', label: 'App Config Editor', icon: <Settings2 className="w-4 h-4" />, section: 'Settings', action: () => setAppConfigOpen(true) },
    { id: 'bulk-actions', label: 'Bulk Actions', icon: <ListChecks className="w-4 h-4" />, section: 'Editing', action: () => setBulkActionsOpen(true) },
    { id: 'code-diff', label: 'Code Diff Viewer', icon: <GitCompare className="w-4 h-4" />, section: 'Code', action: () => setCodeDiffOpen(true) },
    { id: 'api-keys', label: 'API Key Manager', icon: <KeyRound className="w-4 h-4" />, section: 'Security', action: () => setApiKeysOpen(true) },
    { id: 'sms', label: 'SMS Configuration', icon: <SmsIcon className="w-4 h-4" />, section: 'Engagement', action: () => setSmsOpen(true) },
    { id: 'webhook-tester', label: 'Webhook Tester', icon: <Webhook className="w-4 h-4" />, section: 'Backend', action: () => setWebhookTesterOpen(true) },
    { id: 'integrations', label: 'Integration Marketplace', icon: <StoreIcon className="w-4 h-4" />, section: 'Extensions', action: () => setIntegrationsOpen(true) },
    { id: 'project-settings', label: 'Project Settings', icon: <SettingsIcon className="w-4 h-4" />, section: 'Settings', action: () => setProjectSettingsOpen(true) },
  ];

  if (view === 'prompt') {
    return <PromptScreen onStart={handleStart} recentProjectName={recentProjectName} />;
  }

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onNew={handleNew} onHome={handleNew} onDashboard={() => setView('builder')} />
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

      {/* Builder toolbar */}
      <div className="flex items-center gap-1 px-4 py-1.5 border-b border-slate-800 bg-slate-950/50 overflow-x-auto scrollbar-thin">
        {BUILDER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={() => setCommandOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
        >
          <CommandIcon className="w-3.5 h-3.5" />
          Commands
          <kbd className="text-[9px] border border-slate-700 rounded px-1">⌘K</kbd>
        </button>
        <button
          onClick={() => setSearchOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
        >
          <SearchIcon className="w-3.5 h-3.5" />
          Search
        </button>
        <button
          onClick={() => setNotificationsOpen(true)}
          className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
        >
          <Bell className="w-3.5 h-3.5" />
          {incompleteRegions.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 text-[8px] text-white flex items-center justify-center font-bold">
              {incompleteRegions.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setSettingsOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
        >
          <SettingsIcon className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          {sidebarOpen ? 'Hide' : 'Show'}
        </button>
      </div>

      {/* Sub-toolbar for design tab */}
      {activeTab === 'design' && (
        <div className="flex items-center gap-1.5 px-4 py-1 border-b border-slate-800 bg-slate-950/30 overflow-x-auto scrollbar-thin">
          <SubToolbarBtn icon={<LayoutTemplate className="w-3 h-3" />} label="Screen Templates" onClick={() => setScreenTemplateOpen(true)} />
          <SubToolbarBtn icon={<ImageIcon className="w-3 h-3" />} label="Assets" onClick={() => setAssetOpen(true)} />
          <SubToolbarBtn icon={<Type className="w-3 h-3" />} label="Typography" onClick={() => setTypographyOpen(true)} />
          <SubToolbarBtn icon={<Workflow className="w-3 h-3" />} label="Flow" onClick={() => setNavGraphOpen(true)} />
          <SubToolbarBtn icon={<MessageSquare className="w-3 h-3" />} label="Comments" onClick={() => setCommentsOpen(true)} />
          <SubToolbarBtn icon={<Share2 className="w-3 h-3" />} label="Share" onClick={() => setShareOpen(true)} />
          <SubToolbarBtn icon={<Monitor className="w-3 h-3" />} label="Devices" onClick={() => setDevicePreviewOpen(true)} />
          <SubToolbarBtn icon={<SlidersHorizontal className="w-3 h-3" />} label="Inspector" onClick={() => setInspectorOpen(true)} />
          <SubToolbarBtn icon={<Palette className="w-3 h-3" />} label="Tokens" onClick={() => setDesignTokensOpen(true)} />
          <SubToolbarBtn icon={<A11yIcon className="w-3 h-3" />} label="A11y" onClick={() => setA11yOpen(true)} />
          <SubToolbarBtn icon={<FormInput className="w-3 h-3" />} label="Forms" onClick={() => setFormBuilderOpen(true)} />
          <SubToolbarBtn icon={<HardDrive className="w-3 h-3" />} label="Storage" onClick={() => setStorageOpen(true)} />
          <SubToolbarBtn icon={<Mail className="w-3 h-3" />} label="Email Templates" onClick={() => setEmailTemplateOpen(true)} />
          <SubToolbarBtn icon={<Globe className="w-3 h-3" />} label="i18n" onClick={() => setLocalizationOpen(true)} />
          <div className="flex-1" />
          <SubToolbarBtn icon={<ArrowRight className="w-3 h-3 rotate-180" />} label="Undo" onClick={undo} disabled={!canUndo} />
          <SubToolbarBtn icon={<ArrowRight className="w-3 h-3" />} label="Redo" onClick={redo} disabled={!canRedo} />
        </div>
      )}

      {/* Sub-toolbar for deploy tab */}
      {activeTab === 'deploy' && (
        <div className="flex items-center gap-1.5 px-4 py-1 border-b border-slate-800 bg-slate-950/30 overflow-x-auto scrollbar-thin">
          <SubToolbarBtn icon={<Rocket className="w-3 h-3" />} label="Deploy" onClick={() => setDeployOpen(true)} />
          <SubToolbarBtn icon={<Send className="w-3 h-3" />} label="Push" onClick={() => setPushOpen(true)} />
          <SubToolbarBtn icon={<Sparkles className="w-3 h-3" />} label="Onboarding" onClick={() => setOnboardingOpen(true)} />
          <SubToolbarBtn icon={<Code2 className="w-3 h-3" />} label="API" onClick={() => setApiOpen(true)} />
          <SubToolbarBtn icon={<Bug className="w-3 h-3" />} label="Errors" onClick={() => setErrorOpen(true)} />
          <SubToolbarBtn icon={<Share2 className="w-3 h-3" />} label="Share" onClick={() => setShareOpen(true)} />
          <SubToolbarBtn icon={<FlaskConical className="w-3 h-3" />} label="A/B Test" onClick={() => setAbTestingOpen(true)} />
          <SubToolbarBtn icon={<FileText className="w-3 h-3" />} label="Release Notes" onClick={() => setReleaseNotesOpen(true)} />
          <SubToolbarBtn icon={<Link2 className="w-3 h-3" />} label="Deep Links" onClick={() => setDeepLinkOpen(true)} />
          <SubToolbarBtn icon={<Flag className="w-3 h-3" />} label="Flags" onClick={() => setFeatureFlagsOpen(true)} />
          <SubToolbarBtn icon={<GitBranchIcon className="w-3 h-3" />} label="CI/CD" onClick={() => setCIPipelineOpen(true)} />
          <SubToolbarBtn icon={<ShieldCheck className="w-3 h-3" />} label="Security" onClick={() => setSecurityOpen(true)} />
          <SubToolbarBtn icon={<Users className="w-3 h-3" />} label="Team" onClick={() => setTeamOpen(true)} />
          <SubToolbarBtn icon={<StoreIcon className="w-3 h-3" />} label="Integrations" onClick={() => setIntegrationsOpen(true)} />
          <SubToolbarBtn icon={<HardDriveDownload className="w-3 h-3" />} label="Backups" onClick={() => setBackupOpen(true)} />
          <SubToolbarBtn icon={<ScrollText className="w-3 h-3" />} label="Audit Trail" onClick={() => setAuditTrailOpen(true)} />
          <SubToolbarBtn icon={<Globe className="w-3 h-3" />} label="Domains" onClick={() => setCustomDomainOpen(true)} />
          <SubToolbarBtn icon={<Settings2 className="w-3 h-3" />} label="Project" onClick={() => setProjectSettingsOpen(true)} />
        </div>
      )}

      {/* Sub-toolbar for database tab */}
      {activeTab === 'database' && (
        <div className="flex items-center gap-1.5 px-4 py-1 border-b border-slate-800 bg-slate-950/30 overflow-x-auto scrollbar-thin">
          <SubToolbarBtn icon={<DatabaseIcon className="w-3 h-3" />} label="Seed Data" onClick={() => setSeedOpen(true)} />
          <SubToolbarBtn icon={<Code2 className="w-3 h-3" />} label="API" onClick={() => setApiOpen(true)} />
          <SubToolbarBtn icon={<DbIconExplore className="w-3 h-3" />} label="Data Explorer" onClick={() => setDataExplorerOpen(true)} />
          <SubToolbarBtn icon={<Webhook className="w-3 h-3" />} label="Webhooks" onClick={() => setWebhookOpen(true)} />
          <SubToolbarBtn icon={<Webhook className="w-3 h-3" />} label="Webhook Tester" onClick={() => setWebhookTesterOpen(true)} />
          <SubToolbarBtn icon={<Clock className="w-3 h-3" />} label="Cron Jobs" onClick={() => setScheduledOpen(true)} />
          <SubToolbarBtn icon={<KeyRound className="w-3 h-3" />} label="Env Vars" onClick={() => setEnvVarsOpen(true)} />
          <SubToolbarBtn icon={<DatabaseIcon className="w-3 h-3" />} label="Migrations" onClick={() => setDbMigrationOpen(true)} />
          <SubToolbarBtn icon={<ZapIcon className="w-3 h-3" />} label="Cache" onClick={() => setCacheOpen(true)} />
          <SubToolbarBtn icon={<GaugeIcon className="w-3 h-3" />} label="Rate Limit" onClick={() => setRateLimitOpen(true)} />
          <SubToolbarBtn icon={<Terminal className="w-3 h-3" />} label="Logs" onClick={() => setLogViewerOpen(true)} />
        </div>
      )}

      {/* Sub-toolbar for audit tab */}
      {activeTab === 'audit' && (
        <div className="flex items-center gap-1.5 px-4 py-1 border-b border-slate-800 bg-slate-950/30 overflow-x-auto scrollbar-thin">
          <SubToolbarBtn icon={<ShieldCheck className="w-3 h-3" />} label="Security Scan" onClick={() => setSecurityOpen(true)} />
          <SubToolbarBtn icon={<A11yIcon className="w-3 h-3" />} label="Accessibility" onClick={() => setA11yOpen(true)} />
          <SubToolbarBtn icon={<ScrollText className="w-3 h-3" />} label="Audit Trail" onClick={() => setAuditTrailOpen(true)} />
          <SubToolbarBtn icon={<Package className="w-3 h-3" />} label="Dependencies" onClick={() => setDepsOpen(true)} />
          <SubToolbarBtn icon={<GitCompare className="w-3 h-3" />} label="Code Diff" onClick={() => setCodeDiffOpen(true)} />
          <SubToolbarBtn icon={<ListChecks className="w-3 h-3" />} label="Bulk Actions" onClick={() => setBulkActionsOpen(true)} />
        </div>
      )}

      {/* Sub-toolbar for analytics tab */}
      {activeTab === 'analytics' && (
        <div className="flex items-center gap-1.5 px-4 py-1 border-b border-slate-800 bg-slate-950/30 overflow-x-auto scrollbar-thin">
          <SubToolbarBtn icon={<Target className="w-3 h-3" />} label="Events & Funnels" onClick={() => setAnalyticsEventsOpen(true)} />
          <SubToolbarBtn icon={<Route className="w-3 h-3" />} label="User Journeys" onClick={() => setJourneyOpen(true)} />
          <SubToolbarBtn icon={<FlaskConical className="w-3 h-3" />} label="A/B Tests" onClick={() => setAbTestingOpen(true)} />
          <SubToolbarBtn icon={<HeartPulse className="w-3 h-3" />} label="Health" onClick={() => setHealthCheckOpen(true)} />
          <SubToolbarBtn icon={<Terminal className="w-3 h-3" />} label="Logs" onClick={() => setLogViewerOpen(true)} />
        </div>
      )}

      {/* Sub-toolbar for test tab */}
      {activeTab === 'test' && (
        <div className="flex items-center gap-1.5 px-4 py-1 border-b border-slate-800 bg-slate-950/30 overflow-x-auto scrollbar-thin">
          <SubToolbarBtn icon={<FlaskConical className="w-3 h-3" />} label="A/B Testing" onClick={() => setAbTestingOpen(true)} />
          <SubToolbarBtn icon={<GitBranchIcon className="w-3 h-3" />} label="CI/CD Pipeline" onClick={() => setCIPipelineOpen(true)} />
          <SubToolbarBtn icon={<Bug className="w-3 h-3" />} label="Error Monitor" onClick={() => setErrorOpen(true)} />
          <SubToolbarBtn icon={<ShieldCheck className="w-3 h-3" />} label="Security" onClick={() => setSecurityOpen(true)} />
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {sidebarOpen && (
          <div className="w-72 shrink-0 border-r border-slate-800 bg-slate-950/50 flex flex-col max-h-[calc(100vh-160px)] hidden lg:flex">
            <BuildStages stages={stages} activeLog={activeLog} />
          </div>
        )}

        <div className="flex-1 flex overflow-hidden min-w-0">
          {activeTab === 'design' && (
            <DesignTab
              regions={regions}
              colorScheme={colorScheme}
              appName={project?.name ?? 'My App'}
              onRegionClick={setModalRegion}
              onColorChange={handleColorChange}
              onAddElement={handleAddElement}
              onScreenFlow={() => {}}
              showGrid={prefs.showGrid}
            />
          )}
          {activeTab === 'code' && (
            <CodeViewer regions={regions} colorScheme={colorScheme} appName={project?.name ?? 'My App'} />
          )}
          {activeTab === 'database' && <DatabaseTab regions={regions} appName={project?.name ?? 'My App'} />}
          {activeTab === 'test' && <TestPanel regions={regions} appName={project?.name ?? 'My App'} />}
          {activeTab === 'audit' && (
            <AuditPanel regions={regions} colorScheme={colorScheme} platform={project?.platform ?? 'both'} />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsDashboard screenCount={regions.length} appName={project?.name ?? 'My App'} />
          )}
          {activeTab === 'performance' && <PerformanceProfiler screenCount={regions.length} />}
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
              onPush={() => setPushOpen(true)}
              onOnboarding={() => setOnboardingOpen(true)}
              onApi={() => setApiOpen(true)}
              onShare={() => setShareOpen(true)}
              onErrors={() => setErrorOpen(true)}
            />
          )}
        </div>

        <div className="w-80 shrink-0 border-l border-slate-800 bg-slate-950/50 flex flex-col max-h-[calc(100vh-160px)] hidden xl:flex">
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

      {/* All modals */}
      <RegionModal region={modalRegion} onClose={() => setModalRegion(null)} onComplete={handleCompleteRegion} />
      <DeployDialog open={deployOpen} onClose={() => setDeployOpen(false)} platform={project?.platform as Platform} appName={project?.name ?? ''} buildComplete={buildComplete} />
      <AppStoreAssets open={storeOpen} onClose={() => setStoreOpen(false)} appName={project?.name ?? ''} appType={project?.app_type ?? 'general'} colorScheme={colorScheme} regions={regions} />
      <VersionHistory open={versionsOpen} onClose={() => setVersionsOpen(false)} appName={project?.name ?? ''} screenCount={regions.length} />
      <ExportPanel open={exportOpen} onClose={() => setExportOpen(false)} regions={regions} colorScheme={colorScheme} appName={project?.name ?? ''} />
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} commands={commands} />
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} regions={regions} onRegionSelect={setModalRegion} />
      <TypographyEditorModal open={typographyOpen} onClose={() => setTypographyOpen(false)} config={typography} onChange={setTypography} colorScheme={colorScheme} />
      <ScreenTemplatePicker open={screenTemplateOpen} onClose={() => setScreenTemplateOpen(false)} onSelect={handleAddScreenFromTemplate} />
      <PushComposer open={pushOpen} onClose={() => setPushOpen(false)} appName={project?.name ?? ''} />
      <OnboardingBuilder open={onboardingOpen} onClose={() => setOnboardingOpen(false)} appName={project?.name ?? ''} />
      <ApiExplorer open={apiOpen} onClose={() => setApiOpen(false)} appType={project?.app_type ?? 'general'} screenCount={regions.length} />
      <SeedDataPanel open={seedOpen} onClose={() => setSeedOpen(false)} appType={project?.app_type ?? 'general'} />
      <ErrorMonitor open={errorOpen} onClose={() => setErrorOpen(false)} screenCount={regions.length} />
      <CommentsPanel open={commentsOpen} onClose={() => setCommentsOpen(false)} regions={regions} />
      <ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} appName={project?.name ?? ''} />
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} prefs={prefs} onChange={setPrefs} />
      <NotificationCenter open={notificationsOpen} onClose={() => setNotificationsOpen(false)} appName={project?.name ?? ''} />
      <UserJourneyMapper open={journeyOpen} onClose={() => setJourneyOpen(false)} regions={regions} />
      <NavigationGraph open={navGraphOpen} onClose={() => setNavGraphOpen(false)} regions={regions} />
      <ComponentInspector open={inspectorOpen} onClose={() => setInspectorOpen(false)} regions={regions} />
      <DesignTokensManager open={designTokensOpen} onClose={() => setDesignTokensOpen(false)} colorScheme={colorScheme} />
      <AccessibilityChecker open={a11yOpen} onClose={() => setA11yOpen(false)} regions={regions} colorScheme={colorScheme} />
      <ReleaseNotesGenerator open={releaseNotesOpen} onClose={() => setReleaseNotesOpen(false)} appName={project?.name ?? ''} regions={regions} version="1.0.0" />
      <DeepLinkConfigurator open={deepLinkOpen} onClose={() => setDeepLinkOpen(false)} appName={project?.name ?? ''} regions={regions} />
      <DevicePreviewSwitcher open={devicePreviewOpen} onClose={() => setDevicePreviewOpen(false)} regions={regions} colorScheme={colorScheme} appName={project?.name ?? ''} />
      <EmailTemplateEditor open={emailTemplateOpen} onClose={() => setEmailTemplateOpen(false)} appName={project?.name ?? ''} />
      <CustomDomainConfig open={customDomainOpen} onClose={() => setCustomDomainOpen(false)} appName={project?.name ?? ''} />
      <AppConfigEditor open={appConfigOpen} onClose={() => setAppConfigOpen(false)} appName={project?.name ?? ''} />
      <BulkActionsPanel open={bulkActionsOpen} onClose={() => setBulkActionsOpen(false)} regions={regions} />
      <ProjectSettings open={projectSettingsOpen} onClose={() => setProjectSettingsOpen(false)} project={project} />
      <ABTestingPanel open={aBTestingPanelOpen} onClose={() => setaBTestingPanelOpen(false)} />
      <AIAnomalyDetector open={aIAnomalyDetectorOpen} onClose={() => setaIAnomalyDetectorOpen(false)} />
      <AIAppValuationCalculator open={aIAppValuationCalculatorOpen} onClose={() => setaIAppValuationCalculatorOpen(false)} appName={project?.name ?? ''} />
      <AICognitiveLoadAnalyzer open={aICognitiveLoadAnalyzerOpen} onClose={() => setaICognitiveLoadAnalyzerOpen(false)} regions={regions} />
      <AICompetitorGapAnalyzer open={aICompetitorGapAnalyzerOpen} onClose={() => setaICompetitorGapAnalyzerOpen(false)} appName={project?.name ?? ''} />
      <AICritiquePersona open={aICritiquePersonaOpen} onClose={() => setaICritiquePersonaOpen(false)} regions={regions} appName={project?.name ?? ''} />
      <AIFrictionScore open={aIFrictionScoreOpen} onClose={() => setaIFrictionScoreOpen(false)} regions={regions} />
      <AIHeatmapPredictor open={aIHeatmapPredictorOpen} onClose={() => setaIHeatmapPredictorOpen(false)} regions={regions} colorScheme={colorScheme} appName={project?.name ?? ''}  />
      <AIMonetizationStrategist open={aIMonetizationStrategistOpen} onClose={() => setaIMonetizationStrategistOpen(false)} appName={project?.name ?? ''} />
      <AISecurityPatchRecommender open={aISecurityPatchRecommenderOpen} onClose={() => setaISecurityPatchRecommenderOpen(false)} />
      <APIKeyManager open={aPIKeyManagerOpen} onClose={() => setaPIKeyManagerOpen(false)} />
      <AnalyticsEvents open={analyticsEventsOpen} onClose={() => setAnalyticsEventsOpen(false)} />
      <AppMarketSizingTool open={appMarketSizingToolOpen} onClose={() => setappMarketSizingToolOpen(false)} />
      <AppStoreRankingPredictor open={appStoreRankingPredictorOpen} onClose={() => setappStoreRankingPredictorOpen(false)} appName={project?.name ?? ''} />
      <AuditTrailPanel open={auditTrailPanelOpen} onClose={() => setauditTrailPanelOpen(false)} />
      <BackupManager open={backupManagerOpen} onClose={() => setbackupManagerOpen(false)} />
      <BatteryImpactProfiler open={batteryImpactProfilerOpen} onClose={() => setbatteryImpactProfilerOpen(false)} regions={regions} />
      <BundleSizeTreemap open={bundleSizeTreemapOpen} onClose={() => setbundleSizeTreemapOpen(false)} />
      <CIPipelineVisualizer open={cIPipelineVisualizerOpen} onClose={() => setcIPipelineVisualizerOpen(false)} />
      <CacheManager open={cacheManagerOpen} onClose={() => setcacheManagerOpen(false)} />
      <CodeDiffViewer open={codeDiffViewerOpen} onClose={() => setcodeDiffViewerOpen(false)} />
      <CodeReviewAssignment open={codeReviewAssignmentOpen} onClose={() => setcodeReviewAssignmentOpen(false)} />
      <CollaborativeEditingPanel open={collaborativeEditingPanelOpen} onClose={() => setcollaborativeEditingPanelOpen(false)} />
      <ColorPsychologyEngine open={colorPsychologyEngineOpen} onClose={() => setcolorPsychologyEngineOpen(false)} />
      <CompetitiveLandscapeMapper open={competitiveLandscapeMapperOpen} onClose={() => setcompetitiveLandscapeMapperOpen(false)} />
      <ComponentStorybook open={componentStorybookOpen} onClose={() => setcomponentStorybookOpen(false)} />
      <ContextMenuBar open={contextMenuBarOpen} onClose={() => setcontextMenuBarOpen(false)} />
      <CookieConsentDesigner open={cookieConsentDesignerOpen} onClose={() => setcookieConsentDesignerOpen(false)} />
      <CrossDeviceScreenshotDiff open={crossDeviceScreenshotDiffOpen} onClose={() => setcrossDeviceScreenshotDiffOpen(false)} />
      <CustomizableDashboard open={customizableDashboardOpen} onClose={() => setcustomizableDashboardOpen(false)} />
      <DataExplorer open={dataExplorerOpen} onClose={() => setDataExplorerOpen(false)} />
      <DataFlowVisualizer open={dataFlowVisualizerOpen} onClose={() => setdataFlowVisualizerOpen(false)} />
      <DataRetentionPolicyBuilder open={dataRetentionPolicyBuilderOpen} onClose={() => setdataRetentionPolicyBuilderOpen(false)} />
      <DatabaseMigrationManager open={databaseMigrationManagerOpen} onClose={() => setdatabaseMigrationManagerOpen(false)} />
      <DependencyManager open={dependencyManagerOpen} onClose={() => setdependencyManagerOpen(false)} />
      <DesignReviewSystem open={designReviewSystemOpen} onClose={() => setdesignReviewSystemOpen(false)} />
      <EdgeFunctionVisualBuilder open={edgeFunctionVisualBuilderOpen} onClose={() => setedgeFunctionVisualBuilderOpen(false)} />
      <EmailDigestSettings open={emailDigestSettingsOpen} onClose={() => setemailDigestSettingsOpen(false)} />
      <EmptyStateDesigner open={emptyStateDesignerOpen} onClose={() => setemptyStateDesignerOpen(false)} />
      <EncryptionAuditDashboard open={encryptionAuditDashboardOpen} onClose={() => setencryptionAuditDashboardOpen(false)} />
      <EnvVarsManager open={envVarsManagerOpen} onClose={() => setenvVarsManagerOpen(false)} />
      <FeatureFlagsManager open={featureFlagsManagerOpen} onClose={() => setfeatureFlagsManagerOpen(false)} />
      <FeatureRequestBoard open={featureRequestBoardOpen} onClose={() => setfeatureRequestBoardOpen(false)} />
      <FeedbackCollector open={feedbackCollectorOpen} onClose={() => setfeedbackCollectorOpen(false)} />
      <FontSizeAdjuster open={fontSizeAdjusterOpen} onClose={() => setfontSizeAdjusterOpen(false)} />
      <FormBuilder open={formBuilderOpen} onClose={() => setFormBuilderOpen(false)} />
      <GDPRComplianceScanner open={gDPRComplianceScannerOpen} onClose={() => setgDPRComplianceScannerOpen(false)} />
      <GamificationSystem open={gamificationSystemOpen} onClose={() => setgamificationSystemOpen(false)} />
      <GraphQLSchemaVisualDesigner open={graphQLSchemaVisualDesignerOpen} onClose={() => setgraphQLSchemaVisualDesignerOpen(false)} />
      <GrowthLoopVisualizer open={growthLoopVisualizerOpen} onClose={() => setgrowthLoopVisualizerOpen(false)} />
      <HealthCheckDashboard open={healthCheckDashboardOpen} onClose={() => sethealthCheckDashboardOpen(false)} />
      <ImageCompressionSettings open={imageCompressionSettingsOpen} onClose={() => setimageCompressionSettingsOpen(false)} />
      <IntegrationMarketplace open={integrationMarketplaceOpen} onClose={() => setintegrationMarketplaceOpen(false)} />
      <InteractiveRoadmap open={interactiveRoadmapOpen} onClose={() => setinteractiveRoadmapOpen(false)} />
      <InvestorPitchDeckGenerator open={investorPitchDeckGeneratorOpen} onClose={() => setinvestorPitchDeckGeneratorOpen(false)} appName={project?.name ?? ''} />
      <KeyboardShortcutsMap open={keyboardShortcutsMapOpen} onClose={() => setkeyboardShortcutsMapOpen(false)} />
      <LighthouseScorePredictor open={lighthouseScorePredictorOpen} onClose={() => setlighthouseScorePredictorOpen(false)} />
      <LocalizationEditor open={localizationEditorOpen} onClose={() => setlocalizationEditorOpen(false)} />
      <LogViewer open={logViewerOpen} onClose={() => setLogViewerOpen(false)} />
      <MemoryLeakVisualizer open={memoryLeakVisualizerOpen} onClose={() => setmemoryLeakVisualizerOpen(false)} />
      <MicroInteractionLibrary open={microInteractionLibraryOpen} onClose={() => setmicroInteractionLibraryOpen(false)} />
      <MiniMapNavigator open={miniMapNavigatorOpen} onClose={() => setminiMapNavigatorOpen(false)} regions={regions} />
      <MobileResponsivePreview open={mobileResponsivePreviewOpen} onClose={() => setmobileResponsivePreviewOpen(false)} />
      <NetworkConditionSimulator open={networkConditionSimulatorOpen} onClose={() => setnetworkConditionSimulatorOpen(false)} />
      <NotificationPreferences open={notificationPreferencesOpen} onClose={() => setnotificationPreferencesOpen(false)} />
      <OAuthProvidersConfig open={oAuthProvidersConfigOpen} onClose={() => setoAuthProvidersConfigOpen(false)} />
      <OfflineFirstSyncDesigner open={offlineFirstSyncDesignerOpen} onClose={() => setofflineFirstSyncDesignerOpen(false)} />
      <OnboardingTour open={onboardingTourOpen} onClose={() => setonboardingTourOpen(false)} />
      <PIIDataScanner open={pIIDataScannerOpen} onClose={() => setpIIDataScannerOpen(false)} />
      <PageTransitionConfig open={pageTransitionConfigOpen} onClose={() => setpageTransitionConfigOpen(false)} />
      <PenetrationTestReportGenerator open={penetrationTestReportGeneratorOpen} onClose={() => setpenetrationTestReportGeneratorOpen(false)} />
      <PermissionMatrixVisualizer open={permissionMatrixVisualizerOpen} onClose={() => setpermissionMatrixVisualizerOpen(false)} />
      <PinnedFavoritesBar open={pinnedFavoritesBarOpen} onClose={() => setpinnedFavoritesBarOpen(false)} />
      <PlatformAnalytics open={platformAnalyticsOpen} onClose={() => setplatformAnalyticsOpen(false)} />
      <PlatformLanguageSwitcher open={platformLanguageSwitcherOpen} onClose={() => setplatformLanguageSwitcherOpen(false)} />
      <PredictiveChurnIndicator open={predictiveChurnIndicatorOpen} onClose={() => setpredictiveChurnIndicatorOpen(false)} />
      <PricingStrategyABTester open={pricingStrategyABTesterOpen} onClose={() => setpricingStrategyABTesterOpen(false)} />
      <PrivacyPolicyAutoGenerator open={privacyPolicyAutoGeneratorOpen} onClose={() => setprivacyPolicyAutoGeneratorOpen(false)} appName={project?.name ?? ''} />
      <RateLimitConfig open={rateLimitConfigOpen} onClose={() => setrateLimitConfigOpen(false)} />
      <ReducedMotionSettings open={reducedMotionSettingsOpen} onClose={() => setreducedMotionSettingsOpen(false)} />
      <ReferralProgramDesigner open={referralProgramDesignerOpen} onClose={() => setreferralProgramDesignerOpen(false)} />
      <ResponsiveBreakpointDebugger open={responsiveBreakpointDebuggerOpen} onClose={() => setresponsiveBreakpointDebuggerOpen(false)} colorScheme={colorScheme} appName={project?.name ?? ''} />
      <RetinaDisplaySettings open={retinaDisplaySettingsOpen} onClose={() => setretinaDisplaySettingsOpen(false)} />
      <RevenueProjectionEngine open={revenueProjectionEngineOpen} onClose={() => setrevenueProjectionEngineOpen(false)} />
      <ReviewSentimentAnalyzer open={reviewSentimentAnalyzerOpen} onClose={() => setreviewSentimentAnalyzerOpen(false)} />
      <SMSConfig open={sMSConfigOpen} onClose={() => setsMSConfigOpen(false)} />
      <ScheduledTasks open={scheduledTasksOpen} onClose={() => setscheduledTasksOpen(false)} />
      <SecurityScanner open={securityScannerOpen} onClose={() => setsecurityScannerOpen(false)} />
      <SettingsExportImport open={settingsExportImportOpen} onClose={() => setsettingsExportImportOpen(false)} />
      <SkeletonLoadingPreview open={skeletonLoadingPreviewOpen} onClose={() => setskeletonLoadingPreviewOpen(false)} />
      <SmartCacheIndicator open={smartCacheIndicatorOpen} onClose={() => setsmartCacheIndicatorOpen(false)} />
      <SmartDesignSystemGenerator open={smartDesignSystemGeneratorOpen} onClose={() => setsmartDesignSystemGeneratorOpen(false)} colorScheme={colorScheme} />
      <SprintPlanner open={sprintPlannerOpen} onClose={() => setsprintPlannerOpen(false)} />
      <StorageManager open={storageManagerOpen} onClose={() => setstorageManagerOpen(false)} />
      <SyntheticUserSimulator open={syntheticUserSimulatorOpen} onClose={() => setsyntheticUserSimulatorOpen(false)} regions={regions} colorScheme={colorScheme} appName={project?.name ?? ''} />
      <TeamPanel open={teamPanelOpen} onClose={() => setteamPanelOpen(false)} />
      <TimelineAnimationComposer open={timelineAnimationComposerOpen} onClose={() => settimelineAnimationComposerOpen(false)} />
      <UndoTimeline open={undoTimelineOpen} onClose={() => setundoTimelineOpen(false)} />
      <ViralCoefficientCalculator open={viralCoefficientCalculatorOpen} onClose={() => setviralCoefficientCalculatorOpen(false)} />
      <VisualGestureBuilder open={visualGestureBuilderOpen} onClose={() => setvisualGestureBuilderOpen(false)} />
      <VisualRegexBuilder open={visualRegexBuilderOpen} onClose={() => setvisualRegexBuilderOpen(false)} />
      <VisualStateMachineEditor open={visualStateMachineEditorOpen} onClose={() => setvisualStateMachineEditorOpen(false)} />
      <VoiceCommandPanel open={voiceCommandPanelOpen} onClose={() => setvoiceCommandPanelOpen(false)} />
      <WebSocketEventDesigner open={webSocketEventDesignerOpen} onClose={() => setwebSocketEventDesignerOpen(false)} />
      <WebhookManager open={webhookManagerOpen} onClose={() => setwebhookManagerOpen(false)} />
      <WebhookTester open={webhookTesterOpen} onClose={() => setWebhookTesterOpen(false)} />
      <WorkspaceSwitcher open={workspaceSwitcherOpen} onClose={() => setworkspaceSwitcherOpen(false)} />
      <AICodeCompletion open={aICodeCompletionOpen} onClose={() => setaICodeCompletionOpen(false)} />
      <ARCoreSceneConfig open={aRCoreSceneConfigOpen} onClose={() => setaRCoreSceneConfigOpen(false)} />
      <ARKitSceneConfig open={aRKitSceneConfigOpen} onClose={() => setaRKitSceneConfigOpen(false)} />
      <AVIFConverter open={aVIFConverterOpen} onClose={() => setaVIFConverterOpen(false)} />
      <AWSAmplifySetup open={aWSAmplifySetupOpen} onClose={() => setaWSAmplifySetupOpen(false)} />
      <AndroidKeystoreManager open={androidKeystoreManagerOpen} onClose={() => setandroidKeystoreManagerOpen(false)} />
      <AndroidWidgetBuilder open={androidWidgetBuilderOpen} onClose={() => setandroidWidgetBuilderOpen(false)} />
      <AppAttestationConfig open={appAttestationConfigOpen} onClose={() => setappAttestationConfigOpen(false)} />
      <AppleWatchBuilder open={appleWatchBuilderOpen} onClose={() => setappleWatchBuilderOpen(false)} />
      <BiometricAuthConfig open={biometricAuthConfigOpen} onClose={() => setbiometricAuthConfigOpen(false)} />
      <ContainerQueriesBuilder open={containerQueriesBuilderOpen} onClose={() => setcontainerQueriesBuilderOpen(false)} />
      <CoreMLModelIntegrator open={coreMLModelIntegratorOpen} onClose={() => setcoreMLModelIntegratorOpen(false)} />
      <DarkModeDesigner open={darkModeDesignerOpen} onClose={() => setdarkModeDesignerOpen(false)} />
      <DynamicColorThemes open={dynamicColorThemesOpen} onClose={() => setdynamicColorThemesOpen(false)} />
      <DynamicIslandConfig open={dynamicIslandConfigOpen} onClose={() => setdynamicIslandConfigOpen(false)} />
      <E2EEConfig open={e2EEConfigOpen} onClose={() => sete2EEConfigOpen(false)} />
      <ESLintConfigEditor open={eSLintConfigEditorOpen} onClose={() => seteSLintConfigEditorOpen(false)} />
      <EdgeFunctionDeployer open={edgeFunctionDeployerOpen} onClose={() => setedgeFunctionDeployerOpen(false)} />
      <EnergyMetricsPanel open={energyMetricsPanelOpen} onClose={() => setenergyMetricsPanelOpen(false)} />
      <FaceIDConfig open={faceIDConfigOpen} onClose={() => setfaceIDConfigOpen(false)} />
      <FirebaseConfig open={firebaseConfigOpen} onClose={() => setfirebaseConfigOpen(false)} />
      <FoldableSupportConfig open={foldableSupportConfigOpen} onClose={() => setfoldableSupportConfigOpen(false)} />
      <GitHubActionsBuilder open={gitHubActionsBuilderOpen} onClose={() => setgitHubActionsBuilderOpen(false)} />
      <GlassmorphismDesigner open={glassmorphismDesignerOpen} onClose={() => setglassmorphismDesignerOpen(false)} />
      <GraphQLClientBuilder open={graphQLClientBuilderOpen} onClose={() => setgraphQLClientBuilderOpen(false)} />
      <JetpackComposePreview open={jetpackComposePreviewOpen} onClose={() => setjetpackComposePreviewOpen(false)} />
      <KotlinCodeGenerator open={kotlinCodeGeneratorOpen} onClose={() => setkotlinCodeGeneratorOpen(false)} />
      <LiDARScannerConfig open={liDARScannerConfigOpen} onClose={() => setliDARScannerConfigOpen(false)} />
      <LottieAnimationImporter open={lottieAnimationImporterOpen} onClose={() => setlottieAnimationImporterOpen(false)} />
      <MLKitIntegrator open={mLKitIntegratorOpen} onClose={() => setmLKitIntegratorOpen(false)} />
      <MaterialDesign3ThemeBuilder open={materialDesign3ThemeBuilderOpen} onClose={() => setmaterialDesign3ThemeBuilderOpen(false)} />
      <MicroInteractionsStudio open={microInteractionsStudioOpen} onClose={() => setmicroInteractionsStudioOpen(false)} />
      <ModuleFederationConfig open={moduleFederationConfigOpen} onClose={() => setmoduleFederationConfigOpen(false)} />
      <NFCConfigurator open={nFCConfiguratorOpen} onClose={() => setnFCConfiguratorOpen(false)} />
      <NeumorphismDesigner open={neumorphismDesignerOpen} onClose={() => setneumorphismDesignerOpen(false)} />
      <OAuthConfig open={oAuthConfigOpen} onClose={() => setoAuthConfigOpen(false)} />
      <OTAUpdateManager open={oTAUpdateManagerOpen} onClose={() => setoTAUpdateManagerOpen(false)} />
      <OnDeviceLLMConfig open={onDeviceLLMConfigOpen} onClose={() => setonDeviceLLMConfigOpen(false)} />
      <PWAConfigurator open={pWAConfiguratorOpen} onClose={() => setpWAConfiguratorOpen(false)} />
      <PredictiveAnalyticsConfig open={predictiveAnalyticsConfigOpen} onClose={() => setpredictiveAnalyticsConfigOpen(false)} />
      <PrettierConfigEditor open={prettierConfigEditorOpen} onClose={() => setprettierConfigEditorOpen(false)} />
      <R8ProGuardConfig open={r8ProGuardConfigOpen} onClose={() => setr8ProGuardConfigOpen(false)} />
      <RiveAnimationImporter open={riveAnimationImporterOpen} onClose={() => setriveAnimationImporterOpen(false)} />
      <SFSymbolsBrowser open={sFSymbolsBrowserOpen} onClose={() => setsFSymbolsBrowserOpen(false)} />
      <SentryConfig open={sentryConfigOpen} onClose={() => setsentryConfigOpen(false)} />
      <ServiceWorkerManager open={serviceWorkerManagerOpen} onClose={() => setserviceWorkerManagerOpen(false)} />
      <SonarQubeIntegration open={sonarQubeIntegrationOpen} onClose={() => setsonarQubeIntegrationOpen(false)} />
      <SwiftCodeGenerator open={swiftCodeGeneratorOpen} onClose={() => setswiftCodeGeneratorOpen(false)} />
      <SwiftUIPreview open={swiftUIPreviewOpen} onClose={() => setswiftUIPreviewOpen(false)} />
      <TensorFlowLiteConfig open={tensorFlowLiteConfigOpen} onClose={() => settensorFlowLiteConfigOpen(false)} />
      <ViewTransitionsAPI open={viewTransitionsAPIOpen} onClose={() => setviewTransitionsAPIOpen(false)} />
      <WCAGComplianceChecker open={wCAGComplianceCheckerOpen} onClose={() => setwCAGComplianceCheckerOpen(false)} />
      <WearOSBuilder open={wearOSBuilderOpen} onClose={() => setwearOSBuilderOpen(false)} />
      <WebAssemblyCompiler open={webAssemblyCompilerOpen} onClose={() => setwebAssemblyCompilerOpen(false)} />
      <WebNotificationsConfig open={webNotificationsConfigOpen} onClose={() => setwebNotificationsConfigOpen(false)} />
      <WebRTCConfig open={webRTCConfigOpen} onClose={() => setwebRTCConfigOpen(false)} />
      <WebShareAPITester open={webShareAPITesterOpen} onClose={() => setwebShareAPITesterOpen(false)} />
      <WebVitalsMonitor open={webVitalsMonitorOpen} onClose={() => setwebVitalsMonitorOpen(false)} />
      <WidgetKitBuilder open={widgetKitBuilderOpen} onClose={() => setwidgetKitBuilderOpen(false)} />
      <GRPCServiceBuilder open={gRPCServiceBuilderOpen} onClose={() => setGRPCServiceBuilderOpen(false)} />
    </div>
  );
}

function SubToolbarBtn({ icon, label, onClick, disabled }: { icon: React.ReactNode; label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
    >
      {icon}
      {label}
    </button>
  );
}

function TypographyEditorModal({ open, onClose, config, onChange, colorScheme }: {
  open: boolean; onClose: () => void; config: TypographyConfig; onChange: (c: TypographyConfig) => void; colorScheme: ColorScheme;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] overflow-y-auto scrollbar-thin">
        <TypographyEditor config={config} onChange={onChange} colorScheme={colorScheme} />
      </div>
    </div>
  );
}

function DesignTab({
  regions, colorScheme, appName, onRegionClick, onColorChange, onAddElement, onScreenFlow, showGrid,
}: {
  regions: AppRegion[]; colorScheme: ColorScheme; appName: string;
  onRegionClick: (r: AppRegion) => void; onColorChange: (cs: ColorScheme) => void;
  onAddElement: (regionId: string, el: ScreenElement) => void; onScreenFlow: () => void; showGrid: boolean;
}) {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const selectedRegion = regions.find((r) => r.id === selectedRegionId) ?? regions[0];

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="w-56 shrink-0 border-r border-slate-800 bg-slate-950/30">
        <ComponentLibrary onAdd={(el) => selectedRegion && onAddElement(selectedRegion.id, el)} />
      </div>

      <div className={`flex-1 flex flex-col items-center justify-center p-4 min-h-[400px] relative overflow-hidden ${showGrid ? 'bg-grid-pattern' : ''}`}
        style={{ background: showGrid ? undefined : 'linear-gradient(to bottom, #0f172a, #020617)' }}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 w-full flex items-center justify-center">
          <PhonePreview regions={regions} colorScheme={colorScheme} appName={appName} onRegionClick={onRegionClick} />
        </div>
      </div>

      <div className="w-64 shrink-0 border-l border-slate-800 bg-slate-950/30 overflow-y-auto scrollbar-thin">
        <div className="border-b border-slate-800">
          <div className="px-4 pt-3 pb-2">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Active Screen</p>
            <select
              value={selectedRegionId ?? ''}
              onChange={(e) => setSelectedRegionId(e.target.value)}
              className="w-full rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 px-2 py-1.5 focus:outline-none"
            >
              {regions.map((r) => (<option key={r.id} value={r.id}>{r.region_name}</option>))}
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
  regions, stages, buildComplete, incompleteCount,
  onDeploy, onExport, onStore, onVersions, onPush, onOnboarding, onApi, onShare, onErrors,
}: {
  regions: AppRegion[]; stages: BuildStage[]; buildComplete: boolean; incompleteCount: number;
  onDeploy: () => void; onExport: () => void; onStore: () => void; onVersions: () => void;
  onPush: () => void; onOnboarding: () => void; onApi: () => void; onShare: () => void; onErrors: () => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin p-6 bg-slate-950/30">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <DeployIcon className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-200">Deployment & Distribution</h3>
        </div>

        <DeployCard title="Deploy to Cloud" description="Build and deploy to preview, staging, or production." icon={<Rocket className="w-5 h-5" />} onClick={onDeploy} disabled={!buildComplete && incompleteCount > 0} status={buildComplete ? 'Ready' : `${incompleteCount} pending`} />
        <DeployCard title="Export Code" description="Download source code for 5 platforms." icon={<Code2 className="w-5 h-5" />} onClick={onExport} status="5 targets" />
        <DeployCard title="App Store Assets" description="Generate icon, screenshots, description, and keywords." icon={<Store className="w-5 h-5" />} onClick={onStore} status="Auto-generated" />
        <DeployCard title="Push Notifications" description="Compose and send push notifications to users." icon={<Send className="w-5 h-5" />} onClick={onPush} status="Ready" />
        <DeployCard title="Onboarding Builder" description="Design a welcome flow for new users." icon={<Sparkles className="w-5 h-5" />} onClick={onOnboarding} status="3 steps" />
        <DeployCard title="API Explorer" description="Browse and test REST API endpoints." icon={<Code2 className="w-5 h-5" />} onClick={onApi} status="10+ endpoints" />
        <DeployCard title="Share Preview" description="Generate a public link to share your app." icon={<Share2 className="w-5 h-5" />} onClick={onShare} status="Copy link" />
        <DeployCard title="Error Monitor" description="Track crashes and runtime errors." icon={<Bug className="w-5 h-5" />} onClick={onErrors} status={`${incompleteCount} issues`} />
        <DeployCard title="Version History" description="View change log and version timeline." icon={<GitBranch className="w-5 h-5" />} onClick={onVersions} status="7 versions" />

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-3">Build Summary</h4>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div><p className="text-2xl font-bold text-slate-100">{regions.length}</p><p className="text-xs text-slate-500">Screens</p></div>
            <div><p className="text-2xl font-bold text-slate-100">{stages.length}</p><p className="text-xs text-slate-500">Build Steps</p></div>
            <div><p className="text-2xl font-bold text-emerald-400">{stages.filter((s) => s.status === 'completed').length}</p><p className="text-xs text-slate-500">Completed</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeployCard({ title, description, icon, onClick, disabled, status }: {
  title: string; description: string; icon: React.ReactNode; onClick: () => void; disabled?: boolean; status: string;
}) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-full flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4 text-left hover:border-slate-700 hover:bg-slate-900/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed group animate-fade-in-up">
      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors shrink-0">{icon}</div>
      <div className="flex-1"><h4 className="text-sm font-semibold text-slate-200">{title}</h4><p className="text-xs text-slate-500 mt-0.5">{description}</p></div>
      <div className="text-right shrink-0"><span className="text-xs text-slate-400">{status}</span><ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all mt-1" /></div>
    </button>
  );
}

function RightSidebar({ activeTab, regions, stages, colorScheme, platform, appName, appType, isBuilding, buildComplete, incompleteCount, onDeploy }: {
  activeTab: BuilderTab; regions: AppRegion[]; stages: BuildStage[]; colorScheme: ColorScheme; platform: Platform;
  appName: string; appType: string; isBuilding: boolean; buildComplete: boolean; incompleteCount: number; onDeploy: () => void;
}) {
  if (activeTab === 'audit') return <BuildMetrics regions={regions} stages={stages} />;
  if (activeTab === 'deploy') return (
    <div className="p-4 space-y-3">
      <BuildStatusPanel isBuilding={isBuilding} buildComplete={buildComplete} incompleteCount={incompleteCount} platform={platform} appName={appName} onDeploy={onDeploy} />
      <ActivityLog appName={appName} />
    </div>
  );
  if (activeTab === 'analytics' || activeTab === 'performance') return <ActivityLog appName={appName} />;
  return <AIChat appName={appName} appType={appType} screenCount={regions.length} />;
}

function BuildStatusPanel({ isBuilding, buildComplete, incompleteCount, platform, appName, onDeploy }: {
  isBuilding: boolean; buildComplete: boolean; incompleteCount: number; platform: Platform; appName: string; onDeploy: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Status</h3>
        {isBuilding ? <div className="flex items-center gap-2 text-sm text-cyan-400"><Loader2 className="w-4 h-4 animate-spin" />Building...</div>
        : buildComplete ? <div className="flex items-center gap-2 text-sm text-emerald-400"><CheckCircle2 className="w-4 h-4" />Build complete</div>
        : <div className="text-sm text-slate-500">Idle</div>}
      </div>
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 space-y-2">
        <div className="flex justify-between text-xs"><span className="text-slate-500">App name</span><span className="text-slate-300 font-medium">{appName}</span></div>
        <div className="flex justify-between text-xs"><span className="text-slate-500">Platform</span><span className="text-slate-300 font-medium">{platformLabel(platform)}</span></div>
      </div>
      {buildComplete && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center gap-2 mb-2"><Rocket className="w-4 h-4 text-emerald-400" /><h4 className="text-sm font-semibold text-slate-200">Ready to deploy</h4></div>
          <p className="text-xs text-slate-500 mb-3">Your app has been built successfully. Tap incomplete regions to finish them.</p>
          {incompleteCount > 0 && <div className="flex items-center gap-2 text-xs text-amber-400 mb-3"><Sparkles className="w-3.5 h-3.5" />{incompleteCount} region{incompleteCount > 1 ? 's' : ''} need completion</div>}
          <button onClick={onDeploy} disabled={incompleteCount > 0} className="w-full rounded-lg py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50">{incompleteCount > 0 ? 'Complete all regions first' : 'Deploy to store'}</button>
        </div>
      )}
    </div>
  );
}

function generateSchema(regions: AppRegion[], appName: string) {
  const tables: { name: string; columns: { name: string; type: string; isPrimary?: boolean; isForeign?: boolean }[] }[] = [
    { name: 'users', columns: [{ name: 'id', type: 'uuid', isPrimary: true }, { name: 'email', type: 'text' }, { name: 'name', type: 'text' }, { name: 'created_at', type: 'timestamptz' }] },
    { name: appName.toLowerCase().replace(/\s+/g, '_') + '_data', columns: [{ name: 'id', type: 'uuid', isPrimary: true }, { name: 'user_id', type: 'uuid', isForeign: true }, { name: 'title', type: 'text' }, { name: 'status', type: 'text' }, { name: 'created_at', type: 'timestamptz' }] },
  ];
  if (!regions.some((r) => r.region_type === 'auth')) tables.shift();
  return tables;
}

function generateSQL(tables: { name: string; columns: { name: string; type: string; isPrimary?: boolean; isForeign?: boolean }[] }[]): string {
  return tables.map((t) => `CREATE TABLE ${t.name} (\n${t.columns.map((c) => `  ${c.name} ${c.type}${c.isPrimary ? ' PRIMARY KEY DEFAULT gen_random_uuid()' : ''}${c.isForeign ? ` REFERENCES ${t.name === 'users' ? 'profiles' : 'users'}(id)` : ''}`).join(',\n')}\n);`).join('\n\n');
}
