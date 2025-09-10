import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  IsUUID,
  IsEnum,
  IsEmail,
} from 'class-validator';

// ========================================
// PAYMENT SERVICE DTOs
// ========================================

export enum PaymentMethodType {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  DIGITAL_WALLET = 'digital_wallet',
  CASH_ON_DELIVERY = 'cash_on_delivery',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export class ValidatePaymentMethodRequestDto {
  @IsEnum(PaymentMethodType)
  paymentMethodType: PaymentMethodType;

  @IsString()
  paymentMethodId: string;

  @IsUUID()
  customerId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  orderId?: string;
}

export class ValidatePaymentMethodResponseDto {
  @IsBoolean()
  valid: boolean;

  @IsEnum(PaymentMethodType)
  paymentMethodType: PaymentMethodType;

  @IsString()
  paymentMethodId: string;

  @IsUUID()
  customerId: string;

  @IsNumber()
  @Min(0)
  availableBalance: number;

  @IsNumber()
  @Min(0)
  dailyLimit: number;

  @IsNumber()
  @Min(0)
  monthlyLimit: number;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  errorCode?: string;
}

export class ProcessPaymentRequestDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  customerId: string;

  @IsEnum(PaymentMethodType)
  paymentMethodType: PaymentMethodType;

  @IsString()
  paymentMethodId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  billingAddress?: string;
}

export class ProcessPaymentResponseDto {
  @IsBoolean()
  success: boolean;

  @IsUUID()
  paymentId: string;

  @IsUUID()
  orderId: string;

  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  transactionId: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  errorCode?: string;

  @IsOptional()
  @IsString()
  redirectUrl?: string;
}

export class PaymentMethodDto {
  @IsUUID()
  id: string;

  @IsUUID()
  customerId: string;

  @IsEnum(PaymentMethodType)
  type: PaymentMethodType;

  @IsString()
  name: string;

  @IsString()
  maskedNumber: string;

  @IsString()
  expiryDate: string;

  @IsBoolean()
  isDefault: boolean;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  lastFourDigits?: string;
}

export class GetCustomerPaymentMethodsRequestDto {
  @IsUUID()
  customerId: string;

  @IsOptional()
  @IsBoolean()
  activeOnly?: boolean;
}

export class GetCustomerPaymentMethodsResponseDto {
  @IsUUID()
  customerId: string;

  @IsNumber()
  @Min(0)
  totalMethods: number;

  paymentMethods: PaymentMethodDto[];

  @IsOptional()
  @IsString()
  message?: string;
}

export class RefundPaymentRequestDto {
  @IsUUID()
  paymentId: string;

  @IsUUID()
  orderId: string;

  @IsNumber()
  @Min(0.01)
  refundAmount: number;

  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  customerId?: string;
}

export class RefundPaymentResponseDto {
  @IsBoolean()
  success: boolean;

  @IsUUID()
  refundId: string;

  @IsUUID()
  paymentId: string;

  @IsUUID()
  orderId: string;

  @IsNumber()
  @Min(0)
  refundAmount: number;

  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  errorCode?: string;
}
