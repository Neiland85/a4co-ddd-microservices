"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
// Simulación de eventos del sistema
async function GET() {
    const events = [
        {
            id: Date.now().toString(),
            type: 'info',
            title: 'Sistema iniciado',
            description: 'El sistema se ha iniciado correctamente',
            timestamp: new Date().toISOString(),
            user: 'system',
        },
        {
            id: (Date.now() - 1000).toString(),
            type: 'warning',
            title: 'Alto uso de memoria',
            description: 'El uso de memoria ha superado el 80%',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            details: { memory: '82%' },
        },
    ];
    return server_1.NextResponse.json(events);
}
async function POST(request) {
    const event = await request.json();
    // Aquí normalmente guardarías el evento en la base de datos
    console.log('Nuevo evento:', event);
    return server_1.NextResponse.json({ success: true, id: Date.now().toString() });
}
//# sourceMappingURL=route.js.map