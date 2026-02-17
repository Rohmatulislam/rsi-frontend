"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "~/components/ui/command";
import { usePredictiveSearch } from "~/hooks/usePredictiveSearch";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { useRouter } from "~/navigation";
import { Search, MapPin, FileText, User, ChevronRight } from "lucide-react";

interface SearchCommandProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const SearchCommand = ({ open, onOpenChange }: SearchCommandProps) => {
    const t = useTranslations("Navbar");
    const [query, setQuery] = useState("");
    const { results, isLoading } = usePredictiveSearch(query);
    const router = useRouter();

    const handleSelect = (url: string) => {
        onOpenChange(false);
        router.push(url as any);
    };

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange} shouldFilter={false}>
            <CommandInput
                placeholder={t("search_placeholder")}
                value={query}
                onValueChange={setQuery}
            />
            <CommandList className="max-h-[70vh]">
                {query.length > 0 && results.length === 0 && !isLoading && (
                    <CommandEmpty>{t("no_results")}</CommandEmpty>
                )}

                {query.length === 0 && (
                    <>
                        <CommandGroup heading="Akses Cepat">
                            <CommandItem onSelect={() => handleSelect('/layanan/rawat-jalan')}>
                                <MapPin className="mr-2 h-4 w-4" />
                                <span>Poli Rawat Jalan</span>
                            </CommandItem>
                            <CommandItem onSelect={() => handleSelect('/layanan/rawat-inap')}>
                                <MapPin className="mr-2 h-4 w-4" />
                                <span>Layanan Rawat Inap</span>
                            </CommandItem>
                            <CommandItem onSelect={() => handleSelect('/artikel')}>
                                <FileText className="mr-2 h-4 w-4" />
                                <span>Berita & Artikel</span>
                            </CommandItem>
                        </CommandGroup>
                    </>
                )}

                {results.length > 0 && (
                    <CommandGroup heading="Hasil Pencarian">
                        {results.map((result) => (
                            <CommandItem
                                key={`${result.type}-${result.id}`}
                                onSelect={() => handleSelect(result.url)}
                                className="flex items-center gap-3 p-2 cursor-pointer"
                            >
                                <div className="flex-shrink-0">
                                    {result.type === "doctor" ? (
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={result.image} />
                                            <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                        </Avatar>
                                    ) : result.type === "article" ? (
                                        <div className="h-9 w-9 bg-accent rounded-md flex items-center justify-center overflow-hidden">
                                            {result.image ? (
                                                <img src={result.image} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </div>
                                    ) : (
                                        <div className="h-9 w-9 bg-primary/10 rounded-full flex items-center justify-center">
                                            <Search className="h-4 w-4 text-primary" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className="font-medium truncate">{result.title}</span>
                                    {result.subtitle && (
                                        <span className="text-xs text-muted-foreground truncate">{result.subtitle}</span>
                                    )}
                                </div>
                                <Badge variant="outline" className="text-[10px] uppercase ml-auto">
                                    {result.type === 'doctor' ? 'Dokter' : result.type === 'service' ? 'Layanan' : 'Artikel'}
                                </Badge>
                                <ChevronRight className="h-4 w-4 text-muted-foreground ml-1" />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}

                {isLoading && (
                    <div className="p-4 flex items-center justify-center">
                        <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="ml-2 text-sm text-muted-foreground">Mencari...</span>
                    </div>
                )}
            </CommandList>
        </CommandDialog>
    );
};
