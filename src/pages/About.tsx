import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { ShieldCheck, Zap, Users, Target } from "lucide-react";
import AnimatedCounterSection from "@/components/AnimatedCounterSection";

const About = () => {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        <section className="border-b border-border bg-gradient-to-b from-muted/30 to-background overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
          
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6">
                  {lang === "ar" ? "تعرف علينا" : "Get to know us"}
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 leading-tight">
                  {lang === "ar" ? "عن مؤسسة" : "About"} <span className="text-primary">Go Click</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  {lang === "ar"
                    ? "GoClick شركة متخصصة في بناء حلول برمجية للقطاع الطبي تساعد المعامل والعيادات والمستشفيات على إدارة العمليات بكفاءة أعلى، وتقليل الأخطاء، وتحسين تجربة المريض بشكل جذري باستخدام أحدث التقنيات."
                    : "GoClick builds healthcare software that helps labs, clinics, and hospitals run operations efficiently, reduce errors, and radically improve patient experience using cutting-edge technologies."}
                </p>
              </div>

              <div className="flex-1 flex justify-center md:justify-end">
                <div className="relative">
                  {/* Glowing background behind logo */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 blur-2xl rounded-full scale-110" />
                  <img 
                    src="/logo.png" 
                    alt="Go Click Big Logo" 
                    className="relative z-10 w-64 md:w-80 lg:w-96 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 lg:grid-cols-4">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Target className="h-5 w-5" />
                </div>
                <div className="font-bold text-foreground mb-2">
                  {lang === "ar" ? "رؤيتنا" : "Our Vision"}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {lang === "ar"
                    ? "تمكين المنشآت الصحية من اتخاذ قرارات أسرع عبر بيانات دقيقة وتجارب استخدام بسيطة."
                    : "Empower healthcare organizations to make faster decisions through accurate data and simple UX."}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <Users className="h-5 w-5" />
                </div>
                <div className="font-bold text-foreground mb-2">
                  {lang === "ar" ? "من نخدم" : "Who We Serve"}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {lang === "ar"
                    ? "GoLab للمعامل، GoClinic للعيادات، وGoHospital للمستشفيات — لكل نوع احتياجاته."
                    : "GoLab for labs, GoClinic for clinics, and GoHospital for hospitals — each with tailored workflows."}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="font-bold text-foreground mb-2">
                  {lang === "ar" ? "ما يميزنا" : "What Makes Us Different"}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {lang === "ar"
                    ? "سرعة تنفيذ، قابلية توسع، وتجربة استخدام حديثة مع دعم فني مستمر."
                    : "Fast delivery, scalable architecture, modern UI, and reliable ongoing support."}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="font-bold text-foreground mb-2">
                  {lang === "ar" ? "الأمان والخصوصية" : "Security & Privacy"}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {lang === "ar"
                    ? "نهتم بحماية البيانات عبر أفضل الممارسات والحد الأدنى من الصلاحيات."
                    : "We prioritize data protection using best practices and least-privilege access."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <AnimatedCounterSection />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default About;

