"use client";

import React, { useState } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    isBefore,
    isAfter,
    getDay
} from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';

interface VisualCalendarProps {
    selectedDate: string; // YYYY-MM-DD
    onSelect: (date: string) => void;
    availableDays: number[]; // [0, 1, 2, ...] where 0 is Sunday
    minDate: Date;
    maxDate: Date;
}

export const VisualCalendar = ({
    selectedDate,
    onSelect,
    availableDays,
    minDate,
    maxDate
}: VisualCalendarProps) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const selectedDateObj = selectedDate ? new Date(selectedDate) : null;

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between px-2 py-4 border-b dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: id })}
                </h4>
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        className="h-8 w-8 rounded-full"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="h-8 w-8 rounded-full"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        return (
            <div className="grid grid-cols-7 mb-2">
                {days.map((day, i) => (
                    <div key={i} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, 'yyyy-MM-dd');
                const cloneDay = day;

                const isSelected = selectedDateObj && isSameDay(day, selectedDateObj);
                const isCurrentMonth = isSameMonth(day, monthStart);

                // Logic to determine if day is available
                const dayOfWeek = getDay(day);
                const isPracticingDay = availableDays.includes(dayOfWeek);

                const isTooEarly = isBefore(day, minDate) && !isSameDay(day, minDate);
                const isTooLate = isAfter(day, maxDate);
                const isDisabled = !isCurrentMonth || isTooEarly || isTooLate || !isPracticingDay;

                days.push(
                    <div
                        key={formattedDate}
                        className={`relative h-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 rounded-xl m-0.5
              ${isSelected ? 'bg-primary text-white shadow-md' : ''}
              ${!isSelected && isPracticingDay && isCurrentMonth && !isTooEarly && !isTooLate ? 'hover:bg-primary/10 text-slate-700 dark:text-slate-300 font-bold' : ''}
              ${isDisabled ? 'opacity-20 cursor-not-allowed pointer-events-none' : ''}
              ${!isCurrentMonth ? 'invisible' : ''}
            `}
                        onClick={() => !isDisabled && onSelect(format(cloneDay, 'yyyy-MM-dd'))}
                    >
                        <span className="text-sm">{format(day, 'd')}</span>
                        {isPracticingDay && isCurrentMonth && !isDisabled && !isSelected && (
                            <span className="absolute bottom-1 w-1 h-1 bg-primary rounded-full animate-pulse" />
                        )}
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="p-1">{rows}</div>;
    };

    return (
        <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {renderHeader()}
            <div className="p-2">
                {renderDays()}
                {renderCells()}
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 flex items-center justify-between border-t dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-[10px] text-muted-foreground font-medium">Jadwal Praktek Tersedia</span>
                </div>
                <div className="flex items-center gap-1.5 text-primary">
                    <CalendarIcon className="h-3 w-3" />
                    <span className="text-[10px] font-bold">Max 14 Hari Kedepan</span>
                </div>
            </div>
        </div>
    );
};
