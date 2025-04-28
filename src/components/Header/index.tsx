// src/components/Header/index.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";
import { AuthButtons } from "./AuthButtons";
import { AuthenticatedMenu } from "./AuthenticatedMenu";
import { useAuth } from "@/hooks/useAuth_v0";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const Header = () => {
  const t = useTranslations("header");

  const { user, loading } = useAuth();
  const toast = useToast();

  console.log("🔹 Header - user:", user, "loading:", loading);
  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  const usePathName = usePathname();

  return (
    <>
      <header
        className={`header left-0 top-0 z-40 flex w-full flex-col items-center transition-all duration-300 ${
          sticky
            ? "dark:bg-gray-dark dark:shadow-sticky-dark fixed z-40 bg-white !bg-opacity-80 shadow-sticky backdrop-blur-sm"
            : "fixed bg-transparent"
        }`}
      >
        {/* Tier 1 - Logo and Auth buttons */}
        <div className="container px-4 mx-auto">
          <div className="relative -mx-4 flex flex-wrap sm:flex-nowrap items-center justify-between">
            {/* Logo */}
            <div className="w-auto max-w-full xl:mr-8">
              <Link
                href="/"
                className={`header-logo block w-full ${
                  sticky ? "py-0 lg:py-0" : "py-0"
                } `}
              >
                <div className="flex items-center gap-1 py-2 px-2 sm:px-4">
                  <Image
                    src="/images/logo/logoe.svg"
                    alt="logo"
                    width={80}
                    height={80}
                    className=" dark:hidden"
                  />
                  <Image
                    src="/images/logo/logo-name.svg"
                    alt="logo"
                    width={90}
                    height={90}
                    className="dark:hidden"
                  />
                </div>
              </Link>
            </div>

            {/* Marquee Text (Responsive - hidden on mobile) */}
            <div className="hidden md:block relative overflow-hidden flex-1">
              <p className="overflow-hidden italic text-transparent bg-gradient-to-b from-[#33FFCC] to-[#0033CC] dark:from-[#5FFFDD] dark:to-[#3355FF] bg-clip-text animate-marquee whitespace-nowrap">
                {t("marqueeText")}
              </p>
            </div>

            {/* Auth Buttons or Authenticated Menu */}
            <div className="flex items-center justify-end px-2 sm:px-4 xl:ml-8">
              {loading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : user ? (
                <AuthenticatedMenu user={user} />
              ) : (
                <AuthButtons />
              )}
              <ThemeToggler />
            </div>
          </div>
        </div>

        {/* Tier 2 - Navigation menu */}
        <div className="container mx-auto flex justify-center items-center border-t border-body-color/10 dark:border-body-color/20">
          <div className="relative flex items-center justify-between w-full">
            <div className="flex items-center justify-between px-4 w-full">
              <div className="w-full">
                {/* Mobile menu button */}
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label={t("mobileMenuAriaLabel")}
                  className="absolute right-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-[6px] ring-[#4A6CF7] focus:ring-2 lg:hidden"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? " top-[7px] rotate-45" : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "opacity-0 " : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? " top-[-8px] -rotate-45" : " "
                    }`}
                  />
                </button>

                {/* Navigation menu */}
                <nav
                  id="navbarCollapse"
                  className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-body-color/50 bg-white px-6 py-4 duration-300 dark:border-body-color/20 dark:bg-dark lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                    navbarOpen
                      ? "visibility top-full opacity-100"
                      : "invisible top-[120%] opacity-0"
                  }`}
                >
                  <ul className="block lg:flex items-center justify-center">
                    {menuData.map((menuItem, index) => (
                      <li key={index} className="group relative">
                        {menuItem.path ? (
                          <Link
                            href={menuItem.path}
                            className={`flex py-2 px-4 md:px-6 lg:px-8 xl:px-12 text-base lg:mr-0 lg:inline-flex lg:py-3 transition-colors duration-200 ${
                              usePathName === menuItem.path
                                ? "text-[#4A6CF7] dark:text-white"
                                : "text-dark hover:text-[#4A6CF7] dark:text-white/70 dark:hover:text-white"
                            }`}
                          >
                            {t(`menu.${menuItem.title.toLowerCase()}`)}
                          </Link>
                        ) : (
                          <>
                            <p
                              onClick={() => handleSubmenu(index)}
                              className="flex cursor-pointer items-center justify-between py-2 text-base text-dark group-hover:text-[#4A6CF7] dark:text-white/70 dark:group-hover:text-white lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 transition-colors duration-200"
                            >
                              {t(`menu.${menuItem.title.toLowerCase()}`)}
                              <span className="pl-3">
                                <svg width="25" height="24" viewBox="0 0 25 24">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                            </p>
                            <div
                              className={`submenu relative left-0 top-full rounded-sm bg-white transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${
                                openIndex === index ? "block" : "hidden"
                              }`}
                            >
                              {menuItem.submenu.map((submenuItem, index) => (
                                <Link
                                  href={submenuItem.path}
                                  key={index}
                                  className="block rounded py-2.5 text-sm text-dark hover:text-[#4A6CF7] dark:text-white/70 dark:hover:text-white lg:px-3 transition-colors duration-200"
                                >
                                  {t(
                                    `submenu.${submenuItem.title.toLowerCase()}`
                                  )}
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
