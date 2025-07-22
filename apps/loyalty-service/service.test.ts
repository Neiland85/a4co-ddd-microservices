import { LoyaltyService } from './service';

describe('LoyaltyService', () => {
  const loyaltyService = new LoyaltyService();

  it('should add points', () => {
    const result = loyaltyService.addPoints('user1', 100);
    expect(result).toBe('Se han añadido 100 puntos al usuario user1.');
  });

  it('should redeem points', () => {
    const result = loyaltyService.redeemPoints('user1', 50);
    expect(result).toBe('Se han redimido 50 puntos del usuario user1.');
  });
});
