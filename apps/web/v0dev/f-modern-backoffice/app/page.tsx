"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MetricsOverview } from "@/components/dashboard/metrics-overview"
import { PerformanceMonitoring } from "@/components/dashboard/performance-monitoring"
import { SecurityMonitoring } from "@/components/dashboard/security-monitoring"
import { UserManagement } from "@/components/dashboard/user-management"
import { ContentModeration } from "@/components/dashboard/content-moderation"
import { EventHistory } from "@/components/dashboard/event-history"
import { NotificationSystem } from "@/components/notifications/notification-system"
import { AuthGuard } from "@/components/security/auth-guard"
import { PerformanceDashboard } from "@/components/performance/performance-dashboard"
import { UserManagementDashboard } from "@/components/users/user-management-dashboard"
import { CybersecurityDashboard } from "@/components/security/cybersecurity-dashboard"
import { OffersManagementDashboard } from "@/components/offers/offers-management-dashboard"
import { SettingsDashboard } from "@/components/settings/settings-dashboard"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function BackofficePage() {
  const [activeSection, setActiveSection] = useState("dashboard")

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <MetricsOverview />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <PerformanceMonitoring />
              <SecurityMonitoring />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <UserManagement />
              <ContentModeration />
            </div>
            <EventHistory />
          </div>
        )

      // Performance sections
      case "performance-metrics":
      case "performance-analytics":
      case "performance-database":
      case "performance":
        return <PerformanceDashboard />

      // User management sections
      case "users-businesses":
      case "users-customers":
      case "users-analytics":
      case "users":
        return <UserManagementDashboard />

      // Security sections
      case "security-monitoring":
      case "security-threats":
      case "security-firewall":
      case "security":
        return <CybersecurityDashboard />

      // Offers sections
      case "offers-featured":
      case "offers-promotions":
      case "offers-analytics":
      case "offers":
        return <OffersManagementDashboard />

      case "settings":
        return <SettingsDashboard />

      case "notifications":
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Centro de Notificaciones</h2>
              <p className="text-muted-foreground">Gestión de notificaciones en desarrollo</p>
            </div>
          </div>
        )

      default:
        return <LoadingSpinner />
    }
  }

  return (
    <AuthGuard requiredPermissions={["system:read"]}>
      <div className="min-h-screen bg-background flex">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <NotificationSystem />

          <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
