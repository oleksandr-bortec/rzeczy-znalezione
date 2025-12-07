# 🚀 START HERE - Quick Test Guide

## For HackNation Referees and Testers

---

## ⚡ 3-Step Setup

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Start Server
```bash
npm run dev
```

### 3️⃣ Open Browser
```
http://localhost:3000
```

✅ **Done! The app is running.**

---

## 🔑 Login Credentials

### 👑 Administrator (Full Access)
```
Email:    admin@example.com
Password: admin123
```
**Can do:** Everything - user management, all features

### 👔 Official/Urzędnik (Data Entry)
```
Email:    official@example.com
Password: official123
```
**Can do:** Add items, export data, view statistics

### 👤 Regular User (View Only)
```
Email:    user@example.com
Password: user123
```
**Can do:** Search and view items only

---

## 🧹 How to Clear Cache

### ⚠️ If you see old/outdated content:

**Method 1 - Easiest (Recommended):**
1. Visit: **http://localhost:3000/clear-cache.html**
2. Click the big button: **"Wyczyść Całą Pamięć Cache"**
3. Wait 2 seconds → Automatic reload
4. ✅ Done!

**Method 2 - Keyboard Shortcut:**
- **Mac:** Press `Cmd + Shift + R`
- **Windows/Linux:** Press `Ctrl + Shift + R`

**Method 3 - Auto Clear (No Clicks):**
- Visit: **http://localhost:3000/clear-cache.html?auto=true**
- Cache clears automatically

---

## 🌐 Pages to Test

| What | URL | Login Required |
|------|-----|----------------|
| 🏠 Admin Panel | http://localhost:3000 | ✅ Yes (any account) |
| 🔍 Public Search + Map | http://localhost:3000/search | ❌ No |
| 👥 User Management | http://localhost:3000/admin.html | ✅ Admin only |
| 👤 Profile Settings | http://localhost:3000/profile.html | ✅ Yes (any account) |
| 🧹 Clear Cache Tool | http://localhost:3000/clear-cache.html | ❌ No |

---

## ✨ Key Features to Try

### 1. **Public Search** (No login needed)
- Visit: http://localhost:3000/search
- Try searching for items
- Switch to **Map View** (top right)
- Click on colored markers
- Switch language: **PL** ↔ **EN** (top right)

### 2. **Admin Panel** (Login required)
- Login with any account
- Click **"Dodaj przedmiot"** (Add item)
- Fill the form
- Preview and export to JSON

### 3. **Interactive Map**
- Go to: http://localhost:3000/search
- Click **Map icon** (🗺️) in view toggle
- See custom colored markers:
  - 🔵 Blue = Available
  - 🟢 Green = Returned
  - ⚪ Gray = Liquidated
- Click markers for details
- Check the legend (bottom right)

### 4. **Multilingual** (All Pages)
- Look for **PL** / **EN** buttons (top right)
- Click to switch language
- Everything translates instantly

### 5. **User Management** (Admin only)
- Login as: `admin@example.com` / `admin123`
- Visit: http://localhost:3000/admin.html
- Click **"Dodaj użytkownika"** (Add user)
- Create/edit users
- Change roles

---

## 🐛 Troubleshooting

### "I see old/cached content"
➡️ **Solution:** http://localhost:3000/clear-cache.html

### "Port 3000 is already in use"
➡️ **Solution:**
```bash
PORT=3001 npm run dev
```
Then visit: http://localhost:3001

### "Cannot find module X"
➡️ **Solution:**
```bash
npm install
```

### "Database error"
➡️ **Solution:** Delete database and restart:
```bash
rm data/rzeczy-znalezione.db
npm run dev
```

---

## 📱 Mobile Testing

The app is fully responsive! Test on:
- Desktop browser
- Mobile browser (Chrome/Safari)
- Tablet

---

## 🎯 Quick Test Checklist

- [ ] Setup: `npm install` → `npm run dev`
- [ ] Login with admin account
- [ ] View public search page
- [ ] Try the interactive map
- [ ] Switch language PL ↔ EN
- [ ] Add a new item
- [ ] Clear cache (if needed)

---

## 💡 Pro Tips

1. **Start with public search** - No login needed, shows the map
2. **Use admin account** - See all features
3. **Clear cache first** - If something looks old
4. **Check the map** - Most impressive feature!
5. **Try both languages** - PL and EN work everywhere

---

## 📞 Need Help?

1. Check `HACKNATION-README.md` - Full documentation
2. Check `SETUP.md` - Detailed setup guide
3. Visit `/clear-cache.html` - Fix most issues
4. Check browser console (F12) - See errors

---

## ⏱️ Estimated Testing Time

- **Quick test:** 5 minutes
- **Full features:** 15-20 minutes
- **Deep dive:** 30+ minutes

---

## 🏆 HackNation 2025

**Project:** Rzeczy Znalezione (Lost & Found Portal)
**Version:** Beta 0.2.0
**Repository:** https://github.com/oleksandr-bortec/rzeczy-znalezione

---

**Happy Testing! 🚀**

*Any issues? → http://localhost:3000/clear-cache.html*
