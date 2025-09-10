# V0 Component Template

Template base robusto para componentes generados con [v0.dev](https://v0.dev) integrado con el sistema de hooks y
estilos del proyecto.

## 🎯 Características

- ✅ **Estados de Loading**: Manejo automático de estados de carga, error y éxito
- ✅ **Variantes de Estilo**: 4 variantes predefinidas (default, primary, secondary, accent)
- ✅ **Tamaños Flexibles**: 3 tamaños (sm, md, lg) con espaciado consistente
- ✅ **Componentes Auxiliares**: Spinner, mensajes de error, estados vacíos
- ✅ **Hooks Integrados**: Estados y utilidades reutilizables
- ✅ **Accesibilidad**: ARIA labels y navegación por teclado
- ✅ **TypeScript**: Completamente tipado con interfaces extensibles

## 📦 Componentes Incluidos

### Componente Principal

- `V0ComponentTemplate`: Contenedor principal con todos los estados

### Componentes Auxiliares

- `V0CardTemplate`: Tarjetas con header, contenido y footer
- `V0ModalTemplate`: Modal responsive con backdrop y teclado
- `LoadingSpinner`: Spinner animado en 3 tamaños
- `ErrorMessage`: Mensaje de error con botón de reintento
- `EmptyState`: Estado vacío con icono y descripción

### Hooks Utilitarios

- `useLoadingState`: Manejo de estados async (loading, error, data)
- `useV0State`: Estado tipado con actualizaciones seguras

## 🚀 Uso Básico

```tsx
import V0ComponentTemplate from "./V0ComponentTemplate";

function MiComponente() {
  return (
    <V0ComponentTemplate
      title="Mi Componente"
      description="Descripción del componente"
      variant="primary"
      size="md"
      onAction={() => console.log("Acción ejecutada")}
    >
      {/* Tu contenido V0 aquí */}
      <div>Contenido generado en V0</div>
    </V0ComponentTemplate>
  );
}
```

## 🎨 Variantes Disponibles

```tsx
// Variantes de estilo
<V0ComponentTemplate variant="default" />   // Blanco con bordes grises
<V0ComponentTemplate variant="primary" />   // Azul claro
<V0ComponentTemplate variant="secondary" /> // Gris claro
<V0ComponentTemplate variant="accent" />    // Verde claro

// Tamaños
<V0ComponentTemplate size="sm" />  // Compacto
<V0ComponentTemplate size="md" />  // Estándar
<V0ComponentTemplate size="lg" />  // Amplio


```

## 📋 Props del Componente Principal

| Prop          | Tipo                                                | Default         | Descripción                    |
| ------------- | --------------------------------------------------- | --------------- | ------------------------------ |
| `title`       | `string`                                            | "Componente V0" | Título del componente          |
| `description` | `string`                                            | -               | Descripción opcional           |
| `variant`     | `"default" \| "primary" \| "secondary" \| "accent"` | "default"       | Variante de estilo             |
| `size`        | `"sm" \| "md" \| "lg"`                              | "md"            | Tamaño del componente          |
| `disabled`    | `boolean`                                           | `false`         | Deshabilita las acciones       |
| `loading`     | `boolean`                                           | `false`         | Estado de carga externo        |
| `onAction`    | `() => void`                                        | -               | Callback para acción principal |
| `onCancel`    | `() => void`                                        | -               | Callback para cancelación      |
| `className`   | `string`                                            | -               | Clases CSS adicionales         |
| `children`    | `ReactNode`                                         | -               | Contenido del componente       |

## 🔧 Ejemplos de Integración

### Con Hooks del Proyecto

```tsx
import { useProducts } from "../../hooks/useProducts";

function ProductosList() {
  const { products, loading, error } = useProducts();

  return (
    <V0ComponentTemplate title="Productos Locales" loading={loading} variant="primary">
      {error && <ErrorMessage message={error} />}
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </V0ComponentTemplate>
  );
}
```

### Modal con Template

```tsx
function ProductModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <V0ModalTemplate isOpen={isOpen} onClose={() => setIsOpen(false)} title="Detalles del Producto" size="lg">
      <V0ComponentTemplate variant="default">{/* Contenido del modal */}</V0ComponentTemplate>
    </V0ModalTemplate>
  );
}
```

### Estado Avanzado con Hook

```tsx
function FormularioContacto() {
  const {
    value: form,
    updateValue: setForm,
    isLoading,
  } = useV0State({
    name: "",
    email: "",
  });

  return (
    <V0ComponentTemplate
      title="Contacto"
      loading={isLoading}
      onAction={async () => {
        await enviarFormulario(form);
      }}
    >
      <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
    </V0ComponentTemplate>
  );
}
```

## 🎯 Flujo de Trabajo con V0

1. **Genera en V0**: Crea tu componente en [v0.dev](https://v0.dev)
2. **Copia el JSX**: Extrae el código JSX generado
3. **Envuelve con Template**: Usa `V0ComponentTemplate` como contenedor
4. **Conecta Hooks**: Integra con `useProducts`, `useArtisans`, etc.
5. **Ajusta Estilos**: Personaliza variant/size según necesidad
6. **Añade Estados**: Usa `useLoadingState` para operaciones async

## 🔍 Estados de Componente

### Estados de Loading

- **isLoading**: Muestra spinner y desactiva acciones
- **error**: Muestra mensaje de error con opción de reintento
- **success**: Muestra confirmación de operación exitosa
- **empty**: Estado cuando no hay contenido que mostrar

### Manejo de Errores

```tsx
const [state, { setError, reset }] = useLoadingState();

// En caso de error
setError("Mensaje de error específico");

// Para reintentar
<ErrorMessage
  message={state.error}
  onRetry={() => {
    reset();
    ejecutarOperacion();
  }}
/>;
```

## 🎨 Personalización de Estilos

El template usa Tailwind CSS y puede ser personalizado:

```tsx
// Clases adicionales
<V0ComponentTemplate className="border-2 border-blue-500 shadow-lg" variant="primary" />;

// Función cn() para combinar clases
import { cn } from "../lib/utils";

const customClass = cn("base-class", condition && "conditional-class", "additional-class");
```

## 📚 Recursos Adicionales

- Ver `V0Examples.tsx` para ejemplos completos
- Revisar hooks existentes en `/hooks/`
- Consultar componentes del marketplace en `/components/market/`

## 🚨 Consideraciones

- ✅ Siempre usa el template para componentes V0
- ✅ Integra con hooks existentes del proyecto
- ✅ Mantén consistencia en variantes y tamaños
- ✅ Maneja estados de error apropiadamente
- ❌ No uses estilos inline
- ❌ No olvides manejar estados de loading
- ❌ No hardcodees textos (usa props)
