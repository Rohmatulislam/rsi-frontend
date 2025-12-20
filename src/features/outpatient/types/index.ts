export interface Clinic {
    id: string;
    name: string;
    description?: string;
    slug?: string;
}

export interface OperatingHours {
    day: string;
    hours: string;
}
