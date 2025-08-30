#!/usr/bin/env python3
"""
Módulo para calcular la distancia aproximada entre dos puntos GPS
utilizando la fórmula del Haversine.

La fórmula de Haversine permite calcular la distancia más corta entre dos puntos
en la superficie de una esfera dadas sus coordenadas de latitud y longitud.
"""

import math
from typing import Tuple


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calcula la distancia aproximada entre dos puntos GPS dados (latitud y longitud)
    utilizando la fórmula del Haversine.
    
    La fórmula de Haversine es una ecuación importante en navegación que proporciona
    distancias de gran círculo entre dos puntos en una esfera a partir de sus latitudes
    y longitudes.
    
    Args:
        lat1 (float): Latitud del primer punto en grados decimales
        lon1 (float): Longitud del primer punto en grados decimales
        lat2 (float): Latitud del segundo punto en grados decimales
        lon2 (float): Longitud del segundo punto en grados decimales
    
    Returns:
        float: Distancia entre los dos puntos en kilómetros
    
    Raises:
        ValueError: Si las coordenadas están fuera del rango válido
    
    Examples:
        >>> # Distancia entre Madrid y Barcelona
        >>> madrid_lat, madrid_lon = 40.4168, -3.7038
        >>> barcelona_lat, barcelona_lon = 41.3851, 2.1734
        >>> distance = haversine_distance(madrid_lat, madrid_lon, barcelona_lat, barcelona_lon)
        >>> print(f"Distancia: {distance:.2f} km")
        Distancia: 504.64 km
        
        >>> # Distancia entre dos puntos muy cercanos
        >>> dist = haversine_distance(40.0, -3.0, 40.001, -3.001)
        >>> print(f"Distancia corta: {dist:.3f} km")
        Distancia corta: 0.134 km
    """
    # Validar coordenadas
    if not (-90 <= lat1 <= 90) or not (-90 <= lat2 <= 90):
        raise ValueError("La latitud debe estar entre -90 y 90 grados")
    
    if not (-180 <= lon1 <= 180) or not (-180 <= lon2 <= 180):
        raise ValueError("La longitud debe estar entre -180 y 180 grados")
    
    # Radio de la Tierra en kilómetros
    R = 6371.0
    
    # Convertir grados a radianes
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    # Diferencias en radianes
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    # Fórmula de Haversine
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2) ** 2)
    
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    # Distancia en kilómetros
    distance = R * c
    
    return distance


def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calcula la distancia entre dos puntos GPS en metros.
    
    Args:
        lat1 (float): Latitud del primer punto en grados decimales
        lon1 (float): Longitud del primer punto en grados decimales
        lat2 (float): Latitud del segundo punto en grados decimales
        lon2 (float): Longitud del segundo punto en grados decimales
    
    Returns:
        float: Distancia entre los dos puntos en metros
    """
    return haversine_distance(lat1, lon1, lat2, lon2) * 1000


def calculate_gps_distance(point1: Tuple[float, float], point2: Tuple[float, float]) -> float:
    """
    Interfaz alternativa que acepta puntos como tuplas (lat, lon).
    
    Args:
        point1 (Tuple[float, float]): Primer punto como tupla (latitud, longitud)
        point2 (Tuple[float, float]): Segundo punto como tupla (latitud, longitud)
    
    Returns:
        float: Distancia entre los dos puntos en kilómetros
    
    Examples:
        >>> madrid = (40.4168, -3.7038)
        >>> barcelona = (41.3851, 2.1734)
        >>> distance = calculate_gps_distance(madrid, barcelona)
        >>> print(f"Distancia: {distance:.2f} km")
        Distancia: 504.64 km
    """
    lat1, lon1 = point1
    lat2, lon2 = point2
    return haversine_distance(lat1, lon1, lat2, lon2)


if __name__ == "__main__":
    # Ejemplos de uso
    print("=== Calculadora de Distancias GPS con Fórmula de Haversine ===")
    print()
    
    # Ejemplo 1: Madrid - Barcelona
    madrid_lat, madrid_lon = 40.4168, -3.7038
    barcelona_lat, barcelona_lon = 41.3851, 2.1734
    
    distance_km = haversine_distance(madrid_lat, madrid_lon, barcelona_lat, barcelona_lon)
    distance_m = haversine_distance_meters(madrid_lat, madrid_lon, barcelona_lat, barcelona_lon)
    
    print(f"Distancia Madrid - Barcelona:")
    print(f"  En kilómetros: {distance_km:.2f} km")
    print(f"  En metros: {distance_m:.0f} m")
    print()
    
    # Ejemplo 2: Sevilla - Granada
    sevilla = (37.3891, -5.9845)
    granada = (37.1773, -3.5986)
    
    distance = calculate_gps_distance(sevilla, granada)
    print(f"Distancia Sevilla - Granada: {distance:.2f} km")
    print()
    
    # Ejemplo 3: Distancia corta
    punto1 = (36.7213, -4.4216)  # Málaga
    punto2 = (36.7214, -4.4217)  # Muy cerca de Málaga
    
    distance_short = haversine_distance(punto1[0], punto1[1], punto2[0], punto2[1])
    print(f"Distancia muy corta: {distance_short * 1000:.2f} metros")