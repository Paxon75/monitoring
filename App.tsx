
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AllSalesData, ContactSource, DayData, MonthData, YearData, SalespersonData, Week, PrintableContent, ReportType, SingleSummary, BackupSettings } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SALESPEOPLE_IDS, START_YEAR, START_MONTH_INDEX, MONTH_NAMES_PL, CONTACT_SOURCES_ENUM, CONTACT_SOURCES_LIST, BACKUP_CSV_EOL } from './constants';
import { getWeeksInMonth, formatDateFull } from './utils/dateUtils';
import { salespersonDataToBackupCSV, parseBackupCSVToSalespersonData } from './utils/csvUtils';
import SalespersonSelector from './components/SalespersonSelector';
import MonthNavigator from './components/MonthNavigator';
import DayCard from './components/DayCard';
import MonthlySummary from './components/MonthlySummary';
import WeeklySummary from './components/WeeklySummary';
import PrintModal from './components/PrintModal';
import BackupSettingsModal from './components/BackupSettingsModal';
import RestoreConfirmModal from './components/RestoreConfirmModal';
import Toast from './components/Toast';
import { DownloadIcon, CogIcon, SaveIcon, UploadIcon } from './components/icons';

interface ParsedBackupData {
  salespersonId: string;
  data: SalespersonData;
  version: string;
}

