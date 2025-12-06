import Image from "next/image";
import Link from "next/link";
import heroImage from "~/assets/baner.webp";
import { Button } from "~/components/ui/button";
import { 
  Award, 
  Users, 
  Building2, 
  Clock,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

const StatCard = ({ 
  icon: Icon, 
  value, 
  label 
}: { 
  icon: any; 
  value: string; 
  label: string;
}) => {
  return (
    <div className="flex flex-col items-center gap-2 p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border hover:shadow-lg transition-all duration-300">
      <Icon className="h-8 w-8 text-primary mb-2" />
      <h3 className="text-3xl md:text-4xl font-black text-primary">{value}</h3>
      <p className="text-sm text-muted-foreground text-center">{label}</p>
    </div>
  );
};

export const About = () => {


  const features = [
    "Tenaga medis profesional dan berpengalaman",
    "Peralatan medis modern dan canggih",
    "Pelayanan berbasis syariah",
    "Ruang rawat inap yang nyaman",
    "Laboratorium dan radiologi lengkap",
    "Layanan ambulance 24 jam",
  ];

  return (
    <section className="w-full container mx-auto px-4 space-y-16 md:py-24">
             <h2 className="text-3xl font-bold text-center">TENTANG KAMI</h2>
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <div className="relative">
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={heroImage}
                alt="Hero Image"
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback to gradient if image not found
                  e.currentTarget.style.display = 'none';
                }}
              />
              {/* Gradient overlay as fallback */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20" />
              
              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 bg-card/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Terakreditasi</p>
                    <p className="text-sm text-muted-foreground">Standar Nasional</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
                Rumah Sakit Islam <br />{" "}
                <span className="text-primary">Siti Hajar Mataram</span>
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                RSI Siti Hajar Mataram adalah rumah sakit Islam yang berkomitmen memberikan 
                pelayanan kesehatan terbaik dengan mengedepankan nilai-nilai Islami. 
                Kami dilengkapi dengan fasilitas medis modern dan tenaga profesional 
                yang siap melayani dengan sepenuh hati.
              </p>
            </div>

            {/* Features List */}
            <div className="grid sm:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm md:text-base">{feature}</p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="mt-4">
              <Button size="lg" asChild>
                <Link href="/tentang-kami">
                  Selengkapnya
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