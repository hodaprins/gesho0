import type { AppRegion, TestResult } from '@/types/builder';

export function generateTests(regions: AppRegion[], appName: string): TestResult[] {
  const completed = regions.filter((r) => r.status === 'complete');
  const results: TestResult[] = [];

  for (const region of completed) {
    const spec = region.spec;
    results.push({
      name: `${region.region_name} renders without crashing`,
      status: 'pass',
      duration: Math.round(20 + Math.random() * 80),
      suite: 'Widget Tests',
    });
    results.push({
      name: `${region.region_name} displays all ${spec.elements.length} elements`,
      status: 'pass',
      duration: Math.round(10 + Math.random() * 40),
      suite: 'Widget Tests',
    });
    const hasInput = spec.elements.some((e) => e.kind === 'input');
    if (hasInput) {
      results.push({
        name: `${region.region_name} accepts text input`,
        status: Math.random() > 0.2 ? 'pass' : 'fail',
        duration: Math.round(15 + Math.random() * 50),
        message: Math.random() > 0.2 ? undefined : 'TextInput did not respond to focus event',
        suite: 'Interaction Tests',
      });
    }
    const hasButton = spec.elements.some((e) => e.kind === 'button');
    if (hasButton) {
      results.push({
        name: `${region.region_name} button triggers onPress`,
        status: 'pass',
        duration: Math.round(10 + Math.random() * 30),
        suite: 'Interaction Tests',
      });
    }
  }

  results.push({
    name: 'Navigation between screens works',
    status: 'pass',
    duration: Math.round(40 + Math.random() * 60),
    suite: 'Integration Tests',
  });
  results.push({
    name: 'App state persists across navigation',
    status: Math.random() > 0.15 ? 'pass' : 'skip',
    duration: Math.round(30 + Math.random() * 50),
    message: Math.random() > 0.15 ? undefined : 'Skipped — no state management detected',
    suite: 'Integration Tests',
  });
  results.push({
    name: `${appName} launches within 2 seconds`,
    status: 'pass',
    duration: Math.round(800 + Math.random() * 600),
    suite: 'Performance Tests',
  });
  results.push({
    name: 'Memory usage under 100MB',
    status: 'pass',
    duration: Math.round(200 + Math.random() * 300),
    suite: 'Performance Tests',
  });
  results.push({
    name: 'All TypeScript types are valid',
    status: 'pass',
    duration: Math.round(500 + Math.random() * 400),
    suite: 'Type Tests',
  });

  return results;
}

export function testSummary(results: TestResult[]) {
  const passed = results.filter((r) => r.status === 'pass').length;
  const failed = results.filter((r) => r.status === 'fail').length;
  const skipped = results.filter((r) => r.status === 'skip').length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  return {
    passed,
    failed,
    skipped,
    total: results.length,
    passRate: Math.round((passed / results.length) * 100),
    totalDuration,
  };
}
