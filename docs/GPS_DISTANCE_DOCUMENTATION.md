# Calculadora de Distancias GPS - Fórmula de Haversine

Este módulo Python implementa el cálculo de distancia aproximada entre dos puntos GPS utilizando la fórmula de Haversine, cumpliendo con el requerimiento específico del proyecto.

## 📁 Archivos

- `utils/gps_distance.py` - Módulo principal con las funciones de cálculo
- `test_gps_distance.py` - Suite completa de tests
- `examples/gps_distance_examples.py` - Ejemplos de uso y demostraciones
- `docs/GPS_DISTANCE_DOCUMENTATION.md` - Esta documentación

## 🚀 Características

- **Implementación precisa** de la fórmula de Haversine
- **Validación robusta** de coordenadas de entrada
- **Múltiples interfaces** para diferentes casos de uso
- **Tests exhaustivos** con casos reales y extremos
- **Documentación completa** con ejemplos prácticos

## 📋 Funciones Principales

### `haversine_distance(lat1, lon1, lat2, lon2)`

Función principal que calcula la distancia entre dos puntos GPS.

**Parámetros:**
- `lat1, lon1` (float): Latitud y longitud del primer punto en grados decimales
- `lat2, lon2` (float): Latitud y longitud del segundo punto en grados decimales

**Retorna:**
- `float`: Distancia en kilómetros

**Ejemplo:**
```python
from utils.gps_distance import haversine_distance

# Distancia Madrid - Barcelona
madrid_lat, madrid_lon = 40.4168, -3.7038
barcelona_lat, barcelona_lon = 41.3851, 2.1734

distancia = haversine_distance(madrid_lat, madrid_lon, barcelona_lat, barcelona_lon)
print(f"Distancia: {distancia:.2f} km")  # Resultado: ~505.44 km
```

### `haversine_distance_meters(lat1, lon1, lat2, lon2)`

Variante que retorna la distancia en metros.

**Ejemplo:**
```python
distancia_m = haversine_distance_meters(madrid_lat, madrid_lon, barcelona_lat, barcelona_lon)
print(f"Distancia: {distancia_m:.0f} m")  # Resultado: ~505443 m
```

### `calculate_gps_distance(point1, point2)`

Interfaz alternativa que acepta puntos como tuplas.

**Parámetros:**
- `point1, point2` (Tuple[float, float]): Puntos como tuplas (latitud, longitud)

**Ejemplo:**
```python
madrid = (40.4168, -3.7038)
barcelona = (41.3851, 2.1734)

distancia = calculate_gps_distance(madrid, barcelona)
print(f"Distancia: {distancia:.2f} km")
```

## 🧮 Fórmula de Haversine

La implementación utiliza la fórmula estándar de Haversine:

```
a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
c = 2 ⋅ atan2( √a, √(1−a) )
d = R ⋅ c
```

Donde:
- φ es la latitud
- λ es la longitud
- R es el radio de la Tierra (6371 km)
- d es la distancia

## ✅ Validaciones

El módulo incluye validaciones robustas:

- **Latitud**: Debe estar entre -90° y 90°
- **Longitud**: Debe estar entre -180° y 180°
- **Tipos**: Se valida que las entradas sean numéricas

```python
# Esto lanzará ValueError
haversine_distance(91.0, 0.0, 0.0, 0.0)  # Latitud fuera de rango
```

## 🧪 Tests

Ejecutar la suite de tests:

```bash
python3 test_gps_distance.py
```

Los tests cubren:

- ✅ Distancias conocidas entre ciudades españolas
- ✅ Casos extremos (polos, antípodas)
- ✅ Distancias muy pequeñas
- ✅ Validación de coordenadas
- ✅ Propiedades matemáticas (simetría, desigualdad triangular)
- ✅ Casos límite y coordenadas en los bordes

### Resultados de Tests

