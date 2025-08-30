#!/usr/bin/env python3
"""
Ejemplos de uso del módulo de cálculo de distancias GPS.

Este script demuestra diferentes formas de usar las funciones de distancia
implementadas con la fórmula de Haversine.
"""

import sys
import os

# Agregar el directorio padre al path para importar el módulo
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.gps_distance import (
    haversine_distance,
    haversine_distance_meters,
    calculate_gps_distance
)


def ejemplo_ciudades_espanolas():
    """Ejemplos con ciudades españolas."""
    print("🇪🇸 Distancias entre ciudades españolas:")
    print("=" * 50)
    
    ciudades = {
        'Madrid': (40.4168, -3.7038),
        'Barcelona': (41.3851, 2.1734),
        'Sevilla': (37.3891, -5.9845),
        'Valencia': (39.4699, -0.3763),
        'Bilbao': (43.2627, -2.9253),
        'Málaga': (36.7213, -4.4216),
        'Zaragoza': (41.6560, -0.8773)
    }
    
    # Calcular distancias desde Madrid
    print("\n📍 Distancias desde Madrid:")
    madrid = ciudades['Madrid']
    
    for ciudad, coords in ciudades.items():
        if ciudad != 'Madrid':
            distancia = haversine_distance(madrid[0], madrid[1], coords[0], coords[1])
            print(f"  Madrid → {ciudad}: {distancia:.2f} km")
    
    # Algunos casos específicos
    print("\n📍 Otras distancias interesantes:")
    
    # Barcelona - Valencia (costa mediterránea)
    barcelona = ciudades['Barcelona']
    valencia = ciudades['Valencia']
    dist_bcn_vlc = calculate_gps_distance(barcelona, valencia)
    print(f"  Barcelona → Valencia: {dist_bcn_vlc:.2f} km")
    
    # Bilbao - Sevilla (norte a sur)
    bilbao = ciudades['Bilbao']
    sevilla = ciudades['Sevilla']
    dist_bil_sev = haversine_distance(bilbao[0], bilbao[1], sevilla[0], sevilla[1])
    print(f"  Bilbao → Sevilla: {dist_bil_sev:.2f} km")


def ejemplo_distancias_cortas():
    """Ejemplos con distancias cortas."""
    print("\n🔍 Ejemplos de distancias cortas:")
    print("=" * 40)
    
    # Puntos muy cercanos en Madrid
    centro_madrid = (40.4168, -3.7038)  # Puerta del Sol
    retiro = (40.4152, -3.6844)         # Parque del Retiro
    
    distancia_m = haversine_distance_meters(
        centro_madrid[0], centro_madrid[1],
        retiro[0], retiro[1]
    )
    
    print(f"  Puerta del Sol → Parque del Retiro: {distancia_m:.0f} metros")
    
    # Diferencia de 1 grado
    punto_base = (40.0, -3.0)
    punto_1_grado = (41.0, -3.0)  # 1 grado al norte
    
    dist_1_grado = haversine_distance(
        punto_base[0], punto_base[1],
        punto_1_grado[0], punto_1_grado[1]
    )
    
    print(f"  Diferencia de 1° de latitud: {dist_1_grado:.2f} km")


def ejemplo_casos_extremos():
    """Ejemplos con casos extremos."""
    print("\n🌍 Casos extremos y especiales:")
    print("=" * 40)
    
    # Antípodas (máxima distancia posible)
    polo_norte = (90.0, 0.0)
    polo_sur = (-90.0, 0.0)
    
    distancia_polos = haversine_distance(
        polo_norte[0], polo_norte[1],
        polo_sur[0], polo_sur[1]
    )
    
    print(f"  Polo Norte → Polo Sur: {distancia_polos:.2f} km")
    
    # Puntos en el ecuador en lados opuestos
    ecuador_0 = (0.0, 0.0)
    ecuador_180 = (0.0, 180.0)
    
    distancia_ecuador = haversine_distance(
        ecuador_0[0], ecuador_0[1],
        ecuador_180[0], ecuador_180[1]
    )
    
    print(f"  Ecuador 0° → Ecuador 180°: {distancia_ecuador:.2f} km")
    
    # Mismo punto (distancia cero)
    mismo_punto = haversine_distance(40.0, -3.0, 40.0, -3.0)
    print(f"  Mismo punto: {mismo_punto:.10f} km")


