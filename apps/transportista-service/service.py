from typing import Dict, List, Optional
from datetime import datetime
import uuid
from models import TransportistaCreate, TransportistaResponse


class TransportistaService:
    """Servicio para gestión de transportistas"""
    
    def __init__(self):
        # Simulación de base de datos en memoria
        # En producción esto sería una conexión a base de datos real
        self._transportistas: Dict[str, dict] = {}
    
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