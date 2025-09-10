'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminAnalyticsPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const product_sales_chart_1 = require("@/components/admin/charts/product-sales-chart");
const category_chart_1 = require("@/components/admin/charts/category-chart");
const customer_chart_1 = require("@/components/admin/charts/customer-chart");
// Mock data
const mockProductAnalytics = [
    {
        productId: '1',
        productName: 'Aceite de Oliva Virgen Extra',
        totalSales: 156,
        totalRevenue: 3899.44,
        viewsCount: 2340,
        conversionRate: 6.7,
        category: 'Alimentación',
    },
    {
        productId: '2',
        productName: 'Cerámica Artesanal',
        totalSales: 89,
        totalRevenue: 3159.5,
        viewsCount: 1876,
        conversionRate: 4.7,
        category: 'Artesanía',
    },
    {
        productId: '3',
        productName: 'Miel de Azahar',
        totalSales: 134,
        totalRevenue: 2512.5,
        viewsCount: 1654,
        conversionRate: 8.1,
        category: 'Alimentación',
    },
];
const mockCategoryAnalytics = [
    {
        category: 'Alimentación',
        totalProducts: 45,
        totalSales: 290,
        totalRevenue: 6411.94,
        averagePrice: 22.11,
        topProduct: 'Aceite de Oliva Virgen Extra',
    },
    {
        category: 'Artesanía',
        totalProducts: 32,
        totalSales: 156,
        totalRevenue: 5234.8,
        averagePrice: 33.56,
        topProduct: 'Cerámica Artesanal',
    },
    {
        category: 'Textiles',
        totalProducts: 28,
        totalSales: 98,
        totalRevenue: 2876.4,
        averagePrice: 29.35,
        topProduct: 'Mantas de Lana',
    },
];
const mockCustomerAnalytics = {
    totalCustomers: 1247,
    newCustomers: 156,
    returningCustomers: 1091,
    averageOrderValue: 45.67,
    customerLifetimeValue: 234.5,
    topCustomers: [
        {
            id: '1',
            name: 'María García',
            email: 'maria@example.com',
            totalOrders: 12,
            totalSpent: 567.89,
            lastOrderDate: new Date('2024-01-18'),
        },
        {
            id: '2',
            name: 'Carlos López',
            email: 'carlos@example.com',
            totalOrders: 8,
            totalSpent: 423.45,
            lastOrderDate: new Date('2024-01-15'),
        },
        {
            id: '3',
            name: 'Ana Martín',
            email: 'ana@example.com',
            totalOrders: 15,
            totalSpent: 789.12,
            lastOrderDate: new Date('2024-01-20'),
        },
    ],
};
function AdminAnalyticsPage() {
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gray-50 pt-20", children: (0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto px-4 py-8 sm:px-6 lg:px-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-gray-900", children: "An\u00E1lisis y Estad\u00EDsticas" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-gray-600", children: "Informaci\u00F3n detallada sobre el rendimiento de tu plataforma" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-8", children: [(0, jsx_runtime_1.jsx)(customer_chart_1.CustomerChart, { data: mockCustomerAnalytics }), (0, jsx_runtime_1.jsxs)("div", { className: "grid gap-8 lg:grid-cols-2", children: [(0, jsx_runtime_1.jsx)(product_sales_chart_1.ProductSalesChart, { data: mockProductAnalytics }), (0, jsx_runtime_1.jsx)(category_chart_1.CategoryChart, { data: mockCategoryAnalytics })] })] })] }) }));
}
//# sourceMappingURL=page.js.map