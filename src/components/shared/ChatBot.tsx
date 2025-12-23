"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, Minus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "~/lib/utils";

interface Message {
    role: "user" | "bot";
    content: string;
    timestamp: Date;
    isTyping?: boolean;
}

// Typing effect component
const TypingText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text[currentIndex]);
                setCurrentIndex((prev) => prev + 1);
            }, 15); // Speed: 15ms per character
            return () => clearTimeout(timeout);
        } else {
            onComplete?.();
        }
    }, [currentIndex, text, onComplete]);

    return <span>{displayedText}<span className="animate-pulse">|</span></span>;
};

export const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "bot",
            content: "Halo! Saya Siti, Asisten Virtual RSI. Ada yang bisa saya bantu?",
            timestamp: new Date(),
            isTyping: false,
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleTypingComplete = (idx: number) => {
        setMessages((prev) =>
            prev.map((msg, i) => (i === idx ? { ...msg, isTyping: false } : msg))
        );
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = {
            role: "user",
            content: input,
            timestamp: new Date(),
            isTyping: false,
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input })
            });
            const data = await response.json();

            const botMsg: Message = {
                role: "bot",
                content: data.response,
                timestamp: new Date(),
                isTyping: true, // Enable typing effect
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [...prev, {
                role: "bot",
                content: "Maaf, sistem sedang sibuk. Silakan coba lagi nanti.",
                timestamp: new Date(),
                isTyping: false,
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={cn(
                            "mb-4 w-[350px] md:w-[400px] bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden",
                            isMinimized ? "h-[60px]" : "h-[500px]"
                        )}
                    >
                        {/* Header */}
                        <div className="bg-primary p-4 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <Bot className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Asisten Virtual RSI</h3>
                                    <p className="text-[10px] opacity-80">Online | Selalu Siap Membantu</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" onClick={() => setIsMinimized(!isMinimized)} className="h-8 w-8 text-white hover:bg-white/10">
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-white hover:bg-white/10">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Messages Container */}
                                <div
                                    ref={scrollRef}
                                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/20"
                                >
                                    {messages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "flex w-full",
                                                msg.role === "user" ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div className={cn(
                                                "max-w-[80%] p-3 rounded-2xl text-sm shadow-sm",
                                                msg.role === "user"
                                                    ? "bg-primary text-white rounded-tr-none"
                                                    : "bg-white dark:bg-slate-800 border rounded-tl-none"
                                            )}>
                                                {msg.role === "bot" && msg.isTyping ? (
                                                    <TypingText
                                                        text={msg.content}
                                                        onComplete={() => handleTypingComplete(idx)}
                                                    />
                                                ) : (
                                                    msg.content
                                                )}
                                                <div className={cn(
                                                    "text-[10px] mt-1 opacity-60",
                                                    msg.role === "user" ? "text-right" : "text-left"
                                                )}>
                                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-white dark:bg-slate-800 border p-3 rounded-2xl rounded-tl-none shadow-sm">
                                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Input Area */}
                                <div className="p-4 border-t bg-white dark:bg-slate-900">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Tanya sesuatu..."
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                            className="rounded-xl border-slate-200 dark:border-slate-800"
                                        />
                                        <Button
                                            size="icon"
                                            onClick={handleSend}
                                            disabled={!input.trim() || isLoading}
                                            className="rounded-xl shrink-0"
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Quick Reply Buttons */}
                                    {messages.length <= 2 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {[
                                                "Jadwal Dokter",
                                                "Daftar Online",
                                                "Alamat RS",
                                                "Layanan Kami"
                                            ].map((text) => (
                                                <button
                                                    key={text}
                                                    onClick={() => {
                                                        setInput(text);
                                                        setTimeout(() => handleSend(), 100);
                                                    }}
                                                    className="px-3 py-1.5 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors"
                                                >
                                                    {text}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <p className="text-[10px] text-center text-muted-foreground mt-2 italic">
                                        Powered by RSI Care AI
                                    </p>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Float Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-colors border-4 border-white dark:border-slate-900",
                    isOpen ? "bg-slate-200 text-slate-600 dark:bg-slate-800" : "bg-primary text-white"
                )}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
                {!isOpen && (
                    <span className="absolute -top-1 -left-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                    </span>
                )}
            </motion.button>
        </div>
    );
};
