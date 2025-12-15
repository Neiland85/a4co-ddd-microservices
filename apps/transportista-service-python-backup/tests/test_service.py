import pytest
from datetime import datetime, timedelta
from service import TransportistaService
from models import (
    TransportistaCreate,
    ShipmentCreate,
    ShipmentLocation,
    UpdateShipmentStatus
)


@pytest.fixture
def service():
    """Fixture del servicio"""
    return TransportistaService()


@pytest.fixture
def sample_transportista():
    """Fixture de transportista de ejemplo"""
    return TransportistaCreate(
        nombre="Juan Pérez",
        rut="12345678-9",
        telefono="+56912345678",
        email="juan@example.com",
        direccion="Calle Principal 123",
        tipo_vehiculo="furgon",
        capacidad_kg=1000.0
    )


@pytest.fixture
def sample_locations():
    """Fixture de ubicaciones"""
    origin = ShipmentLocation(
        latitude=37.7749,
        longitude=-3.7903,
        address="Almacén Jaén",
        city="Jaén",
        region="Andalucía"
    )
    destination = ShipmentLocation(
        latitude=40.4168,
        longitude=-3.7038,
        address="Cliente Madrid",
        city="Madrid",
        region="Madrid"
    )
    return origin, destination


class TestTransportistaService:
    """Tests para TransportistaService"""

    @pytest.mark.asyncio
    async def test_crear_transportista(self, service, sample_transportista):
        """Debe crear un transportista correctamente"""
        result = await service.crear_transportista(sample_transportista)

        assert result.nombre == sample_transportista.nombre
        assert result.rut == sample_transportista.rut.upper()
        assert result.email == sample_transportista.email.lower()
        assert result.activo is True
        assert result.id is not None

    @pytest.mark.asyncio
    async def test_crear_transportista_rut_duplicado(self, service, sample_transportista):
        """Debe rechazar RUT duplicado"""
        await service.crear_transportista(sample_transportista)

        with pytest.raises(ValueError) as exc_info:
            await service.crear_transportista(sample_transportista)

        assert "Ya existe un transportista con RUT" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_crear_transportista_email_duplicado(self, service):
        """Debe rechazar email duplicado"""
        transportista1 = TransportistaCreate(
            nombre="Juan Pérez",
            rut="12345678-9",
            telefono="+56912345678",
            email="same@example.com",
            direccion="Calle Principal 123",
            tipo_vehiculo="furgon",
            capacidad_kg=1000.0
        )

        transportista2 = TransportistaCreate(
            nombre="María García",
            rut="98765432-1",
            telefono="+56987654321",
            email="same@example.com",
            direccion="Avenida Industrial 456",
            tipo_vehiculo="camion",
            capacidad_kg=2000.0
        )

        await service.crear_transportista(transportista1)

        with pytest.raises(ValueError) as exc_info:
            await service.crear_transportista(transportista2)

        assert "Ya existe un transportista con email" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_obtener_transportista(self, service, sample_transportista):
        """Debe obtener transportista por ID"""
        created = await service.crear_transportista(sample_transportista)
        found = await service.obtener_transportista(created.id)

        assert found is not None
        assert found.id == created.id
        assert found.nombre == created.nombre

    @pytest.mark.asyncio
    async def test_obtener_transportista_no_existente(self, service):
        """Debe retornar None para ID inválido"""
        result = await service.obtener_transportista("invalid-id")
        assert result is None

    @pytest.mark.asyncio
    async def test_listar_transportistas(self, service, sample_transportista):
        """Debe listar transportistas"""
        await service.crear_transportista(sample_transportista)
        
        result = await service.listar_transportistas()
        
        assert len(result) == 1
        assert result[0].nombre == sample_transportista.nombre

    @pytest.mark.asyncio
    async def test_listar_transportistas_filtro_activo(self, service):
        """Debe filtrar transportistas por estado activo"""
        transportista_activo = TransportistaCreate(
            nombre="Activo",
            rut="11111111-1",
            telefono="+56911111111",
            email="activo@test.com",
            direccion="Calle Principal 123",
            tipo_vehiculo="furgon",
            capacidad_kg=1000.0,
            activo=True
        )

        transportista_inactivo = TransportistaCreate(
            nombre="Inactivo",
            rut="22222222-2",
            telefono="+56922222222",
            email="inactivo@test.com",
            direccion="Avenida Industrial 456",
            tipo_vehiculo="camion",
            capacidad_kg=2000.0,
            activo=False
        )

        await service.crear_transportista(transportista_activo)
        await service.crear_transportista(transportista_inactivo)

        activos = await service.listar_transportistas(activo=True)
        assert len(activos) == 1
        assert activos[0].activo is True

        inactivos = await service.listar_transportistas(activo=False)
        assert len(inactivos) == 1
        assert inactivos[0].activo is False


