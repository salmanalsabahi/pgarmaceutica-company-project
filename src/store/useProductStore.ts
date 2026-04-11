import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products as defaultProducts, categories as defaultCategories, productTypes as defaultProductTypes, manufacturers as defaultManufacturers, Product } from '../data/products';

interface ProductState {
  products: Product[];
  categories: string[];
  productTypes: string[];
  manufacturers: string[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: string) => void;
  updateCategory: (oldName: string, newName: string) => void;
  deleteCategory: (category: string) => void;
  addProductType: (type: string) => void;
  updateProductType: (oldName: string, newName: string) => void;
  deleteProductType: (type: string) => void;
  addManufacturer: (manufacturer: string) => void;
  updateManufacturer: (oldName: string, newName: string) => void;
  deleteManufacturer: (manufacturer: string) => void;
  rateProduct: (id: string, rating: number) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: defaultProducts,
      categories: defaultCategories,
      productTypes: defaultProductTypes,
      manufacturers: defaultManufacturers,
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, updatedFields) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updatedFields } : p)
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),
      addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
      updateCategory: (oldName, newName) => set((state) => ({
        categories: state.categories.map(c => c === oldName ? newName : c),
        products: state.products.map(p => p.category === oldName ? { ...p, category: newName } : p)
      })),
      deleteCategory: (category) => set((state) => ({
        categories: state.categories.filter(c => c !== category),
        products: state.products.filter(p => p.category !== category)
      })),
      addProductType: (type) => set((state) => ({ productTypes: [...state.productTypes, type] })),
      updateProductType: (oldName, newName) => set((state) => ({
        productTypes: state.productTypes.map(t => t === oldName ? newName : t),
        products: state.products.map(p => p.type === oldName ? { ...p, type: newName } : p)
      })),
      deleteProductType: (type) => set((state) => ({
        productTypes: state.productTypes.filter(t => t !== type),
        products: state.products.map(p => p.type === type ? { ...p, type: undefined } : p)
      })),
      addManufacturer: (manufacturer) => set((state) => ({ manufacturers: [...state.manufacturers, manufacturer] })),
      updateManufacturer: (oldName, newName) => set((state) => ({
        manufacturers: state.manufacturers.map(m => m === oldName ? newName : m),
        products: state.products.map(p => p.brand === oldName ? { ...p, brand: newName } : p)
      })),
      deleteManufacturer: (manufacturer) => set((state) => ({
        manufacturers: state.manufacturers.filter(m => m !== manufacturer),
        products: state.products.map(p => p.brand === manufacturer ? { ...p, brand: '' } : p)
      })),
      rateProduct: (id, newRating) => set((state) => ({
        products: state.products.map(p => {
          if (p.id === id) {
            const currentCount = p.reviewsCount || 0;
            const currentRating = p.rating || 0;
            const totalRating = (currentRating * currentCount) + newRating;
            const newCount = currentCount + 1;
            return { ...p, rating: totalRating / newCount, reviewsCount: newCount };
          }
          return p;
        })
      }))
    }),
    { name: 'alshifa-products' }
  )
);
