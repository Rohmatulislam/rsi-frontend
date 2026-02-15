"use client";

import { CheckCircle2, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { LabTest } from "../services/labService";
import { useDiagnosticBasket } from "~/features/diagnostic/store/useDiagnosticBasket";

interface LabTestCardProps {
    test: LabTest;
    isSelected: boolean;
    isExpanded: boolean;
    searchQuery: string;
    onToggle: () => void;
    onToggleExpand: (e: React.MouseEvent) => void;
    onOpenTemplateDetail: (e: React.MouseEvent, templateId: number) => void;
}

export const LabTestCard = ({
    test,
    isSelected: activeInCatalog, // Local selection in catalog
    isExpanded,
    searchQuery,
    onToggle,
    onToggleExpand,
    onOpenTemplateDetail
}: LabTestCardProps) => {
    const price = test.price || 0;
    const { hasItem, addItem, removeItem } = useDiagnosticBasket();
    const isSelected = hasItem(test.id);

    const handleToggleBasket = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isSelected) {
            removeItem(test.id);
        } else {
            addItem({
                id: test.id,
                name: test.name,
                price: price,
                type: 'LAB',
                category: test.category,
                description: (test as any).description,
                preparation: (test as any).preparation?.join(', ')
            });
        }
    };

    return (
        <Card
            className={`overflow-hidden transition-all border-2 ${isSelected ? 'border-primary bg-primary/5 shadow-md' : 'border-transparent'}`}
        >
            <div
                className="p-4 cursor-pointer flex items-start justify-between gap-4"
                onClick={onToggle}
            >
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold">
                            {test.category}
                        </Badge>
                    </div>
                    <h4 className="font-bold text-lg mb-1">{test.name}</h4>
                    <div className="flex items-center gap-4">
                        <p className="text-primary font-bold">
                            Rp {price.toLocaleString('id-ID')}
                        </p>
                        {test.template.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs gap-1 hover:bg-primary/10"
                                onClick={onToggleExpand}
                            >
                                {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                {test.template.length} Parameter
                            </Button>
                        )}
                    </div>
                </div>
                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary text-white' : 'border-muted-foreground/30 text-transparent'}`}>
                    <CheckCircle2 className="h-4 w-4" />
                </div>
            </div>

            {/* Template Details Accordion */}
            {isExpanded && test.template.length > 0 && (
                <div className="px-4 pb-4 border-t bg-muted/10 animate-in slide-in-from-top-2 duration-200">
                    <div className="pt-3 space-y-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Daftar Parameter Test (Klik untuk Detail):</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                            {test.template.map((item, idx) => {
                                const isMatch = searchQuery.length > 0 && item.name.toLowerCase().includes(searchQuery.toLowerCase());
                                return (
                                    <div
                                        key={item.id}
                                        className={`flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-background cursor-pointer group transition-colors border-b border-muted/30 last:border-0 ${isMatch ? 'bg-yellow-100/50' : ''}`}
                                        onClick={(e) => onOpenTemplateDetail(e, item.id)}
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <span className="text-[10px] opacity-40 shrink-0">{idx + 1}.</span>
                                            <span className={`text-xs truncate ${isMatch ? 'font-bold text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                                {item.name}
                                            </span>
                                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity shrink-0" />
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            {item.unit && <span className="text-[10px] italic text-muted-foreground">({item.unit})</span>}
                                            {item.price > 0 && <span className="text-xs font-semibold text-primary/80">Rp {item.price.toLocaleString('id-ID')}</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};
