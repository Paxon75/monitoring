
export const SALESPEOPLE_IDS: string[] = Array.from({ length: 10 }, (_, i) => `Handlowiec ${i + 1}`);

export const CONTACT_SOURCES_ENUM = {
  WEBSITE: "Strona internetowa",
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
  LINKEDIN: "LinkedIn",
  GOOGLE_ORGANIC: "Google (organiczne)",
  GOOGLE_ADS: "Reklama Google Ads",
  ALLEGRO: "Allegro",
  OLX: "OLX",
  REFERRAL: "Polecenie",
  EVENT: "Wydarzenie / targi",
  MAILING: "Mailing / newsletter",
  OTHER: "Inne",
} as const;

export const CONTACT_SOURCES_LIST = Object.values(CONTACT_SOURCES_ENUM);

// Map from enum key (e.g., WEBSITE) to enum value (e.g., "Strona internetowa")
export const CONTACT_SOURCES_KEY_TO_VALUE_MAP = CONTACT_SOURCES_ENUM;

// Map from enum value (e.g., "Strona internetowa") to enum key (e.g., WEBSITE)
export const CONTACT_SOURCES_VALUE_TO_KEY_MAP = Object.entries(
  CONTACT_SOURCES_ENUM
).reduce((acc, [key, value]) => {
  acc[value] = key as keyof typeof CONTACT_SOURCES_ENUM;
  return acc;
}, {} as Record<string, keyof typeof CONTACT_SOURCES_ENUM>);


export const MONTH_NAMES_PL = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", 
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
];

export const DAY_NAMES_PL_SHORT = ["Niedz.", "Pon.", "Wt.", "Śr.", "Czw.", "Pt.", "Sob."];

export const START_YEAR = 2025;
export const START_MONTH_INDEX = 5; // Czerwiec (June) is 5 (0-indexed)
export const END_MONTH_INDEX = 11; // Grudzień (December) is 11 (0-indexed)

export const BACKUP_FILE_VERSION = "1.0";
export const BACKUP_CSV_DELIMITER = ";";
export const BACKUP_CSV_EOL = "\r\n";
