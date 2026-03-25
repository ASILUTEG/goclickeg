import { useLanguage } from "@/contexts/LanguageContext";

export const SiteLogo = ({ className = "h-10 md:h-12", textClassName = "text-foreground" }: { className?: string, textClassName?: string }) => {
  return (
    <div className="flex items-center gap-3 group pointer-events-auto cursor-pointer">
      <img 
        src="/logo.png" 
        alt="GoClick" 
        className={`object-contain transition-transform duration-300 group-hover:scale-105 ${className}`} 
      />
      <div className="flex flex-col items-start justify-center text-left">
        <span className={`text-xl md:text-2xl font-black tracking-tight leading-none ${textClassName}`}>
          Go Click
        </span>
        <span className="text-[10px] md:text-[11px] font-bold text-green-500 uppercase tracking-widest block mt-1 leading-none">
          Smart Management By Click
        </span>
      </div>
    </div>
  );
};
