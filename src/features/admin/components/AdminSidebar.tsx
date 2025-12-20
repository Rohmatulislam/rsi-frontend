"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Users, LogOut, Clock, User, Shield, FileText, Info, Stethoscope } from "lucide-react";
import { useAuth, UserRole } from "~/features/auth/hook/useAuth";
import { Badge } from "~/components/ui/badge";

// Role display names in Indonesian
const ROLE_LABELS: Record<UserRole, string> = {
    ADMIN: "Administrator",
    DOCTOR: "Dokter",
    NURSE: "Perawat",
    STAFF: "Staff",
    PATIENT: "Pasien",
};

// Role badge colors
const ROLE_COLORS: Record<UserRole, string> = {
    ADMIN: "bg-red-500",
    DOCTOR: "bg-blue-500",
    NURSE: "bg-green-500",
    STAFF: "bg-purple-500",
    PATIENT: "bg-slate-500",
};

export const AdminSidebar = () => {
    const pathname = usePathname();
    const { user, logout, isLoading, role, isAdmin } = useAuth();

    // Define menu items with role-based access
    const allMenuItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["ADMIN", "DOCTOR", "NURSE", "STAFF"] as UserRole[] },
        { href: "/admin/appointments", label: "Appointments", icon: Calendar, roles: ["ADMIN", "DOCTOR", "NURSE", "STAFF"] as UserRole[] },
        { href: "/admin/doctors", label: "Doctors", icon: Users, roles: ["ADMIN"] as UserRole[] },
        { href: "/admin/schedules", label: "Schedules", icon: Clock, roles: ["ADMIN", "DOCTOR"] as UserRole[] },
        { href: "/admin/articles", label: "Articles", icon: FileText, roles: ["ADMIN"] as UserRole[] },
        { href: "/admin/services", label: "Manajemen Layanan", icon: Stethoscope, roles: ["ADMIN"] as UserRole[] },
        { href: "/admin/about", label: "About Page", icon: Info, roles: ["ADMIN"] as UserRole[] },
    ];

    // Filter menu items based on user role
    const menuItems = allMenuItems.filter((item) => item.roles.includes(role));

    return (
        <div className="w-64 bg-sidebar min-h-screen text-sidebar-foreground flex flex-col border-r border-sidebar-border shadow-sm">
            <div className="p-6 border-b border-sidebar-border">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-primary">RSI</span>
                    <span className="text-sidebar-foreground">Admin</span>
                </h1>
            </div>

            {/* User Info with Role Badge */}
            <div className="p-4 border-b border-sidebar-border">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center border border-sidebar-border shadow-sm">
                        {isAdmin ? (
                            <Shield className="w-5 h-5 text-destructive" />
                        ) : (
                            <User className="w-5 h-5 text-sidebar-foreground/70" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                            {user?.name || "User"}
                        </p>
                        <Badge className={`${ROLE_COLORS[role]} text-white text-[10px] px-2 py-0 border-0 shadow-sm`}>
                            {ROLE_LABELS[role]}
                        </Badge>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md font-medium"
                                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/60"}`} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-sidebar-border">
                <button
                    onClick={logout}
                    disabled={isLoading}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};
