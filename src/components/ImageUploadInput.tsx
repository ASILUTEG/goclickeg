import React, { useRef } from "react";
import { Upload, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string; // Additional classes for the container
};

export const ImageUploadInput: React.FC<Props> = ({ value, onChange, placeholder, className = "" }) => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (e.target.value) {
      e.target.value = ''; // Reset input to allow the same file selection again later
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to resize and compress the image
        const canvas = document.createElement("canvas");
        const MAX_DIMENSION = 1200; // Constrain the size to preserve LocalStorage quota
        
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_DIMENSION) {
          height = Math.floor(height * (MAX_DIMENSION / width));
          width = MAX_DIMENSION;
        } else if (height > MAX_DIMENSION) {
          width = Math.floor(width * (MAX_DIMENSION / height));
          height = MAX_DIMENSION;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);

          // Use WebP compression with 0.7 quality for aggressive space-saving
          const compressedDataUrl = canvas.toDataURL("image/webp", 0.7);
          onChange(compressedDataUrl);
        }
      };
      
      // Safety check for strictly string results
      if (typeof event.target?.result === "string") {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div className={`flex w-full items-center gap-2 ${className}`}>
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder || (isAr ? "رابط الصورة أو ارفع صورة..." : "Image URL or Upload...")}
        className="flex-grow min-w-0 p-2.5 rounded-xl border border-input bg-background text-sm" 
      />
      
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange} 
      />
      
      <button 
        type="button" 
        onClick={() => fileInputRef.current?.click()}
        className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 transition shadow-sm text-sm font-semibold"
        title={isAr ? "رفع صورة بدلاً من كتابة رابط" : "Upload an image instead of typing a URL"}
      >
        <Upload className="w-4 h-4" />
        <span className="hidden sm:inline">{isAr ? "رفع" : "Upload"}</span>
      </button>

      {/* Quick clear button for uploaded base64 data */}
      {value && value.startsWith('data:') && (
        <button 
          type="button" 
          onClick={() => onChange("")}
          className="flex-shrink-0 p-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition border border-destructive/20 bg-destructive/5"
          title={isAr ? "إزالة الصورة المرفوعة" : "Remove Uploaded Image"}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
