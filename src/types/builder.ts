export type Platform = 'ios' | 'android' | 'both';
export type ProjectStatus = 'building' | 'completed' | 'failed';
export type StageStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
export type RegionStatus = 'complete' | 'incomplete' | 'building';

export type StageType =
  | 'analysis'
  | 'scaffold'
  | 'design'
  | 'screens'
  | 'database'
  | 'logic'
  | 'testing'
  | 'deploy';

export type RegionType =
  | 'screen'
  | 'component'
  | 'navigation'
  | 'data'
  | 'auth'
  | 'settings';

export type DeviceType = 'iphone' | 'android' | 'tablet';
export type PreviewTheme = 'light' | 'dark';
export type CodeTarget = 'react-native' | 'flutter' | 'swift' | 'kotlin' | 'web';
export type BuilderTab = 'design' | 'code' | 'database' | 'test' | 'deploy' | 'audit';
export type DeployEnvironment = 'preview' | 'staging' | 'production';
export type Language = 'en' | 'ar';

export interface AppSpec {
  appName: string;
  appType: string;
  features: string[];
  screens: ScreenSpec[];
  colorScheme: ColorScheme;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
}

export interface ScreenSpec {
  name: string;
  regionType: RegionType;
  elements: ScreenElement[];
  description: string;
  intentionallyIncomplete?: boolean;
}

export interface ScreenElement {
  kind: 'header' | 'text' | 'list' | 'button' | 'input' | 'image' | 'card' | 'tabbar' | 'stat' | 'avatar';
  label?: string;
  value?: string;
  items?: string[];
  placeholder?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface BuildStage {
  id: string;
  project_id: string;
  stage_name: string;
  stage_type: string;
  status: string;
  logs: string;
  sort_order: number;
  created_at: string;
}

export interface AppRegion {
  id: string;
  project_id: string;
  region_name: string;
  region_type: string;
  status: string;
  spec: ScreenSpec;
  description: string;
  sort_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  prompt: string;
  platform: string;
  app_type: string;
  status: string;
  config: { colorScheme?: ColorScheme };
  created_at: string;
  updated_at: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  prompt: string;
  features: string[];
  colorScheme: ColorScheme;
  screenCount: number;
  tags: string[];
}

export interface CodeArtifact {
  filename: string;
  language: string;
  content: string;
  target: CodeTarget;
}

export interface AuditCategory {
  name: string;
  score: number;
  maxScore: number;
  issues: AuditIssue[];
}

export interface AuditIssue {
  severity: 'high' | 'medium' | 'low';
  message: string;
  element?: string;
}

export interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'skip';
  duration: number;
  message?: string;
  suite: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface VersionEntry {
  id: string;
  version: string;
  timestamp: string;
  changes: string;
  author: string;
}

export interface BuildMetric {
  label: string;
  value: string;
  detail?: string;
  icon?: string;
}

export interface AppStoreMetadata {
  appName: string;
  subtitle: string;
  description: string;
  keywords: string[];
  category: string;
  iconColor: string;
  screenshots: string[];
}

export interface NavNode {
  id: string;
  label: string;
  screenName: string;
  x: number;
  y: number;
  type: RegionType;
}

export interface NavEdge {
  from: string;
  to: string;
  label: string;
}
