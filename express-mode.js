/**
 * KILLER FEATURE #5: EXPRESS MODE - Batch Item Processing
 * Fast batch entry system for processing multiple items quickly
 */

class ExpressMode {
  constructor(i18nInstance) {
    this.i18n = i18nInstance;
    this.items = [];
    this.currentTemplate = null;
    this.isActive = false;
    this.commonFields = {};
  }

  /**
   * Activate Express Mode
   */
  activate() {
    this.isActive = true;
    this.showExpressUI();
  }

  /**
   * Deactivate Express Mode
   */
  deactivate() {
    this.isActive = false;
    this.hideExpressUI();
  }

  /**
   * Set common fields template
   * These fields will be auto-filled for all items in batch
   */
  setCommonFields(fields) {
    this.commonFields = { ...fields };
  }

  /**
   * Add item to batch with auto-filled common fields
   */
  addItem(item) {
    const mergedItem = {
      ...this.commonFields,
      ...item,
      id: this.generateTempId()
    };

    this.items.push(mergedItem);
    return mergedItem;
  }

  /**
   * Remove item from batch
   */
  removeItem(tempId) {
    this.items = this.items.filter(item => item.id !== tempId);
  }

  /**
   * Update item in batch
   */
  updateItem(tempId, updates) {
    const index = this.items.findIndex(item => item.id === tempId);
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...updates };
    }
  }

  /**
   * Get all items in batch
   */
  getItems() {
    return this.items;
  }

  /**
   * Clear all items
   */
  clear() {
    this.items = [];
  }

  /**
   * Generate temporary ID for batch items
   */
  generateTempId() {
    return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Show Express Mode UI
   */
  showExpressUI() {
    const lang = this.i18n.getCurrentLanguage();

    // Check if UI already exists
    let expressPanel = document.getElementById('expressModePanel');
    if (expressPanel) {
      expressPanel.style.display = 'block';
      return;
    }

    // Create Express Mode panel
    expressPanel = document.createElement('div');
    expressPanel.id = 'expressModePanel';
    expressPanel.className = 'express-mode-panel';
    expressPanel.innerHTML = `
      <div class="express-mode-header">
        <h3>
          <i class="fas fa-bolt"></i>
          ${lang === 'pl' ? 'Tryb Ekspresowy' : 'Express Mode'}
        </h3>
        <button type="button" id="exitExpressMode" class="btn-secondary">
          <i class="fas fa-times"></i>
          ${lang === 'pl' ? 'Wyjdź' : 'Exit'}
        </button>
      </div>

      <div class="express-mode-body">
        <!-- Common Fields Template -->
        <div class="express-section">
          <h4>${lang === 'pl' ? 'Wspólne pola (auto-wypełnienie)' : 'Common fields (auto-fill)'}</h4>
          <div class="express-common-fields">
            <div class="form-group">
              <label>${lang === 'pl' ? 'Data znalezienia' : 'Date found'}</label>
              <input type="date" id="express_common_date" class="form-control">
            </div>
            <div class="form-group">
              <label>${lang === 'pl' ? 'Miejsce znalezienia' : 'Location found'}</label>
              <input type="text" id="express_common_location" class="form-control"
                placeholder="${lang === 'pl' ? 'np. Przystanek autobusowy Rynek' : 'e.g. Bus stop Rynek'}">
            </div>
            <div class="form-group">
              <label>${lang === 'pl' ? 'Gmina' : 'Municipality'}</label>
              <input type="text" id="express_common_municipality" class="form-control">
            </div>
            <div class="form-group">
              <label>${lang === 'pl' ? 'Powiat' : 'County'}</label>
              <input type="text" id="express_common_county" class="form-control">
            </div>
            <div class="form-group">
              <label>${lang === 'pl' ? 'Województwo' : 'Voivodeship'}</label>
              <select id="express_common_voivodeship" class="form-control">
                <option value="">-- ${lang === 'pl' ? 'Wybierz' : 'Select'} --</option>
                <option value="dolnoslaskie">Dolnośląskie</option>
                <option value="kujawsko-pomorskie">Kujawsko-Pomorskie</option>
                <option value="lubelskie">Lubelskie</option>
                <option value="lubuskie">Lubuskie</option>
                <option value="lodzkie">Łódzkie</option>
                <option value="malopolskie">Małopolskie</option>
                <option value="mazowieckie">Mazowieckie</option>
                <option value="opolskie">Opolskie</option>
                <option value="podkarpackie">Podkarpackie</option>
                <option value="podlaskie">Podlaskie</option>
                <option value="pomorskie">Pomorskie</option>
                <option value="slaskie">Śląskie</option>
                <option value="swietokrzyskie">Świętokrzyskie</option>
                <option value="warminsko-mazurskie">Warmińsko-Mazurskie</option>
                <option value="wielkopolskie">Wielkopolskie</option>
                <option value="zachodniopomorskie">Zachodniopomorskie</option>
              </select>
            </div>
          </div>
          <button type="button" id="applyCommonFields" class="btn-primary">
            <i class="fas fa-check"></i>
            ${lang === 'pl' ? 'Zastosuj do nowych przedmiotów' : 'Apply to new items'}
          </button>
        </div>

        <!-- Quick Item Entry -->
        <div class="express-section">
          <h4>${lang === 'pl' ? 'Szybkie dodawanie przedmiotu' : 'Quick item entry'}</h4>
          <div class="express-quick-form">
            <div class="form-row">
              <div class="form-group">
                <label>${lang === 'pl' ? 'Nazwa' : 'Name'}</label>
                <input type="text" id="express_item_name" class="form-control"
                  placeholder="${lang === 'pl' ? 'np. Telefon Samsung' : 'e.g. Samsung Phone'}">
              </div>
              <div class="form-group">
                <label>${lang === 'pl' ? 'Kategoria' : 'Category'}</label>
                <select id="express_category" class="form-control">
                  <option value="">-- ${lang === 'pl' ? 'Wybierz' : 'Select'} --</option>
                  <option value="electronics">${lang === 'pl' ? 'Elektronika' : 'Electronics'}</option>
                  <option value="documents">${lang === 'pl' ? 'Dokumenty' : 'Documents'}</option>
                  <option value="keys">${lang === 'pl' ? 'Klucze' : 'Keys'}</option>
                  <option value="luggage">${lang === 'pl' ? 'Bagaż' : 'Luggage'}</option>
                  <option value="valuables">${lang === 'pl' ? 'Wartościowe' : 'Valuables'}</option>
                  <option value="other">${lang === 'pl' ? 'Inne' : 'Other'}</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>${lang === 'pl' ? 'Opis' : 'Description'}</label>
              <textarea id="express_description" class="form-control" rows="2"
                placeholder="${lang === 'pl' ? 'Krótki opis przedmiotu...' : 'Brief item description...'}"></textarea>
            </div>
            <button type="button" id="addQuickItem" class="btn-success">
              <i class="fas fa-plus"></i>
              ${lang === 'pl' ? 'Dodaj do listy' : 'Add to list'}
            </button>
          </div>
        </div>

        <!-- Batch Items List -->
        <div class="express-section">
          <h4>
            ${lang === 'pl' ? 'Lista przedmiotów' : 'Items list'}
            <span id="expressItemCount" class="badge">0</span>
          </h4>
          <div id="expressBatchList" class="express-batch-list">
            <div class="empty-state">
              <i class="fas fa-inbox"></i>
              <p>${lang === 'pl' ? 'Brak przedmiotów. Dodaj pierwszy przedmiot powyżej.' : 'No items. Add your first item above.'}</p>
            </div>
          </div>
        </div>

        <!-- Submit All -->
        <div class="express-actions">
          <button type="button" id="submitAllExpressItems" class="btn-primary btn-lg" disabled>
            <i class="fas fa-paper-plane"></i>
            ${lang === 'pl' ? 'Wyślij wszystkie' : 'Submit all'} (<span id="submitCount">0</span>)
          </button>
          <button type="button" id="clearAllExpressItems" class="btn-secondary">
            <i class="fas fa-trash"></i>
            ${lang === 'pl' ? 'Wyczyść listę' : 'Clear list'}
          </button>
        </div>
      </div>
    `;

    // Insert panel into page
    const mainContent = document.getElementById('step2') || document.querySelector('.container');
    if (mainContent) {
      mainContent.insertBefore(expressPanel, mainContent.firstChild);
    }

    this.attachExpressEventListeners();
  }

  /**
   * Hide Express Mode UI
   */
  hideExpressUI() {
    const panel = document.getElementById('expressModePanel');
    if (panel) {
      panel.style.display = 'none';
    }
  }

  /**
   * Attach event listeners for Express Mode UI
   */
  attachExpressEventListeners() {
    const lang = this.i18n.getCurrentLanguage();

    // Exit Express Mode
    document.getElementById('exitExpressMode')?.addEventListener('click', () => {
      this.deactivate();
    });

    // Apply common fields
    document.getElementById('applyCommonFields')?.addEventListener('click', () => {
      this.commonFields = {
        date_found: document.getElementById('express_common_date').value,
        location_found: document.getElementById('express_common_location').value,
        municipality: document.getElementById('express_common_municipality').value,
        county: document.getElementById('express_common_county').value,
        voivodeship: document.getElementById('express_common_voivodeship').value
      };

      alert(lang === 'pl'
        ? 'Wspólne pola zostaną zastosowane do nowych przedmiotów'
        : 'Common fields will be applied to new items');
    });

    // Add quick item
    document.getElementById('addQuickItem')?.addEventListener('click', () => {
      const itemName = document.getElementById('express_item_name').value;
      const category = document.getElementById('express_category').value;
      const description = document.getElementById('express_description').value;

      if (!itemName || !category || !description) {
        alert(lang === 'pl' ? 'Wypełnij wszystkie pola' : 'Fill all fields');
        return;
      }

      const item = this.addItem({
        item_name: itemName,
        category: category,
        description: description,
        status: 'stored'
      });

      this.renderBatchList();

      // Clear quick form
      document.getElementById('express_item_name').value = '';
      document.getElementById('express_category').value = '';
      document.getElementById('express_description').value = '';
    });

    // Clear all items
    document.getElementById('clearAllExpressItems')?.addEventListener('click', () => {
      if (confirm(lang === 'pl' ? 'Wyczyścić całą listę?' : 'Clear entire list?')) {
        this.clear();
        this.renderBatchList();
      }
    });

    // Submit all items
    document.getElementById('submitAllExpressItems')?.addEventListener('click', () => {
      this.submitAll();
    });
  }

  /**
   * Render batch items list
   */
  renderBatchList() {
    const listContainer = document.getElementById('expressBatchList');
    const itemCount = document.getElementById('expressItemCount');
    const submitCount = document.getElementById('submitCount');
    const submitBtn = document.getElementById('submitAllExpressItems');

    if (!listContainer) return;

    // Update counts
    if (itemCount) itemCount.textContent = this.items.length;
    if (submitCount) submitCount.textContent = this.items.length;
    if (submitBtn) submitBtn.disabled = this.items.length === 0;

    // Empty state
    if (this.items.length === 0) {
      const lang = this.i18n.getCurrentLanguage();
      listContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-inbox"></i>
          <p>${lang === 'pl' ? 'Brak przedmiotów. Dodaj pierwszy przedmiot powyżej.' : 'No items. Add your first item above.'}</p>
        </div>
      `;
      return;
    }

    // Render items
    listContainer.innerHTML = this.items.map((item, index) => `
      <div class="express-batch-item" data-temp-id="${item.id}">
        <div class="batch-item-number">#${index + 1}</div>
        <div class="batch-item-info">
          <strong>${item.item_name}</strong>
          <span class="item-category-badge">${item.category}</span>
          <p>${item.description}</p>
          <small>${item.location_found || ''}</small>
        </div>
        <button type="button" class="batch-item-remove" onclick="window.expressMode.removeItem('${item.id}'); window.expressMode.renderBatchList();">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `).join('');
  }

  /**
   * Submit all items to server
   */
  async submitAll() {
    const lang = this.i18n.getCurrentLanguage();

    if (this.items.length === 0) {
      alert(lang === 'pl' ? 'Brak przedmiotów do wysłania' : 'No items to submit');
      return;
    }

    try {
      // Show loading
      const submitBtn = document.getElementById('submitAllExpressItems');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${lang === 'pl' ? 'Wysyłanie...' : 'Submitting...'}`;
      }

      // Prepare items (remove temp IDs)
      const itemsToSubmit = this.items.map(item => {
        const { id, ...itemData } = item;
        return itemData;
      });

      // Call API (placeholder - integrate with actual API)
      console.log('Submitting items:', itemsToSubmit);

      // Success
      alert(lang === 'pl'
        ? `Pomyślnie dodano ${this.items.length} przedmiotów!`
        : `Successfully added ${this.items.length} items!`);

      this.clear();
      this.renderBatchList();

    } catch (error) {
      console.error('Express Mode submission error:', error);
      alert(lang === 'pl' ? 'Błąd podczas wysyłania' : 'Error submitting items');
    } finally {
      const submitBtn = document.getElementById('submitAllExpressItems');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i> ${lang === 'pl' ? 'Wyślij wszystkie' : 'Submit all'} (<span id="submitCount">${this.items.length}</span>)`;
      }
    }
  }
}

// Export
if (typeof window !== 'undefined') {
  window.ExpressMode = ExpressMode;
}
