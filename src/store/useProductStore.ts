import { create } from 'zustand';
import { db } from '../firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { products as defaultProducts, categories as defaultCategories, productTypes as defaultProductTypes, manufacturers as defaultManufacturers, Product } from '../data/products';

interface ProductState {
  products: Product[];
  categories: string[];
  productTypes: string[];
  manufacturers: string[];
  isInitialized: boolean;
  initialize: () => void;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: string) => Promise<void>;
  updateCategory: (oldName: string, newName: string) => Promise<void>;
  deleteCategory: (category: string) => Promise<void>;
  addProductType: (type: string) => Promise<void>;
  updateProductType: (oldName: string, newName: string) => Promise<void>;
  deleteProductType: (type: string) => Promise<void>;
  addManufacturer: (manufacturer: string) => Promise<void>;
  updateManufacturer: (oldName: string, newName: string) => Promise<void>;
  deleteManufacturer: (manufacturer: string) => Promise<void>;
  rateProduct: (id: string, rating: number) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: defaultProducts,
  categories: defaultCategories,
  productTypes: defaultProductTypes,
  manufacturers: defaultManufacturers,
  isInitialized: false,

  initialize: () => {
    if (get().isInitialized) return;
    
    // Listen to products
    onSnapshot(collection(db, 'products'), (snapshot) => {
      if (!snapshot.empty) {
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        set({ products });
      } else {
        // Seed default products if empty
        defaultProducts.forEach(p => {
          setDoc(doc(db, 'products', p.id), p);
        });
      }
    });

    // Listen to config
    onSnapshot(doc(db, 'config', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        set({
          categories: data.categories || defaultCategories,
          productTypes: data.productTypes || defaultProductTypes,
          manufacturers: data.manufacturers || defaultManufacturers,
        });
      } else {
        // Seed default config
        setDoc(doc(db, 'config', 'main'), {
          categories: defaultCategories,
          productTypes: defaultProductTypes,
          manufacturers: defaultManufacturers
        });
      }
    });

    set({ isInitialized: true });
  },

  addProduct: async (product) => {
    await setDoc(doc(db, 'products', product.id), product);
  },
  
  updateProduct: async (id, updatedFields) => {
    await updateDoc(doc(db, 'products', id), updatedFields);
  },
  
  deleteProduct: async (id) => {
    await deleteDoc(doc(db, 'products', id));
  },
  
  addCategory: async (category) => {
    const newCategories = [...get().categories, category];
    await updateDoc(doc(db, 'config', 'main'), { categories: newCategories });
  },
  
  updateCategory: async (oldName, newName) => {
    const newCategories = get().categories.map(c => c === oldName ? newName : c);
    await updateDoc(doc(db, 'config', 'main'), { categories: newCategories });
    
    // Update products
    get().products.forEach(p => {
      if (p.category === oldName) {
        updateDoc(doc(db, 'products', p.id), { category: newName });
      }
    });
  },
  
  deleteCategory: async (category) => {
    const newCategories = get().categories.filter(c => c !== category);
    await updateDoc(doc(db, 'config', 'main'), { categories: newCategories });
  },
  
  addProductType: async (type) => {
    const newTypes = [...get().productTypes, type];
    await updateDoc(doc(db, 'config', 'main'), { productTypes: newTypes });
  },
  
  updateProductType: async (oldName, newName) => {
    const newTypes = get().productTypes.map(t => t === oldName ? newName : t);
    await updateDoc(doc(db, 'config', 'main'), { productTypes: newTypes });
    
    get().products.forEach(p => {
      if (p.type === oldName) {
        updateDoc(doc(db, 'products', p.id), { type: newName });
      }
    });
  },
  
  deleteProductType: async (type) => {
    const newTypes = get().productTypes.filter(t => t !== type);
    await updateDoc(doc(db, 'config', 'main'), { productTypes: newTypes });
  },
  
  addManufacturer: async (manufacturer) => {
    const newMfrs = [...get().manufacturers, manufacturer];
    await updateDoc(doc(db, 'config', 'main'), { manufacturers: newMfrs });
  },
  
  updateManufacturer: async (oldName, newName) => {
    const newMfrs = get().manufacturers.map(m => m === oldName ? newName : m);
    await updateDoc(doc(db, 'config', 'main'), { manufacturers: newMfrs });
    
    get().products.forEach(p => {
      if (p.brand === oldName) {
        updateDoc(doc(db, 'products', p.id), { brand: newName });
      }
    });
  },
  
  deleteManufacturer: async (manufacturer) => {
    const newMfrs = get().manufacturers.filter(m => m !== manufacturer);
    await updateDoc(doc(db, 'config', 'main'), { manufacturers: newMfrs });
  },
  
  rateProduct: async (id, newRating) => {
    const product = get().products.find(p => p.id === id);
    if (product) {
      const currentCount = product.reviewsCount || 0;
      const currentRating = product.rating || 0;
      const totalRating = (currentRating * currentCount) + newRating;
      const newCount = currentCount + 1;
      await updateDoc(doc(db, 'products', id), {
        rating: totalRating / newCount,
        reviewsCount: newCount
      });
    }
  }
}));
