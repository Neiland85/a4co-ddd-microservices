#!/usr/bin/env python3
"""
Tests para el módulo de cálculo de distancias GPS usando la fórmula de Haversine.
"""

import unittest
import math
from utils.gps_distance import (
    haversine_distance,
    haversine_distance_meters,
    calculate_gps_distance
)


class TestHaversineDistance(unittest.TestCase):
    """Tests para las funciones de cálculo de distancia Haversine."""
    
    def setUp(self):
        """Configuración de datos de prueba."""
        # Coordenadas de ciudades españolas conocidas
        self.madrid = (40.4168, -3.7038)
        self.barcelona = (41.3851, 2.1734)
        self.sevilla = (37.3891, -5.9845)
        self.valencia = (39.4699, -0.3763)
        
        # Coordenadas para casos extremos
        self.north_pole = (90.0, 0.0)
        self.south_pole = (-90.0, 0.0)
        self.equator_0 = (0.0, 0.0)
        self.equator_180 = (0.0, 180.0)
    
    def test_same_coordinates(self):
        """Test que dos puntos iguales tienen distancia cero."""
        distance = haversine_distance(40.4168, -3.7038, 40.4168, -3.7038)
        self.assertAlmostEqual(distance, 0.0, places=10)
    
    def test_madrid_barcelona_distance(self):
        """Test de distancia conocida Madrid-Barcelona."""
        distance = haversine_distance(
            self.madrid[0], self.madrid[1],
            self.barcelona[0], self.barcelona[1]
        )
        # La distancia real Madrid-Barcelona es aproximadamente 504-505 km
        self.assertAlmostEqual(distance, 504.64, delta=1.0)
    
    def test_madrid_sevilla_distance(self):
        """Test de distancia conocida Madrid-Sevilla."""
        distance = haversine_distance(
            self.madrid[0], self.madrid[1],
            self.sevilla[0], self.sevilla[1]
        )
        # La distancia real Madrid-Sevilla es aproximadamente 391 km
        self.assertAlmostEqual(distance, 391.56, delta=2.0)
    
    def test_valencia_barcelona_distance(self):
        """Test de distancia conocida Valencia-Barcelona."""
        distance = haversine_distance(
            self.valencia[0], self.valencia[1],
            self.barcelona[0], self.barcelona[1]
        )
        # La distancia real Valencia-Barcelona es aproximadamente 303 km
        self.assertAlmostEqual(distance, 303.17, delta=2.0)
    
    def test_antipodal_points(self):
        """Test de puntos antípodas (máxima distancia en la Tierra)."""
        # Polos norte y sur
        distance = haversine_distance(
            self.north_pole[0], self.north_pole[1],
            self.south_pole[0], self.south_pole[1]
        )
        # La distancia entre polos es la mitad de la circunferencia terrestre
        expected_distance = math.pi * 6371  # ~20015 km
        self.assertAlmostEqual(distance, expected_distance, delta=1.0)
    
    def test_equator_opposite_sides(self):
        """Test de puntos opuestos en el ecuador."""
        distance = haversine_distance(
            self.equator_0[0], self.equator_0[1],
            self.equator_180[0], self.equator_180[1]
        )
        # La distancia debería ser la mitad de la circunferencia terrestre
        expected_distance = math.pi * 6371  # ~20015 km
        self.assertAlmostEqual(distance, expected_distance, delta=1.0)
    
    def test_small_distances(self):
        """Test de distancias muy pequeñas."""
        # Puntos muy cercanos (diferencia de 0.001 grados)
        lat1, lon1 = 40.0, -3.0
        lat2, lon2 = 40.001, -3.001
        
        distance = haversine_distance(lat1, lon1, lat2, lon2)
        
        # Distancia aproximada: ~134 metros = 0.134 km
        self.assertAlmostEqual(distance, 0.134, delta=0.01)
    
    def test_distance_in_meters(self):
        """Test de función que retorna distancia en metros."""
        distance_km = haversine_distance(
            self.madrid[0], self.madrid[1],
            self.barcelona[0], self.barcelona[1]
        )
        distance_m = haversine_distance_meters(
            self.madrid[0], self.madrid[1],
            self.barcelona[0], self.barcelona[1]
        )
        
        self.assertAlmostEqual(distance_m, distance_km * 1000, places=5)
    
    def test_tuple_interface(self):
        """Test de interfaz que acepta tuplas."""
        distance_individual = haversine_distance(
            self.madrid[0], self.madrid[1],
            self.barcelona[0], self.barcelona[1]
        )
        distance_tuple = calculate_gps_distance(self.madrid, self.barcelona)
        
        self.assertAlmostEqual(distance_individual, distance_tuple, places=10)
    
    def test_coordinate_validation(self):
        """Test de validación de coordenadas."""
        # Latitud fuera de rango
        with self.assertRaises(ValueError):
            haversine_distance(91.0, 0.0, 0.0, 0.0)
        
        with self.assertRaises(ValueError):
            haversine_distance(-91.0, 0.0, 0.0, 0.0)
        
        # Longitud fuera de rango
        with self.assertRaises(ValueError):
            haversine_distance(0.0, 181.0, 0.0, 0.0)
        
        with self.assertRaises(ValueError):
            haversine_distance(0.0, -181.0, 0.0, 0.0)
    
    def test_symmetric_distance(self):
        """Test de que la distancia es simétrica (A->B = B->A)."""
        distance_ab = haversine_distance(
            self.madrid[0], self.madrid[1],
            self.barcelona[0], self.barcelona[1]
        )
        distance_ba = haversine_distance(
            self.barcelona[0], self.barcelona[1],
            self.madrid[0], self.madrid[1]
        )
        
        self.assertAlmostEqual(distance_ab, distance_ba, places=10)
    
    def test_triangle_inequality(self):
        """Test de desigualdad triangular: d(A,C) <= d(A,B) + d(B,C)."""
        # Madrid -> Barcelona
        d_madrid_barcelona = haversine_distance(
            self.madrid[0], self.madrid[1],
            self.barcelona[0], self.barcelona[1]
        )
        
        # Madrid -> Valencia
        d_madrid_valencia = haversine_distance(
            self.madrid[0], self.madrid[1],
            self.valencia[0], self.valencia[1]
        )
        
        # Valencia -> Barcelona
        d_valencia_barcelona = haversine_distance(
            self.valencia[0], self.valencia[1],
            self.barcelona[0], self.barcelona[1]
        )
        
        # La distancia directa debe ser menor o igual que el camino indirecto
        self.assertLessEqual(d_madrid_barcelona, d_madrid_valencia + d_valencia_barcelona)
    
    def test_boundary_coordinates(self):
        """Test de coordenadas en los límites."""
        # Coordenadas válidas en los límites
        valid_coords = [
            (90.0, 180.0),   # Esquina noreste
            (90.0, -180.0),  # Esquina noroeste
            (-90.0, 180.0),  # Esquina sureste
            (-90.0, -180.0), # Esquina suroeste
            (0.0, 0.0),      # Centro
        ]
        
        for coord in valid_coords:
            # No debería lanzar excepción
            distance = haversine_distance(coord[0], coord[1], 0.0, 0.0)
            self.assertIsInstance(distance, float)
            self.assertGreaterEqual(distance, 0.0)


if __name__ == '__main__':
    # Ejecutar tests
    unittest.main(verbosity=2)