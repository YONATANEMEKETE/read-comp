'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Loader,
} from 'lucide-react';
import { useActionState, useEffect, startTransition } from 'react';
import { signupSchema, type SignupInput } from '@/types/validation';
import { signupAction, type ActionState } from '@/actions/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

const initialState: ActionState = {
  success: false,
  message: '',
};

export function SignupForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialState,
  );

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  // Handle server-side validation errors from the action state
  useEffect(() => {
    if (state.errors) {
      Object.keys(state.errors).forEach((key) => {
        form.setError(key as keyof SignupInput, {
          type: 'server',
          message: state.errors?.[key]?.[0],
        });
      });
    }
  }, [state.errors, form]);

  // Handle successful signup
  useEffect(() => {
    if (state.success) {
      // Small delay to allow user to see success message
      const timer = setTimeout(() => {
        router.push('/login');
        router.refresh();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);

  const onSubmit = async (values: SignupInput) => {
    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('email', values.email);
    formData.append('password', values.password);

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="space-y-6">
      {state.message && (
        <Alert
          variant={state.success ? 'default' : 'destructive'}
          className={
            state.success
              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : ''
          }
        >
          {state.success ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>{state.success ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 mb-2 ml-1 block">
                  Username
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 size-5 transition-colors group-focus-within:text-primary" />
                    <Input
                      placeholder="Choose a username"
                      {...field}
                      disabled={isPending}
                      className="pl-11 h-12 rounded-xl bg-white dark:bg-stone-800 border-sepia-divider dark:border-stone-700 focus:ring-2 focus:ring-primary/10 focus:border-primary/50 transition-all"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 mb-2 ml-1 block">
                  Email Address
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 size-5 transition-colors group-focus-within:text-primary" />
                    <Input
                      placeholder="your@email.com"
                      {...field}
                      disabled={isPending}
                      className="pl-11 h-12 rounded-xl bg-white dark:bg-stone-800 border-sepia-divider dark:border-stone-700 focus:ring-2 focus:ring-primary/10 focus:border-primary/50 transition-all"
                    />
                  </div>
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
                <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 mb-2 ml-1 block">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 size-5 transition-colors group-focus-within:text-primary" />
                    <Input
                      type="password"
                      placeholder="Create a password"
                      {...field}
                      disabled={isPending}
                      className="pl-11 h-12 rounded-xl bg-white dark:bg-stone-800 border-sepia-divider dark:border-stone-700 focus:ring-2 focus:ring-primary/10 focus:border-primary/50 transition-all"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-soft hover:shadow-lg active:scale-[0.98] transition-all group cursor-pointer"
          >
            {isPending ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Join Noted</span>
                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
