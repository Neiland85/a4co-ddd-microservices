import pytest
from datetime import datetime
from pydantic import ValidationError
from models import (
    TransportistaCreate,
    ShipmentCreate,
    ShipmentLocation,
    UpdateShipmentStatus
)


class TestTransportistaCreate:
    """Tests para el modelo TransportistaCreate"""

    def test_valid_transportista_creation(self):
        """Debe crear un transportista válido"""
        transportista = TransportistaCreate(
            nombre="Juan Pérez",
            rut="12345678-9",
            telefono="+56912345678",
            email="juan@example.com",
            direccion="Calle Principal 123, Jaén",
            tipo_vehiculo="furgon",
            capacidad_kg=1000.0
        )

        assert transportista.nombre == "Juan Pérez"
        assert transportista.rut == "12345678-9"
        assert transportista.tipo_vehiculo == "furgon"

    def test_invalid_rut_format(self):
        """Debe rechazar RUT inválido"""
        with pytest.raises(ValidationError) as exc_info:
            TransportistaCreate(
                nombre="Juan Pérez",
                rut="invalid-rut",
                telefono="+56912345678",
                email="juan@example.com",
                direccion="Calle Principal 123",
                tipo_vehiculo="furgon",
                capacidad_kg=1000.0
            )

        assert "RUT debe tener formato válido" in str(exc_info.value)

    def test_invalid_email_format(self):
        """Debe rechazar email inválido"""
        with pytest.raises(ValidationError) as exc_info:
            TransportistaCreate(
                nombre="Juan Pérez",
                rut="12345678-9",
                telefono="+56912345678",
                email="invalid-email",
                direccion="Calle Principal 123",
                tipo_vehiculo="furgon",
                capacidad_kg=1000.0
            )

        assert "Email debe tener formato válido" in str(exc_info.value)

    def test_invalid_tipo_vehiculo(self):
        """Debe rechazar tipo de vehículo inválido"""
        with pytest.raises(ValidationError) as exc_info:
            TransportistaCreate(
                nombre="Juan Pérez",
                rut="12345678-9",
                telefono="+56912345678",
                email="juan@example.com",
                direccion="Calle Principal 123",
                tipo_vehiculo="avion",
                capacidad_kg=1000.0
            )

        assert "Tipo de vehículo debe ser uno de" in str(exc_info.value)

    def test_capacidad_kg_validation(self):
        """Debe validar capacidad de carga"""
        with pytest.raises(ValidationError):
            TransportistaCreate(
                nombre="Juan Pérez",
                rut="12345678-9",
                telefono="+56912345678",
                email="juan@example.com",
                direccion="Calle Principal 123",
                tipo_vehiculo="furgon",
                capacidad_kg=0  # Debe ser > 0
            )

        with pytest.raises(ValidationError):
            TransportistaCreate(
                nombre="Juan Pérez",
                rut="12345678-9",
                telefono="+56912345678",
                email="juan@example.com",
                direccion="Calle Principal 123",
                tipo_vehiculo="camion",
                capacidad_kg=60000  # Debe ser <= 50000
            )


class TestShipmentModels:
    """Tests para modelos de envío"""

    def test_shipment_location_creation(self):
        """Debe crear ubicación válida"""
        location = ShipmentLocation(
            latitude=37.7749,
            longitude=-3.7903,
            address="Calle Test 123",
            city="Jaén",
            region="Andalucía"
        )

        assert location.latitude == 37.7749
        assert location.city == "Jaén"

    def test_shipment_create_validation(self):
        """Debe validar datos de envío"""
        origin = ShipmentLocation(
            latitude=37.7749,
            longitude=-3.7903,
            address="Origen",
            city="Jaén",
            region="Andalucía"
        )
        destination = ShipmentLocation(
            latitude=40.4168,
            longitude=-3.7038,
            address="Destino",
            city="Madrid",
            region="Madrid"
        )

        shipment = ShipmentCreate(
            order_id="order-123",
            transportista_id="transp-456",
            origin=origin,
            destination=destination,
            weight_kg=15.5,
            estimated_delivery=datetime(2025, 10, 30, 18, 0)
        )

        assert shipment.order_id == "order-123"
        assert shipment.weight_kg == 15.5

    def test_update_shipment_status(self):
        """Debe crear actualización de estado válida"""
        update = UpdateShipmentStatus(
            status="in_transit",
            location="Centro de distribución",
            notes="En ruta"
        )

        assert update.status == "in_transit"
        assert update.notes == "En ruta"

