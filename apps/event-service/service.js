"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
class EventService {
    createEvent(name, date) {
        return `Evento '${name}' creado para la fecha ${date.toISOString()}.`;
    }
    cancelEvent(eventId) {
        return `Evento con ID ${eventId} cancelado.`;
    }
}
exports.EventService = EventService;
//# sourceMappingURL=service.js.map