from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator
import re


class TransportistaCreate(BaseModel):
    """Modelo de datos para crear un Transportista"""
    
    nombre: str = Field(
        ..., 
        min_length=2, 
        max_length=100, 
        description="Nombre completo del transportista"
    )
    rut: str = Field(
        ..., 
        min_length=8, 
        max_length=12, 
        description="RUT del transportista (formato: 12345678-9)"
    )
    telefono: str = Field(
        ..., 
        min_length=8, 
        max_length=15, 
        description="Número de teléfono del transportista"
    )
    email: str = Field(
        ..., 
        description="Correo electrónico del transportista"
    )
    direccion: str = Field(
        ..., 
        min_length=10, 
        max_length=200, 
        description="Dirección del transportista"
    )
    tipo_vehiculo: str = Field(
        ..., 
        description="Tipo de vehículo (camion, furgon, motocicleta, bicicleta)"
    )
    capacidad_kg: float = Field(
        ..., 
        gt=0, 
        le=50000, 
        description="Capacidad de carga en kilogramos"
    )
    activo: bool = Field(
        default=True, 
        description="Estado activo del transportista"
    )

    @field_validator('rut')
    @classmethod
    def validate_rut(cls, v):
        """Validar formato del RUT chileno"""
        if not re.match(r'^\d{7,8}-[\dkK]$', v):
            raise ValueError('RUT debe tener formato válido (ej: 12345678-9)')
        return v.upper()

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        """Validar formato del email"""
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, v):
            raise ValueError('Email debe tener formato válido')
        return v.lower()

    @field_validator('telefono')
    @classmethod
    def validate_telefono(cls, v):
        """Validar formato del teléfono"""
        # Remover espacios y caracteres especiales
        clean_phone = re.sub(r'[^\d+]', '', v)
        if not re.match(r'^(\+56)?[0-9]{8,9}$', clean_phone):
            raise ValueError('Teléfono debe tener formato válido chileno')
        return clean_phone

    @field_validator('tipo_vehiculo')
    @classmethod
    def validate_tipo_vehiculo(cls, v):
        """Validar tipo de vehículo permitido"""
        tipos_permitidos = ['camion', 'furgon', 'motocicleta', 'bicicleta']
        if v.lower() not in tipos_permitidos:
            raise ValueError(f'Tipo de vehículo debe ser uno de: {", ".join(tipos_permitidos)}')
        return v.lower()


class TransportistaResponse(BaseModel):
    """Modelo de respuesta para Transportista"""
    
    id: str = Field(..., description="ID único del transportista")
    nombre: str
    rut: str
    telefono: str
    email: str
    direccion: str
    tipo_vehiculo: str
    capacidad_kg: float
    activo: bool
    fecha_creacion: datetime = Field(..., description="Fecha de creación del registro")
    fecha_actualizacion: Optional[datetime] = Field(None, description="Fecha de última actualización")


class TransportistaErrorResponse(BaseModel):
    """Modelo de respuesta para errores"""
    
    success: bool = False
    error: str = Field(..., description="Mensaje de error")
    code: str = Field(..., description="Código de error")
    details: Optional[dict] = Field(None, description="Detalles adicionales del error")


class TransportistaSuccessResponse(BaseModel):
    """Modelo de respuesta exitosa"""
    
    success: bool = True
    data: TransportistaResponse
    message: str = Field(..., description="Mensaje de éxito")