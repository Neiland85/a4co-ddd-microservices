from fastapi import FastAPI, HTTPException, status, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError
from typing import List, Optional
import logging
import time
import uuid
import os

from models import (
    TransportistaCreate, 
    TransportistaResponse, 
    TransportistaSuccessResponse,
    TransportistaErrorResponse,
    ShipmentCreate,
    ShipmentResponse,
    TrackingResponse,
    UpdateShipmentStatus
)
from service import TransportistaService

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Crear instancia de FastAPI
app = FastAPI(
    title="Transportista Service API",
    description="API REST para gestión de transportistas en A4CO DDD Microservices",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instancia del servicio
transportista_service = TransportistaService()


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Middleware para agregar headers de respuesta y logging"""
    start_time = time.time()
    request_id = str(uuid.uuid4())
    
    # Log request
    logger.info(f"Request {request_id}: {request.method} {request.url}")
    
    response = await call_next(request)
    
    # Agregar headers de respuesta siguiendo patrones del proyecto
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    response.headers["X-Service"] = "transportista-service"
    response.headers["X-Request-ID"] = request_id
    response.headers["Content-Type"] = "application/json"
    
    logger.info(f"Response {request_id}: {response.status_code} in {process_time:.4f}s")
    
    return response


@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    """Manejo de errores de validación de Pydantic"""
    logger.error(f"Validation error: {exc}")
    
    error_details = []
    for error in exc.errors():
        error_details.append({
            "field": ".".join(str(x) for x in error["loc"]),
            "message": error["msg"],
            "type": error["type"]
        })
    
    error_response = TransportistaErrorResponse(
        error="Datos de entrada inválidos",
        code="VALIDATION_ERROR",
        details={"validation_errors": error_details}
    )
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=error_response.dict()
    )


@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    """Manejo de errores de lógica de negocio"""
    logger.error(f"Business logic error: {exc}")
    
    error_response = TransportistaErrorResponse(
        error=str(exc),
        code="BUSINESS_LOGIC_ERROR"
    )
    
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=error_response.dict()
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Manejo de errores generales"""
    logger.error(f"Unexpected error: {exc}", exc_info=True)
    
    error_response = TransportistaErrorResponse(
        error="Error interno del servidor",
        code="INTERNAL_SERVER_ERROR"
    )
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=error_response.dict()
    )


@app.get("/health", tags=["Health"])
async def health_check():
    """Endpoint de salud del servicio"""
    return {
        "status": "healthy",
        "service": "transportista-service",
        "version": "1.0.0",
        "timestamp": time.time()
    }


@app.post(
    "/transportistas",
    response_model=TransportistaSuccessResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Transportistas"],
    summary="Crear un nuevo transportista",
    description="Crea un nuevo transportista con validación completa de datos"
)
async def crear_transportista(transportista: TransportistaCreate):
    """
    Crear un nuevo transportista
    
    - **nombre**: Nombre completo del transportista (2-100 caracteres)
    - **rut**: RUT válido formato chileno (12345678-9)
    - **telefono**: Teléfono válido chileno
    - **email**: Email válido
    - **direccion**: Dirección completa (10-200 caracteres)
    - **tipo_vehiculo**: Tipo de vehículo (camion, furgon, motocicleta, bicicleta)
    - **capacidad_kg**: Capacidad de carga en kilogramos (> 0, <= 50000)
    - **activo**: Estado activo (opcional, default: true)
    """
    try:
        # Crear el transportista usando el servicio
        nuevo_transportista = await transportista_service.crear_transportista(transportista)
        
        # Respuesta exitosa
        response = TransportistaSuccessResponse(
            data=nuevo_transportista,
            message="Transportista creado exitosamente"
        )
        
        logger.info(f"Transportista creado: {nuevo_transportista.id}")
        
        return response
        
    except ValueError as e:
        # Error de lógica de negocio (RUT o email duplicado)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "error": str(e),
                "code": "DUPLICATE_DATA_ERROR"
            }
        )
    except Exception as e:
        # Error interno
        logger.error(f"Error creating transportista: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error": "Error interno del servidor",
                "code": "INTERNAL_SERVER_ERROR"
            }
        )


