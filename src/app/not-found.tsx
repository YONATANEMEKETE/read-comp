'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/common/Logo';
import { BookOpen, Home, MoveLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background Texture */}
      <div className="bg-grain absolute inset-0 opacity-50 z-0 pointer-events-none" />
      
      {/* Abstract Background Shapes */}
      <div className="absolute top-1/4 -left-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center max-w-lg mx-auto px-6 text-center animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">
        {/* Logo */}
        <div className="mb-8 scale-125">
          <Logo />
        </div>

        {/* 404 Display */}
        <div className="relative mb-6">
          <h1 className="text-[10rem] font-serif leading-none text-primary/20 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
             <BookOpen className="w-24 h-24 text-primary" strokeWidth={1.5} />
          </div>
        </div>

        {/* Content */}
        <h2 className="text-3xl font-serif font-medium text-foreground mb-4">
          Chapter Not Found
        </h2>
        
        <p className="text-muted-foreground text-lg mb-8 max-w-md leading-relaxed">
          It seems the page you are looking for has been torn out of the story or never existed in our library.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button 
            asChild 
            variant="default" 
            size="lg"
            className="group"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
              Return Home
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="group"
            onClick={() => router.back()}
          >
            <MoveLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </Button>
        </div>

        {/* Footer decoration */}
        <div className="mt-16 pt-8 border-t border-border/50 w-full flex justify-center">
          <p className="text-sm text-muted-foreground/50 font-serif italic">
            "Not all those who wander are lost, but this page definitely is."
          </p>
        </div>
      </div>
    </div>
  );
}
