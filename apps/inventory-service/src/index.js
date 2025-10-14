"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryService = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const inventory_service_1 = require("./application/services/inventory.service");
const product_repository_1 = require("./infrastructure/repositories/product.repository");
const inventory_routes_1 = require("./infrastructure/routes/inventory.routes");
const app = (0, express_1.default)();
exports.app = app;
const PORT = process.env['PORT'] || 3001;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json());
// Initialize dependencies
const productRepository = new product_repository_1.InMemoryProductRepository();
const inventoryService = new inventory_service_1.InventoryService(productRepository);
exports.inventoryService = inventoryService;
// Routes
app.use('/api/inventory', (0, inventory_routes_1.inventoryRoutes)(inventoryService));
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'inventory-service',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
    });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`,
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Inventory Service running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔍 API docs: http://localhost:${PORT}/api/inventory`);
});
//# sourceMappingURL=index.js.map