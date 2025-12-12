import { LucideIcon } from "lucide-react";

type StatsCardProps = {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    color?: "primary" | "blue" | "green" | "red" | "orange";
};

export const StatsCard = ({ title, value, icon: Icon, trend, trendUp, color = "primary" }: StatsCardProps) => {

    const colorClasses = {
        primary: "bg-primary/10 text-primary",
        blue: "bg-blue-500/10 text-blue-500",
        green: "bg-green-500/10 text-green-500",
        red: "bg-red-500/10 text-red-500",
        orange: "bg-orange-500/10 text-orange-500",
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            {trend && (
                <div className={`mt-4 text-sm flex items-center gap-1 ${trendUp ? "text-green-600" : "text-red-600"}`}>
                    <span>{trendUp ? "↑" : "↓"}</span>
                    <span>{trend}</span>
                    <span className="text-slate-400 ml-1">vs last month</span>
                </div>
            )}
        </div>
    );
};
