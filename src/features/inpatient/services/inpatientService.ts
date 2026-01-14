import { StaticImageData } from "next/image";

// Inpatient types and interfaces
export interface RoomClass {
    name: string;
    description: string;
    price: string;
    facilities: string[];
    capacity: string;
    imageUrl?: string;
}

export interface InpatientUnit {
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
    unitId: string;
    unitName: string;
    class: string;
    status: 'ISI' | 'KOSONG' | 'DIBERSIHKAN';
    price: number;
}

export interface BedAvailability {
    unitId: string;
    unitName: string;
    class: string;
    total: number;
    available: number;
    minPrice: number;
    maxPrice: number;
}

/**
 * Normalizes strings for consistent matching by removing common prefixes and extra whitespace.
 */
export const normalizeInpatientString = (str: string | undefined | null): string => {
    if (!str) return "";
    const normalized = str.toLowerCase()
        .replace(/unit\s+/g, '')
        .replace(/gedung\s+/g, '')
        .replace(/r\.\s*/g, '')
        .replace(/by\.\s*/g, '')
        .replace(/by\s+/g, '')
        .replace(/bayi\s+/g, '')
        .replace(/ruang\s+/g, '')
        .replace(/kelas\s*/g, '')
        .replace(/[-\/]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\s+/g, '');

    // Common mappings for class consistency
    if (normalized === 'i' || normalized === '1' || normalized === 'satu') return '1';
    if (normalized === 'ii' || normalized === '2' || normalized === 'dua') return '2';
    if (normalized === 'iii' || normalized === '3' || normalized === 'tiga') return '3';
    if (normalized === 'vvipsuite' || normalized === 'vvip') return 'vvip';

    return normalized;
};

/**
 * Finds and aggregates bed availability for a specific building and class name.
 * Supports multiple SIMRS units that belong to the same logical group (e.g., Safa and Safa Baby).
 */
export const getAvailabilityFor = (
    availability: BedAvailability[] | undefined,
    unitName: string,
    className: string,
    unitId?: string // Optional strict ID matching
): BedAvailability | undefined => {
    if (!availability) return undefined;

    const nUnit = normalizeInpatientString(unitName);
    const nClass = normalizeInpatientString(className);

    // If unitId is provided, use strict ID-based matching ONLY
    if (unitId) {
        const match = availability.find(a =>
            a.unitId.toLowerCase() === unitId.toLowerCase() &&
            normalizeInpatientString(a.class) === nClass
        );
        return match;
    }

    // Fallback to name-based matching and aggregation if NO unitId is provided
    const matches = availability.filter(a => {
        const ab = normalizeInpatientString(a.unitName);
        const ac = normalizeInpatientString(a.class);
        return ab === nUnit && ac === nClass;
    });

    if (matches.length === 0) return undefined;

    // Aggregate totals if multiple units match (e.g., different SIMRS ids for same logical unit)
    return matches.reduce((acc, curr) => ({
        unitId: acc.unitId, // Keep first ID as representative
        unitName: acc.unitName,
        class: acc.class,
        total: acc.total + curr.total,
        available: acc.available + curr.available,
        minPrice: Math.min(acc.minPrice, curr.minPrice),
        maxPrice: Math.max(acc.maxPrice, curr.maxPrice)
    }));
};

/**
 * Filters rooms based on the current building and class selection.
 */
export const getFilteredRooms = (
    rooms: InpatientRoom[] | undefined,
    selectedBuilding: InpatientUnit | null,
    selectedClass: RoomClass | null
): InpatientRoom[] => {
    if (!rooms || !selectedBuilding || !selectedClass) return [];

    const nClass = normalizeInpatientString(selectedClass.name);
    const unitIdLower = selectedBuilding.id.toLowerCase();
    const isBayiUnit = selectedBuilding.name.toLowerCase().includes('bayi');

    const filtered = rooms.filter(r => {
        const roomIdLower = r.id.toLowerCase();
        const rUnitIdLower = r.unitId.toLowerCase();
        const rnClass = normalizeInpatientString(r.class);

        // 1. Strict Unit Match (by Ward Code)
        if (rUnitIdLower !== unitIdLower) return false;

        // 2. Strict Class Match (by normalized name)
        if (rnClass !== nClass) return false;

        // 3. Room Code Match logic:
        // If it's a Bayi room ID (starts with BY), and it's in a Bayi unit, let it through
        // We detect "Bayi unit" if the unit name or ID contains "bayi" or "by"
        const isBayiRoom = roomIdLower.startsWith('by');
        const unitIsBayi = r.unitName.toLowerCase().includes('bayi') || r.unitName.toLowerCase().startsWith('by') || r.unitId.toLowerCase().includes('bayi');

        // If it has a numeric suffix in the code like SAFA03, it should match the class number
        const classNumberMatch = nClass.match(/\d+/);
        if (classNumberMatch) {
            const classNum = classNumberMatch[0];
            const roomNumberMatch = r.id.match(/\d+/);
            if (roomNumberMatch && r.id.startsWith(r.unitId)) {
                const roomNum = roomNumberMatch[0];
                if (!roomNum.includes(classNum) && !classNum.includes(roomNum)) {
                    // Only filter out if it's NOT a bayi room in a bayi unit
                    if (!(isBayiRoom && unitIsBayi)) {
                        return false;
                    }
                }
            }
        }

        return true;
    });

    return filtered;
};

