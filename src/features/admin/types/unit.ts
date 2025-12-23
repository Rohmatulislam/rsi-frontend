export interface UpdateUnitDto {
    name?: string;
    description?: string;
    imageUrl?: string;
    order?: number;
    isActive?: boolean;
}

export interface SyncUnitsResponse {
    synced: number;
    message: string;
}
