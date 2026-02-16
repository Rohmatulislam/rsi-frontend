"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Radio } from "lucide-react";
import { useRadioTests } from "../api/getRadioTests";
import { useRadioCategories } from "../api/getRadioCategories";
import { useRadioGuarantors } from "../api/getRadioGuarantors";
import { Skeleton } from "~/components/ui/skeleton";
import { useGetDoctorsList } from "~/features/doctor/api/getDoctorsList";
import { RadioFiltersSidebar } from "./RadioFiltersSidebar";
import { RadioTestCard } from "./RadioTestCard";
import { RadioMobileSummary } from "./RadioMobileSummary";
import { useDiagnosticBasket, DiagnosticItem } from "~/features/diagnostic/store/useDiagnosticBasket";

interface RadioCatalogProps {
    onSelect?: (testIds: string[]) => void;
    selectedTests?: string[];
    hideSummary?: boolean;
}

export const RadioCatalog = ({ onSelect, selectedTests: externalSelected = [], hideSummary }: RadioCatalogProps) => {
    const { items: basketItems, removeItem: removeFromBasket } = useDiagnosticBasket();

    const selectedTests = useMemo(() => {
        return basketItems
            .filter((item: DiagnosticItem) => item.type === 'RADIOLOGY')
            .map((i: DiagnosticItem) => i.id);
    }, [basketItems]);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedGuarantor, setSelectedGuarantor] = useState<string>("A09"); // Default to UMUM
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { data: tests, isLoading: testsLoading } = useRadioTests({ kd_pj: selectedGuarantor });
    const { data: categories, isLoading: categoriesLoading } = useRadioCategories({ kd_pj: selectedGuarantor });
    const { data: guarantors } = useRadioGuarantors();
    const { data: doctors } = useGetDoctorsList();

    const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");

    const radioDoctors = useMemo(() => {
        return doctors?.filter((d: any) =>
            d.specialization?.toLowerCase().includes("radiologi") ||
            d.name?.toLowerCase().includes("rad")
        ) || [];
    }, [doctors]);

    const selectedRadioDoctor = useMemo(() => {
        if (selectedDoctorId) {
            return radioDoctors.find(d => d.id === selectedDoctorId);
        }
        return radioDoctors[0];
    }, [radioDoctors, selectedDoctorId]);

    const filteredTests = useMemo(() => {
        if (!tests) return [];
        return tests.filter(test => {
            const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All" || test.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [tests, searchQuery, selectedCategory]);

    const selectedTestsData = useMemo(() => {
        return tests?.filter(t => selectedTests.includes(t.id)) || [];
    }, [tests, selectedTests]);

    const totalPrice = useMemo(() => {
        return selectedTestsData.reduce((sum, t) => sum + t.price, 0);
    }, [selectedTestsData]);

    const toggleTest = (testId: string) => {
        if (selectedTests.includes(testId)) {
            removeFromBasket(testId);
        } else {
            // Addition is handled in RadioTestCard onClick for the Hub
            // but we keep onSelect for direct usage of RadioCatalog elsewhere
            onSelect?.([...selectedTests, testId]);
        }
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <RadioFiltersSidebar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedGuarantor={selectedGuarantor}
                onGuarantorChange={setSelectedGuarantor}
                guarantors={guarantors ?? []}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                categories={categories ?? []}
                categoriesLoading={categoriesLoading}
            />

            {/* Tests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testsLoading || !isMounted ? (
                    Array(6).fill(0).map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                            <CardHeader className="p-4">
                                <Skeleton className="h-5 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/4" />
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <Skeleton className="h-10 w-full" />
                            </CardContent>
                        </Card>
                    ))
                ) : filteredTests.length > 0 ? (
                    filteredTests.map((test: any) => (
                        <RadioTestCard
                            key={test.id}
                            test={test}
                            isSelected={selectedTests.includes(test.id)}
                            onToggle={() => toggleTest(test.id)}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center">
                        <Radio className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">Tidak ada hasil ditemukan</h3>
                        <p className="text-muted-foreground mt-1">
                            Coba ubah kata kunci pencarian atau kategori Anda.
                        </p>
                    </div>
                )}
            </div>

            {/* Mobile Summary */}
            {!hideSummary && (
                <RadioMobileSummary
                    selectedTests={selectedTests}
                    totalPrice={totalPrice}
                    selectedTestsData={selectedTestsData}
                    radioDoctors={radioDoctors}
                    selectedDoctorId={selectedDoctorId}
                    onDoctorChange={setSelectedDoctorId}
                    selectedRadioDoctor={selectedRadioDoctor}
                    onClearSelection={() => onSelect?.([])}
                />
            )}
        </div>
    );
};
