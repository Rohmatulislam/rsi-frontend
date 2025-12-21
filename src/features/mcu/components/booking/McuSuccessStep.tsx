import { CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { McuBookingFormData, McuPackage } from "../../services/mcuService";

interface McuSuccessStepProps {
    formData: McuBookingFormData;
    packageInfo: McuPackage;
}

export const McuSuccessStep = ({ formData, packageInfo }: McuSuccessStepProps) => {
    return (
        <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-green-600">Reservasi Berhasil!</h3>
                <p className="text-muted-foreground mt-2">
                    Kami akan menghubungi Anda melalui WhatsApp untuk konfirmasi lebih lanjut.
                </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
                <p className="font-medium">{packageInfo.name}</p>
                <p className="text-sm text-muted-foreground">
                    {formData.date && format(formData.date, 'EEEE, dd MMMM yyyy', { locale: localeId })}
                </p>
            </div>
        </div>
    );
};
