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
import { Mail, Send } from 'lucide-react';
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from '@/types/validation';

export function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(values: ForgotPasswordInput) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    placeholder="name@example.com"
                    {...field}
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
          className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-soft hover:shadow-lg active:scale-[0.98] transition-all group cursor-pointer"
        >
          <span>Send Link</span>
          <Send className="ml-2 size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Button>
      </form>
    </Form>
  );
}
