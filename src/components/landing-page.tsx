"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Globe, Cpu, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DotGlobeHero } from "@/components/ui/globe-hero";

export function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center mix-blend-difference">
        <div className="text-2xl font-black tracking-tighter ethereal-text">
          NEXUS
        </div>
        <div className="flex gap-8 items-center">
          <button className="text-sm font-medium hover:opacity-70 transition-opacity">Features</button>
          <button className="text-sm font-medium hover:opacity-70 transition-opacity">Intelligence</button>
          <Button 
            onClick={onGetStarted}
            variant="outline" 
            className="rounded-full px-8 border-foreground/20 hover:bg-foreground hover:text-background transition-all"
          >
            Enter Command
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <DotGlobeHero rotationSpeed={0.002} className="opacity-40" />
        </div>
        
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[15vw] md:text-[12vw] font-black leading-[0.8] tracking-tighter uppercase mb-8 ethereal-text">
              Sales<br />
              <span className="text-primary">Autonomy</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium mb-12">
              The world's first self-governing AI sales force. 
              Built for the era of hyper-scale intelligence.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={onGetStarted}
                size="lg" 
                className="h-16 px-12 rounded-full text-lg font-bold bg-primary hover:scale-105 transition-transform shadow-[0_0_30px_rgba(var(--primary),0.4)]"
              >
                Launch Nexus <ArrowRight className="ml-2" />
              </Button>
              <p className="text-sm text-muted-foreground font-mono">
                [ SYSTEM STATUS: OPTIMAL ]
              </p>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
          <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-foreground to-transparent animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Scroll to explore</span>
        </div>
      </section>

      {/* Features Grid - Bento Style */}
      <section className="px-8 py-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
          {/* Large Feature */}
          <div className="md:col-span-8 liquid-panel rounded-[2.5rem] p-12 flex flex-col justify-between min-h-[500px] group overflow-hidden">
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Cpu className="text-primary w-8 h-8" />
              </div>
              <h2 className="text-5xl font-bold tracking-tight mb-6">Neural Prospecting</h2>
              <p className="text-xl text-muted-foreground max-w-md">
                Our agents don't just find leads. They understand intent, 
                mapping the entire market landscape in real-time.
              </p>
            </div>
            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
          </div>

          {/* Small Feature */}
          <div className="md:col-span-4 liquid-panel rounded-[2.5rem] p-12 flex flex-col justify-center items-center text-center group">
            <Globe className="w-12 h-12 text-primary mb-6 group-hover:rotate-12 transition-transform" />
            <h3 className="text-2xl font-bold mb-4">Global Reach</h3>
            <p className="text-muted-foreground">
              Operate across every time zone, simultaneously.
            </p>
          </div>

          {/* Small Feature */}
          <div className="md:col-span-4 liquid-panel rounded-[2.5rem] p-12 flex flex-col justify-center items-center text-center group">
            <Shield className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold mb-4">Secure Core</h3>
            <p className="text-muted-foreground">
              Enterprise-grade encryption for your most sensitive data.
            </p>
          </div>

          {/* Medium Feature */}
          <div className="md:col-span-8 liquid-panel rounded-[2.5rem] p-12 flex flex-col justify-between min-h-[400px] relative overflow-hidden group">
            <div className="relative z-10">
              <BarChart3 className="w-12 h-12 text-primary mb-8" />
              <h2 className="text-4xl font-bold tracking-tight mb-6">Predictive Velocity</h2>
              <p className="text-lg text-muted-foreground max-w-sm">
                Know your revenue before it happens. Our AI models 
                predict closing probabilities with 98% accuracy.
              </p>
            </div>
            <div className="absolute right-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-primary/5 to-transparent" />
          </div>
        </div>
      </section>

      {/* Interactive Section - Split Layout */}
      <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 border-y border-white/10">
        <div className="p-12 md:p-24 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/10">
          <span className="text-primary font-mono mb-8 uppercase tracking-widest">01 / The Orchestrator</span>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-12 uppercase leading-none">
            Command<br />Your<br />Agents
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-md">
            Assign high-level objectives. Watch as your AI team decomposes 
            tasks, researches targets, and executes outreach.
          </p>
          <Button 
            onClick={onGetStarted}
            variant="outline" 
            className="w-fit h-14 px-10 rounded-full border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            See the dashboard
          </Button>
        </div>
        <div className="bg-black/40 p-12 md:p-24 flex items-center justify-center relative overflow-hidden">
          <div className="w-full aspect-video liquid-panel rounded-3xl p-8 flex flex-col gap-4 relative z-10 shadow-2xl">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="h-4 w-1/2 bg-white/5 rounded-full" />
            <div className="h-4 w-3/4 bg-white/5 rounded-full" />
            <div className="flex-1 bg-white/5 rounded-2xl flex items-center justify-center">
              <Zap className="w-12 h-12 text-primary animate-pulse" />
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-primary/5 rounded-full blur-[120px]" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-12 leading-none">
            Ready to scale<br />beyond human limits?
          </h2>
          <Button 
            onClick={onGetStarted}
            size="lg" 
            className="h-20 px-16 rounded-full text-2xl font-black bg-primary hover:scale-110 transition-transform shadow-[0_0_50px_rgba(var(--primary),0.5)]"
          >
            Get Started Now
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-xl font-black tracking-tighter opacity-50">
          NEXUS COMMAND
        </div>
        <div className="flex gap-12 text-xs font-bold uppercase tracking-widest opacity-50">
          <a href="#" className="hover:opacity-100 transition-opacity">Privacy</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Terms</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Contact</a>
        </div>
        <div className="text-[10px] font-mono opacity-30 uppercase">
          © 2026 Nexus Intelligence Systems. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
