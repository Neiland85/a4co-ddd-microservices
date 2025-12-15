"""
Transportista Service
FastAPI microservice for transportista (carrier) management
"""

try:
    from .main import app  # type: ignore[attr-defined]
    from .models import TransportistaCreate, TransportistaResponse  # type: ignore[attr-defined]
    from .service import TransportistaService  # type: ignore[attr-defined]
except ImportError:  # pragma: no cover - fallback for direct module execution
    from main import app  # type: ignore
    from models import TransportistaCreate, TransportistaResponse  # type: ignore
    from service import TransportistaService  # type: ignore

__version__ = "1.0.0"
__all__ = ["app", "TransportistaCreate", "TransportistaResponse", "TransportistaService"]