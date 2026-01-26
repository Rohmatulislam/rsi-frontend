"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Medicine } from '../api/searchMedicines';

interface CartItem extends Medicine {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (medicine: Medicine) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    clearCart: () => void;
    totalCount: number;
    totalPrice: number;
    isOpen: boolean;
    toggleCart: (open?: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Persistence
    useEffect(() => {
        const savedCart = localStorage.getItem('rsi_pharmacy_cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('rsi_pharmacy_cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (medicine: Medicine) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === medicine.id);
            if (existing) {
                return prev.map(item =>
                    item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...medicine, quantity: 1 }];
        });
        setIsOpen(true);
    };

    const removeFromCart = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => setItems([]);

    const toggleCart = (open?: boolean) => setIsOpen(open !== undefined ? open : !isOpen);

    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            items, addToCart, removeFromCart, updateQuantity, clearCart,
            totalCount, totalPrice, isOpen, toggleCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
};
