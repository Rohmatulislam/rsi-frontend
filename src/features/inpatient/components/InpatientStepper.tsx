import React from "react";
import { ChevronRight } from "lucide-react";
import { InpatientStep, Building, RoomClass } from "../services/inpatientService";

interface InpatientStepperProps {
    step: InpatientStep;
    selectedBuilding: Building | null;
    selectedClass: RoomClass | null;
    onSetStep: (step: InpatientStep) => void;
    onResetBuilding: () => void;
}

export const InpatientStepper: React.FC<InpatientStepperProps> = ({
    step,
    selectedBuilding,
    selectedClass,
    onSetStep,
    onResetBuilding
}) => {
    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
            <span
                className={`cursor-pointer transition-colors ${step === "building" ? "font-bold text-primary" : "hover:text-primary"}`}
                onClick={() => { onSetStep("building"); onResetBuilding(); }}
            >
                Pilih Gedung
            </span>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
            <span
                className={`transition-colors ${step === "class" ? "font-bold text-primary" : selectedBuilding ? "cursor-pointer hover:text-primary" : ""}`}
                onClick={() => selectedBuilding && onSetStep("class")}
            >
                {selectedBuilding ? `Kelas (${selectedBuilding.name})` : "Pilih Kelas"}
            </span>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
            <span
                className={`transition-colors ${step === "room" ? "font-bold text-primary" : (selectedBuilding && selectedClass) ? "cursor-pointer hover:text-primary" : ""}`}
                onClick={() => selectedBuilding && selectedClass && onSetStep("room")}
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
