"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsController = void 0;
const service_1 = require("./service");
class CmsController {
    cmsService = new service_1.CmsService();
    createPage(title, content) {
        return this.cmsService.createPage(title, content);
    }
    updatePage(pageId, content) {
        return this.cmsService.updatePage(pageId, content);
    }
}
exports.CmsController = CmsController;
//# sourceMappingURL=controller.js.map