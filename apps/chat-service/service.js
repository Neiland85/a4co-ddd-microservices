"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
class ChatService {
    sendMessage(userId, message) {
        return `Mensaje enviado por el usuario ${userId}: ${message}`;
    }
    receiveMessages(userId) {
        return [`Mensaje recibido para el usuario ${userId}`];
    }
}
exports.ChatService = ChatService;
//# sourceMappingURL=service.js.map