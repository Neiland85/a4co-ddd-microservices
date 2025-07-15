import { LoyaltyService } from './service';

export class LoyaltyController {
  private loyaltyService = new LoyaltyService();

  addPoints(userId: string, points: number): string {
    return this.loyaltyService.addPoints(userId, points);
  }

  redeemPoints(userId: string, points: number): string {
    return this.loyaltyService.redeemPoints(userId, points);
  }
}
