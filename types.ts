import { CONTACT_SOURCES_ENUM } from './constants';

export type ContactSource = typeof CONTACT_SOURCES_ENUM[keyof typeof CONTACT_SOURCES_ENUM];

export interface SourceEntry {
  count: number;
  note: string; // Note primarily for 'INNE' source
}

export type DayData = Partial<Record<ContactSource, SourceEntry>>;

export type MonthData = Record<number, DayData>; // Key is day number (1-31)

export type YearData = Record<number, MonthData>; // Key is month index (0-11)

export type SalespersonData = Record<number, YearData>; // Key is year

export type AllSalesData = Record<string, SalespersonData>; // Key is salespersonId

export interface Week {
  weekNumber: number;
  days: number[]; // Day numbers (1-31) within the current month
  startDate: Date;
  endDate: Date;
  label: string; // e.g., "Tydzień 1 (01.06 - 07.06)"
}

export interface SingleSummary {
    summary: Partial<Record<ContactSource, number>>;
    totalContacts: number;
}

export interface PrintableContent {
    reportTitle: string; // "Raport Miesięczny" or "Raport Tygodniowy"
    salespersonName: string;
    mainPeriodDisplay: string; // e.g. "Czerwiec 2025"
    generatedDate: string;
    sections: Array<{
        sectionTitle: string; // e.g. "Podsumowanie Całkowite" or "Tydzień 1 (01.06.2025 - 07.06.2025)"
        data: SingleSummary;
    }>;
}

export type ReportType = 'monthly' | 'weekly';

export interface BackupSettings {
  enabled: boolean;
  time1: string; // HH:MM format
  time2: string; // HH:MM format
}