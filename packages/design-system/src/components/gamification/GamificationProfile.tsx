"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Star, 
  Award, 
  Target, 
  TrendingUp, 
  MapPin, 
  Calendar,
  Users,
  ShoppingCart,
  Eye,
  Heart,
  Share2,
  Crown,
  Zap,
  Gift
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

interface GamificationProfileProps {
  profile: {
    userId: string;
    username: string;
    level: number;
    experience: number;
    experienceToNextLevel: number;
    totalPoints: number;
    badges: string[];
    achievements: Array<{
      id: string;
      title: string;
      description: string;
      unlocked: boolean;
    }>;
    stats: {
      productsViewed: number;
      productsPurchased: number;
      artisansDiscovered: number;
      regionsExplored: number;
      reviewsWritten: number;
      daysActive: number;
    };
    currentQuest: string;
    inventory: {
      coins: number;
      gems: number;
      specialItems: string[];
    };
    rank: string;
    lastActivity: string;
  };
  onQuestClick?: () => void;
  onAchievementClick?: (achievementId: string) => void;
  onBadgeClick?: (badgeId: string) => void;
  className?: string;
}

export function GamificationProfile({
  profile,
  onQuestClick,
  onAchievementClick,
  onBadgeClick,
  className = ""
}: GamificationProfileProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "achievements" | "quests" | "inventory">("overview");

  const experienceProgress = (profile.experience / profile.experienceToNextLevel) * 100;

  const getRankIcon = (rank: string) => {
    const icons: { [key: string]: { icon: string; color: string } } = {
      "Maestro Artesano": { icon: "👑", color: "text-yellow-600" },
      "Experto Artesano": { icon: "⭐", color: "text-purple-600" },
      "Aprendiz Avanzado": { icon: "🌟", color: "text-blue-600" },
      "Aprendiz": { icon: "✨", color: "text-green-600" },
      "Novato": { icon: "🌱", color: "text-gray-600" }
    };
    return icons[rank] || { icon: "👤", color: "text-gray-600" };
  };

  const getBadgeIcon = (badge: string) => {
    const icons: { [key: string]: string } = {
      "first_purchase": "🛒",
      "explorer": "🔍",
      "reviewer": "✍️",
      "loyal_customer": "💎",
      "seasonal_shopper": "🌸",
      "local_supporter": "🏘️",
      "quality_seeker": "🎯",
      "adventure_seeker": "🗺️",
      "taste_master": "👅",
      "artisan_friend": "🤝"
    };
    return icons[badge] || "🏆";
  };

  const getBadgeColor = (badge: string) => {
    const colors: { [key: string]: string } = {
      "first_purchase": "bg-green-100 text-green-800 border-green-200",
      "explorer": "bg-blue-100 text-blue-800 border-blue-200",
      "reviewer": "bg-purple-100 text-purple-800 border-purple-200",
      "loyal_customer": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "seasonal_shopper": "bg-pink-100 text-pink-800 border-pink-200",
      "local_supporter": "bg-orange-100 text-orange-800 border-orange-200",
      "quality_seeker": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "adventure_seeker": "bg-teal-100 text-teal-800 border-teal-200",
      "taste_master": "bg-red-100 text-red-800 border-red-200",
      "artisan_friend": "bg-emerald-100 text-emerald-800 border-emerald-200"
    };
    return colors[badge] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-a4co-olive-50 to-a4co-clay-50 border-a4co-olive-200">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-a4co-olive-600 to-a4co-clay-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-natural-lg">
                {profile.username.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1">
                <Crown className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">{profile.username}</h2>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">{getRankIcon(profile.rank).icon}</span>
              <span className={`font-semibold ${getRankIcon(profile.rank).color}`}>
                {profile.rank}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Nivel {profile.level} • {profile.totalPoints.toLocaleString()} puntos
            </div>
          </div>

          {/* Experience Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Experiencia</span>
              <span>{profile.experience} / {profile.experienceToNextLevel}</span>
            </div>
            <Progress value={experienceProgress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: "overview", label: "Resumen", icon: TrendingUp },
          { id: "achievements", label: "Logros", icon: Trophy },
          { id: "quests", label: "Misiones", icon: Target },
          { id: "inventory", label: "Inventario", icon: Gift }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 ${
                activeTab === tab.id 
                  ? "bg-a4co-olive-600 text-white" 
                  : "hover:bg-gray-200"
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Eye className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-gray-900">
                      {profile.stats.productsViewed}
                    </div>
                    <div className="text-sm text-gray-600">Productos Vistos</div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="pt-6">
                    <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold text-gray-900">
                      {profile.stats.productsPurchased}
                    </div>
                    <div className="text-sm text-gray-600">Compras</div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold text-gray-900">
                      {profile.stats.artisansDiscovered}
                    </div>
                    <div className="text-sm text-gray-600">Artesanos</div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="pt-6">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                    <div className="text-2xl font-bold text-gray-900">
                      {profile.stats.regionsExplored}
                    </div>
                    <div className="text-sm text-gray-600">Regiones</div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Star className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                    <div className="text-2xl font-bold text-gray-900">
                      {profile.stats.reviewsWritten}
                    </div>
                    <div className="text-sm text-gray-600">Reseñas</div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-pink-600" />
                    <div className="text-2xl font-bold text-gray-900">
                      {profile.stats.daysActive}
                    </div>
                    <div className="text-sm text-gray-600">Días Activo</div>
                  </CardContent>
                </Card>
              </div>

              {/* Current Quest */}
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-yellow-600" />
                    Misión Actual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{profile.currentQuest}</p>
                  <Button 
                    onClick={onQuestClick}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    Ver Misiones
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.achievements.map((achievement) => (
                  <Card 
                    key={achievement.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-natural-lg ${
                      achievement.unlocked 
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" 
                        : "bg-gray-50 border-gray-200 opacity-60"
                    }`}
                    onClick={() => onAchievementClick?.(achievement.id)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          achievement.unlocked 
                            ? "bg-green-100 text-green-600" 
                            : "bg-gray-100 text-gray-400"
                        }`}>
                          <Award className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {achievement.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.unlocked && (
                          <Badge className="bg-green-600 text-white">
                            ✓ Desbloqueado
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "quests" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Misión Actual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {profile.currentQuest}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Zap className="w-4 h-4" />
                      <span>Recompensa: 100 puntos + Badge especial</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={onQuestClick}
                className="w-full bg-gradient-to-r from-a4co-olive-600 to-a4co-clay-600 hover:from-a4co-olive-700 hover:to-a4co-clay-700 text-white"
              >
                Ver Todas las Misiones
              </Button>
            </div>
          )}

          {activeTab === "inventory" && (
            <div className="space-y-4">
              {/* Currency */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-2">🪙</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {profile.inventory.coins}
                    </div>
                    <div className="text-sm text-gray-600">Monedas</div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-2">💎</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {profile.inventory.gems}
                    </div>
                    <div className="text-sm text-gray-600">Gemas</div>
                  </CardContent>
                </Card>
              </div>

              {/* Special Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-purple-600" />
                    Objetos Especiales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.inventory.specialItems.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {profile.inventory.specialItems.map((item, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200 text-center"
                        >
                          <div className="text-2xl mb-1">
                            {item === "olive_branch" ? "🫒" : 
                             item === "cheese_wheel" ? "🧀" : 
                             item === "honey_jar" ? "🍯" : "🎁"}
                          </div>
                          <div className="text-sm font-medium text-gray-900 capitalize">
                            {item.replace("_", " ")}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Gift className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No tienes objetos especiales aún</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Badges Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Insignias ({profile.badges.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profile.badges.map((badge) => (
              <Badge
                key={badge}
                className={`cursor-pointer ${getBadgeColor(badge)}`}
                onClick={() => onBadgeClick?.(badge)}
              >
                <span className="mr-1">{getBadgeIcon(badge)}</span>
                {badge.replace("_", " ")}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 