"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const service_1 = require("./service");
class AnalyticsController {
    analyticsService = new service_1.AnalyticsService();
    generateReport(reportType) {
        return this.analyticsService.generateReport(reportType);
    }
    getStatistics(metric) {
        return this.analyticsService.getStatistics(metric);
    }
}
exports.AnalyticsController = AnalyticsController;
//# sourceMappingURL=controller.js.map