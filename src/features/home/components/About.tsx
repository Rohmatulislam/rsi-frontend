"use client";

import Image from "next/image";
import Link from "next/link";
import heroImage from "~/assets/baner.webp";
import { Button } from "~/components/ui/button";
import {
  Award,
  CheckCircle2,
  ArrowRight,
  Loader2
} from "lucide-react";
import { useGetAboutContent } from "~/features/about/api/getAboutContent";
import { Skeleton } from "~/components/ui/skeleton";
import { useTranslations } from "next-intl";

export const About = () => {
  const t = useTranslations("About");
  // Fetch dynamic content from API
  const { data: descriptionData, isLoading: isLoadingDesc } = useGetAboutContent({
    key: "description"
  });

  const { data: featuresData, isLoading: isLoadingFeatures } = useGetAboutContent({
    key: "features"
  });

  // Parse features from API (stored as comma/line separated string)
  const features = featuresData?.value
    ? featuresData.value.split(/[,\n]/).map(f => f.trim()).filter(f => f)
    : [];

  // Default description fallback
  const description = descriptionData?.value || t("description");

  // Default features fallback
  const defaultFeatures = [
    t("feature_pro"),
    t("feature_modern"),
    t("feature_sharia"),
    t("feature_comfort"),
    t("feature_complete"),
    t("feature_ambulance"),
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  return (
    <section className="w-full container mx-auto px-4 space-y-16 md:py-24">
      <h2 className="text-3xl font-bold text-center">{t("title")}</h2>
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <div className="relative">
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={heroImage}
                alt="RSI Siti Hajar Mataram"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20" />

              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 bg-card/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{t("accredited")}</p>
                    <p className="text-sm text-muted-foreground">{t("accredited_standard")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
                {t("hospital_type")} <br />{" "}
                <span className="text-primary">{t("hospital_name")}</span>
              </h2>

              {/* Description */}
              {isLoadingDesc ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {/* Features List */}
            <div className="grid sm:grid-cols-2 gap-3">
              {isLoadingFeatures ? (
                // Skeleton for features
                [...Array(6)].map((_, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))
              ) : (
                displayFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <p className="text-sm md:text-base">{feature}</p>
                  </div>
                ))
              )}
            </div>

            {/* CTA Button */}
            <div className="mt-4">
              <Button size="lg" asChild>
                <Link href="/tentang-kami">
                  {t("cta_more")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};