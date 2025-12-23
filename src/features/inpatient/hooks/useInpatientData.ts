import { useMemo, useState } from "react";
import { useGetServiceBySlug } from "~/features/services/api/getServiceBySlug";
import { useGetBedAvailability } from "../api/getBedAvailability";
import { useGetRooms } from "../api/getRooms";
import { useGetUnits } from "../api/getUnits";
import {
    transformInpatientData,
    getFilteredRooms,
    InpatientUnit,
    RoomClass,
    InpatientRoom,
    InpatientStep
} from "../services/inpatientService";
import {
    unitImages,
    defaultInpatientImage,
    getUnitColor
} from "../constants/inpatientConstants";

export const useInpatientData = () => {
    const { data: service, isLoading: serviceLoading } = useGetServiceBySlug({ slug: 'rawat-inap' });
    const { data: availability, isLoading: availabilityLoading } = useGetBedAvailability();
    const { data: rooms, isLoading: roomsLoading } = useGetRooms();
    const { data: dbUnits, isLoading: unitsLoading } = useGetUnits();

    const [step, setStep] = useState<InpatientStep>("building");
    const [selectedUnit, setSelectedUnit] = useState<InpatientUnit | null>(null);
    const [selectedClass, setSelectedClass] = useState<RoomClass | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<InpatientRoom | null>(null);

    const isLoading = serviceLoading || availabilityLoading || unitsLoading;

    const displayUnits = useMemo(() => {
        return transformInpatientData(
            service?.items,
            availability,
            getUnitColor,
            unitImages,
            defaultInpatientImage,
            dbUnits
        );
    }, [service?.items, availability, dbUnits]);

    const filteredRooms = useMemo(() => {
        return getFilteredRooms(rooms, selectedUnit, selectedClass);
    }, [rooms, selectedUnit, selectedClass]);

    const handleSelectUnit = (unit: InpatientUnit) => {
        setSelectedUnit(unit);
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
            setSelectedUnit(null);
        }
    };

    return {
        service,
        isLoading,
        displayUnits,
        filteredRooms,
        step,
        setStep,
        selectedUnit,
        setSelectedUnit,
        selectedClass,
        selectedRoom,
        handleSelectUnit,
        handleSelectClass,
        handleSelectRoom,
        handleBack
    };
};
