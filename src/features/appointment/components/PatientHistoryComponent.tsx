import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Calendar, Clock, User, MapPin, FileText } from "lucide-react";
import { usePatientHistory, AppointmentHistory } from "../api/getPatientHistory";

interface PatientHistoryProps {
  patientId: string; // MR number
}

export const PatientHistoryComponent = ({ patientId }: PatientHistoryProps) => {
  const { data: appointments, isLoading, error, refetch } = usePatientHistory(patientId);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-muted-foreground">Memuat riwayat booking...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Gagal memuat riwayat booking</p>
        <Button variant="outline" onClick={() => refetch()}>
          Coba Lagi
        </Button>
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Belum Ada Riwayat Booking</h3>
        <p className="text-muted-foreground">
          Janji temu yang Anda buat akan muncul di sini
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Riwayat Booking</h2>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Muat Ulang
        </Button>
      </div>
      
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-start">
                <span className="text-lg">{appointment.doctor.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  appointment.status === 'CONFIRMED' 
                    ? 'bg-green-100 text-green-800' 
                    : appointment.status === 'CANCELLED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {appointment.status}
                </span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{appointment.doctor.specialization}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Tanggal</p>
                    <p className="font-medium">
                      {new Date(appointment.appointmentDate).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Waktu</p>
                    <p className="font-medium">
                      {new Date(appointment.appointmentDate).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })} WIB
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Pasien</p>
                    <p className="font-medium">{appointment.patientName}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-muted-foreground">Kode Booking</p>
                    <p className="font-mono font-medium">{appointment.notes || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              {appointment.reason && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Keluhan/Alasan:</p>
                  <p className="text-sm">{appointment.reason}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};