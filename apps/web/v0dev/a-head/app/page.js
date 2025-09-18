"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HomePage;
const jsx_runtime_1 = require("react/jsx-runtime");
const header_1 = __importDefault(require("@/components/header"));
const hero_1 = __importDefault(require("@/components/hero"));
const advantages_section_1 = __importDefault(require("@/components/advantages-section"));
const footer_1 = __importDefault(require("@/components/footer"));
const banner_cookie_1 = __importDefault(require("@/banner-cookie"));
const featured_businesses_and_festival_1 = require("@/components/featured-businesses-and-festival");
function HomePage() {
    return ((0, jsx_runtime_1.jsxs)("main", { className: "min-h-screen", children: [(0, jsx_runtime_1.jsx)(header_1.default, {}), (0, jsx_runtime_1.jsx)(hero_1.default, {}), (0, jsx_runtime_1.jsx)(featured_businesses_and_festival_1.FeaturedBusinessesAndFestival, {}), (0, jsx_runtime_1.jsx)(advantages_section_1.default, {}), (0, jsx_runtime_1.jsx)(footer_1.default, {}), (0, jsx_runtime_1.jsx)(banner_cookie_1.default, {})] }));
}
//# sourceMappingURL=page.js.map