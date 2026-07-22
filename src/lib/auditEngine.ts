import type {
  AppRegion,
  AuditCategory,
  AuditIssue,
  ColorScheme,
  ScreenElement,
  ScreenSpec,
} from '@/types/builder';

export function runAudit(
  regions: AppRegion[],
  colorScheme: ColorScheme,
  platform: string,
): AuditCategory[] {
  const completed = regions.filter((r) => r.status === 'complete');
  const specs = completed.map((r) => r.spec);
  const allElements = specs.flatMap((s) => s.elements);

  return [
    auditAccessibility(allElements, colorScheme),
    auditPerformance(allElements, specs),
    auditBestPractices(allElements, completed),
    auditSecurity(specs),
    auditSEO(allElements, specs),
  ];
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = luminance(hex1);
  const l2 = luminance(hex2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function luminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const channel = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function auditAccessibility(elements: ScreenElement[], cs: ColorScheme): AuditCategory {
  const issues: AuditIssue[] = [];
  const textContrast = contrastRatio(cs.text, cs.background);
  const buttonContrast = contrastRatio('#ffffff', cs.primary);

  if (textContrast < 4.5) {
    issues.push({
      severity: 'high',
      message: `Text/background contrast ratio is ${textContrast.toFixed(1)}:1 (minimum 4.5:1)`,
      element: 'Global text',
    });
  }
  if (buttonContrast < 4.5) {
    issues.push({
      severity: 'medium',
      message: `Button text contrast ratio is ${buttonContrast.toFixed(1)}:1`,
      element: 'Primary buttons',
    });
  }
  const buttons = elements.filter((e) => e.kind === 'button');
  for (const btn of buttons) {
    if (!btn.label || btn.label.length < 3) {
      issues.push({
        severity: 'low',
        message: 'Button has no or very short label — may be unclear for screen readers',
        element: btn.label || 'unnamed button',
      });
    }
  }
  const inputs = elements.filter((e) => e.kind === 'input');
  for (const input of inputs) {
    if (!input.placeholder) {
      issues.push({
        severity: 'medium',
        message: 'Input field has no placeholder or label for accessibility',
        element: 'input field',
      });
    }
  }
  const images = elements.filter((e) => e.kind === 'image');
  for (const img of images) {
    if (!img.label) {
      issues.push({
        severity: 'medium',
        message: 'Image has no alt text for screen readers',
        element: 'image',
      });
    }
  }
  const score = Math.max(0, 100 - issues.reduce((sum, i) => sum + (i.severity === 'high' ? 20 : i.severity === 'medium' ? 10 : 5), 0));
  return { name: 'Accessibility', score, maxScore: 100, issues };
}

function auditPerformance(elements: ScreenElement[], specs: ScreenSpec[]): AuditCategory {
  const issues: AuditIssue[] = [];
  const imageCount = elements.filter((e) => e.kind === 'image').length;
  if (imageCount > 5) {
    issues.push({
      severity: 'medium',
      message: `${imageCount} images on screen — consider lazy loading`,
    });
  }
  const listItems = elements.filter((e) => e.kind === 'list');
  for (const list of listItems) {
    if (list.items && list.items.length > 20) {
      issues.push({
        severity: 'medium',
        message: 'List with 20+ items — use virtualized list for performance',
      });
    }
  }
  if (specs.length > 15) {
    issues.push({
      severity: 'low',
      message: `${specs.length} screens — consider code splitting for faster initial load`,
    });
  }
  const statCount = elements.filter((e) => e.kind === 'stat').length;
  if (statCount > 6) {
    issues.push({
      severity: 'low',
      message: 'Many stat cards — consider memoization to prevent unnecessary re-renders',
    });
  }
  const score = Math.max(0, 100 - issues.reduce((sum, i) => sum + (i.severity === 'high' ? 25 : i.severity === 'medium' ? 12 : 5), 0));
  return { name: 'Performance', score, maxScore: 100, issues };
}

function auditBestPractices(elements: ScreenElement[], regions: AppRegion[]): AuditCategory {
  const issues: AuditIssue[] = [];
  const hasTabBar = elements.some((e) => e.kind === 'tabbar');
  if (!hasTabBar && regions.length > 3) {
    issues.push({
      severity: 'medium',
      message: 'App has multiple screens but no bottom tab bar for navigation',
    });
  }
  const hasInput = elements.some((e) => e.kind === 'input');
  const hasButton = elements.some((e) => e.kind === 'button');
  if (hasInput && !hasButton) {
    issues.push({
      severity: 'low',
      message: 'Forms have inputs but no submit button',
    });
  }
  const hasSettings = regions.some((r) => r.region_type === 'settings');
  if (!hasSettings) {
    issues.push({
      severity: 'low',
      message: 'No settings screen found — users expect app preferences',
    });
  }
  const score = Math.max(0, 100 - issues.reduce((sum, i) => sum + (i.severity === 'high' ? 25 : i.severity === 'medium' ? 12 : 5), 0));
  return { name: 'Best Practices', score, maxScore: 100, issues };
}

function auditSecurity(specs: ScreenSpec[]): AuditCategory {
  const issues: AuditIssue[] = [];
  const hasAuth = specs.some((s) => s.regionType === 'auth');
  if (!hasAuth) {
    issues.push({
      severity: 'high',
      message: 'No authentication screen — user data is unprotected',
    });
  }
  const inputs = specs.flatMap((s) => s.elements).filter((e) => e.kind === 'input');
  const hasPasswordInput = inputs.some((i) => i.placeholder?.toLowerCase().includes('password'));
  if (hasAuth && !hasPasswordInput) {
    issues.push({
      severity: 'medium',
      message: 'Auth screen has no password field',
    });
  }
  const score = Math.max(0, 100 - issues.reduce((sum, i) => sum + (i.severity === 'high' ? 30 : i.severity === 'medium' ? 15 : 5), 0));
  return { name: 'Security', score, maxScore: 100, issues };
}

function auditSEO(elements: ScreenElement[], specs: ScreenSpec[]): AuditCategory {
  const issues: AuditIssue[] = [];
  if (specs.length > 0) {
    const firstScreen = specs[0];
    const hasHeader = firstScreen.elements.some((e) => e.kind === 'header');
    if (!hasHeader) {
      issues.push({
        severity: 'medium',
        message: 'Home screen has no H1 header for SEO indexing',
      });
    }
  }
  if (specs.length < 3) {
    issues.push({
      severity: 'low',
      message: 'Few screens — more content improves discoverability',
    });
  }
  const score = Math.max(0, 100 - issues.reduce((sum, i) => sum + (i.severity === 'high' ? 25 : i.severity === 'medium' ? 12 : 5), 0));
  return { name: 'SEO & Discoverability', score, maxScore: 100, issues };
}

export function overallScore(categories: AuditCategory[]): number {
  if (categories.length === 0) return 0;
  return Math.round(categories.reduce((sum, c) => sum + c.score, 0) / categories.length);
}

export function scoreColor(score: number): string {
  if (score >= 90) return '#10b981';
  if (score >= 70) return '#f59e0b';
  if (score >= 50) return '#f97316';
  return '#ef4444';
}
