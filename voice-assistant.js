/**
 * KILLER FEATURE #3: GŁOSOWY ASYSTENT URZĘDNIKA
 * Voice dictation system using Web Speech API
 * Allows clerks to dictate item descriptions hands-free
 */

class VoiceAssistant {
  constructor(i18nInstance) {
    this.i18n = i18nInstance;
    this.recognition = null;
    this.isListening = false;
    this.onResult = null;
    this.onError = null;
    this.onStateChange = null;
    this.language = 'pl-PL';

    this.initializeRecognition();
  }

  /**
   * Initialize Web Speech Recognition
   */
  initializeRecognition() {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Web Speech API not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    this.recognition.lang = this.language;

    // Event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStateChange) {
        this.onStateChange('listening');
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onStateChange) {
        this.onStateChange('stopped');
      }
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (this.onResult) {
        this.onResult({
          final: finalTranscript.trim(),
          interim: interimTranscript.trim(),
          isFinal: finalTranscript.length > 0
        });
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;

      if (this.onError) {
        this.onError(event.error);
      }

      if (this.onStateChange) {
        this.onStateChange('error', event.error);
      }
    };
  }

  /**
   * Check if browser supports speech recognition
   */
  static isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  /**
   * Start listening
   */
  start() {
    if (!this.recognition) {
      console.error('Speech recognition not initialized');
      return false;
    }

    if (this.isListening) {
      console.warn('Already listening');
      return false;
    }

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      return false;
    }
  }

  /**
   * Stop listening
   */
  stop() {
    if (!this.recognition) {
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
    }
  }

  /**
   * Toggle listening state
   */
  toggle() {
    if (this.isListening) {
      this.stop();
    } else {
      this.start();
    }
  }

  /**
   * Set language for recognition
   */
  setLanguage(lang) {
    const languageMap = {
      'pl': 'pl-PL',
      'en': 'en-US'
    };

    this.language = languageMap[lang] || 'pl-PL';

    if (this.recognition) {
      this.recognition.lang = this.language;
    }
  }

  /**
   * Set result callback
   */
  onResultCallback(callback) {
    this.onResult = callback;
  }

  /**
   * Set error callback
   */
  onErrorCallback(callback) {
    this.onError = callback;
  }

  /**
   * Set state change callback
   */
  onStateChangeCallback(callback) {
    this.onStateChange = callback;
  }
}

/**
 * Voice Assistant UI Controller
 * Manages UI for voice dictation in forms
 */
class VoiceAssistantUI {
  constructor(voiceAssistant, targetFieldSelector, i18nInstance) {
    this.voiceAssistant = voiceAssistant;
    this.targetField = document.querySelector(targetFieldSelector);
    this.i18n = i18nInstance;
    this.button = null;
    this.statusIndicator = null;
    this.transcriptBuffer = '';

    this.init();
  }

  /**
   * Initialize UI components
   */
  init() {
    if (!this.targetField) {
      console.error('Target field not found');
      return;
    }

    this.createButton();
    this.createStatusIndicator();
    this.attachEventListeners();
  }

  /**
   * Create voice button next to target field
   */
  createButton() {
    const lang = this.i18n.getCurrentLanguage();

    // Create button wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'voice-assistant-wrapper';

    // Create button
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.className = 'voice-assistant-btn';
    this.button.innerHTML = `
      <i class="fas fa-microphone"></i>
      <span class="voice-btn-text">${lang === 'pl' ? 'Dyktuj' : 'Dictate'}</span>
    `;
    this.button.title = lang === 'pl'
      ? 'Kliknij aby dyktować opis głosem'
      : 'Click to dictate description by voice';

    wrapper.appendChild(this.button);

    // Insert after target field
    this.targetField.parentNode.insertBefore(wrapper, this.targetField.nextSibling);
  }

  /**
   * Create status indicator
   */
  createStatusIndicator() {
    this.statusIndicator = document.createElement('div');
    this.statusIndicator.className = 'voice-status-indicator';
    this.statusIndicator.style.display = 'none';

    const wrapper = this.button.parentElement;
    wrapper.appendChild(this.statusIndicator);
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Button click handler
    this.button.addEventListener('click', () => {
      this.voiceAssistant.toggle();
    });

    // Voice assistant callbacks
    this.voiceAssistant.onResultCallback((result) => {
      this.handleVoiceResult(result);
    });

    this.voiceAssistant.onStateChangeCallback((state, error) => {
      this.updateUI(state, error);
    });

    this.voiceAssistant.onErrorCallback((error) => {
      this.showError(error);
    });
  }

