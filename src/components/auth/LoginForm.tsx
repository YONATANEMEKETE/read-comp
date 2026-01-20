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
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { loginSchema, type LoginInput } from '@/types/validation';

export function LoginForm() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  function onSubmit(values: LoginInput) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                    placeholder="scholar@example.com"
                    {...field}
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
                    placeholder="••••••••"
                    {...field}
                    className="pl-11 h-12 rounded-xl bg-white dark:bg-stone-800 border-sepia-divider dark:border-stone-700 focus:ring-2 focus:ring-primary/10 focus:border-primary/50 transition-all"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between text-sm">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="size-4 border-stone-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </FormControl>
                <FormLabel className="text-stone-500 font-medium cursor-pointer hover:text-stone-700 transition-colors">
                  Remember me
                </FormLabel>
              </FormItem>
            )}
          />
          <Link
            href="/forgot-password"
            className="text-primary hover:text-primary/80 font-semibold transition-colors underline-offset-4 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-soft hover:shadow-lg active:scale-[0.98] transition-all group cursor-pointer"
        >
          <span>Sign In</span>
          <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>
    </Form>
  );
}
