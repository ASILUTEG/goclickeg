import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Clock, TrendingDown, FileBox, Calculator, ArrowRight } from "lucide-react";

const ROICalculator = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  
  // Slider state
  const [patientsPerDay, setPatientsPerDay] = useState(50);
  
  // Math logic (Estimates for marketing)
  // Assuming 26 working days a month
  const workingDays = 26;
  // Estimate: 7 minutes of admin work saved per patient using the software
  const minutesSavedPerPatient = 7; 
  const totalMinutesSavedMonthly = patientsPerDay * minutesSavedPerPatient * workingDays;
  const hoursSavedMonthly = Math.round(totalMinutesSavedMonthly / 60);
  
  // Estimate: 4 physical paper sheets saved per patient
  const papersSavedMonthly = patientsPerDay * 4 * workingDays;
  
  return (
    <section className="py-24 bg-card border-y border-border overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6">
            <Calculator className="w-4 h-4" />
            {isAr ? "حاسبة العائد على الاستثمار" : "ROI Calculator"}
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6">
            {isAr ? "اكتشف ما ستوفره مع GoClick" : "Discover your savings with GoClick"}
          </h2>
          <p className="text-lg text-muted-foreground">
            {isAr 
              ? "جرّب الحاسبة التفاعلية لحساب الوقت، الجهد، والمال الذي ستوفره منشأتك الصحية عند استخدام أنظمتنا."
              : "Use our interactive calculator to estimate the time, effort, and resources your facility will save."}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Slider Panel */}
          <motion.div 
            className="lg:col-span-5 bg-background p-8 rounded-3xl border border-border shadow-lg card-elevated"
            initial={{ opacity: 0, x: isAr ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6 text-foreground">
              {isAr ? "حجم العمل اليومي" : "Daily Workload"}
            </h3>
            
            <div className="mb-8">
              <label className="flex justify-between items-end mb-4">
                <span className="font-semibold text-muted-foreground">
                  {isAr ? "متوسط عدد المرضى يومياً" : "Average patients per day"}
                </span>
                <span className="text-3xl font-black text-primary bg-primary/10 px-4 py-1 rounded-xl">
                  {patientsPerDay}
                </span>
              </label>
              
              <input 
                type="range" 
                min="10" 
                max="500" 
                step="5"
                value={patientsPerDay} 
                onChange={(e) => setPatientsPerDay(Number(e.target.value))}
                className="w-full h-3 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2 font-bold">
                <span>10</span>
                <span>500+</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-muted/50 border border-border">
              <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-secondary" />
                {isAr ? "نسبة الخطأ البشري المتوقعة" : "Expected Human Error Rate"}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {isAr 
                  ? "الأنظمة التقليدية والورقية تتسبب بـ 15% نسبة أخطاء تقريباً. GoClick يخفض هذه النسبة إلى:"
                  : "Traditional & paper systems cause around 15% error rates. GoClick reduces this to:"}
              </p>
              <div className="text-2xl font-black text-secondary bg-secondary/10 px-4 py-2 rounded-xl inline-block">
                &lt; 1%
              </div>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div 
            className="lg:col-span-7 grid sm:grid-cols-2 gap-6"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {/* Metric 1 */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-3xl border border-primary/20 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2">
                {isAr ? "وقت مُنقد شهرياً" : "Hours Saved Monthly"}
              </h4>
              <div className="flex items-baseline gap-2 mb-2">
                <motion.span 
                  key={hoursSavedMonthly}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl font-black text-primary tracking-tighter"
                >
                  {hoursSavedMonthly}
                </motion.span>
                <span className="text-muted-foreground font-semibold">
                  {isAr ? "ساعة" : "Hours"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                {isAr 
                  ? "من الإدخال اليدوي والمهام الإدارية المكررة."
                  : "of manual data entry and repetitive administrative tasks."}
              </p>
            </div>

            {/* Metric 2 */}
            <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 p-8 rounded-3xl border border-secondary/20 hover:border-secondary/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center shadow-lg shadow-secondary/30 mb-6">
                <FileBox className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2">
                {isAr ? "أوراق وملفات مهدرة" : "Paper Sheets Saved"}
              </h4>
              <div className="flex items-baseline gap-2 mb-2">
                <motion.span 
                  key={papersSavedMonthly}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl font-black text-secondary tracking-tighter"
                >
                  {papersSavedMonthly.toLocaleString()}
                </motion.span>
                <span className="text-muted-foreground font-semibold">
                  {isAr ? "ورقة" : "Sheets"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                {isAr 
                  ? "التحول الرقمي الكامل يوفر تكاليف الورق والطباعة."
                  : "Full digital transformation saves massive printing costs."}
              </p>
            </div>
            
            {/* CTA inside the results */}
            <div className="sm:col-span-2 bg-foreground text-background p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative">
              <div className="absolute -right-10 -top-10 opacity-10">
                <Calculator className="w-40 h-40" />
              </div>
              <div className="relative z-10">
                <h4 className="text-lg font-bold mb-1">
                  {isAr ? "مستعد لتحويل هذه الأرقام إلى واقع؟" : "Ready to turn these numbers into reality?"}
                </h4>
                <p className="text-sm text-background/70 font-medium">
                  {isAr ? "احجز استشارة مجانية مع خبرائنا الآن." : "Book a free consultation with our experts now."}
                </p>
              </div>
              <a 
                href="#contact" 
                className="relative z-10 whitespace-nowrap inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
              >
                {isAr ? "تواصل معنا" : "Contact Us"}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ROICalculator;
