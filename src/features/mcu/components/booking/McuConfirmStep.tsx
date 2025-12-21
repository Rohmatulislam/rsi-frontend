import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { McuBookingFormData, McuPackage, MCU_TIME_SLOTS } from "../../services/mcuService";

interface McuConfirmStepProps {
    formData: McuBookingFormData;
    packageInfo: McuPackage;
}

export const McuConfirmStep = ({ formData, packageInfo }: McuConfirmStepProps) => {
    return (
        <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                <div>
                    <p className="text-sm text-muted-foreground">Paket MCU</p>
                    <p className="font-bold text-lg">{packageInfo.name}</p>
                    <p className="text-primary font-bold">Rp {packageInfo.price?.toLocaleString('id-ID')}</p>
                </div>

                <hr />

                <div>
                    <p className="text-sm text-muted-foreground">Jadwal</p>
                    <p className="font-medium">
                        {formData.date && format(formData.date, 'EEEE, dd MMMM yyyy', { locale: localeId })}
                    </p>
                    <p className="text-sm">{MCU_TIME_SLOTS.find(s => s.id === formData.timeSlot)?.label}</p>
                </div>

                <hr />

                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Data Pasien</p>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{formData.fullName}</p>
                    <div className="mt-1 space-y-0.5">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            {formData.patientType === 'old' ? `No. RM: ${formData.mrNumber}` : `NIK: ${formData.nik}`}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">WhatsApp: {formData.phone}</p>
                        {formData.address && <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">Alamat: {formData.address}</p>}
                    </div>
                </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                    <strong>Persiapan MCU:</strong> Puasa 10-12 jam sebelum pemeriksaan. Hanya minum air putih.
                </p>
            </div>
        </div>
    );
};
