'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminSettingsPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const settings_1 = require("@/components/admin/settings");
// Mock data
const mockSettings = {
    siteName: 'Jaén Artesanal',
    siteDescription: 'Plataforma de productos artesanales de la provincia de Jaén',
    contactEmail: 'contacto@jaenartesanal.com',
    supportEmail: 'soporte@jaenartesanal.com',
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    smsNotifications: false,
};
function AdminSettingsPage() {
    const handleSave = (settings) => {
        console.log('Saving settings:', settings);
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gray-50 pt-20", children: (0, jsx_runtime_1.jsx)("div", { className: "container mx-auto px-4 py-8 sm:px-6 lg:px-8", children: (0, jsx_runtime_1.jsx)(settings_1.AdminSettingsComponent, { settings: mockSettings, onSave: handleSave }) }) }));
}
//# sourceMappingURL=page.js.map