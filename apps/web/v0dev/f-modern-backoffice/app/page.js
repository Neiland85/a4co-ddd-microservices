'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BackofficePage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const sidebar_1 = require("@/components/layout/sidebar");
const dashboard_header_1 = require("@/components/dashboard/dashboard-header");
const metrics_overview_1 = require("@/components/dashboard/metrics-overview");
const performance_monitoring_1 = require("@/components/dashboard/performance-monitoring");
const security_monitoring_1 = require("@/components/dashboard/security-monitoring");
const user_management_1 = require("@/components/dashboard/user-management");
const content_moderation_1 = require("@/components/dashboard/content-moderation");
const event_history_1 = require("@/components/dashboard/event-history");
const notification_system_1 = require("@/components/notifications/notification-system");
const auth_guard_1 = require("@/components/security/auth-guard");
const performance_dashboard_1 = require("@/components/performance/performance-dashboard");
const user_management_dashboard_1 = require("@/components/users/user-management-dashboard");
const cybersecurity_dashboard_1 = require("@/components/security/cybersecurity-dashboard");
const offers_management_dashboard_1 = require("@/components/offers/offers-management-dashboard");
const settings_dashboard_1 = require("@/components/settings/settings-dashboard");
const loading_spinner_1 = require("@/components/ui/loading-spinner");
function BackofficePage() {
    const [activeSection, setActiveSection] = (0, react_1.useState)('dashboard');
    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(metrics_overview_1.MetricsOverview, {}), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-2", children: [(0, jsx_runtime_1.jsx)(performance_monitoring_1.PerformanceMonitoring, {}), (0, jsx_runtime_1.jsx)(security_monitoring_1.SecurityMonitoring, {})] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-2", children: [(0, jsx_runtime_1.jsx)(user_management_1.UserManagement, {}), (0, jsx_runtime_1.jsx)(content_moderation_1.ContentModeration, {})] }), (0, jsx_runtime_1.jsx)(event_history_1.EventHistory, {})] }));
            // Performance sections
            case 'performance-metrics':
            case 'performance-analytics':
            case 'performance-database':
            case 'performance':
                return (0, jsx_runtime_1.jsx)(performance_dashboard_1.PerformanceDashboard, {});
            // User management sections
            case 'users-businesses':
            case 'users-customers':
            case 'users-analytics':
            case 'users':
                return (0, jsx_runtime_1.jsx)(user_management_dashboard_1.UserManagementDashboard, {});
            // Security sections
            case 'security-monitoring':
            case 'security-threats':
            case 'security-firewall':
            case 'security':
                return (0, jsx_runtime_1.jsx)(cybersecurity_dashboard_1.CybersecurityDashboard, {});
            // Offers sections
            case 'offers-featured':
            case 'offers-promotions':
            case 'offers-analytics':
            case 'offers':
                return (0, jsx_runtime_1.jsx)(offers_management_dashboard_1.OffersManagementDashboard, {});
            case 'settings':
                return (0, jsx_runtime_1.jsx)(settings_dashboard_1.SettingsDashboard, {});
            case 'notifications':
                return ((0, jsx_runtime_1.jsx)("div", { className: "flex h-96 items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("h2", { className: "mb-4 text-2xl font-bold", children: "Centro de Notificaciones" }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground", children: "Gesti\u00F3n de notificaciones en desarrollo" })] }) }));
            default:
                return (0, jsx_runtime_1.jsx)(loading_spinner_1.LoadingSpinner, {});
        }
    };
    return ((0, jsx_runtime_1.jsx)(auth_guard_1.AuthGuard, { requiredPermissions: ['system:read'], children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-background flex min-h-screen", children: [(0, jsx_runtime_1.jsx)(sidebar_1.Sidebar, { activeSection: activeSection, onSectionChange: setActiveSection }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-1 flex-col", children: [(0, jsx_runtime_1.jsx)(dashboard_header_1.DashboardHeader, {}), (0, jsx_runtime_1.jsx)(notification_system_1.NotificationSystem, {}), (0, jsx_runtime_1.jsx)("main", { className: "flex-1 overflow-auto p-6", children: renderContent() })] })] }) }));
}
//# sourceMappingURL=page.js.map