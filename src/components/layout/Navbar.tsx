"use client";

import { cn } from "~/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "~/components/ui/input-group";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { ChevronDown, LogIn, Menu, UserPlus, Search, ShoppingCart, User, LogOut, Settings, ClipboardList } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/features/auth/hook/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

// Mobile Navigation Helper Components
const MobileNavSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-border/50 pb-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors"
      >
        <span className="font-semibold text-sm">{title}</span>
        <ChevronDown className={cn(
          "h-4 w-4 opacity-50 transition-transform duration-200",
          isExpanded && "rotate-180"
        )} />
      </button>
      {isExpanded && (
        <div className="pl-4 mt-1 space-y-0.5">
          {children}
        </div>
      )}
    </div>
  );
};

const MobileNavLink = ({ href, onClick, children }: { href: string; onClick?: () => void; children: React.ReactNode }) => (
  <Link
    href={href}
    onClick={onClick}
    className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/30 rounded-lg transition-colors"
  >
    {children}
  </Link>
);


export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout, canAccessAdmin } = useAuth();

  return (
    <nav
      className={cn(
        "bg-background/50 backdrop-blur-md",
        "w-full border-b h-16 py-2 px-4 md:px-8",
        "sticky top-0 z-50",
        "flex items-center justify-between"
      )}
    >
      {/* Left side - Logo & Menus */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Logo & Hospital Name */}
        <Link href="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity">
          <Image
            src="/icon.png"
            alt="RSI Siti Hajar Mataram Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <div className="flex flex-col">
            <span className="font-bold text-base md:text-xl leading-tight">RSI Siti Hajar</span>
            <span className="text-xs md:text-base leading-tight text-center">Mataram</span>
          </div>
        </Link>

        {/* Desktop Navigation Menus */}
        <div className="hidden lg:flex items-center gap-4 font-medium text-sm">
          {/* Layanan Kesehatan */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors outline-none">
              Layanan Kesehatan
              <ChevronDown className="h-4 w-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuItem asChild>
                <Link href="/layanan/rawat-inap">Rawat Inap</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/layanan/rawat-jalan">Rawat Jalan</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/layanan/farmasi">Farmasi 24 Jam</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/layanan/laboratorium">Laboratorium</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/layanan/radiologi">Radiologi</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/layanan/rehabilitasi-medik">Rehabilitasi Medik</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/layanan/mcu">MCU (Medical Check Up)</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Layanan Unggulan */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors outline-none">
              Layanan Unggulan
              <ChevronDown className="h-4 w-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuItem asChild>
                <Link href="/layanan-unggulan/bedah-minimal-invasif">Bedah Minimal Invasif</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/layanan-unggulan/eswl">ESWL</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/layanan-unggulan/persalinan-syari">Persalinan Syar'i</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/layanan-unggulan/executive">Layanan Executive</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Pusat Informasi */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors outline-none">
              Pusat Informasi
              <ChevronDown className="h-4 w-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuItem asChild>
                <Link href="/tentang-kami">Tentang Kami</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/artikel">Artikel & Berita</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/igd">IGD</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/lokasi">Peta Lokasi</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/kontak">Hubungi Kami</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/faq">FAQ (Tanya Jawab)</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Right side - Auth & Mobile Menu */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Search Input - Desktop only */}
        {/* <InputGroup className="w-80 hidden lg:flex">
          <InputGroupAddon>
            <Search className="text-primary" />
          </InputGroupAddon>
          <InputGroupInput placeholder="Cari Dokter" />
        </InputGroup> */}

        {/* Mobile Search Button */}
        <Button size="icon" variant="ghost" className="lg:hidden" onClick={() => setSearchOpen(true)}>
          <Search className="h-5 w-5" />
        </Button>

        {/* Search Dialog */}
        <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
          <CommandInput placeholder="Cari dokter, layanan, atau informasi..." />
          <CommandList>
            <CommandEmpty>Tidak ada hasil ditemukan.</CommandEmpty>

            <CommandGroup heading="Layanan Kesehatan">
              <CommandItem onSelect={() => { setSearchOpen(false); window.location.href = '/layanan/rawat-inap'; }}>
                Rawat Inap
              </CommandItem>
              <CommandItem onSelect={() => { setSearchOpen(false); window.location.href = '/layanan/rawat-jalan'; }}>
                Rawat Jalan
              </CommandItem>
              <CommandItem onSelect={() => { setSearchOpen(false); window.location.href = '/layanan/farmasi'; }}>
                Farmasi 24 Jam
              </CommandItem>
              <CommandItem onSelect={() => { setSearchOpen(false); window.location.href = '/layanan/laboratorium'; }}>
                Laboratorium
              </CommandItem>
              <CommandItem onSelect={() => { setSearchOpen(false); window.location.href = '/layanan/radiologi'; }}>
                Radiologi
              </CommandItem>
              <CommandItem onSelect={() => { setSearchOpen(false); window.location.href = '/layanan/rehabilitasi-medik'; }}>
                Rehabilitasi Medik
              </CommandItem>
              <CommandItem onSelect={() => { setSearchOpen(false); window.location.href = '/layanan/mcu'; }}>
                MCU (Medical Check Up)
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="Layanan Unggulan">
              <CommandItem onSelect={() => { setSearchOpen(false); window.location.href = '/layanan-unggulan/bedah-minimal-invasif'; }}>
                Bedah Minimal Invasif
              </CommandItem>
              <CommandItem onSelect={() => { setSearchOpen(false); window.location.href = '/layanan-unggulan/eswl'; }}>
                ESWL
              </CommandItem>
              <CommandItem onSelect={() => { setSearchOpen(false); window.location.href = '/layanan-unggulan/persalinan-syari'; }}>
                Persalinan Syar'i
              </CommandItem>
              <CommandItem onSelect={() => { setSearchOpen(false); window.location.href = '/layanan-unggulan/executive'; }}>
                Layanan Executive
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="Pusat Informasi">
              <CommandItem onSelect={() => { setSearchOpen(false); window.location.href = '/tentang-kami'; }}>
                Tentang Kami
              </CommandItem>
              <CommandItem onSelect={() => { setSearchOpen(false); window.location.href = '/artikel'; }}>
                Artikel & Berita
              </CommandItem>
              <CommandItem onSelect={() => { setSearchOpen(false); window.location.href = '/igd'; }}>
                IGD
              </CommandItem>
              <CommandItem onSelect={() => { setSearchOpen(false); window.location.href = '/lokasi'; }}>
                Peta Lokasi
              </CommandItem>
              <CommandItem onSelect={() => { setSearchOpen(false); window.location.href = '/kontak'; }}>
                Hubungi Kami
              </CommandItem>
              <CommandItem onSelect={() => { setSearchOpen(false); window.location.href = '/faq'; }}>
                FAQ (Tanya Jawab)
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>

        {/* Shopping Cart */}
        {/* <Button size="icon" variant="ghost">
          <ShoppingCart className="h-5 w-5" />
        </Button> */}

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
          ) : isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-accent/50 transition-colors outline-none">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image || undefined} alt={user.name} />
                  <AvatarFallback className="bg-primary text-white text-xs">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline text-sm font-medium max-w-[120px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                {canAccessAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/profil">
                    <User className="h-4 w-4 mr-2" />
                    Profil Saya
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/riwayat-booking">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Riwayat Booking
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden lg:inline">Sign In</span>
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden lg:inline">Sign Up</span>
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-2 mt-6">
              {/* Mobile Navigation */}

              {/* Layanan Kesehatan - Collapsible */}
              <MobileNavSection title="Layanan Kesehatan">
                <MobileNavLink href="/layanan/rawat-inap" onClick={() => setIsOpen(false)}>Rawat Inap</MobileNavLink>
                <MobileNavLink href="/layanan/rawat-jalan" onClick={() => setIsOpen(false)}>Rawat Jalan</MobileNavLink>
                <MobileNavLink href="/layanan/farmasi" onClick={() => setIsOpen(false)}>Farmasi 24 Jam</MobileNavLink>
                <MobileNavLink href="/layanan/laboratorium" onClick={() => setIsOpen(false)}>Laboratorium</MobileNavLink>
                <MobileNavLink href="/layanan/radiologi" onClick={() => setIsOpen(false)}>Radiologi</MobileNavLink>
                <MobileNavLink href="/layanan/rehabilitasi-medik" onClick={() => setIsOpen(false)}>Rehabilitasi Medik</MobileNavLink>
                <MobileNavLink href="/layanan/mcu" onClick={() => setIsOpen(false)}>MCU (Medical Check Up)</MobileNavLink>
              </MobileNavSection>

              {/* Layanan Unggulan - Collapsible */}
              <MobileNavSection title="Layanan Unggulan">
                <MobileNavLink href="/layanan-unggulan/bedah-minimal-invasif" onClick={() => setIsOpen(false)}>Bedah Minimal Invasif</MobileNavLink>
                <MobileNavLink href="/layanan-unggulan/eswl" onClick={() => setIsOpen(false)}>ESWL</MobileNavLink>
                <MobileNavLink href="/layanan-unggulan/persalinan-syari" onClick={() => setIsOpen(false)}>Persalinan Syar'i</MobileNavLink>
                <MobileNavLink href="/layanan-unggulan/executive" onClick={() => setIsOpen(false)}>Layanan Executive</MobileNavLink>
              </MobileNavSection>

              {/* Pusat Informasi - Collapsible */}
              <MobileNavSection title="Pusat Informasi">
                <MobileNavLink href="/tentang-kami" onClick={() => setIsOpen(false)}>Tentang Kami</MobileNavLink>
                <MobileNavLink href="/artikel" onClick={() => setIsOpen(false)}>Artikel & Berita</MobileNavLink>
                <MobileNavLink href="/igd" onClick={() => setIsOpen(false)}>IGD</MobileNavLink>
                <MobileNavLink href="/lokasi" onClick={() => setIsOpen(false)}>Peta Lokasi</MobileNavLink>
                <MobileNavLink href="/kontak" onClick={() => setIsOpen(false)}>Hubungi Kami</MobileNavLink>
                <MobileNavLink href="/faq" onClick={() => setIsOpen(false)}>FAQ (Tanya Jawab)</MobileNavLink>
              </MobileNavSection>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.image || undefined} alt={user.name} />
                        <AvatarFallback className="bg-primary text-white">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    {canAccessAdmin && (
                      <Button variant="ghost" className="justify-start" asChild onClick={() => setIsOpen(false)}>
                        <Link href="/admin">
                          <Settings className="h-4 w-4" />
                          Admin Panel
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" className="justify-start" asChild onClick={() => setIsOpen(false)}>
                      <Link href="/profil">
                        <User className="h-4 w-4" />
                        Profil Saya
                      </Link>
                    </Button>
                    <Button variant="ghost" className="justify-start" asChild onClick={() => setIsOpen(false)}>
                      <Link href="/riwayat-booking">
                        <ClipboardList className="h-4 w-4" />
                        Riwayat Booking
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start text-red-600"
                      onClick={() => { setIsOpen(false); logout(); }}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="justify-start" asChild onClick={() => setIsOpen(false)}>
                      <Link href="/login">
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </Link>
                    </Button>
                    <Button className="justify-start" asChild onClick={() => setIsOpen(false)}>
                      <Link href="/register">
                        <UserPlus className="h-4 w-4" />
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};