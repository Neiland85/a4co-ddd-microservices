"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
exports.generateRandomId = generateRandomId;
__exportStar(require("./src/domain/base-entity"), exports);
__exportStar(require("./src/domain/value-object"), exports);
__exportStar(require("./src/domain/domain-event"), exports);
__exportStar(require("./src/domain/aggregate-root"), exports);
__exportStar(require("./src/dto/base-dto"), exports);
__exportStar(require("./src/dto/pagination-dto"), exports);
__exportStar(require("./src/utils/uuid.util"), exports);
__exportStar(require("./src/utils/date.util"), exports);
__exportStar(require("./src/constants/error-codes"), exports);
__exportStar(require("./src/types/common.types"), exports);
function formatDate(date) {
    return date.toISOString();
}
function generateRandomId() {
    return Math.random().toString(36).substring(2, 15);
}
//# sourceMappingURL=index.js.map