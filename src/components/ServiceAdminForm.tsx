import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Save, X, Plus, Trash2, Globe, Monitor, Smartphone } from "lucide-react";

export type CustomService = {
  id?: number;
  type: 'website' | 'desktop' | 'mobile';
  sort_order: number;
  is_active: boolean;
  name: { ar: string; en: string };
  tagline: { ar: string; en: string };
  description: { ar: string; en: string };
  price: { ar: string; en: string };
  features: { ar: string[]; en: string[] };
  techStack: { ar: string[]; en: string[] };
  mainImage: string;
};

const EMPTY: CustomService = {
  type: 'website',
  sort_order: 0,
  is_active: true,
  name: { ar: '', en: '' },
  tagline: { ar: '', en: '' },
  description: { ar: '', en: '' },
  price: { ar: '', en: '' },
  features: { ar: [], en: [] },
  techStack: { ar: [], en: [] },
  mainImage: '',
};

type Props = {
  service: CustomService | null; // null = new
  onSave: (s: CustomService) => void;
  onCancel: () => void;
  saving: boolean;
};

const TagEditor = ({
  label, tags, onChange,
}: { label: string; tags: string[]; onChange: (t: string[]) => void }) => {
  const [input, setInput] = useState('');
  const add = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput('');
  };
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</label>
      <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-xl border border-input bg-background">
        {tags.map((t, i) => (
          <span key={i} className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
            {t}
            <button type="button" onClick={() => onChange(tags.filter((_, j) => j !== i))} className="hover:text-destructive transition-colors ml-0.5">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
          placeholder="+ اضغط Enter"
          className="flex-1 min-w-[100px] bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
        />
      </div>
    </div>
  );
};

export const ServiceAdminForm = ({ service, onSave, onCancel, saving }: Props) => {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const [form, setForm] = useState<CustomService>(service ?? { ...EMPTY });

  useEffect(() => {
    setForm(service ?? { ...EMPTY });
  }, [service]);

  const set = (field: keyof CustomService, val: any) =>
    setForm(p => ({ ...p, [field]: val }));
  const setBi = (field: 'name' | 'tagline' | 'description' | 'price', lang: 'ar' | 'en', val: string) =>
    setForm(p => ({ ...p, [field]: { ...p[field], [lang]: val } }));

  const inp = "w-full p-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition";
  const lbl = "block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5";

  const typeOptions = [
    { val: 'website', icon: Globe, label: isAr ? 'موقع ويب' : 'Website', color: 'border-blue-500/40 bg-blue-500/10 text-blue-400' },
    { val: 'desktop', icon: Monitor, label: isAr ? 'سطح المكتب' : 'Desktop', color: 'border-violet-500/40 bg-violet-500/10 text-violet-400' },
    { val: 'mobile', icon: Smartphone, label: isAr ? 'جوال' : 'Mobile', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' },
  ];

  return (
    <form
      onSubmit={e => { e.preventDefault(); onSave(form); }}
      className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
        <h3 className="text-lg font-black text-foreground">
          {service?.id ? (isAr ? 'تعديل الخدمة' : 'Edit Service') : (isAr ? 'إضافة خدمة جديدة' : 'Add New Service')}
        </h3>
        <button type="button" onClick={onCancel} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-8">

        {/* Type + Active + Order row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Type selector */}
          <div className="sm:col-span-2">
            <label className={lbl}>{isAr ? 'نوع الخدمة' : 'Service Type'}</label>
            <div className="flex gap-2">
              {typeOptions.map(o => (
                <button
                  key={o.val} type="button"
                  onClick={() => set('type', o.val as any)}
                  className={`flex-1 flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl border-2 transition-all text-xs font-bold ${
                    form.type === o.val ? o.color + ' scale-[1.02] shadow-md' : 'border-border bg-background text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <o.icon className="w-4 h-4" />
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className={lbl}>{isAr ? 'الترتيب' : 'Sort Order'}</label>
              <input type="number" min={0} value={form.sort_order}
                onChange={e => set('sort_order', parseInt(e.target.value) || 0)} className={inp} />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => set('is_active', !form.is_active)}
                className={`w-10 h-5 rounded-full transition-colors flex-shrink-0 ${form.is_active ? 'bg-emerald-500' : 'bg-muted'}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5 ${form.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <span className="text-sm font-semibold text-foreground">
                {form.is_active ? (isAr ? 'مفعّل' : 'Active') : (isAr ? 'مخفي' : 'Hidden')}
              </span>
            </div>
          </div>
        </div>

        {/* Name bilingual */}
        <div>
          <p className={lbl}>{isAr ? 'الاسم' : 'Name'}</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">العربية</label>
              <input required value={form.name.ar} onChange={e => setBi('name', 'ar', e.target.value)} className={inp} placeholder="تطوير مواقع الويب" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">English</label>
              <input required value={form.name.en} onChange={e => setBi('name', 'en', e.target.value)} className={inp} placeholder="Website Development" />
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div>
          <p className={lbl}>{isAr ? 'الشعار / Tagline' : 'Tagline'}</p>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.tagline.ar} onChange={e => setBi('tagline', 'ar', e.target.value)} className={inp} placeholder="شعار قصير..." />
            <input value={form.tagline.en} onChange={e => setBi('tagline', 'en', e.target.value)} className={inp} placeholder="Short tagline..." />
          </div>
        </div>

        {/* Description */}
        <div>
          <p className={lbl}>{isAr ? 'الوصف' : 'Description'}</p>
          <div className="grid grid-cols-2 gap-3">
            <textarea rows={3} value={form.description.ar} onChange={e => setBi('description', 'ar', e.target.value)} className={inp + " resize-none"} placeholder="وصف تفصيلي..." />
            <textarea rows={3} value={form.description.en} onChange={e => setBi('description', 'en', e.target.value)} className={inp + " resize-none"} placeholder="Detailed description..." />
          </div>
        </div>

        {/* Price */}
        <div>
          <p className={lbl}>{isAr ? 'السعر' : 'Price'}</p>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.price.ar} onChange={e => setBi('price', 'ar', e.target.value)} className={inp} placeholder="ابتداءً من ٥٠٠ $" />
            <input value={form.price.en} onChange={e => setBi('price', 'en', e.target.value)} className={inp} placeholder="Starting from $500" />
          </div>
        </div>

        {/* Main Image */}
        <div>
          <label className={lbl}>{isAr ? 'رابط الصورة الرئيسية' : 'Main Image URL'}</label>
          <input value={form.mainImage} onChange={e => set('mainImage', e.target.value)} className={inp} placeholder="https://..." />
          {form.mainImage && (
            <img src={form.mainImage} alt="preview" className="mt-2 h-28 w-full object-cover rounded-xl border border-border"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          )}
        </div>

        {/* Features */}
        <div>
          <p className={lbl}>{isAr ? 'المميزات (Features)' : 'Features'}</p>
          <div className="grid grid-cols-2 gap-3">
            <TagEditor label="العربية" tags={form.features.ar}
              onChange={t => setForm(p => ({ ...p, features: { ...p.features, ar: t } }))} />
            <TagEditor label="English" tags={form.features.en}
              onChange={t => setForm(p => ({ ...p, features: { ...p.features, en: t } }))} />
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <p className={lbl}>{isAr ? 'التقنيات المستخدمة (Tech Stack)' : 'Tech Stack'}</p>
          <div className="grid grid-cols-2 gap-3">
            <TagEditor label="العربية" tags={form.techStack.ar}
              onChange={t => setForm(p => ({ ...p, techStack: { ...p.techStack, ar: t } }))} />
            <TagEditor label="English" tags={form.techStack.en}
              onChange={t => setForm(p => ({ ...p, techStack: { ...p.techStack, en: t } }))} />
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="px-6 py-4 border-t border-border bg-muted/10 flex justify-end gap-3">
        <button type="button" onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors">
          {isAr ? 'إلغاء' : 'Cancel'}
        </button>
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors shadow disabled:opacity-60">
          {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? (isAr ? 'يتم الحفظ...' : 'Saving...') : (isAr ? 'حفظ الخدمة' : 'Save Service')}
        </button>
      </div>
    </form>
  );
};
