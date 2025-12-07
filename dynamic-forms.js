/**
 * KILLER FEATURE #2: Dynamic Form Rendering System
 * Renders category-specific form fields based on selected category
 */

class DynamicFormManager {
  constructor(containerSelector, schemasConfig, i18nInstance) {
    this.container = document.querySelector(containerSelector);
    this.schemas = schemasConfig;
    this.i18n = i18nInstance;
    this.currentCategory = null;
    this.currentValues = {};
    this.listeners = [];
  }

  /**
   * Initialize dynamic form for a category
   */
  loadCategory(categoryKey) {
    if (!this.schemas[categoryKey]) {
      console.warn(`Unknown category: ${categoryKey}`);
      return;
    }

    this.currentCategory = categoryKey;
    this.currentValues = {};
    this.renderFields();
  }

  /**
   * Render all fields for current category
   */
  renderFields() {
    if (!this.container || !this.currentCategory) return;

    const schema = this.schemas[this.currentCategory];
    const lang = this.i18n.getCurrentLanguage();

    // Clear existing dynamic fields
    this.container.innerHTML = '';

    // Create header
    const header = document.createElement('div');
    header.className = 'dynamic-form-header';
    header.innerHTML = `
      <h3>
        <i class="fas ${schema.icon}"></i>
        ${schema.name[lang]}
      </h3>
      <p class="form-help-text">
        ${lang === 'pl'
          ? 'Wypełnij pola specyficzne dla tej kategorii'
          : 'Fill in category-specific fields'}
      </p>
    `;
    this.container.appendChild(header);

    // Render each field
    schema.fields.forEach(field => {
      const fieldElement = this.renderField(field, schema, lang);
      if (fieldElement) {
        this.container.appendChild(fieldElement);
      }
    });

    // Attach event listeners for conditional logic
    this.attachConditionalListeners();
  }

  /**
   * Render a single field
   */
  renderField(field, schema, lang) {
    // Check if field should be visible based on conditions
    if (!this.shouldShowField(field)) {
      return null;
    }

    const fieldWrapper = document.createElement('div');
    fieldWrapper.className = 'form-group dynamic-field';
    fieldWrapper.dataset.fieldId = field.id;
    if (field.conditional) {
      fieldWrapper.dataset.conditional = JSON.stringify(field.conditional);
    }

    // Label
    const label = document.createElement('label');
    label.htmlFor = `dynamic_${field.id}`;
    label.className = 'form-label';
    label.textContent = field.label[lang];
    if (field.required) {
      const required = document.createElement('span');
      required.className = 'required';
      required.textContent = ' *';
      label.appendChild(required);
    }
    fieldWrapper.appendChild(label);

    // Input element based on type
    let input;
    switch (field.type) {
      case 'select':
        input = this.createSelectField(field, schema, lang);
        break;
      case 'radio':
        input = this.createRadioField(field, lang);
        break;
      case 'checkbox':
        input = this.createCheckboxField(field, lang);
        break;
      case 'textarea':
        input = this.createTextareaField(field, lang);
        break;
      case 'date':
        input = this.createDateField(field);
        break;
      case 'number':
        input = this.createNumberField(field);
        break;
      default:
        input = this.createTextField(field, lang);
    }

    if (input) {
      fieldWrapper.appendChild(input);
    }

    // Help text
    if (field.placeholder && !['select', 'radio', 'checkbox'].includes(field.type)) {
      const helpText = document.createElement('small');
      helpText.className = 'form-help-text';
      helpText.textContent = field.placeholder[lang];
      fieldWrapper.appendChild(helpText);
    }

    // Error message container
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.id = `error_dynamic_${field.id}`;
    fieldWrapper.appendChild(errorDiv);

    return fieldWrapper;
  }

  /**
   * Create select/dropdown field
   */
  createSelectField(field, schema, lang) {
    const select = document.createElement('select');
    select.id = `dynamic_${field.id}`;
    select.name = `dynamic_${field.id}`;
    select.className = 'form-control';
    select.required = field.required || false;

    // Empty option
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = lang === 'pl' ? '-- Wybierz --' : '-- Select --';
    select.appendChild(emptyOption);

    // Get options
    let options = field.options;
    if (options === 'subcategories') {
      options = schema.subcategories;
    }

    // Add options
    options.forEach(opt => {
      const option = document.createElement('option');
      if (typeof opt === 'string') {
        option.value = opt;
        option.textContent = opt;
      } else if (opt.value) {
        option.value = opt.value;
        option.textContent = opt[lang] || opt.value;
      }
      select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
      this.currentValues[field.id] = e.target.value;
      this.updateConditionalFields();
      this.validateField(field, e.target.value);
    });

    return select;
  }

