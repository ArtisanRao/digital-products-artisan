'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, Search, Filter, Grid, List } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import HoverableCover from '@/components/ui/hoverable-cover';
import { products, type Product } from '@/data/products';
import ProductActions from '@/components/product-actions';
import DescriptionClamp from '@/components/DescriptionClamp';
import AddToCartWire from '@/components/catalog/AddToCartWire'; // ← delegated cart handler

const baseCategories = [
  'AI & ChatGPT Guides',
  'Planners & Productivity',
  'Passive Income & Side Hustles',
  'Excel Templates & Guides',
  'Cyber Security',
  'Self-Help & How-To',
  'PLR & MRR Bundles',
  'Health & Fitness Ebooks',
  'Video Courses & Training',
  'Ebooks (Miscellaneous)',
  'Complete Shop Packages',
  'Keto & Diet Guides',
  'Prompt Packs & AI Tools',
];

const categoriesWithCounts = (products: Product[]) => {
  const counts: Record<string, number> = {};
  baseCategories.forEach((cat) => (counts[cat] = 0));
  products.forEach((p) => {
    if (counts[p.category] !== undefined) counts[p.category] += 1;
    else counts[p.category] = 1;
  });
  return counts;
};

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

const formatPrice = (value: number, currency: string = 'EUR', locale: string = 'de-DE') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);

