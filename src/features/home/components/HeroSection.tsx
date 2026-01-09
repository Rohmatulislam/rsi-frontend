import Image from "next/image";
import Link from "next/link";
import heroImage from "~/assets/hero.webp";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Stethoscope,
  Star,
  Crown,
  Activity,
  FlaskConical,
  ScanLine,
  ArrowRight,
  BedDouble,
  Heart,
  Shield,
  FileCheck,
  Clock
} from "lucide-react";

const HeroImage = () => {
  return (
    <div className=" h-full w-full absolute inset-0 -z-10">
      <Image
        src={heroImage}
        alt="Hero Image"
        unoptimized
        fill
        sizes="100vw"
        className="object-cover "
      />
      <div className="absolute inset-0 bg-slate-900/20 w-full h-full"></div>
    </div>
  );
};


const ServiceCard = ({
  icon: Icon,
  title,
  href,
  color = "primary",
  ...props
}: {
  icon: any;
  title: string;
  href?: string;
  color?: string;
  [key: string]: any;
}) => {
  const colorClasses = {
    primary: "bg-blue-500/10 group-hover:bg-blue-500/20 text-blue-600 dark:text-blue-400",
    accent: "bg-amber-500/10 group-hover:bg-amber-500/20 text-amber-600 dark:text-amber-400",
    success: "bg-green-500/10 group-hover:bg-green-500/20 text-green-600 dark:text-green-400",
    purple: "bg-purple-500/10 group-hover:bg-purple-500/20 text-purple-600 dark:text-purple-400",
    rose: "bg-rose-500/10 group-hover:bg-rose-500/20 text-rose-600 dark:text-rose-400",
    cyan: "bg-cyan-500/10 group-hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400",
  };

  const CardContent = (
    <div
      className={`group bg-card/80 backdrop-blur-sm hover:bg-card border border-border rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer h-full min-h-[140px] flex items-center justify-center ${!href ? 'cursor-pointer' : ''}`}
      {...props}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <div className={`p-3 rounded-full transition-all duration-300 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.primary}`}>
          <Icon className="h-7 w-7" />
        </div>
        <h3 className="font-semibold text-xs sm:text-sm group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        {CardContent}
      </Link>
    );
  }

  return CardContent;
};

import { useGetServices } from "~/features/services/api/getServices";
import { useTranslations } from "next-intl";

const iconMap: Record<string, any> = {
  Stethoscope,
  Star,
  Crown,
  Activity,
  FlaskConical,
  ScanLine,
  Bed: BedDouble,
  Heart,
  Shield,
  FileCheck,
  Clock,
};

export const HeroSection = () => {
  const t = useTranslations("Hero");
  const { data: servicesData, isLoading } = useGetServices();

  const defaultServices = [
    { icon: Stethoscope, title: "Cari Dokter", href: "/doctors", color: "primary" },
    { icon: Star, title: "Layanan Unggulan", href: "/layanan-unggulan", color: "accent" },
  ];

  // Map dynamic services to card format
  const dynamicServices = servicesData?.filter(s =>
    s.isActive &&
    s.slug !== 'rawat-inap' &&
    s.slug !== 'rawat-jalan'
  ).map(service => ({
    icon: iconMap[service.icon || 'Activity'] || Activity,
    title: service.name,
    href: `/layanan/${service.slug}`,
    // Simple color rotation or selection
    color: service.slug === 'mcu' ? 'rose' :
      service.slug === 'laboratorium' ? 'cyan' :
        service.slug === 'radiologi' ? 'success' :
          service.slug === 'poli-executive' ? 'accent' : 'primary'
  })) || [];

  // Combine default items with active dynamic services, limiting to top 6
  const displayServices = [...defaultServices, ...dynamicServices].slice(0, 6);

  return (
    <section className="w-full min-h-screen relative flex items-center">
      <HeroImage />

      <div className="container mx-auto px-4 md:px-8 py-12">

        <div className="flex flex-col gap-20">
          {/* Title & Description - Left Aligned */}
          <div className="flex flex-col gap-6 max-w-3xl">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black leading-tight">
              {t("title")} <br /> {" "}
              <span className="text-primary text-2xl sm:text-3xl md:text-4xl lg:text-5xl">SITI HAJAR MATARAM</span>
            </h1>

            <p className="text-base md:text-lg text-slate-100 font-medium max-w-2xl">
              {t("subtitle")}
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
              <Link href="/tentang-kami" className={buttonVariants({ variant: "default", size: "lg" })}>
                {t("cta_info")}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Service Cards - Below, Centered */}
          <div className="flex justify-center w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl">
              {isLoading ? (
                // Skeleton loading simple boxes
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 h-[140px] w-full" />
                ))
              ) : (
                displayServices.map((service, index) => (
                  <ServiceCard
                    key={index}
                    icon={service.icon}
                    title={service.title}
                    href={service.href}
                    color={service.color}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
