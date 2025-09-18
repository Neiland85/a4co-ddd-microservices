"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDeactivatedEvent = exports.UserPasswordChangedEvent = exports.UserLoginEvent = exports.UserRegisteredEvent = void 0;
const shared_utils_1 = require("@a4co/shared-utils");
class UserRegisteredEvent extends shared_utils_1.DomainEvent {
    userData;
    constructor(aggregateId, userData, eventVersion) {
        super(aggregateId, userData, eventVersion);
        this.userData = userData;
    }
}
exports.UserRegisteredEvent = UserRegisteredEvent;
class UserLoginEvent extends shared_utils_1.DomainEvent {
    loginData;
    constructor(aggregateId, loginData, eventVersion) {
        super(aggregateId, loginData, eventVersion);
        this.loginData = loginData;
    }
}
exports.UserLoginEvent = UserLoginEvent;
class UserPasswordChangedEvent extends shared_utils_1.DomainEvent {
    passwordData;
    constructor(aggregateId, passwordData, eventVersion) {
        super(aggregateId, passwordData, eventVersion);
        this.passwordData = passwordData;
    }
}
exports.UserPasswordChangedEvent = UserPasswordChangedEvent;
class UserDeactivatedEvent extends shared_utils_1.DomainEvent {
    deactivationData;
    constructor(aggregateId, deactivationData, eventVersion) {
        super(aggregateId, deactivationData, eventVersion);
        this.deactivationData = deactivationData;
    }
}
exports.UserDeactivatedEvent = UserDeactivatedEvent;
//# sourceMappingURL=user-events.js.map