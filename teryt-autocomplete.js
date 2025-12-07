/**
 * TERYT Auto-complete dla formularzy
 * Integracja z API TERYT do auto-uzupełniania gmin, powiatów i województw
 */

class TerytAutocomplete {
  constructor(inputSelector, type = 'gmina', options = {}) {
    this.input = document.querySelector(inputSelector);
    if (!this.input) {
      console.warn(`TERYT Autocomplete: Input ${inputSelector} not found`);
      return;
    }

    this.type = type; // 'gmina', 'powiat', 'wojewodztwo'
    this.options = {
      wojewodztwo: options.wojewodztwo || null,
      powiat: options.powiat || null,
      minChars: options.minChars || 2,
      debounceMs: options.debounceMs || 300,
      onSelect: options.onSelect || null,
      ...options
    };

    this.suggestionsContainer = null;
    this.debounceTimer = null;
    this.currentFocus = -1;

    this.init();
  }

  /**
   * Inicjalizacja auto-complete
   */
  init() {
    // Utwórz kontener na sugestie
    this.createSuggestionsContainer();

    // Dodaj event listenery
    this.input.addEventListener('input', (e) => this.handleInput(e));
    this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
    this.input.addEventListener('blur', () => {
      // Delay to allow click on suggestion
      setTimeout(() => this.hideSuggestions(), 200);
    });

    // Zamknij sugestie po kliknięciu poza
    document.addEventListener('click', (e) => {
      if (!this.input.contains(e.target) && !this.suggestionsContainer.contains(e.target)) {
        this.hideSuggestions();
      }
    });
  }

  /**
   * Utwórz kontener na sugestie
   */
  createSuggestionsContainer() {
    this.suggestionsContainer = document.createElement('div');
    this.suggestionsContainer.className = 'teryt-autocomplete-suggestions';
    this.suggestionsContainer.style.display = 'none';

    // Wstaw po input
    this.input.parentNode.insertBefore(this.suggestionsContainer, this.input.nextSibling);
  }

  /**
   * Obsługa wpisywania
   */
  handleInput(e) {
    const value = e.target.value;

    // Wyczyść timer
    clearTimeout(this.debounceTimer);

    // Jeśli za krótkie, ukryj sugestie
    if (value.length < this.options.minChars) {
      this.hideSuggestions();
      return;
    }

    // Debounce
    this.debounceTimer = setTimeout(() => {
      this.fetchSuggestions(value);
    }, this.options.debounceMs);
  }

