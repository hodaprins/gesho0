import { useEffect, useState } from 'react';
import { ChevronLeft, Search, Plus, Bell, Heart, MessageCircle, Share, Home, User, Grid2x2 as Grid, Settings as SettingsIcon, AlertCircle, Lock, Play, Image as ImageIcon, TrendingUp, Check, Smartphone, Tablet, Sun, Moon, Languages, Crosshair } from 'lucide-react';
import type { AppRegion, ColorScheme, ScreenSpec, ScreenElement, DeviceType, PreviewTheme, Language } from '@/types/builder';
import { translate } from '@/lib/i18n';

interface PhonePreviewProps {
  regions: AppRegion[];
  colorScheme: ColorScheme;
  appName: string;
  onRegionClick: (region: AppRegion) => void;
}

export default function PhonePreview({ regions, colorScheme, appName, onRegionClick }: PhonePreviewProps) {
  const completeRegions = regions.filter((r) => r.status === 'complete' || r.status === 'building');
  const [activeIdx, setActiveIdx] = useState(0);
  const [device, setDevice] = useState<DeviceType>('iphone');
  const [theme, setTheme] = useState<PreviewTheme>('light');
  const [lang, setLang] = useState<Language>('en');
  const [inspector, setInspector] = useState(false);
  const [selectedElement, setSelectedElement] = useState<number | null>(null);

  useEffect(() => {
    if (activeIdx > 0 && activeIdx >= completeRegions.length) {
      setActiveIdx(0);
    }
  }, [completeRegions.length, activeIdx]);

  if (completeRegions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-7 h-7 text-slate-600" />
          </div>
          <p className="text-sm text-slate-500">Waiting for screens...</p>
        </div>
      </div>
    );
  }

  const safeIdx = Math.min(activeIdx, completeRegions.length - 1);
  const region = completeRegions[safeIdx];

  const effectiveColors = theme === 'dark' ? toDarkScheme(colorScheme) : colorScheme;
  const frameSize = device === 'tablet' ? { width: 320, height: 480 } : { width: 260, height: 540 };

  return (
    <div className="flex flex-col items-center h-full p-4 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-3 flex-wrap justify-center">
        {/* Device toggle */}
        <div className="flex items-center gap-0.5 rounded-lg bg-slate-900 border border-slate-800 p-0.5">
          <ToolbarButton active={device === 'iphone'} onClick={() => setDevice('iphone')} icon={<Smartphone className="w-3.5 h-3.5" />} />
          <ToolbarButton active={device === 'android'} onClick={() => setDevice('android')} icon={<Smartphone className="w-3.5 h-3.5" />} />
          <ToolbarButton active={device === 'tablet'} onClick={() => setDevice('tablet')} icon={<Tablet className="w-3.5 h-3.5" />} />
        </div>

        {/* Theme toggle */}
        <div className="flex items-center gap-0.5 rounded-lg bg-slate-900 border border-slate-800 p-0.5">
          <ToolbarButton active={theme === 'light'} onClick={() => setTheme('light')} icon={<Sun className="w-3.5 h-3.5" />} />
          <ToolbarButton active={theme === 'dark'} onClick={() => setTheme('dark')} icon={<Moon className="w-3.5 h-3.5" />} />
        </div>

        {/* Language toggle */}
        <button
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Languages className="w-3.5 h-3.5" />
          {lang === 'en' ? 'EN' : 'AR'}
        </button>

        {/* Inspector */}
        <button
          onClick={() => setInspector(!inspector)}
          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs transition-colors ${
            inspector
              ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Crosshair className="w-3.5 h-3.5" />
          Inspect
        </button>
      </div>

      {/* Screen tabs */}
      <div className="flex items-center gap-1.5 mb-3 flex-wrap justify-center max-w-[400px]">
        {completeRegions.map((r, i) => (
          <button
            key={r.id}
            onClick={() => setActiveIdx(i)}
            className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
              i === safeIdx
                ? 'bg-slate-700 text-slate-100'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {translate(r.region_name, lang)}
          </button>
        ))}
      </div>

      <PhoneFrame device={device} size={frameSize}>
        <ScreenRenderer
          spec={region.spec}
          colorScheme={effectiveColors}
          appName={appName}
          isIncomplete={region.status === 'building'}
          onIncompleteClick={() => onRegionClick(region)}
          lang={lang}
          inspector={inspector}
          selectedElement={selectedElement}
          onSelectElement={setSelectedElement}
        />
      </PhoneFrame>

      <p className="text-xs text-slate-500 mt-3 text-center max-w-[240px] truncate">
        {region.description}
      </p>

      {/* Inspector panel */}
      {inspector && selectedElement !== null && region.spec.elements[selectedElement] && (
        <div className="mt-2 rounded-lg border border-slate-800 bg-slate-900 p-3 text-xs text-slate-300 w-full max-w-[300px]">
          <div className="flex items-center gap-2 mb-2">
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold capitalize">{region.spec.elements[selectedElement].kind}</span>
          </div>
          {region.spec.elements[selectedElement].label && (
            <div className="flex justify-between"><span className="text-slate-500">Label:</span><span>{region.spec.elements[selectedElement].label}</span></div>
          )}
          {region.spec.elements[selectedElement].value && (
            <div className="flex justify-between"><span className="text-slate-500">Value:</span><span>{region.spec.elements[selectedElement].value}</span></div>
          )}
          {region.spec.elements[selectedElement].placeholder && (
            <div className="flex justify-between"><span className="text-slate-500">Placeholder:</span><span>{region.spec.elements[selectedElement].placeholder}</span></div>
          )}
          {region.spec.elements[selectedElement].variant && (
            <div className="flex justify-between"><span className="text-slate-500">Variant:</span><span className="capitalize">{region.spec.elements[selectedElement].variant}</span></div>
          )}
        </div>
      )}
    </div>
  );
}

