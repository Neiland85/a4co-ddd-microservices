"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Search, UserCheck, UserX, Crown, Shield, User } from "lucide-react"

interface UserData {
  id: string
  name: string
  email: string
  role: "admin" | "moderator" | "user"
  status: "active" | "inactive" | "banned"
  lastActive: Date
  avatar?: string
}

export function UserManagement() {
  const [users] = useState<UserData[]>([
    {
      id: "1",
      name: "Ana García",
      email: "ana@example.com",
      role: "admin",
      status: "active",
      lastActive: new Date(Date.now() - 300000),
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "2",
      name: "Carlos López",
      email: "carlos@example.com",
      role: "moderator",
      status: "active",
      lastActive: new Date(Date.now() - 600000),
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "3",
      name: "María Rodríguez",
      email: "maria@example.com",
      role: "user",
      status: "inactive",
      lastActive: new Date(Date.now() - 86400000),
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "4",
      name: "Juan Pérez",
      email: "juan@example.com",
      role: "user",
      status: "banned",
      lastActive: new Date(Date.now() - 172800000),
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-3 w-3" />
      case "moderator":
        return <Shield className="h-3 w-3" />
      case "user":
        return <User className="h-3 w-3" />
      default:
        return <User className="h-3 w-3" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "banned":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-500"
      case "moderator":
        return "bg-blue-500"
      case "user":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Gestión de Usuarios</span>
        </CardTitle>
        <CardDescription>Control de permisos y roles de usuario</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderador</SelectItem>
              <SelectItem value="user">Usuario</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de usuarios */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{user.name}</span>
                    <Badge variant="outline" className={`text-xs ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      <span className="ml-1">{user.role}</span>
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                  <div className="text-xs text-muted-foreground">
                    Último acceso: {user.lastActive.toLocaleString("es-ES")}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={getStatusColor(user.status)} className="text-xs">
                  {user.status === "active" && <UserCheck className="h-3 w-3 mr-1" />}
                  {user.status === "banned" && <UserX className="h-3 w-3 mr-1" />}
                  {user.status}
                </Badge>
                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                  Editar
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <div className="font-semibold text-green-500">{users.filter((u) => u.status === "active").length}</div>
            <div className="text-muted-foreground">Activos</div>
          </div>
          <div>
            <div className="font-semibold text-yellow-500">{users.filter((u) => u.status === "inactive").length}</div>
            <div className="text-muted-foreground">Inactivos</div>
          </div>
          <div>
            <div className="font-semibold text-red-500">{users.filter((u) => u.status === "banned").length}</div>
            <div className="text-muted-foreground">Bloqueados</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
