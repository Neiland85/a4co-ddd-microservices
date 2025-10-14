'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { a4coSignupSchema, type A4coSignupFormData } from '@/lib/validation';
import { FormProgress } from './form-progress';
import {
  User,
  Mail,
  Building,
  Briefcase,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface A4coSignupFormProps {
  onSuccess: (data: A4coSignupFormData) => void;
}

export function A4coSignupForm({ onSuccess }: A4coSignupFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const stepLabels = ['Información Personal', 'Empresa', 'Seguridad', 'Confirmación'];

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<A4coSignupFormData>({
    resolver: zodResolver(a4coSignupSchema),
    mode: 'onChange',
  });

  const watchedFields = watch();

  const validateCurrentStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    return await trigger(fieldsToValidate);
  };

  const getFieldsForStep = (step: number): (keyof A4coSignupFormData)[] => {
    switch (step) {
      case 0:
        return ['firstName', 'lastName', 'email'];
      case 1:
        return ['company', 'jobTitle'];
      case 2:
        return ['password', 'confirmPassword'];
      case 3:
        return ['acceptTerms'];
      default:
        return [];
    }
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < stepLabels.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: A4coSignupFormData) => {
    setIsLoading(true);
    // Simular registro
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    onSuccess(data);
  };

  const jobTitles = [
    'CEO/Fundador',
    'CTO/Director de Tecnología',
    'Gerente General',
    'Director de Marketing',
    'Director de Ventas',
    'Gerente de Proyecto',
    'Desarrollador',
    'Analista',
    'Consultor',
    'Otro',
  ];

  return (
    <Card className="border border-gray-200 bg-white/95 p-8 shadow-xl backdrop-blur-lg">
      <FormProgress
        currentStep={currentStep}
        totalSteps={stepLabels.length}
        stepLabels={stepLabels}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {/* Paso 1: Información Personal */}
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">Información Personal</h3>
                <p className="mb-6 text-gray-600">Cuéntanos un poco sobre ti</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="flex items-center gap-2">
                    <User size={16} className="text-blue-600" />
                    Nombre
                  </Label>
                  <Input
                    {...register('firstName')}
                    id="firstName"
                    placeholder="Tu nombre"
                    className="border-2 border-gray-200 transition-colors focus:border-blue-500"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="flex items-center gap-2">
                    <User size={16} className="text-blue-600" />
                    Apellido
                  </Label>
                  <Input
                    {...register('lastName')}
                    id="lastName"
                    placeholder="Tu apellido"
                    className="border-2 border-gray-200 transition-colors focus:border-blue-500"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail size={16} className="text-blue-600" />
                  Correo Electrónico Corporativo
                </Label>
                <Input
                  {...register('email')}
                  id="email"
                  type="email"
                  placeholder="tu.nombre@empresa.com"
                  className="border-2 border-gray-200 transition-colors focus:border-blue-500"
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone size={16} className="text-blue-600" />
                  Teléfono (Opcional)
                </Label>
                <Input
                  {...register('phone')}
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="border-2 border-gray-200 transition-colors focus:border-blue-500"
                />
              </div>
            </motion.div>
          )}

          {/* Paso 2: Información de la Empresa */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Información de la Empresa
                </h3>
                <p className="mb-6 text-gray-600">Detalles sobre tu organización</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="flex items-center gap-2">
                  <Building size={16} className="text-blue-600" />
                  Nombre de la Empresa
                </Label>
                <Input
                  {...register('company')}
                  id="company"
                  placeholder="Acme Corporation"
                  className="border-2 border-gray-200 transition-colors focus:border-blue-500"
                />
                {errors.company && <p className="text-sm text-red-600">{errors.company.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="flex items-center gap-2">
                  <Briefcase size={16} className="text-blue-600" />
                  Cargo/Posición
                </Label>
                <Select onValueChange={value => setValue('jobTitle', value)}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Selecciona tu cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTitles.map(title => (
                      <SelectItem key={title} value={title}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.jobTitle && (
                  <p className="text-sm text-red-600">{errors.jobTitle.message}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Paso 3: Seguridad */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Configuración de Seguridad
                </h3>
                <p className="mb-6 text-gray-600">Crea una contraseña segura para tu cuenta</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock size={16} className="text-blue-600" />
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    {...register('password')}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres"
                    className="border-2 border-gray-200 pr-10 transition-colors focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-blue-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                  <Lock size={16} className="text-blue-600" />
                  Confirmar Contraseña
                </Label>
                <div className="relative">
                  <Input
                    {...register('confirmPassword')}
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repite tu contraseña"
                    className="border-2 border-gray-200 pr-10 transition-colors focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-blue-600"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <h4 className="mb-2 font-medium text-blue-900">Requisitos de contraseña:</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li className="flex items-center gap-2">
                    <span
                      className={
                        watchedFields.password?.length >= 8 ? 'text-green-600' : 'text-gray-400'
                      }
                    >
                      {watchedFields.password?.length >= 8 ? '✓' : '○'}
                    </span>
                    Mínimo 8 caracteres
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className={
                        /[A-Z]/.test(watchedFields.password || '')
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }
                    >
                      {/[A-Z]/.test(watchedFields.password || '') ? '✓' : '○'}
                    </span>
                    Al menos una mayúscula
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className={
                        /[0-9]/.test(watchedFields.password || '')
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }
                    >
                      {/[0-9]/.test(watchedFields.password || '') ? '✓' : '○'}
                    </span>
                    Al menos un número
                  </li>
                </ul>
              </div>
            </motion.div>
          )}

          {/* Paso 4: Confirmación */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">Confirmación</h3>
                <p className="mb-6 text-gray-600">
                  Revisa tu información y acepta nuestros términos
                </p>
              </div>

              <div className="space-y-3 rounded-lg bg-gray-50 p-6">
                <h4 className="font-medium text-gray-900">Resumen de tu cuenta:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Nombre:</span>
                    <p className="font-medium">
                      {watchedFields.firstName} {watchedFields.lastName}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{watchedFields.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Empresa:</span>
                    <p className="font-medium">{watchedFields.company}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Cargo:</span>
                    <p className="font-medium">{watchedFields.jobTitle}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox {...register('acceptTerms')} id="acceptTerms" className="mt-1" />
                  <Label htmlFor="acceptTerms" className="text-sm leading-relaxed text-gray-700">
                    Acepto los{' '}
                    <a href="#" className="font-medium text-blue-600 hover:underline">
                      Términos de Servicio
                    </a>{' '}
                    y la{' '}
                    <a href="#" className="font-medium text-blue-600 hover:underline">
                      Política de Privacidad
                    </a>{' '}
                    de a4co
                  </Label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
                )}

                <div className="flex items-start space-x-3">
                  <Checkbox {...register('newsletter')} id="newsletter" className="mt-1" />
                  <Label htmlFor="newsletter" className="text-sm leading-relaxed text-gray-700">
                    Quiero recibir actualizaciones de productos, noticias de la industria y ofertas
                    especiales de a4co
                  </Label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botones de navegación */}
        <div className="mt-8 flex justify-between">
          <Button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outline"
            className="flex items-center gap-2 border-gray-300 bg-transparent"
          >
            <ArrowLeft size={16} />
            Anterior
          </Button>

          {currentStep < stepLabels.length - 1 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Siguiente
              <ArrowRight size={16} />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isLoading}
              className="flex min-w-[120px] items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creando...
                </>
              ) : (
                <>
                  Crear Cuenta
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
