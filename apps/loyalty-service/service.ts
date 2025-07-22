export class LoyaltyService {
  addPoints(userId: string, points: number): string {
    return `Se han añadido ${points} puntos al usuario ${userId}.`;
  }

  redeemPoints(userId: string, points: number): string {
    return `Se han redimido ${points} puntos del usuario ${userId}.`;
  }
}
