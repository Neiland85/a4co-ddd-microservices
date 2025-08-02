"use server"

import { z } from "zod"
import { loginSchema, registerSchema } from "@/lib/validators/auth"

export interface AuthState {
  success?: boolean
  message?: string
  errors?: Record<string, string[] | undefined>
}

export async function loginAction(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  try {
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    const validatedData = loginSchema.parse(rawData)

    // Simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication logic
    if (validatedData.email === process.env.DEMO_EMAIL && validatedData.password === process.env.DEMO_PASSWORD) {
      return {
        success: true,
        message: "¡Inicio de sesión exitoso! Bienvenido de vuelta.",
      }
    } else {
      return {
        success: false,
        message: "Credenciales incorrectas.",
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      const filteredErrors: Record<string, string[]> = {};

      // Filter out undefined values and ensure all values are string arrays
      Object.entries(fieldErrors).forEach(([key, value]) => {
        if (value && Array.isArray(value)) {
          filteredErrors[key] = value;
        }
      });

      return {
        success: false,
        message: "Error de validación",
        errors: filteredErrors,
      }
    }

    return {
      success: false,
      message: "Error interno del servidor",
    }
  }
}

export async function registerAction(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  try {
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      terms: formData.get("terms") === "on",
    }

    registerSchema.parse(rawData)

    // Simulate registration
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock registration logic
    return {
      success: true,
      message: "¡Cuenta creada exitosamente! Ya puedes iniciar sesión.",
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      const filteredErrors: Record<string, string[]> = {};

      // Filter out undefined values and ensure all values are string arrays
      Object.entries(fieldErrors).forEach(([key, value]) => {
        if (value && Array.isArray(value)) {
          filteredErrors[key] = value;
        }
      });

      return {
        success: false,
        message: "Error de validación",
        errors: filteredErrors,
      }
    }

    return {
      success: false,
      message: "Error interno del servidor",
    }
  }
}
