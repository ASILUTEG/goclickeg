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
    
    const loadFromAPI = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/products");
        if (res.ok) {
          const data = await res.json();
          const hydrated = data.map((p: any) => ({
            ...p,
            icon: ICON_MAP[p.slug] || Package
          }));
          setProducts(hydrated);
        }
      } catch (e) {
        console.error("Failed to load products from API", e);
      }
    };

    loadFromAPI();
  }, []);

  const addProduct = async (p: ProductContent) => {
    const withIcon = { ...p, icon: ICON_MAP[p.slug] || Package };
    setProducts(prev => [...prev, withIcon]);
    try {
      const token = localStorage.getItem('adminToken');
      await fetch("http://localhost:3001/api/products", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(p)
      });
    } catch(e) { console.error(e); }
  };

  const updateProduct = async (slug: string, p: ProductContent) => {
    const withIcon = { ...p, icon: ICON_MAP[p.slug] || Package };
    setProducts(prev => prev.map(prod => prod.slug === slug ? withIcon : prod));
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`http://localhost:3001/api/products/${slug}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(p)
      });
    } catch(e) { console.error(e); }
  };

  const deleteProduct = async (slug: string) => {
    setProducts(prev => prev.filter(prod => prod.slug !== slug));
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`http://localhost:3001/api/products/${slug}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
    } catch(e) { console.error(e); }
  };

  const addReview = async (slug: string, review: { name: string, title?: string, quote: string }) => {
    setProducts(prev => prev.map(p => {
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

    try {
      await fetch(`http://localhost:3001/api/products/${slug}/reviews`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(review)
      });
    } catch(e) { console.error(e); }
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
