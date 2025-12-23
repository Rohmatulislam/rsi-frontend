"use client";

import { ServiceHero, ServiceCTA } from "~/features/services";
import { InpatientPageSkeleton } from "~/components/shared/PageSkeletons";

// Modular Components
import { InpatientStepper } from "../components/InpatientStepper";
import { UnitGrid } from "../components/UnitGrid";
import { ClassGrid } from "../components/ClassGrid";
import { RoomGrid } from "../components/RoomGrid";
import { RoomDetail } from "../components/RoomDetail";
import { GeneralFacilities } from "../components/GeneralFacilities";

// Services and Constants
import { getFilteredRooms, transformInpatientData } from "../services/inpatientService";
import { unitImages, defaultInpatientImage, getUnitColor, generalFacilities } from "../constants/inpatientConstants";

import { useInpatientData } from "../hooks/useInpatientData";

export const RawatInapPage = () => {
    const {
        service,
        isLoading,
        displayUnits,
        filteredRooms,
        step,
        selectedUnit,
        selectedClass,
        selectedRoom,
        handleSelectUnit,
        handleSelectClass,
        handleSelectRoom,
        handleBack,
        setStep,
        setSelectedUnit
    } = useInpatientData();

    if (isLoading) {
        return <InpatientPageSkeleton />;
    }

    const whatsappLink = (roomDetail?: string) => {
        const text = roomDetail
            ? `Halo admin, saya ingin bertanya tentang ketersediaan kamar rawat inap ${roomDetail}`
            : `Halo admin, saya ingin bertanya tentang pendaftaran rawat inap di RSI Siti Hajar`;
        return `https://wa.me/6281234567890?text=${encodeURIComponent(text)}`;
    };

    return (
        <div className="min-h-screen">
            <ServiceHero
                badge="LAYANAN RAWAT INAP"
                title={service?.title || service?.name || "Fasilitas Rawat Inap"}
                highlightText={service?.subtitle || "Kenyamanan Seperti di Rumah"}
                subtitle={service?.description || "Berbagai pilihan akomodasi rawat inap mulai dari kelas 3 hingga VVIP suite"}
            />

            <section className="py-8 container mx-auto px-4">
                <InpatientStepper
                    step={step}
                    selectedUnit={selectedUnit}
                    selectedClass={selectedClass}
                    onSetStep={setStep}
                    onResetUnit={() => setSelectedUnit(null)}
                />

                {/* STEPS RENDERER */}
                {step === "building" && (
                    <UnitGrid
                        units={displayUnits}
                        onSelect={handleSelectUnit}
                    />
                )}

                {step === "class" && selectedUnit && (
                    <ClassGrid
                        selectedUnit={selectedUnit}
                        onSelectClass={handleSelectClass}
                        onBack={handleBack}
                    />
                )}

                {step === "room" && selectedUnit && selectedClass && (
                    <RoomGrid
                        selectedUnit={selectedUnit}
                        selectedClass={selectedClass}
                        rooms={filteredRooms}
                        onSelectRoom={handleSelectRoom}
                        onBack={handleBack}
                    />
                )}

                {step === "detail" && selectedClass && selectedUnit && (
                    <RoomDetail
                        selectedUnit={selectedUnit}
                        selectedClass={selectedClass}
                        selectedRoom={selectedRoom}
                        onBack={handleBack}
                        whatsappLink={whatsappLink}
                    />
                )}
            </section>

            <GeneralFacilities facilities={generalFacilities} />

            <ServiceCTA
                title="Siap untuk Rawat Inap?"
                subtitle="Tim admission kami siap membantu proses pendaftaran dan administrasi Anda 24 jam."
                primaryAction={{
                    label: "Hubungi Admission",
                    href: whatsappLink(selectedClass ? `${selectedClass.name}${selectedRoom ? ` - ${selectedRoom.id}` : ""} (${selectedUnit?.name || ""})` : undefined),
                    icon: "calendar",
                }}
                secondaryAction={{
                    label: "Pusat Bantuan",
                    href: "https://wa.me/6281234567890",
                }}
            />
        </div>
    );
};
