from typing import Dict, List, Optional
from datetime import datetime, timedelta
import uuid
import random
from models import (
    TransportistaCreate, 
    TransportistaResponse,
    ShipmentCreate,
    ShipmentResponse,
    ShipmentStatusHistory,
    TrackingResponse,
    UpdateShipmentStatus,
    ShipmentLocation
)


class TransportistaService:
    """Servicio para gestión de transportistas y envíos"""
    
    def __init__(self):
        # Simulación de base de datos en memoria
        # En producción esto sería una conexión a base de datos real
        self._transportistas: Dict[str, dict] = {}
        self._shipments: Dict[str, dict] = {}
        self._tracking_by_number: Dict[str, str] = {}  # tracking_number -> shipment_id
    
    async def crear_transportista(self, transportista_data: TransportistaCreate) -> TransportistaResponse:
        """Crear un nuevo transportista"""
        
        # Verificar si el RUT ya existe
        if await self._rut_existe(transportista_data.rut):
            raise ValueError(f"Ya existe un transportista con RUT {transportista_data.rut}")
        
        # Verificar si el email ya existe
        if await self._email_existe(transportista_data.email):
            raise ValueError(f"Ya existe un transportista con email {transportista_data.email}")
        
        # Generar ID único
        transportista_id = str(uuid.uuid4())
        
        # Crear el transportista
        transportista = {
            "id": transportista_id,
            "nombre": transportista_data.nombre,
            "rut": transportista_data.rut,
            "telefono": transportista_data.telefono,
            "email": transportista_data.email,
            "direccion": transportista_data.direccion,
            "tipo_vehiculo": transportista_data.tipo_vehiculo,
            "capacidad_kg": transportista_data.capacidad_kg,
            "activo": transportista_data.activo,
            "fecha_creacion": datetime.now(),
            "fecha_actualizacion": None
        }
        
        # Guardar en "base de datos"
        self._transportistas[transportista_id] = transportista
        
        return TransportistaResponse(**transportista)
    
    async def obtener_transportista(self, transportista_id: str) -> Optional[TransportistaResponse]:
        """Obtener un transportista por ID"""
        transportista = self._transportistas.get(transportista_id)
        if transportista:
            return TransportistaResponse(**transportista)
        return None
    
    async def listar_transportistas(self, activo: Optional[bool] = None) -> List[TransportistaResponse]:
        """Listar todos los transportistas"""
        transportistas = list(self._transportistas.values())
        
        if activo is not None:
            transportistas = [t for t in transportistas if t["activo"] == activo]
        
        return [TransportistaResponse(**t) for t in transportistas]
    
    async def _rut_existe(self, rut: str) -> bool:
        """Verificar si un RUT ya existe"""
        for transportista in self._transportistas.values():
            if transportista["rut"] == rut:
                return True
        return False
    
    async def _email_existe(self, email: str) -> bool:
        """Verificar si un email ya existe"""
        for transportista in self._transportistas.values():
            if transportista["email"] == email:
                return True
        return False
    
    # --- SHIPMENT METHODS ---
    
    def _generate_tracking_number(self) -> str:
        """Generar número de tracking único"""
        prefix = "TR"
        timestamp = datetime.now().strftime("%Y%m%d")
        random_part = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        return f"{prefix}{timestamp}{random_part}"
    
    async def crear_envio(self, shipment_data: ShipmentCreate) -> ShipmentResponse:
        """Crear un nuevo envío"""
        
        # Verificar que el transportista existe
        transportista = self._transportistas.get(shipment_data.transportista_id)
        if not transportista:
            raise ValueError(f"Transportista {shipment_data.transportista_id} no encontrado")
        
        # Verificar capacidad
        if shipment_data.weight_kg > transportista["capacidad_kg"]:
            raise ValueError(
                f"Peso excede capacidad del vehículo "
                f"({shipment_data.weight_kg}kg > {transportista['capacidad_kg']}kg)"
            )
        
        # Generar ID y tracking number
        shipment_id = str(uuid.uuid4())
        tracking_number = self._generate_tracking_number()
        
        # Crear historial inicial
        now = datetime.now()
        history = [
            {
                "status": "pending",
                "location": shipment_data.origin.city,
                "timestamp": now,
                "notes": "Envío creado y asignado a transportista"
            }
        ]
        
        # Crear el envío
        shipment = {
            "id": shipment_id,
            "tracking_number": tracking_number,
            "order_id": shipment_data.order_id,
            "transportista_id": shipment_data.transportista_id,
            "transportista_nombre": transportista["nombre"],
            "status": "pending",
            "origin": shipment_data.origin.model_dump(),
            "destination": shipment_data.destination.model_dump(),
            "current_location": shipment_data.origin.model_dump(),
            "weight_kg": shipment_data.weight_kg,
            "estimated_delivery": shipment_data.estimated_delivery,
            "actual_delivery": None,
            "history": history,
            "special_instructions": shipment_data.special_instructions,
            "created_at": now,
            "updated_at": now
        }
        
        # Guardar
        self._shipments[shipment_id] = shipment
        self._tracking_by_number[tracking_number] = shipment_id
        
        return ShipmentResponse(**shipment)
    
    async def obtener_envio(self, shipment_id: str) -> Optional[ShipmentResponse]:
        """Obtener un envío por ID"""
        shipment = self._shipments.get(shipment_id)
        if shipment:
            return ShipmentResponse(**shipment)
        return None
    
    async def tracking(self, tracking_number: str) -> Optional[TrackingResponse]:
        """Obtener información de tracking"""
        shipment_id = self._tracking_by_number.get(tracking_number)
        if not shipment_id:
            return None
        
        shipment = self._shipments.get(shipment_id)
        if not shipment:
            return None
        
        return TrackingResponse(
            tracking_number=tracking_number,
            status=shipment["status"],
            estimated_delivery=shipment["estimated_delivery"],
            actual_delivery=shipment.get("actual_delivery"),
            current_location=shipment.get("current_location", {}).get("address"),
            history=[ShipmentStatusHistory(**h) for h in shipment["history"]],
            last_update=shipment["updated_at"]
        )
    
    async def actualizar_estado_envio(
        self, 
        tracking_number: str, 
        update_data: UpdateShipmentStatus
    ) -> Optional[ShipmentResponse]:
        """Actualizar estado de un envío"""
        shipment_id = self._tracking_by_number.get(tracking_number)
        if not shipment_id:
            raise ValueError(f"Tracking number {tracking_number} no encontrado")
        
        shipment = self._shipments.get(shipment_id)
        if not shipment:
            raise ValueError(f"Envío no encontrado")
        
        # Actualizar estado
        now = datetime.now()
        shipment["status"] = update_data.status
        shipment["updated_at"] = now
        
        # Agregar al historial
        history_entry = {
            "status": update_data.status,
            "location": update_data.location,
            "timestamp": now,
            "notes": update_data.notes
        }
        shipment["history"].append(history_entry)
        
        # Si está entregado, actualizar fecha
        if update_data.status == "delivered":
            shipment["actual_delivery"] = now
        
        return ShipmentResponse(**shipment)
    
    async def listar_envios(
        self, 
        transportista_id: Optional[str] = None,
        status: Optional[str] = None
    ) -> List[ShipmentResponse]:
        """Listar envíos con filtros opcionales"""
        shipments = list(self._shipments.values())
        
        if transportista_id:
            shipments = [s for s in shipments if s["transportista_id"] == transportista_id]
        
        if status:
            shipments = [s for s in shipments if s["status"] == status]
        
        return [ShipmentResponse(**s) for s in shipments]
    
    async def obtener_envios_por_orden(self, order_id: str) -> List[ShipmentResponse]:
        """Obtener envíos de una orden específica"""
        shipments = [
            s for s in self._shipments.values() 
            if s["order_id"] == order_id
        ]
        return [ShipmentResponse(**s) for s in shipments]