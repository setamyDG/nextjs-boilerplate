import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "de"],
  // Used when no locale matches
  defaultLocale: "en",
  localeCookie: {
    name: "USER-LOCALE",
    maxAge: 60 * 60 * 24 * 365,
  },
  localePrefix: "always",
})