```
test_antipodal_points ... ok
test_boundary_coordinates ... ok
test_coordinate_validation ... ok
test_distance_in_meters ... ok
test_equator_opposite_sides ... ok
test_madrid_barcelona_distance ... ok
test_madrid_sevilla_distance ... ok
test_same_coordinates ... ok
test_small_distances ... ok
test_symmetric_distance ... ok
test_triangle_inequality ... ok
test_tuple_interface ... ok
test_valencia_barcelona_distance ... ok

Ran 13 tests in 0.001s - OK
```

## 🌍 Ejemplos de Uso

### Ciudades Españolas

```python
# Distancias desde Madrid
ciudades = {
    'Barcelona': (41.3851, 2.1734),   # ~505 km
    'Sevilla': (37.3891, -5.9845),    # ~390 km
    'Valencia': (39.4699, -0.3763),   # ~303 km
    'Bilbao': (43.2627, -2.9253),     # ~323 km
}

madrid = (40.4168, -3.7038)
for ciudad, coords in ciudades.items():
    dist = calculate_gps_distance(madrid, coords)
    print(f"Madrid → {ciudad}: {dist:.2f} km")
```

### Distancias Cortas

```python
# Puerta del Sol → Parque del Retiro (Madrid)
centro_madrid = (40.4168, -3.7038)
retiro = (40.4152, -3.6844)

distancia_m = haversine_distance_meters(
    centro_madrid[0], centro_madrid[1],
    retiro[0], retiro[1]
)
print(f"Distancia: {distancia_m:.0f} metros")  # ~1652 m
```

## 📊 Precisión

La fórmula de Haversine proporciona una aproximación muy buena para la mayoría de aplicaciones:

- **Error típico**: < 0.5% para distancias medianas
- **Asunción**: Tierra esférica (R = 6371 km)
- **Limitación**: No considera la forma elipsoidal real de la Tierra

Para aplicaciones de muy alta precisión (geodesia, navegación profesional), considere usar el elipsoide WGS84.

## 🔄 Integración con el Proyecto

Este módulo Python complementa las implementaciones existentes en TypeScript:

- `apps/web/src/hooks/useGeolocation.ts` - Hook React con Haversine
- `apps/web/v0dev/g-banner-cookie/services/routing-service.ts` - Servicio de rutas
- `apps/geo-service/service.ts` - Servicio geográfico (mejorable)

### Uso en Scripts de Backend

```python
# Script de análisis de datos geográficos
from utils.gps_distance import haversine_distance

def analizar_cobertura_servicio(centro, puntos_servicio, radio_km):
    """Analiza qué puntos están dentro del radio de servicio."""
    puntos_cobertura = []
    
    for punto in puntos_servicio:
        distancia = haversine_distance(
            centro[0], centro[1], 
            punto[0], punto[1]
        )
        
        if distancia <= radio_km:
            puntos_cobertura.append({
                'coordenadas': punto,
                'distancia_km': distancia
            })
    
    return puntos_cobertura
```

## 📈 Rendimiento

- **Complejidad**: O(1) - tiempo constante
- **Memoria**: Mínima - solo variables locales
- **Operaciones**: ~15 operaciones matemáticas por cálculo
- **Velocidad**: Muy rápida para aplicaciones típicas

## 🛠️ Extensiones Posibles

1. **Soporte para múltiples unidades**:
   ```python
   def haversine_distance_units(lat1, lon1, lat2, lon2, unit='km'):
       # km, miles, nautical_miles, etc.
   ```

2. **Cálculo de rumbo (bearing)**:
   ```python
   def calculate_bearing(lat1, lon1, lat2, lon2):
       # Retorna el rumbo inicial en grados
   ```

3. **Punto intermedio**:
   ```python
   def intermediate_point(lat1, lon1, lat2, lon2, fraction):
       # Punto intermedio en la ruta
   ```

## 📚 Referencias

- [Fórmula de Haversine en Wikipedia](https://en.wikipedia.org/wiki/Haversine_formula)
- [Movable Type Scripts - Calculate distance and bearing](https://www.movable-type.co.uk/scripts/latlong.html)
- [NIST SP 800-61 Rev. 2](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)