/**
 * Transforms raw service items into grouped InpatientUnit structures.
 * @param dbBuildings - List of buildings from the database (source of truth for metadata & visibility)
 */
export const transformInpatientData = (
    serviceItems: any[] | undefined,
    availability: BedAvailability[] | undefined,
    getUnitColor: (name: string) => string,
    unitImages: Record<string, StaticImageData>,
    defaultImg: StaticImageData,
    dbBuildings?: any[] // Now full building objects from DB
): InpatientUnit[] => {
    if (!serviceItems) return [];

    // If we have DB buildings, use them as the source of truth
    if (dbBuildings && dbBuildings.length > 0) {
        return dbBuildings
            .filter(db => db.isActive)
            .map(db => {
                const unitName = db.name;
                const unitId = db.kd_bangsal;
                const normalizedDbName = normalizeInpatientString(unitName);

                // Find service items intended for this unit
                const unitClasses: RoomClass[] = [];
                serviceItems
                    .filter(item => item.isActive && normalizeInpatientString(item.category) === normalizedDbName)
                    .forEach(item => {
                        // Check availability strictly for THIS unit (by unitId/kd_bangsal)
                        const avail = getAvailabilityFor(availability, unitName, item.name, unitId);

                        // If we have availability data, only show classes that actually have beds in THIS specific unit
                        if (availability && (!avail || avail.total === 0)) {
                            return;
                        }

                        let priceDisplay = item.price ? `Rp ${item.price.toLocaleString('id-ID')} / malam` : "Hubungi Kami";
                        if (avail && avail.minPrice > 0) {
                            if (avail.minPrice === avail.maxPrice) {
                                priceDisplay = `Rp ${avail.minPrice.toLocaleString('id-ID')} / malam`;
                            } else {
                                priceDisplay = `Mulai dari Rp ${avail.minPrice.toLocaleString('id-ID')} / malam`;
                            }
                        }

                        // Deduplicate class by name (keep first one found)
                        if (!unitClasses.find(c => c.name === item.name)) {
                            unitClasses.push({
                                name: item.name,
                                description: item.description || "",
                                price: priceDisplay,
                                capacity: avail ? `Tersedia ${avail.available} / ${avail.total} Bed` : "Cek ketersediaan",
                                facilities: item.features ? item.features.split(',').map((f: string) => f.trim()) : [],
                                imageUrl: item.imageUrl || ""
                            });
                        }
                    });

                const staticImageKey = Object.keys(unitImages).find(key =>
                    normalizeInpatientString(key) === normalizedDbName
                );
                const staticImage = staticImageKey ? unitImages[staticImageKey] : undefined;
                const image = db.imageUrl || staticImage || defaultImg;

                return {
                    id: unitId,
                    name: unitName,
                    description: db.description || `Fasilitas perawatan di ${unitName}`,
                    color: getUnitColor(unitName),
                    image: image,
                    classes: unitClasses
                };
            })
            .filter(b => b.classes.length > 0);
    }

    // Fallback behavior (broad name-based grouping)
    const groupedItems: Record<string, RoomClass[]> = {};
    serviceItems.filter(item => item.isActive).forEach(item => {
        const cat = item.category || "Umum";
        if (!groupedItems[cat]) groupedItems[cat] = [];

        const avail = getAvailabilityFor(availability, cat, item.name);
        if (availability && (!avail || avail.total === 0)) return;

        let priceDisplay = item.price ? `Rp ${item.price.toLocaleString('id-ID')} / malam` : "Hubungi Kami";
        if (avail && avail.minPrice > 0) {
            if (avail.minPrice === avail.maxPrice) {
                priceDisplay = `Rp ${avail.minPrice.toLocaleString('id-ID')} / malam`;
            } else {
                priceDisplay = `Mulai dari Rp ${avail.minPrice.toLocaleString('id-ID')} / malam`;
            }
        }

        groupedItems[cat].push({
            name: item.name,
            description: item.description || "",
            price: priceDisplay,
            capacity: avail ? `Tersedia ${avail.available} / ${avail.total} Bed` : "Cek ketersediaan",
            facilities: item.features ? item.features.split(',').map((f: string) => f.trim()) : [],
            imageUrl: item.imageUrl || ""
        });
    });

    return Object.keys(groupedItems).map(unitName => {
        const normalizedName = normalizeInpatientString(unitName);
        const staticImageKey = Object.keys(unitImages).find(key =>
            normalizeInpatientString(key) === normalizedName
        );
        const staticImage = staticImageKey ? unitImages[staticImageKey] : undefined;
        return {
            id: unitName,
            name: unitName,
            description: `Fasilitas perawatan di ${unitName}`,
            color: getUnitColor(unitName),
            image: staticImage || defaultImg,
            classes: groupedItems[unitName]
        };
    });
};
