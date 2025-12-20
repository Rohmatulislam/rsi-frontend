import { StaticImageData } from "next/image";

export interface RoomClass {
    name: string;
    description: string;
    price: string;
    facilities: string[];
    capacity: string;
}

export interface Building {
    id: string;
    name: string;
    description: string;
    image: string | StaticImageData;
    color: string;
    classes: RoomClass[];
}

export type InpatientStep = "building" | "class" | "room" | "detail";

export interface InpatientRoom {
    id: string;
    buildingId: string;
    buildingName: string;
    class: string;
    status: 'ISI' | 'KOSONG' | 'DIBERSIHKAN';
    price: number;
}

export interface BedAvailability {
    buildingId: string;
    buildingName: string;
    class: string;
    total: number;
    available: number;
}
