"use client";

import { MyPatientsComponent } from "./MyPatientsComponent";
import { History, Stethoscope } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export const AppointmentHistoryPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto py-8 pt-24 max-w-4xl px-4">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/25">
              <History className="h-7 w-7" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
            Riwayat Booking
          </h1>
          <p className="text-slate-500 text-center max-w-lg mx-auto">
            Kelola janji temu dan pantau riwayat pemeriksaan Anda di sini
          </p>

          {/* Quick Action */}
          <div className="flex justify-center mt-6">
            <Button asChild className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 shadow-lg shadow-cyan-500/25">
              <Link href="/dokters" className="gap-2">
                <Stethoscope className="h-4 w-4" />
                Buat Booking Baru
              </Link>
            </Button>
          </div>
        </div>

        {/* Content */}
        <MyPatientsComponent />

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-500 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Data diperbarui secara real-time
          </div>
        </div>
      </div>
    </div>
  );
};