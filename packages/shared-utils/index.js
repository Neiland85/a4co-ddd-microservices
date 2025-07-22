"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
exports.generateRandomId = generateRandomId;
function formatDate(date) {
    return date.toISOString();
}
function generateRandomId() {
    return Math.random().toString(36).substring(2, 15);
}
//# sourceMappingURL=index.js.map