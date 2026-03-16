"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X } from "lucide-react";

export function Mascot() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Randomly show the mascot with a tip
    const interval = setInterval(() => {
      const tips = [
        "The Market Intel agent just found 15 new high-value prospects.",
        "Your pipeline is looking healthy. 3 deals moved to negotiation.",
        "I noticed the Outreach Composer is getting a 42% open rate today!",
        "Don't forget to review the pending proposals in the Tasks tab."
      ];
      setMessage(tips[Math.floor(Math.random() * tips.length)]);
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 8000);
    }, 45000); // Every 45 seconds for demo purposes

    // Initial welcome
    setTimeout(() => {
      setMessage("Welcome to the War Room. Your AI sales team is ready.");
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 8000);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -50, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -50, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-8 left-24 z-50 flex items-end gap-4"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg border-2 border-background">
              <Bot size={24} className="text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
          </div>
          
          <div className="bg-card border border-border rounded-2xl rounded-bl-none p-4 shadow-xl max-w-xs relative">
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
            <p className="text-sm font-medium pr-4">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