  /**
   * Pobierz sugestie z API
   */
  async fetchSuggestions(query) {
    try {
      let url;

      // Buduj URL w zależności od typu
      switch (this.type) {
        case 'gmina':
          url = `/api/teryt/autocomplete/gmina?q=${encodeURIComponent(query)}`;
          if (this.options.wojewodztwo) {
            url += `&wojewodztwo=${encodeURIComponent(this.options.wojewodztwo)}`;
          }
          break;

        case 'powiat':
          url = `/api/teryt/autocomplete/powiat?q=${encodeURIComponent(query)}`;
          if (this.options.wojewodztwo) {
            url += `&wojewodztwo=${encodeURIComponent(this.options.wojewodztwo)}`;
          }
          break;

        case 'all':
          url = `/api/teryt/autocomplete?q=${encodeURIComponent(query)}&type=all`;
          if (this.options.wojewodztwo) {
            url += `&wojewodztwo=${encodeURIComponent(this.options.wojewodztwo)}`;
          }
          break;

        default:
          console.error('Unknown TERYT type:', this.type);
          return;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success && data.suggestions) {
        this.showSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('TERYT autocomplete error:', error);
      this.hideSuggestions();
    }
  }

  /**
   * Pokaż sugestie
   */
  showSuggestions(suggestions) {
    if (suggestions.length === 0) {
      this.hideSuggestions();
      return;
    }

    this.suggestionsContainer.innerHTML = '';
    this.currentFocus = -1;

    suggestions.forEach((suggestion, index) => {
      const item = document.createElement('div');
      item.className = 'teryt-suggestion-item';
      item.dataset.index = index;

      // Formatuj wyświetlaną nazwę
      if (this.type === 'all') {
        item.innerHTML = `
          <strong>${suggestion.value}</strong>
          <small>${suggestion.label}</small>
          <span class="teryt-type-badge">${suggestion.type}</span>
        `;
      } else if (this.type === 'gmina') {
        item.innerHTML = `
          <strong>${suggestion.nazwa}</strong>
          <small>pow. ${suggestion.powiat}, woj. ${suggestion.wojewodztwo}</small>
        `;
      } else if (this.type === 'powiat') {
        item.innerHTML = `
          <strong>${suggestion.nazwa}</strong>
          <small>${suggestion.typ}, woj. ${suggestion.wojewodztwo}</small>
        `;
      }

      // Click handler
      item.addEventListener('click', () => {
        this.selectSuggestion(suggestion);
      });

      // Hover handler
      item.addEventListener('mouseenter', () => {
        this.setActive(index);
      });

      this.suggestionsContainer.appendChild(item);
    });

    this.suggestionsContainer.style.display = 'block';
  }

  /**
   * Ukryj sugestie
   */
  hideSuggestions() {
    this.suggestionsContainer.style.display = 'none';
    this.currentFocus = -1;
  }

  /**
   * Obsługa klawiszy
   */
  handleKeydown(e) {
    const items = this.suggestionsContainer.querySelectorAll('.teryt-suggestion-item');
    if (items.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.currentFocus = (this.currentFocus + 1) % items.length;
        this.setActive(this.currentFocus);
        break;

      case 'ArrowUp':
        e.preventDefault();
        this.currentFocus = this.currentFocus <= 0 ? items.length - 1 : this.currentFocus - 1;
        this.setActive(this.currentFocus);
        break;

      case 'Enter':
        e.preventDefault();
        if (this.currentFocus >= 0 && items[this.currentFocus]) {
          items[this.currentFocus].click();
        }
        break;

      case 'Escape':
        this.hideSuggestions();
        break;
    }
  }

  /**
   * Ustaw aktywny element
   */
  setActive(index) {
    const items = this.suggestionsContainer.querySelectorAll('.teryt-suggestion-item');
    items.forEach((item, i) => {
      if (i === index) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    this.currentFocus = index;
  }

  /**
   * Wybierz sugestię
   */
  selectSuggestion(suggestion) {
    // Ustaw wartość w input
    this.input.value = suggestion.nazwa || suggestion.value;

    // Ukryj sugestie
    this.hideSuggestions();

    // Callback
    if (this.options.onSelect) {
      this.options.onSelect(suggestion);
    }

    // Trigger change event
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /**
   * Aktualizuj opcje (np. zmiana województwa)
   */
  updateOptions(newOptions) {
    this.options = {
      ...this.options,
      ...newOptions
    };
  }

  /**
   * Zniszcz auto-complete
   */
  destroy() {
    if (this.suggestionsContainer) {
      this.suggestionsContainer.remove();
    }
    clearTimeout(this.debounceTimer);
  }
}

/**
 * Łatwa inicjalizacja dla formularzy
 */
function initTerytAutocomplete() {
  // Auto-complete dla gminy
  const gminaInput = document.getElementById('gmina');
  const powiatInput = document.getElementById('powiat');
  const wojewodztwoSelect = document.getElementById('wojewodztwo');

  if (gminaInput && wojewodztwoSelect) {
    const gminaAutocomplete = new TerytAutocomplete('#gmina', 'gmina', {
      wojewodztwo: wojewodztwoSelect.value,
      onSelect: (suggestion) => {
        // Auto-wypełnij powiat jeśli dostępny
        if (powiatInput && suggestion.powiat) {
          powiatInput.value = suggestion.powiat;
        }
      }
    });

    // Aktualizuj województwo przy zmianie
    wojewodztwoSelect.addEventListener('change', (e) => {
      gminaAutocomplete.updateOptions({ wojewodztwo: e.target.value });
      if (gminaInput.value) {
        gminaInput.value = ''; // Wyczyść gminę przy zmianie województwa
      }
      if (powiatInput) {
        powiatInput.value = ''; // Wyczyść powiat
      }
    });
  }

  // Auto-complete dla powiatu
  if (powiatInput && wojewodztwoSelect) {
    const powiatAutocomplete = new TerytAutocomplete('#powiat', 'powiat', {
      wojewodztwo: wojewodztwoSelect.value
    });

    // Aktualizuj województwo przy zmianie
    wojewodztwoSelect.addEventListener('change', (e) => {
      powiatAutocomplete.updateOptions({ wojewodztwo: e.target.value });
    });
  }

  // Podobnie dla Express Mode
  const expressMunicipalityInput = document.getElementById('express_common_municipality');
  const expressCountyInput = document.getElementById('express_common_county');
  const expressVoivodeshipSelect = document.getElementById('express_common_voivodeship');

  if (expressMunicipalityInput && expressVoivodeshipSelect) {
    const expressGminaAutocomplete = new TerytAutocomplete('#express_common_municipality', 'gmina', {
      wojewodztwo: expressVoivodeshipSelect.value,
      onSelect: (suggestion) => {
        if (expressCountyInput && suggestion.powiat) {
          expressCountyInput.value = suggestion.powiat;
        }
      }
    });

    expressVoivodeshipSelect.addEventListener('change', (e) => {
      expressGminaAutocomplete.updateOptions({ wojewodztwo: e.target.value });
      if (expressMunicipalityInput.value) {
        expressMunicipalityInput.value = '';
      }
      if (expressCountyInput) {
        expressCountyInput.value = '';
      }
    });
  }

  if (expressCountyInput && expressVoivodeshipSelect) {
    const expressPowiatAutocomplete = new TerytAutocomplete('#express_common_county', 'powiat', {
      wojewodztwo: expressVoivodeshipSelect.value
    });

    expressVoivodeshipSelect.addEventListener('change', (e) => {
      expressPowiatAutocomplete.updateOptions({ wojewodztwo: e.target.value });
    });
  }
}

// Export
if (typeof window !== 'undefined') {
  window.TerytAutocomplete = TerytAutocomplete;
  window.initTerytAutocomplete = initTerytAutocomplete;
}