class TestShipmentService:
    """Tests para funcionalidad de envíos"""

    @pytest.mark.asyncio
    async def test_crear_envio(self, service, sample_transportista, sample_locations):
        """Debe crear un envío correctamente"""
        transportista = await service.crear_transportista(sample_transportista)
        origin, destination = sample_locations

        shipment_data = ShipmentCreate(
            order_id="order-123",
            transportista_id=transportista.id,
            origin=origin,
            destination=destination,
            weight_kg=15.5,
            estimated_delivery=datetime.now() + timedelta(days=2)
        )

        shipment = await service.crear_envio(shipment_data)

        assert shipment.tracking_number.startswith("TR")
        assert shipment.order_id == "order-123"
        assert shipment.status == "pending"
        assert len(shipment.history) == 1

    @pytest.mark.asyncio
    async def test_crear_envio_transportista_no_existe(self, service, sample_locations):
        """Debe fallar si el transportista no existe"""
        origin, destination = sample_locations

        shipment_data = ShipmentCreate(
            order_id="order-123",
            transportista_id="invalid-id",
            origin=origin,
            destination=destination,
            weight_kg=15.5,
            estimated_delivery=datetime.now() + timedelta(days=2)
        )

        with pytest.raises(ValueError) as exc_info:
            await service.crear_envio(shipment_data)

        assert "no encontrado" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_crear_envio_excede_capacidad(self, service, sample_transportista, sample_locations):
        """Debe fallar si el peso excede la capacidad"""
        transportista = await service.crear_transportista(sample_transportista)
        origin, destination = sample_locations

        shipment_data = ShipmentCreate(
            order_id="order-123",
            transportista_id=transportista.id,
            origin=origin,
            destination=destination,
            weight_kg=2000.0,  # Excede 1000kg
            estimated_delivery=datetime.now() + timedelta(days=2)
        )

        with pytest.raises(ValueError) as exc_info:
            await service.crear_envio(shipment_data)

        assert "excede capacidad" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_tracking(self, service, sample_transportista, sample_locations):
        """Debe obtener información de tracking"""
        transportista = await service.crear_transportista(sample_transportista)
        origin, destination = sample_locations

        shipment_data = ShipmentCreate(
            order_id="order-123",
            transportista_id=transportista.id,
            origin=origin,
            destination=destination,
            weight_kg=15.5,
            estimated_delivery=datetime.now() + timedelta(days=2)
        )

        shipment = await service.crear_envio(shipment_data)
        tracking = await service.tracking(shipment.tracking_number)

        assert tracking is not None
        assert tracking.tracking_number == shipment.tracking_number
        assert tracking.status == "pending"
        assert len(tracking.history) == 1

    @pytest.mark.asyncio
    async def test_tracking_numero_invalido(self, service):
        """Debe retornar None para tracking number inválido"""
        tracking = await service.tracking("INVALID-123")
        assert tracking is None

    @pytest.mark.asyncio
    async def test_actualizar_estado_envio(self, service, sample_transportista, sample_locations):
        """Debe actualizar el estado del envío"""
        transportista = await service.crear_transportista(sample_transportista)
        origin, destination = sample_locations

        shipment_data = ShipmentCreate(
            order_id="order-123",
            transportista_id=transportista.id,
            origin=origin,
            destination=destination,
            weight_kg=15.5,
            estimated_delivery=datetime.now() + timedelta(days=2)
        )

        shipment = await service.crear_envio(shipment_data)

        update = UpdateShipmentStatus(
            status="in_transit",
            location="Centro de distribución Madrid",
            notes="En camino"
        )

        updated = await service.actualizar_estado_envio(shipment.tracking_number, update)

        assert updated.status == "in_transit"
        assert len(updated.history) == 2
        assert updated.history[1].location == "Centro de distribución Madrid"

    @pytest.mark.asyncio
    async def test_actualizar_estado_delivered(self, service, sample_transportista, sample_locations):
        """Debe marcar fecha de entrega cuando estado es delivered"""
        transportista = await service.crear_transportista(sample_transportista)
        origin, destination = sample_locations

        shipment_data = ShipmentCreate(
            order_id="order-123",
            transportista_id=transportista.id,
            origin=origin,
            destination=destination,
            weight_kg=15.5,
            estimated_delivery=datetime.now() + timedelta(days=2)
        )

        shipment = await service.crear_envio(shipment_data)

        update = UpdateShipmentStatus(
            status="delivered",
            location="Dirección del cliente",
            notes="Entregado"
        )

        updated = await service.actualizar_estado_envio(shipment.tracking_number, update)

        assert updated.status == "delivered"
        assert updated.actual_delivery is not None

    @pytest.mark.asyncio
    async def test_listar_envios(self, service, sample_transportista, sample_locations):
        """Debe listar envíos"""
        transportista = await service.crear_transportista(sample_transportista)
        origin, destination = sample_locations

        # Crear varios envíos
        for i in range(3):
            shipment_data = ShipmentCreate(
                order_id=f"order-{i}",
                transportista_id=transportista.id,
                origin=origin,
                destination=destination,
                weight_kg=10.0,
                estimated_delivery=datetime.now() + timedelta(days=2)
            )
            await service.crear_envio(shipment_data)

        envios = await service.listar_envios()
        assert len(envios) == 3

    @pytest.mark.asyncio
    async def test_listar_envios_filtro_transportista(self, service, sample_locations):
        """Debe filtrar envíos por transportista"""
        origin, destination = sample_locations

        # Crear dos transportistas
        transp1 = await service.crear_transportista(
            TransportistaCreate(
                nombre="Transportista 1",
                rut="11111111-1",
                telefono="+56911111111",
                email="t1@test.com",
                direccion="Calle Principal 123",
                tipo_vehiculo="furgon",
                capacidad_kg=1000.0
            )
        )

        transp2 = await service.crear_transportista(
            TransportistaCreate(
                nombre="Transportista 2",
                rut="22222222-2",
                telefono="+56922222222",
                email="t2@test.com",
                direccion="Avenida Industrial 456",
                tipo_vehiculo="camion",
                capacidad_kg=2000.0
            )
        )

        # Crear envíos
        await service.crear_envio(ShipmentCreate(
            order_id="order-1",
            transportista_id=transp1.id,
            origin=origin,
            destination=destination,
            weight_kg=10.0,
            estimated_delivery=datetime.now() + timedelta(days=2)
        ))

        await service.crear_envio(ShipmentCreate(
            order_id="order-2",
            transportista_id=transp2.id,
            origin=origin,
            destination=destination,
            weight_kg=20.0,
            estimated_delivery=datetime.now() + timedelta(days=2)
        ))

        envios_transp1 = await service.listar_envios(transportista_id=transp1.id)
        assert len(envios_transp1) == 1
        assert envios_transp1[0].transportista_id == transp1.id

    @pytest.mark.asyncio
    async def test_obtener_envios_por_orden(self, service, sample_transportista, sample_locations):
        """Debe obtener envíos por ID de orden"""
        transportista = await service.crear_transportista(sample_transportista)
        origin, destination = sample_locations

        shipment_data = ShipmentCreate(
            order_id="order-specific",
            transportista_id=transportista.id,
            origin=origin,
            destination=destination,
            weight_kg=15.5,
            estimated_delivery=datetime.now() + timedelta(days=2)
        )

        await service.crear_envio(shipment_data)

        envios = await service.obtener_envios_por_orden("order-specific")
        assert len(envios) == 1
        assert envios[0].order_id == "order-specific"