def ejemplo_validacion_coordenadas():
    """Ejemplos de validación de coordenadas."""
    print("\n✅ Ejemplos de validación:")
    print("=" * 35)
    
    # Coordenadas válidas
    coordenadas_validas = [
        (0.0, 0.0, "Ecuador y Meridiano de Greenwich"),
        (90.0, 0.0, "Polo Norte"),
        (-90.0, 0.0, "Polo Sur"),
        (45.0, 180.0, "Límite este"),
        (45.0, -180.0, "Límite oeste"),
    ]
    
    print("  Coordenadas válidas:")
    for lat, lon, descripcion in coordenadas_validas:
        try:
            # Calcular distancia desde Madrid como referencia
            madrid = (40.4168, -3.7038)
            distancia = haversine_distance(madrid[0], madrid[1], lat, lon)
            print(f"    ✓ {descripcion}: ({lat}, {lon}) - {distancia:.2f} km desde Madrid")
        except ValueError as e:
            print(f"    ✗ Error: {e}")
    
    # Coordenadas inválidas
    coordenadas_invalidas = [
        (91.0, 0.0, "Latitud > 90°"),
        (-91.0, 0.0, "Latitud < -90°"),
        (0.0, 181.0, "Longitud > 180°"),
        (0.0, -181.0, "Longitud < -180°"),
    ]
    
    print("\n  Coordenadas inválidas:")
    for lat, lon, descripcion in coordenadas_invalidas:
        try:
            distancia = haversine_distance(lat, lon, 0.0, 0.0)
            print(f"    ✗ {descripcion}: ({lat}, {lon}) - No debería funcionar")
        except ValueError as e:
            print(f"    ✓ {descripcion}: ({lat}, {lon}) - Error capturado: {e}")


def ejemplo_comparacion_interfaces():
    """Comparación entre diferentes interfaces de la función."""
    print("\n🔄 Comparación de interfaces:")
    print("=" * 40)
    
    madrid = (40.4168, -3.7038)
    barcelona = (41.3851, 2.1734)
    
    # Método 1: Parámetros individuales
    dist1 = haversine_distance(madrid[0], madrid[1], barcelona[0], barcelona[1])
    
    # Método 2: Tuplas
    dist2 = calculate_gps_distance(madrid, barcelona)
    
    # Método 3: En metros
    dist3_m = haversine_distance_meters(madrid[0], madrid[1], barcelona[0], barcelona[1])
    
    print(f"  Parámetros individuales: {dist1:.6f} km")
    print(f"  Interface con tuplas:    {dist2:.6f} km")
    print(f"  Resultado en metros:     {dist3_m:.2f} m")
    print(f"  ¿Son iguales? {abs(dist1 - dist2) < 1e-10 and abs(dist1 * 1000 - dist3_m) < 1e-6}")


def main():
    """Función principal que ejecuta todos los ejemplos."""
    print("🛰️  CALCULADORA DE DISTANCIAS GPS CON FÓRMULA DE HAVERSINE")
    print("=" * 65)
    print("Este script demuestra el uso del módulo utils.gps_distance")
    print("para calcular distancias entre coordenadas GPS.\n")
    
    try:
        ejemplo_ciudades_espanolas()
        ejemplo_distancias_cortas()
        ejemplo_casos_extremos()
        ejemplo_validacion_coordenadas()
        ejemplo_comparacion_interfaces()
        
        print("\n" + "=" * 65)
        print("✅ Todos los ejemplos se ejecutaron correctamente!")
        print("\n💡 Notas:")
        print("  - La fórmula de Haversine asume una Tierra esférica")
        print("  - Para aplicaciones de alta precisión, considere WGS84")
        print("  - Las distancias son aproximadas (error típico < 0.5%)")
        
    except Exception as e:
        print(f"\n❌ Error durante la ejecución: {e}")
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())