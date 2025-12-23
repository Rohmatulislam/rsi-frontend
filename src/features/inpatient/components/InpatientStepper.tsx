import React from "react";
import { ChevronRight } from "lucide-react";
import { InpatientStep, InpatientUnit, RoomClass } from "../services/inpatientService";

interface InpatientStepperProps {
    step: InpatientStep;
    selectedUnit: InpatientUnit | null;
    selectedClass: RoomClass | null;
    onSetStep: (step: InpatientStep) => void;
    onResetUnit: () => void;
}

export const InpatientStepper: React.FC<InpatientStepperProps> = ({
    step,
    selectedUnit,
    selectedClass,
    onSetStep,
    onResetUnit
}) => {
    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
            <span
                className={`cursor-pointer transition-colors ${step === "building" ? "font-bold text-primary" : "hover:text-primary"}`}
                onClick={() => { onSetStep("building"); onResetUnit(); }}
            >
                Pilih Unit
            </span>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
            <span
                className={`transition-colors ${step === "class" ? "font-bold text-primary" : selectedUnit ? "cursor-pointer hover:text-primary" : ""}`}
                onClick={() => selectedUnit && onSetStep("class")}
            >
                {selectedUnit ? `Kelas (${selectedUnit.name})` : "Pilih Kelas"}
            </span>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
            <span
                className={`transition-colors ${step === "room" ? "font-bold text-primary" : (selectedUnit && selectedClass) ? "cursor-pointer hover:text-primary" : ""}`}
                onClick={() => selectedUnit && selectedClass && onSetStep("room")}
            >
                {selectedClass ? `Kamar (${selectedClass.name})` : "Pilih Kamar"}
            </span>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
            <span className={step === "detail" ? "font-bold text-primary" : ""}>
                Detail Kamar
            </span>
        </div>
    );
};
