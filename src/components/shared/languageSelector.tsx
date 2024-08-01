// components/LanguageSelector.tsx
import React from "react";
import { useRouter as useNextRouter } from "next/router";
import {
  FormControl,
  FormLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { languageDetector } from "@/utils/lib/languageDetector";
import { usePathname, useRouter } from "next/navigation";
import { i18nConfig } from "../../../i18n";

const LanguageSelector: React.FC = () => {
  const nextRouter = useNextRouter();
  const router = useRouter();
  const locale: any = i18nConfig.locales.includes(
    String(nextRouter.query.locale)
  )
    ? String(nextRouter.query.locale)
    : languageDetector.detect();
  const pathname = usePathname();
  // const locale = pathname.split("/")?.[1];
  const availableLocales = ["en", "fr", "de", "gu"];

  const changeLanguage = (event: any) => {
    const selectedLocale = event.target.value as string;
    languageDetector.cache?.(selectedLocale);
    const newPath = pathname.replace(locale, selectedLocale);
    router.push(newPath);
  };

  return (
    <FormControl variant="outlined" style={{ minWidth: 120 }} fullWidth>
      <FormLabel>Language</FormLabel>
      <Select value={locale} onChange={changeLanguage}>
        {availableLocales.map((loc) => (
          <MenuItem key={loc} value={loc}>
            {loc === "en"
              ? "English"
              : loc === "fr"
              ? "French"
              : loc === "de"
              ? "German"
              : "Gujarati"}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
