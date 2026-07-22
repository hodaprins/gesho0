import { useState } from 'react';
import {
  ShoppingBag,
  Dumbbell,
  Users,
  CheckSquare,
  Wallet,
  MessageCircle,
  ChefHat,
  Calendar,
  GraduationCap,
  Newspaper,
  Music,
  Flame,
  type LucideIcon,
} from 'lucide-react';
import { PROJECT_TEMPLATES, TEMPLATE_CATEGORIES } from '@/lib/templates';
import type { ProjectTemplate } from '@/types/builder';

interface TemplatesGalleryProps {
  onSelect: (template: ProjectTemplate) => void;
}

const ICONS: Record<string, LucideIcon> = {
  ShoppingBag,
  Dumbbell,
  Users,
  CheckSquare,
  Wallet,
  MessageCircle,
  ChefHat,
  Calendar,
  GraduationCap,
  Newspaper,
  Music,
  Flame,
};

export default function TemplatesGallery({ onSelect }: TemplatesGalleryProps) {
  const [category, setCategory] = useState('all');

  const filtered =
    category === 'all'
      ? PROJECT_TEMPLATES
      : PROJECT_TEMPLATES.filter((t) => t.category === category);

  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5 flex-wrap mb-4">
        {TEMPLATE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`text-xs px-3 py-1.5 rounded-full capitalize transition-colors ${
              category === cat
                ? 'bg-slate-800 text-slate-100'
                : 'text-slate-500 hover:text-slate-300 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((template) => {
          const Icon = ICONS[template.icon] ?? ShoppingBag;
          return (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className="group text-left rounded-xl border border-slate-800 bg-slate-900/40 p-3 hover:border-slate-700 hover:bg-slate-900/80 transition-all animate-fade-in-up"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-transform group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${template.colorScheme.primary}, ${template.colorScheme.secondary})`,
                }}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-sm font-semibold text-slate-200 mb-0.5 truncate">
                {template.name}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2 mb-2">{template.description}</p>
              <div className="flex items-center gap-1 flex-wrap">
                {template.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
                <span className="text-[9px] text-slate-600 ml-auto">{template.screenCount} screens</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
