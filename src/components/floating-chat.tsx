"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, ChevronDown } from "lucide-react";
import {
  AIInput,
  AIInputButton,
  AIInputModelSelect,
  AIInputModelSelectContent,
  AIInputModelSelectItem,
  AIInputModelSelectTrigger,
  AIInputModelSelectValue,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools
} from "@/components/ui/ai-input";
import { GlobeIcon, MicIcon, PlusIcon, SendIcon } from 'lucide-react';
import { generateAgentResponse } from "@/lib/gemini";
import { useAuth } from "@/components/auth-provider";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { handleFirestoreError, OperationType } from "@/lib/firestore-errors";

const models = [
  { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro' },
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash' },
];

const agents = [
  { id: 'Orchestrator', name: 'Orchestrator', role: 'Sales Director' },
  { id: 'Market Intel', name: 'Market Intel', role: 'Industry Analyst' },
  { id: 'Prospecting', name: 'Prospecting', role: 'Lead Hunter' },
];

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [model, setModel] = useState<string>(models[0].id);
  const [agent, setAgent] = useState<string>(agents[0].id);
  const [messages, setMessages] = useState<{ id: string, role: "user" | "model", content: string }[]>([]);
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Create a new session or use an existing one
    const initSession = async () => {
      const newSessionRef = doc(collection(db, "chatSessions"));
      await setDoc(newSessionRef, {
        agentId: agent,
        userId: user.uid,
        title: "New Chat",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setSessionId(newSessionRef.id);
    };

    if (!sessionId) {
      initSession();
    }
  }, [user, sessionId, agent]);

  useEffect(() => {
    if (!sessionId || !user) return;

    const q = query(
      collection(db, `chatSessions/${sessionId}/messages`),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        role: doc.data().role as "user" | "model",
        content: doc.data().content
      }));
      setMessages(loadedMessages);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `chatSessions/${sessionId}/messages`);
    });

    return () => unsubscribe();
  }, [sessionId, user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const messageContent = formData.get('message') as string;
    if (!messageContent?.trim() || !sessionId || !user) return;

    const form = event.currentTarget;
    form.reset();

    try {
      // Add user message to Firestore
      await addDoc(collection(db, `chatSessions/${sessionId}/messages`), {
        sessionId,
        role: "user",
        content: messageContent,
        createdAt: new Date().toISOString()
      });

      // Get AI response
      const context = messages.map(m => ({ role: m.role, content: m.content }));
      const responseText = await generateAgentResponse(agent, messageContent, context, user?.uid);

      // Add AI message to Firestore
      await addDoc(collection(db, `chatSessions/${sessionId}/messages`), {
        sessionId,
        role: "model",
        content: responseText,
        createdAt: new Date().toISOString()
      });

    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const currentAgent = agents.find(a => a.id === agent) || agents[0];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-24 right-8 w-96 max-w-[calc(100vw-4rem)] h-[500px] max-h-[calc(100vh-8rem)] liquid-panel rounded-2xl flex flex-col overflow-hidden z-50"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20 backdrop-blur-md relative">
              <div 
                className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
                onClick={() => setIsAgentMenuOpen(!isAgentMenuOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_10px_rgba(var(--primary),0.5)]">
                  <MessageCircle size={16} className="text-primary ethereal-text" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-semibold text-sm ethereal-text">{currentAgent.name}</h3>
                    <ChevronDown size={14} className="text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">{currentAgent.role}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={16} className="text-white/70" />
              </button>

              <AnimatePresence>
                {isAgentMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-4 mt-2 w-48 liquid-panel rounded-xl overflow-hidden z-50 border border-white/10 shadow-2xl"
                  >
                    {agents.map(a => (
                      <button
                        key={a.id}
                        className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors ${agent === a.id ? 'bg-primary/20' : ''}`}
                        onClick={() => {
                          setAgent(a.id);
                          setSessionId(null); // Reset session when changing agent
                          setIsAgentMenuOpen(false);
                        }}
                      >
                        <div className="font-medium text-sm ethereal-text">{a.name}</div>
                        <div className="text-xs text-muted-foreground">{a.role}</div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-sm mt-10 ethereal-text">
                  Start a conversation with {currentAgent.name}...
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-primary/80 text-primary-foreground rounded-tr-sm shadow-[0_0_15px_rgba(var(--primary),0.4)]"
                        : "bg-white/10 text-foreground rounded-tl-sm backdrop-blur-md border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.05)]"
                    }`}
                  >
                    <div className="ethereal-text whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-md">
              <AIInput onSubmit={handleSubmit} className="bg-transparent border-none shadow-none">
                <AIInputTextarea placeholder="Ask about your sales pipeline..." className="bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus-visible:ring-primary/50" />
                <AIInputToolbar>
                  <AIInputTools>
                    <AIInputButton>
                      <PlusIcon size={16} />
                    </AIInputButton>
                    <AIInputButton>
                      <MicIcon size={16} />
                    </AIInputButton>
                    <AIInputModelSelect value={model} onValueChange={setModel}>
                      <AIInputModelSelectTrigger>
                        <AIInputModelSelectValue />
                      </AIInputModelSelectTrigger>
                      <AIInputModelSelectContent>
                        {models.map((model) => (
                          <AIInputModelSelectItem key={model.id} value={model.id}>
                            {model.name}
                          </AIInputModelSelectItem>
                        ))}
                      </AIInputModelSelectContent>
                    </AIInputModelSelect>
                  </AIInputTools>
                  <AIInputSubmit>
                    <SendIcon size={16} />
                  </AIInputSubmit>
                </AIInputToolbar>
              </AIInput>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-xl flex items-center justify-center z-50 hover:shadow-primary/30 transition-shadow"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </>
  );
}
