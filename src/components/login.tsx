import React from 'react';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export const Login = () => {
  const { signIn } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="liquid-panel p-12 rounded-[2.5rem] max-w-md w-full text-center space-y-10 relative z-10 border border-white/5 shadow-2xl"
      >
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center rotate-12 hover:rotate-0 transition-transform duration-500">
            <Zap className="w-10 h-10 text-primary" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none ethereal-text">
            Nexus<br />Command
          </h1>
          <p className="text-muted-foreground font-medium">Authentication required for system access.</p>
        </div>

        <Button 
          onClick={signIn} 
          className="w-full h-14 text-lg font-bold bg-primary text-primary-foreground hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(var(--primary),0.3)] rounded-2xl"
        >
          Authorize with Google
        </Button>

        <p className="text-[10px] font-mono uppercase tracking-widest opacity-30">
          [ SECURE ENCRYPTED CHANNEL ]
        </p>
      </motion.div>
    </div>
  );
};
