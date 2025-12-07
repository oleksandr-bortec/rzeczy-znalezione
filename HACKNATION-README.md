# 🔍 RZECZY ZNALEZIONE - HackNation 2025 Submission

## Beta 0.2.0 (v2.0.5)

**Centralna wyszukiwarka rzeczy znalezionych z całej Polski**

---

## 🚀 Quick Start for Referees

### Starting the Application

```bash
# Install dependencies (if not already installed)
npm install

# Start the development server
npm run dev
```

The application will be available at: **http://localhost:3000**

---

## ⚠️ IMPORTANT: Avoiding Cache Issues

### If you encounter cache problems, use one of these methods:

### **Method 1: Clear Cache Page (RECOMMENDED)**
Visit: **http://localhost:3000/clear-cache.html**
- Click "Wyczyść Całą Pamięć Cache"
- Wait for confirmation
- Application will reload automatically

### **Method 2: Hard Refresh**
- **Mac**: `Cmd + Shift + R`
- **Windows/Linux**: `Ctrl + Shift + R`

### **Method 3: DevTools Manual Clear**
1. Open DevTools (`F12` or `Cmd/Ctrl + Shift + I`)
2. Go to **Application** tab
3. Click **Clear site data**
4. Click **Clear site data** button
5. Refresh the page

### **Method 4: Auto Clear (One Command)**
Open this URL to automatically clear cache and reload:
```
http://localhost:3000/clear-cache.html?auto=true
```

---

## 📱 Main Features

### 1. **Public Search Portal** (`/search` or `/public.html`)
- **Multilingual support** (Polish/English)
- Advanced filtering by:
  - Category
  - Voivodeship
  - County
  - Date range
  - Status
- **Three view modes**:
  - Grid view
  - List view
  - **Interactive map** with custom markers
- Real-time statistics

### 2. **Admin Panel** (`/` or `/index.html`)
- Item management (CRUD operations)
- Excel/CSV import
- JSON/CSV export for dane.gov.pl
- Form wizard with validation
- Preview before export

### 3. **Administrator Panel** (`/admin.html`)
- User management
- Role-based permissions (Admin/Official/User)
- Audit log
- System settings

### 4. **Profile Management** (`/profile.html`)
- Personal information
- Password changes
- Language preferences
- Account settings

---

## 🗺️ Map Features (Beta 0.2.0)

### Custom Teardrop Markers
- **Blue** - Stored (available for pickup)
- **Green** - Returned to owner
- **Gray** - Liquidated

### Interactive Elements
- Click markers to see item details
- Animated popup with:
  - Item name and status
  - Category with icon
  - Date found
  - Location
  - "View Details" button

### Smart Legend
- Shows categories with counts
- Status color indicators
- Auto-updates based on search results

### Map Controls
- Scale bar (kilometers)
- Zoom controls
- Auto-fit to markers
- Smooth animations

---

## 🌐 Technology Stack

### Frontend
- **Vanilla JavaScript** (ES6+)
- **Leaflet.js** for maps
- **Font Awesome** icons
- **CSS3** with CSS Variables
- **i18n** multilingual support

### Backend
- **Node.js** + **Express.js**
- **SQLite** with better-sqlite3
- **JWT** authentication
- **bcrypt** password hashing

### PWA Features
- Service Worker (disabled in development)
- Offline support
- Installable app
- Push notifications ready

---

## 🎨 Design System

Based on **dane.gov.pl** government portal design:
- Official Polish government color scheme
- WCAG 2.1 AA accessibility compliance
- Responsive design (mobile-first)
- Modern UI/UX patterns

---

## 👥 User Roles & Permissions

### Administrator
- ✅ Full system access
- ✅ User management
- ✅ System configuration
- ✅ Audit log access
- ✅ All CRUD operations

### Official (Urzędnik)
- ✅ Add/edit items
- ✅ Manage organization data
- ✅ Export to dane.gov.pl
- ✅ View statistics
- ❌ No admin panel access

### User
- ✅ Browse public portal
- ✅ Search items
- ✅ View details
- ❌ No write access

---

## 🔐 Test Accounts

### Admin Account
- **Email**: `admin@example.com`
- **Password**: `admin123`

### Official Account
- **Email**: `official@example.com`
- **Password**: `official123`

### Regular User
- **Email**: `user@example.com`
- **Password**: `user123`

---

## 📊 API Endpoints

### Public
- `GET /api/dane-gov/search` - Search items
- `GET /api/stats` - Get statistics
- `GET /api/health` - Health check
- `GET /api/cache-version` - Cache version

### Authenticated
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Current user
- `GET /api/items` - List items (with filters)
- `POST /api/items` - Create item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Admin Only
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `PUT /api/users/:id/toggle-status` - Activate/deactivate

---

## 🆕 What's New in Beta 0.2.0

### ✨ Features
- **Complete multilingual support** (PL/EN)
- **Enhanced interactive map** with custom markers
- **Map legend** with category counts
- **Improved cache management**
- **Better mobile responsiveness**

### 🐛 Bug Fixes
- Fixed cache issues for development
- Fixed map rendering when switching views
- Fixed translation loading on page refresh
- Improved authentication UI

### 🎨 UI Improvements
- Redesigned map popups
- Better status badges
- Enhanced legend styling
- Smoother animations

---

## 📝 Notes for Referees

### Cache Strategy
- **Development mode**: Network-first (no aggressive caching)
- **Production mode**: Cache-first for static assets
- Service Worker automatically detects localhost

### Browser Recommendations
- ✅ Chrome/Edge (best experience)
- ✅ Firefox
- ✅ Safari
- ⚠️ Clear cache between testing sessions

### Known Limitations
- Mock data for demonstration purposes
- No actual dane.gov.pl API integration
- Sample coordinates for map markers

---

## 📞 Support

For any issues during evaluation:
1. Visit `/clear-cache.html`
2. Check browser console for errors
3. Ensure Node.js v16+ is installed
4. Verify port 3000 is available

---

## 🏆 Project Goals

This project aims to:
1. **Simplify** the process of publishing found items data
2. **Centralize** lost and found information across Poland
3. **Improve** accessibility for citizens searching for lost items
4. **Integrate** with dane.gov.pl open data portal
5. **Standardize** data format for found items nationwide

---

## 📄 License

Created for **HackNation 2025**

© 2025 Otwarte Dane - Kancelaria Prezesa Rady Ministrów

---

## 🙏 Acknowledgments

- HackNation 2025 organizers
- dane.gov.pl team
- OpenStreetMap contributors
- Leaflet.js community

---

**Thank you for reviewing our submission! 🚀**

*If you encounter any issues, please visit /clear-cache.html first!*
