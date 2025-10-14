import { type NextRequest, NextResponse } from 'next/server';
export declare function POST(request: NextRequest): Promise<NextResponse<{
    success: boolean;
    event: any;
    stats: any;
    recommendations: string[];
}> | NextResponse<{
    error: string;
}>>;
/**
 * BENEFICIOS DE ESTA REFACTORIZACIÓN:
 *
 * 1. ✅ Separación de bounded contexts: La app web no conoce los detalles internos
 *    del servicio de notificaciones
 *
 * 2. ✅ Comunicación a través de contratos: Se usan interfaces bien definidas
 *
 * 3. ✅ Resiliencia mejorada: El cliente API puede implementar retry, circuit breaker, etc.
 *
 * 4. ✅ Facilita testing: Es más fácil mockear un cliente HTTP que un servicio completo
 *
 * 5. ✅ Evolución independiente: El servicio de notificaciones puede cambiar su
 *    implementación interna sin afectar a los consumidores
 */
//# sourceMappingURL=route.refactored.d.ts.map