  /**
   * Handle voice recognition result
   */
  handleVoiceResult(result) {
    if (result.isFinal && result.final) {
      // Add final transcript to buffer
      this.transcriptBuffer += result.final + ' ';

      // Update field with processed text
      const processedText = this.processTranscript(this.transcriptBuffer);
      this.targetField.value = processedText;

      // Trigger input event for validation
      this.targetField.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // Show interim results in status indicator
    if (result.interim) {
      this.showInterimResult(result.interim);
    }
  }

  /**
   * Process transcript to improve formatting
   */
  processTranscript(text) {
    // Capitalize first letter
    text = text.charAt(0).toUpperCase() + text.slice(1);

    // Common Polish replacements for voice dictation
    const replacements = {
      'comma': ',',
      'przecinek': ',',
      'kropka': '.',
      'period': '.',
      'nowa linia': '\n',
      'new line': '\n',
      'liczba': '',
      'numer': '',
    };

    for (const [key, value] of Object.entries(replacements)) {
      const regex = new RegExp('\\b' + key + '\\b', 'gi');
      text = text.replace(regex, value);
    }

    // Clean up extra spaces
    text = text.replace(/\s+/g, ' ').trim();

    return text;
  }

  /**
   * Update UI based on state
   */
  updateUI(state, error) {
    const lang = this.i18n.getCurrentLanguage();

    switch (state) {
      case 'listening':
        this.button.classList.add('listening');
        this.button.innerHTML = `
          <i class="fas fa-microphone-slash"></i>
          <span class="voice-btn-text">${lang === 'pl' ? 'Zatrzymaj' : 'Stop'}</span>
        `;
        this.statusIndicator.style.display = 'block';
        this.statusIndicator.innerHTML = `
          <div class="voice-pulse"></div>
          <span>${lang === 'pl' ? 'Słucham...' : 'Listening...'}</span>
        `;
        this.statusIndicator.className = 'voice-status-indicator listening';
        break;

      case 'stopped':
        this.button.classList.remove('listening');
        this.button.innerHTML = `
          <i class="fas fa-microphone"></i>
          <span class="voice-btn-text">${lang === 'pl' ? 'Dyktuj' : 'Dictate'}</span>
        `;
        this.statusIndicator.style.display = 'none';
        break;

      case 'error':
        this.button.classList.remove('listening');
        this.button.innerHTML = `
          <i class="fas fa-microphone"></i>
          <span class="voice-btn-text">${lang === 'pl' ? 'Dyktuj' : 'Dictate'}</span>
        `;
        this.showError(error);
        break;
    }
  }

  /**
   * Show interim results
   */
  showInterimResult(text) {
    this.statusIndicator.innerHTML = `
      <div class="voice-pulse"></div>
      <span class="interim-text">${text}</span>
    `;
  }

  /**
   * Show error message
   */
  showError(error) {
    const lang = this.i18n.getCurrentLanguage();
    const errorMessages = {
      'no-speech': lang === 'pl' ? 'Nie wykryto mowy' : 'No speech detected',
      'audio-capture': lang === 'pl' ? 'Mikrofon niedostępny' : 'Microphone unavailable',
      'not-allowed': lang === 'pl' ? 'Brak uprawnień do mikrofonu' : 'Microphone permission denied',
      'network': lang === 'pl' ? 'Błąd sieci' : 'Network error'
    };

    const message = errorMessages[error] || (lang === 'pl' ? 'Błąd rozpoznawania mowy' : 'Speech recognition error');

    this.statusIndicator.style.display = 'block';
    this.statusIndicator.innerHTML = `
      <i class="fas fa-exclamation-triangle"></i>
      <span>${message}</span>
    `;
    this.statusIndicator.className = 'voice-status-indicator error';

    setTimeout(() => {
      this.statusIndicator.style.display = 'none';
    }, 3000);
  }

  /**
   * Clear transcript buffer
   */
  clearBuffer() {
    this.transcriptBuffer = '';
  }

  /**
   * Reset to initial state
   */
  reset() {
    this.clearBuffer();
    this.voiceAssistant.stop();
    this.targetField.value = '';
  }
}

// Export classes
if (typeof window !== 'undefined') {
  window.VoiceAssistant = VoiceAssistant;
  window.VoiceAssistantUI = VoiceAssistantUI;
}
