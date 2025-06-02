
import { SalespersonData } from '../types.ts';
import {
    CONTACT_SOURCES_KEY_TO_VALUE_MAP,
    CONTACT_SOURCES_VALUE_TO_KEY_MAP,
    BACKUP_FILE_VERSION,
    BACKUP_CSV_DELIMITER,
    BACKUP_CSV_EOL
} from '../constants.ts';

// Helper to safely format CSV fields for backup
const safeField = (field: string | number | undefined): string => {
  const str = String(field === undefined || field === null ? '' : field);
  if (str.includes(BACKUP_CSV_DELIMITER) || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export function salespersonDataToBackupCSV(salespersonId: string, data: SalespersonData): string {
  let csvString = '';

  // Metadata
  csvString += `SalespersonID${BACKUP_CSV_DELIMITER}${safeField(salespersonId)}${BACKUP_CSV_EOL}`;
  csvString += `BackupVersion${BACKUP_CSV_DELIMITER}${safeField(BACKUP_FILE_VERSION)}${BACKUP_CSV_EOL}`;
  csvString += `BackupTimestamp${BACKUP_CSV_DELIMITER}${safeField(new Date().toISOString())}${BACKUP_CSV_EOL}`;
  csvString += `---DATA_START---${BACKUP_CSV_EOL}`;
  csvString += `YEAR${BACKUP_CSV_DELIMITER}MONTH_IDX${BACKUP_CSV_DELIMITER}DAY${BACKUP_CSV_DELIMITER}SOURCE_KEY${BACKUP_CSV_DELIMITER}COUNT${BACKUP_CSV_DELIMITER}NOTE${BACKUP_CSV_EOL}`;

  // Data
  Object.entries(data).forEach(([yearStr, yearData]) => {
    const year = parseInt(yearStr, 10);
    Object.entries(yearData).forEach(([monthIdxStr, monthData]) => {
      const monthIdx = parseInt(monthIdxStr, 10);
      Object.entries(monthData).forEach(([dayStr, dayData]) => {
        const day = parseInt(dayStr, 10);
        Object.entries(dayData).forEach(([sourceValue, sourceEntry]) => {
          const sourceKey = CONTACT_SOURCES_VALUE_TO_KEY_MAP[sourceValue];
          if (sourceKey && sourceEntry) { 
            csvString += `${safeField(year)}${BACKUP_CSV_DELIMITER}`;
            csvString += `${safeField(monthIdx)}${BACKUP_CSV_DELIMITER}`;
            csvString += `${safeField(day)}${BACKUP_CSV_DELIMITER}`;
            csvString += `${safeField(sourceKey)}${BACKUP_CSV_DELIMITER}`;
            csvString += `${safeField(sourceEntry.count)}${BACKUP_CSV_DELIMITER}`;
            csvString += `${safeField(sourceEntry.note)}${BACKUP_CSV_EOL}`;
          }
        });
      });
    });
  });
  csvString += `---DATA_END---${BACKUP_CSV_EOL}`;
  return csvString;
}

export function parseBackupCSVToSalespersonData(csvString: string): { salespersonId: string; data: SalespersonData; version: string } | null {
  console.log("[CSV PARSER] Starting CSV parsing. Length:", csvString.length, "First 500 chars:", csvString.substring(0, 500));
  const lines = csvString.split(/\r\n|\n|\r/); 
  console.log(`[CSV PARSER] Split into ${lines.length} lines.`);
  const metadata: Record<string, string> = {};
  const dataRows: string[][] = [];
  let isDataSection = false;
  let dataHeaderSkipped = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // console.log(`[CSV PARSER] Processing line ${i + 1}: "${line}"`);
    if (line.trim() === '') {
      // console.log(`[CSV PARSER] Line ${i + 1} is empty, skipping.`);
      continue;
    }

    if (line.startsWith('---DATA_START---')) {
      isDataSection = true;
      dataHeaderSkipped = false; 
      console.log("[CSV PARSER] Entered data section.");
      continue;
    }
    if (line.startsWith('---DATA_END---')) {
      isDataSection = false;
      console.log("[CSV PARSER] Exited data section.");
      continue;
    }

    if (isDataSection) {
      if (!dataHeaderSkipped) { 
        dataHeaderSkipped = true;
        console.log("[CSV PARSER] Skipped data header row:", line);
        continue;
      }
      
      const rowValues: string[] = [];
      let currentPart = '';
      let inQuotes = false;
      for (let charIdx = 0; charIdx < line.length; charIdx++) {
        const char = line[charIdx];
        if (char === '"') {
          if (inQuotes && charIdx + 1 < line.length && line[charIdx + 1] === '"') { 
            currentPart += '"';
            charIdx++; 
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === BACKUP_CSV_DELIMITER && !inQuotes) {
          rowValues.push(currentPart);
          currentPart = '';
        } else {
          currentPart += char;
        }
      }
      rowValues.push(currentPart); 

      if (rowValues.length === 6) {
        // console.log("[CSV PARSER] Parsed data row values:", rowValues);
        dataRows.push(rowValues);
      } else if (line.trim() !== '') {
         console.warn("[CSV PARSER] Skipping malformed data row (incorrect number of parts):", line, "Parts count:", rowValues.length, "Expected: 6", "Parsed parts:", rowValues);
      }
    } else { 
      const parts = line.split(BACKUP_CSV_DELIMITER, 2); 
      if (parts.length === 2) {
        const key = parts[0].trim();
        let value = parts[1].trim();
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1).replace(/""/g, '"');
        }
        metadata[key] = value;
        // console.log(`[CSV PARSER] Parsed metadata: ${key} = ${value}`);
      } else {
        console.warn("[CSV PARSER] Skipping malformed metadata line:", line);
      }
    }
  }
  console.log("[CSV PARSER] Finished reading lines. Parsed metadata:", metadata);
  console.log(`[CSV PARSER] Collected ${dataRows.length} data rows.`);

  const salespersonId = metadata['SalespersonID'] ? metadata['SalespersonID'].trim() : undefined;
  const backupVersion = metadata['BackupVersion'] ? metadata['BackupVersion'].trim() : undefined;

  if (!salespersonId || salespersonId.length === 0) {
    console.error("[CSV PARSER] Backup CSV parsing failed: SalespersonID is missing or empty in metadata.", metadata);
    return null;
  }
  if (!backupVersion || backupVersion.length === 0) {
    console.error(`[CSV PARSER] Backup CSV parsing failed for ${salespersonId}: BackupVersion is missing or empty in metadata.`, metadata);
    return null;
  }
  console.log(`[CSV PARSER] Backup identified for Salesperson: ${salespersonId}, Version: ${backupVersion}`);

  const restoredData: SalespersonData = {};
  let processedRowCount = 0;

  for (const row of dataRows) {
    try {
      const year = parseInt(row[0], 10);
      const monthIdx = parseInt(row[1], 10);
      const day = parseInt(row[2], 10);
      const sourceKey = row[3] as keyof typeof CONTACT_SOURCES_KEY_TO_VALUE_MAP; 
      const count = parseInt(row[4], 10);
      const note = row[5]; 

      console.log(`[CSV PARSER DATA ROW] Processing: Y=${year}, M=${monthIdx}, D=${day}, SK=${sourceKey}, Cnt=${count}, Note="${note}"`);

      const sourceValue = CONTACT_SOURCES_KEY_TO_VALUE_MAP[sourceKey]; 
      if (!sourceValue) {
        console.warn(`[CSV PARSER DATA ROW] Unknown source key in backup: ${sourceKey} for row:`, row, "SKIPPING THIS ROW.");
        continue;
      }
      console.log(`[CSV PARSER DATA ROW] Mapped SourceKey '${sourceKey}' to SourceValue '${sourceValue}'`);

      if (isNaN(year) || isNaN(monthIdx) || isNaN(day) || isNaN(count)) {
        console.warn("[CSV PARSER DATA ROW] Skipping invalid data row (NaN values):", row, "SKIPPING THIS ROW.");
        continue;
      }

      restoredData[year] = restoredData[year] || {};
      restoredData[year][monthIdx] = restoredData[year][monthIdx] || {};
      restoredData[year][monthIdx][day] = restoredData[year][monthIdx][day] || {};
      
      console.log(`[CSV PARSER DATA ROW] Assigning to restoredData[${year}][${monthIdx}][${day}]['${sourceValue}']: { count: ${count}, note: '${note}' }`);
      restoredData[year][monthIdx][day][sourceValue] = { count, note };
      // console.log(`[CSV PARSER DATA ROW] Current state of restoredData[${year}][${monthIdx}][${day}]:`, JSON.stringify(restoredData[year][monthIdx][day]));
      processedRowCount++;
    } catch (e) {
      console.error("[CSV PARSER DATA ROW] Error processing parsed data row from backup:", row, e);
    }
  }
  
  if (Object.keys(restoredData).length === 0 && dataRows.length > 0) {
    console.warn("[CSV PARSER] Data rows were present in CSV, but no data was actually restored into the final object. Check parsing logic and source key mapping.");
  } else if (dataRows.length > 0) {
    console.log(`[CSV PARSER] Successfully processed ${processedRowCount} data rows into restoredData object.`);
  } else if (dataRows.length === 0) {
    console.log("[CSV PARSER] No data rows found to process.");
  }
  
  // console.log("[CSV PARSER] Final restoredData object before returning (full):", JSON.stringify(restoredData));
  // Log only top-level keys of restoredData if it's too large
   if (Object.keys(restoredData).length > 0) {
    console.log("[CSV PARSER] Final restoredData object has top-level year keys:", Object.keys(restoredData));
   } else {
    console.log("[CSV PARSER] Final restoredData object is empty.");
   }


  return { salespersonId, data: restoredData, version: backupVersion };
}