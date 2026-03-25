import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, useInView, animate } from "framer-motion";

function Counter({ from = 0, to, suffix = "", decimals = 0 }: { from?: number; to: number; suffix?: string; decimals?: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-100px 0px" });

  useEffect(() => {
    if (isInView && nodeRef.current) {
      const controls = animate(from, to, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate(value) {
          if (nodeRef.current) {
            // Format number (e.g., 10000 -> 10,000)
            const formatted = Number(value.toFixed(decimals)).toLocaleString("en-US", {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals
            });
            nodeRef.current.textContent = formatted + suffix;
          }
        },
      });
      return () => controls.stop();
    }
  }, [from, to, isInView, suffix, decimals]);

  // Initial render state
  const initialValue = Number(from.toFixed(decimals)).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }) + suffix;

  return <span ref={nodeRef}>{initialValue}</span>;
}

export const AnimatedCounterSection = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const stats = [
    {
      target: 10,
      suffix: isAr ? " مليون+" : "M+",
      label: isAr ? "سجل طبي مُدار" : "Medical Records Managed",
      desc: isAr ? "تمت معالجتها بدقة وأمان" : "Processed with precision and security"
    },
    {
      target: 99.9,
      decimals: 1,
      suffix: "%",
      label: isAr ? "استقرار الخوادم (SLA)" : "Uptime SLA",
      desc: isAr ? "أمان وموثوقية بلا انقطاع" : "Security and reliability without interruption"
    },
    {
      target: 500,
      suffix: "+",
      label: isAr ? "منشأة صحية" : "Healthcare Facilities",
      desc: isAr ? "تثق في أنظمتنا يومياً" : "Trust our systems globally"
    },
    {
      target: 0,
      suffix: "%",
      label: isAr ? "فقدان للبيانات" : "Data Loss",
      desc: isAr ? "نسخ احتياطي سحابي قوي" : "Robust cloud backup infrastructure"
    }
  ];

  return (
    <section className="py-24 bg-zinc-950 text-white relative overflow-hidden text-center border-y border-zinc-900">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl opacity-10 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary via-transparent to-transparent opacity-50 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-white">
          {isAr ? "GoClick في أرقام" : "Impact By The Numbers"}
        </h2>
        <p className="text-zinc-400 text-lg mb-16 max-w-2xl mx-auto">
          {isAr 
            ? "نحن لا نبيع برمجيات فقط، بل نبني بنية تحتية رقمية متكاملة تضمن لك الأمان، الاستقرار والكفاءة المطلقة."
            : "We don't just sell software. We build integrated digital infrastructures that guarantee security, stability, and absolute efficiency."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm hover:border-primary/50 hover:bg-zinc-900 transition-colors"
            >
              <div className="text-5xl lg:text-6xl font-black text-primary mb-4 drop-shadow-[0_0_15px_rgba(25,160,250,0.3)]">
                <Counter to={stat.target} decimals={stat.decimals} suffix={stat.suffix} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-zinc-100">{stat.label}</h3>
              <p className="text-sm font-medium text-zinc-400">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimatedCounterSection;
