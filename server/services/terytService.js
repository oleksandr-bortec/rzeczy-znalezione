/**
 * TERYT Service - Integracja z Krajowym Rejestrem Urzędowym
 * Podziału Terytorialnego Kraju
 *
 * Funkcje:
 * - Wyszukiwanie gmin, powiatów, województw
 * - Walidacja kodów TERYT
 * - Auto-complete dla formularzy
 * - Standaryzacja nazw miejscowości
 */

const { WOJEWODZTWA, POWIATY, GMINY } = require('../data/teryt-data');

/**
 * Wyszukiwanie województwa po nazwie (fuzzy matching)
 */
function findWojewodztwo(query) {
  if (!query) return null;

  const normalized = query.toLowerCase().trim();

  // Exact match on kod
  const exactKod = WOJEWODZTWA.find(w => w.kod === normalized);
  if (exactKod) return exactKod;

  // Exact match on nazwa
  const exactNazwa = WOJEWODZTWA.find(w => w.nazwa === normalized);
  if (exactNazwa) return exactNazwa;

  // Partial match
  const partial = WOJEWODZTWA.find(w =>
    w.nazwa.includes(normalized) ||
    w.pelna_nazwa.toLowerCase().includes(normalized)
  );
  if (partial) return partial;

  // Fuzzy match (bez polskich znaków)
  const removeDiacritics = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const fuzzy = WOJEWODZTWA.find(w => {
    const plain = removeDiacritics(w.pelna_nazwa.toLowerCase());
    const queryPlain = removeDiacritics(normalized);
    return plain.includes(queryPlain) || queryPlain.includes(plain);
  });

  return fuzzy || null;
}

/**
 * Pobierz wszystkie województwa
 */
function getAllWojewodztwa() {
  return WOJEWODZTWA;
}

/**
 * Wyszukiwanie powiatu po nazwie i województwie
 */
function findPowiat(nazwaPowiatu, wojewodztwo) {
  if (!nazwaPowiatu) return null;

  const normalized = nazwaPowiatu.toLowerCase().trim();
  let results = POWIATY.filter(p => p.nazwa.toLowerCase().includes(normalized));

  // Filtruj po województwie jeśli podane
  if (wojewodztwo) {
    const woj = findWojewodztwo(wojewodztwo);
    if (woj) {
      results = results.filter(p => p.wojewodztwo === woj.nazwa);
    }
  }

  return results.length > 0 ? results[0] : null;
}

/**
 * Pobierz powiaty dla województwa
 */
function getPowiatyForWojewodztwo(wojewodztwo) {
  const woj = findWojewodztwo(wojewodztwo);
  if (!woj) return [];

  return POWIATY.filter(p => p.wojewodztwo === woj.nazwa);
}

/**
 * Wyszukiwanie gminy po nazwie
 */
function findGmina(nazwaGminy, powiat = null, wojewodztwo = null) {
  if (!nazwaGminy) return null;

  const normalized = nazwaGminy.toLowerCase().trim();
  let results = GMINY.filter(g => g.nazwa.toLowerCase().includes(normalized));

  // Filtruj po powiecie
  if (powiat) {
    results = results.filter(g => g.powiat.toLowerCase().includes(powiat.toLowerCase()));
  }

  // Filtruj po województwie
  if (wojewodztwo) {
    const woj = findWojewodztwo(wojewodztwo);
    if (woj) {
      results = results.filter(g => g.wojewodztwo === woj.nazwa);
    }
  }

  return results.length > 0 ? results[0] : null;
}

/**
 * Pobierz gminy dla powiatu
 */
function getGminyForPowiat(powiat, wojewodztwo) {
  let results = GMINY;

  if (wojewodztwo) {
    const woj = findWojewodztwo(wojewodztwo);
    if (woj) {
      results = results.filter(g => g.wojewodztwo === woj.nazwa);
    }
  }

  if (powiat) {
    results = results.filter(g => g.powiat.toLowerCase().includes(powiat.toLowerCase()));
  }

  return results;
}

/**
 * Auto-complete dla gmin
 * Zwraca top 10 wyników pasujących do query
 */
function autocompleteGmina(query, wojewodztwo = null) {
  if (!query || query.length < 2) return [];

  const normalized = query.toLowerCase().trim();
  let results = GMINY.filter(g => g.nazwa.toLowerCase().startsWith(normalized));

  // Jeśli brak wyników ze startsWith, użyj includes
  if (results.length === 0) {
    results = GMINY.filter(g => g.nazwa.toLowerCase().includes(normalized));
  }

  // Filtruj po województwie jeśli podane
  if (wojewodztwo) {
    const woj = findWojewodztwo(wojewodztwo);
    if (woj) {
      results = results.filter(g => g.wojewodztwo === woj.nazwa);
    }
  }

  // Sortuj alfabetycznie
  results.sort((a, b) => a.nazwa.localeCompare(b.nazwa));

  // Return top 10
  return results.slice(0, 10).map(g => ({
    nazwa: g.nazwa,
    powiat: g.powiat,
    wojewodztwo: g.wojewodztwo,
    pelna_nazwa: `${g.nazwa}, pow. ${g.powiat}, woj. ${g.wojewodztwo}`
  }));
}

/**
 * Auto-complete dla powiatów
 */
