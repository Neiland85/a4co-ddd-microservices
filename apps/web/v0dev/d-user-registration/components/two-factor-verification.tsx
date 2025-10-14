'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { verificationSchema, type VerificationFormData } from '@/lib/validation';
import { Mail, Phone, ArrowLeft, Shield } from 'lucide-react';

interface TwoFactorVerificationProps {
  email: string;
  phone?: string;
  onBack: () => void;
  onSuccess: () => void;
}

export function TwoFactorVerification({
  email,
  phone,
  onBack,
  onSuccess,
}: TwoFactorVerificationProps) {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
  });

  const code = watch('code');

  const sendCode = async () => {
    setIsLoading(true);
    // Simular envío de código
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCodeSent(true);
    setIsLoading(false);

    // Iniciar countdown
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onSubmit = async (data: VerificationFormData) => {
    setIsLoading(true);
    // Simular verificación
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    onSuccess();
  };

  const resendCode = () => {
    setTimeLeft(60);
    sendCode();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto w-full max-w-md"
    >
      <Card className="border-2 border-purple-200 bg-white/95 p-8 shadow-2xl backdrop-blur-lg">
        <div className="mb-6 text-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white"
          >
            <Shield size={32} />
          </motion.div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Verificación de Seguridad</h2>
          <p className="text-gray-600">
            Para proteger tu cuenta, necesitamos verificar tu identidad
          </p>
        </div>

        {!codeSent ? (
          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Elige tu método de verificación:
              </Label>

              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMethod('email')}
                  className={`w-full rounded-lg border-2 p-4 transition-all ${
                    method === 'email'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Mail
                      className={`h-5 w-5 ${method === 'email' ? 'text-purple-600' : 'text-gray-500'}`}
                    />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Correo Electrónico</div>
                      <div className="text-sm text-gray-600">{email}</div>
                    </div>
                  </div>
                </motion.button>

                {phone && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMethod('phone')}
                    className={`w-full rounded-lg border-2 p-4 transition-all ${
                      method === 'phone'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Phone
                        className={`h-5 w-5 ${method === 'phone' ? 'text-purple-600' : 'text-gray-500'}`}
                      />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Número de Teléfono</div>
                        <div className="text-sm text-gray-600">{phone}</div>
                      </div>
                    </div>
                  </motion.button>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={onBack}
                variant="outline"
                className="flex-1 border-gray-300 bg-transparent"
              >
                <ArrowLeft size={16} className="mr-2" />
                Volver
              </Button>
              <Button
                onClick={sendCode}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isLoading ? 'Enviando...' : 'Enviar Código'}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="text-center">
              <p className="mb-4 text-sm text-gray-600">
                Hemos enviado un código de 6 dígitos a tu{' '}
                {method === 'email' ? 'correo' : 'teléfono'}
              </p>
              <div className="text-xs text-gray-500">{method === 'email' ? email : phone}</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Código de Verificación</Label>
              <Input
                {...register('code')}
                id="code"
                placeholder="000000"
                className="text-center font-mono text-2xl tracking-widest"
                maxLength={6}
              />
              {errors.code && <p className="text-sm text-red-600">{errors.code.message}</p>}
            </div>

            <div className="text-center">
              {timeLeft > 0 ? (
                <p className="text-sm text-gray-500">Reenviar código en {timeLeft}s</p>
              ) : (
                <Button
                  type="button"
                  variant="link"
                  onClick={resendCode}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Reenviar código
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={onBack}
                variant="outline"
                className="flex-1 border-gray-300 bg-transparent"
              >
                <ArrowLeft size={16} className="mr-2" />
                Volver
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !code || code.length !== 6}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isLoading ? 'Verificando...' : 'Verificar'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </motion.div>
  );
}
