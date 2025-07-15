export class ChatService {
  sendMessage(userId: string, message: string): string {
    return `Mensaje enviado por el usuario ${userId}: ${message}`;
  }

  receiveMessages(userId: string): string[] {
    return [`Mensaje recibido para el usuario ${userId}`];
  }
}
