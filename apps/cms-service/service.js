"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsService = void 0;
class CmsService {
    createPage(title, content) {
        return `Página '${title}' creada con contenido.`;
    }
    updatePage(pageId, content) {
        return `Página con ID ${pageId} actualizada.`;
    }
}
exports.CmsService = CmsService;
//# sourceMappingURL=service.js.map