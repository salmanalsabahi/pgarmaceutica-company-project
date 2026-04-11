import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { ProductCard } from '../components/ProductCard';

export const Catalog: React.FC = () => {
  const { products, categories, productTypes, manufacturers } = useProductStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialCategory = searchParams.get('category') || '';
  const initialType = searchParams.get('type') || '';
  const initialBrand = searchParams.get('brand') || '';
  const initialSearch = searchParams.get('search') || '';
  
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('name');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedType(searchParams.get('type') || '');
    setSelectedBrand(searchParams.get('brand') || '');
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.nameAr.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.specs.scientificName.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (selectedType) {
      result = result.filter(p => p.type === selectedType);
    }
    if (selectedBrand) {
      result = result.filter(p => p.brand === selectedBrand);
    }
    if (inStockOnly) {
      result = result.filter(p => p.inStock);
    }

    result.sort((a, b) => {
      if (sortBy === 'price_asc') return a.price_yer - b.price_yer;
      if (sortBy === 'price_desc') return b.price_yer - a.price_yer;
      return a.nameAr.localeCompare(b.nameAr, 'ar');
    });

    return result;
  }, [products, selectedCategory, selectedType, selectedBrand, inStockOnly, sortBy, searchQuery]);

  const updateParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const handleCategoryChange = (category: string) => {
    const newVal = category === selectedCategory ? '' : category;
    setSelectedCategory(newVal);
    updateParams({ category: newVal });
  };

  const handleTypeChange = (type: string) => {
    const newVal = type === selectedType ? '' : type;
    setSelectedType(newVal);
    updateParams({ type: newVal });
  };

  const handleBrandChange = (brand: string) => {
    const newVal = brand === selectedBrand ? '' : brand;
    setSelectedBrand(newVal);
    updateParams({ brand: newVal });
  };

  return (
    <div className="bg-bg min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">المنتجات</h1>
          <p className="text-text-muted">تصفح جميع الأدوية والمستلزمات الطبية المتاحة</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <button 
            className="lg:hidden flex items-center justify-between bg-white p-4 rounded-lg border border-border font-medium"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <span className="flex items-center gap-2"><Filter className="w-5 h-5" /> تصفية النتائج</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${isMobileFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Sidebar Filters */}
          <aside className={`lg:w-1/4 ${isMobileFilterOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white rounded-xl border border-border p-6 sticky top-24">
              <div className="flex items-center gap-2 font-bold text-lg mb-6 pb-4 border-b border-border">
                <Filter className="w-5 h-5 text-primary" />
                تصفية النتائج
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-bold mb-3 text-text">الأقسام</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                        checked={selectedCategory === category}
                        onChange={() => handleCategoryChange(category)}
                      />
                      <span className="text-sm text-text-muted group-hover:text-primary transition-colors">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Product Types */}
              <div className="mb-6">
                <h3 className="font-bold mb-3 text-text">أنواع المنتجات</h3>
                <div className="space-y-2">
                  {productTypes.map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                        checked={selectedType === type}
                        onChange={() => handleTypeChange(type)}
                      />
                      <span className="text-sm text-text-muted group-hover:text-primary transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Manufacturers */}
              <div className="mb-6">
                <h3 className="font-bold mb-3 text-text">الشركات المصنعة</h3>
                <div className="space-y-2">
                  {manufacturers.map(brand => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                        checked={selectedBrand === brand}
                        onChange={() => handleBrandChange(brand)}
                      />
                      <span className="text-sm text-text-muted group-hover:text-primary transition-colors">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <h3 className="font-bold mb-3 text-text">التوفر</h3>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                  />
                  <span className="text-sm text-text-muted group-hover:text-primary transition-colors">متوفر في المخزون فقط</span>
                </label>
              </div>

              {/* Reset Filters */}
              <button 
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedType('');
                  setSelectedBrand('');
                  setSearchQuery('');
                  setInStockOnly(false);
                  setSearchParams({});
                }}
                className="w-full py-2 text-sm text-danger border border-danger/30 rounded-lg hover:bg-danger/5 transition-colors"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="lg:w-3/4">
            {/* Top Bar */}
            <div className="bg-white p-4 rounded-xl border border-border mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-text-muted">
                عرض <span className="font-bold text-text">{filteredProducts.length}</span> منتج
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-muted">ترتيب حسب:</span>
                <select 
                  className="border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">الاسم (أ - ي)</option>
                  <option value="price_asc">السعر (الأقل أولاً)</option>
                  <option value="price_desc">السعر (الأعلى أولاً)</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-border p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">لا توجد منتجات</h3>
                <p className="text-text-muted">لم يتم العثور على منتجات تطابق معايير البحث الخاصة بك.</p>
                <button 
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedType('');
                    setSelectedBrand('');
                    setSearchQuery('');
                    setInStockOnly(false);
                    setSearchParams({});
                  }}
                  className="mt-6 text-primary font-medium hover:underline"
                >
                  مسح الفلاتر
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
