# Shipment Bounded Context

## Purpose and Scope

The Shipment bounded context manages order shipping, tracking, and delivery.

## Key Aggregates/Entities

### Shipment (Aggregate Root)
- **Main Properties**: shipmentId, orderId, trackingNumber, status

## Related Contexts

- **Order**: Creates shipments for confirmed orders
