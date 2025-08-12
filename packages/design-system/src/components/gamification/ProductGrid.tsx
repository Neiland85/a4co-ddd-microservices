"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search, Grid, List, Trophy, Star, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  name: string;
  category: string;
  producer: string;
  location: {
    municipality: string;
    coordinates: [number, number];
  };
  price: number;
  unit: string;
  seasonal: boolean;
  harvestDate?: string;
  description: string;
  images: string[];
  certifications: string[];
  available: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductGridProps {
  products: Product[];
  categories: string[];
  onProductView?: (productId: string) => void;
  onProductPurchase?: (productId: string) => void;
  onProductFavorite?: (productId: string) => void;
  onProductShare?: (productId: string) => void;
  className?: string;
}

export function ProductGrid({
  products,
  categories,
  onProductView,
  onProductPurchase,
  onProductFavorite,
  onProductShare,
  className = ""
}: ProductGridProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [showSeasonal, setShowSeasonal] = useState(false);
  const [showAvailable, setShowAvailable] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "price" | "date" | "popularity">("name");

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.producer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Region filter
    if (selectedRegion !== "all") {
      filtered = filtered.filter(product => product.location.municipality === selectedRegion);
    }

    // Seasonal filter
    if (showSeasonal) {
      filtered = filtered.filter(product => product.seasonal);
    }

    // Available filter
    if (showAvailable) {
      filtered = filtered.filter(product => product.available);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.price - b.price;
        case "date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "popularity":
          return b.stock - a.stock; // Using stock as popularity proxy
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, selectedRegion, showSeasonal, showAvailable, sortBy]);

  const regions = Array.from(new Set(products.map(p => p.location.municipality)));

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      aceite: "🫒",
      queso: "🧀",
      jamón: "🥓",
      miel: "🍯",
      vino: "🍷",
      aceitunas: "🫒",
      artesanía: "🎨"
    };
    return icons[category] || "📦";
  };

  const handleProductView = (productId: string) => {
    onProductView?.(productId);
    // Simulate gamification points
    console.log(`🎮 +1 punto por ver producto ${productId}`);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-a4co-olive-50 to-a4co-clay-50 rounded-xl p-6 border border-a4co-olive-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Productos Artesanales
            </h2>
            <p className="text-gray-600">
              Descubre los mejores productos de Jaén
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-a4co-olive-600">
              {filteredProducts.length}
            </div>
            <div className="text-sm text-gray-600">productos encontrados</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {products.filter(p => p.available).length}
            </div>
            <div className="text-sm text-gray-600">Disponibles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">
              {products.filter(p => p.seasonal).length}
            </div>
            <div className="text-sm text-gray-600">Estacionales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {regions.length}
            </div>
            <div className="text-sm text-gray-600">Regiones</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-natural border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="bg-a4co-olive-600 hover:bg-a4co-olive-700"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="bg-a4co-olive-600 hover:bg-a4co-olive-700"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="mt-4 space-y-3">
          {/* Categories */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Categorías</h4>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === "all" ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedCategory === "all" 
                    ? "bg-a4co-olive-600 text-white" 
                    : "hover:bg-a4co-olive-50"
                }`}
                onClick={() => setSelectedCategory("all")}
              >
                Todas
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedCategory === category 
                      ? "bg-a4co-olive-600 text-white" 
                      : "hover:bg-a4co-olive-50"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {getCategoryIcon(category)} {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Regions */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Regiones</h4>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedRegion === "all" ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedRegion === "all" 
                    ? "bg-a4co-clay-600 text-white" 
                    : "hover:bg-a4co-clay-50"
                }`}
                onClick={() => setSelectedRegion("all")}
              >
                <MapPin className="w-3 h-3 mr-1" />
                Todas
              </Badge>
              {regions.map((region) => (
                <Badge
                  key={region}
                  variant={selectedRegion === region ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedRegion === region 
                      ? "bg-a4co-clay-600 text-white" 
                      : "hover:bg-a4co-clay-50"
                  }`}
                  onClick={() => setSelectedRegion(region)}
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  {region}
                </Badge>
              ))}
            </div>
          </div>

          {/* Other Filters */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={showSeasonal ? "default" : "outline"}
              className={`cursor-pointer ${
                showSeasonal 
                  ? "bg-pink-600 text-white" 
                  : "hover:bg-pink-50"
              }`}
              onClick={() => setShowSeasonal(!showSeasonal)}
            >
              🌸 Solo Estacionales
            </Badge>
            <Badge
              variant={showAvailable ? "default" : "outline"}
              className={`cursor-pointer ${
                showAvailable 
                  ? "bg-green-600 text-white" 
                  : "hover:bg-green-50"
              }`}
              onClick={() => setShowAvailable(!showAvailable)}
            >
              ✅ Solo Disponibles
            </Badge>
          </div>
        </div>

        {/* Sort Options */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-a4co-olive-500"
          >
            <option value="name">Nombre</option>
            <option value="price">Precio</option>
            <option value="date">Más Recientes</option>
            <option value="popularity">Más Populares</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <AnimatePresence mode="wait">
        {filteredProducts.length > 0 ? (
          <motion.div
            key={`${viewMode}-${filteredProducts.length}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard
                  product={product}
                  gamificationData={{
                    pointsEarned: Math.floor(Math.random() * 5) + 1,
                    levelUp: Math.random() > 0.95,
                    achievementUnlocked: Math.random() > 0.98,
                    isFavorite: Math.random() > 0.7,
                    viewCount: Math.floor(Math.random() * 100)
                  }}
                  onView={handleProductView}
                  onPurchase={onProductPurchase}
                  onFavorite={onProductFavorite}
                  onShare={onProductShare}
                  className={viewMode === "list" ? "flex-row" : ""}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600 mb-4">
              Intenta ajustar los filtros o buscar con otros términos
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedRegion("all");
                setShowSeasonal(false);
                setShowAvailable(false);
              }}
              className="bg-a4co-olive-600 hover:bg-a4co-olive-700"
            >
              Limpiar Filtros
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 