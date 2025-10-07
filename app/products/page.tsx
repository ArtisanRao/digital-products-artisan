'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, Search, Filter, Grid, List } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import HoverableCover from '@/components/ui/hoverable-cover';
import AddToCartWire from '@/components/catalog/AddToCartWire';

// ✅ single source of truth for product data + canonical categories
import { products, type Product, productPath, CATEGORY_LABELS } from '@/data/products';

/* ---------------- helpers ---------------- */

// Use canonical labels directly (order matches your CATEGORY_LABELS definition)
const CANONICAL_CATEGORIES: string[] = Object.values(CATEGORY_LABELS);

const categoriesWithCounts = (items: Product[], labels: readonly string[]) => {
  const counts: Record<string, number> = Object.fromEntries(labels.map((l) => [l, 0]));
  for (const p of items) {
    if (p.category in counts) counts[p.category] += 1;
  }
  return counts;
};

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

const formatPrice = (value: number, currency = 'EUR', locale = 'de-DE') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);

const buildImages = (p: Product) =>
  Array.from(new Set([p.image, ...((p.images ?? []) as string[])].filter(Boolean)));

/* ---------------- page ---------------- */

export default function ProductsPage() {
  const PAGE_SIZE = 8;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | string>('All');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  // Reset pagination when filters/search/sort change
  useEffect(() => {
    setShowAll(false);
  }, [searchQuery, selectedCategory, sortBy, priceRange.min, priceRange.max, selectedTags]);

  const allTags = useMemo(() => Array.from(new Set(products.flatMap((p) => p.tags))), []);
  const categoryCounts = useMemo(
    () => categoriesWithCounts(products, CANONICAL_CATEGORIES),
    []
  );

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

  const visibleProducts = useMemo(
    () => (showAll ? sortedProducts : sortedProducts.slice(0, PAGE_SIZE)),
    [sortedProducts, showAll]
  );

  return (
    <div className="container mx-auto px-4 py-8" data-products-grid>
      {/* Delegated click handler for [data-add-to-cart] on this page */}
      <AddToCartWire rootSelector="[data-products-grid]" />

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">All Digital Products</h1>
        <p className="text-lg text-gray-600">
          Discover our complete collection of digital downloads for creators and entrepreneurs
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <aside className="lg:w-64 space-y-6" aria-label="Filters">
          <Card>
            <div className="px-6 pt-6 pb-0">
              <div className="text-base font-semibold flex items-center">
                <Filter className="w-5 h-5 mr-2" aria-hidden /> Filters
              </div>
            </div>
            <div className="px-6 pb-6 space-y-6">
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

              {/* Categories — canonical labels */}
              <fieldset>
                <legend className="text-sm font-medium text-gray-700 mb-2 block">Category</legend>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === 'All'}
                      onChange={() => setSelectedCategory('All')}
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-gray-700 cursor-pointer">All ({products.length})</span>
                  </label>

                  {CANONICAL_CATEGORIES.map((category) => (
                    <label key={category} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm text-gray-700 cursor-pointer">
                        {category} ({categoryCounts[category] || 0})
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Price */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Price Range</label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange((p) => ({ ...p, min: Math.min(Number(e.target.value), p.max) }))
                    }
                    className="w-20"
                    min={0}
                    aria-label="Minimum price"
                  />
                  <span className="text-gray-500">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((p) => ({ ...p, max: Math.max(Number(e.target.value), p.min) }))
                    }
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
                    const checked = selectedTags.includes(tag);
                    return (
                      <label key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) => {
                            if (typeof v !== 'boolean') return;
                            setSelectedTags((prev) => (v ? [...prev, tag] : prev.filter((t) => t !== tag)));
                          }}
                        />
                        <span className="text-sm text-gray-700 cursor-pointer">{tag}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </aside>

        {/* Products */}
        <section className="flex-1" aria-label="Products">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="text-sm text-gray-600" aria-live="polite">
              Showing {visibleProducts.length} of {sortedProducts.length} products
            </div>
            <div className="flex items-center space-x-4">
              <Select value={sortBy} onValueChange={setSortBy} aria-label="Sort products">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
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

          {/* Grid view */}
          {viewMode === 'grid' ? (
            <div id="products-list" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {visibleProducts.map((product, idx) => {
                const imgs = buildImages(product);
                const productHref = productPath(product);

                return (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300" tabIndex={0}>
                    <CardHeader className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <Link href={productHref} aria-label={`View ${product.title}`}>
                          <HoverableCover srcs={imgs} alt={product.title} ratio="16/9" fit="contain" />
                        </Link>
                        {product.bestseller && (
                          <Badge className="absolute top-3 left-3 bg-yellow-400 text-black font-semibold">
                            Bestseller
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="p-4">
                      {/* Title */}
                      <Link
                        href={productHref}
                        className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
                      >
                        <CardTitle className="text-lg font-semibold line-clamp-2">{product.title}</CardTitle>
                      </Link>

                      {/* Subtitle + More */}
                      <Link href={`${productHref}#description`} className="block mt-1 hover:underline">
                        <DescriptionClamp
                          text={(product as any).longDescription ?? product.description ?? ''}
                          maxChars={120}
                          className="text-sm text-gray-600"
                        />
                      </Link>
                      <Link
                        href={`${productHref}#description`}
                        className="mt-2 inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                        aria-label={`Read more about ${product.title}`}
                      >
                        More
                      </Link>

                      {/* Extra thumbs */}
                      {imgs.length > 1 && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {imgs.slice(1, 4).map((thumb) => (
                            <Link href={productHref} key={thumb} aria-label="View details">
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

                      {/* Rating */}
                      <div className="mt-3 flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400" aria-hidden />
                        <span className="text-sm font-medium text-gray-800">{product.rating}</span>
                        <span className="text-sm text-gray-500">({product.reviews})</span>
                      </div>

                      {/* Price */}
                      <div className="mt-3 text-xl font-semibold">{formatPrice(product.price)}</div>
                      {product.originalPrice > product.price && (
                        <div className="text-gray-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </div>
                      )}

                      {/* CTAs */}
                      <div className="mt-3 grid gap-2 [grid-template-columns:.9fr_1.2fr_.9fr]">
                        <Link
                          href={productHref}
                          className="inline-flex !h-8 items-center justify-center gap-2 rounded-lg bg-blue-600 !px-2 text-xs font-medium leading-tight text-white hover:bg-blue-700 whitespace-nowrap"
                          aria-label={`View ${product.title}`}
                        >
                          <span aria-hidden className="inline-block w-3 text-center">👁️</span>
                          <span>View</span>
                        </Link>

                        <button
                          type="button"
                          data-add-to-cart
                          data-product-id={String(product.id)}
                          {...(product.slug ? { 'data-product-slug': String(product.slug) } : {})}
                          data-qty="1"
                          className="inline-flex !h-8 items-center justify-center gap-2 rounded-lg bg-blue-600 !px-3 text-xs font-medium leading-tight text-white hover:bg-blue-700 whitespace-nowrap"
                          aria-label="Add to cart"
                        >
                          <span aria-hidden className="inline-block w-5 text-center">🛒</span>
                          <span>Add to cart</span>
                        </button>

                        <Link
                          href={`/api/checkout?productId=${encodeURIComponent(String(product.id))}&qty=1`}
                          prefetch={false}
                          className="inline-flex !h-8 items-center justify-center gap-2 rounded-lg bg-blue-600 !px-2 text-xs font-medium leading-tight text-white hover:bg-blue-700 whitespace-nowrap"
                          aria-label="Buy now"
                        >
                          <span aria-hidden className="inline-block w-3 text-center">⚡</span>
                          <span>Buy</span>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* List view */
            <ul id="products-list" className="space-y-4">
              {visibleProducts.map((product) => {
                const imgs = buildImages(product);
                const productHref = productPath(product);

                return (
                  <li
                    key={product.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow duration-300"
                    tabIndex={0}
                  >
                    <Link href={productHref} className="flex-shrink-0" aria-label={`View ${product.title}`}>
                      <div className="relative w-[120px] h-[90px] bg-white rounded-md">
                        <Image
                          src={product.image || '/placeholder.svg'}
                          alt={product.title}
                          fill
                          className="object-contain"
                          sizes="120px"
                        />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link href={productHref} className="hover:underline">
                        <h3 className="text-lg font-semibold truncate">{product.title}</h3>
                      </Link>

                      <Link href={`${productHref}#description`} className="block mt-1 hover:underline">
                        <DescriptionClamp
                          text={(product as any).longDescription ?? product.description ?? ''}
                          maxChars={160}
                          className="text-sm text-gray-600"
                        />
                      </Link>
                      <Link
                        href={`${productHref}#description`}
                        className="mt-2 inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        More
                      </Link>

                      {imgs.length > 1 && (
                        <div className="mt-2 flex gap-2">
                          {imgs.slice(1, 4).map((thumb) => (
                            <Link href={productHref} key={thumb} aria-label="View details">
                              <div className="relative w-14 h-10 rounded-md overflow-hidden bg-gray-50">
                                <Image
                                  src={thumb}
                                  alt={`${product.title} mockup`}
                                  fill
                                  className="object-cover"
                                  sizes="56px"
                                />
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        <Star className="w-4 h-4 text-yellow-400" aria-hidden />
                        <span className="text-sm font-medium text-gray-800">{product.rating}</span>
                        <span className="text-sm text-gray-500">({product.reviews})</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="text-lg font-semibold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="line-through text-gray-400">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}

                      <div className="mt-1 grid gap-2 [grid-template-columns:.9fr_1.2fr_.9fr]">
                        <Link
                          href={productHref}
                          className="inline-flex !h-8 items-center justify-center gap-2 rounded-lg bg-blue-600 !px-2 text-xs font-medium leading-tight text-white hover:bg-blue-700 whitespace-nowrap"
                          aria-label={`View ${product.title}`}
                        >
                          <span aria-hidden className="inline-block w-3 text-center">👁️</span>
                          <span>View</span>
                        </Link>

                        <button
                          type="button"
                          data-add-to-cart
                          data-product-id={String(product.id)}
                          {...(product.slug ? { 'data-product-slug': String(product.slug) } : {})}
                          data-qty="1"
                          className="inline-flex !h-8 items-center justify-center gap-2 rounded-lg bg-blue-600 !px-3 text-xs font-medium leading-tight text-white hover:bg-blue-700 whitespace-nowrap"
                          aria-label="Add to cart"
                        >
                          <span aria-hidden className="inline-block w-5 text-center">🛒</span>
                          <span>Add to cart</span>
                        </button>

                        <Link
                          href={`/api/checkout?productId=${encodeURIComponent(String(product.id))}&qty=1`}
                          prefetch={false}
                          className="inline-flex !h-8 items-center justify-center gap-2 rounded-lg bg-blue-600 !px-2 text-xs font-medium leading-tight text-white hover:bg-blue-700 whitespace-nowrap"
                          aria-label="Buy now"
                        >
                          <span aria-hidden className="inline-block w-3 text-center">⚡</span>
                          <span>Buy</span>
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* See more / See less */}
          {sortedProducts.length > PAGE_SIZE && (
            <div className="mt-8 flex justify-center gap-3">
              {showAll ? (
                <Button
                  onClick={() => setShowAll(false)}
                  variant="outline"
                  aria-controls="products-list"
                  title="See less products"
                >
                  See less products
                </Button>
              ) : (
                <Button
                  onClick={() => setShowAll(true)}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  aria-controls="products-list"
                  title="See more products"
                >
                  See more products
                </Button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
