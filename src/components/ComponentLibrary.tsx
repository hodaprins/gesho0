import { useState } from 'react';
import {
  Type,
  Square,
  List,
  MousePointerClick,
  Image,
  LayoutGrid,
  BarChart3,
  CircleUser,
  Navigation,
  Search,
} from 'lucide-react';
import type { ScreenElement } from '@/types/builder';

interface ComponentLibraryProps {
  onAdd: (element: ScreenElement) => void;
}

const COMPONENTS: {
  kind: ScreenElement['kind'];
  label: string;
  icon: typeof Type;
  description: string;
  defaultElement: ScreenElement;
}[] = [
  { kind: 'header', label: 'Heading', icon: Type, description: 'Large title text', defaultElement: { kind: 'header', label: 'New Heading' } },
  { kind: 'text', label: 'Text', icon: Type, description: 'Body paragraph', defaultElement: { kind: 'text', label: 'New text content' } },
  { kind: 'button', label: 'Button', icon: MousePointerClick, description: 'Action button', defaultElement: { kind: 'button', label: 'New Button', variant: 'primary' } },
  { kind: 'input', label: 'Input', icon: Square, description: 'Text input field', defaultElement: { kind: 'input', placeholder: 'Enter text...' } },
  { kind: 'card', label: 'Card', icon: LayoutGrid, description: 'Content card', defaultElement: { kind: 'card', label: 'Card title', value: 'Card value' } },
  { kind: 'list', label: 'List', icon: List, description: 'List of items', defaultElement: { kind: 'list', items: ['Item 1', 'Item 2', 'Item 3'] } },
  { kind: 'stat', label: 'Stat', icon: BarChart3, description: 'Statistics card', defaultElement: { kind: 'stat', label: 'Metric', value: '0' } },
  { kind: 'image', label: 'Image', icon: Image, description: 'Image placeholder', defaultElement: { kind: 'image', label: 'Image' } },
  { kind: 'avatar', label: 'Avatar', icon: CircleUser, description: 'User avatar row', defaultElement: { kind: 'avatar', label: 'User Name' } },
  { kind: 'tabbar', label: 'Tab Bar', icon: Navigation, description: 'Bottom navigation', defaultElement: { kind: 'tabbar' } },
];

export default function ComponentLibrary({ onAdd }: ComponentLibraryProps) {
  const [search, setSearch] = useState('');

  const filtered = COMPONENTS.filter((c) =>
    c.label.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <LayoutGrid className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200">Components</h3>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search components..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-700"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 grid grid-cols-2 gap-2">
        {filtered.map((comp) => {
          const Icon = comp.icon;
          return (
            <button
              key={comp.kind}
              onClick={() => onAdd(comp.defaultElement)}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/json', JSON.stringify(comp.defaultElement));
              }}
              className="group flex flex-col items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/40 p-3 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all active:scale-95 cursor-grab"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              </div>
              <span className="text-xs text-slate-300 font-medium">{comp.label}</span>
              <span className="text-[10px] text-slate-600 text-center">{comp.description}</span>
            </button>
          );
        })}
      </div>

      <div className="px-3 py-2 border-t border-slate-800 text-center">
        <p className="text-[10px] text-slate-600">Drag or tap to add to screen</p>
      </div>
    </div>
  );
}
