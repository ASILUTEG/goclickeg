import React, { createContext, useContext, useEffect, useState } from "react";
import { products as initialProducts, type ProductContent } from "@/content/products";
import { FlaskConical, Stethoscope, Monitor, Package } from "lucide-react";

type ProductContextType = {
  products: ProductContent[];
  addProduct: (product: ProductContent) => void;
  updateProduct: (slug: string, product: ProductContent) => void;
  deleteProduct: (slug: string) => void;
  addReview: (slug: string, review: { name: string, title?: string, quote: string }) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const ICON_MAP: Record<string, any> = {
  golab: FlaskConical,
  goclinic: Stethoscope,
  gohospital: Monitor,
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<ProductContent[]>(initialProducts);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("meditech-products");
    if (saved) {
      try {
        const parsed: typeof initialProducts = JSON.parse(saved);
        // Hydrate icons and fallback main images
        const hydrated = parsed.map(p => {
          // Replace placeholders in partners
          const validImageIds = [
            "1519494026892-80bbd2d6fd0d",
            "1538108149393-fbbd81895907",
            "1586773860418-d37222d8fce3",
            "1551076805-e1869043e560",
            "1576091160550-2173dba999ef",
            "1631815589968-fdb09a223b1e"
          ];
          
          const hydratedPartners = p.partners?.map((pt, i) => ({
            ...pt,
            imageSrc: pt.imageSrc === "/placeholder.svg" 
              ? `https://images.unsplash.com/photo-${validImageIds[i % validImageIds.length]}?w=200&h=200&fit=crop` 
              : pt.imageSrc
          }));

          return {
            ...p,
            partners: hydratedPartners,
            icon: ICON_MAP[p.slug] || Package,
            mainImage: p.mainImage || "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=800"
          };
        });
        setProducts(hydrated);
      } catch (e) {
        console.error("Failed to parse local storage products", e);
      }
    }
  }, []);

  const saveToStorage = (newProducts: ProductContent[]) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const serializable = newProducts.map(({ icon, ...rest }) => rest);
    localStorage.setItem("meditech-products", JSON.stringify(serializable));
    setProducts(newProducts);
  };

  const addProduct = (p: ProductContent) => {
    const withIcon = { ...p, icon: ICON_MAP[p.slug] || Package };
    saveToStorage([...products, withIcon]);
  };

  const updateProduct = (slug: string, p: ProductContent) => {
    const withIcon = { ...p, icon: ICON_MAP[p.slug] || Package };
    saveToStorage(products.map(prod => prod.slug === slug ? withIcon : prod));
  };

  const deleteProduct = (slug: string) => {
    saveToStorage(products.filter(prod => prod.slug !== slug));
  };
  const addReview = (slug: string, review: { name: string, title?: string, quote: string }) => {
    saveToStorage(products.map(p => {
      if (p.slug === slug) {
        return {
          ...p,
          success: [
            ...(p.success || []),
            {
              name: { ar: review.name, en: review.name },
              title: review.title ? { ar: review.title, en: review.title } : undefined,
              quote: { ar: review.quote, en: review.quote }
            }
          ]
        };
      }
      return p;
    }));
  };

  if (!mounted) {
    return null; // Avoid hydration mismatch or rendering empty
  }

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, addReview }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts must be used within ProductProvider");
  return context;
};
