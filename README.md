# Monitorowanie Źródeł Kontaktów

Aplikacja webowa do śledzenia źródeł pochodzenia kontaktów dla działu handlowego. Umożliwia handlowcom rejestrowanie liczby kontaktów pozyskanych z różnych źródeł dla każdego dnia miesiąca, generowanie podsumowań miesięcznych i tygodniowych, a także tworzenie i przywracanie kopii zapasowych danych.

## Główne Funkcjonalności

*   **Wybór Handlowca:** Możliwość pracy na danych przypisanych do jednego z 10 predefiniowanych handlowców.
*   **Rejestracja Danych Dziennych:** Wprowadzanie liczby kontaktów dla każdego dnia w miesiącu, z podziałem na predefiniowane źródła (np. Strona internetowa, Facebook, Polecenie).
*   **Notatki dla Źródła "Inne":** Możliwość dodawania opcjonalnych notatek tekstowych dla kontaktów ze źródła "Inne".
*   **Nawigacja Miesięczna:** Przełączanie się pomiędzy miesiącami (od czerwca 2025 do grudnia 2025 roku).
*   **Podsumowania Tygodniowe:** Automatycznie generowane podsumowania liczby kontaktów dla każdego tygodnia w wybranym miesiącu.
*   **Podsumowanie Miesięczne:** Automatycznie generowane podsumowanie całkowitej liczby kontaktów z podziałem na źródła dla wybranego miesiąca.
*   **Eksport Raportów do CSV:** Możliwość pobrania podsumowania miesięcznego lub tygodniowego w formacie CSV.
*   **Kopia Zapasowa Danych:**
    *   **Manualna:** Tworzenie pliku kopii zapasowej (.csv) dla danych wybranego handlowca.
    *   **Automatyczna:** Konfiguracja dwóch pór dnia, o których aplikacja (jeśli otwarta) automatycznie podejmie próbę utworzenia kopii zapasowej dla aktualnie wybranego handlowca.
*   **Przywracanie Danych z Kopii:** Możliwość wczytania danych handlowca z wcześniej utworzonego pliku kopii zapasowej (.csv).
*   **Funkcjonalność Offline:** Dane są przechowywane w LocalStorage przeglądarki, co umożliwia pracę bez stałego połączenia z internetem po pierwszym załadowaniu aplikacji.
*   **Responsywny Design:** Interfejs dostosowuje się do różnych rozmiarów ekranu.

## Stos Technologiczny

*   **React 19:** Biblioteka JavaScript do budowy interfejsów użytkownika (ładowana dynamicznie z esm.sh).
*   **TypeScript:** Nadzbiór JavaScriptu dodający statyczne typowanie.
*   **Tailwind CSS:** Framework CSS do szybkiego stylowania (ładowany z CDN).
*   **HTML5, CSS3, JavaScript (ES6 Modules):** Podstawowe technologie webowe.

## Uruchomienie Aplikacji

Aplikacja nie wymaga procesu budowania ani instalacji zależności za pomocą menedżera pakietów (jak npm czy yarn) do podstawowego uruchomienia.

1.  **Sklonuj repozytorium (lub pobierz pliki):**
    ```bash
    git clone <adres-repozytorium>
    cd <nazwa-folderu-repozytorium>
    ```
2.  **Otwórz plik `index.html`:**
    Bezpośrednio w nowoczesnej przeglądarce internetowej (np. Chrome, Firefox, Edge, Safari).

**Ważne:** Przy pierwszym uruchomieniu oraz do poprawnego działania niektórych funkcji (jak ładowanie Reacta i Tailwind CSS z CDN) wymagane jest połączenie z internetem. Po załadowaniu zasobów, główna funkcjonalność aplikacji (wprowadzanie i przeglądanie danych) działa offline dzięki LocalStorage.

## Przechowywanie Danych

Wszystkie dane wprowadzane do aplikacji (kontakty, notatki, ustawienia) są przechowywane lokalnie w **LocalStorage** przeglądarki użytkownika. Oznacza to, że:
*   Dane są dostępne tylko w tej konkretnej przeglądarce i na tym konkretnym urządzeniu, na którym zostały wprowadzone.
*   Wyczyszczenie danych przeglądarki (np. cache, LocalStorage) spowoduje usunięcie wszystkich zapisanych informacji.

**Zaleca się regularne korzystanie z funkcji tworzenia kopii zapasowej**, aby zabezpieczyć się przed utratą danych.

## Format Kopii Zapasowej i Raportów

*   **Kopie zapasowe danych handlowców** są zapisywane w specjalnie przygotowanym formacie CSV (`BACKUP_CSV_DELIMITER = ";"`, `BACKUP_CSV_EOL = "\r\n"`). Pliki te są przeznaczone do przywracania danych wyłącznie w tej aplikacji.
*   **Eksportowane raporty (miesięczne/tygodniowe)** również są w formacie CSV, ale mają strukturę czytelną dla użytkownika i mogą być otwierane w arkuszach kalkulacyjnych.

## Struktura Projektu

*   `index.html`: Główny plik HTML.
*   `index.tsx`: Główny plik TypeScript/React, inicjalizujący aplikację.
*   `App.tsx`: Główny komponent aplikacji.
*   `components/`: Folder zawierający komponenty ReactUI.
*   `hooks/`: Folder zawierający niestandardowe hooki React.
*   `utils/`: Folder zawierający funkcje pomocnicze (np. do dat, operacji CSV).
*   `constants.ts`: Plik z globalnymi stałymi używanymi w aplikacji.
*   `types.ts`: Plik z definicjami typów TypeScript.
*   `metadata.json`: Plik metadanych (może być używany przez zewnętrzne narzędzia/platformy).
*   `package.json`: Podstawowe informacje o projekcie i skrypty (głównie informacyjne dla tego typu projektu).

## Licencja
Projekt jest udostępniany na licencji MIT. Zobacz plik `LICENSE` po więcej informacji.
