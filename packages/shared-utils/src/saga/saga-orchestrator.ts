switch (step) {
  case 'PROCESS_PAYMENT':
    await this.processPayment(sagaId, data);
    break;

  case 'CONFIRM_ORDER':
    await this.confirmOrder(sagaId, data);
    break;

  default:
    throw new Error(`Paso de saga desconocido: ${step}`);
}
