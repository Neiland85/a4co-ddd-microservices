"use strict";
// Utilidades para manejo de strings
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAccents = exports.isUrl = exports.isEmail = exports.generateId = exports.slugify = exports.truncate = exports.snakeCase = exports.kebabCase = exports.camelCase = exports.capitalize = void 0;
exports.kebabToCamelCase = kebabToCamelCase;
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
exports.capitalize = capitalize;
const camelCase = (str) => {
    return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
};
exports.camelCase = camelCase;
const kebabCase = (str) => {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};
exports.kebabCase = kebabCase;
const snakeCase = (str) => {
    return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
};
exports.snakeCase = snakeCase;
const truncate = (str, length, suffix = '...') => {
    if (str.length <= length)
        return str;
    return str.substring(0, length) + suffix;
};
exports.truncate = truncate;
const slugify = (str) => {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};
exports.slugify = slugify;
const generateId = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
exports.generateId = generateId;
const isEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isEmail = isEmail;
const isUrl = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
};
exports.isUrl = isUrl;
const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};
exports.removeAccents = removeAccents;
function kebabToCamelCase(str) {
    if (!str)
        return str;
    return str.replace(/-([a-z])/g, g => g[1]?.toUpperCase() || g[1]);
}
//# sourceMappingURL=string-utils.js.map