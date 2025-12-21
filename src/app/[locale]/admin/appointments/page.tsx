"use client";

import { useAdminAppointments } from "~/features/admin/api/getAdminAppointments";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function AdminAppointmentsPage() {
    const { data: report, isLoading } = useAdminAppointments();

    if (isLoading) return <div>Loading...</div>;

    const appointments = report?.appointments || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
                <p className="text-slate-500">Manage all patient appointments</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                            <tr>
                                <th className="p-4 font-medium">Date & Time</th>
                                <th className="p-4 font-medium">Patient</th>
                                <th className="p-4 font-medium">Doctor</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Notes (No. Rawat)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {appointments.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-50/50">
                                    <td className="p-4 text-slate-600">
                                        {format(new Date(app.appointmentDate), "dd MMM yyyy HH:mm", { locale: id })}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-slate-900">{app.patientName}</div>
                                        <div className="text-xs text-slate-500">RM: {app.patientId}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-slate-900">{app.doctor.name}</div>
                                        <div className="text-xs text-slate-500">{app.doctor.specialization}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${app.status === 'scheduled' ? 'bg-orange-100 text-orange-700' :
                                                app.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500 max-w-xs truncate">
                                        {app.notes}
                                    </td>
                                </tr>
                            ))}
                            {appointments.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        No appointments found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
