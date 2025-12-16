# User Bounded Context

## Purpose
The User bounded context manages user profiles, preferences, and account information. It maintains customer data separate from authentication concerns.

## Status
🚧 **Implementation Pending** - This context structure is created but domain code needs to be extracted from `user-service`.

## Planned Components

### Key Aggregates
- **User**: User profile aggregate
- **Address**: Delivery and billing addresses
- **Preferences**: User preferences and settings

### Value Objects
- **UserId**: Unique user identifier
- **FullName**: User's full name
- **Phone**: Validated phone number
- **Address**: Complete address with validation

### Domain Events (Planned)
- `UserCreatedV1`: New user profile created
- `UserUpdatedV1`: User profile updated
- `AddressAddedV1`: New address added
- `PreferencesChangedV1`: User preferences updated

### Business Rules
- User must have at least one contact method
- Primary address must be set
- Profile data validation
- GDPR compliance for data management

## Integration Points
- Auth Context: Links to authentication
- Order Context: Provides customer information
- Notification Context: User contact preferences
