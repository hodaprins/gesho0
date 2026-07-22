export interface ScreenTemplateDef {
  id: string;
  name: string;
  category: string;
  description: string;
  elements: import('@/types/builder').ScreenElement[];
  regionType: import('@/types/builder').RegionType;
}

export const SCREEN_TEMPLATES: ScreenTemplateDef[] = [
  {
    id: 'login',
    name: 'Login Screen',
    category: 'auth',
    description: 'Email/password sign-in with social login',
    regionType: 'auth',
    elements: [
      { kind: 'header', label: 'Welcome back' },
      { kind: 'input', placeholder: 'Email address' },
      { kind: 'input', placeholder: 'Password' },
      { kind: 'button', label: 'Sign in', variant: 'primary' },
      { kind: 'button', label: 'Continue with Google', variant: 'secondary' },
      { kind: 'text', label: "Don't have an account? Sign up" },
    ],
  },
  {
    id: 'signup',
    name: 'Sign Up Screen',
    category: 'auth',
    description: 'Registration form with name, email, password',
    regionType: 'auth',
    elements: [
      { kind: 'header', label: 'Create account' },
      { kind: 'input', placeholder: 'Full name' },
      { kind: 'input', placeholder: 'Email address' },
      { kind: 'input', placeholder: 'Password' },
      { kind: 'button', label: 'Sign up', variant: 'primary' },
    ],
  },
  {
    id: 'list',
    name: 'List View',
    category: 'content',
    description: 'Scrollable list with search bar and add button',
    regionType: 'screen',
    elements: [
      { kind: 'header', label: 'Items' },
      { kind: 'input', placeholder: 'Search...' },
      { kind: 'list', items: ['Item one', 'Item two', 'Item three', 'Item four'] },
      { kind: 'button', label: '+ Add new', variant: 'primary' },
      { kind: 'tabbar' },
    ],
  },
  {
    id: 'detail',
    name: 'Detail View',
    category: 'content',
    description: 'Item detail with image, text, and action button',
    regionType: 'screen',
    elements: [
      { kind: 'header', label: 'Details' },
      { kind: 'image', label: 'Hero image' },
      { kind: 'text', label: 'Description text goes here' },
      { kind: 'stat', label: 'Rating', value: '4.8' },
      { kind: 'button', label: 'Take action', variant: 'primary' },
    ],
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    category: 'data',
    description: 'Stats grid with chart card and quick actions',
    regionType: 'data',
    elements: [
      { kind: 'header', label: 'Dashboard' },
      { kind: 'stat', label: 'Total', value: '1,284' },
      { kind: 'stat', label: 'Active', value: '342' },
      { kind: 'card', label: 'Weekly activity', items: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
      { kind: 'button', label: 'View reports', variant: 'primary' },
      { kind: 'tabbar' },
    ],
  },
  {
    id: 'settings',
    name: 'Settings Screen',
    category: 'settings',
    description: 'Profile, preferences, and app info',
    regionType: 'settings',
    elements: [
      { kind: 'header', label: 'Settings' },
      { kind: 'avatar', label: 'User name' },
      { kind: 'list', items: ['Notifications', 'Dark mode', 'Privacy', 'About'] },
    ],
  },
  {
    id: 'profile',
    name: 'Profile Screen',
    category: 'content',
    description: 'User profile with avatar and stats',
    regionType: 'screen',
    elements: [
      { kind: 'header', label: 'Profile' },
      { kind: 'avatar', label: 'Jane Doe' },
      { kind: 'stat', label: 'Posts', value: '42' },
      { kind: 'stat', label: 'Followers', value: '1.2K' },
      { kind: 'button', label: 'Edit profile', variant: 'secondary' },
      { kind: 'tabbar' },
    ],
  },
  {
    id: 'chat',
    name: 'Chat Screen',
    category: 'communication',
    description: 'Message bubbles with input bar',
    regionType: 'screen',
    elements: [
      { kind: 'header', label: 'Chat' },
      { kind: 'card', label: 'Hello! How are you?' },
      { kind: 'card', label: "I'm great, thanks!" },
      { kind: 'input', placeholder: 'Type a message...' },
      { kind: 'button', label: 'Send', variant: 'primary' },
    ],
  },
  {
    id: 'gallery',
    name: 'Image Gallery',
    category: 'media',
    description: 'Grid of images with titles',
    regionType: 'screen',
    elements: [
      { kind: 'header', label: 'Gallery' },
      { kind: 'image', label: 'Photo 1' },
      { kind: 'image', label: 'Photo 2' },
      { kind: 'image', label: 'Photo 3' },
      { kind: 'tabbar' },
    ],
  },
  {
    id: 'form',
    name: 'Form Screen',
    category: 'input',
    description: 'Multi-field form with submit button',
    regionType: 'screen',
    elements: [
      { kind: 'header', label: 'Form' },
      { kind: 'input', placeholder: 'First name' },
      { kind: 'input', placeholder: 'Last name' },
      { kind: 'input', placeholder: 'Email' },
      { kind: 'input', placeholder: 'Phone' },
      { kind: 'button', label: 'Submit', variant: 'primary' },
    ],
  },
];

export const SCREEN_TEMPLATE_CATEGORIES = ['all', 'auth', 'content', 'data', 'settings', 'communication', 'media', 'input'];
