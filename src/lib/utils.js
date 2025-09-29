'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.generateId = exports.truncateText = exports.formatDate = exports.formatCurrency = void 0;
exports.cn = cn;
function handleObjectInput(input, classes) {
    for (const [key, value] of Object.entries(input)) {
        if (value)
            classes.push(key);
    }
}
function handleArrayInput(input, classes) {
    const result = cn(...input);
    if (result)
        classes.push(result);
}
function cn(...inputs) {
    const classes = [];
    for (const input of inputs) {
        if (!input)
            continue;
        if (typeof input === 'string') {
            classes.push(input);
        }
        else if (typeof input === 'object' && !Array.isArray(input)) {
            handleObjectInput(input, classes);
        }
        else if (Array.isArray(input)) {
            handleArrayInput(input, classes);
        }
    }
    // Eliminar duplicados y unir
    return [...new Set(classes)].join(' ');
}
// Utilidades adicionales para el proyecto
const formatCurrency = (amount, currency = 'EUR') => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency,
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
const formatDate = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(dateObj);
};
exports.formatDate = formatDate;
const truncateText = (text, maxLength) => {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength) + '...';
};
exports.truncateText = truncateText;
const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
exports.generateId = generateId;
//# sourceMappingURL=utils.js.map
