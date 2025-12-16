# User Bounded Context

## Purpose and Scope

The User bounded context manages user profiles, preferences, and customer information.

## Key Aggregates/Entities

### User (Aggregate Root)
- **Identifier**: UserId
- **Main Properties**: userId, email, name, address

### Value Objects
- **UserId**: Unique identifier for a user
- **Email**: User email address (from common)
- **Address**: User physical address (from common)

## Related Contexts

- **Auth**: Handles authentication
- **Order**: Uses customer information
