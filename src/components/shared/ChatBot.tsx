"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { MessageCircle, X, Send, Bot, User, Loader2, Minus, RefreshCw, History, AlertTriangle, Phone, ThumbsUp, ThumbsDown, Calendar, MessageSquare } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "~/lib/utils";

interface Message {
    role: "user" | "bot";
    content: string;
    timestamp: Date;
    isTyping?: boolean;
    isEmergency?: boolean;
    messageId?: string;
    rating?: number;
    action?: { type: string; payload: any };
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
    const params = useParams();
    const locale = params?.locale || 'id';
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
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [savedSessions, setSavedSessions] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    // Initialize/Load Session
    useEffect(() => {
        let storedId = localStorage.getItem("siti_session_id");
        if (!storedId) {
            storedId = crypto.randomUUID();
            localStorage.setItem("siti_session_id", storedId);
        }
        setSessionId(storedId);
        void loadChatHistory(storedId);

        // Load saved session IDs from localStorage
        const storedSessions = localStorage.getItem("siti_all_sessions");
        if (storedSessions) {
            setSavedSessions(JSON.parse(storedSessions));
        } else {
            setSavedSessions([storedId]);
            localStorage.setItem("siti_all_sessions", JSON.stringify([storedId]));
        }
    }, []);

    const loadChatHistory = async (sid: string) => {
        try {
            const res = await fetch(`/api/chat/history?sessionId=${sid}`);
            if (res.ok) {
                const history = await res.json();
                if (history && history.length > 0) {
                    const mapped: Message[] = history.map((m: any) => ({
                        role: m.role === "model" ? "bot" : "user",
                        content: m.content,
                        timestamp: new Date(m.createdAt),
                        isTyping: false
                    }));
                    setMessages(mapped);
                }
            }
        } catch (err) {
            console.error("Failed to load history:", err);
        }
    };
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
        const messageToSend = input.trim();
        if (!messageToSend || isLoading) return;

