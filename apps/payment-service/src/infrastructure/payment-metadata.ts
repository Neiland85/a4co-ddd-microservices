/**
 * Payment metadata interface for type-safe payment processing
 * 
 * This interface replaces the generic Record<string, any> to provide
 * better type safety and documentation for payment-related metadata.
 */
export interface PaymentMetadata {
  /** Order identifier associated with the payment */
  orderId?: string;
  
  /** Customer identifier making the payment */
  customerId?: string;
  
  /** Payment method identifier (e.g., card, bank transfer) */
  paymentMethodId?: string;
  
  /** Description of the payment purpose */
  description?: string;
  
  /** Additional custom fields */
  [key: string]: string | number | boolean | undefined;
}
