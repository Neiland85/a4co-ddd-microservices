"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const service_1 = require("./service");
class ChatController {
    chatService = new service_1.ChatService();
    sendMessage(userId, message) {
        return this.chatService.sendMessage(userId, message);
    }
    receiveMessages(userId) {
        return this.chatService.receiveMessages(userId);
    }
}
exports.ChatController = ChatController;
//# sourceMappingURL=controller.js.map