"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cn = void 0;
// Utility functions for design system
const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
};
exports.cn = cn;
//# sourceMappingURL=index.js.map