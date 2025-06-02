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
*   **Funkcjonalność Offline:** Dane są przechowywane w LocalStorage przeglądarki, co umożliwia pracę bez stałego połączenia z internetem po pierwszym załadowaniu aplikacji i jej zasobów.
*   **Responsywny Design:** Interfejs dostosowuje się do różnych rozmiarów ekranu.

## Stos Technologiczny

*   **React 19:** Biblioteka JavaScript do budowy interfejsów użytkownika.
*   **TypeScript:** Nadzbiór JavaScriptu dodający statyczne typowanie.
*   **Vite:** Narzędzie do budowy frontendowej, zapewniające szybki serwer deweloperski i optymalizację buildów produkcyjnych.
*   **Tailwind CSS:** Framework CSS do szybkiego stylowania (ładowany z CDN).
*   **HTML5, CSS3, JavaScript (ES Modules):** Podstawowe technologie webowe.

## Uruchomienie Aplikacji Lokalnie (Development)

1.  **Wymagania:**
    *   Node.js (zalecana wersja LTS)
    *   npm lub yarn

2.  **Kroki:**
    *   Sklonuj repozytorium:
        ```bash
        git clone <adres-repozytorium>
        cd <nazwa-folderu-repozytorium>
        ```
    *   Zainstaluj zależności:
        ```bash
        npm install
        # lub
        yarn install
        ```
    *   Uruchom serwer deweloperski Vite:
        ```bash
        npm run dev
        # lub
        yarn dev
        ```
    *   Otwórz aplikację w przeglądarce pod adresem wskazanym przez Vite (zazwyczaj `http://localhost:5173`).

## Budowanie Aplikacji (Production)

1.  **Zainstaluj zależności** (jeśli jeszcze tego nie zrobiłeś):
    ```bash
    npm install
    # lub
    yarn install
    ```
2.  **Uruchom skrypt budowania:**
    ```bash
    npm run build
    # lub
    yarn build
    ```
    Vite stworzy folder `dist` w głównym katalogu projektu. Ten folder zawiera wszystkie zoptymalizowane, statyczne pliki gotowe do wdrożenia.

3.  **Podgląd builda produkcyjnego (opcjonalnie):**
    ```bash
    npm run preview
    # lub
    yarn preview
    ```

## Wdrożenie na GitHub Pages

1.  **Zbuduj aplikację:** Upewnij się, że masz aktualną wersję produkcyjną w folderze `dist` (patrz sekcja "Budowanie Aplikacji").
2.  **Wyślij zmiany do GitHub:** Upewnij się, że wszystkie pliki projektu, włącznie z folderem `dist` (jeśli nie używasz GitHub Actions do budowania), są wysłane do Twojego repozytorium na GitHub. *Lepszą praktyką jest budowanie w ramach GitHub Actions i wdrażanie tylko folderu `dist` na branch `gh-pages` lub konfigurowanie Pages do serwowania z folderu `dist` na branchu `main`.*
3.  **Skonfiguruj GitHub Pages:**
    *   Przejdź do ustawień swojego repozytorium na GitHub (`Settings` > `Pages`).
    *   W sekcji `Build and deployment`:
        *   Jako `Source` wybierz `Deploy from a branch`.
        *   Jako `Branch` wybierz swój główny branch (np. `main` lub `master`).
        *   Dla folderu wybierz `/(root)` **jeśli wysyłasz folder `dist` jako główny content brancha `gh-pages`** LUB wybierz `/docs` **jeśli folder `dist` został przemianowany na `docs` i jest w głównym branchu** LUB (NAJLEPIEJ) wybierz `/(root)` i użyj GitHub Actions do zbudowania i wdrożenia do brancha `gh-pages`, a następnie ustaw `gh-pages` jako źródło.
        *   **Jeśli budujesz lokalnie i wysyłasz folder `dist` bezpośrednio do brancha `main`**: skonfiguruj GitHub Pages, aby serwował z folderu `/dist` na branchu `main`. (Upewnij się, że `base: './'` jest ustawione w `vite.config.ts` dla poprawnego ładowania zasobów).
    *   Zapisz zmiany. GitHub Pages powinno po chwili opublikować Twoją stronę pod adresem `https://<TWOJA-NAZWA-UZYTKOWNIKA>.github.io/<NAZWA-REPOZYTORIUM>/`.

## Przechowywanie Danych

Wszystkie dane wprowadzane do aplikacji (kontakty, notatki, ustawienia) są przechowywane lokalnie w **LocalStorage** przeglądarki użytkownika. Oznacza to, że:
*   Dane są dostępne tylko w tej konkretnej przeglądarce i na tym konkretnym urządzeniu, na którym zostały wprowadzone.
*   Wyczyszczenie danych przeglądarki (np. cache, LocalStorage) spowoduje usunięcie wszystkich zapisanych informacji.

**Zaleca się regularne korzystanie z funkcji tworzenia kopii zapasowej**, aby zabezpieczyć się przed utratą danych.

## Format Kopii Zapasowej i Raportów

*   **Kopie zapasowe danych handlowców** są zapisywane w specjalnie przygotowanym formacie CSV (`BACKUP_CSV_DELIMITER = ";"`, `BACKUP_CSV_EOL = "\r\n"`). Pliki te są przeznaczone do przywracania danych wyłącznie w tej aplikacji.
*   **Eksportowane raporty (miesięczne/tygodniowe)** również są w formacie CSV, ale mają strukturę czytelną dla użytkownika i mogą być otwierane w arkuszach kalkulacyjnych.

## Struktura Projektu

*   `index.html`: Główny plik HTML (szablon dla Vite).
*   `vite.config.ts`: Konfiguracja narzędzia Vite.
*   `index.tsx`: Główny plik TypeScript/React, inicjalizujący aplikację (punkt wejścia dla Vite).
*   `App.tsx`: Główny komponent aplikacji.
*   `components/`: Folder zawierający komponenty ReactUI.
*   `hooks/`: Folder zawierający niestandardowe hooki React.
*   `utils/`: Folder zawierający funkcje pomocnicze (np. do dat, operacji CSV).
*   `constants.ts`: Plik z globalnymi stałymi używanymi w aplikacji.
*   `types.ts`: Plik z definicjami typów TypeScript.
*   `metadata.json`: Plik metadanych (może być używany przez zewnętrzne narzędzia/platformy).
*   `package.json`: Definicje zależności projektu i skrypty (npm/yarn).
*   `dist/`: Folder generowany przez `npm run build`, zawierający gotową do wdrożenia aplikację. (Nie powinien być zwykle commitowany, jeśli używasz CI/CD do budowania).

## Licencja
Projekt jest udostępniany na licencji MIT. Zobacz plik `LICENSE` po więcej informacji.
