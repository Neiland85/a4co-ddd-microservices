"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryProductRepository = void 0;
const product_entity_1 = require("../../domain/entities/product.entity");
class InMemoryProductRepository {
    products = new Map();
    constructor() {
        // Initialize with some sample data
        this.initializeSampleData();
    }
    initializeSampleData() {
        const sampleProducts = [
            {
                name: 'Handmade Ceramic Mug',
                description: 'Beautiful handcrafted ceramic mug with unique design',
                sku: 'CERAMIC-MUG-001',
                category: 'Kitchenware',
                brand: 'ArtisanCraft',
                unitPrice: 25.99,
                currency: 'USD',
                currentStock: 50,
                reservedStock: 5,
                minimumStock: 10,
                maximumStock: 100,
                isActive: true,
                artisanId: 'artisan_001',
            },
            {
                name: 'Wooden Cutting Board',
                description: 'Premium hardwood cutting board with food-safe finish',
                sku: 'WOOD-CUTTING-001',
                category: 'Kitchenware',
                brand: 'WoodWorks',
                unitPrice: 45.99,
                currency: 'USD',
                currentStock: 30,
                reservedStock: 2,
                minimumStock: 8,
                maximumStock: 80,
                isActive: true,
                artisanId: 'artisan_002',
            },
            {
                name: 'Handwoven Cotton Scarf',
                description: 'Soft cotton scarf with traditional patterns',
                sku: 'COTTON-SCARF-001',
                category: 'Accessories',
                brand: 'TextileArt',
                unitPrice: 35.99,
                currency: 'USD',
                currentStock: 15,
                reservedStock: 0,
                minimumStock: 5,
                maximumStock: 60,
                isActive: true,
                artisanId: 'artisan_003',
            },
        ];
        sampleProducts.forEach((props, index) => {
            const product = product_entity_1.Product.create(props);
            this.products.set(product.id, product);
        });
    }
    async findById(id) {
        return this.products.get(id) || null;
    }
    async findByIds(ids) {
        return ids
            .map(id => this.products.get(id))
            .filter((product) => product !== undefined);
    }
    async save(product) {
        this.products.set(product.id, product);
    }
    async delete(id) {
        this.products.delete(id);
    }
    async findAll() {
        return Array.from(this.products.values());
    }
    async findByCategory(category) {
        return Array.from(this.products.values()).filter(product => product.category === category);
    }
    async findByArtisan(artisanId) {
        return Array.from(this.products.values()).filter(product => product.artisanId === artisanId);
    }
    async findLowStock() {
        return Array.from(this.products.values()).filter(product => product.needsRestock);
    }
    async findOutOfStock() {
        return Array.from(this.products.values()).filter(product => product.stockStatus === 'out_of_stock');
    }
}
exports.InMemoryProductRepository = InMemoryProductRepository;
//# sourceMappingURL=product.repository.js.map