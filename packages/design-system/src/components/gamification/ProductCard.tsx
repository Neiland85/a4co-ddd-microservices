"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Star, MapPin, Award, ShoppingCart, Eye, Share2, Trophy } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";

interface ProductCardProps {
  product: {
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
  };
  gamificationData?: {
    pointsEarned?: number;
    levelUp?: boolean;
    achievementUnlocked?: boolean;
    isFavorite?: boolean;
    viewCount?: number;
  };
  onView?: (productId: string) => void;
  onPurchase?: (productId: string) => void;
  onFavorite?: (productId: string) => void;
  onShare?: (productId: string) => void;
  className?: string;
}

export function ProductCard({
  product,
  gamificationData = {},
  onView,
  onPurchase,
  onFavorite,
  onShare,
  className = ""
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(gamificationData.isFavorite || false);
  const [showGamification, setShowGamification] = useState(false);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    onFavorite?.(product.id);
  };

  const handleView = () => {
    onView?.(product.id);
    setShowGamification(true);
    setTimeout(() => setShowGamification(false), 3000);
  };

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

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      aceite: "bg-green-100 text-green-800 border-green-200",
      queso: "bg-yellow-100 text-yellow-800 border-yellow-200",
      jamón: "bg-red-100 text-red-800 border-red-200",
      miel: "bg-amber-100 text-amber-800 border-amber-200",
      vino: "bg-purple-100 text-purple-800 border-purple-200",
      aceitunas: "bg-green-100 text-green-800 border-green-200",
      artesanía: "bg-blue-100 text-blue-800 border-blue-200"
    };
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <motion.div
      className={`relative ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="overflow-hidden border-0 shadow-natural-lg hover:shadow-natural-xl transition-all duration-300 bg-white">
        {/* Gamification Badge */}
        {gamificationData.pointsEarned && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-3 right-3 z-10"
          >
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-natural">
              <Trophy className="w-3 h-3 mr-1" />
              +{gamificationData.pointsEarned} pts
            </Badge>
          </motion.div>
        )}

        {/* Product Image */}
        <div className="relative h-48 bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">{getCategoryIcon(product.category)}</span>
          </div>
          
          {/* Seasonal Badge */}
          {product.seasonal && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-gradient-to-r from-pink-400 to-red-500 text-white border-0">
                🌸 Estacional
              </Badge>
            </div>
          )}

          {/* Stock Indicator */}
          <div className="absolute bottom-3 left-3">
            <Badge 
              className={`${
                product.stock > 50 
                  ? "bg-green-100 text-green-800 border-green-200" 
                  : product.stock > 10 
                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                  : "bg-red-100 text-red-800 border-red-200"
              }`}
            >
              Stock: {product.stock}
            </Badge>
          </div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 bg-white/80 hover:bg-white shadow-natural"
            onClick={handleFavorite}
          >
            <Heart 
              className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} 
            />
          </Button>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-2">
                {product.name}
              </h3>
              
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getCategoryColor(product.category)}>
                  {getCategoryIcon(product.category)} {product.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {product.unit}
                </Badge>
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{product.location.municipality}</span>
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Award className="w-4 h-4" />
                <span>{product.producer}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-a4co-olive-600">
                €{product.price.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">
                por {product.unit}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {product.description}
          </p>

          {/* Certifications */}
          {product.certifications.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {product.certifications.map((cert, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {cert}
                </Badge>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleView}
              className="flex-1 bg-gradient-to-r from-a4co-olive-600 to-a4co-clay-600 hover:from-a4co-olive-700 hover:to-a4co-clay-700 text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Detalles
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare?.(product.id)}
              className="border-a4co-olive-200 text-a4co-olive-600 hover:bg-a4co-olive-50"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Purchase Button */}
          {product.available && (
            <Button
              onClick={() => onPurchase?.(product.id)}
              className="w-full mt-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-natural"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Comprar Ahora
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Gamification Popup */}
      <AnimatePresence>
        {showGamification && gamificationData.pointsEarned && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full shadow-natural-lg">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span className="font-semibold">+{gamificationData.pointsEarned} puntos</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Animation */}
      <AnimatePresence>
        {gamificationData.levelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg z-10"
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <div className="text-white font-bold text-lg">¡Subiste de nivel!</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 