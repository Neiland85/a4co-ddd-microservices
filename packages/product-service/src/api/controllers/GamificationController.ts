import { Request, Response } from 'express';

/**
 * Controlador para el sistema gamificado "Artesano Quest"
 * Maneja puntos, logros, badges y experiencias interactivas
 */
export class GamificationController {
  
  /**
   * Obtiene el perfil gamificado del usuario
   * @param req - Request de Express
   * @param res - Response de Express
   */
  async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId || 'anonymous';
      
      // Simular perfil gamificado
      const profile = {
        userId,
        username: `Artesano_${userId}`,
        level: Math.floor(Math.random() * 50) + 1,
        experience: Math.floor(Math.random() * 10000),
        experienceToNextLevel: 1000,
        totalPoints: Math.floor(Math.random() * 50000) + 1000,
        badges: this.generateRandomBadges(),
        achievements: this.generateRandomAchievements(),
        stats: {
          productsViewed: Math.floor(Math.random() * 1000),
          productsPurchased: Math.floor(Math.random() * 100),
          artisansDiscovered: Math.floor(Math.random() * 50),
          regionsExplored: Math.floor(Math.random() * 12),
          reviewsWritten: Math.floor(Math.random() * 20),
          daysActive: Math.floor(Math.random() * 365)
        },
        currentQuest: this.generateCurrentQuest(),
        inventory: this.generateInventory(),
        rank: this.calculateRank(Math.floor(Math.random() * 50000) + 1000),
        lastActivity: new Date().toISOString()
      };

