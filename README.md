# 🏆 Rzeczy Znalezione - HackNation 2025

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![dane.gov.pl](https://img.shields.io/badge/dane.gov.pl-compatible-blue)](https://dane.gov.pl)
[![WCAG 2.1](https://img.shields.io/badge/WCAG-2.1-green)](https://www.w3.org/WAI/WCAG21/quickref/)
[![HackNation](https://img.shields.io/badge/HackNation-2024-red)](https://hacknation.pl)

> 🇵🇱 Mechanizm do udostępniania danych o rzeczach znalezionych w portalu dane.gov.pl

![Demo Screenshot](https://via.placeholder.com/800x400/D4213D/FFFFFF?text=Rzeczy+Znalezione+Demo)

---

## 📋 Opis projektu

**Rzeczy Znalezione** to intuicyjny mechanizm umożliwiający samorządom szybkie (w max. 5 krokach) udostępnianie danych o rzeczach znalezionych w portalu dane.gov.pl.

### Problem
Dane o rzeczach znalezionych są rozproszone po wielu stronach BIP poszczególnych powiatów, co utrudnia obywatelom szybkie odnalezienie zgubionych przedmiotów.

### Rozwiązanie
Jedno okno do udostępniania danych w jednolitym formacie, gotowym do publikacji w portalu dane.gov.pl.

---

## 🎯 Kluczowe funkcje

| Funkcja | Opis |
|---------|------|
| **Drag & Drop** | Przeciągnij plik Excel/CSV i gotowe |
| **Formularz ręczny** | Wprowadź dane bez znajomości programowania |
| **Walidacja na żywo** | Błędy widoczne podczas wpisywania |
| **Podgląd danych** | Zobacz jak dane wyglądają przed eksportem |
| **Eksport JSON/CSV** | Formaty zgodne z dane.gov.pl |
| **Szablon Excel** | Gotowy do pobrania i wypełnienia offline |

---

## 🚀 Jak to działa? (4 kroki!)

```
1️⃣ WYBIERZ ŹRÓDŁO
   → Wgraj plik Excel/CSV
   → LUB wypełnij formularz

2️⃣ WPROWADŹ DANE
   → Kategoria, opis, miejsce znalezienia
   → Walidacja w czasie rzeczywistym

3️⃣ SPRAWDŹ PODGLĄD
   → Tabela ze wszystkimi danymi
   → Możliwość edycji/usunięcia

4️⃣ POBIERZ PLIK
   → JSON (zalecany dla dane.gov.pl)
   → CSV (uniwersalny format)
```

---

## 📁 Struktura projektu

```
rzeczy-znalezione/
├── index.html      # Główna strona aplikacji
├── styles.css      # Style (design dane.gov.pl)
├── app.js          # Logika aplikacji
├── schema.json     # Wzorcowy zakres danych (JSON Schema)
└── README.md       # Dokumentacja
```

---

## 🎨 Zgodność z dane.gov.pl

- ✅ **Kolory**: #D4213D (primary), #0052A5 (secondary)
- ✅ **Czcionka**: Lato (jak w dane.gov.pl)
- ✅ **Ikony**: Font Awesome
- ✅ **Responsywność**: Mobile + Desktop
- ✅ **WCAG 2.1**: Pełna dostępność

---

## 📊 Wzorcowy zakres danych

Plik `schema.json` zawiera kompletną specyfikację danych:

### Pola obowiązkowe:
| Pole | Opis |
|------|------|
| `id` | Unikalny identyfikator (np. RZ/2024/0001) |
| `kategoria` | Typ przedmiotu (telefon, portfel, klucze, itp.) |
| `opis` | Szczegółowy opis umożliwiający identyfikację |
| `data_znalezienia` | Data w formacie YYYY-MM-DD |
| `miejsce_znalezienia` | Adres lub opis miejsca |
| `miejsce_przechowywania` | Gdzie można odebrać przedmiot |
| `kontakt.telefon` | Numer telefonu do kontaktu |

### Pola opcjonalne:
- `kolor`, `marka` - szczegóły przedmiotu
- `typ_miejsca` - kategoryzacja miejsca
- `wspolrzedne` - GPS dla integracji z mapami
- `kontakt.email` - dodatkowy kontakt
- `status` - stan przedmiotu
- `zdjecie_url` - link do zdjęcia
- `data_waznosci` - do kiedy przechowywane

---

## 💻 Wymagania techniczne

### Do uruchomienia:
- Nowoczesna przeglądarka (Chrome, Firefox, Edge, Safari)
- JavaScript włączony
- Połączenie internetowe (dla czcionek i ikon)

### Technologie:
- HTML5, CSS3, JavaScript (ES6+)
- SheetJS (xlsx) - parsowanie Excel/CSV
- Font Awesome - ikony
- Google Fonts (Lato)

---

## 🔧 Instalacja i uruchomienie

### ⚡ Szybki start (3 kroki)

```bash
# 1. Sklonuj repozytorium
git clone <repository-url>
cd rzeczy-znalezione

# 2. Zainstaluj zależności (automatyczne ustawienie!)
npm install

# 3. Uruchom serwer
npm run dev
```

**Gotowe!** Otwórz http://localhost:3000

**Co się stało automatycznie?**
- ✅ Utworzono `.env` z bezpiecznym JWT kluczem
- ✅ Zainicjalizowano bazę danych SQLite
- ✅ Dodano 3 testowych użytkowników
- ✅ Dodano 16 przykładowych przedmiotów

**Dane logowania:**
```
👑 Admin:    admin@example.com    / admin123
👔 Official: official@example.com / official123
👤 User:     user@example.com     / user123
```

**Szczegółowa dokumentacja:**
- 💻 [COMMANDS.md](COMMANDS.md) - **Wszystkie komendy dla kolegi** ⭐
- 📖 [QUICK-SETUP.md](QUICK-SETUP.md) - Błyskawiczny start
- 📘 [SETUP-GUIDE.md](SETUP-GUIDE.md) - Pełny przewodnik instalacji
- 📗 [START_HERE.md](START_HERE.md) - Pierwsze kroki

---

## 🔄 Auto-update cache

**Nowe w wersji 2.0.6!**

System automatycznie:
- ✅ Sprawdza dostępność nowych wersji co 5 minut
- ✅ Wyświetla powiadomienie o aktualizacji
- ✅ Umożliwia aktualizację jednym kliknięciem
- ✅ Działa offline dzięki Service Worker

**Manualne czyszczenie cache:**

```javascript
// W konsoli przeglądarki
await window.clearAllCaches();
```

Lub odwiedź: http://localhost:3000/clear-cache.html

---

## 📖 Instrukcja użycia

### Dla urzędnika (bez znajomości IT):

1. **Otwórz stronę** w przeglądarce
2. **Wybierz sposób wprowadzania**:
   - Masz dane w Excel? → Przeciągnij plik
   - Pojedyncze wpisy? → Kliknij "Wypełnij formularz"
3. **Sprawdź podgląd** - czy wszystko się zgadza?
4. **Pobierz plik JSON** - gotowy do wgrania na dane.gov.pl

### Wgrywanie do dane.gov.pl:

1. Zaloguj się na https://dane.gov.pl
2. Przejdź do: Panel Administratora → Dane → Dodaj zbiór danych
3. Wypełnij metadane zbioru
4. W zakładce "Zasoby" wgraj pobrany plik JSON
5. Opublikuj!

---

## ✅ Wymagania projektowe

| Wymaganie | Status |
|-----------|--------|
| Max 5 kroków do udostępnienia | ✅ (4 kroki) |
| Format maszynowo czytelny | ✅ (JSON, CSV) |
| Zgodność z dane.gov.pl | ✅ |
| WCAG 2.1 | ✅ |
| Responsywność | ✅ |
| Wzorcowy zakres danych | ✅ (schema.json) |

---

## 🏗️ Architektura

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Browser)                       │
├─────────────────────────────────────────────────────────────┤
│  index.html          │  styles.css       │  app.js          │
│  - Struktura UI      │  - Design         │  - Logika        │
│  - Formularze        │  - dane.gov.pl    │  - Walidacja     │
│  - Nawigacja         │  - Responsive     │  - Export        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    EKSPORT DANYCH                           │
├─────────────────────────────────────────────────────────────┤
│  JSON (zalecany)              │  CSV (alternatywny)         │
│  - Metadane zbioru            │  - Format tabelaryczny      │
│  - Struktura zgodna z API     │  - Kompatybilny z Excel     │
│  - Gotowy do dane.gov.pl      │  - Uniwersalny              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📜 Licencja

Projekt stworzony na HackNation 2024.
Kod źródłowy dostępny na licencji zgodnej z dane.gov.pl (GPL-3.0).

---

## 👥 Zespół

Projekt stworzony z myślą o:
- 👨‍💼 **Urzędnikach** - którzy nie są programistami
- 👵 **Obywatelach** - którzy szukają zgubionych rzeczy
- 👨‍💻 **Programistach** - którzy chcą budować aplikacje na danych

---

## 🔗 Linki

- [Portal dane.gov.pl](https://dane.gov.pl)
- [API dane.gov.pl](https://api.dane.gov.pl/doc)
- [Baza wiedzy](https://dane.gov.pl/pl/knowledgebase)
- [Kod źródłowy portalu](https://dane.gov.pl/source-code/)

---

**Stworzone z ❤️ na HackNation 2024**
