"""
Transportista Service
FastAPI microservice for transportista (carrier) management
"""

from .main import app
from .models import TransportistaCreate, TransportistaResponse
from .service import TransportistaService

__version__ = "1.0.0"
__all__ = ["app", "TransportistaCreate", "TransportistaResponse", "TransportistaService"]