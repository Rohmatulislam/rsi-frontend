"use client";

import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { useDiagnosticBasket } from "~/features/diagnostic/store/useDiagnosticBasket";

interface RadioTestCardProps {
    test: any;
    isSelected: boolean;
    onToggle: () => void;
}

export const RadioTestCard = ({ test, isSelected: activeInCatalog, onToggle }: RadioTestCardProps) => {
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
                price: test.price,
                type: 'RADIOLOGY',
                category: test.category,
                description: (test as any).description,
                preparation: (test as any).preparation?.join(', ')
            });
        }
    };

    return (
        <Card
            className={`group cursor-pointer transition-all duration-300 hover:shadow-md border-2 ${isSelected ? 'border-primary ring-1 ring-primary/20 bg-primary/5' : 'hover:border-primary/50'
                }`}
            onClick={handleToggleBasket}
        >
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start gap-2">
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                        {test.category}
                    </Badge>
                    {isSelected && <CheckCircle2 className="h-5 w-5 text-primary fill-primary/10" />}
                </div>
                <CardTitle className="text-base font-bold leading-tight group-hover:text-primary transition-colors">
                    {test.name}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex justify-between items-center mt-2">
                    <p className="text-lg font-bold text-primary">
                        Rp {test.price.toLocaleString('id-ID')}
                    </p>
                    <Badge variant="outline" className="text-[10px] opacity-70">
                        {test.class === '-' ? 'Umum' : test.class}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
};
