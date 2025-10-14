'use client';

import { loginAction, type AuthState } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSoundEffects } from '@/hooks/use-sound-effects';
import { useToast } from '@/hooks/use-toast';
import { loginSchema, type LoginInput } from '@/lib/validators/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(loginAction, null);
  const { toast } = useToast();
  const { playSuccess, playError } = useSoundEffects();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (state?.success) {
      playSuccess();
      toast({ title: 'Éxito', description: state.message });
    } else if (state?.message) {
      playError();
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
      if (state.errors) {
        for (const [field, errors] of Object.entries(state.errors)) {
          form.setError(field as keyof LoginInput, {
            type: 'manual',
            message: errors?.join(', '),
          });
        }
      }
    }
  }, [state, toast, playSuccess, playError, form]);

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="test@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          disabled={isPending}
        >
          {isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </form>
    </Form>
  );
}