function ToolbarButton({ active, onClick, icon }: { active: boolean; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1.5 rounded-md transition-colors ${
        active ? 'bg-slate-700 text-slate-100' : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      {icon}
    </button>
  );
}

function PhoneFrame({ children, device, size }: { children: React.ReactNode; device: DeviceType; size: { width: number; height: number } }) {
  const radius = device === 'android' ? '1.5rem' : '2.5rem';
  const notch = device === 'android';

  return (
    <div
      className="relative border-[10px] bg-black shadow-2xl shadow-black/50"
      style={{
        width: size.width,
        height: size.height,
        borderRadius: radius,
        borderColor: '#1e293b',
      }}
    >
      {!notch && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-800 rounded-b-2xl z-20" />
      )}
      {notch && (
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-slate-700 z-20" />
      )}
      <div className="w-full h-full overflow-hidden relative bg-white" style={{ borderRadius: device === 'android' ? '0.75rem' : '1.75rem' }}>
        {children}
      </div>
    </div>
  );
}

function ScreenRenderer({
  spec,
  colorScheme,
  appName,
  isIncomplete,
  onIncompleteClick,
  lang,
  inspector,
  selectedElement,
  onSelectElement,
}: {
  spec: ScreenSpec;
  colorScheme: ColorScheme;
  appName: string;
  isIncomplete: boolean;
  onIncompleteClick: () => void;
  lang: Language;
  inspector: boolean;
  selectedElement: number | null;
  onSelectElement: (idx: number | null) => void;
}) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <div
      className="flex flex-col h-full text-sm"
      style={{ backgroundColor: colorScheme.background, color: colorScheme.text, direction: dir }}
    >
      <StatusBar colorScheme={colorScheme} />
      <ScreenHeader label={translate(spec.name, lang)} colorScheme={colorScheme} />
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-3 space-y-3">
        {spec.elements.map((el, idx) => (
          <div
            key={idx}
            onClick={() => inspector && onSelectElement(idx)}
            className={inspector ? 'cursor-pointer' : ''}
            style={
              inspector && selectedElement === idx
                ? { outline: '2px solid #06b6d4', outlineOffset: '2px', borderRadius: '8px' }
                : undefined
            }
          >
            <ElementRenderer
              element={el}
              colorScheme={colorScheme}
              appName={appName}
              lang={lang}
            />
          </div>
        ))}
        {isIncomplete && <IncompleteBanner onClick={onIncompleteClick} />}
      </div>
      {hasTabBar(spec) && <TabBar colorScheme={colorScheme} lang={lang} />}
    </div>
  );
}

function StatusBar({ colorScheme }: { colorScheme: ColorScheme }) {
  return (
    <div
      className="flex items-center justify-between px-5 pt-2 pb-1 text-[10px] font-semibold"
      style={{ color: colorScheme.text }}
    >
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <span className="w-3 h-2 rounded-[2px] border" style={{ borderColor: colorScheme.text }} />
        <span>100%</span>
      </span>
    </div>
  );
}

function ScreenHeader({ label, colorScheme }: { label: string; colorScheme: ColorScheme }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <button className="p-0.5" style={{ color: colorScheme.primary }}>
        <ChevronLeft className="w-5 h-5" />
      </button>
      <h1 className="text-lg font-bold" style={{ color: colorScheme.text }}>
        {label}
      </h1>
    </div>
  );
}

