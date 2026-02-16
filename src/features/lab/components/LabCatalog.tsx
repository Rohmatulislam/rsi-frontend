"use client";

import { useState, useMemo, useEffect } from "react";
import { TestTube, Users } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { useLabTests } from "../api/getLabTests";
import { useLabCategories } from "../api/getLabCategories";
import { useLabGuarantors } from "../api/getLabGuarantors";
import { LabTest } from "../services/labService";
import { Skeleton } from "~/components/ui/skeleton";
import { useGetDoctorsList } from "~/features/doctor/api/getDoctorsList";
import { LabTemplateDetail } from "./LabTemplateDetail";
import { LabFiltersSidebar } from "./LabFiltersSidebar";
import { LabTestCard } from "./LabTestCard";
import { LabMobileSummary } from "./LabMobileSummary";
import { useDiagnosticBasket, DiagnosticItem } from "~/features/diagnostic/store/useDiagnosticBasket";

export interface LabCatalogProps {
    hideSummary?: boolean;
}

export const LabCatalog = ({ hideSummary }: LabCatalogProps) => {
    const { items: basketItems, removeItem: removeFromBasket, addItem: addToBasket, hasItem } = useDiagnosticBasket();
    const [selectedGuarantor, setSelectedGuarantor] = useState<string>("A09"); // Default to UMUM
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    const [expandedTests, setExpandedTests] = useState<Record<string, boolean>>({});
    const [viewingTemplateId, setViewingTemplateId] = useState<number | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const { data: guarantors, isLoading: guarsLoading } = useLabGuarantors();
    const { data: tests, isLoading: testsLoading } = useLabTests({ kd_pj: selectedGuarantor });
    const { data: categories, isLoading: catsLoading } = useLabCategories({ kd_pj: selectedGuarantor });
    const { data: doctors } = useGetDoctorsList();

    const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");

    const pkDoctors = useMemo(() => {
        return doctors?.filter((d: any) =>
            d.specialization?.toLowerCase().includes("patologi klinik") ||
            d.name?.toLowerCase().includes("sp.pk")
        ) || [];
    }, [doctors]);

    const selectedPkDoctor = useMemo(() => {
        if (selectedDoctorId) {
            return pkDoctors.find(d => d.id === selectedDoctorId);
        }
        return pkDoctors[0];
    }, [pkDoctors, selectedDoctorId]);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const filteredTests = useMemo(() => {
        if (!tests) return [];
        return tests.filter(test => {
            const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
            const templateMatches = test.template.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = selectedCategory === "All" || test.category === selectedCategory;
            return (matchesSearch || templateMatches) && matchesCategory;
        });
    }, [tests, searchQuery, selectedCategory]);

    const selectedTests = useMemo(() => {
        return basketItems.filter((item: DiagnosticItem) => item.type === 'LAB') as any as LabTest[];
    }, [basketItems]);

    const totalPrice = useMemo(() => {
        return selectedTests.reduce((sum, test) => sum + (test.price || 0), 0);
    }, [selectedTests]);

    const toggleTest = (test: LabTest) => {
        if (hasItem(test.id)) {
            removeFromBasket(test.id);
        } else {
            addToBasket({
                id: test.id,
                name: test.name,
                price: test.price || 0,
                type: 'LAB',
                category: test.category,
                description: (test as any).description,
                preparation: (test as any).preparation?.join(', ')
            });
        }
    };

    const removeTest = (id: string) => {
        removeFromBasket(id);
    };

    const toggleExpand = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setExpandedTests(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const openTemplateDetail = (e: React.MouseEvent, templateId: number) => {
        e.stopPropagation();
        setViewingTemplateId(templateId);
        setIsDetailOpen(true);
    };

    const handleGuarantorChange = (val: string) => {
        setSelectedGuarantor(val);
        // Clear lab items from basket if guarantor changes? 
        // Actually SIMRS prices depend on guarantor, so yes, it's safer.
        basketItems
            .filter((item: DiagnosticItem) => item.type === 'LAB')
            .forEach((item: DiagnosticItem) => removeFromBasket(item.id));

        setSelectedCategory("All");
        setExpandedTests({});
    };

    if (testsLoading || catsLoading || guarsLoading || !isMounted) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <LabTemplateDetail
                templateId={viewingTemplateId}
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
            />

            {/* Filters Sidebar */}
            <LabFiltersSidebar
                selectedGuarantor={selectedGuarantor}
                onGuarantorChange={handleGuarantorChange}
                guarantors={guarantors ?? []}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                categories={categories ?? []}
                selectedTests={selectedTests}
                onRemoveTest={removeTest}
                totalPrice={totalPrice}
                selectedDoctor={selectedPkDoctor}
                pkDoctors={pkDoctors}
                selectedDoctorId={selectedDoctorId}
                onDoctorChange={setSelectedDoctorId}
                hideSummary={hideSummary}
            />

            {/* Tests Grid */}
            <div className="lg:col-span-3">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="px-3 py-1">
                            <Users className="h-3 w-3 mr-2" />
                            {guarantors?.find(g => g.id === selectedGuarantor)?.name || "Pilih Penjamin"}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                            | {filteredTests.length} jenis pemeriksaan
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {filteredTests.map(test => {
                        const isSelected = hasItem(test.id);
                        const isExpanded = expandedTests[test.id] || (searchQuery.length > 2 && test.template.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())));

                        return (
                            <LabTestCard
                                key={test.id}
                                test={test}
                                isSelected={isSelected}
                                isExpanded={isExpanded}
                                searchQuery={searchQuery}
                                onToggle={() => toggleTest(test)}
                                onToggleExpand={(e) => toggleExpand(e, test.id)}
                                onOpenTemplateDetail={openTemplateDetail}
                            />
                        );
                    })}
                </div>

                {filteredTests.length === 0 && (
                    <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
                        <TestTube className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-semibold mb-2">Pemeriksaan tidak ditemukan</h3>
                        <p className="text-muted-foreground">Coba gunakan kata kunci pencarian lain atau ganti penjamin</p>
                    </div>
                )}
            </div>

            {/* Sticky Mobile Summary */}
            {!hideSummary && (
                <LabMobileSummary
                    selectedTests={selectedTests}
                    totalPrice={totalPrice}
                    pkDoctors={pkDoctors}
                    selectedDoctorId={selectedDoctorId}
                    onDoctorChange={setSelectedDoctorId}
                    selectedDoctor={selectedPkDoctor}
                    guarantors={guarantors ?? []}
                    selectedGuarantor={selectedGuarantor}
                />
            )}
        </div>
    );
};
