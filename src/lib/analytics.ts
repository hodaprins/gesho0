export interface AnalyticsDataPoint {
  label: string;
  value: number;
}

export interface AnalyticsSeries {
  name: string;
  color: string;
  data: AnalyticsDataPoint[];
}

export function generateAnalytics(screenCount: number): {
  users: AnalyticsSeries;
  sessions: AnalyticsSeries;
  retention: AnalyticsSeries;
  crashes: AnalyticsSeries;
  topScreens: AnalyticsDataPoint[];
  deviceBreakdown: { label: string; value: number; color: string }[];
  metrics: { label: string; value: string; trend: number }[];
} {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const gen = (base: number, variance: number) =>
    days.map((d) => ({ label: d, value: Math.round(base + Math.random() * variance) }));

  return {
    users: { name: 'Daily Users', color: '#14b8a6', data: gen(320, 180) },
    sessions: { name: 'Sessions', color: '#0ea5e9', data: gen(540, 240) },
    retention: { name: 'Retention %', color: '#f59e0b', data: gen(68, 22) },
    crashes: { name: 'Crashes', color: '#ef4444', data: gen(3, 8) },
    topScreens: Array.from({ length: Math.min(screenCount, 6) }, (_, i) => ({
      label: `Screen ${i + 1}`,
      value: Math.round(500 - i * 70 + Math.random() * 50),
    })),
    deviceBreakdown: [
      { label: 'iOS', value: 58, color: '#0ea5e9' },
      { label: 'Android', value: 36, color: '#10b981' },
      { label: 'Web', value: 6, color: '#f59e0b' },
    ],
    metrics: [
      { label: 'DAU', value: '1,847', trend: 12.3 },
      { label: 'MAU', value: '24,103', trend: 8.1 },
      { label: 'Avg Session', value: '4m 32s', trend: 5.2 },
      { label: 'Crash Rate', value: '0.12%', trend: -2.1 },
      { label: 'Retention D7', value: '42%', trend: 3.4 },
      { label: 'App Rating', value: '4.7', trend: 0.1 },
    ],
  };
}

export function generateApiEndpoints(appType: string, screenCount: number) {
  const base = appType.toLowerCase().replace(/[^a-z]/g, '-');
  const endpoints = [
    { method: 'GET', path: `/api/v1/${base}`, description: 'List all items', auth: false },
    { method: 'GET', path: `/api/v1/${base}/:id`, description: 'Get single item', auth: false },
    { method: 'POST', path: `/api/v1/${base}`, description: 'Create new item', auth: true },
    { method: 'PUT', path: `/api/v1/${base}/:id`, description: 'Update item', auth: true },
    { method: 'DELETE', path: `/api/v1/${base}/:id`, description: 'Delete item', auth: true },
    { method: 'GET', path: `/api/v1/${base}/search`, description: 'Search items', auth: false },
    { method: 'POST', path: `/api/v1/auth/login`, description: 'User login', auth: false },
    { method: 'POST', path: `/api/v1/auth/register`, description: 'User registration', auth: false },
    { method: 'GET', path: `/api/v1/auth/me`, description: 'Get current user', auth: true },
    { method: 'POST', path: `/api/v1/upload`, description: 'Upload file', auth: true },
  ];
  return endpoints.slice(0, Math.min(endpoints.length, 6 + Math.floor(screenCount / 2)));
}

export function generateSeedData(appType: string) {
  const samples: Record<string, { table: string; rows: Record<string, string>[] }[]> = {
    ecommerce: [
      {
        table: 'products',
        rows: [
          { id: 'uuid-1', name: 'Wireless Headphones', price: '$99.99', stock: '42' },
          { id: 'uuid-2', name: 'Phone Case', price: '$24.99', stock: '120' },
          { id: 'uuid-3', name: 'USB Cable', price: '$12.99', stock: '300' },
        ],
      },
    ],
    fitness: [
      {
        table: 'workouts',
        rows: [
          { id: 'uuid-1', type: 'Running', duration: '30 min', calories: '320' },
          { id: 'uuid-2', type: 'Cycling', duration: '45 min', calories: '410' },
          { id: 'uuid-3', type: 'Yoga', duration: '20 min', calories: '120' },
        ],
      },
    ],
    todo: [
      {
        table: 'tasks',
        rows: [
          { id: 'uuid-1', title: 'Buy groceries', status: 'pending', due: '2026-07-23' },
          { id: 'uuid-2', title: 'Call mom', status: 'done', due: '2026-07-22' },
          { id: 'uuid-3', title: 'Finish report', status: 'pending', due: '2026-07-25' },
        ],
      },
    ],
  };
  return samples[appType] ?? [
    {
      table: 'items',
      rows: [
        { id: 'uuid-1', name: 'Sample Item 1', status: 'active' },
        { id: 'uuid-2', name: 'Sample Item 2', status: 'active' },
        { id: 'uuid-3', name: 'Sample Item 3', status: 'inactive' },
      ],
    },
  ];
}

export function generateErrorLog(screenCount: number) {
  const errors = [
    { id: 1, screen: 'Home', type: 'TypeError', message: 'Cannot read property "map" of undefined', count: 3, severity: 'high', time: '2m ago' },
    { id: 2, screen: 'Settings', type: 'Warning', message: 'Key prop missing in list item', count: 12, severity: 'low', time: '15m ago' },
    { id: 3, screen: 'Login', type: 'NetworkError', message: 'Request timeout after 5000ms', count: 1, severity: 'medium', time: '1h ago' },
    { id: 4, screen: 'Detail', type: 'RangeError', message: 'Maximum call stack exceeded', count: 1, severity: 'high', time: '3h ago' },
  ];
  return errors.slice(0, Math.min(errors.length, 2 + Math.floor(screenCount / 2)));
}

export function generateActivityLog(appName: string) {
  return [
    { id: 1, action: 'Created project', target: appName, time: 'Just now', icon: 'plus' },
    { id: 2, action: 'Added screen', target: 'Home', time: '1m ago', icon: 'screen' },
    { id: 3, action: 'Edited theme', target: 'Emerald preset', time: '2m ago', icon: 'palette' },
    { id: 4, action: 'Generated code', target: 'React Native', time: '5m ago', icon: 'code' },
    { id: 5, action: 'Ran tests', target: '12 passed', time: '8m ago', icon: 'test' },
    { id: 6, action: 'Audit completed', target: 'Score: 87', time: '10m ago', icon: 'audit' },
  ];
}

export function generateNotifications(appName: string) {
  return [
    { id: 1, title: 'Build complete', body: `${appName} is ready to deploy`, time: 'Just now', read: false, type: 'success' },
    { id: 2, title: '2 incomplete regions', body: 'Tap to complete remaining screens', time: '5m ago', read: false, type: 'warning' },
    { id: 3, title: 'Code generated', body: 'React Native output ready in Code tab', time: '10m ago', read: true, type: 'info' },
    { id: 4, title: 'Audit finished', body: 'Overall score: 87/100', time: '15m ago', read: true, type: 'info' },
  ];
}
