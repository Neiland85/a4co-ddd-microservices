"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundPaymentResponseDto = exports.RefundPaymentRequestDto = exports.GetCustomerPaymentMethodsResponseDto = exports.GetCustomerPaymentMethodsRequestDto = exports.PaymentMethodDto = exports.ProcessPaymentResponseDto = exports.ProcessPaymentRequestDto = exports.ValidatePaymentMethodResponseDto = exports.ValidatePaymentMethodRequestDto = exports.PaymentStatus = exports.PaymentMethodType = void 0;
const class_validator_1 = require("class-validator");
var PaymentMethodType;
(function (PaymentMethodType) {
    PaymentMethodType["CREDIT_CARD"] = "credit_card";
    PaymentMethodType["DEBIT_CARD"] = "debit_card";
    PaymentMethodType["BANK_TRANSFER"] = "bank_transfer";
    PaymentMethodType["DIGITAL_WALLET"] = "digital_wallet";
    PaymentMethodType["CASH_ON_DELIVERY"] = "cash_on_delivery";
})(PaymentMethodType || (exports.PaymentMethodType = PaymentMethodType = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PROCESSING"] = "processing";
    PaymentStatus["COMPLETED"] = "completed";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["CANCELLED"] = "cancelled";
    PaymentStatus["REFUNDED"] = "refunded";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
class ValidatePaymentMethodRequestDto {
}
exports.ValidatePaymentMethodRequestDto = ValidatePaymentMethodRequestDto;
__decorate([
    (0, class_validator_1.IsEnum)(PaymentMethodType),
    __metadata("design:type", String)
], ValidatePaymentMethodRequestDto.prototype, "paymentMethodType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidatePaymentMethodRequestDto.prototype, "paymentMethodId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ValidatePaymentMethodRequestDto.prototype, "customerId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], ValidatePaymentMethodRequestDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidatePaymentMethodRequestDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidatePaymentMethodRequestDto.prototype, "orderId", void 0);
class ValidatePaymentMethodResponseDto {
}
exports.ValidatePaymentMethodResponseDto = ValidatePaymentMethodResponseDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ValidatePaymentMethodResponseDto.prototype, "valid", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(PaymentMethodType),
    __metadata("design:type", String)
], ValidatePaymentMethodResponseDto.prototype, "paymentMethodType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidatePaymentMethodResponseDto.prototype, "paymentMethodId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ValidatePaymentMethodResponseDto.prototype, "customerId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ValidatePaymentMethodResponseDto.prototype, "availableBalance", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ValidatePaymentMethodResponseDto.prototype, "dailyLimit", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ValidatePaymentMethodResponseDto.prototype, "monthlyLimit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidatePaymentMethodResponseDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidatePaymentMethodResponseDto.prototype, "errorCode", void 0);
class ProcessPaymentRequestDto {
}
exports.ProcessPaymentRequestDto = ProcessPaymentRequestDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ProcessPaymentRequestDto.prototype, "orderId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ProcessPaymentRequestDto.prototype, "customerId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(PaymentMethodType),
    __metadata("design:type", String)
], ProcessPaymentRequestDto.prototype, "paymentMethodType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProcessPaymentRequestDto.prototype, "paymentMethodId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], ProcessPaymentRequestDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProcessPaymentRequestDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProcessPaymentRequestDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProcessPaymentRequestDto.prototype, "customerEmail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProcessPaymentRequestDto.prototype, "customerPhone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProcessPaymentRequestDto.prototype, "billingAddress", void 0);
class ProcessPaymentResponseDto {
}
exports.ProcessPaymentResponseDto = ProcessPaymentResponseDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ProcessPaymentResponseDto.prototype, "success", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ProcessPaymentResponseDto.prototype, "paymentId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ProcessPaymentResponseDto.prototype, "orderId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(PaymentStatus),
    __metadata("design:type", String)
], ProcessPaymentResponseDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ProcessPaymentResponseDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProcessPaymentResponseDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProcessPaymentResponseDto.prototype, "transactionId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProcessPaymentResponseDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProcessPaymentResponseDto.prototype, "errorCode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProcessPaymentResponseDto.prototype, "redirectUrl", void 0);
class PaymentMethodDto {
}
exports.PaymentMethodDto = PaymentMethodDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PaymentMethodDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PaymentMethodDto.prototype, "customerId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(PaymentMethodType),
    __metadata("design:type", String)
], PaymentMethodDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentMethodDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentMethodDto.prototype, "maskedNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentMethodDto.prototype, "expiryDate", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PaymentMethodDto.prototype, "isDefault", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PaymentMethodDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentMethodDto.prototype, "brand", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentMethodDto.prototype, "lastFourDigits", void 0);
class GetCustomerPaymentMethodsRequestDto {
}
exports.GetCustomerPaymentMethodsRequestDto = GetCustomerPaymentMethodsRequestDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], GetCustomerPaymentMethodsRequestDto.prototype, "customerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetCustomerPaymentMethodsRequestDto.prototype, "activeOnly", void 0);
class GetCustomerPaymentMethodsResponseDto {
}
exports.GetCustomerPaymentMethodsResponseDto = GetCustomerPaymentMethodsResponseDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], GetCustomerPaymentMethodsResponseDto.prototype, "customerId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], GetCustomerPaymentMethodsResponseDto.prototype, "totalMethods", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetCustomerPaymentMethodsResponseDto.prototype, "message", void 0);
class RefundPaymentRequestDto {
}
exports.RefundPaymentRequestDto = RefundPaymentRequestDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RefundPaymentRequestDto.prototype, "paymentId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RefundPaymentRequestDto.prototype, "orderId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], RefundPaymentRequestDto.prototype, "refundAmount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RefundPaymentRequestDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RefundPaymentRequestDto.prototype, "customerId", void 0);
class RefundPaymentResponseDto {
}
exports.RefundPaymentResponseDto = RefundPaymentResponseDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RefundPaymentResponseDto.prototype, "success", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RefundPaymentResponseDto.prototype, "refundId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RefundPaymentResponseDto.prototype, "paymentId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RefundPaymentResponseDto.prototype, "orderId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], RefundPaymentResponseDto.prototype, "refundAmount", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(PaymentStatus),
    __metadata("design:type", String)
], RefundPaymentResponseDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RefundPaymentResponseDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RefundPaymentResponseDto.prototype, "errorCode", void 0);
//# sourceMappingURL=payment.dto.js.map