import { useState, useMemo } from "react";
import { useGetDoctorsList } from "~/features/doctor/api/getDoctorsList";
import { useGetArticles } from "~/features/article/api/getArticles";
import { useGetActivePoli } from "~/features/doctor/api/getActivePoli";
import { useDebounce } from "./use-debounce";

export type SearchResult = {
    id: string;
    type: "doctor" | "service" | "article";
    title: string;
    subtitle?: string;
    image?: string;
    url: string;
};

export const usePredictiveSearch = (query: string) => {
    const debouncedQuery = useDebounce(query, 300);

    // Fetch doctors
    const { data: doctors = [], isLoading: isLoadingDoctors } = useGetDoctorsList({
        input: { search: debouncedQuery, limit: 5 },
        queryConfig: { enabled: debouncedQuery.length >= 2 }
    });

    // Fetch articles
    const { data: articles = [], isLoading: isLoadingArticles } = useGetArticles({
        search: debouncedQuery,
        queryConfig: { enabled: debouncedQuery.length >= 2 }
    });

    // Fetch all services/poliklinik (usually small list, can filter client-side)
    const { data: poliklinik = [], isLoading: isLoadingPoli } = useGetActivePoli({
        queryConfig: { enabled: debouncedQuery.length >= 2 }
    });

    const results = useMemo(() => {
        if (debouncedQuery.length < 2) return [];

        const searchResults: SearchResult[] = [];

        // Map Doctors
        doctors.forEach((doc) => {
            searchResults.push({
                id: doc.id,
                type: "doctor",
                title: doc.name,
                subtitle: doc.specialization ?? undefined,
                image: doc.imageUrl ?? undefined,
                url: `/doctor/${doc.slug ?? doc.id}`,
            });
        });

        // Map Poliklinik (Client-side filter for now as API is global)
        const q = debouncedQuery.toLowerCase();
        poliklinik
            .filter(p => p.nm_poli.toLowerCase().includes(q))
            .slice(0, 3)
            .forEach((p) => {
                searchResults.push({
                    id: p.kd_poli,
                    type: "service",
                    title: p.nm_poli,
                    subtitle: "Poliklinik",
                    url: `/layanan/poli/${p.kd_poli}`,
                });
            });

        // Map Articles
        articles.slice(0, 3).forEach((art) => {
            searchResults.push({
                id: art.id,
                type: "article",
                title: art.title,
                subtitle: art.categories?.[0]?.name || "Artikel",
                image: art.image ?? undefined,
                url: `/artikel/${art.slug}`,
            });
        });

        return searchResults;
    }, [debouncedQuery, doctors, articles, poliklinik]);

    return {
        results,
        isLoading: isLoadingDoctors || isLoadingArticles || isLoadingPoli,
        isLoadingDoctors,
        isLoadingArticles,
        isLoadingPoli,
        debouncedQuery,
    };
};