const App: React.FC = () => {
  const [allSalesData, setAllSalesData] = useLocalStorage<AllSalesData>('contactTrackerData', {});
  const [selectedSalesperson, setSelectedSalesperson] = useState<string>(SALESPEOPLE_IDS[0]);
  const [currentYear, setCurrentYear] = useState<number>(START_YEAR);
  const [currentMonth, setCurrentMonth] = useState<number>(START_MONTH_INDEX); 

  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [weeksInCurrentMonth, setWeeksInCurrentMonth] = useState<Week[]>([]);

  const [backupSettings, setBackupSettings] = useLocalStorage<BackupSettings>('contactBackupSettings', {
    enabled: false,
    time1: '10:00',
    time2: '16:00',
  });
  const [showBackupSettingsModal, setShowBackupSettingsModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const restoreFileInputRef = useRef<HTMLInputElement>(null);

  const [isRestoreConfirmModalOpen, setIsRestoreConfirmModalOpen] = useState<boolean>(false);
  const [pendingRestoreData, setPendingRestoreData] = useState<ParsedBackupData | null>(null);


  useEffect(() => {
    setWeeksInCurrentMonth(getWeeksInMonth(currentYear, currentMonth));
  }, [currentYear, currentMonth]);

  // Automatic backup logic
  useEffect(() => {
    if (!backupSettings.enabled) return;

    const checkTimeAndBackup = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      if (currentTime === backupSettings.time1 || currentTime === backupSettings.time2) {
        const currentSalespersonDataset = allSalesData[selectedSalesperson];
        if (currentSalespersonDataset && Object.keys(currentSalespersonDataset).length > 0) {
          console.log(`Automatic backup triggered for ${selectedSalesperson} at ${currentTime}`);
          handleCreateBackup(selectedSalesperson, true);
        } else {
          console.log(`Automatic backup for ${selectedSalesperson} at ${currentTime} skipped - no data or feature disabled.`);
        }
      }
    };

    const intervalId = setInterval(checkTimeAndBackup, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [backupSettings, allSalesData, selectedSalesperson]);


  const handleSalespersonChange = (salespersonId: string) => {
    setSelectedSalesperson(salespersonId);
  };

  const handleMonthChange = (newMonth: number) => {
    setCurrentMonth(newMonth);
  };
  
  const getDaysInMonth = (year: number, month: number): number[] => {
    const date = new Date(year, month + 1, 0);
    const numDays = date.getDate();
    return Array.from({ length: numDays }, (_, i) => i + 1);
  };

  const handleAddContact = useCallback((day: number, source: ContactSource, note?: string) => {
    setAllSalesData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData)); 

      newData[selectedSalesperson] = newData[selectedSalesperson] || {};
      newData[selectedSalesperson][currentYear] = newData[selectedSalesperson][currentYear] || {};
      newData[selectedSalesperson][currentYear][currentMonth] = newData[selectedSalesperson][currentYear][currentMonth] || {};
      newData[selectedSalesperson][currentYear][currentMonth][day] = newData[selectedSalesperson][currentYear][currentMonth][day] || {};
      
      const dayDataForSource = newData[selectedSalesperson][currentYear][currentMonth][day][source] || { count: 0, note: '' };
      
      const onlyNoteChangedForOther = source === CONTACT_SOURCES_ENUM.OTHER &&
                                   typeof note !== 'undefined' &&
                                   dayDataForSource.count > 0 &&
                                   dayDataForSource.note !== note;

      if (onlyNoteChangedForOther) {
        dayDataForSource.note = note;
      } else { 
        dayDataForSource.count += 1;
        if (source === CONTACT_SOURCES_ENUM.OTHER) {
           dayDataForSource.note = typeof note !== 'undefined' ? note : dayDataForSource.note || '';
        }
      }
      
      newData[selectedSalesperson][currentYear][currentMonth][day][source] = dayDataForSource;
      return newData;
    });
  }, [selectedSalesperson, currentYear, currentMonth, setAllSalesData]);

  const handleRemoveContact = useCallback((day: number, source: ContactSource) => {
    setAllSalesData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const dayDataForSource = newData[selectedSalesperson]?.[currentYear]?.[currentMonth]?.[day]?.[source];

      if (dayDataForSource && dayDataForSource.count > 0) {
        dayDataForSource.count -= 1;
        if (source === CONTACT_SOURCES_ENUM.OTHER && dayDataForSource.count === 0) {
          dayDataForSource.note = ''; 
        }
      }
      return newData;
    });
  }, [selectedSalesperson, currentYear, currentMonth, setAllSalesData]);

  const currentSalespersonData: SalespersonData | undefined = allSalesData[selectedSalesperson];
  const currentYearData: YearData | undefined = currentSalespersonData?.[currentYear];
  const currentMonthData: MonthData | undefined = currentYearData?.[currentMonth];
  
  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);

  const preparePrintDataInternal = (reportType: ReportType): PrintableContent => {
    const monthName = MONTH_NAMES_PL[currentMonth];
    const generatedDate = formatDateFull(new Date());
    const reportTitleBase = `${monthName} ${currentYear}`;
    const sections: PrintableContent['sections'] = [];

    if (reportType === 'monthly') {
      const monthlySummaryData: Partial<Record<ContactSource, number>> = {};
      let totalMonthlyContacts = 0;
      CONTACT_SOURCES_LIST.forEach(s => monthlySummaryData[s] = 0);
      if (currentMonthData) {
        Object.values(currentMonthData).forEach(dayEntry => {
          CONTACT_SOURCES_LIST.forEach(s => {
            if (dayEntry[s]) {
              monthlySummaryData[s]! += dayEntry[s]!.count;
              totalMonthlyContacts += dayEntry[s]!.count;
            }
          });
        });
      }
      sections.push({
        sectionTitle: `Podsumowanie Całkowite - ${monthName} ${currentYear}`,
        data: { summary: monthlySummaryData, totalContacts: totalMonthlyContacts }
      });
    } else if (reportType === 'weekly') {
      weeksInCurrentMonth.forEach(week => {
        const weeklySummary: Partial<Record<ContactSource, number>> = {};
        let totalWeeklyContacts = 0;
        CONTACT_SOURCES_LIST.forEach(s => weeklySummary[s] = 0);
        if (currentMonthData) {
          week.days.forEach(dayNum => {
            const dayEntry = currentMonthData[dayNum];
            if (dayEntry) {
              CONTACT_SOURCES_LIST.forEach(s => {
                if (dayEntry[s]) {
                  weeklySummary[s]! += dayEntry[s]!.count;
                  totalWeeklyContacts += dayEntry[s]!.count;
                }
              });
            }
          });
        }
        sections.push({
          sectionTitle: week.label,
          data: { summary: weeklySummary, totalContacts: totalWeeklyContacts }
        });
      });
    }
    return {
      reportTitle: reportType === 'monthly' ? `Raport Miesięczny` : `Raport Tygodniowy`,
      salespersonName: selectedSalesperson,
      mainPeriodDisplay: reportTitleBase,
      generatedDate,
      sections
    };
  };
  
  const convertDataToReportCSV = (data: PrintableContent): string => {
    let csvString = '';
    const EOL = BACKUP_CSV_EOL;
    const DELIMITER = ';'; 
    const safeField = (field: string | number | undefined): string => {
      const str = String(field === undefined ? '' : field);
      if (str.includes(DELIMITER) || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    csvString += `Raport${DELIMITER}${safeField(data.reportTitle)}${EOL}`;
    csvString += `Handlowiec${DELIMITER}${safeField(data.salespersonName)}${EOL}`;
    csvString += `Okres${DELIMITER}${safeField(data.mainPeriodDisplay)}${EOL}`;
    csvString += `Wygenerowano${DELIMITER}${safeField(data.generatedDate)}${EOL}${EOL}`;
    data.sections.forEach(section => {
      csvString += `${safeField(section.sectionTitle)}${EOL}`;
      csvString += `Źródło${DELIMITER}Ilość${EOL}`;
      CONTACT_SOURCES_LIST.forEach(source => {
        const count = section.data.summary[source] || 0;
        csvString += `${safeField(source)}${DELIMITER}${safeField(count)}${EOL}`;
      });
      csvString += `Łącznie${DELIMITER}${safeField(section.data.totalContacts)}${EOL}${EOL}`;
    });
    return csvString;
  };

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportReportConfirm = (reportType: ReportType) => {
    const reportData = preparePrintDataInternal(reportType);
    const csvString = convertDataToReportCSV(reportData);
    const safeSalespersonName = selectedSalesperson.replace(/[^a-z0-9_]/gi, '_');
    const monthNameSafe = MONTH_NAMES_PL[currentMonth].replace(/[^a-z0-9_]/gi, '_');
    const filename = `Raport_${safeSalespersonName}_${monthNameSafe}_${currentYear}.csv`;
    downloadFile(csvString, filename, 'text/csv;charset=utf-8;');
    setIsPrintModalOpen(false); 
  };

  const handleCreateBackup = (salespersonToBackup: string, isAuto: boolean = false) => {
    const dataToBackup = allSalesData[salespersonToBackup];
    if (!dataToBackup || Object.keys(dataToBackup).length === 0) {
      if (!isAuto) setToastMessage(`Brak danych do utworzenia kopii dla ${salespersonToBackup}.`);
      else console.log(`Auto-backup for ${salespersonToBackup}: No data to backup.`);
      return;
    }
    try {
      const csvString = salespersonDataToBackupCSV(salespersonToBackup, dataToBackup);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `backup_${salespersonToBackup.replace(/[^a-z0-9_]/gi, '_')}_${timestamp}.csv`;
      downloadFile(csvString, filename, 'text/csv;charset=utf-8;');
      const message = `${isAuto ? "Automatyczna k" : "K"}opia zapasowa dla ${salespersonToBackup} została utworzona.`;
      setToastMessage(message);
      console.log(message);
    } catch (error) {
        const errorMessage = `Błąd podczas tworzenia kopii zapasowej dla ${salespersonToBackup}: ${error instanceof Error ? error.message : String(error)}`;
        setToastMessage(errorMessage);
        console.error(errorMessage, error);
    }
  };

  const handleRestoreFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
        if (restoreFileInputRef.current) { restoreFileInputRef.current.value = ""; }
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvString = e.target?.result as string;
        if (!csvString) {
          setToastMessage("Błąd odczytu pliku kopii zapasowej (pusty).");
          console.error("File content could not be read or is empty.");
          return;
        }
        
        const parsed = parseBackupCSVToSalespersonData(csvString);

        if (!parsed) {
          setToastMessage("Nieprawidłowy format pliku kopii zapasowej lub błąd parsowania. Sprawdź konsolę deweloperską po szczegóły.");
          return;
        }

        const { salespersonId: backupSalespersonId, data: restoredSalespersonData, version } = parsed;

        if (!backupSalespersonId || typeof restoredSalespersonData !== 'object' || restoredSalespersonData === null) {
            setToastMessage("Błąd w strukturze danych z kopii: brak ID handlowca lub obiektu danych. Sprawdź konsolę.");
            console.error("Parsed data structure error: Missing salespersonId or data object is invalid.", parsed);
            return;
        }
        
        console.log(`Data parsed from backup: Salesperson ID: ${backupSalespersonId}, Version: ${version}. Data object keys (years): ${Object.keys(restoredSalespersonData)}`);
        
        setPendingRestoreData(parsed);
        setIsRestoreConfirmModalOpen(true);

      } catch (error) {
        console.error("Error during file processing for restore:", error);
        setToastMessage(`Wystąpił nieoczekiwany błąd podczas przetwarzania pliku: ${error instanceof Error ? error.message : "Nieznany błąd"}`);
      } finally {
        if (restoreFileInputRef.current) { 
            restoreFileInputRef.current.value = "";
        }
      }
    };
    reader.onerror = (error) => {
        setToastMessage("Błąd odczytu pliku: " + String(error?.toString()));
        console.error("FileReader error:", error);
        if (restoreFileInputRef.current) { 
            restoreFileInputRef.current.value = "";
        }
    }
    reader.readAsText(file);
  };

  const handleActualRestoreData = () => {
    if (pendingRestoreData) {
      setAllSalesData(prevAllData => ({
        ...prevAllData,
        [pendingRestoreData.salespersonId]: pendingRestoreData.data,
      }));
      setToastMessage(`Dane dla ${pendingRestoreData.salespersonId} zostały przywrócone.`);
      console.log(`Data for ${pendingRestoreData.salespersonId} restored successfully.`);
    }
    setIsRestoreConfirmModalOpen(false);
    setPendingRestoreData(null);
  };

  const handleCancelRestore = () => {
    const salespersonIdForMessage = pendingRestoreData?.salespersonId || 'wybranego handlowca';
    setToastMessage(`Przywracanie danych dla ${salespersonIdForMessage} zostało anulowane.`);
    console.log(`Restore for ${salespersonIdForMessage} cancelled by user.`);
    setIsRestoreConfirmModalOpen(false);
    setPendingRestoreData(null);
  };


  const handleSaveBackupSettings = (newSettings: BackupSettings) => {
    setBackupSettings(newSettings);
    setToastMessage("Ustawienia automatycznej kopii zapasowej zostały zapisane.");
  };

  return (
    <>
      <div className="container mx-auto p-4 md:p-8 max-w-5xl screen-only">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-indigo-700">Monitorowanie Źródeł Kontaktów</h1>
          <p className="text-slate-600 mt-2">Śledź pochodzenie swoich kontaktów handlowych.</p>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <SalespersonSelector
              selectedSalesperson={selectedSalesperson}
              onSalespersonChange={handleSalespersonChange}
            />
             <div className="flex flex-wrap items-center justify-start sm:justify-end gap-2">
                <button
                  onClick={() => setIsPrintModalOpen(true)}
                  className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-colors duration-150 ease-in-out text-sm"
                  aria-label="Eksportuj raport jako CSV"
                >
                  <DownloadIcon className="h-5 w-5 mr-2" />
                  Eksportuj Raport
                </button>
                 <button
                  onClick={() => handleCreateBackup(selectedSalesperson)}
                  className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-colors duration-150 ease-in-out text-sm"
                  aria-label="Utwórz kopię zapasową teraz"
                >
                  <SaveIcon className="h-5 w-5 mr-2" />
                  Utwórz Kopię
                </button>
                <label 
                  htmlFor="restore-backup-input"
                  className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-colors duration-150 ease-in-out cursor-pointer text-sm"
                  aria-label="Przywróć dane z kopii"
                >
                  <UploadIcon className="h-5 w-5 mr-2" />
                  Przywróć z Kopii
                </label>
                <input 
                    type="file" 
                    id="restore-backup-input"
                    accept=".csv"
                    className="hidden"
                    onChange={handleRestoreFromFile}
                    ref={restoreFileInputRef}
                />
                <button
                  onClick={() => setShowBackupSettingsModal(true)}
                  className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-colors duration-150 ease-in-out text-sm"
                  aria-label="Ustawienia kopii zapasowej"
                >
                  <CogIcon className="h-5 w-5 mr-2" />
                  Ustawienia
                </button>
            </div>
          </div>
          <MonthNavigator
            currentYear={currentYear}
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
          />
        </div>
        
        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {daysInCurrentMonth.map(day => {
              const dayData: DayData | undefined = currentMonthData?.[day];
              return (
                <DayCard
                  key={`${currentYear}-${currentMonth}-${day}`}
                  day={day}
                  month={currentMonth}
                  year={currentYear}
                  dayData={dayData}
                  onAddContact={handleAddContact}
                  onRemoveContact={handleRemoveContact}
                />
              );
            })}
          </div>
          <WeeklySummary monthData={currentMonthData} weeks={weeksInCurrentMonth} />
          <MonthlySummary monthData={currentMonthData} />
        </main>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Aplikacja do Monitorowania Kontaktów. Wszelkie prawa zastrzeżone.</p>
        </footer>
      </div>
      <PrintModal 
        isOpen={isPrintModalOpen} 
        onClose={() => setIsPrintModalOpen(false)} 
        onConfirm={handleExportReportConfirm}
      />
      <BackupSettingsModal
        isOpen={showBackupSettingsModal}
        onClose={() => setShowBackupSettingsModal(false)}
        currentSettings={backupSettings}
        onSave={handleSaveBackupSettings}
      />
      <RestoreConfirmModal
        isOpen={isRestoreConfirmModalOpen}
        onClose={handleCancelRestore}
        onConfirm={handleActualRestoreData}
        salespersonIdToRestore={pendingRestoreData?.salespersonId || null}
      />
      {toastMessage && (
         <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      )}
    </>
  );
};

export default App;