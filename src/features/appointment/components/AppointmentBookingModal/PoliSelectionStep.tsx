import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { AppointmentFormData } from "../types/appointment";

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
  // Ambil daftar poliklinik dari dokter
  const poliklinikList = doctor.categories || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="h-12 w-12 rounded-full overflow-hidden shrink-0">
          {/* Simple Avatar Placeholder */}
          <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs font-bold">DR</div>
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{doctor.name}</p>
          <p className="text-sm text-muted-foreground">{doctor.specialization || "Dokter"}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Pilih Poliklinik <span className="text-red-500">*</span></Label>

          {/* Categories/Tags for Poliklinik */}
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {poliklinikList?.map((cat: any, idx: number) => (
              <button
                key={idx}
                type="button"
                className={`text-[12px] uppercase font-bold tracking-wider px-3 py-2 rounded-md transition-all duration-200 ${
                  formData.poliId === (cat.id || cat.slug || `${idx}`)
                    ? 'text-primary-foreground bg-primary border border-primary shadow-md'
                    : 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-primary/10 hover:border-primary hover:text-primary'
                }`}
                onClick={() => {
                  const selectedPoliId = cat.id || cat.slug || `${idx}`;
                  console.log('Poli dipilih:', {
                    id: cat.id,
                    name: cat.name,
                    slug: cat.slug,
                    selectedPoliId,
                    full_cat: cat
                  });

                  setFormData({
                    ...formData,
                    poliId: selectedPoliId, // gunakan ID yang telah ditentukan
                    poliName: cat.name
                  });

                  console.log('formData setelah pemilihan:', {
                    poliId: selectedPoliId,
                    poliName: cat.name
                  });
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

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