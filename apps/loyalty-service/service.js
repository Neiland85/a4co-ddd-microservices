"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoyaltyService = void 0;
class LoyaltyService {
    addPoints(userId, points) {
        return `Se han añadido ${points} puntos al usuario ${userId}.`;
    }
    redeemPoints(userId, points) {
        return `Se han redimido ${points} puntos del usuario ${userId}.`;
    }
}
exports.LoyaltyService = LoyaltyService;
//# sourceMappingURL=service.js.map