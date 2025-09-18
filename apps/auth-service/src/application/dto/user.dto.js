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
exports.UserResponseDto = exports.ChangePasswordDto = exports.LoginUserDto = exports.RegisterUserDto = void 0;
const class_validator_1 = require("class-validator");
const shared_utils_1 = require("@a4co/shared-utils");
class RegisterUserDto extends shared_utils_1.BaseDto {
    email;
    name;
    password;
}
exports.RegisterUserDto = RegisterUserDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Debe ser un email válido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email es requerido' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Nombre debe ser texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nombre es requerido' }),
    (0, class_validator_1.MinLength)(2, { message: 'Nombre debe tener al menos 2 caracteres' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Nombre no puede tener más de 50 caracteres' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Password debe ser texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password es requerido' }),
    (0, class_validator_1.MinLength)(8, { message: 'Password debe tener al menos 8 caracteres' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Password no puede tener más de 100 caracteres' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "password", void 0);
class LoginUserDto extends shared_utils_1.BaseDto {
    email;
    password;
}
exports.LoginUserDto = LoginUserDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Debe ser un email válido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email es requerido' }),
    __metadata("design:type", String)
], LoginUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Password debe ser texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password es requerido' }),
    __metadata("design:type", String)
], LoginUserDto.prototype, "password", void 0);
class ChangePasswordDto extends shared_utils_1.BaseDto {
    currentPassword;
    newPassword;
}
exports.ChangePasswordDto = ChangePasswordDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Password actual debe ser texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password actual es requerido' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "currentPassword", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Nuevo password debe ser texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nuevo password es requerido' }),
    (0, class_validator_1.MinLength)(8, { message: 'Nuevo password debe tener al menos 8 caracteres' }),
    (0, class_validator_1.MaxLength)(100, {
        message: 'Nuevo password no puede tener más de 100 caracteres',
    }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "newPassword", void 0);
class UserResponseDto extends shared_utils_1.BaseDto {
    id;
    email;
    name;
    status;
    emailVerified;
    lastLoginAt;
    createdAt;
    updatedAt;
}
exports.UserResponseDto = UserResponseDto;
//# sourceMappingURL=user.dto.js.map