        const userMsg: Message = {
            role: "user",
            content: messageToSend,
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
                body: JSON.stringify({
                    message: messageToSend,
                    sessionId: sessionId
                })
            });
            const data = await response.json();
            const result = data.response;

            const botMsg: Message = {
                role: "bot",
                content: typeof result === "string" ? result : result.text,
                timestamp: new Date(),
                isTyping: true,
                isEmergency: result?.isEmergency,
                messageId: result?.messageId,
                action: result?.action
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

    const handleNewChat = () => {
        const newSid = crypto.randomUUID();
        localStorage.setItem("siti_session_id", newSid);

        const updatedSessions = [newSid, ...savedSessions];
        setSavedSessions(updatedSessions);
        localStorage.setItem("siti_all_sessions", JSON.stringify(updatedSessions));

        setSessionId(newSid);
        setMessages([
            {
                role: "bot",
                content: "Halo! Saya Siti, Asisten Virtual RSI. Ada yang bisa saya bantu?",
                timestamp: new Date(),
                isTyping: false,
            }
        ]);
        setShowHistory(false);
    };

    const handleRate = async (idx: number, rating: number) => {
        const msg = messages[idx];
        if (!msg.messageId || msg.rating) return;

        // Update local state
        setMessages(prev => prev.map((m, i) => i === idx ? { ...m, rating } : m));

        try {
            await fetch("/api/chat/rate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messageId: msg.messageId,
                    rating
                })
            });
        } catch (err) {
            console.error("Failed to submit rating:", err);
        }
    };

    const switchSession = (sid: string) => {
        localStorage.setItem("siti_session_id", sid);
        setSessionId(sid);
        setMessages([]); // Clear while loading
        void loadChatHistory(sid);
        setShowHistory(false);
    };

    return (
        <div className="fixed bottom-24 md:bottom-6 right-6 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={cn(
                            "mb-4 w-[calc(100vw-3rem)] sm:w-[350px] md:w-[400px] bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden",
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
                                <Button variant="ghost" size="icon" onClick={() => setShowHistory(!showHistory)} title="Riwayat Chat" className="h-8 w-8 text-white hover:bg-white/10">
                                    <History className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={handleNewChat} title="Mulai Percakapan Baru" className="h-8 w-8 text-white hover:bg-white/10">
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
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

                                                {/* SOS Button for Emergency */}
                                                {msg.isEmergency && (
                                                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl flex flex-col gap-2 animate-in fade-in zoom-in">
                                                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-xs uppercase">
                                                            <AlertTriangle className="h-4 w-4" />
                                                            Kondisi Darurat!
                                                        </div>
                                                        <Button
                                                            variant="destructive"
                                                            className="w-full bg-red-600 hover:bg-red-700 text-white gap-2 font-bold h-10 text-xs shadow-lg"
                                                            onClick={() => window.open('tel:0370631885', '_self')}
                                                        >
                                                            <Phone className="h-4 w-4" />
                                                            HUBUNGI IGD (0370) 631885
                                                        </Button>
                                                    </div>
                                                )}

                                                {/* Human Handover (WhatsApp) */}
                                                {msg.role === "bot" && !msg.isTyping && (msg.content.toLowerCase().includes("maaf") || msg.content.toLowerCase().includes("tidak tahu") || msg.content.toLowerCase().includes("staf") || msg.content.toLowerCase().includes("manusia") || msg.isEmergency) && (
                                                    <Button
                                                        variant="outline"
                                                        className="w-full mt-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/10 gap-2 text-[10px] h-8 shadow-sm"
                                                        onClick={() => window.open('https://wa.me/6281234567890?text=Halo%20RSI,%20saya%20butuh%20bantuan%20staf%20terkait%20layanan.', '_blank')}
                                                    >
                                                        <MessageSquare className="h-3 w-3" />
                                                        HUBUNGI STAF VIA WHATSAPP
                                                    </Button>
                                                )}

                                                {/* Contextual Action: Direct Booking */}
                                                {msg.role === "bot" && !msg.isTyping && msg.action?.type === 'BOOK_POLI' && (
                                                    <div className="mt-2 p-2 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg animate-in fade-in slide-in-from-bottom-2">
                                                        <p className="text-[10px] text-muted-foreground mb-2 text-center font-medium">Saran Tindakan:</p>
                                                        <Button
                                                            size="sm"
                                                            className="w-full bg-primary hover:bg-primary/90 text-white gap-2 text-[11px] h-9 shadow-md"
                                                            onClick={() => window.location.href = `/${locale}/doctors?specialty=${encodeURIComponent(msg.action?.payload)}`}
                                                        >
                                                            <Calendar className="h-4 w-4" />
                                                            DAFTAR {msg.action?.payload.toUpperCase()}
                                                        </Button>
                                                    </div>
                                                )}

                                                {/* Bot Feedback Rating */}
                                                {msg.role === "bot" && !msg.isTyping && msg.messageId && (
                                                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                                        <span className="text-[9px] text-muted-foreground uppercase font-semibold">Rating:</span>
                                                        <button
                                                            disabled={!!msg.rating}
                                                            onClick={() => handleRate(idx, 1)}
                                                            className={cn(
                                                                "p-1 rounded transition-colors hover:bg-slate-100 dark:hover:bg-slate-700",
                                                                msg.rating === 1 ? "text-green-600" : "text-muted-foreground opacity-50"
                                                            )}
                                                            title="Jawaban Membantu"
                                                        >
                                                            <ThumbsUp className="h-3 w-3" />
                                                        </button>
                                                        <button
                                                            disabled={!!msg.rating}
                                                            onClick={() => handleRate(idx, -1)}
                                                            className={cn(
                                                                "p-1 rounded transition-colors hover:bg-slate-100 dark:hover:bg-slate-700",
                                                                msg.rating === -1 ? "text-red-600" : "text-muted-foreground opacity-50"
                                                            )}
                                                            title="Jawaban Tidak Akurat"
                                                        >
                                                            <ThumbsDown className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                )}
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

                                {/* History Overlay */}
                                <AnimatePresence>
                                    {showHistory && (
                                        <motion.div
                                            initial={{ x: "100%" }}
                                            animate={{ x: 0 }}
                                            exit={{ x: "100%" }}
                                            className="absolute inset-0 bg-white dark:bg-slate-900 border-l z-50 flex flex-col pt-14"
                                        >
                                            <div className="p-4 border-b flex justify-between items-center">
                                                <h4 className="font-bold text-sm">Riwayat Chat</h4>
                                                <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)} className="h-8 w-8">
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="flex-1 overflow-y-auto p-2">
                                                {savedSessions.length === 0 ? (
                                                    <p className="text-center text-xs text-muted-foreground mt-4">Belum ada riwayat.</p>
                                                ) : (
                                                    <div className="space-y-1">
                                                        {savedSessions.map((sid, i) => (
                                                            <button
                                                                key={sid}
                                                                onClick={() => switchSession(sid)}
                                                                className={cn(
                                                                    "w-full text-left p-3 rounded-xl text-xs transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2",
                                                                    sessionId === sid ? "bg-primary/10 text-primary font-medium" : "text-slate-600 dark:text-slate-400"
                                                                )}
                                                            >
                                                                <MessageCircle className="h-3 w-3 shrink-0" />
                                                                <span className="truncate">Percakapan {savedSessions.length - i}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4 border-t">
                                                <Button variant="outline" className="w-full text-xs gap-2" onClick={handleNewChat}>
                                                    <RefreshCw className="h-3 w-3" />
                                                    Mulai Baru
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
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
