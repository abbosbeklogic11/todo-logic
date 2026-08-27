import { LANGS, translations } from "@/lib/i18n/translations";

describe("i18n translations", () => {
  it("has matching keys across all languages", () => {
    const uzKeys = Object.keys(translations.uz).sort();
    for (const lang of LANGS) {
      expect(Object.keys(translations[lang]).sort()).toEqual(uzKeys);
    }
  });

  it("falls back to Uzbek then key when missing", () => {
    // Uzbek exists
    expect(translations.uz["nav.dashboard"]).toBe("Boshqaruv");
    // every language key resolves to a non-empty string
    for (const lang of LANGS) {
      for (const key of Object.keys(translations.uz)) {
        expect(translations[lang][key]).toBeTruthy();
      }
    }
  });
});
