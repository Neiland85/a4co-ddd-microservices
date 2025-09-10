"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Page;
const jsx_runtime_1 = require("react/jsx-runtime");
const food_artisan_registration_form_1 = __importDefault(require("../food-artisan-registration-form"));
function Page() {
    return ((0, jsx_runtime_1.jsx)("main", { className: "min-h-screen bg-gradient-to-br from-green-50 to-emerald-50", children: (0, jsx_runtime_1.jsx)(food_artisan_registration_form_1.default, {}) }));
}
//# sourceMappingURL=page.js.map