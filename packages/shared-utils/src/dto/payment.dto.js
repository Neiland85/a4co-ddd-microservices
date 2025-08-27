"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
let ValidatePaymentMethodRequestDto = (() => {
    let _paymentMethodType_decorators;
    let _paymentMethodType_initializers = [];
    let _paymentMethodType_extraInitializers = [];
    let _paymentMethodId_decorators;
    let _paymentMethodId_initializers = [];
    let _paymentMethodId_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    return class ValidatePaymentMethodRequestDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _paymentMethodType_decorators = [(0, class_validator_1.IsEnum)(PaymentMethodType)];
            _paymentMethodId_decorators = [(0, class_validator_1.IsString)()];
            _customerId_decorators = [(0, class_validator_1.IsUUID)()];
            _amount_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0.01)];
            _currency_decorators = [(0, class_validator_1.IsString)()];
            _orderId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _paymentMethodType_decorators, { kind: "field", name: "paymentMethodType", static: false, private: false, access: { has: obj => "paymentMethodType" in obj, get: obj => obj.paymentMethodType, set: (obj, value) => { obj.paymentMethodType = value; } }, metadata: _metadata }, _paymentMethodType_initializers, _paymentMethodType_extraInitializers);
            __esDecorate(null, null, _paymentMethodId_decorators, { kind: "field", name: "paymentMethodId", static: false, private: false, access: { has: obj => "paymentMethodId" in obj, get: obj => obj.paymentMethodId, set: (obj, value) => { obj.paymentMethodId = value; } }, metadata: _metadata }, _paymentMethodId_initializers, _paymentMethodId_extraInitializers);
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        paymentMethodType = __runInitializers(this, _paymentMethodType_initializers, void 0);
        paymentMethodId = (__runInitializers(this, _paymentMethodType_extraInitializers), __runInitializers(this, _paymentMethodId_initializers, void 0));
        customerId = (__runInitializers(this, _paymentMethodId_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
        amount = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
        currency = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
        orderId = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _orderId_initializers, void 0));
        constructor() {
            __runInitializers(this, _orderId_extraInitializers);
        }
    };
})();
exports.ValidatePaymentMethodRequestDto = ValidatePaymentMethodRequestDto;
let ValidatePaymentMethodResponseDto = (() => {
    let _valid_decorators;
    let _valid_initializers = [];
    let _valid_extraInitializers = [];
    let _paymentMethodType_decorators;
    let _paymentMethodType_initializers = [];
    let _paymentMethodType_extraInitializers = [];
    let _paymentMethodId_decorators;
    let _paymentMethodId_initializers = [];
    let _paymentMethodId_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _availableBalance_decorators;
    let _availableBalance_initializers = [];
    let _availableBalance_extraInitializers = [];
    let _dailyLimit_decorators;
    let _dailyLimit_initializers = [];
    let _dailyLimit_extraInitializers = [];
    let _monthlyLimit_decorators;
    let _monthlyLimit_initializers = [];
    let _monthlyLimit_extraInitializers = [];
    let _message_decorators;
    let _message_initializers = [];
    let _message_extraInitializers = [];
    let _errorCode_decorators;
    let _errorCode_initializers = [];
    let _errorCode_extraInitializers = [];
    return class ValidatePaymentMethodResponseDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _valid_decorators = [(0, class_validator_1.IsBoolean)()];
            _paymentMethodType_decorators = [(0, class_validator_1.IsEnum)(PaymentMethodType)];
            _paymentMethodId_decorators = [(0, class_validator_1.IsString)()];
            _customerId_decorators = [(0, class_validator_1.IsUUID)()];
            _availableBalance_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _dailyLimit_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _monthlyLimit_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _message_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _errorCode_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _valid_decorators, { kind: "field", name: "valid", static: false, private: false, access: { has: obj => "valid" in obj, get: obj => obj.valid, set: (obj, value) => { obj.valid = value; } }, metadata: _metadata }, _valid_initializers, _valid_extraInitializers);
            __esDecorate(null, null, _paymentMethodType_decorators, { kind: "field", name: "paymentMethodType", static: false, private: false, access: { has: obj => "paymentMethodType" in obj, get: obj => obj.paymentMethodType, set: (obj, value) => { obj.paymentMethodType = value; } }, metadata: _metadata }, _paymentMethodType_initializers, _paymentMethodType_extraInitializers);
            __esDecorate(null, null, _paymentMethodId_decorators, { kind: "field", name: "paymentMethodId", static: false, private: false, access: { has: obj => "paymentMethodId" in obj, get: obj => obj.paymentMethodId, set: (obj, value) => { obj.paymentMethodId = value; } }, metadata: _metadata }, _paymentMethodId_initializers, _paymentMethodId_extraInitializers);
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _availableBalance_decorators, { kind: "field", name: "availableBalance", static: false, private: false, access: { has: obj => "availableBalance" in obj, get: obj => obj.availableBalance, set: (obj, value) => { obj.availableBalance = value; } }, metadata: _metadata }, _availableBalance_initializers, _availableBalance_extraInitializers);
            __esDecorate(null, null, _dailyLimit_decorators, { kind: "field", name: "dailyLimit", static: false, private: false, access: { has: obj => "dailyLimit" in obj, get: obj => obj.dailyLimit, set: (obj, value) => { obj.dailyLimit = value; } }, metadata: _metadata }, _dailyLimit_initializers, _dailyLimit_extraInitializers);
            __esDecorate(null, null, _monthlyLimit_decorators, { kind: "field", name: "monthlyLimit", static: false, private: false, access: { has: obj => "monthlyLimit" in obj, get: obj => obj.monthlyLimit, set: (obj, value) => { obj.monthlyLimit = value; } }, metadata: _metadata }, _monthlyLimit_initializers, _monthlyLimit_extraInitializers);
            __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
            __esDecorate(null, null, _errorCode_decorators, { kind: "field", name: "errorCode", static: false, private: false, access: { has: obj => "errorCode" in obj, get: obj => obj.errorCode, set: (obj, value) => { obj.errorCode = value; } }, metadata: _metadata }, _errorCode_initializers, _errorCode_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        valid = __runInitializers(this, _valid_initializers, void 0);
        paymentMethodType = (__runInitializers(this, _valid_extraInitializers), __runInitializers(this, _paymentMethodType_initializers, void 0));
        paymentMethodId = (__runInitializers(this, _paymentMethodType_extraInitializers), __runInitializers(this, _paymentMethodId_initializers, void 0));
        customerId = (__runInitializers(this, _paymentMethodId_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
        availableBalance = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _availableBalance_initializers, void 0));
        dailyLimit = (__runInitializers(this, _availableBalance_extraInitializers), __runInitializers(this, _dailyLimit_initializers, void 0));
        monthlyLimit = (__runInitializers(this, _dailyLimit_extraInitializers), __runInitializers(this, _monthlyLimit_initializers, void 0));
        message = (__runInitializers(this, _monthlyLimit_extraInitializers), __runInitializers(this, _message_initializers, void 0));
        errorCode = (__runInitializers(this, _message_extraInitializers), __runInitializers(this, _errorCode_initializers, void 0));
        constructor() {
            __runInitializers(this, _errorCode_extraInitializers);
        }
    };
})();
exports.ValidatePaymentMethodResponseDto = ValidatePaymentMethodResponseDto;
let ProcessPaymentRequestDto = (() => {
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _paymentMethodType_decorators;
    let _paymentMethodType_initializers = [];
    let _paymentMethodType_extraInitializers = [];
    let _paymentMethodId_decorators;
    let _paymentMethodId_initializers = [];
    let _paymentMethodId_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _customerEmail_decorators;
    let _customerEmail_initializers = [];
    let _customerEmail_extraInitializers = [];
    let _customerPhone_decorators;
    let _customerPhone_initializers = [];
    let _customerPhone_extraInitializers = [];
    let _billingAddress_decorators;
    let _billingAddress_initializers = [];
    let _billingAddress_extraInitializers = [];
    return class ProcessPaymentRequestDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _orderId_decorators = [(0, class_validator_1.IsUUID)()];
            _customerId_decorators = [(0, class_validator_1.IsUUID)()];
            _paymentMethodType_decorators = [(0, class_validator_1.IsEnum)(PaymentMethodType)];
            _paymentMethodId_decorators = [(0, class_validator_1.IsString)()];
            _amount_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0.01)];
            _currency_decorators = [(0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsString)()];
            _customerEmail_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _customerPhone_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _billingAddress_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _paymentMethodType_decorators, { kind: "field", name: "paymentMethodType", static: false, private: false, access: { has: obj => "paymentMethodType" in obj, get: obj => obj.paymentMethodType, set: (obj, value) => { obj.paymentMethodType = value; } }, metadata: _metadata }, _paymentMethodType_initializers, _paymentMethodType_extraInitializers);
            __esDecorate(null, null, _paymentMethodId_decorators, { kind: "field", name: "paymentMethodId", static: false, private: false, access: { has: obj => "paymentMethodId" in obj, get: obj => obj.paymentMethodId, set: (obj, value) => { obj.paymentMethodId = value; } }, metadata: _metadata }, _paymentMethodId_initializers, _paymentMethodId_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _customerEmail_decorators, { kind: "field", name: "customerEmail", static: false, private: false, access: { has: obj => "customerEmail" in obj, get: obj => obj.customerEmail, set: (obj, value) => { obj.customerEmail = value; } }, metadata: _metadata }, _customerEmail_initializers, _customerEmail_extraInitializers);
            __esDecorate(null, null, _customerPhone_decorators, { kind: "field", name: "customerPhone", static: false, private: false, access: { has: obj => "customerPhone" in obj, get: obj => obj.customerPhone, set: (obj, value) => { obj.customerPhone = value; } }, metadata: _metadata }, _customerPhone_initializers, _customerPhone_extraInitializers);
            __esDecorate(null, null, _billingAddress_decorators, { kind: "field", name: "billingAddress", static: false, private: false, access: { has: obj => "billingAddress" in obj, get: obj => obj.billingAddress, set: (obj, value) => { obj.billingAddress = value; } }, metadata: _metadata }, _billingAddress_initializers, _billingAddress_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        orderId = __runInitializers(this, _orderId_initializers, void 0);
        customerId = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
        paymentMethodType = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _paymentMethodType_initializers, void 0));
        paymentMethodId = (__runInitializers(this, _paymentMethodType_extraInitializers), __runInitializers(this, _paymentMethodId_initializers, void 0));
        amount = (__runInitializers(this, _paymentMethodId_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
        currency = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
        description = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _description_initializers, void 0));
        customerEmail = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _customerEmail_initializers, void 0));
        customerPhone = (__runInitializers(this, _customerEmail_extraInitializers), __runInitializers(this, _customerPhone_initializers, void 0));
        billingAddress = (__runInitializers(this, _customerPhone_extraInitializers), __runInitializers(this, _billingAddress_initializers, void 0));
        constructor() {
            __runInitializers(this, _billingAddress_extraInitializers);
        }
    };
})();
exports.ProcessPaymentRequestDto = ProcessPaymentRequestDto;
let ProcessPaymentResponseDto = (() => {
    let _success_decorators;
    let _success_initializers = [];
    let _success_extraInitializers = [];
    let _paymentId_decorators;
    let _paymentId_initializers = [];
    let _paymentId_extraInitializers = [];
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _transactionId_decorators;
    let _transactionId_initializers = [];
    let _transactionId_extraInitializers = [];
    let _message_decorators;
    let _message_initializers = [];
    let _message_extraInitializers = [];
    let _errorCode_decorators;
    let _errorCode_initializers = [];
    let _errorCode_extraInitializers = [];
    let _redirectUrl_decorators;
    let _redirectUrl_initializers = [];
    let _redirectUrl_extraInitializers = [];
    return class ProcessPaymentResponseDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _success_decorators = [(0, class_validator_1.IsBoolean)()];
            _paymentId_decorators = [(0, class_validator_1.IsUUID)()];
            _orderId_decorators = [(0, class_validator_1.IsUUID)()];
            _status_decorators = [(0, class_validator_1.IsEnum)(PaymentStatus)];
            _amount_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _currency_decorators = [(0, class_validator_1.IsString)()];
            _transactionId_decorators = [(0, class_validator_1.IsString)()];
            _message_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _errorCode_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _redirectUrl_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _success_decorators, { kind: "field", name: "success", static: false, private: false, access: { has: obj => "success" in obj, get: obj => obj.success, set: (obj, value) => { obj.success = value; } }, metadata: _metadata }, _success_initializers, _success_extraInitializers);
            __esDecorate(null, null, _paymentId_decorators, { kind: "field", name: "paymentId", static: false, private: false, access: { has: obj => "paymentId" in obj, get: obj => obj.paymentId, set: (obj, value) => { obj.paymentId = value; } }, metadata: _metadata }, _paymentId_initializers, _paymentId_extraInitializers);
            __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _transactionId_decorators, { kind: "field", name: "transactionId", static: false, private: false, access: { has: obj => "transactionId" in obj, get: obj => obj.transactionId, set: (obj, value) => { obj.transactionId = value; } }, metadata: _metadata }, _transactionId_initializers, _transactionId_extraInitializers);
            __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
            __esDecorate(null, null, _errorCode_decorators, { kind: "field", name: "errorCode", static: false, private: false, access: { has: obj => "errorCode" in obj, get: obj => obj.errorCode, set: (obj, value) => { obj.errorCode = value; } }, metadata: _metadata }, _errorCode_initializers, _errorCode_extraInitializers);
            __esDecorate(null, null, _redirectUrl_decorators, { kind: "field", name: "redirectUrl", static: false, private: false, access: { has: obj => "redirectUrl" in obj, get: obj => obj.redirectUrl, set: (obj, value) => { obj.redirectUrl = value; } }, metadata: _metadata }, _redirectUrl_initializers, _redirectUrl_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        success = __runInitializers(this, _success_initializers, void 0);
        paymentId = (__runInitializers(this, _success_extraInitializers), __runInitializers(this, _paymentId_initializers, void 0));
        orderId = (__runInitializers(this, _paymentId_extraInitializers), __runInitializers(this, _orderId_initializers, void 0));
        status = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        amount = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
        currency = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
        transactionId = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _transactionId_initializers, void 0));
        message = (__runInitializers(this, _transactionId_extraInitializers), __runInitializers(this, _message_initializers, void 0));
        errorCode = (__runInitializers(this, _message_extraInitializers), __runInitializers(this, _errorCode_initializers, void 0));
        redirectUrl = (__runInitializers(this, _errorCode_extraInitializers), __runInitializers(this, _redirectUrl_initializers, void 0));
        constructor() {
            __runInitializers(this, _redirectUrl_extraInitializers);
        }
    };
})();
exports.ProcessPaymentResponseDto = ProcessPaymentResponseDto;
let PaymentMethodDto = (() => {
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _maskedNumber_decorators;
    let _maskedNumber_initializers = [];
    let _maskedNumber_extraInitializers = [];
    let _expiryDate_decorators;
    let _expiryDate_initializers = [];
    let _expiryDate_extraInitializers = [];
    let _isDefault_decorators;
    let _isDefault_initializers = [];
    let _isDefault_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _brand_decorators;
    let _brand_initializers = [];
    let _brand_extraInitializers = [];
    let _lastFourDigits_decorators;
    let _lastFourDigits_initializers = [];
    let _lastFourDigits_extraInitializers = [];
    return class PaymentMethodDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_validator_1.IsUUID)()];
            _customerId_decorators = [(0, class_validator_1.IsUUID)()];
            _type_decorators = [(0, class_validator_1.IsEnum)(PaymentMethodType)];
            _name_decorators = [(0, class_validator_1.IsString)()];
            _maskedNumber_decorators = [(0, class_validator_1.IsString)()];
            _expiryDate_decorators = [(0, class_validator_1.IsString)()];
            _isDefault_decorators = [(0, class_validator_1.IsBoolean)()];
            _isActive_decorators = [(0, class_validator_1.IsBoolean)()];
            _brand_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _lastFourDigits_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _maskedNumber_decorators, { kind: "field", name: "maskedNumber", static: false, private: false, access: { has: obj => "maskedNumber" in obj, get: obj => obj.maskedNumber, set: (obj, value) => { obj.maskedNumber = value; } }, metadata: _metadata }, _maskedNumber_initializers, _maskedNumber_extraInitializers);
            __esDecorate(null, null, _expiryDate_decorators, { kind: "field", name: "expiryDate", static: false, private: false, access: { has: obj => "expiryDate" in obj, get: obj => obj.expiryDate, set: (obj, value) => { obj.expiryDate = value; } }, metadata: _metadata }, _expiryDate_initializers, _expiryDate_extraInitializers);
            __esDecorate(null, null, _isDefault_decorators, { kind: "field", name: "isDefault", static: false, private: false, access: { has: obj => "isDefault" in obj, get: obj => obj.isDefault, set: (obj, value) => { obj.isDefault = value; } }, metadata: _metadata }, _isDefault_initializers, _isDefault_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            __esDecorate(null, null, _brand_decorators, { kind: "field", name: "brand", static: false, private: false, access: { has: obj => "brand" in obj, get: obj => obj.brand, set: (obj, value) => { obj.brand = value; } }, metadata: _metadata }, _brand_initializers, _brand_extraInitializers);
            __esDecorate(null, null, _lastFourDigits_decorators, { kind: "field", name: "lastFourDigits", static: false, private: false, access: { has: obj => "lastFourDigits" in obj, get: obj => obj.lastFourDigits, set: (obj, value) => { obj.lastFourDigits = value; } }, metadata: _metadata }, _lastFourDigits_initializers, _lastFourDigits_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        id = __runInitializers(this, _id_initializers, void 0);
        customerId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
        type = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _type_initializers, void 0));
        name = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _name_initializers, void 0));
        maskedNumber = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _maskedNumber_initializers, void 0));
        expiryDate = (__runInitializers(this, _maskedNumber_extraInitializers), __runInitializers(this, _expiryDate_initializers, void 0));
        isDefault = (__runInitializers(this, _expiryDate_extraInitializers), __runInitializers(this, _isDefault_initializers, void 0));
        isActive = (__runInitializers(this, _isDefault_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
        brand = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _brand_initializers, void 0));
        lastFourDigits = (__runInitializers(this, _brand_extraInitializers), __runInitializers(this, _lastFourDigits_initializers, void 0));
        constructor() {
            __runInitializers(this, _lastFourDigits_extraInitializers);
        }
    };
})();
exports.PaymentMethodDto = PaymentMethodDto;
let GetCustomerPaymentMethodsRequestDto = (() => {
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _activeOnly_decorators;
    let _activeOnly_initializers = [];
    let _activeOnly_extraInitializers = [];
    return class GetCustomerPaymentMethodsRequestDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerId_decorators = [(0, class_validator_1.IsUUID)()];
            _activeOnly_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _activeOnly_decorators, { kind: "field", name: "activeOnly", static: false, private: false, access: { has: obj => "activeOnly" in obj, get: obj => obj.activeOnly, set: (obj, value) => { obj.activeOnly = value; } }, metadata: _metadata }, _activeOnly_initializers, _activeOnly_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        customerId = __runInitializers(this, _customerId_initializers, void 0);
        activeOnly = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _activeOnly_initializers, void 0));
        constructor() {
            __runInitializers(this, _activeOnly_extraInitializers);
        }
    };
})();
exports.GetCustomerPaymentMethodsRequestDto = GetCustomerPaymentMethodsRequestDto;
let GetCustomerPaymentMethodsResponseDto = (() => {
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _totalMethods_decorators;
    let _totalMethods_initializers = [];
    let _totalMethods_extraInitializers = [];
    let _message_decorators;
    let _message_initializers = [];
    let _message_extraInitializers = [];
    return class GetCustomerPaymentMethodsResponseDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerId_decorators = [(0, class_validator_1.IsUUID)()];
            _totalMethods_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _message_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _totalMethods_decorators, { kind: "field", name: "totalMethods", static: false, private: false, access: { has: obj => "totalMethods" in obj, get: obj => obj.totalMethods, set: (obj, value) => { obj.totalMethods = value; } }, metadata: _metadata }, _totalMethods_initializers, _totalMethods_extraInitializers);
            __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        customerId = __runInitializers(this, _customerId_initializers, void 0);
        totalMethods = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _totalMethods_initializers, void 0));
        paymentMethods = __runInitializers(this, _totalMethods_extraInitializers);
        message = __runInitializers(this, _message_initializers, void 0);
        constructor() {
            __runInitializers(this, _message_extraInitializers);
        }
    };
})();
exports.GetCustomerPaymentMethodsResponseDto = GetCustomerPaymentMethodsResponseDto;
let RefundPaymentRequestDto = (() => {
    let _paymentId_decorators;
    let _paymentId_initializers = [];
    let _paymentId_extraInitializers = [];
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _refundAmount_decorators;
    let _refundAmount_initializers = [];
    let _refundAmount_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    return class RefundPaymentRequestDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _paymentId_decorators = [(0, class_validator_1.IsUUID)()];
            _orderId_decorators = [(0, class_validator_1.IsUUID)()];
            _refundAmount_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0.01)];
            _reason_decorators = [(0, class_validator_1.IsString)()];
            _customerId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _paymentId_decorators, { kind: "field", name: "paymentId", static: false, private: false, access: { has: obj => "paymentId" in obj, get: obj => obj.paymentId, set: (obj, value) => { obj.paymentId = value; } }, metadata: _metadata }, _paymentId_initializers, _paymentId_extraInitializers);
            __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
            __esDecorate(null, null, _refundAmount_decorators, { kind: "field", name: "refundAmount", static: false, private: false, access: { has: obj => "refundAmount" in obj, get: obj => obj.refundAmount, set: (obj, value) => { obj.refundAmount = value; } }, metadata: _metadata }, _refundAmount_initializers, _refundAmount_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        paymentId = __runInitializers(this, _paymentId_initializers, void 0);
        orderId = (__runInitializers(this, _paymentId_extraInitializers), __runInitializers(this, _orderId_initializers, void 0));
        refundAmount = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _refundAmount_initializers, void 0));
        reason = (__runInitializers(this, _refundAmount_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
        customerId = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
        constructor() {
            __runInitializers(this, _customerId_extraInitializers);
        }
    };
})();
exports.RefundPaymentRequestDto = RefundPaymentRequestDto;
let RefundPaymentResponseDto = (() => {
    let _success_decorators;
    let _success_initializers = [];
    let _success_extraInitializers = [];
    let _refundId_decorators;
    let _refundId_initializers = [];
    let _refundId_extraInitializers = [];
    let _paymentId_decorators;
    let _paymentId_initializers = [];
    let _paymentId_extraInitializers = [];
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _refundAmount_decorators;
    let _refundAmount_initializers = [];
    let _refundAmount_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _message_decorators;
    let _message_initializers = [];
    let _message_extraInitializers = [];
    let _errorCode_decorators;
    let _errorCode_initializers = [];
    let _errorCode_extraInitializers = [];
    return class RefundPaymentResponseDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _success_decorators = [(0, class_validator_1.IsBoolean)()];
            _refundId_decorators = [(0, class_validator_1.IsUUID)()];
            _paymentId_decorators = [(0, class_validator_1.IsUUID)()];
            _orderId_decorators = [(0, class_validator_1.IsUUID)()];
            _refundAmount_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _status_decorators = [(0, class_validator_1.IsEnum)(PaymentStatus)];
            _message_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _errorCode_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _success_decorators, { kind: "field", name: "success", static: false, private: false, access: { has: obj => "success" in obj, get: obj => obj.success, set: (obj, value) => { obj.success = value; } }, metadata: _metadata }, _success_initializers, _success_extraInitializers);
            __esDecorate(null, null, _refundId_decorators, { kind: "field", name: "refundId", static: false, private: false, access: { has: obj => "refundId" in obj, get: obj => obj.refundId, set: (obj, value) => { obj.refundId = value; } }, metadata: _metadata }, _refundId_initializers, _refundId_extraInitializers);
            __esDecorate(null, null, _paymentId_decorators, { kind: "field", name: "paymentId", static: false, private: false, access: { has: obj => "paymentId" in obj, get: obj => obj.paymentId, set: (obj, value) => { obj.paymentId = value; } }, metadata: _metadata }, _paymentId_initializers, _paymentId_extraInitializers);
            __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
            __esDecorate(null, null, _refundAmount_decorators, { kind: "field", name: "refundAmount", static: false, private: false, access: { has: obj => "refundAmount" in obj, get: obj => obj.refundAmount, set: (obj, value) => { obj.refundAmount = value; } }, metadata: _metadata }, _refundAmount_initializers, _refundAmount_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
            __esDecorate(null, null, _errorCode_decorators, { kind: "field", name: "errorCode", static: false, private: false, access: { has: obj => "errorCode" in obj, get: obj => obj.errorCode, set: (obj, value) => { obj.errorCode = value; } }, metadata: _metadata }, _errorCode_initializers, _errorCode_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        success = __runInitializers(this, _success_initializers, void 0);
        refundId = (__runInitializers(this, _success_extraInitializers), __runInitializers(this, _refundId_initializers, void 0));
        paymentId = (__runInitializers(this, _refundId_extraInitializers), __runInitializers(this, _paymentId_initializers, void 0));
        orderId = (__runInitializers(this, _paymentId_extraInitializers), __runInitializers(this, _orderId_initializers, void 0));
        refundAmount = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _refundAmount_initializers, void 0));
        status = (__runInitializers(this, _refundAmount_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        message = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _message_initializers, void 0));
        errorCode = (__runInitializers(this, _message_extraInitializers), __runInitializers(this, _errorCode_initializers, void 0));
        constructor() {
            __runInitializers(this, _errorCode_extraInitializers);
        }
    };
})();
exports.RefundPaymentResponseDto = RefundPaymentResponseDto;
//# sourceMappingURL=payment.dto.js.map