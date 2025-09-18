"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const service_1 = require("./service");
class EventController {
    eventService = new service_1.EventService();
    createEvent(name, date) {
        return this.eventService.createEvent(name, date);
    }
    cancelEvent(eventId) {
        return this.eventService.cancelEvent(eventId);
    }
}
exports.EventController = EventController;
//# sourceMappingURL=controller.js.map