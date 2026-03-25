import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProducts } from "@/contexts/ProductContext";
import { Trash, Edit, Save, Plus } from "lucide-react";

export function ReviewAdminPanel() {
  const { t, lang } = useLanguage();
  const { products, updateProduct, deleteProduct, addProduct } = useProducts();
  const isAr = lang === "ar";

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nameAr: "", nameEn: "", titleAr: "", titleEn: "", quoteAr: "", quoteEn: "", productSlug: "" });
  const [isAdding, setIsAdding] = useState(false);

  const startEdit = (productSlug: string, reviewIndex: number, rev: any) => {
    setEditingId(`${productSlug}-${reviewIndex}`);
    setFormData({
      productSlug,
      nameAr: rev.name.ar,
      nameEn: rev.name.en,
      titleAr: rev.title?.ar || "",
      titleEn: rev.title?.en || "",
      quoteAr: rev.quote.ar,
      quoteEn: rev.quote.en
    });
  };

  const handleSave = (reviewIndex: number) => {
    const product = products.find(p => p.slug === formData.productSlug);
    if (!product) return;

    if (isAdding) {
      // Create new review
      const newReview = {
        name: { ar: formData.nameAr, en: formData.nameEn },
        title: formData.titleAr || formData.titleEn ? { ar: formData.titleAr, en: formData.titleEn } : undefined,
        quote: { ar: formData.quoteAr, en: formData.quoteEn }
      };
      
      const newSuccess = [...(product.success || []), newReview];
      updateProduct(formData.productSlug, { ...product, success: newSuccess });
      setIsAdding(false);
    } else {
      // Update existing review
      if (!product.success) return;
      const newSuccess = [...product.success];
      newSuccess[reviewIndex] = {
        name: { ar: formData.nameAr, en: formData.nameEn },
        title: formData.titleAr || formData.titleEn ? { ar: formData.titleAr, en: formData.titleEn } : undefined,
        quote: { ar: formData.quoteAr, en: formData.quoteEn }
      };

      updateProduct(formData.productSlug, { ...product, success: newSuccess });
    }
    setEditingId(null);
  };

  const handleDelete = (productSlug: string, reviewIndex: number) => {
    const product = products.find(p => p.slug === productSlug);
    if (!product || !product.success) return;

    const newSuccess = [...product.success];
    newSuccess.splice(reviewIndex, 1);
    updateProduct(productSlug, { ...product, success: newSuccess });
  };

  // Extract all flattened reviews for easy display
  const allReviews = products.flatMap((p) => 
    (p.success || []).map((rev, index) => ({ ...rev, productSlug: p.slug, productName: p.name[lang as 'ar' | 'en'], index }))
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          {isAr ? "إدارة التقييمات وقصص النجاح" : "Manage Reviews & Success Stories"}
        </h2>
        <button 
          onClick={() => {
            setIsAdding(true);
            setEditingId("new");
            setFormData({ nameAr: "", nameEn: "", titleAr: "", titleEn: "", quoteAr: "", quoteEn: "", productSlug: products[0]?.slug || "" });
          }} 
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          {isAr ? "إضافة تقييم جديد" : "Add New Review"}
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
              <tr>
                <th className="px-6 py-4">{isAr ? "العميل" : "Customer"}</th>
                <th className="px-6 py-4">{isAr ? "المنتج" : "Product"}</th>
                <th className="px-6 py-4 w-1/3">{isAr ? "التقييم" : "Review"}</th>
                <th className="px-6 py-4 text-center">{isAr ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {isAdding && (
                <tr className="border-b border-border bg-primary/5">
                  <td className="px-6 py-4 align-top">
                    <div className="space-y-2">
                      <input className="w-full p-2 text-xs border border-primary/20 rounded bg-background" placeholder="اسم العميل (عربي)" value={formData.nameAr} onChange={e => setFormData(p => ({...p, nameAr: e.target.value}))} />
                      <input className="w-full p-2 text-xs border border-primary/20 rounded bg-background" placeholder="Customer Name (EN)" value={formData.nameEn} onChange={e => setFormData(p => ({...p, nameEn: e.target.value}))} />
                      <input className="w-full p-2 text-xs border border-primary/20 rounded bg-background" placeholder="المنصب/المنشأة (عربي)" value={formData.titleAr} onChange={e => setFormData(p => ({...p, titleAr: e.target.value}))} />
                      <input className="w-full p-2 text-xs border border-primary/20 rounded bg-background" placeholder="Role/Facility (EN)" value={formData.titleEn} onChange={e => setFormData(p => ({...p, titleEn: e.target.value}))} />
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <select 
                      className="w-full p-2 text-xs border border-primary/20 rounded bg-background"
                      value={formData.productSlug}
                      onChange={e => setFormData(p => ({...p, productSlug: e.target.value}))}
                    >
                      {products.map(p => (
                        <option key={p.slug} value={p.slug}>{p.name[lang as 'ar' | 'en']}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="space-y-2">
                      <textarea className="w-full p-2 text-xs border border-primary/20 rounded bg-background h-16 resize-none" placeholder="اكتب التقييم (عربي)..." value={formData.quoteAr} onChange={e => setFormData(p => ({...p, quoteAr: e.target.value}))} />
                      <textarea className="w-full p-2 text-xs border border-primary/20 rounded bg-background h-16 resize-none" placeholder="Write review (EN)..." value={formData.quoteEn} onChange={e => setFormData(p => ({...p, quoteEn: e.target.value}))} />
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleSave(0)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors bg-primary/5">
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                        <span className="font-bold">X</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {!isAdding && allReviews.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    {isAr ? "لا توجد تقييمات حالياً." : "No reviews available."}
                  </td>
                </tr>
              ) : allReviews.map((rev) => {
                const isEditing = editingId === `${rev.productSlug}-${rev.index}`;
                return (
                  <tr key={`${rev.productSlug}-${rev.index}`} className="border-b border-border/50 hover:bg-muted/10">
                    <td className="px-6 py-4 align-top">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input className="w-full p-2 text-xs border rounded bg-background" placeholder="Name AR" value={formData.nameAr} onChange={e => setFormData(p => ({...p, nameAr: e.target.value}))} />
                          <input className="w-full p-2 text-xs border rounded bg-background" placeholder="Name EN" value={formData.nameEn} onChange={e => setFormData(p => ({...p, nameEn: e.target.value}))} />
                          <input className="w-full p-2 text-xs border rounded bg-background" placeholder="Title/Role AR" value={formData.titleAr} onChange={e => setFormData(p => ({...p, titleAr: e.target.value}))} />
                          <input className="w-full p-2 text-xs border rounded bg-background" placeholder="Title/Role EN" value={formData.titleEn} onChange={e => setFormData(p => ({...p, titleEn: e.target.value}))} />
                        </div>
                      ) : (
                        <div>
                          <p className="font-bold text-foreground">{rev.name[lang as 'ar' | 'en']}</p>
                          {rev.title && <p className="text-xs text-muted-foreground">{rev.title[lang as 'ar' | 'en']}</p>}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top whitespace-nowrap">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                        {rev.productName}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top">
                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea className="w-full p-2 text-xs border rounded bg-background h-16 resize-none" placeholder="Quote AR" value={formData.quoteAr} onChange={e => setFormData(p => ({...p, quoteAr: e.target.value}))} />
                          <textarea className="w-full p-2 text-xs border rounded bg-background h-16 resize-none" placeholder="Quote EN" value={formData.quoteEn} onChange={e => setFormData(p => ({...p, quoteEn: e.target.value}))} />
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          "{rev.quote[lang as 'ar' | 'en']}"
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top text-center">
                      {isEditing ? (
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleSave(rev.index)} className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors">
                            <Save className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                            <span className="font-bold">X</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-2">
                          <button onClick={() => startEdit(rev.productSlug, rev.index, rev)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(rev.productSlug, rev.index)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