  /**
   * Create radio button group
   */
  createRadioField(field, lang) {
    const radioGroup = document.createElement('div');
    radioGroup.className = 'radio-group';

    field.options.forEach(opt => {
      const radioWrapper = document.createElement('div');
      radioWrapper.className = 'radio-option';

      const input = document.createElement('input');
      input.type = 'radio';
      input.id = `dynamic_${field.id}_${opt.value}`;
      input.name = `dynamic_${field.id}`;
      input.value = opt.value;
      input.required = field.required || false;

      const label = document.createElement('label');
      label.htmlFor = input.id;
      label.textContent = opt[lang] || opt.value;

      input.addEventListener('change', (e) => {
        this.currentValues[field.id] = e.target.value;
        this.updateConditionalFields();
        this.validateField(field, e.target.value);
      });

      radioWrapper.appendChild(input);
      radioWrapper.appendChild(label);
      radioGroup.appendChild(radioWrapper);
    });

    return radioGroup;
  }

  /**
   * Create checkbox group
   */
  createCheckboxField(field, lang) {
    const checkboxGroup = document.createElement('div');
    checkboxGroup.className = 'checkbox-group';

    field.options.forEach(opt => {
      const checkboxWrapper = document.createElement('div');
      checkboxWrapper.className = 'checkbox-option';

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = `dynamic_${field.id}_${opt.value}`;
      input.name = `dynamic_${field.id}[]`;
      input.value = opt.value;

      const label = document.createElement('label');
      label.htmlFor = input.id;
      label.textContent = opt[lang] || opt.value;

      input.addEventListener('change', () => {
        this.updateCheckboxValue(field.id);
        this.validateField(field, this.currentValues[field.id]);
      });

      checkboxWrapper.appendChild(input);
      checkboxWrapper.appendChild(label);
      checkboxGroup.appendChild(checkboxWrapper);
    });

    return checkboxGroup;
  }

  /**
   * Update checkbox value from checked boxes
   */
  updateCheckboxValue(fieldId) {
    const checkedBoxes = this.container.querySelectorAll(`input[name="dynamic_${fieldId}[]"]:checked`);
    this.currentValues[fieldId] = Array.from(checkedBoxes).map(cb => cb.value);
    this.updateConditionalFields();
  }

  /**
   * Create textarea field
   */
  createTextareaField(field, lang) {
    const textarea = document.createElement('textarea');
    textarea.id = `dynamic_${field.id}`;
    textarea.name = `dynamic_${field.id}`;
    textarea.className = 'form-control';
    textarea.required = field.required || false;
    textarea.rows = 3;
    if (field.placeholder) {
      textarea.placeholder = field.placeholder[lang];
    }

    textarea.addEventListener('input', (e) => {
      this.currentValues[field.id] = e.target.value;
      this.validateField(field, e.target.value);
    });

    return textarea;
  }

  /**
   * Create date field
   */
  createDateField(field) {
    const input = document.createElement('input');
    input.type = 'date';
    input.id = `dynamic_${field.id}`;
    input.name = `dynamic_${field.id}`;
    input.className = 'form-control';
    input.required = field.required || false;

    input.addEventListener('change', (e) => {
      this.currentValues[field.id] = e.target.value;
      this.validateField(field, e.target.value);
    });

    return input;
  }

  /**
   * Create number field
   */
  createNumberField(field) {
    const input = document.createElement('input');
    input.type = 'number';
    input.id = `dynamic_${field.id}`;
    input.name = `dynamic_${field.id}`;
    input.className = 'form-control';
    input.required = field.required || false;
    if (field.min !== undefined) input.min = field.min;
    if (field.max !== undefined) input.max = field.max;

    input.addEventListener('input', (e) => {
      this.currentValues[field.id] = e.target.value;
      this.validateField(field, e.target.value);
    });

    return input;
  }

  /**
   * Create text field
   */
  createTextField(field, lang) {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = `dynamic_${field.id}`;
    input.name = `dynamic_${field.id}`;
    input.className = 'form-control';
    input.required = field.required || false;
    if (field.pattern) input.pattern = field.pattern;
    if (field.placeholder) {
      input.placeholder = field.placeholder[lang];
    }

    input.addEventListener('input', (e) => {
      this.currentValues[field.id] = e.target.value;
      this.validateField(field, e.target.value);
    });

    return input;
  }

