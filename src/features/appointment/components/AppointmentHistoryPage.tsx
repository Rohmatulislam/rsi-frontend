import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { PatientHistoryComponent } from "./PatientHistoryComponent";

export const AppointmentHistoryPage = () => {
  const [patientId, setPatientId] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientId.trim()) {
      setShowHistory(true);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Riwayat Booking Janji Temu</h1>
        <p className="text-muted-foreground">
          Masukkan nomor rekam medis Anda untuk melihat riwayat booking
        </p>
      </div>

      <Card className="p-6 mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Masukkan nomor rekam medis (No. RM)"
              className="h-12 text-lg"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 px-8">
            Lihat Riwayat
          </Button>
        </form>
      </Card>

      {showHistory && (
        <div className="mt-6">
          <PatientHistoryComponent patientId={patientId} />
        </div>
      )}
    </div>
  );
};