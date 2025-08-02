import { NextResponse } from "next/server"

// Simulación de datos de métricas en tiempo real
export async function GET() {
  const metrics = {
    performance: {
      responseTime: Math.floor(Math.random() * 100 + 200),
      cpuUsage: Math.floor(Math.random() * 30 + 50),
      memoryUsage: Math.floor(Math.random() * 20 + 40),
      networkLatency: Math.floor(Math.random() * 10 + 8),
    },
    security: {
      threatsDetected: Math.floor(Math.random() * 5 + 10),
      blockedAttacks: Math.floor(Math.random() * 3 + 5),
      activeMonitoring: true,
      lastScan: new Date().toISOString(),
    },
    users: {
      activeUsers: Math.floor(Math.random() * 1000 + 2500),
      totalUsers: Math.floor(Math.random() * 500 + 5000),
      bannedUsers: Math.floor(Math.random() * 10 + 5),
      moderators: Math.floor(Math.random() * 5 + 10),
    },
    system: {
      uptime: "99.8%",
      version: "2.1.3",
      lastUpdate: new Date(Date.now() - 86400000).toISOString(),
      status: "operational",
    },
  }

  return NextResponse.json(metrics)
}