  /**
   * Check if field should be shown based on conditional logic
   */
  shouldShowField(field) {
    if (!field.conditional) return true;

    const conditionField = field.conditional.field;
    const currentValue = this.currentValues[conditionField];

    if (!currentValue) return false;

    // Check if current value matches condition
    if (field.conditional.values) {
      return field.conditional.values.includes(currentValue);
    }

    if (field.conditional.contains) {
      return Array.isArray(currentValue) && currentValue.includes(field.conditional.contains);
    }

    return true;
  }

  /**
   * Update visibility of conditional fields
   */
  updateConditionalFields() {
    const allFields = this.container.querySelectorAll('.dynamic-field[data-conditional]');

    allFields.forEach(fieldElement => {
      const fieldId = fieldElement.dataset.fieldId;
      const conditional = JSON.parse(fieldElement.dataset.conditional);

      const conditionField = conditional.field;
      const currentValue = this.currentValues[conditionField];

      let shouldShow = false;

      if (conditional.values && currentValue) {
        shouldShow = conditional.values.includes(currentValue);
      } else if (conditional.contains && Array.isArray(this.currentValues[conditionField])) {
        shouldShow = this.currentValues[conditionField].includes(conditional.contains);
      }

      // Show/hide field
      fieldElement.style.display = shouldShow ? 'block' : 'none';

      // Clear value if hidden
      if (!shouldShow) {
        const input = fieldElement.querySelector(`[name="dynamic_${fieldId}"], [name="dynamic_${fieldId}[]"]`);
        if (input) {
          if (input.type === 'checkbox' || input.type === 'radio') {
            fieldElement.querySelectorAll('input').forEach(i => i.checked = false);
          } else {
            input.value = '';
          }
          delete this.currentValues[fieldId];
        }
      }
    });
  }

  /**
   * Attach listeners for conditional logic
   */
  attachConditionalListeners() {
    // Already attached in field creation
  }

  /**
   * Validate a field
   */
  validateField(field, value) {
    const errorDiv = document.getElementById(`error_dynamic_${field.id}`);
    const lang = this.i18n.getCurrentLanguage();

    let error = '';

    // Required validation
    if (field.required && (!value || value.length === 0)) {
      error = lang === 'pl' ? 'To pole jest wymagane' : 'This field is required';
    }

    // Pattern validation
    if (value && field.pattern) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(value)) {
        error = lang === 'pl' ? 'Nieprawidłowy format' : 'Invalid format';
      }
    }

    // Number range validation
    if (field.type === 'number' && value) {
      const numValue = parseFloat(value);
      if (field.min !== undefined && numValue < field.min) {
        error = `${lang === 'pl' ? 'Minimalna wartość' : 'Minimum value'}: ${field.min}`;
      }
      if (field.max !== undefined && numValue > field.max) {
        error = `${lang === 'pl' ? 'Maksymalna wartość' : 'Maximum value'}: ${field.max}`;
      }
    }

    if (errorDiv) {
      errorDiv.textContent = error;
      errorDiv.style.display = error ? 'block' : 'none';
    }

    return !error;
  }

  /**
   * Validate all fields in current category
   */
  validateAll() {
    if (!this.currentCategory) return true;

    const schema = this.schemas[this.currentCategory];
    let isValid = true;

    schema.fields.forEach(field => {
      if (this.shouldShowField(field)) {
        const value = this.currentValues[field.id];
        const fieldValid = this.validateField(field, value);
        if (!fieldValid) {
          isValid = false;
        }
      }
    });

    return isValid;
  }

  /**
   * Get all values for current category
   */
  getValues() {
    return {
      category: this.currentCategory,
      custom_fields: this.currentValues
    };
  }

  /**
   * Set values (for editing existing items)
   */
  setValues(category, customFields) {
    this.currentCategory = category;
    this.currentValues = customFields || {};
    this.renderFields();

    // Populate fields with values
    Object.keys(this.currentValues).forEach(fieldId => {
      const value = this.currentValues[fieldId];
      const input = this.container.querySelector(`[name="dynamic_${fieldId}"]`);

      if (input) {
        if (input.type === 'checkbox') {
          // Handle checkbox group
          if (Array.isArray(value)) {
            value.forEach(v => {
              const checkbox = this.container.querySelector(`#dynamic_${fieldId}_${v}`);
              if (checkbox) checkbox.checked = true;
            });
          }
        } else if (input.type === 'radio') {
          const radio = this.container.querySelector(`#dynamic_${fieldId}_${value}`);
          if (radio) radio.checked = true;
        } else {
          input.value = value;
        }
      }
    });

    this.updateConditionalFields();
  }

  /**
   * Clear form
   */
  clear() {
    this.currentCategory = null;
    this.currentValues = {};
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

// Export for use in app.js
if (typeof window !== 'undefined') {
  window.DynamicFormManager = DynamicFormManager;
}
