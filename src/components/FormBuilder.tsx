import { useState } from 'react';
import { FormInput, X, Plus, Trash2, Eye, GripVertical } from 'lucide-react';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'textarea';
  label: string;
  placeholder: string;
  required: boolean;
  options?: string[];
}

const INITIAL_FIELDS: FormField[] = [
  { id: '1', type: 'text', label: 'Full Name', placeholder: 'Enter your name', required: true },
  { id: '2', type: 'email', label: 'Email', placeholder: 'you@example.com', required: true },
  { id: '3', type: 'password', label: 'Password', placeholder: '••••••••', required: true },
  { id: '4', type: 'checkbox', label: 'Accept terms', placeholder: '', required: true },
];

interface FormBuilderProps {
  open: boolean;
  onClose: () => void;
}

const FIELD_TYPES: { value: FormField['type']; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'password', label: 'Password' },
  { value: 'number', label: 'Number' },
  { value: 'select', label: 'Select' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'textarea', label: 'Textarea' },
];

export default function FormBuilder({ open, onClose }: FormBuilderProps) {
  const [fields, setFields] = useState<FormField[]>(INITIAL_FIELDS);
  const [preview, setPreview] = useState(false);
  if (!open) return null;

  const update = (id: string, key: keyof FormField, value: string | boolean) => setFields((p) => p.map((f) => f.id === id ? { ...f, [key]: value } : f));
  const remove = (id: string) => setFields((p) => p.filter((f) => f.id !== id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FormInput className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Form Builder</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPreview(!preview)} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"><Eye className="w-3.5 h-3.5" />{preview ? 'Edit' : 'Preview'}</button>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
          {preview ? (
            <div className="max-w-sm mx-auto space-y-3">
              {fields.map((f) => (
                <div key={f.id}>
                  <label className="text-xs text-slate-300 mb-1 block">{f.label}{f.required && <span className="text-red-400"> *</span>}</label>
                  {f.type === 'textarea' ? <textarea placeholder={f.placeholder} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 h-20 resize-none" />
                    : f.type === 'checkbox' ? <input type="checkbox" className="w-4 h-4 accent-cyan-500" />
                    : f.type === 'select' ? <select className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-200"><option>Select...</option></select>
                    : <input type={f.type} placeholder={f.placeholder} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500" />}
                </div>
              ))}
              <button className="w-full rounded-lg py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 text-sm font-semibold">Submit</button>
            </div>
          ) : (
            <div className="space-y-2">
              {fields.map((f) => (
                <div key={f.id} className="group rounded-xl border border-slate-800 bg-slate-950/40 p-3 flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-slate-700" />
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input value={f.label} onChange={(e) => update(f.id, 'label', e.target.value)} className="rounded bg-slate-800 border border-slate-700 px-2 py-1.5 text-xs text-slate-200 focus:outline-none" placeholder="Label" />
                    <select value={f.type} onChange={(e) => update(f.id, 'type', e.target.value)} className="rounded bg-slate-800 border border-slate-700 px-2 py-1.5 text-xs text-slate-200 focus:outline-none">
                      {FIELD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                    <input value={f.placeholder} onChange={(e) => update(f.id, 'placeholder', e.target.value)} className="rounded bg-slate-800 border border-slate-700 px-2 py-1.5 text-xs text-slate-200 focus:outline-none" placeholder="Placeholder" />
                    <label className="flex items-center gap-2 text-xs text-slate-400"><input type="checkbox" checked={f.required} onChange={(e) => update(f.id, 'required', e.target.checked)} className="accent-cyan-500" />Required</label>
                  </div>
                  <button onClick={() => remove(f.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button onClick={() => setFields((p) => [...p, { id: crypto.randomUUID(), type: 'text', label: 'New Field', placeholder: '', required: false }])}
                className="w-full rounded-xl border-2 border-dashed border-slate-700 py-2.5 text-xs text-slate-500 hover:text-slate-300 hover:border-slate-600 transition-colors flex items-center justify-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add field
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
