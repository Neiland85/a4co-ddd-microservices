"use strict";
// Utilidades para manejo de fechas
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatRelativeTime = exports.getDaysDifference = exports.isExpired = exports.addHours = exports.addDays = exports.isValidDate = exports.parseDate = exports.formatDate = void 0;
const formatDate = (date) => {
    return date.toISOString();
};
exports.formatDate = formatDate;
const parseDate = (dateString) => {
    return new Date(dateString);
};
exports.parseDate = parseDate;
const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date.getTime());
};
exports.isValidDate = isValidDate;
const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};
exports.addDays = addDays;
const addHours = (date, hours) => {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
};
exports.addHours = addHours;
const isExpired = (date) => {
    return date < new Date();
};
exports.isExpired = isExpired;
const getDaysDifference = (date1, date2) => {
    const timeDiff = date2.getTime() - date1.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
};
exports.getDaysDifference = getDaysDifference;
const formatRelativeTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60)
        return 'hace un momento';
    if (diffInSeconds < 3600)
        return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400)
        return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
    if (diffInSeconds < 2592000)
        return `hace ${Math.floor(diffInSeconds / 86400)} días`;
    return date.toLocaleDateString();
};
exports.formatRelativeTime = formatRelativeTime;
//# sourceMappingURL=date-utils.js.map