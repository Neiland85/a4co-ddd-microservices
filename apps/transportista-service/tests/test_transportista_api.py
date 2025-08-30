import pytest
from fastapi.testclient import TestClient
from datetime import datetime
import sys
import os

# Agregar el directorio padre al path para importar módulos
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)


class TestTransportistaAPI:
    """Tests para la API de Transportistas"""

    def test_health_check(self):
        """Test del endpoint de salud"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "transportista-service"
        assert "timestamp" in data

    def test_crear_transportista_exitoso(self):
        """Test de creación exitosa de transportista"""
        transportista_data = {
            "nombre": "Juan Pérez",
            "rut": "12345678-9",
            "telefono": "+56912345678",
            "email": "juan.perez@example.com",
            "direccion": "Av. Libertador 1234, Santiago",
            "tipo_vehiculo": "camion",
            "capacidad_kg": 5000.0,
            "activo": True
        }

        response = client.post("/transportistas", json=transportista_data)
        
        assert response.status_code == 201
        data = response.json()
        
        # Verificar estructura de respuesta
        assert data["success"] is True
        assert "data" in data
        assert "message" in data
        assert data["message"] == "Transportista creado exitosamente"
        
        # Verificar datos del transportista
        transportista = data["data"]
        assert transportista["nombre"] == transportista_data["nombre"]
        assert transportista["rut"] == transportista_data["rut"]
        assert transportista["email"] == transportista_data["email"].lower()
        assert transportista["tipo_vehiculo"] == transportista_data["tipo_vehiculo"]
        assert "id" in transportista
        assert "fecha_creacion" in transportista

    def test_crear_transportista_rut_invalido(self):
        """Test de validación de RUT inválido"""
        transportista_data = {
            "nombre": "Ana García",
            "rut": "invalid-rut",
            "telefono": "+56987654321",
            "email": "ana.garcia@example.com",
            "direccion": "Av. Providencia 5678, Santiago",
            "tipo_vehiculo": "furgon",
            "capacidad_kg": 2000.0
        }

        response = client.post("/transportistas", json=transportista_data)
        
        assert response.status_code == 422
        data = response.json()
        # Check that validation error occurred - could be in detail or error field
        assert "detail" in data or "error" in data

    def test_crear_transportista_email_invalido(self):
        """Test de validación de email inválido"""
        transportista_data = {
            "nombre": "Carlos López",
            "rut": "87654321-0",
            "telefono": "+56911111111",
            "email": "email-invalido",
            "direccion": "Calle Falsa 123, Valparaíso",
            "tipo_vehiculo": "motocicleta",
            "capacidad_kg": 50.0
        }

        response = client.post("/transportistas", json=transportista_data)
        
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data or "error" in data

    def test_crear_transportista_tipo_vehiculo_invalido(self):
        """Test de validación de tipo de vehículo inválido"""
        transportista_data = {
            "nombre": "María Silva",
            "rut": "11111111-1",
            "telefono": "+56922222222",
            "email": "maria.silva@example.com",
            "direccion": "Av. Las Condes 9999, Santiago",
            "tipo_vehiculo": "avion",  # Tipo inválido
            "capacidad_kg": 1000.0
        }

        response = client.post("/transportistas", json=transportista_data)
        
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data or "error" in data

    def test_crear_transportista_capacidad_negativa(self):
        """Test de validación de capacidad negativa"""
        transportista_data = {
            "nombre": "Pedro Rodríguez",
            "rut": "22222222-2",
            "telefono": "+56933333333",
            "email": "pedro.rodriguez@example.com",
            "direccion": "Av. Pajaritos 777, Santiago",
            "tipo_vehiculo": "bicicleta",
            "capacidad_kg": -10.0  # Capacidad inválida
        }

        response = client.post("/transportistas", json=transportista_data)
        
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data or "error" in data

    def test_crear_transportista_campos_requeridos(self):
        """Test de validación de campos requeridos"""
        transportista_data = {
            "nombre": "Laura Martínez"
            # Faltan campos requeridos
        }

        response = client.post("/transportistas", json=transportista_data)
        
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data or "error" in data

    def test_crear_transportista_duplicado_rut(self):
        """Test de prevención de RUT duplicado"""
        transportista_data = {
            "nombre": "Primer Transportista",
            "rut": "99999999-9",
            "telefono": "+56944444444",
            "email": "primero@example.com",
            "direccion": "Primera Dirección 123",
            "tipo_vehiculo": "camion",
            "capacidad_kg": 8000.0
        }

        # Crear primer transportista
        response1 = client.post("/transportistas", json=transportista_data)
        assert response1.status_code == 201

        # Intentar crear segundo transportista con mismo RUT
        transportista_data2 = transportista_data.copy()
        transportista_data2["nombre"] = "Segundo Transportista"
        transportista_data2["email"] = "segundo@example.com"

        response2 = client.post("/transportistas", json=transportista_data2)
        assert response2.status_code == 400
        data = response2.json()
        assert "Ya existe un transportista con RUT" in data["detail"]["error"]

    def test_listar_transportistas(self):
        """Test de listado de transportistas"""
        response = client.get("/transportistas")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_obtener_transportista_inexistente(self):
        """Test de obtener transportista que no existe"""
        response = client.get("/transportistas/id-inexistente")
        assert response.status_code == 404
        data = response.json()
        assert "no encontrado" in data["detail"]["error"]

    def test_headers_respuesta(self):
        """Test de headers de respuesta"""
        response = client.get("/health")
        
        # Verificar headers esperados
        assert "X-Service" in response.headers
        assert response.headers["X-Service"] == "transportista-service"
        assert "X-Request-ID" in response.headers
        assert "X-Process-Time" in response.headers
        assert "Content-Type" in response.headers


if __name__ == "__main__":
    pytest.main([__file__])