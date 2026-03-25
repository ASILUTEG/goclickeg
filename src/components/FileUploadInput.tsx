import { useState, useRef } from 'react';
import { Upload, X, File, FileText, Anchor } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

type Props = {
  value: string;
  onChange: (value: string) => void;
  accept?: string;
  maxSizeMB?: number;
};

export function FileUploadInput({ value, onChange, accept = ".pdf,.zip,.rar,.doc,.docx", maxSizeMB = 3 }: Props) {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // If the value is a standard http URL (not base64), it's likely a Google Drive link
  const isHttpUrl = value.startsWith('http');
  const hasFile = !!value && value.length > 5;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(isAr 
        ? `حجم الملف كبير جداً! الحد الأقصى ${maxSizeMB} ميجابايت` 
        : `File too large! Max size is ${maxSizeMB}MB`
      );
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onChange(base64String);
    };
    reader.readAsDataURL(file);
  };

  const clearBlob = () => {
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {!hasFile ? (
        <div 
          className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-input hover:border-primary/50 hover:bg-muted/50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.[0]) {
              const dt = new DataTransfer();
              dt.items.add(e.dataTransfer.files[0]);
              if (fileInputRef.current) {
                fileInputRef.current.files = dt.files;
                const event = new Event('change', { bubbles: true });
                fileInputRef.current.dispatchEvent(event);
              }
            }
          }}
        >
          <div className="flex gap-2 text-center text-sm font-medium text-muted-foreground flex-col items-center">
            <Upload className="w-8 h-8 opacity-50 mb-2" />
            <p>{isAr ? "اسحب الملف هنا أو اضغط للرفع" : "Drag file here or click to upload"}</p>
            <p className="text-xs opacity-70">
              {isAr ? `الحد الأقصى: ${maxSizeMB} ميجابايت` : `Max Limit: ${maxSizeMB}MB`}
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      ) : (
        <div className="relative flex items-center p-3 rounded-xl border border-input bg-card shadow-sm gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            {isHttpUrl ? <Anchor className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
          </div>
          <div className="flex-1 min-w-0 pr-8">
            <p className="text-sm font-bold text-foreground truncate">
              {isHttpUrl ? (isAr ? "رابط خارجي" : "External Link") : (isAr ? "تم رفع الملف بنجاح" : "File Uploaded Successfully")}
            </p>
            <p className="text-xs text-muted-foreground truncate opacity-70">
              {isHttpUrl ? value : "Base64 Compressed Data"}
            </p>
          </div>
          <button 
            type="button"
            onClick={clearBlob}
            className="absolute top-1/2 -translate-y-1/2 right-4 rtl:left-4 rtl:right-auto p-1.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {!hasFile && (
        <div className="mt-3 flex gap-2">
          <input 
            type="url" 
            placeholder={isAr ? "أو ضع رابط تحميل (Google Drive, الخ)" : "Or paste a download link (Google Drive, etc)"} 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 w-full p-2.5 rounded-xl border border-input bg-background text-sm"
          />
        </div>
      )}
    </div>
  );
}
