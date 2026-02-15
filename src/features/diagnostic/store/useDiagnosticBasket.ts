import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type DiagnosticItemType = 'LAB' | 'RADIOLOGY' | 'MCU';

export interface DiagnosticItem {
    id: string;
    name: string;
    price: number;
    type: DiagnosticItemType;
    category?: string;
    preparation?: string;
    description?: string;
}

interface DiagnosticBasketState {
    items: DiagnosticItem[];
    addItem: (item: DiagnosticItem) => void;
    removeItem: (id: string) => void;
    clearBasket: () => void;
    getTotalPrice: () => number;
    getItemCount: () => number;
    hasItem: (id: string) => boolean;
}

export const useDiagnosticBasket = create<DiagnosticBasketState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const exists = get().items.some((i) => i.id === item.id);
                if (!exists) {
                    set((state) => ({ items: [...state.items, item] }));
                }
            },
            removeItem: (id) => {
                set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
            },
            clearBasket: () => set({ items: [] }),
            getTotalPrice: () => {
                return get().items.reduce((sum, item) => sum + item.price, 0);
            },
            getItemCount: () => get().items.length,
            hasItem: (id) => get().items.some((i) => i.id === id),
        }),
        {
            name: 'diagnostic-basket-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
