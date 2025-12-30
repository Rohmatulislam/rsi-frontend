"use client";

import { useGetAdminAuditLogs, AuditLog } from "~/features/admin/api/adminAuditApi";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
    History,
    User,
    Globe,
    Activity,
    FileJson,
    Search,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "~/components/ui/collapsible";

const ACTION_COLORS: Record<string, string> = {
    POST: "bg-emerald-100 text-emerald-700 border-emerald-200",
    PATCH: "bg-blue-100 text-blue-700 border-blue-200",
    PUT: "bg-amber-100 text-amber-700 border-amber-200",
    DELETE: "bg-red-100 text-red-700 border-red-200",
};

export default function AdminAuditLogsPage() {
    const { data: logs, isLoading } = useGetAdminAuditLogs(200);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedLog, setExpandedLog] = useState<string | null>(null);

    const filteredLogs = logs?.filter(log =>
        log.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit flex items-center gap-3">
                        <History className="h-8 w-8 text-primary" />
                        Audit Logs
                    </h1>
                    <p className="text-slate-500 mt-1">Riwayat aktivitas administrative dan perubahan sistem.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Cari berdasarkan email, resource, atau method..."
                        className="pl-10 h-11 rounded-xl border-slate-200 shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                            <tr>
                                <th className="p-4 font-medium w-12">#</th>
                                <th className="p-4 font-medium">Timestamp</th>
                                <th className="p-4 font-medium">User</th>
                                <th className="p-4 font-medium">Action</th>
                                <th className="p-4 font-medium">Resource</th>
                                <th className="p-4 font-medium text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredLogs.map((log, index) => (
                                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-4 text-slate-400 font-mono text-xs">
                                        {index + 1}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-900">
                                                {format(new Date(log.createdAt), "dd MMM yyyy", { locale: id })}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {format(new Date(log.createdAt), "HH:mm:ss")}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-2 text-slate-700 font-medium">
                                                <User className="h-3.5 w-3.5 text-slate-400" />
                                                {log.userEmail}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                                <Globe className="h-3 w-3" />
                                                {log.ipAddress || "Unknown IP"}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant="outline" className={`font-mono text-[10px] px-2 py-0 ${ACTION_COLORS[log.action] || "bg-slate-100 text-slate-700"}`}>
                                            {log.action}
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 max-w-[200px]">
                                            <Activity className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate text-slate-600 font-mono text-xs">{log.resource}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Collapsible
                                            open={expandedLog === log.id}
                                            onOpenChange={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                                        >
                                            <CollapsibleTrigger asChild>
                                                <button className="inline-flex items-center gap-2 text-primary hover:underline text-xs font-medium">
                                                    <FileJson className="h-3.5 w-3.5" />
                                                    {expandedLog === log.id ? "Hide Details" : "Show Details"}
                                                    {expandedLog === log.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                                </button>
                                            </CollapsibleTrigger>
                                        </Collapsible>
                                    </td>
                                </tr>
                            ))}
                            {filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-slate-500 italic">
                                        Belum ada log yang sesuai dengan filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Float Detail Overlay if log is expanded */}
            {expandedLog && (
                <div className="mt-4 p-6 bg-slate-900 rounded-2xl text-slate-300 font-mono text-xs overflow-auto max-h-[400px] border border-slate-800 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
                        <span className="text-primary font-bold">LOG DATA DETAILS</span>
                        <button
                            onClick={() => setExpandedLog(null)}
                            className="text-slate-500 hover:text-white"
                        >
                            [Esc to close]
                        </button>
                    </div>
                    <pre className="whitespace-pre-wrap">
                        {JSON.stringify(JSON.parse(filteredLogs.find(l => l.id === expandedLog)?.details || "{}"), null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