function ElementRenderer({
  element,
  colorScheme,
  appName,
  lang,
}: {
  element: ScreenElement;
  colorScheme: ColorScheme;
  appName: string;
  lang: Language;
}) {
  const t = (s: string) => translate(s, lang);
  switch (element.kind) {
    case 'header':
      return <h2 className="text-xl font-bold" style={{ color: colorScheme.text }}>{t(element.label ?? '')}</h2>;
    case 'text':
      return <p className="text-sm" style={{ color: colorScheme.text }}>{t(element.label ?? '')}</p>;
    case 'input':
      return (
        <div
          className="rounded-xl px-3 py-2.5 text-sm border"
          style={{ backgroundColor: colorScheme.surface, borderColor: colorScheme.secondary + '40', color: colorScheme.text }}
        >
          <span className="opacity-50">{t(element.placeholder ?? '')}</span>
        </div>
      );
    case 'button': {
      const isPrimary = element.variant !== 'secondary' && element.variant !== 'ghost';
      return (
        <button
          className="w-full rounded-xl py-3 text-sm font-semibold text-center transition-transform active:scale-95"
          style={{
            backgroundColor: isPrimary ? colorScheme.primary : 'transparent',
            color: isPrimary ? '#ffffff' : colorScheme.primary,
            border: isPrimary ? 'none' : `1px solid ${colorScheme.primary}40`,
          }}
        >
          {t(element.label ?? '')}
        </button>
      );
    }
    case 'list':
      return (
        <div className="space-y-1.5">
          {element.items?.map((item, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm" style={{ backgroundColor: colorScheme.surface, color: colorScheme.text }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colorScheme.accent }} />
              {t(item)}
            </div>
          ))}
        </div>
      );
    case 'card':
      return (
        <div className="rounded-xl p-3 space-y-1 shadow-sm" style={{ backgroundColor: colorScheme.surface, color: colorScheme.text }}>
          {element.label && <p className="font-semibold text-sm">{t(element.label)}</p>}
          {element.value && <p className="text-xs opacity-60">{t(element.value)}</p>}
          {element.items && (
            <div className="flex items-end gap-1 h-12 pt-2">
              {element.items.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{
                    height: `${30 + ((i * 37) % 50)}%`,
                    backgroundColor: colorScheme.primary,
                    opacity: 0.3 + (i / element.items!.length) * 0.7,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      );
    case 'image':
      return (
        <div
          className="rounded-xl h-28 flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${colorScheme.primary}30, ${colorScheme.secondary}30)` }}
        >
          <ImageIcon className="w-8 h-8" style={{ color: colorScheme.primary }} />
        </div>
      );
    case 'stat':
      return (
        <div className="rounded-xl p-3" style={{ backgroundColor: colorScheme.surface, color: colorScheme.text }}>
          <p className="text-xs opacity-60">{t(element.label ?? '')}</p>
          <p className="text-xl font-bold mt-0.5" style={{ color: colorScheme.primary }}>{t(element.value ?? '')}</p>
        </div>
      );
    case 'avatar':
      return (
        <div className="flex items-center gap-3 rounded-xl p-2.5" style={{ backgroundColor: colorScheme.surface, color: colorScheme.text }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: colorScheme.secondary }}>
            {(element.label ?? 'U').charAt(0).toUpperCase()}
          </div>
          <span className="text-xs flex-1 truncate">{t(element.label ?? '')}</span>
        </div>
      );
    case 'tabbar':
      return null;
    default:
      return null;
  }
}

function hasTabBar(spec: ScreenSpec): boolean {
  return spec.elements.some((e) => e.kind === 'tabbar');
}

function TabBar({ colorScheme, lang }: { colorScheme: ColorScheme; lang: Language }) {
  const tabs = [
    { icon: <Home className="w-5 h-5" />, label: 'Home' },
    { icon: <Search className="w-5 h-5" />, label: 'Search' },
    { icon: <Plus className="w-5 h-5" />, label: 'Add' },
    { icon: <Bell className="w-5 h-5" />, label: 'Alerts' },
    { icon: <User className="w-5 h-5" />, label: 'Profile' },
  ];
  return (
    <div className="flex items-center justify-around py-2 border-t" style={{ backgroundColor: colorScheme.surface, borderColor: colorScheme.secondary + '20' }}>
      {tabs.map((tab, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5" style={{ color: i === 0 ? colorScheme.primary : colorScheme.text + '60' }}>
          {tab.icon}
          <span className="text-[8px]">{translate(tab.label, lang)}</span>
        </div>
      ))}
    </div>
  );
}

function IncompleteBanner({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border-2 border-dashed border-amber-400/60 bg-amber-400/10 py-3 px-3 flex items-center gap-2 text-amber-700 hover:bg-amber-400/20 transition-colors pulse-incomplete"
    >
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span className="text-xs font-semibold text-left">This region is incomplete — tap to continue building</span>
    </button>
  );
}

function toDarkScheme(cs: ColorScheme): ColorScheme {
  return {
    ...cs,
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
  };
}
