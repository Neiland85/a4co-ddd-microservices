"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Star, 
  TrendingUp, 
  MapPin, 
  ShoppingCart,
  Heart,
  Share2,
  Eye,
  Filter,
  Search,
  Grid,
  List,
  Crown,
  Zap,
  Target,
  Award
} from "lucide-react";
import { ProductGrid } from "./ProductGrid";
import { GamificationProfile } from "./GamificationProfile";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

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

interface ProductShowcaseProps {
  products: Product[];
  categories: string[];
  gamificationProfile?: any;
  onProductView?: (productId: string) => void;
  onProductPurchase?: (productId: string) => void;
  onProductFavorite?: (productId: string) => void;
  onProductShare?: (productId: string) => void;
  className?: string;
}

export function ProductShowcase({
  products,
  categories,
  gamificationProfile,
  onProductView,
  onProductPurchase,
  onProductFavorite,
  onProductShare,
  className = ""
}: ProductShowcaseProps) {
  const [showGamification, setShowGamification] = useState(false);
  const [recentActivity, setRecentActivity] = useState<Array<{
    type: string;
    message: string;
    points: number;
    timestamp: string;
  }>>([]);

  // Simulate recent activity
  useEffect(() => {
    const activities = [
      { type: "view", message: "Viste Aceite de Oliva Virgen Extra", points: 1, timestamp: "2 min" },
      { type: "purchase", message: "Compraste Queso de Cabra Artesanal", points: 10, timestamp: "15 min" },
      { type: "achievement", message: "¡Logro desbloqueado: Primeros Pasos!", points: 50, timestamp: "1 hora" },
      { type: "level", message: "¡Subiste al nivel 5!", points: 100, timestamp: "2 horas" }
    ];
    setRecentActivity(activities);
  }, []);

  const getActivityIcon = (type: string) => {
    const icons: { [key: string]: any } = {
      view: Eye,
      purchase: ShoppingCart,
      achievement: Trophy,
      level: Crown,
      favorite: Heart,
      share: Share2
    };
    return icons[type] || Eye;
  };

  const getActivityColor = (type: string) => {
    const colors: { [key: string]: string } = {
      view: "text-blue-600",
      purchase: "text-green-600",
      achievement: "text-yellow-600",
      level: "text-purple-600",
      favorite: "text-red-600",
      share: "text-orange-600"
    };
    return colors[type] || "text-gray-600";
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 ${className}`}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-a4co-olive-600 to-a4co-clay-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                🎮 Artesano Quest
              </h1>
              <p className="text-a4co-olive-100">
                Descubre productos artesanales y gana puntos
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Gamification Stats */}
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {gamificationProfile?.totalPoints || 0}
                </div>
                <div className="text-sm text-a4co-olive-100">Puntos</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {gamificationProfile?.level || 1}
                </div>
                <div className="text-sm text-a4co-olive-100">Nivel</div>
              </div>
              
              <Button
                onClick={() => setShowGamification(!showGamification)}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-a4co-olive-600"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Mi Perfil
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {products.filter(p => p.available).length}
                      </div>
                      <div className="text-sm text-gray-600">Productos Disponibles</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {products.filter(p => p.seasonal).length}
                      </div>
                      <div className="text-sm text-gray-600">Productos Estacionales</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {Array.from(new Set(products.map(p => p.location.municipality))).length}
                      </div>
                      <div className="text-sm text-gray-600">Regiones</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Products Grid */}
            <ProductGrid
              products={products}
              categories={categories}
              onProductView={onProductView}
              onProductPurchase={onProductPurchase}
              onProductFavorite={onProductFavorite}
              onProductShare={onProductShare}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Gamification Profile */}
            <AnimatePresence>
              {showGamification && gamificationProfile && (
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  className="lg:hidden"
                >
                  <GamificationProfile
                    profile={gamificationProfile}
                    onQuestClick={() => console.log("Ver misiones")}
                    onAchievementClick={(id) => console.log("Logro:", id)}
                    onBadgeClick={(id) => console.log("Badge:", id)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Desktop Gamification Profile */}
            {!showGamification && gamificationProfile && (
              <div className="hidden lg:block">
                <GamificationProfile
                  profile={gamificationProfile}
                  onQuestClick={() => console.log("Ver misiones")}
                  onAchievementClick={(id) => console.log("Logro:", id)}
                  onBadgeClick={(id) => console.log("Badge:", id)}
                />
              </div>
            )}

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-natural-sm ${getActivityColor(activity.type)}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                              +{activity.points} pts
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {activity.timestamp}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-a4co-olive-200 text-a4co-olive-700 hover:bg-a4co-olive-50"
                    onClick={() => console.log("Ver misiones")}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Ver Misiones
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start border-a4co-clay-200 text-a4co-clay-700 hover:bg-a4co-clay-50"
                    onClick={() => console.log("Ver ranking")}
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Ver Ranking
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50"
                    onClick={() => console.log("Ver logros")}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Ver Logros
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Seasonal Highlights */}
            <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-pink-800">
                  🌸 Destacados Estacionales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {products.filter(p => p.seasonal).slice(0, 3).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors cursor-pointer"
                      onClick={() => onProductView?.(product.id)}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">
                          {product.category === "aceite" ? "🫒" : 
                           product.category === "queso" ? "🧀" : "🍯"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {product.location.municipality}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-pink-600">
                          €{product.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 