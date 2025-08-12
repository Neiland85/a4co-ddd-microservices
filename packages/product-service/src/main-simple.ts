import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware básico
app.use(helmet());
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'product-service',
    version: '1.0.0',
    features: {
      gamification: true,
      rateLimiting: true,
      security: true
    }
  });
});

// Mock products data
const mockProducts = [
  {
    id: "prod_001",
    name: "Aceite de Oliva Virgen Extra Picual",
    category: "aceite",
    producer: "Cooperativa Olivarera San José",
    location: {
      municipality: "Úbeda",
      coordinates: [38.0138, -3.3706]
    },
    price: 12.5,
    unit: "botella 500ml",
    seasonal: true,
    harvestDate: "2024-11-15",
    description: "Aceite de primera presión en frío de aceitunas Picual recogidas en su punto óptimo de maduración.",
    images: ["/images/aceite-picual.jpg"],
    certifications: ["Denominación de Origen", "Ecológico"],
    available: true,
    stock: 150,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod_002",
    name: "Queso de Cabra Artesanal",
    category: "queso",
    producer: "Quesería Los Olivos",
    location: {
      municipality: "Cazorla",
      coordinates: [37.9105, -2.9745]
    },
    price: 8.75,
    unit: "pieza 250g",
    seasonal: false,
    description: "Queso artesanal elaborado con leche fresca de cabras criadas en la Sierra de Cazorla.",
    images: ["/images/queso-cabra.jpg"],
    certifications: ["Artesanal", "Local"],
    available: true,
    stock: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Products endpoint
app.get('/api/products', (req, res) => {
  const { category, seasonal, available, search } = req.query;
  
  let filteredProducts = [...mockProducts];
  
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  if (seasonal !== undefined) {
    filteredProducts = filteredProducts.filter(p => p.seasonal === (seasonal === 'true'));
  }
  
  if (available !== undefined) {
    filteredProducts = filteredProducts.filter(p => p.available === (available === 'true'));
  }
  
  if (search) {
    const searchLower = search.toString().toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.producer.toLowerCase().includes(searchLower)
    );
  }

  res.json({
    success: true,
    data: {
      products: filteredProducts,
      pagination: {
        total: filteredProducts.length,
        limit: parseInt(req.query.limit as string) || 10,
        offset: parseInt(req.query.offset as string) || 0,
        hasMore: false
      },
      filters: {
        category: category || null,
        location: null,
        seasonal: seasonal === 'true' || false,
        available: available === 'true' || false,
        search: search || null
      }
    },
    meta: {
      timestamp: new Date().toISOString(),
      region: "Jaén, Andalucía",
      categories: ["aceite", "queso", "jamón", "miel", "vino", "aceitunas", "artesanía"]
    }
  });
});

// Gamification endpoints
app.get('/api/gamification/profile/:userId', (req, res) => {
  const userId = req.params.userId || 'anonymous';
  
  const profile = {
    userId,
    username: `Artesano_${userId}`,
    level: Math.floor(Math.random() * 50) + 1,
    experience: Math.floor(Math.random() * 10000),
    experienceToNextLevel: 1000,
    totalPoints: Math.floor(Math.random() * 50000) + 1000,
    badges: ['first_purchase', 'explorer', 'reviewer'].slice(0, Math.floor(Math.random() * 3) + 1),
    achievements: [
      { id: 'first_steps', title: 'Primeros Pasos', description: 'Realiza tu primera compra', unlocked: true },
      { id: 'explorer', title: 'Explorador', description: 'Descubre 10 productos diferentes', unlocked: Math.random() > 0.5 }
    ],
    stats: {
      productsViewed: Math.floor(Math.random() * 1000),
      productsPurchased: Math.floor(Math.random() * 100),
      artisansDiscovered: Math.floor(Math.random() * 50),
      regionsExplored: Math.floor(Math.random() * 12),
      reviewsWritten: Math.floor(Math.random() * 20),
      daysActive: Math.floor(Math.random() * 365)
    },
    currentQuest: 'Descubre 3 aceites de oliva diferentes',
    inventory: {
      coins: Math.floor(Math.random() * 1000),
      gems: Math.floor(Math.random() * 100),
      specialItems: ['olive_branch', 'cheese_wheel'].slice(0, Math.floor(Math.random() * 2) + 1)
    },
    rank: 'Aprendiz Avanzado',
    lastActivity: new Date().toISOString()
  };

  res.json({
    success: true,
    data: profile,
    message: '¡Perfil de Artesano cargado!',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/gamification/action', (req, res) => {
  const { userId, action, productId, artisanId } = req.body;
  
  const actionPointsMap: { [key: string]: number } = {
    'view_product': 1,
    'purchase_product': 10,
    'write_review': 5,
    'discover_artisan': 3,
    'explore_region': 2,
    'share_product': 2,
    'favorite_product': 1
  };
  const actionPoints = actionPointsMap[action] || 1;
  
  const bonusPoints = Math.floor(Math.random() * 5) + 1;
  const totalPoints = actionPoints + bonusPoints;
  
  const result = {
    userId: userId || 'anonymous',
    action,
    pointsEarned: totalPoints,
    breakdown: {
      basePoints: actionPoints,
      bonusPoints,
      multiplier: 1 + (Math.random() * 0.5)
    },
    newTotal: Math.floor(Math.random() * 50000) + totalPoints,
    levelUp: Math.random() > 0.8,
    achievementUnlocked: Math.random() > 0.9,
    message: `¡${action.replace('_', ' ')}! +${totalPoints} puntos`
  };

  res.json({
    success: true,
    data: result,
    message: '¡Acción registrada con éxito!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/gamification/leaderboard', (req, res) => {
  const leaderboard = Array.from({ length: 10 }, (_, i) => ({
    rank: i + 1,
    userId: `artesano_${i + 1}`,
    username: ['María del Olivo', 'Antonio Quesero', 'Carmen Mielera', 'José Aceitero', 'Ana Artesana'][i % 5],
    points: Math.floor(Math.random() * 100000) + 1000,
    level: Math.floor(Math.random() * 100) + 1,
    region: ['Úbeda', 'Cazorla', 'Baeza', 'Jaén', 'Linares'][i % 5],
    specialty: ['Aceite de Oliva', 'Queso Artesanal', 'Miel Natural', 'Embutidos', 'Vinos'][i % 5],
    productsCount: Math.floor(Math.random() * 50) + 1,
    rating: (Math.random() * 2 + 3).toFixed(1),
    badges: ['first_purchase', 'explorer', 'reviewer'].slice(0, Math.floor(Math.random() * 3) + 1),
    isOnline: Math.random() > 0.7,
    lastActivity: new Date(Date.now() - Math.random() * 86400000).toISOString()
  })).sort((a, b) => b.points - a.points);

  res.json({
    success: true,
    data: {
      leaderboard,
      category: req.query.category || 'all',
      region: req.query.region || 'all',
      timeFrame: req.query.timeFrame || 'all-time',
      userRank: Math.floor(Math.random() * 100) + 1
    },
    message: '¡Ranking de Artesanos cargado!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/gamification/quests', (req, res) => {
  const quests = [
    {
      id: 'quest_001',
      title: 'Explorador de Aceites',
      description: 'Descubre 5 aceites de oliva diferentes de Jaén',
      type: 'exploration',
      difficulty: 'easy',
      reward: { points: 100, badge: 'oil_explorer' },
      progress: { current: Math.floor(Math.random() * 5), total: 5 },
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'quest_002',
      title: 'Maestro Quesero',
      description: 'Compra productos de 3 queserías diferentes',
      type: 'purchase',
      difficulty: 'medium',
      reward: { points: 250, badge: 'cheese_master' },
      progress: { current: Math.floor(Math.random() * 3), total: 3 },
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  res.json({
    success: true,
    data: {
      quests,
      dailyQuests: quests.slice(0, 1),
      weeklyQuests: quests.slice(1, 2),
      activeQuests: quests.filter(q => q.progress.current > 0),
      completedQuests: []
    },
    message: '¡Misiones disponibles cargadas!',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Product Service (Simple) running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🛍️  Products API: http://localhost:${PORT}/api/products`);
  console.log(`🎮 Gamification: http://localhost:${PORT}/api/gamification/profile/user123`);
  console.log(`🏆 Leaderboard: http://localhost:${PORT}/api/gamification/leaderboard`);
  console.log(`📋 Quests: http://localhost:${PORT}/api/gamification/quests`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
}); 