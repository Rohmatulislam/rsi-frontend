"use client";

import { MyPatientsComponent } from "./MyPatientsComponent";

export const AppointmentHistoryPage = () => {
  return (
    <div className="container mx-auto py-8 pt-24 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Riwayat Booking Saya</h1>
        <p className="text-muted-foreground">
          Daftar pasien dan janji temu yang telah Anda daftarkan
        </p>
      </div>

      <MyPatientsComponent />
    </div>
  );
};