const slugify = (s: string) =>
  s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '').replace(/\-+/g, '-');

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = useMemo(() => Array.from(new Set(products.flatMap((p) => p.tags))), []);
  const categoryCounts = useMemo(() => categoriesWithCounts(products), []);

  const handleMinPriceChange = (value: number) => {
    setPriceRange((prev) => ({ min: Math.min(value, prev.max), max: prev.max }));
  };
  const handleMaxPriceChange = (value: number) => {
    setPriceRange((prev) => ({ min: prev.min, max: Math.max(value, prev.min) }));
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const q = searchQuery.toLowerCase();
      const text = (product.longDescription ?? product.description ?? '').toLowerCase();
      const matchesSearch = product.title.toLowerCase().includes(q) || text.includes(q);
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      const matchesTags =
        selectedTags.length === 0 || selectedTags.some((tag) => product.tags.includes(tag));
      return matchesSearch && matchesCategory && matchesPrice && matchesTags;
    });
  }, [searchQuery, selectedCategory, priceRange, selectedTags]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return Number(b.id) - Number(a.id);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return b.downloads - a.downloads;
      }
    });
  }, [filteredProducts, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8" data-catalog-root>
      {/* Delegated add-to-cart just for this page */}
      <AddToCartWire rootSelector="[data-catalog-root]" />

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">All Digital Products</h1>
        <p className="text-lg text-gray-600">
          Discover our complete collection of digital downloads for creators and entrepreneurs
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 space-y-6" aria-label="Filters">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" aria-hidden />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div>
                <label htmlFor="product-search" className="text-sm font-medium text-gray-700 mb-2 block">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" aria-hidden />
                  <Input
                    id="product-search"
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    aria-label="Search products"
                  />
                </div>
              </div>

              {/* Categories */}
              <fieldset>
                <legend className="text-sm font-medium text-gray-700 mb-2 block">Category</legend>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      id="category-all"
                      name="category"
                      type="radio"
                      checked={selectedCategory === 'All'}
                      onChange={() => setSelectedCategory('All')}
                      className="h-4 w-4"
                    />
                    <label htmlFor="category-all" className="text-sm text-gray-700 cursor-pointer">
                      All ({products.length})
                    </label>
                  </div>

                  {baseCategories.map((category) => {
                    const id = `category-${slugify(category)}`;
                    return (
                      <div key={category} className="flex items-center space-x-2">
                        <input
                          id={id}
                          name="category"
                          type="radio"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="h-4 w-4"
                        />
                        <label htmlFor={id} className="text-sm text-gray-700 cursor-pointer">
                          {category} ({categoryCounts[category] || 0})
                        </label>
                      </div>
                    );
                  })}
                </div>
              </fieldset>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Price Range</label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => handleMinPriceChange(Number(e.target.value))}
                    className="w-20"
                    min={0}
                    aria-label="Minimum price"
                  />
                  <span className="text-gray-500">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                    className="w-20"
                    min={0}
                    aria-label="Maximum price"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Tags</label>
                <div className="space-y-2 max-h-40 overflow-y-auto" role="group" aria-label="Filter by tags">
                  {allTags.map((tag) => {
                    const id = `tag-${slugify(tag)}`;
                    const checked = selectedTags.includes(tag);
                    return (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={id}
                          checked={checked}
                          onCheckedChange={(v) => {
                            if (typeof v !== 'boolean') return;
                            setSelectedTags((prev) => (v ? [...prev, tag] : prev.filter((t) => t !== tag)));
                          }}
                        />
                        <label htmlFor={id} className="text-sm text-gray-700 cursor-pointer">
                          {tag}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Products Grid / List */}
        <section className="flex-1" aria-label="Products">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="text-sm text-gray-600" aria-live="polite">
              Showing {sortedProducts.length} of {products.length} products
            </div>

            <div className="flex items-center space-x-4">
              <Select value={sortBy} onValueChange={setSortBy} aria-label="Sort products">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg" role="group" aria-label="Toggle view mode">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                  aria-pressed={viewMode === 'grid'}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                  aria-pressed={viewMode === 'list'}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map((product, idx) => {
                const coverSrcs = Array.from(
                  new Set([product.image, ...(((product as any).images ?? []) as string[])].filter(Boolean))
                );
                const slug = (product as any).slug as string | undefined;

                return (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300" tabIndex={0}>
                    <CardHeader className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <Link href={`/products/${product.id}`} aria-label={`View ${product.title}`}>
                          <HoverableCover srcs={coverSrcs} alt={product.title} ratio="16/9" fit="contain" />
                        </Link>
                        {product.bestseller && (
                          <Badge className="absolute top-3 left-3 bg-yellow-400 text-black font-semibold">
                            Bestseller
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="p-4">
                      <Link
                        href={`/products/${product.id}`}
                        className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
                      >
                        <CardTitle className="text-lg font-semibold line-clamp-2">{product.title}</CardTitle>
                      </Link>

                      <DescriptionClamp
                        text={(product as any).longDescription ?? product.description ?? ''}
                        maxChars={120}
                        className="text-sm text-gray-600"
                      />

                      {coverSrcs.length > 1 && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {coverSrcs.slice(1, 4).map((thumb) => (
                            <Link href={`/products/${product.id}`} key={thumb} aria-label="View details">
                              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-50">
                                <Image
                                  src={thumb}
                                  alt={`${product.title} mockup`}
                                  fill
                                  className="object-cover"
                                  sizes="120px"
                                  loading={idx < 3 ? 'eager' : 'lazy'}
                                />
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400" aria-hidden />
                        <span className="text-sm font-medium text-gray-800">{product.rating}</span>
                        <span className="text-sm text-gray-500">({product.reviews})</span>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-lg font-semibold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="line-through text-gray-400 ml-2">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <ProductActions
                          id={product.id}
                          title={product.title}
                          price={product.price}
                          image={product.image}
                          size="sm"
                          className="shrink-0"
                        />
                        {/* Quick Add wired to unified cart via AddToCartWire */}
                        <Button
                          type="button"
                          size="sm"
                          className="bg-blue-600 text-white hover:bg-blue-700"
                          data-add-to-cart
                          data-product-id={String(product.id)}
                          {...(slug ? { 'data-product-slug': slug } : {})}
                          data-qty="1"
                          aria-label={`Add ${product.title} to cart`}
                          title="Add to cart"
                        >
                          Add to cart
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <ul className="space-y-4">
              {sortedProducts.map((product) => {
                const coverSrcs = Array.from(
                  new Set([product.image, ...(((product as any).images ?? []) as string[])].filter(Boolean))
                );
                const slug = (product as any).slug as string | undefined;

                return (
                  <li
                    key={product.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow duration-300"
                    tabIndex={0}
                  >
                    <Link href={`/products/${product.id}`} className="flex-shrink-0" aria-label={`View ${product.title}`}>
                      <div className="relative w-[120px] h-[90px] bg-white rounded-md">
                        <Image
                          src={product.image || '/placeholder.svg'}
                          alt={product.title}
                          fill
                          className="object-contain"
                          sizes="120px"
                          priority={false}
                        />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${product.id}`} className="hover:underline">
                        <h3 className="text-lg font-semibold truncate">{product.title}</h3>
                      </Link>

                      <DescriptionClamp
                        text={(product as any).longDescription ?? product.description ?? ''}
                        maxChars={160}
                        className="text-sm text-gray-600"
                      />

                      {coverSrcs.length > 1 && (
                        <div className="mt-2 flex gap-2">
                          {coverSrcs.slice(1, 4).map((thumb) => (
                            <Link href={`/products/${product.id}`} key={thumb} aria-label="View details">
                              <div className="relative w-14 h-10 rounded-md overflow-hidden bg-gray-50">
                                <Image
                                  src={thumb}
                                  alt={`${product.title} mockup`}
                                  fill
                                  className="object-cover"
                                  sizes="56px"
                                  loading="lazy"
                                />
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center space-x-2 mt-2">
                        <Star className="w-4 h-4 text-yellow-400" aria-hidden />
                        <span className="text-sm font-medium text-gray-800">{product.rating}</span>
                        <span className="text-sm text-gray-500">({product.reviews})</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <span className="text-lg font-semibold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="line-through text-gray-400">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}

                      <div className="flex items-center gap-2">
                        <ProductActions
                          id={product.id}
                          title={product.title}
                          price={product.price}
                          image={product.image}
                          size="sm"
                          className="justify-end"
                        />
                        {/* Quick Add wired to unified cart via AddToCartWire */}
                        <Button
                          type="button"
                          size="sm"
                          className="bg-blue-600 text-white hover:bg-blue-700"
                          data-add-to-cart
                          data-product-id={String(product.id)}
                          {...(slug ? { 'data-product-slug': slug } : {})}
                          data-qty="1"
                          aria-label={`Add ${product.title} to cart`}
                          title="Add to cart"
                        >
                          Add to cart
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
