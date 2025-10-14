"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
class AnalyticsService {
    generateReport(reportType) {
        return `Reporte de tipo ${reportType} generado.`;
    }
    getStatistics(metric) {
        return `Estadísticas para la métrica ${metric} obtenidas.`;
    }
}
exports.AnalyticsService = AnalyticsService;
//# sourceMappingURL=service.js.map