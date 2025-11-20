"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtil = void 0;
class DateUtil {
    static now() {
        return new Date();
    }
    static toISOString(date) {
        return date.toISOString();
    }
    static fromISOString(dateString) {
        return new Date(dateString);
    }
    static addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    static addHours(date, hours) {
        const result = new Date(date);
        result.setHours(result.getHours() + hours);
        return result;
    }
    static isExpired(date) {
        return date < new Date();
    }
    static formatToDDMMYYYY(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
}
exports.DateUtil = DateUtil;
//# sourceMappingURL=date.util.js.map