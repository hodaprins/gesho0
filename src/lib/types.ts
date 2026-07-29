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

export interface BuildStage {
  id: string;
  project_id: string;
  stage_name: string;
  stage_type: string;
  status: 'pending' | 'in_progress' | 'completed';
  logs: string;
  sort_order: number;
  created_at: string;
}

export interface ScreenElement {
  id: string;
  type: string;
  label: string;
  icon?: string;
}

export interface ScreenSpec {
  name: string;
  regionType: string;
  description: string;
  intentionallyIncomplete?: boolean;
  elements: ScreenElement[];
}

export interface AppRegion {
  id: string;
  project_id: string;
  region_name: string;
  region_type: string;
  status: 'complete' | 'incomplete';
  spec: ScreenSpec;
  description: string;
  sort_order: number;
  created_at: string;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
}

export type BuilderTab = 'design' | 'code' | 'database' | 'test' | 'audit' | 'deploy';

export interface Command {
  id: string;
  label: string;
  shortcut?: string;
  icon: React.ReactNode;
  section: string;
  action: () => void;
}
