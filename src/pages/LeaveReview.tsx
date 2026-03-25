import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProducts } from "@/contexts/ProductContext";
import { motion } from "framer-motion";
import { Star, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const LeaveReview = () => {
  const { lang, t } = useLanguage();
  const { products, addReview } = useProducts();
  const isAr = lang === "ar";

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    productId: "",
    rating: 5,
    quote: ""
  });
  
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.quote || !formData.productId) {
      toast.error(isAr ? "يرجى تعبئة جميع الحقول المطلوبة" : "Please fill in all required fields.");
      return;
    }
    
    // Auto-approve and add review directly to the product dataset
    try {
      addReview(formData.productId, {
        name: formData.name,
        title: formData.title,
        quote: formData.quote
      });
      setIsSubmitted(true);
      toast.success(isAr ? "تم إرسال تقييمك ونشره بنجاح!" : "Review submitted and published successfully!");
    } catch {
      toast.error(isAr ? "حدث خطأ أثناء إرسال التقييم" : "Error submitting review.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
              {isAr ? "شاركنا تجربتك" : "Leave a Review"}
            </h1>
            <p className="text-lg text-muted-foreground w-full max-w-xl mx-auto">
              {isAr 
                ? "رأيك يهمنا. تساعدنا تقييماتكم في GoClick على تطوير خدماتنا لتلبي تطلعات القطاع الطبي."
                : "Your opinion matters. Your feedback helps GoClick improve our services to meet the medical sector's expectations."}
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-[2rem] p-6 md:p-10 shadow-xl card-elevated"
          >
            {isSubmitted ? (
               <div className="text-center py-16 animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 flex items-center justify-center rounded-full mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-3">
                    {isAr ? "شكراً لك!" : "Thank You!"}
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto mb-8">
                    {isAr 
                      ? "تم استلام تقييمك بنجاح. سيتم مراجعته وعرضه في صفحة شركاء النجاح قريباً." 
                      : "Your review has been successfully received. It will be reviewed and published soon."}
                  </p>
                  <button 
                    onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: "", title: "", productId: "", rating: 5, quote: "" });
                    }} 
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-3 rounded-full font-bold transition-transform hover:scale-105"
                  >
                    {isAr ? "إرسال تقييم آخر" : "Submit Another Review"}
                  </button>
               </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* User Info Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">
                        {isAr ? "الاسم" : "Your Name"} <span className="text-destructive">*</span>
                    </label>
                    <input 
                        type="text" 
                        required
                        placeholder={isAr ? "أحمد محمد" : "John Doe"}
                        value={formData.name}
                        onChange={e => setFormData(p => ({...p, name: e.target.value}))}
                        className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:ring-primary focus:border-primary transition"
                    />
                    </div>
                    
                    <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">
                        {isAr ? "الوظيفة / اسم المنشأة" : "Role / Facility Name"}
                    </label>
                    <input 
                        type="text" 
                        placeholder={isAr ? "مدير معمل - مستشفى النور" : "Lab Director - Elite Hospital"}
                        value={formData.title}
                        onChange={e => setFormData(p => ({...p, title: e.target.value}))}
                        className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:ring-primary focus:border-primary transition"
                    />
                    </div>
                </div>

                {/* Product Select Options */}
                <div className="space-y-3">
                    <label className="text-sm font-bold text-foreground block">
                    {isAr ? "البرنامج الذي تستخدمه" : "Software Used"} <span className="text-destructive">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {products.map(product => {
                        const isSelected = formData.productId === product.slug;
                        const Icon = product.icon;
                        return (
                        <button
                            key={product.slug}
                            type="button"
                            onClick={() => setFormData(p => ({...p, productId: product.slug}))}
                            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                            isSelected 
                                ? "border-primary bg-primary/10 text-primary scale-[1.02]" 
                                : "border-border bg-background hover:bg-muted text-muted-foreground hover:border-primary/30"
                            }`}
                        >
                            <Icon className={`w-6 h-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                            <span className={`font-bold text-sm ${isSelected ? "text-primary" : "text-foreground"}`}>
                                {product.name[lang as 'ar' | 'en']}
                            </span>
                        </button>
                        );
                    })}
                    </div>
                </div>

                {/* Rating Input */}
                <div className="space-y-2 pt-4">
                    <label className="text-sm font-bold text-foreground">
                        {isAr ? "التقييم العام" : "Overall Rating"}
                    </label>
                    <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => setFormData(p => ({...p, rating: star}))}
                        className="transition-transform hover:scale-110 focus:outline-none"
                        >
                        <Star 
                            className={`w-8 h-8 transition-colors ${
                            (hoveredStar || formData.rating) >= star 
                                ? "fill-amber-400 text-amber-400" 
                                : "fill-muted text-muted-foreground"
                            }`} 
                        />
                        </button>
                    ))}
                    </div>
                </div>

                {/* Review Message Area */}
                <div className="space-y-2 pt-4">
                    <label className="text-sm font-bold text-foreground flex justify-between">
                        <span>{isAr ? "اكتب تجربتك" : "Your Experience"} <span className="text-destructive">*</span></span>
                    </label>
                    <textarea 
                        required
                        rows={5}
                        placeholder={isAr ? "حدثنا عن تجربتك وكيف ساعدك البرنامج في إدارة منشأتك..." : "Tell us about your experience and how the software helped you..."}
                        value={formData.quote}
                        onChange={e => setFormData(p => ({...p, quote: e.target.value}))}
                        className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:ring-primary focus:border-primary transition resize-none"
                    />
                </div>

                {/* Submit Action */}
                <div className="pt-6">
                    <button 
                        type="submit"
                        className="w-full flex justify-center items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/25 transition-all hover:scale-[1.01]"
                    >
                    {isAr ? "نشر التقييم" : "Submit Review"}
                    <Send className={`w-5 h-5 ${isAr ? "rotate-180" : ""}`} />
                    </button>
                    <p className="text-[12px] text-muted-foreground text-center mt-4">
                        {isAr ? "نحن نحترم خصوصيتك. لن يتم مشاركة بريدك الإلكتروني أو بياناتك الخاصة." : "We respect your privacy. Your private data will never be shared."}
                    </p>
                </div>
                </form>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LeaveReview;
