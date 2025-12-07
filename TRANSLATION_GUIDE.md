# Translation Guide - Rzeczy Znalezione

## How to Add Translations to Any Page

### Step 1: Add `data-i18n` Attribute to HTML Elements

Add the `data-i18n` attribute to any element you want to translate:

```html
<!-- Before -->
<h1>Profil użytkownika</h1>

<!-- After -->
<h1 data-i18n="profile_title">Profil użytkownika</h1>
```

### Step 2: For Input Placeholders

Use `data-i18n-placeholder`:

```html
<input type="text" data-i18n-placeholder="search_placeholder" placeholder="Wpisz czego szukasz...">
```

### Step 3: For Title Attributes

Use `data-i18n-title`:

```html
<button data-i18n-title="save" title="Zapisz">
    <i class="fas fa-save"></i>
</button>
```

## Quick Examples for Each Page

### Profile Page (profile.html)

```html
<!-- Page Header -->
<h1 data-i18n="profile_title">Profil użytkownika</h1>
<p data-i18n="profile_subtitle">Zarządzaj swoim profilem</p>

<!-- Tabs -->
<button data-i18n="personal_info">Informacje osobiste</button>
<button data-i18n="security">Bezpieczeństwo</button>
<button data-i18n="settings">Ustawienia</button>

<!-- Form Labels -->
<label data-i18n="name">Imię i nazwisko</label>
<label data-i18n="email">Email</label>
<label data-i18n="phone">Telefon</label>

<!-- Buttons -->
<button data-i18n="save">Zapisz</button>
<button data-i18n="cancel">Anuluj</button>
```

### Admin Page (admin.html)

```html
<!-- Page Header -->
<h1 data-i18n="admin_title">Panel Administratora</h1>
<p data-i18n="admin_subtitle">Zarządzanie użytkownikami</p>

<!-- Stats Cards -->
<span data-i18n="total_users">Całkowita liczba użytkowników</span>
<span data-i18n="active_users">Aktywni użytkownicy</span>

<!-- Table Headers -->
<th data-i18n="name">Imię i nazwisko</th>
<th data-i18n="email">Email</th>
<th data-i18n="role">Rola</th>
<th data-i18n="created">Utworzono</th>
<th data-i18n="actions">Akcje</th>
```

### Public Search Page (public.html)

```html
<!-- Hero -->
<h1 data-i18n="search_results">Szukaj Rzeczy Znalezionych</h1>

<!-- Search Input -->
<input type="text" data-i18n-placeholder="search_placeholder" placeholder="Wpisz czego szukasz...">

<!-- Filters -->
<h3 data-i18n="filters">Filtry</h3>
<button data-i18n="clear_filters">Wyczyść filtry</button>

<!-- View Toggles -->
<button data-i18n="view_grid">Widok siatki</button>
<button data-i18n="view_list">Widok listy</button>
<button data-i18n="view_map">Widok mapy</button>
```

### Navigation (All Pages)

```html
<!-- Navigation Links -->
<a href="index.html" data-i18n="nav_admin">Panel urzędnika</a>
<a href="public.html" data-i18n="nav_search">Szukaj rzeczy</a>
<a href="#" data-i18n="nav_login">Zaloguj</a>
<a href="#" data-i18n="nav_logout">Wyloguj</a>
<a href="profile.html" data-i18n="nav_profile">Profil</a>
```

## Available Translation Keys

### General
- `app_name`, `app_subtitle`, `search`, `loading`, `save`, `cancel`, `delete`, `edit`, `back`, `next`, `close`

### Navigation
- `nav_admin`, `nav_search`, `nav_portal`, `nav_login`, `nav_logout`, `nav_profile`

### Auth
- `login`, `register`, `email`, `password`, `name`, `organization`, `phone`

### Profile
- `profile_title`, `personal_info`, `security`, `settings`, `change_password`

### Admin
- `admin_title`, `user_management`, `total_users`, `active_users`, `role`, `actions`

### Categories
- `categories.phone`, `categories.documents`, `categories.jewelry`, `categories.keys`, `categories.wallet`

### Statuses
- `statuses.stored`, `statuses.returned`, `statuses.liquidated`

## Adding New Translations

1. Open `i18n.js`
2. Add your key to both `pl:` and `en:` sections:

```javascript
// Polish section
pl: {
    my_new_key: 'Mój nowy tekst'
}

// English section
en: {
    my_new_key: 'My new text'
}
```

3. Use it in HTML:

```html
<span data-i18n="my_new_key">Mój nowy tekst</span>
```

## How Translation Works

1. **On Page Load**: The i18n system reads the current language from localStorage
2. **Automatic Updates**: All elements with `data-i18n` attributes are automatically translated
3. **Language Switch**: When user clicks PL/EN buttons, all text updates instantly
4. **Persistence**: Language choice is saved and persists across page reloads

## Testing Translations

1. Open any page in browser
2. Click **PL** or **EN** button in the navigation
3. Watch all translated elements update
4. Reload page - language should persist

## Pro Tips

- Use descriptive keys like `profile_title` instead of `title1`
- Group related translations (e.g., all profile keys start with `profile_`)
- Always add both Polish and English translations
- Test on all pages after adding new translations
- Keep translations short for buttons and labels

## Full Translation Coverage

To translate ALL text on a page:

1. **Headers**: Add `data-i18n` to h1, h2, h3
2. **Paragraphs**: Add to all p tags
3. **Buttons**: Add to all button and link text
4. **Labels**: Add to all form labels
5. **Placeholders**: Use `data-i18n-placeholder`
6. **Titles**: Use `data-i18n-title` for tooltips

Example of fully translated section:

```html
<div class="card">
    <h2 data-i18n="security">Bezpieczeństwo</h2>
    <h3 data-i18n="change_password">Zmiana hasła</h3>
    <p data-i18n="change_password_desc">Regularnie zmieniaj hasło</p>

    <form>
        <label data-i18n="current_password">Obecne hasło</label>
        <input type="password" data-i18n-placeholder="current_password">

        <label data-i18n="new_password">Nowe hasło</label>
        <input type="password" data-i18n-placeholder="new_password">

        <button type="submit" data-i18n="save">Zapisz</button>
    </form>
</div>
```

## Need Help?

- Check `i18n.js` for all available translation keys
- Look at `index.html` for working examples
- Test your changes by switching between PL/EN
