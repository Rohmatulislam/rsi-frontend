import { Button } from "~/components/ui/button";
import { CheckCircle2 } from "lucide-react";
// SuccessStep tidak memerlukan tipe dari appointment.ts karena tidak menggunakan prop yang kompleks

export const SuccessStep = ({ bookingCode }: { bookingCode: string }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 py-4">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      <div>
        <h3 className="text-lg font-bold">Pendaftaran Berhasil!</h3>
        <p className="text-muted-foreground max-w-xs mx-auto">
          Silakan datang 15 menit sebelum jadwal praktek dan tunjukkan kode booking ini di loket.
        </p>
      </div>

      <div className="w-full bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Kode Booking</p>
        <p className="text-3xl font-black font-mono tracking-wider">{bookingCode}</p>
      </div>

      <div className="flex flex-col w-full gap-2">
        <Button className="w-full rounded-xl" onClick={() => window.print()}>
          Cetak Bukti Pendaftaran
        </Button>
      </div>
    </div>
  );
};