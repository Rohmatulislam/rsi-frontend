"use client";

import { MyPatientsComponent } from "./MyPatientsComponent";
import { History, Stethoscope } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export const AppointmentHistoryPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 pt-24 max-w-4xl px-4">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary text-primary-foreground shadow-md">
              <History className="h-7 w-7" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-3">
            Riwayat Booking
          </h1>
          <p className="text-muted-foreground text-center max-w-lg mx-auto">
            Kelola janji temu dan pantau riwayat pemeriksaan Anda di sini
          </p>

          {/* Quick Action */}
          <div className="flex justify-center mt-6">
            <Button asChild className="shadow-md">
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-muted-foreground text-sm shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Data diperbarui secara real-time
          </div>
        </div>
      </div>
    </div>
  );
};