"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoyaltyController = void 0;
const service_1 = require("./service");
class LoyaltyController {
    loyaltyService = new service_1.LoyaltyService();
    addPoints(userId, points) {
        return this.loyaltyService.addPoints(userId, points);
    }
    redeemPoints(userId, points) {
        return this.loyaltyService.redeemPoints(userId, points);
    }
}
exports.LoyaltyController = LoyaltyController;
//# sourceMappingURL=controller.js.map