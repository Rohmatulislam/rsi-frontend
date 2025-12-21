"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Activity, Beaker, Heart } from "lucide-react";

const mockLabData = [
    { date: "Jan", hb: 13.5, glucose: 95, cholesterol: 180 },
    { date: "Feb", hb: 13.2, glucose: 102, cholesterol: 185 },
    { date: "Mar", hb: 13.8, glucose: 98, cholesterol: 175 },
    { date: "Apr", hb: 14.0, glucose: 95, cholesterol: 170 },
    { date: "Mei", hb: 13.9, glucose: 92, cholesterol: 165 },
    { date: "Jun", hb: 14.1, glucose: 90, cholesterol: 160 },
];

export const LabTrends = () => {
    return (
        <Card className="shadow-sm border-slate-100 dark:border-slate-800">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Beaker className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Tren Histori Kesehatan</CardTitle>
                            <CardDescription>Visualisasi parameter laboratorium terakhir Anda</CardDescription>
                        </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-normal">Updated: 21 Des 2025</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockLabData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#64748B' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#64748B' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    fontSize: '12px'
                                }}
                            />
                            <Legend verticalAlign="top" height={36} iconType="circle" />
                            <Line
                                type="monotone"
                                dataKey="glucose"
                                name="Gula Darah"
                                stroke="#3B82F6"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#3B82F6' }}
                                activeDot={{ r: 6 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="cholesterol"
                                name="Kolesterol"
                                stroke="#EF4444"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#EF4444' }}
                                activeDot={{ r: 6 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="hb"
                                name="Hemoglobin"
                                stroke="#10B981"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#10B981' }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Terakhir</p>
                        <p className="font-bold text-lg text-primary">90</p>
                        <p className="text-[10px] text-muted-foreground italic">mg/dL</p>
                    </div>
                    <div className="text-center border-x">
                        <p className="text-xs text-muted-foreground mb-1">Terakhir</p>
                        <p className="font-bold text-lg text-red-500">160</p>
                        <p className="text-[10px] text-muted-foreground italic">mg/dL</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Terakhir</p>
                        <p className="font-bold text-lg text-green-500">14.1</p>
                        <p className="text-[10px] text-muted-foreground italic">g/dL</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
