"use client";

import { useState } from "react";
import { ServiceHero, ServiceCTA } from "~/features/services";
import { useGetServiceBySlug } from "~/features/services/api/getServiceBySlug";
import { Building, RoomClass, InpatientStep, InpatientRoom } from "../services/inpatientService";
import { useGetBedAvailability } from "../api/getBedAvailability";
import { useGetRooms } from "../api/getRooms";
import { InpatientPageSkeleton } from "~/components/shared/PageSkeletons";

// Modular Components
import { InpatientStepper } from "../components/InpatientStepper";
import { BuildingGrid } from "../components/BuildingGrid";
import { ClassGrid } from "../components/ClassGrid";
import { RoomGrid } from "../components/RoomGrid";
import { RoomDetail } from "../components/RoomDetail";
import { GeneralFacilities } from "../components/GeneralFacilities";

// Services and Constants
import { getFilteredRooms, transformInpatientData } from "../services/inpatientService";
import { buildingImages, defaultInpatientImage, getBuildingColor, generalFacilities } from "../constants/inpatientConstants";

export const RawatInapPage = () => {
    const { data: service, isLoading: serviceLoading } = useGetServiceBySlug({ slug: 'rawat-inap' });
    const { data: availability, isLoading: availabilityLoading } = useGetBedAvailability();
    const { data: rooms, isLoading: roomsLoading } = useGetRooms();

    const [step, setStep] = useState<InpatientStep>("building");
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
    const [selectedClass, setSelectedClass] = useState<RoomClass | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<InpatientRoom | null>(null);

    const isLoading = serviceLoading || availabilityLoading;

    if (isLoading) {
        return <InpatientPageSkeleton />;
    }

    const displayBuildings = transformInpatientData(
        service?.items,
        availability,
        getBuildingColor,
        buildingImages,
        defaultInpatientImage
    );

    const handleSelectBuilding = (building: Building) => {
        setSelectedBuilding(building);
        setStep("class");
        window.scrollTo({ top: 300, behavior: "smooth" });
    };

    const handleSelectClass = (cls: RoomClass) => {
        setSelectedClass(cls);
        setStep("room");
        window.scrollTo({ top: 300, behavior: "smooth" });
    };

    const handleSelectRoom = (room: InpatientRoom) => {
        setSelectedRoom(room);
        setStep("detail");
        window.scrollTo({ top: 300, behavior: "smooth" });
    };

    const handleBack = () => {
        if (step === "detail") setStep("room");
        else if (step === "room") setStep("class");
        else if (step === "class") {
            setStep("building");
            setSelectedBuilding(null);
        }
    };

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
                    selectedBuilding={selectedBuilding}
                    selectedClass={selectedClass}
                    onSetStep={setStep}
                    onResetBuilding={() => setSelectedBuilding(null)}
                />

                {/* STEPS RENDERER */}
                {step === "building" && (
                    <BuildingGrid
                        buildings={displayBuildings}
                        onSelect={handleSelectBuilding}
                    />
                )}

                {step === "class" && selectedBuilding && (
                    <ClassGrid
                        selectedBuilding={selectedBuilding}
                        onSelectClass={handleSelectClass}
                        onBack={handleBack}
                    />
                )}

                {step === "room" && selectedBuilding && selectedClass && (
                    <RoomGrid
                        selectedBuilding={selectedBuilding}
                        selectedClass={selectedClass}
                        rooms={getFilteredRooms(rooms, selectedBuilding, selectedClass)}
                        onSelectRoom={handleSelectRoom}
                        onBack={handleBack}
                    />
                )}

                {step === "detail" && selectedClass && selectedBuilding && (
                    <RoomDetail
                        selectedBuilding={selectedBuilding}
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
                    href: whatsappLink(selectedClass ? `${selectedClass.name}${selectedRoom ? ` - ${selectedRoom.id}` : ""} (${selectedBuilding?.name || ""})` : undefined),
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
