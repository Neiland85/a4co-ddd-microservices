'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const dashboard_1 = require("@/components/admin/dashboard");
// Mock data
const mockStats = {
    totalUsers: 1247,
    totalProducts: 89,
    totalOrders: 156,
    totalRevenue: 12450,
    monthlyGrowth: {
        users: 12.5,
        products: 8.3,
        orders: 15.7,
        revenue: 23.1,
    },
};
function AdminPage() {
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gray-50 pt-20", children: (0, jsx_runtime_1.jsx)("div", { className: "container mx-auto px-4 py-8 sm:px-6 lg:px-8", children: (0, jsx_runtime_1.jsx)(dashboard_1.AdminDashboard, { stats: mockStats }) }) }));
}
//# sourceMappingURL=page.js.map