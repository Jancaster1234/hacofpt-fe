// src/components/LanguageSwitcher.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    // Replace the locale segment in the URL
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleLocaleChange("en")}
        className={locale === "en" ? "font-bold" : ""}
      >
        English
      </button>
      <button
        onClick={() => handleLocaleChange("vi")}
        className={locale === "vi" ? "font-bold" : ""}
      >
        Tiếng Việt
      </button>
    </div>
  );
}
