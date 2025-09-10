"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AnalyticsPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const dynamic_1 = __importDefault(require("next/dynamic"));
const admin_layout_1 = __importDefault(require("../../../components/admin/admin-layout"));
const lucide_react_1 = require("lucide-react");
// Lazy load the Analytics component
const Analytics = (0, dynamic_1.default)(() => import('../../../components/admin/analytics'), {
    loading: () => ((0, jsx_runtime_1.jsx)("div", { className: "flex h-64 items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-a4co-olive-600 flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "h-6 w-6 animate-spin" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Cargando analytics..." })] }) })),
});
function AnalyticsPage() {
    return ((0, jsx_runtime_1.jsx)(admin_layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)("div", { className: "flex h-64 items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-a4co-olive-600 flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "h-6 w-6 animate-spin" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Cargando analytics..." })] }) }), children: (0, jsx_runtime_1.jsx)(Analytics, {}) }) }));
}
//# sourceMappingURL=page.js.map