      res.status(200).json({
        success: true,
        data: profile,
        message: '¡Perfil de Artesano cargado!',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error getting user profile:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error al cargar el perfil gamificado'
      });
    }
  }

  /**
   * Registra una acción del usuario y otorga puntos
   * @param req - Request de Express
   * @param res - Response de Express
   */
  async recordAction(req: Request, res: Response): Promise<void> {
    try {
      const { userId, action, productId, artisanId } = req.body;
      
      const actionPoints = this.getActionPoints(action);
      const bonusPoints = this.calculateBonusPoints(action, productId, artisanId);
      const totalPoints = actionPoints + bonusPoints;
      
      const result = {
        userId: userId || 'anonymous',
        action,
        pointsEarned: totalPoints,
        breakdown: {
          basePoints: actionPoints,
          bonusPoints,
          multiplier: this.getMultiplier(userId)
        },
        newTotal: Math.floor(Math.random() * 50000) + totalPoints,
        levelUp: Math.random() > 0.8, // 20% chance de subir nivel
        achievementUnlocked: Math.random() > 0.9, // 10% chance de logro
        message: this.getActionMessage(action, totalPoints)
      };

      res.status(200).json({
        success: true,
        data: result,
        message: '¡Acción registrada con éxito!',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error recording action:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error al registrar la acción'
      });
    }
  }

  /**
   * Obtiene el ranking de artesanos
   * @param req - Request de Express
   * @param res - Response de Express
   */
  async getLeaderboard(req: Request, res: Response): Promise<void> {
    try {
      const { category, region, timeFrame } = req.query;
      
      const leaderboard = Array.from({ length: 20 }, (_, i) => ({
        rank: i + 1,
        userId: `artesano_${i + 1}`,
        username: this.generateArtisanName(i + 1),
        points: Math.floor(Math.random() * 100000) + 1000,
        level: Math.floor(Math.random() * 100) + 1,
        region: this.getRandomRegion(),
        specialty: this.getRandomSpecialty(),
        productsCount: Math.floor(Math.random() * 50) + 1,
        rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
        badges: this.generateRandomBadges().slice(0, 3),
        isOnline: Math.random() > 0.7,
        lastActivity: new Date(Date.now() - Math.random() * 86400000).toISOString()
      })).sort((a, b) => b.points - a.points);

      res.status(200).json({
        success: true,
        data: {
          leaderboard,
          category: category || 'all',
          region: region || 'all',
          timeFrame: timeFrame || 'all-time',
          userRank: Math.floor(Math.random() * 100) + 1
        },
        message: '¡Ranking de Artesanos cargado!',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error al cargar el ranking'
      });
    }
  }

  /**
   * Obtiene las misiones disponibles
   * @param req - Request de Express
   * @param res - Response de Express
   */
  async getQuests(req: Request, res: Response): Promise<void> {
    try {
      const { userId, difficulty } = req.query;
      
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
        },
        {
          id: 'quest_003',
          title: 'Crítico Gastronómico',
          description: 'Escribe 10 reseñas de productos artesanales',
          type: 'review',
          difficulty: 'hard',
          reward: { points: 500, badge: 'food_critic' },
          progress: { current: Math.floor(Math.random() * 10), total: 10 },
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'quest_004',
          title: 'Viajero de Jaén',
          description: 'Visita productos de 8 municipios diferentes',
          type: 'exploration',
          difficulty: 'expert',
          reward: { points: 1000, badge: 'jaen_traveler' },
          progress: { current: Math.floor(Math.random() * 8), total: 8 },
          expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      res.status(200).json({
        success: true,
        data: {
          quests,
          dailyQuests: quests.slice(0, 2),
          weeklyQuests: quests.slice(2, 4),
          activeQuests: quests.filter(q => q.progress.current > 0),
          completedQuests: []
        },
        message: '¡Misiones disponibles cargadas!',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error getting quests:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error al cargar las misiones'
      });
    }
  }

  // Métodos auxiliares privados
  private generateRandomBadges() {
    const badges = [
      'first_purchase', 'explorer', 'reviewer', 'loyal_customer',
      'seasonal_shopper', 'local_supporter', 'quality_seeker',
      'adventure_seeker', 'taste_master', 'artisan_friend'
    ];
    return badges.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 5) + 1);
  }

  private generateRandomAchievements() {
    const achievements = [
      { id: 'first_steps', title: 'Primeros Pasos', description: 'Realiza tu primera compra', unlocked: true },
      { id: 'explorer', title: 'Explorador', description: 'Descubre 10 productos diferentes', unlocked: Math.random() > 0.5 },
      { id: 'loyal_customer', title: 'Cliente Leal', description: 'Compra 50 productos', unlocked: Math.random() > 0.7 },
      { id: 'reviewer', title: 'Crítico', description: 'Escribe 20 reseñas', unlocked: Math.random() > 0.8 }
    ];
    return achievements;
  }

  private generateCurrentQuest() {
    const quests = [
      'Descubre 3 aceites de oliva diferentes',
      'Compra productos de 2 queserías',
      'Escribe una reseña de un producto',
      'Explora productos de Úbeda'
    ];
    return quests[Math.floor(Math.random() * quests.length)];
  }

  private generateInventory() {
    return {
      coins: Math.floor(Math.random() * 1000),
      gems: Math.floor(Math.random() * 100),
      specialItems: ['olive_branch', 'cheese_wheel', 'honey_jar'].slice(0, Math.floor(Math.random() * 3) + 1)
    };
  }

  private calculateRank(points: number): string {
    if (points > 50000) return 'Maestro Artesano';
    if (points > 25000) return 'Experto Artesano';
    if (points > 10000) return 'Aprendiz Avanzado';
    if (points > 5000) return 'Aprendiz';
    return 'Novato';
  }

  private getActionPoints(action: string): number {
    const pointsMap: { [key: string]: number } = {
      'view_product': 1,
      'purchase_product': 10,
      'write_review': 5,
      'discover_artisan': 3,
      'explore_region': 2,
      'share_product': 2,
      'favorite_product': 1
    };
    return pointsMap[action] || 1;
  }

  private calculateBonusPoints(action: string, productId?: string, artisanId?: string): number {
    let bonus = 0;
    if (action === 'purchase_product') bonus += Math.floor(Math.random() * 5) + 1;
    if (action === 'write_review') bonus += Math.floor(Math.random() * 3) + 1;
    return bonus;
  }

  private getMultiplier(userId: string): number {
    return 1 + (Math.random() * 0.5); // 1.0 - 1.5x
  }

  private getActionMessage(action: string, points: number): string {
    const messages = {
      'view_product': `¡Exploraste un producto! +${points} puntos`,
      'purchase_product': `¡Compra realizada! +${points} puntos`,
      'write_review': `¡Reseña escrita! +${points} puntos`,
      'discover_artisan': `¡Nuevo artesano descubierto! +${points} puntos`
    };
    return messages[action as keyof typeof messages] || `¡Acción realizada! +${points} puntos`;
  }

  private generateArtisanName(rank: number): string {
    const names = [
      'María del Olivo', 'Antonio Quesero', 'Carmen Mielera',
      'José Aceitero', 'Ana Artesana', 'Miguel Tradicional',
      'Isabel Gourmet', 'Francisco Maestro', 'Lucía Creativa',
      'Carlos Experto'
    ];
    return names[rank % names.length];
  }

  private getRandomRegion(): string {
    const regions = ['Úbeda', 'Cazorla', 'Baeza', 'Jaén', 'Linares', 'Andújar'];
    return regions[Math.floor(Math.random() * regions.length)];
  }

  private getRandomSpecialty(): string {
    const specialties = ['Aceite de Oliva', 'Queso Artesanal', 'Miel Natural', 'Embutidos', 'Vinos'];
    return specialties[Math.floor(Math.random() * specialties.length)];
  }
} 