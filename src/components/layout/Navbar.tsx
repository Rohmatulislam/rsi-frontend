"use client";

import { cn } from "~/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
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
import { ChevronDown, LogIn, Menu, UserPlus, Search, ShoppingCart, User, LogOut, Settings, ClipboardList, Languages, Sun, Moon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/features/auth/hook/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useLocale } from "next-intl";
import { useRouter, usePathname as useIntlPathname } from "~/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState as useMountedState } from "react";
import { SearchCommand } from "./SearchCommand";

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
  const t = useTranslations("Navbar");
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useMountedState(false);
  const { user, isAuthenticated, isLoading, logout, canAccessAdmin } = useAuth();

  const locale = useLocale();
  const router = useRouter();
  const pathname = useIntlPathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const toggleLanguage = (newLocale: "id" | "en") => {
    router.replace(pathname, { locale: newLocale });
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

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
              {t("services")}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuItem asChild>
                <Link href="/layanan/rawat-inap">{t("inpatient")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/layanan/rawat-jalan">{t("outpatient")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/layanan/farmasi">{t("pharmacy")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/layanan/laboratorium?tab=lab">{t("lab")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/layanan/radiologi?tab=radio">{t("radiology")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/layanan/rehabilitasi-medik">{t("rehab")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/layanan/mcu?tab=mcu">{t("mcu")}</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="bg-primary/5 focus:bg-primary/10">
                <Link href="/layanan/diagnostic-hub" className="font-bold text-primary flex items-center justify-between w-full">
                  {t("diagnostic_hub")}
                  <ShoppingCart className="h-3 w-3" />
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Layanan Unggulan */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors outline-none">
              {t("featured_services")}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuItem asChild>
                <Link href="/layanan-unggulan/bedah-minimal-invasif">{t("surgery")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/layanan-unggulan/eswl">{t("eswl")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/layanan-unggulan/persalinan-syari">{t("birth")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/layanan-unggulan/executive">{t("executive")}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Pusat Informasi */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors outline-none">
              {t("info_center")}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuItem asChild>
                <Link href="/tentang-kami">{t("about")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/artikel">{t("news")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/igd">{t("igd")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/lokasi">{t("location")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/kontak">{t("contact")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/faq">{t("faq")}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Right side - Auth & Mobile Menu */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Search Input - Desktop only (Trigger) */}
        <div className="hidden lg:flex relative">
          <Button
            variant="outline"
            className="w-64 justify-start text-muted-foreground font-normal relative"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            {t("search_placeholder")}
            <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>

        <Button size="icon" variant="ghost" className="lg:hidden" onClick={() => setSearchOpen(true)}>
          <Search className="h-5 w-5" />
        </Button>

        {/* Search Dialog */}
        <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />

        {/* Shopping Cart */}
        {/* <Button size="icon" variant="ghost">
          <ShoppingCart className="h-5 w-5" />
        </Button> */}

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          {isLoading || !mounted ? (
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
              <DropdownMenuContent align="end" className="w-[220px]">
                {canAccessAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      {t("admin_panel")}
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/profil" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {t("my_profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/riwayat-booking" className="flex items-center">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    {t("booking_history")}
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Theme & Language Integrated */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Languages className="h-4 w-4 mr-2" />
                    {t("language")}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => toggleLanguage("id")} className={cn(locale === "id" && "bg-accent")}>
                        <span className="mr-2">🇮🇩</span> Bahasa Indonesia
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleLanguage("en")} className={cn(locale === "en" && "bg-accent")}>
                        <span className="mr-2">🇺🇸</span> English (US)
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuItem onClick={toggleTheme}>
                  {!mounted ? (
                    <div className="h-4 w-4 mr-2" />
                  ) : theme === "dark" ? (
                    <Sun className="h-4 w-4 mr-2" />
                  ) : (
                    <Moon className="h-4 w-4 mr-2" />
                  )}
                  {t("theme")}: {!mounted ? "..." : (theme === "dark" ? t("light") : t("dark"))}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              {/* Settings for Guests */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Languages className="h-4 w-4 mr-2" />
                      {t("language")}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => toggleLanguage("id")} className={locale === "id" ? "bg-accent" : ""}>
                          <span className="mr-2">🇮🇩</span> Bahasa Indonesia
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleLanguage("en")} className={locale === "en" ? "bg-accent" : ""}>
                          <span className="mr-2">🇺🇸</span> English (US)
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuItem onClick={toggleTheme}>
                    {!mounted ? (
                      <div className="h-4 w-4 mr-2" />
                    ) : theme === "dark" ? (
                      <Sun className="h-4 w-4 mr-2" />
                    ) : (
                      <Moon className="h-4 w-4 mr-2" />
                    )}
                    {t("theme")}: {!mounted ? "..." : (theme === "dark" ? t("light") : t("dark"))}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden lg:inline">{t("login")}</span>
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden lg:inline">{t("register")}</span>
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
              <MobileNavSection title={t("services")}>
                <MobileNavLink href="/layanan/rawat-inap" onClick={() => setIsOpen(false)}>{t("inpatient")}</MobileNavLink>
                <MobileNavLink href="/layanan/rawat-jalan" onClick={() => setIsOpen(false)}>{t("outpatient")}</MobileNavLink>
                <MobileNavLink href="/layanan/farmasi" onClick={() => setIsOpen(false)}>{t("pharmacy")}</MobileNavLink>
                <MobileNavLink href="/layanan/diagnostic-hub?tab=lab" onClick={() => setIsOpen(false)}>{t("lab")}</MobileNavLink>
                <MobileNavLink href="/layanan/diagnostic-hub?tab=radio" onClick={() => setIsOpen(false)}>{t("radiology")}</MobileNavLink>
                <MobileNavLink href="/layanan/rehabilitasi-medik" onClick={() => setIsOpen(false)}>{t("rehab")}</MobileNavLink>
                <MobileNavLink href="/layanan/diagnostic-hub?tab=mcu" onClick={() => setIsOpen(false)}>{t("mcu")}</MobileNavLink>
                <div className="mx-3 my-1 border-t border-dashed" />
                <MobileNavLink href="/layanan/diagnostic-hub" onClick={() => setIsOpen(false)}>
                  <span className="font-bold text-primary">{t("diagnostic_hub")}</span>
                </MobileNavLink>
              </MobileNavSection>

              {/* Layanan Unggulan - Collapsible */}
              <MobileNavSection title={t("featured_services")}>
                <MobileNavLink href="/layanan-unggulan/bedah-minimal-invasif" onClick={() => setIsOpen(false)}>{t("surgery")}</MobileNavLink>
                <MobileNavLink href="/layanan-unggulan/eswl" onClick={() => setIsOpen(false)}>{t("eswl")}</MobileNavLink>
                <MobileNavLink href="/layanan-unggulan/persalinan-syari" onClick={() => setIsOpen(false)}>{t("birth")}</MobileNavLink>
                <MobileNavLink href="/layanan-unggulan/executive" onClick={() => setIsOpen(false)}>{t("executive")}</MobileNavLink>
              </MobileNavSection>

              {/* Pusat Informasi - Collapsible */}
              <MobileNavSection title={t("info_center")}>
                <MobileNavLink href="/tentang-kami" onClick={() => setIsOpen(false)}>{t("about")}</MobileNavLink>
                <MobileNavLink href="/artikel" onClick={() => setIsOpen(false)}>{t("news")}</MobileNavLink>
                <MobileNavLink href="/igd" onClick={() => setIsOpen(false)}>{t("igd")}</MobileNavLink>
                <MobileNavLink href="/lokasi" onClick={() => setIsOpen(false)}>{t("location")}</MobileNavLink>
                <MobileNavLink href="/kontak" onClick={() => setIsOpen(false)}>{t("contact")}</MobileNavLink>
                <MobileNavLink href="/faq" onClick={() => setIsOpen(false)}>{t("faq")}</MobileNavLink>
              </MobileNavSection>

              {/* Settings - Mobile */}
              <MobileNavSection title={t("settings")}>
                <div className="flex flex-col gap-2 p-2">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Languages className="h-4 w-4 opacity-70" />
                      {t("language")}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant={locale === "id" ? "default" : "outline"}
                        size="sm"
                        className="h-7 px-2 text-[10px]"
                        onClick={() => toggleLanguage("id")}
                      >
                        ID
                      </Button>
                      <Button
                        variant={locale === "en" ? "default" : "outline"}
                        size="sm"
                        className="h-7 px-2 text-[10px]"
                        onClick={() => toggleLanguage("en")}
                      >
                        EN
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-1 border-t border-border/50 pt-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {!mounted ? (
                        <div className="h-4 w-4 opacity-70" />
                      ) : theme === "dark" ? (
                        <Moon className="h-4 w-4 opacity-70" />
                      ) : (
                        <Sun className="h-4 w-4 opacity-70" />
                      )}
                      {t("theme")}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-3 text-[10px]"
                      onClick={toggleTheme}
                    >
                      {!mounted ? "..." : (theme === "dark" ? t("light") : t("dark"))}
                    </Button>
                  </div>
                </div>
              </MobileNavSection>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                {!mounted || isLoading ? (
                  <div className="flex flex-col gap-2 p-3">
                    <div className="h-10 w-full bg-slate-100 animate-pulse rounded-lg" />
                    <div className="h-10 w-full bg-slate-100 animate-pulse rounded-lg" />
                  </div>
                ) : isAuthenticated && user ? (
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
                          {t("admin_panel")}
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" className="justify-start" asChild onClick={() => setIsOpen(false)}>
                      <Link href="/profil">
                        <User className="h-4 w-4" />
                        {t("my_profile")}
                      </Link>
                    </Button>
                    <Button variant="ghost" className="justify-start" asChild onClick={() => setIsOpen(false)}>
                      <Link href="/riwayat-booking">
                        <ClipboardList className="h-4 w-4" />
                        {t("booking_history")}
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start text-red-600"
                      onClick={() => { setIsOpen(false); logout(); }}
                    >
                      <LogOut className="h-4 w-4" />
                      {t("logout")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="justify-start" asChild onClick={() => setIsOpen(false)}>
                      <Link href="/login">
                        <LogIn className="h-4 w-4" />
                        {t("login")}
                      </Link>
                    </Button>
                    <Button className="justify-start" asChild onClick={() => setIsOpen(false)}>
                      <Link href="/register">
                        <UserPlus className="h-4 w-4" />
                        {t("register")}
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav >
  );
};