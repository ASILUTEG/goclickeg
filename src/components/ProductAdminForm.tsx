import { useState } from "react";
import type { ProductContent } from "@/content/products";
import { useLanguage } from "@/contexts/LanguageContext";
import { Save, X, Plus, Trash } from "lucide-react";
import { ImageUploadInput } from "./ImageUploadInput";
import { FileUploadInput } from "./FileUploadInput";

type Props = {
  product?: ProductContent | null;
  onSave: (product: ProductContent) => void;
  onCancel: () => void;
};

// Provides an empty template for new products
const emptyProduct: ProductContent = {
  slug: `product-${Date.now()}` as any,
  type: "clinic",
  icon: null as any,
  accentClassName: "bg-primary/10 text-primary",
  name: { ar: "", en: "" },
  tagline: { ar: "", en: "" },
  description: { ar: "", en: "" },
  price: { ar: "", en: "" },
  sort_order: 0,
  mainImage: "",
  features: [],
  partners: [],
  images: [],
  success: [],
  youtubeId: "",
  youtubePlaylistUrl: "",
};

export function ProductAdminForm({ product, onSave, onCancel }: Props) {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  
  // Initialize state with the existing product or a deep copy of the empty template
  const [formData, setFormData] = useState<ProductContent>(() => 
    product ? JSON.parse(JSON.stringify(product)) : JSON.parse(JSON.stringify(emptyProduct))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const updateField = (field: keyof ProductContent, langKey: 'ar' | 'en', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...((prev[field] as any) || {}), [langKey]: value }
    }));
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
        <h2 className="text-2xl font-bold">
          {product ? (isAr ? "تعديل المنتج" : "Edit Product") : (isAr ? "إضافة منتج جديد" : "Add New Product")}
        </h2>
        <button onClick={onCancel} className="p-2 hover:bg-muted rounded-full">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">{isAr ? "الاسم (عربي)" : "Name (AR)"}</label>
            <input required value={formData.name.ar} onChange={e => updateField('name', 'ar', e.target.value)} className="w-full p-2.5 rounded-xl border border-input bg-background" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">{isAr ? "الاسم (إنجليزي)" : "Name (EN)"}</label>
            <input required value={formData.name.en} onChange={e => updateField('name', 'en', e.target.value)} className="w-full p-2.5 rounded-xl border border-input bg-background" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">{isAr ? "الوصف المختصر (عربي)" : "Tagline (AR)"}</label>
            <input required value={formData.tagline.ar} onChange={e => updateField('tagline', 'ar', e.target.value)} className="w-full p-2.5 rounded-xl border border-input bg-background" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">{isAr ? "الوصف المختصر (إنجليزي)" : "Tagline (EN)"}</label>
            <input required value={formData.tagline.en} onChange={e => updateField('tagline', 'en', e.target.value)} className="w-full p-2.5 rounded-xl border border-input bg-background" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold">{isAr ? "الوصف الشامل (عربي)" : "Description (AR)"}</label>
            <textarea required rows={3} value={formData.description.ar} onChange={e => updateField('description', 'ar', e.target.value)} className="w-full p-2.5 rounded-xl border border-input bg-background" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold">{isAr ? "الوصف الشامل (إنجليزي)" : "Description (EN)"}</label>
            <textarea required rows={3} value={formData.description.en} onChange={e => updateField('description', 'en', e.target.value)} className="w-full p-2.5 rounded-xl border border-input bg-background" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">{isAr ? "السعر (عربي)" : "Price (AR)"}</label>
            <input required value={formData.price.ar} onChange={e => updateField('price', 'ar', e.target.value)} className="w-full p-2.5 rounded-xl border border-input bg-background" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">{isAr ? "السعر (إنجليزي)" : "Price (EN)"}</label>
            <input required value={formData.price.en} onChange={e => updateField('price', 'en', e.target.value)} className="w-full p-2.5 rounded-xl border border-input bg-background" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">{isAr ? "ترتيب العرض" : "Display Order"}</label>
            <input
              type="number"
              min={0}
              value={formData.sort_order ?? 0}
              onChange={e => setFormData(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))}
              className="w-full p-2.5 rounded-xl border border-input bg-background"
            />
            <p className="text-xs text-muted-foreground">{isAr ? "رقم أصغر = يظهر أولاً" : "Lower number = appears first"}</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold">{isAr ? "الصورة الرئيسية (اختياري)" : "Main Image URL (Optional)"}</label>
            <ImageUploadInput value={formData.mainImage || ""} onChange={val => setFormData(p => ({...p, mainImage: val}))} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">{isAr ? "ملف النسخة التجريبية / الشرح (اختياري)" : "Trial / Guide File (Optional)"}</label>
            <FileUploadInput value={formData.trialUrl || ""} onChange={val => setFormData(p => ({...p, trialUrl: val}))} maxSizeMB={2.5} accept=".pdf,.doc,.docx,.zip,.exe,.rar" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">{isAr ? "رابط فيديو شرح يوتيوب (اختياري)" : "YouTube Explainer Video URL"}</label>
            <input 
              placeholder="https://youtube.com/watch?v=..."
              value={formData.youtubeId ? `https://youtube.com/watch?v=${formData.youtubeId}` : ""} 
              onChange={e => {
                const val = e.target.value;
                let id = val;
                // Parse standard youtube urls or short ones to get the ID automatically
                if (val.includes('v=')) id = val.split('v=')[1].split('&')[0];
                else if (val.includes('youtu.be/')) id = val.split('youtu.be/')[1].split('?')[0];
                setFormData(p => ({...p, youtubeId: id || undefined}));
              }} 
              className="w-full p-2.5 rounded-xl border border-input bg-background" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">{isAr ? "رابط قائمة تشغيل الشرح (اختياري)" : "Tutorial Playlist URL (Optional)"}</label>
            <input 
              placeholder="https://www.youtube.com/playlist?list=..."
              value={formData.youtubePlaylistUrl || ""} 
              onChange={e => setFormData(p => ({...p, youtubePlaylistUrl: e.target.value}))} 
              className="w-full p-2.5 rounded-xl border border-input bg-background" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">{isAr ? "رابط صفحة فيس بوك" : "Facebook Page URL"}</label>
            <input value={formData.facebookUrl || ""} onChange={e => setFormData(p => ({...p, facebookUrl: e.target.value}))} className="w-full p-2.5 rounded-xl border border-input bg-background" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold">{isAr ? "الصورة التسعيرية (اختياري)" : "Pricing Image URL (Optional)"}</label>
            <ImageUploadInput value={formData.pricingImage?.src || ""} onChange={val => setFormData(p => ({...p, pricingImage: { src: val, alt: { ar: 'Pricing', en: 'Pricing' } }}))} />
          </div>
        </div>

        {/* Arrays for Features (Simplified for now - can add more complex arrays if needed) */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{isAr ? "المميزات" : "Features"}</h3>
            <button type="button" onClick={() => setFormData(p => ({...p, features: [...p.features, { ar: "", en: "" }]}))} className="flex items-center gap-2 text-sm text-primary hover:underline">
              <Plus className="w-4 h-4" /> {isAr ? "إضافة ميزة" : "Add Feature"}
            </button>
          </div>
          <div className="space-y-3">
            {formData.features.map((feat, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <input placeholder={isAr ? "الميزة (عربي)" : "Feature (AR)"} value={feat.ar} onChange={e => {
                  const newFeat = [...formData.features];
                  newFeat[idx].ar = e.target.value;
                  setFormData(p => ({...p, features: newFeat}));
                }} className="w-1/2 p-2 rounded-lg border border-input bg-background" />
                <input placeholder={isAr ? "الميزة (إنجليزي)" : "Feature (EN)"} value={feat.en} onChange={e => {
                  const newFeat = [...formData.features];
                  newFeat[idx].en = e.target.value;
                  setFormData(p => ({...p, features: newFeat}));
                }} className="w-1/2 p-2 rounded-lg border border-input bg-background" />
                <button type="button" onClick={() => {
                  const newFeat = [...formData.features];
                  newFeat.splice(idx, 1);
                  setFormData(p => ({...p, features: newFeat}));
                }} className="p-2 text-destructive hover:bg-destructive/10 rounded-md">
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Arrays for Product Images */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{isAr ? "صور المنتج" : "Product Images"}</h3>
            <button type="button" onClick={() => setFormData(p => ({...p, images: [...(p.images || []), { src: "", title: { ar: "", en: "" }, subtitle: { ar: "", en: "" } }]}))} className="flex items-center gap-2 text-sm text-primary hover:underline">
              <Plus className="w-4 h-4" /> {isAr ? "إضافة صورة" : "Add Image"}
            </button>
          </div>
          <div className="space-y-6">
            {(formData.images || []).map((img, idx) => (
              <div key={idx} className="flex flex-col gap-4 p-4 border border-border rounded-xl bg-muted/20 relative">
                <button type="button" onClick={() => {
                  const newImages = [...(formData.images || [])];
                  newImages.splice(idx, 1);
                  setFormData(p => ({...p, images: newImages}));
                }} className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-2 text-destructive hover:bg-destructive/10 rounded-md">
                  <Trash className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder={isAr ? "عنوان الصورة (عربي)" : "Image Title (AR)"} value={img.title.ar} onChange={e => {
                    const newImages = [...(formData.images || [])];
                    newImages[idx].title.ar = e.target.value;
                    setFormData(p => ({...p, images: newImages}));
                  }} className="w-full p-2.5 rounded-lg border border-input bg-background" />
                  <input placeholder={isAr ? "عنوان الصورة (إنجليزي)" : "Image Title (EN)"} value={img.title.en} onChange={e => {
                    const newImages = [...(formData.images || [])];
                    newImages[idx].title.en = e.target.value;
                    setFormData(p => ({...p, images: newImages}));
                  }} className="w-full p-2.5 rounded-lg border border-input bg-background" />
                  
                  <input placeholder={isAr ? "وصف فرعي (عربي)" : "Subtitle (AR)"} value={img.subtitle.ar} onChange={e => {
                    const newImages = [...(formData.images || [])];
                    newImages[idx].subtitle.ar = e.target.value;
                    setFormData(p => ({...p, images: newImages}));
                  }} className="w-full p-2.5 rounded-lg border border-input bg-background" />
                  <input placeholder={isAr ? "وصف فرعي (إنجليزي)" : "Subtitle (EN)"} value={img.subtitle.en} onChange={e => {
                    const newImages = [...(formData.images || [])];
                    newImages[idx].subtitle.en = e.target.value;
                    setFormData(p => ({...p, images: newImages}));
                  }} className="w-full p-2.5 rounded-lg border border-input bg-background" />

                  <div className="w-full md:col-span-2">
                    <label className="text-[13px] text-muted-foreground font-semibold mb-1 block">{isAr ? "الصورة" : "Image"}</label>
                    <ImageUploadInput value={img.src} onChange={val => {
                      const newImages = [...(formData.images || [])];
                      newImages[idx].src = val;
                      setFormData(p => ({...p, images: newImages}));
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arrays for Partners */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{isAr ? "شركاؤنا" : "Partners"}</h3>
            <button type="button" onClick={() => setFormData(p => ({...p, partners: [...(p.partners || []), { title: { ar: "", en: "" }, subtitle: { ar: "", en: "" }, imageSrc: "" }]}))} className="flex items-center gap-2 text-sm text-primary hover:underline">
              <Plus className="w-4 h-4" /> {isAr ? "إضافة شريك" : "Add Partner"}
            </button>
          </div>
          <div className="space-y-6">
            {(formData.partners || []).map((partner, idx) => (
              <div key={idx} className="flex flex-col gap-4 p-4 border border-border rounded-xl bg-muted/20 relative">
                <button type="button" onClick={() => {
                  const newPartners = [...(formData.partners || [])];
                  newPartners.splice(idx, 1);
                  setFormData(p => ({...p, partners: newPartners}));
                }} className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-2 text-destructive hover:bg-destructive/10 rounded-md">
                  <Trash className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder={isAr ? "اسم الشريك (عربي)" : "Partner Name (AR)"} value={partner.title.ar} onChange={e => {
                    const newPartners = [...(formData.partners || [])];
                    newPartners[idx].title.ar = e.target.value;
                    setFormData(p => ({...p, partners: newPartners}));
                  }} className="w-full p-2.5 rounded-lg border border-input bg-background" />
                  <input placeholder={isAr ? "اسم الشريك (إنجليزي)" : "Partner Name (EN)"} value={partner.title.en} onChange={e => {
                    const newPartners = [...(formData.partners || [])];
                    newPartners[idx].title.en = e.target.value;
                    setFormData(p => ({...p, partners: newPartners}));
                  }} className="w-full p-2.5 rounded-lg border border-input bg-background" />
                  
                  <input placeholder={isAr ? "الوصف/النوع (عربي)" : "Subtitle/Type (AR)"} value={partner.subtitle.ar} onChange={e => {
                    const newPartners = [...(formData.partners || [])];
                    newPartners[idx].subtitle.ar = e.target.value;
                    setFormData(p => ({...p, partners: newPartners}));
                  }} className="w-full p-2.5 rounded-lg border border-input bg-background" />
                  <input placeholder={isAr ? "الوصف/النوع (إنجليزي)" : "Subtitle/Type (EN)"} value={partner.subtitle.en} onChange={e => {
                    const newPartners = [...(formData.partners || [])];
                    newPartners[idx].subtitle.en = e.target.value;
                    setFormData(p => ({...p, partners: newPartners}));
                  }} className="w-full p-2.5 rounded-lg border border-input bg-background" />

                  <div className="w-full md:col-span-2">
                    <label className="text-[13px] text-muted-foreground font-semibold mb-1 block">{isAr ? "صورة الشعار" : "Logo Image"}</label>
                    <ImageUploadInput value={partner.imageSrc} onChange={val => {
                      const newPartners = [...(formData.partners || [])];
                      newPartners[idx].imageSrc = val;
                      setFormData(p => ({...p, partners: newPartners}));
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arrays for Reviews/Success */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{isAr ? "تقييمات العملاء" : "Customer Reviews"}</h3>
            <button type="button" onClick={() => setFormData(p => ({...p, success: [...(p.success || []), { name: { ar: "", en: "" }, title: { ar: "", en: "" }, quote: { ar: "", en: "" } }]}))} className="flex items-center gap-2 text-sm text-primary hover:underline">
              <Plus className="w-4 h-4" /> {isAr ? "إضافة تقييم" : "Add Review"}
            </button>
          </div>
          <div className="space-y-6">
            {(formData.success || []).map((rev, idx) => (
              <div key={idx} className="flex flex-col gap-4 p-4 border border-border rounded-xl bg-muted/20 relative">
                <button type="button" onClick={() => {
                  const newRev = [...(formData.success || [])];
                  newRev.splice(idx, 1);
                  setFormData(p => ({...p, success: newRev}));
                }} className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-2 text-destructive hover:bg-destructive/10 rounded-md">
                  <Trash className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder={isAr ? "اسم العميل (عربي)" : "Customer Name (AR)"} value={rev.name.ar} onChange={e => {
                    const newRev = [...(formData.success || [])];
                    newRev[idx].name.ar = e.target.value;
                    setFormData(p => ({...p, success: newRev}));
                  }} className="w-full p-2.5 rounded-lg border border-input bg-background" />
                  <input placeholder={isAr ? "اسم العميل (إنجليزي)" : "Customer Name (EN)"} value={rev.name.en} onChange={e => {
                    const newRev = [...(formData.success || [])];
                    newRev[idx].name.en = e.target.value;
                    setFormData(p => ({...p, success: newRev}));
                  }} className="w-full p-2.5 rounded-lg border border-input bg-background" />
                  
                  <input placeholder={isAr ? "الوظيفة/المؤسسة (عربي)" : "Role/Hospital (AR)"} value={rev.title?.ar || ""} onChange={e => {
                    const newRev = [...(formData.success || [])];
                    if (!newRev[idx].title) newRev[idx].title = { ar: "", en: "" };
                    newRev[idx].title!.ar = e.target.value;
                    setFormData(p => ({...p, success: newRev}));
                  }} className="w-full p-2.5 rounded-lg border border-input bg-background" />
                  <input placeholder={isAr ? "الوظيفة/المؤسسة (إنجليزي)" : "Role/Hospital (EN)"} value={rev.title?.en || ""} onChange={e => {
                    const newRev = [...(formData.success || [])];
                    if (!newRev[idx].title) newRev[idx].title = { ar: "", en: "" };
                    newRev[idx].title!.en = e.target.value;
                    setFormData(p => ({...p, success: newRev}));
                  }} className="w-full p-2.5 rounded-lg border border-input bg-background" />

                  <textarea placeholder={isAr ? "التقييم (عربي)" : "Review Quote (AR)"} value={rev.quote.ar} onChange={e => {
                    const newRev = [...(formData.success || [])];
                    newRev[idx].quote.ar = e.target.value;
                    setFormData(p => ({...p, success: newRev}));
                  }} className="w-full md:col-span-2 p-2.5 rounded-lg border border-input bg-background h-24" />
                  <textarea placeholder={isAr ? "التقييم (إنجليزي)" : "Review Quote (EN)"} value={rev.quote.en} onChange={e => {
                    const newRev = [...(formData.success || [])];
                    newRev[idx].quote.en = e.target.value;
                    setFormData(p => ({...p, success: newRev}));
                  }} className="w-full md:col-span-2 p-2.5 rounded-lg border border-input bg-background h-24" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl font-semibold border border-input bg-background hover:bg-muted transition">
            {isAr ? "إلغاء" : "Cancel"}
          </button>
          <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition shadow">
            <Save className="w-4 h-4" />
            {isAr ? "حفظ التغييرات" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
