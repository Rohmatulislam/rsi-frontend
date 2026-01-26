'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Volume2, Pill, Clock, User, Bell,
    AlertCircle, ChevronRight, CheckCircle2,
    Activity, ListFilter, Beaker
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

interface ReadyPrescription {
    no_resep: string;
    nm_pasien: string;
    no_rawat: string;
    jam: string;
    tgl_penyerahan: string | null;
    is_racik: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000/api';

export default function PharmacyQueuePage() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [activeTab, setActiveTab] = useState<'waiting' | 'done'>('done'); // Default to 'done' tab
    const [queueData, setQueueData] = useState<ReadyPrescription[]>([]);
    const [latestCalled, setLatestCalled] = useState<ReadyPrescription | null>(null);
    const [isCalling, setIsCalling] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isAutoScroll, setIsAutoScroll] = useState(true); // Auto-scroll enabled by default
    const voiceQueue = useRef<any[]>([]);
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Statistics
    const stats = {
        total: queueData.length,
        done: queueData.filter(q => q.tgl_penyerahan && q.tgl_penyerahan !== '0000-00-00').length,
        waiting: queueData.filter(q => !q.tgl_penyerahan || q.tgl_penyerahan === '0000-00-00').length,
    };

    const fetchQueue = async () => {
        try {
            const response = await axios.get(`${API_URL}/farmasi/queue/daily`);
            setQueueData(response.data);
        } catch (error) {
            console.error('Failed to fetch queue', error);
        }
    };

    const speakPatient = useCallback((data: any, repeatCount: number = 1) => {
        if (!window.speechSynthesis) return;

        const utterance = new SpeechSynthesisUtterance();
        utterance.text = `Nomor resep ${data.no_resep.split('').join(' ')}, atas nama ${data.nama_pasien}, silakan ambil obat di loket Farmasi.`;
        utterance.lang = 'id-ID';
        utterance.rate = 0.85;
        utterance.pitch = 1.1;

        utterance.onstart = () => {
            setIsCalling(true);
            setLatestCalled({
                no_resep: data.no_resep,
                nm_pasien: data.nama_pasien,
                no_rawat: data.no_rawat,
                jam: '',
                tgl_penyerahan: new Date().toISOString(),
                is_racik: 0
            });
        };
        utterance.onend = () => {
            // Check if we need to repeat (call 3 times total)
            if (repeatCount < 3) {
                setTimeout(() => {
                    speakPatient(data, repeatCount + 1);
                }, 1500); // 1.5 second pause between repeats
            } else {
                // All 3 calls done, move to next patient in queue
                setIsCalling(false);
                setTimeout(() => {
                    if (voiceQueue.current.length > 0) {
                        const next = voiceQueue.current.shift();
                        speakPatient(next, 1); // Start fresh with count 1
                    }
                }, 3000);
            }
        };

        window.speechSynthesis.speak(utterance);
    }, []);

    // Test sound function
    const testSound = useCallback(() => {
        if (!window.speechSynthesis) {
            toast.error('Browser tidak mendukung Text-to-Speech');
            return;
        }
        const testUtterance = new SpeechSynthesisUtterance();
        testUtterance.text = 'Nomor resep 1 2 3 4, atas nama Pasien Test, silakan ambil obat di loket Farmasi.';
        testUtterance.lang = 'id-ID';
        testUtterance.rate = 0.85;
        testUtterance.pitch = 1.1;

        testUtterance.onstart = () => toast.info('🔊 Memainkan suara test...');
        testUtterance.onend = () => toast.success('✅ Test suara selesai!');
        testUtterance.onerror = () => toast.error('❌ Gagal memutar suara');

        window.speechSynthesis.speak(testUtterance);
    }, []);

    useEffect(() => {
        fetchQueue();
        const backendUrl = API_URL.replace(/\/api\/?$/, '');
        const newSocket = io(`${backendUrl}/pharmacy`, {
            transports: ['websocket'],
            reconnectionAttempts: 5,
            timeout: 10000
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
            newSocket.emit('join-queue-room');
        });

        newSocket.on('disconnect', () => setIsConnected(false));

        newSocket.on('queue-updated', () => {
            fetchQueue();
        });

        newSocket.on('prescription-ready', (data: any) => {
            if (window.speechSynthesis.speaking) {
                voiceQueue.current.push(data);
            } else {
                speakPatient(data);
            }
            toast.info(`PASIEN DIPANGGIL: ${data.nama_pasien}`);
        });

        setSocket(newSocket);
        return () => { newSocket.disconnect(); };
    }, [speakPatient]);

    // Auto-scroll effect
    useEffect(() => {
        if (isAutoScroll && tableContainerRef.current) {
            const container = tableContainerRef.current;

            scrollIntervalRef.current = setInterval(() => {
                if (!container) return;

                const { scrollTop, scrollHeight, clientHeight } = container;
                const maxScroll = scrollHeight - clientHeight;

                if (scrollTop >= maxScroll - 5) {
                    // Reached bottom, reset to top after a brief pause
                    setTimeout(() => {
                        if (container) container.scrollTop = 0;
                    }, 1500); // 1.5 second pause at bottom before resetting
                } else {
                    container.scrollTop += 1; // Smooth 1px scroll down
                }
            }, 30); // ~33fps
        }

        return () => {
            if (scrollIntervalRef.current) {
                clearInterval(scrollIntervalRef.current);
            }
        };
    }, [isAutoScroll, queueData]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-plus-jakarta-sans antialiased text-slate-800">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none opacity-30">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-200 blur-[100px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 blur-[100px] rounded-full" />
            </div>

            <div className="relative max-w-[1600px] mx-auto p-4 md:p-8 space-y-8">
                {/* Header Dashboard Style */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-emerald-600 rounded-3xl shadow-xl shadow-emerald-200 flex items-center justify-center transform hover:rotate-6 transition-transform">
                            <Pill className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Queue Dashboard</h1>
                            <p className="text-slate-500 font-medium flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                Real-time Pharmacy Service
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Test Sound Button */}
                        <button
                            onClick={testSound}
                            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all font-bold text-sm"
                        >
                            <Volume2 className="w-5 h-5" />
                            Test Suara
                        </button>

                        {/* Server Status */}
                        <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className={`p-4 rounded-xl ${isConnected ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                <Activity className={`w-6 h-6 ${isConnected ? 'text-emerald-500' : 'text-red-500'} ${isConnected ? 'animate-pulse' : ''}`} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Server Status</p>
                                <p className={`text-lg font-black ${isConnected ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {isConnected ? 'STABLE CONNECTED' : 'DISCONNECTED'}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Top Stats & Current Call Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Main Calling Card */}
                    <div className="xl:col-span-3">
                        <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-white relative overflow-hidden h-full flex flex-col justify-center min-h-[450px]">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                                <Volume2 className="w-64 h-64" />
                            </div>

                            <div className="flex items-center gap-3 mb-12">
                                <div className="px-5 py-2 bg-emerald-50 rounded-full">
                                    <span className="text-emerald-700 font-bold text-sm tracking-widest uppercase">Now Calling</span>
                                </div>
                                {isCalling && (
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />)}
                                    </div>
                                )}
                            </div>

                            <AnimatePresence mode="wait">
                                {latestCalled ? (
                                    <motion.div
                                        key={latestCalled.no_resep}
                                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 1.1, y: -30 }}
                                        className="flex flex-col items-start gap-6"
                                    >
                                        <div className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] shadow-xl font-mono text-5xl font-black tracking-tighter">
                                            {latestCalled.no_resep}
                                        </div>
                                        <h2 className="text-7xl font-black text-slate-900 leading-tight uppercase max-w-4xl">
                                            {latestCalled.nm_pasien}
                                        </h2>
                                        <div className="flex flex-wrap gap-4 mt-4">
                                            <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                                                <User className="w-6 h-6 text-slate-400" />
                                                <span className="font-bold text-slate-600 text-lg uppercase">{latestCalled.no_rawat}</span>
                                            </div>
                                            <div className="flex items-center gap-3 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100">
                                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                                <span className="font-bold text-emerald-700 text-lg">SIAP DIAMBIL</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-slate-300 gap-6 py-12">
                                        <Clock className="w-24 h-24 stroke-[1px] animate-spin-slow opacity-20" />
                                        <p className="text-2xl font-bold italic tracking-wide">Standby - Menunggu Antrean Baru</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Side Stats Cards */}
                    <div className="xl:col-span-1 space-y-6">
                        <StatCard icon={<ListFilter />} label="Total Antrean" value={stats.total} color="bg-blue-600" lightColor="bg-blue-50" />
                        <StatCard icon={<Clock />} label="Menunggu" value={stats.waiting} color="bg-amber-500" lightColor="bg-amber-50" animate={stats.waiting > 0} />
                        <StatCard icon={<CheckCircle2 />} label="Validated" value={stats.done} color="bg-emerald-600" lightColor="bg-emerald-50" />
                    </div>
                </div>

                {/* Global Queue Monitoring Table Section */}
                <section className="bg-white rounded-[3rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                                <Activity className="w-6 h-6 text-slate-500" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">Monitoring Antrean</h2>
                        </div>

                        <div className="flex p-1.5 bg-slate-100 rounded-[1.5rem] w-full md:w-auto">
                            <TabButton active={activeTab === 'waiting'} onClick={() => setActiveTab('waiting')} label={`Dalam Antrean (${stats.waiting})`} />
                            <TabButton active={activeTab === 'done'} onClick={() => setActiveTab('done')} label={`Sudah Selesai (${stats.done})`} />
                        </div>

                        {/* Auto-scroll Toggle */}
                        <button
                            onClick={() => setIsAutoScroll(!isAutoScroll)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isAutoScroll
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                }`}
                        >
                            <ChevronRight className={`w-4 h-4 transition-transform ${isAutoScroll ? 'animate-bounce' : ''}`} />
                            {isAutoScroll ? 'Auto-Scroll ON' : 'Auto-Scroll OFF'}
                        </button>
                    </div>

                    <div ref={tableContainerRef} className="overflow-x-auto max-h-[400px] overflow-y-auto scroll-smooth">
                        <table className="w-full text-left border-separate border-spacing-y-3">
                            <thead className="sticky top-0 z-10 bg-white">
                                <tr className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                                    <th className="px-6 py-4 bg-white">No. Resep</th>
                                    <th className="px-6 py-4 bg-white">Nama Pasien</th>
                                    <th className="px-6 py-4 text-center bg-white">Tipe Obat</th>
                                    <th className="px-6 py-4 text-center bg-white">Jam Resep</th>
                                    <th className="px-6 py-4 text-right bg-white">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence mode="popLayout">
                                    {queueData
                                        .filter(item => {
                                            const isDone = item.tgl_penyerahan && item.tgl_penyerahan !== '0000-00-00';
                                            return activeTab === 'done' ? isDone : !isDone;
                                        })
                                        .map((item) => (
                                            <motion.tr
                                                layout
                                                key={item.no_resep}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="group hover:bg-slate-50 transition-all cursor-default"
                                            >
                                                <td className="px-6 py-5 bg-white border-y border-l border-slate-100 first:rounded-l-2xl">
                                                    <span className="font-mono font-black text-slate-900">{item.no_resep}</span>
                                                </td>
                                                <td className="px-6 py-5 bg-white border-y border-slate-100 font-bold text-slate-800 uppercase text-lg">
                                                    {item.nm_pasien}
                                                </td>
                                                <td className="px-6 py-5 bg-white border-y border-slate-100 text-center">
                                                    {item.is_racik ? (
                                                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-black ring-1 ring-inset ring-purple-100">
                                                            <Beaker className="w-3 h-3" /> RACIK
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-black ring-1 ring-inset ring-blue-100">
                                                            <Pill className="w-3 h-3" /> NON-RACIK
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 bg-white border-y border-slate-100 text-center font-bold text-slate-500">
                                                    {item.jam}
                                                </td>
                                                <td className="px-6 py-5 bg-white border-y border-r border-slate-100 last:rounded-r-2xl text-right">
                                                    {activeTab === 'done' ? (
                                                        <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-xs font-black uppercase tracking-tighter">Selesai</span>
                                                    ) : (
                                                        <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-xs font-black uppercase tracking-tighter animate-pulse">Menunggu</span>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </section>

                <footer className="text-center py-10 opacity-40 hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-center gap-6 text-sm font-bold text-slate-500 uppercase tracking-widest">
                        <span className="flex items-center gap-2 border-r border-slate-300 pr-6"><Bell className="w-4 h-4" /> Speaker Aktif</span>
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Update Otomatis (10s)</span>
                    </div>
                </footer>
            </div>

            <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
        </div>
    );
}

function StatCard({ icon, label, value, color, lightColor, animate = false }: any) {
    return (
        <div className={`bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6 group hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-1 transition-all duration-300`}>
            <div className={`w-16 h-16 ${lightColor} ${color.replace('bg-', 'text-')} rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform`}>
                {React.cloneElement(icon, { className: 'w-8 h-8' })}
            </div>
            <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
                <p className={`text-4xl font-black text-slate-900 flex items-center gap-2`}>
                    {value}
                    {animate && <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />}
                </p>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`px-8 py-3 rounded-[1.2rem] text-sm font-black transition-all ${active
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-slate-500 hover:text-slate-900'
                }`}
        >
            {label}
        </button>
    );
}