@app.get(
    "/transportistas/{transportista_id}",
    response_model=TransportistaResponse,
    tags=["Transportistas"],
    summary="Obtener transportista por ID",
    description="Obtiene los datos de un transportista específico"
)
async def obtener_transportista(transportista_id: str):
    """Obtener un transportista por su ID"""
    transportista = await transportista_service.obtener_transportista(transportista_id)
    
    if not transportista:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "success": False,
                "error": f"Transportista con ID {transportista_id} no encontrado",
                "code": "TRANSPORTISTA_NOT_FOUND"
            }
        )
    
    return transportista


@app.get(
    "/transportistas",
    response_model=List[TransportistaResponse],
    tags=["Transportistas"],
    summary="Listar transportistas",
    description="Lista todos los transportistas, opcionalmente filtrados por estado"
)
async def listar_transportistas(activo: Optional[bool] = None):
    """Listar transportistas con filtro opcional por estado activo"""
    transportistas = await transportista_service.listar_transportistas(activo=activo)
    return transportistas


# --- ENDPOINTS DE ENVÍOS Y TRACKING ---

@app.post(
    "/shipments",
    response_model=ShipmentResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Shipments"],
    summary="Crear un nuevo envío",
    description="Crea un nuevo envío y asigna un número de tracking"
)
async def crear_envio(shipment: ShipmentCreate):
    """
    Crear un nuevo envío con tracking
    
    - **order_id**: ID de la orden
    - **transportista_id**: ID del transportista asignado
    - **origin**: Ubicación de origen
    - **destination**: Ubicación de destino
    - **weight_kg**: Peso en kilogramos
    - **estimated_delivery**: Fecha estimada de entrega
    """
    try:
        nuevo_envio = await transportista_service.crear_envio(shipment)
        logger.info(f"Envío creado: {nuevo_envio.tracking_number}")
        return nuevo_envio
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "error": str(e),
                "code": "SHIPMENT_CREATION_ERROR"
            }
        )


@app.get(
    "/tracking/{tracking_number}",
    response_model=TrackingResponse,
    tags=["Tracking"],
    summary="Tracking de envío",
    description="Obtiene información de tracking de un envío"
)
async def obtener_tracking(tracking_number: str):
    """Obtener información de tracking por número"""
    tracking = await transportista_service.tracking(tracking_number)
    
    if not tracking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "success": False,
                "error": f"Tracking number {tracking_number} no encontrado",
                "code": "TRACKING_NOT_FOUND"
            }
        )
    
    return tracking


@app.put(
    "/tracking/{tracking_number}/status",
    response_model=ShipmentResponse,
    tags=["Tracking"],
    summary="Actualizar estado de envío",
    description="Actualiza el estado y ubicación de un envío"
)
async def actualizar_estado_envio(
    tracking_number: str,
    update_data: UpdateShipmentStatus
):
    """Actualizar estado de un envío en tránsito"""
    try:
        shipment = await transportista_service.actualizar_estado_envio(
            tracking_number, 
            update_data
        )
        logger.info(f"Estado actualizado: {tracking_number} -> {update_data.status}")
        return shipment
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "success": False,
                "error": str(e),
                "code": "SHIPMENT_UPDATE_ERROR"
            }
        )


@app.get(
    "/shipments",
    response_model=List[ShipmentResponse],
    tags=["Shipments"],
    summary="Listar envíos",
    description="Lista envíos con filtros opcionales"
)
async def listar_envios(
    transportista_id: Optional[str] = None,
    status: Optional[str] = None
):
    """Listar envíos con filtros opcionales"""
    shipments = await transportista_service.listar_envios(
        transportista_id=transportista_id,
        status=status
    )
    return shipments


@app.get(
    "/shipments/order/{order_id}",
    response_model=List[ShipmentResponse],
    tags=["Shipments"],
    summary="Obtener envíos de una orden",
    description="Obtiene todos los envíos asociados a una orden"
)
async def obtener_envios_por_orden(order_id: str):
    """Obtener envíos de una orden específica"""
    shipments = await transportista_service.obtener_envios_por_orden(order_id)
    return shipments


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "3008"))
    uvicorn.run(app, host="0.0.0.0", port=port)