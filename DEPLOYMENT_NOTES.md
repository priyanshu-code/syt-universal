# Solve Your Trip - Travel Creator Suite
## Deployment Guide

### ✅ What's Been Set Up

**Unified Server Architecture:**
- Landing page at `/` with links to both apps
- Universal Itinerary Creator at `/universal/`
- Maldives Quote Creator at `/maldives/`
- Shared backend API for saving/loading data

**Features Added to Maldives App:**
- 💾 **Save Button** - Save quotes to server with shareable links
- 📋 **Copy Button** - Copy quote summary for WhatsApp/messaging
- 🔗 **Preview Link** - Generate and share client preview links
- 📚 **Saved Quotes Sidebar** - Browse, load, and delete saved quotes

**API Endpoints:**
```
POST   /api/quotes           - Save a quote
GET    /api/quotes           - List all saved quotes
GET    /api/quotes/:id       - Get a specific quote
DELETE /api/quotes/:id       - Delete a quote

POST   /api/itineraries      - Save an itinerary
GET    /api/itineraries      - List all itineraries
GET    /api/itineraries/:id  - Get a specific itinerary
DELETE /api/itineraries/:id  - Delete an itinerary
```

### 🚀 To Deploy to Render

1. **Push to Git:**
   ```bash
   git add .
   git commit -m "Integrate Maldives and Universal apps with unified server"
   git push origin main
   ```

2. **In Render Dashboard:**
   - Go to your service
   - The server will auto-rebuild and redeploy
   - Watch logs to confirm both apps load correctly

3. **Test the Live Apps:**
   - Visit: `https://your-render-url.onrender.com/`
   - You'll see the landing page with links to both apps
   - Test saving, copying, and preview features on both apps

### 📁 Project Structure

```
universal-package-creator/
├── server.js                      # Express server with all APIs
├── package.json                   # Dependencies
├── public/
│   ├── index.html                # Landing page
│   ├── universal/                # Universal Itinerary Creator
│   │   ├── index.html
│   │   ├── app.js
│   │   ├── style.css
│   │   ├── template.html
│   │   └── logo.jpg
│   ├── maldives/                 # Maldives Quote Creator
│   │   ├── index.html
│   │   ├── app.js                # (Updated with API integration)
│   │   ├── style.css             # (Updated with sidebar styles)
│   │   └── logo.jpg
│   ├── shared/                   # Compiled universal itineraries
│   └── quotes-shared/            # Compiled maldives quotes
├── itineraries/                  # Stored universal drafts
├── quotes/                       # Stored maldives drafts
```

### 🔧 Key Updates Made

**server.js:**
- Added `QUOTES_DIR` and `QUOTES_SHARED_DIR` directories
- Added `/universal` and `/maldives` static routes
- Added `compileMaldivesHTML()` helper function
- Added `/api/quotes` endpoints (POST, GET, DELETE)
- Updated console output with both app links

**public/index.html:**
- Created new landing/home page with app links
- Professional design with gradient background

**public/maldives/index.html:**
- Added Save, Copy, and Preview buttons
- Added Saved Quotes sidebar

**public/maldives/style.css:**
- Added `.saved-quotes-sidebar` styles
- Updated `.workspace-container` grid to 3 columns
- Added responsive adjustments for mobile

**public/maldives/app.js:**
- Added `saveQuoteToAPI()` function
- Added `loadSavedQuotes()` function
- Added `loadQuoteFromAPI()` function
- Added `deleteQuoteFromAPI()` function
- Added `copyWhatsAppText()` function
- Added `openLivePreview()` function
- Added `initializeSidebar()` to load quotes on startup

**public/universal/app.js:**
- Updated all `/logo.jpg` references to `/universal/logo.jpg`

### 🐛 Troubleshooting

**Maldives sidebar not showing?**
- Check browser console for errors
- Ensure `/api/quotes` endpoint is working
- Try clearing browser cache and reloading

**Save button not working?**
- Verify server is running with `npm start`
- Check network tab in DevTools for API calls
- Ensure you're not in offline mode

**Preview link not generating?**
- Save the quote first
- Wait for success message
- The preview URL should be automatically copied

### 📧 Support

For issues or questions, contact: tech@solveyourtrip.com
