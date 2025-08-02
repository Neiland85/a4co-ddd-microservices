import { z } from "zod"

export const registrationSchema = z
  .object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Ingresa un correo electrónico válido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
    phone: z.string().optional(),
    acceptTerms: z.boolean().refine((val) => val === true, "Debes aceptar los términos y condiciones"),
    marketingEmails: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export type RegistrationFormData = z.infer<typeof registrationSchema>

export const verificationSchema = z.object({
  code: z.string().length(6, "El código debe tener 6 dígitos"),
})

export type VerificationFormData = z.infer<typeof verificationSchema>

// Esquema específico para a4co
export const a4coSignupSchema = z
  .object({
    firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    email: z.string().email("Ingresa un correo electrónico válido"),
    phone: z.string().optional(),
    company: z.string().min(2, "El nombre de la empresa es requerido"),
    jobTitle: z.string().min(1, "Selecciona tu cargo"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[0-9]/, "Debe contener al menos un número"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, "Debes aceptar los términos y condiciones"),
    newsletter: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export type A4coSignupFormData = z.infer<typeof a4coSignupSchema>
