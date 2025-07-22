import { ChatService } from './service';

describe('ChatService', () => {
  const chatService = new ChatService();

  it('should send a message', () => {
    const result = chatService.sendMessage('user1', 'Hola');
    expect(result).toBe('Mensaje enviado por el usuario user1: Hola');
  });

  it('should receive messages', () => {
    const result = chatService.receiveMessages('user1');
    expect(result).toEqual(['Mensaje recibido para el usuario user1']);
  });
});
