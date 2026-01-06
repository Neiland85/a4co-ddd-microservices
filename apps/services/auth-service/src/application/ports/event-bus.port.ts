/**
 * Port para servicio de eventos de dominio
 * Maneja la publicación y suscripción a eventos
 */
export interface EventBusPort {
  /**
   * Publica un evento de dominio
   * @param event Evento a publicar
   */
  publish(event: any): Promise<void>;

  /**
   * Publica múltiples eventos
   * @param events Lista de eventos a publicar
   */
  publishAll(events: any[]): Promise<void>;
}
