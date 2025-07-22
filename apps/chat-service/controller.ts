import { ChatService } from './service';

export class ChatController {
  private chatService = new ChatService();

  sendMessage(userId: string, message: string): string {
    return this.chatService.sendMessage(userId, message);
  }

  receiveMessages(userId: string): string[] {
    return this.chatService.receiveMessages(userId);
  }
}