function autocompletePowiat(query, wojewodztwo = null) {
  if (!query || query.length < 2) return [];

  const normalized = query.toLowerCase().trim();
  let results = POWIATY.filter(p => p.nazwa.toLowerCase().startsWith(normalized));

  if (results.length === 0) {
    results = POWIATY.filter(p => p.nazwa.toLowerCase().includes(normalized));
  }

  if (wojewodztwo) {
    const woj = findWojewodztwo(wojewodztwo);
    if (woj) {
      results = results.filter(p => p.wojewodztwo === woj.nazwa);
    }
  }

  results.sort((a, b) => a.nazwa.localeCompare(b.nazwa));

  return results.slice(0, 10).map(p => ({
    nazwa: p.nazwa,
    typ: p.typ,
    wojewodztwo: p.wojewodztwo,
    pelna_nazwa: `${p.nazwa} (${p.typ}), woj. ${p.wojewodztwo}`
  }));
}

/**
 * Walidacja czy gmina istnieje w TERYT
 */
function validateGmina(nazwaGminy, powiat = null, wojewodztwo = null) {
  const gmina = findGmina(nazwaGminy, powiat, wojewodztwo);
  return gmina !== null;
}

/**
 * Walidacja czy powiat istnieje w TERYT
 */
function validatePowiat(nazwaPowiatu, wojewodztwo = null) {
  const powiat = findPowiat(nazwaPowiatu, wojewodztwo);
  return powiat !== null;
}

/**
 * Walidacja czy województwo istnieje w TERYT
 */
function validateWojewodztwo(wojewodztwo) {
  return findWojewodztwo(wojewodztwo) !== null;
}

/**
 * Standaryzacja nazwy gminy do oficjalnej formy TERYT
 */
function standardizeGmina(nazwaGminy, powiat = null, wojewodztwo = null) {
  const gmina = findGmina(nazwaGminy, powiat, wojewodztwo);
  return gmina ? gmina.nazwa : nazwaGminy;
}

/**
 * Standaryzacja nazwy powiatu do oficjalnej formy TERYT
 */
function standardizePowiat(nazwaPowiatu, wojewodztwo = null) {
  const powiat = findPowiat(nazwaPowiatu, wojewodztwo);
  return powiat ? powiat.nazwa : nazwaPowiatu;
}

/**
 * Standaryzacja nazwy województwa do oficjalnej formy TERYT
 */
function standardizeWojewodztwo(wojewodztwo) {
  const woj = findWojewodztwo(wojewodztwo);
  return woj ? woj.nazwa : wojewodztwo;
}

/**
 * Pobierz kompletne informacje o lokalizacji
 * Zwraca obiekt z gminą, powiatem i województwem
 */
function getLocationInfo(nazwaGminy, nazwaPowiatu, wojewodztwo) {
  const woj = findWojewodztwo(wojewodztwo);
  const powiat = findPowiat(nazwaPowiatu, wojewodztwo);
  const gmina = findGmina(nazwaGminy, nazwaPowiatu, wojewodztwo);

  return {
    gmina: gmina ? {
      nazwa: gmina.nazwa,
      kod: gmina.kod,
      valid: true
    } : {
      nazwa: nazwaGminy,
      kod: null,
      valid: false
    },
    powiat: powiat ? {
      nazwa: powiat.nazwa,
      kod: powiat.kod,
      typ: powiat.typ,
      valid: true
    } : {
      nazwa: nazwaPowiatu,
      kod: null,
      typ: null,
      valid: false
    },
    wojewodztwo: woj ? {
      nazwa: woj.nazwa,
      pelna_nazwa: woj.pelna_nazwa,
      kod: woj.kod,
      stolica: woj.stolica,
      valid: true
    } : {
      nazwa: wojewodztwo,
      pelna_nazwa: null,
      kod: null,
      stolica: null,
      valid: false
    }
  };
}

/**
 * Sugestie przy wpisywaniu (typeahead)
 * Łączy auto-complete dla gmin i powiatów
 */
function getSuggestions(query, type = 'all', wojewodztwo = null) {
  const suggestions = [];

  if (type === 'all' || type === 'gmina') {
    const gminy = autocompleteGmina(query, wojewodztwo);
    suggestions.push(...gminy.map(g => ({
      type: 'gmina',
      value: g.nazwa,
      label: g.pelna_nazwa,
      wojewodztwo: g.wojewodztwo,
      powiat: g.powiat
    })));
  }

  if (type === 'all' || type === 'powiat') {
    const powiaty = autocompletePowiat(query, wojewodztwo);
    suggestions.push(...powiaty.map(p => ({
      type: 'powiat',
      value: p.nazwa,
      label: p.pelna_nazwa,
      wojewodztwo: p.wojewodztwo
    })));
  }

  return suggestions.slice(0, 10);
}

module.exports = {
  // Wyszukiwanie
  findWojewodztwo,
  findPowiat,
  findGmina,

  // Listy
  getAllWojewodztwa,
  getPowiatyForWojewodztwo,
  getGminyForPowiat,

  // Auto-complete
  autocompleteGmina,
  autocompletePowiat,
  getSuggestions,

  // Walidacja
  validateGmina,
  validatePowiat,
  validateWojewodztwo,

  // Standaryzacja
  standardizeGmina,
  standardizePowiat,
  standardizeWojewodztwo,

  // Info
  getLocationInfo
};
