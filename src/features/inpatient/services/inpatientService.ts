import { StaticImageData } from "next/image";
import { BedAvailability, Building, InpatientRoom, RoomClass } from "../types";

/**
 * Normalizes strings for consistent matching by removing common prefixes and extra whitespace.
 */
export const normalizeInpatientString = (str: string): string =>
    str.toLowerCase()
        .replace(/gedung\s+/g, '')
        .replace(/r\.\s+/g, '')
        .replace(/by\.\s+/g, '')
        .replace(/ruang\s+/g, '')
        .replace(/kelas\s+/g, '')
        .replace(/-\s+/g, '')
        .replace(/\s+/g, '')
        .trim();

/**
 * Finds bed availability for a specific building and class name.
 */
export const getAvailabilityFor = (
    availability: BedAvailability[] | undefined,
    buildingName: string,
    className: string
): BedAvailability | undefined => {
    if (!availability) return undefined;

    const nBuilding = normalizeInpatientString(buildingName);
    const nClass = normalizeInpatientString(className);

    return availability.find(a => {
        const ab = normalizeInpatientString(a.buildingName);
        const ac = normalizeInpatientString(a.class);

        return (nBuilding.includes(ab) || ab.includes(nBuilding)) &&
            (nClass.includes(ac) || ac.includes(nClass));
    });
};

/**
 * Filters rooms based on the current building and class selection.
 */
export const getFilteredRooms = (
    rooms: InpatientRoom[] | undefined,
    selectedBuilding: Building | null,
    selectedClass: RoomClass | null
): InpatientRoom[] => {
    if (!rooms || !selectedBuilding || !selectedClass) return [];

    const nBuilding = normalizeInpatientString(selectedBuilding.name);
    const nClass = normalizeInpatientString(selectedClass.name);

    return rooms.filter(r => {
        const rb = normalizeInpatientString(r.buildingName);
        const rc = normalizeInpatientString(r.class);
        return (nBuilding.includes(rb) || rb.includes(nBuilding)) &&
            (nClass.includes(rc) || rc.includes(nClass));
    });
};

/**
 * Transforms raw service items into grouped Building structures.
 */
export const transformInpatientData = (
    serviceItems: any[] | undefined,
    availability: BedAvailability[] | undefined,
    getBuildingColor: (name: string) => string,
    buildingImages: Record<string, StaticImageData>,
    defaultImg: StaticImageData
): Building[] => {
    if (!serviceItems) return [];

    const dynamicBuildings: Building[] = [];
    const groupedItems: Record<string, RoomClass[]> = {};

    serviceItems.filter(item => item.isActive).forEach(item => {
        const cat = item.category || "Umum";
        if (!groupedItems[cat]) {
            groupedItems[cat] = [];
        }

        const avail = getAvailabilityFor(availability, cat, item.name);

        groupedItems[cat].push({
            name: item.name,
            description: item.description || "",
            price: item.price ? `Rp ${item.price.toLocaleString('id-ID')} / malam` : "Hubungi Kami",
            capacity: avail ? `Tersedia ${avail.available} / ${avail.total} Bed` : "Cek ketersediaan",
            facilities: item.features ? item.features.split(',').map((f: string) => f.trim()) : []
        });
    });

    Object.keys(groupedItems).forEach(buildingName => {
        dynamicBuildings.push({
            id: buildingName.toLowerCase().replace(/\s+/g, '-'),
            name: buildingName,
            description: `Fasilitas perawatan di ${buildingName}`,
            color: getBuildingColor(buildingName),
            image: buildingImages[buildingName] || defaultImg,
            classes: groupedItems[buildingName]
        });
    });

    return dynamicBuildings;
};
