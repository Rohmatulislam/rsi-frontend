'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Pill, Clock, User, Bell, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ReadyPrescription {
    no_resep: string;
    nama_pasien: string;
    no_rawat: string;
    timestamp: Date;
}

export default function PharmacyQueuePage() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [queue, setQueue] = useState<ReadyPrescription[]>([]);
    const [history, setHistory] = useState<ReadyPrescription[]>([]);
    const [isCalling, setIsCalling] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const callQueue = useRef<ReadyPrescription[]>([]);

    // Sound and TTS Logic
    const speakPatient = useCallback((prescription: ReadyPrescription) => {
        if (!window.speechSynthesis) return;

        // 1. Alert Sound (Optional: you can add a chime here)
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = `Panggilan untuk Ibu atau Bapak ${prescription.nama_pasien}. Silaakan ambil obat di loket Farmasi. Nomor resep ${prescription.no_resep.split('').join(' ')}.`;
        utterance.lang = 'id-ID';
        utterance.rate = 0.9;
        utterance.pitch = 1;

        utterance.onstart = () => setIsCalling(true);
        utterance.onend = () => {
            setIsCalling(false);
            // Process next in queue after a delay
            setTimeout(() => {
                processNextInCallQueue();
            }, 2000);
        };

        window.speechSynthesis.speak(utterance);
    }, []);

    const processNextInCallQueue = useCallback(() => {
        if (callQueue.current.length > 0 && !window.speechSynthesis.speaking) {
            const next = callQueue.current[0];
            callQueue.current = callQueue.current.slice(1);
            speakPatient(next);
        }
    }, [speakPatient]);

    // Socket Connection
    useEffect(() => {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:2000';
        const newSocket = io(`${backendUrl}/pharmacy`, {
            transports: ['websocket'],
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
            newSocket.emit('join-queue-room');
            toast.success('Terhubung ke server antrean');
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
            toast.error('Terputus dari server antrean');
        });

        newSocket.on('prescription-ready', (data: any) => {
            const newPrescription: ReadyPrescription = {
                ...data,
                timestamp: new Date(),
            };

            setQueue((prev) => [newPrescription, ...prev].slice(0, 5));
            setHistory((prev) => [newPrescription, ...prev].slice(0, 20));

            // Add to voice queue
            callQueue.current.push(newPrescription);
            processNextInCallQueue();

            toast.info(`Resep Siap: ${data.nama_pasien}`, {
                icon: <Bell className="w-4 h-4" />,
            });
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [processNextInCallQueue]);

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-200">
                            <Pill className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Antrean Farmasi</h1>
                            <p className="text-slate-500 font-medium">RSI Siti Hajar Mataram</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-sm font-semibold text-slate-600">
                            {isConnected ? 'LIVE MONITORING' : 'DISCONNECTED'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Display - Current Called */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Volume2 className={`w-32 h-32 ${isCalling ? 'text-emerald-600 animate-bounce' : 'text-slate-300'}`} />
                            </div>

                            <h2 className="text-xl font-bold text-slate-400 mb-8 flex items-center gap-2">
                                <Bell className="w-5 h-5" />
                                SEDANG DIPANGGIL
                            </h2>

                            <AnimatePresence mode="wait">
                                {queue.length > 0 ? (
                                    <motion.div
                                        key={queue[0].no_resep}
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 1.1, y: -20 }}
                                        className="flex flex-col items-center py-12"
                                    >
                                        <span className="text-7xl font-black text-emerald-600 mb-4 tabular-nums tracking-tighter">
                                            {queue[0].no_resep}
                                        </span>
                                        <h3 className="text-5xl font-extrabold text-slate-800 text-center uppercase tracking-tight mb-4">
                                            {queue[0].nama_pasien}
                                        </h3>
                                        <div className="flex items-center gap-2 text-slate-400 font-semibold bg-slate-50 px-6 py-2 rounded-full">
                                            <User className="w-5 h-5 text-slate-300" />
                                            No. Rawat: {queue[0].no_rawat}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="h-64 flex flex-col items-center justify-center text-slate-300 gap-4">
                                        <Clock className="w-16 h-16 opacity-20 animate-spin-slow" />
                                        <p className="text-xl font-medium">Menunggu antrean selanjutnya...</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </section>

                        {/* Waiting List */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Clock className="w-6 h-6 text-emerald-600" />
                                ANTREAN BERIKUTNYA
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AnimatePresence>
                                    {queue.slice(1).map((item, idx) => (
                                        <motion.div
                                            key={item.no_resep}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center"
                                        >
                                            <div>
                                                <p className="text-xs font-bold text-emerald-600 mb-1">NO. {item.no_resep}</p>
                                                <p className="text-xl font-bold text-slate-800 truncate max-w-[200px] uppercase">
                                                    {item.nama_pasien}
                                                </p>
                                            </div>
                                            <Volume2 className="w-6 h-6 text-slate-200" />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </section>
                    </div>

                    {/* History / Recent Panel */}
                    <div className="lg:col-span-1">
                        <section className="bg-slate-800 rounded-[2.5rem] p-8 shadow-2xl h-full text-white">
                            <h2 className="text-xl font-bold mb-8 flex items-center gap-2 opacity-70">
                                <Clock className="w-5 h-5 text-emerald-400" />
                                RIWAYAT TERAKHIR
                            </h2>

                            <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                                {history.length > 0 ? (
                                    history.map((item, idx) => (
                                        <div key={`${item.no_resep}-${idx}`} className="flex gap-4 group">
                                            <div className="flex flex-col items-center">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                                                <div className="w-px h-full bg-white/10 my-2" />
                                            </div>
                                            <div className="pb-6">
                                                <p className="text-xs font-bold text-emerald-400 mb-1">
                                                    {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                <p className="text-lg font-bold group-hover:text-emerald-300 transition-colors uppercase leading-tight">
                                                    {item.nama_pasien}
                                                </p>
                                                <p className="text-[10px] text-white/40 tracking-widest mt-1">RESEP: {item.no_resep}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-white/30 text-center py-12 italic">Belum ada data</p>
                                )}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer Info */}
                <footer className="mt-12 text-center text-slate-400 text-sm flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Pastikan volume speaker aktif untuk pemanggilan suara.
                    </div>
                </footer>
            </div>

            <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(25, 236, 154, 0.2);
          border-radius: 10px;
        }
      `}</style>
        </div>
    );
}
