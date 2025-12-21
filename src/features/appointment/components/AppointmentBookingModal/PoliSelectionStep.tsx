import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { AppointmentFormData } from "~/features/appointment/services/appointmentService";
import { useGetActivePoli } from "~/features/doctor/api/getActivePoli";
import Image from "next/image";
import { Stethoscope } from "lucide-react";

interface PoliSelectionStepProps {
  formData: AppointmentFormData;
  setFormData: React.Dispatch<React.SetStateAction<AppointmentFormData>>;
  handleNext: () => void;
  doctor: any;
}

export const PoliSelectionStep = ({
  formData,
  setFormData,
  handleNext,
  doctor
}: PoliSelectionStepProps) => {
  // Ambil daftar poliklinik dengan jadwal aktif dari SIMRS
  const { data: activePolis, isLoading, error } = useGetActivePoli();

  // Filter hanya poliklinik yang sesuai dengan dokter ini (berdasarkan kategori dokter)
  const doctorCategoryNames = doctor?.categories?.map((cat: any) => cat.name) || [];
  const filteredPolis = !doctor
    ? activePolis
    : activePolis?.filter((poli: any) =>
      doctorCategoryNames.length === 0 ||
      doctorCategoryNames.some((catName: string) =>
        poli.nm_poli.toLowerCase().includes(catName.toLowerCase()) ||
        catName.toLowerCase().includes(poli.nm_poli.toLowerCase())
      )
    ) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="h-12 w-12 rounded-full overflow-hidden shrink-0">
            {doctor?.imageUrl ? (
              <Image
                src={doctor.imageUrl}
                alt={doctor?.name || "Dokter"}
                width={48}
                height={48}
                className="object-cover w-full h-full"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
                <Stethoscope className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">{doctor?.name || "Dokter Umum"}</p>
            <p className="text-sm text-muted-foreground">{doctor?.specialization || "Umum"}</p>
          </div>
        </div>

        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="h-12 w-12 rounded-full overflow-hidden shrink-0">
            {doctor?.imageUrl ? (
              <Image
                src={doctor.imageUrl}
                alt={doctor?.name || "Dokter"}
                width={48}
                height={48}
                className="object-cover w-full h-full"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
                <Stethoscope className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">{doctor?.name || "Dokter Umum"}</p>
            <p className="text-sm text-muted-foreground">{doctor?.specialization || "Umum"}</p>
          </div>
        </div>

        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <p className="text-red-800 dark:text-red-200">
            Gagal memuat poliklinik. Silakan coba lagi nanti.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="h-12 w-12 rounded-full overflow-hidden shrink-0">
          {doctor?.imageUrl ? (
            <Image
              src={doctor.imageUrl}
              alt={doctor?.name || "Dokter"}
              width={48}
              height={48}
              className="object-cover w-full h-full"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
              <Stethoscope className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </div>
          )}
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{doctor?.name || "Dokter Umum"}</p>
          <p className="text-sm text-muted-foreground">{doctor?.specialization || "Umum"}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Pilih Poliklinik <span className="text-red-500">*</span></Label>

          {/* Categories/Tags for Poliklinik */}
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {filteredPolis?.map((poli: any, idx: number) => (
              <button
                key={poli.kd_poli}
                type="button"
                className={`text-[12px] uppercase font-bold tracking-wider px-3 py-2 rounded-md transition-all duration-200 ${formData.poliId === poli.kd_poli
                  ? 'text-primary-foreground bg-primary border border-primary shadow-md'
                  : 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-primary/10 hover:border-primary hover:text-primary'
                  }`}
                onClick={() => {
                  console.log('Poli dipilih:', {
                    id: poli.kd_poli,
                    name: poli.nm_poli,
                    full_poli: poli
                  });

                  setFormData({
                    ...formData,
                    poliId: poli.kd_poli, // gunakan kode poli dari SIMRS
                    poliName: poli.nm_poli
                  });

                  console.log('formData setelah pemilihan:', {
                    poliId: poli.kd_poli,
                    poliName: poli.nm_poli
                  });
                }}
              >
                {poli.nm_poli}
              </button>
            ))}
          </div>

          {filteredPolis && filteredPolis.length === 0 && (
            <p className="text-sm text-red-600 dark:text-red-400">
              Tidak ada poliklinik aktif tersedia untuk dokter ini saat ini.
            </p>
          )}

          <p className="text-xs text-muted-foreground">Klik pada tag poliklinik untuk memilih.</p>
        </div>

        {formData.poliId && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <p className="font-medium text-blue-900 dark:text-blue-100">
              Anda memilih: {formData.poliName}
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              ID Poliklinik: {formData.poliId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};