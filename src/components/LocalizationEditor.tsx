import { useState } from 'react';
import { Globe, X, Plus, Search, Check } from 'lucide-react';

interface LocalizationEntry {
  key: string;
  en: string;
  ar: string;
  es: string;
  fr: string;
}

const INITIAL_ENTRIES: LocalizationEntry[] = [
  { key: 'welcome', en: 'Welcome', ar: 'أهلاً بك', es: 'Bienvenido', fr: 'Bienvenue' },
  { key: 'login', en: 'Sign in', ar: 'تسجيل الدخول', es: 'Iniciar sesión', fr: 'Se connecter' },
  { key: 'signup', en: 'Sign up', ar: 'إنشاء حساب', es: 'Regístrate', fr: "S'inscrire" },
  { key: 'settings', en: 'Settings', ar: 'الإعدادات', es: 'Ajustes', fr: 'Paramètres' },
  { key: 'logout', en: 'Log out', ar: 'تسجيل الخروج', es: 'Cerrar sesión', fr: 'Se déconnecter' },
  { key: 'save', en: 'Save', ar: 'حفظ', es: 'Guardar', fr: 'Enregistrer' },
  { key: 'cancel', en: 'Cancel', ar: 'إلغاء', es: 'Cancelar', fr: 'Annuler' },
  { key: 'search', en: 'Search', ar: 'بحث', es: 'Buscar', fr: 'Rechercher' },
  { key: 'loading', en: 'Loading...', ar: 'جاري التحميل...', es: 'Cargando...', fr: 'Chargement...' },
  { key: 'error', en: 'Something went wrong', ar: 'حدث خطأ ما', es: 'Algo salió mal', fr: "Une erreur s'est produite" },
];

const LANGS = [
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'ar', label: 'العربية', flag: 'AR' },
  { code: 'es', label: 'Español', flag: 'ES' },
  { code: 'fr', label: 'Français', flag: 'FR' },
] as const;

interface LocalizationEditorProps {
  open: boolean;
  onClose: () => void;
}

export default function LocalizationEditor({ open, onClose }: LocalizationEditorProps) {
  const [entries, setEntries] = useState<LocalizationEntry[]>(INITIAL_ENTRIES);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<string | null>(null);

  if (!open) return null;

  const filtered = entries.filter((e) => e.key.includes(search.toLowerCase()) || e.en.toLowerCase().includes(search.toLowerCase()));
  const completion = Math.round((entries.filter((e) => LANGS.every((l) => e[l.code])).length / entries.length) * 100);

  const update = (key: string, lang: keyof LocalizationEntry, value: string) => {
    setEntries((prev) => prev.map((e) => (e.key === key ? { ...e, [lang]: value } : e)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Localization</h3>
            <span className="text-xs text-slate-500">{LANGS.length} languages · {completion}% complete</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-5 py-3 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search translation keys..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-600" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-slate-900 z-10">
              <tr className="border-b border-slate-800">
                <th className="text-left px-3 py-2 text-slate-500 font-medium">Key</th>
                {LANGS.map((l) => <th key={l.code} className="text-left px-3 py-2 text-slate-500 font-medium">{l.flag}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.key} className={`border-b border-slate-800/50 hover:bg-slate-800/20 ${editing === entry.key ? 'bg-slate-800/30' : ''}`} onClick={() => setEditing(entry.key)}>
                  <td className="px-3 py-2 text-slate-400 font-mono">{entry.key}</td>
                  {LANGS.map((l) => (
                    <td key={l.code} className="px-3 py-2">
                      {editing === entry.key ? (
                        <input value={entry[l.code]} onChange={(e) => update(entry.key, l.code, e.target.value)} onBlur={() => setEditing(null)} autoFocus className="w-full rounded bg-slate-800 border border-slate-700 px-2 py-1 text-slate-200 focus:outline-none focus:border-cyan-500" />
                      ) : (
                        <span className={entry[l.code] ? 'text-slate-300' : 'text-slate-700 italic'}>{entry[l.code] || '—'}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button onClick={() => setEntries((p) => [...p, { key: 'new_key', en: '', ar: '', es: '', fr: '' }])} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add key
          </button>
          <span className="text-xs text-slate-500">{entries.length} keys · Click any row to edit</span>
        </div>
      </div>
    </div>
  );
}
