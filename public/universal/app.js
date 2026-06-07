// Global State for the current editing itinerary
let isOnline = false;

let currentItinerary = {
    id: '',
    clientName: '',
    destination: '',
    refCodes: '',
    startDate: '',
    endDate: '',
    paxCount: '',
    paxDetails: '',
    subTitle: '',
    companyDetails: {
        name: 'SOLVE YOUR TRIP PRIVATE LIMITED',
        address: 'A-62 F/F OLD NO A 32/A Pl, NO 492 C/A GNO 5 Vinod N, East Delhi, Delhi - 110091',
        phone: '+91 6280975235',
        email: 'bookings@solveyourtrip.com',
        logoUrl: '/universal/logo.jpg'
    },
    pricing: {
        currencySymbol: 'INR',
        totalCost: '',
        totalCostLabel: 'Total Cost (With Visa)',
        perPersonCost: '',
        perPersonCostLabel: 'Per Person Cost (With Visa)',
        showHotelCosts: false,
        note: 'flights prices are dynamic the cost is as per rates today.'
    },
    flights: {
        title: 'Flight Itinerary',
        note: '',
        warning: '',
        legs: []
    },
    hotels: [],
    days: [],
    inclusions: [],
    exclusions: [],
    terms: []
};

// Default Company Details Template
const DEFAULT_COMPANY_DETAILS = {
    name: 'SOLVE YOUR TRIP PRIVATE LIMITED',
    address: 'A-62 F/F OLD NO A 32/A Pl, NO 492 C/A GNO 5 Vinod N, East Delhi, Delhi - 110091',
    phone: '+91 6280975235',
    email: 'bookings@solveyourtrip.com',
    logoUrl: '/logo.jpg'
};

// DOM Elements
const doc = (id) => document.getElementById(id);

// Load on Startup
document.addEventListener('DOMContentLoaded', async () => {
    setupEventListeners();
    await checkConnectionStatus();
    resetFormToNew();
});

// Check if Express backend is running
async function checkConnectionStatus() {
    const pill = doc('status-pill');
    try {
        const res = await fetch('/api/itineraries');
        if (res.ok) {
            isOnline = true;
            pill.textContent = 'Online Mode';
            pill.className = 'status-pill online';
            await fetchItineraryList();
        } else {
            throw new Error('Not running Express');
        }
    } catch (err) {
        isOnline = false;
        pill.textContent = 'Offline Mode (Local)';
        pill.className = 'status-pill offline';
        loadOfflineItineraryList();
    }
}

// Event Listeners Configuration
function setupEventListeners() {
    // Top actions
    doc('btn-new-itinerary').addEventListener('click', resetFormToNew);
    doc('btn-save').addEventListener('click', saveItinerary);
    doc('btn-save-bottom').addEventListener('click', (e) => {
        e.preventDefault();
        saveItinerary();
    });
    doc('btn-view-live').addEventListener('click', openLiveView);
    doc('btn-copy-wa').addEventListener('click', copyWhatsAppText);
    doc('btn-clone').addEventListener('click', cloneCurrentItinerary);
    
    // Search input
    doc('search-input').addEventListener('input', filterItineraries);
    
    // Logo Upload
    doc('logo-file').addEventListener('change', uploadLogo);
    
    // Dynamic lists add triggers
    doc('btn-add-flight').addEventListener('click', () => {
        addFlightLeg({ type: 'Outbound', route: '', carrier: '', originAirport: '', originDate: '', destAirport: '', destDate: '', duration: 'Direct' });
    });
    doc('btn-add-hotel').addEventListener('click', () => {
        addHotel({ name: '', checkIn: '', checkOut: '', nights: 1, rooms: [{ name: '', price: '' }], inclusions: '🍳 Breakfast Included', cancellation: 'Free Cancel before check-in' });
    });
    
    // Date changes trigger Day Planner sync
    doc('startDate').addEventListener('change', () => syncTimelineDays(false));
    doc('endDate').addEventListener('change', () => syncTimelineDays(false));
}

// REST: Get list of itineraries (Online Mode)
async function fetchItineraryList() {
    try {
        const res = await fetch('/api/itineraries');
        const list = await res.json();
        renderSidebarList(list);
    } catch (err) {
        console.error('Error fetching itineraries:', err);
    }
}

// LocalStorage: Get list of itineraries (Offline Mode)
function loadOfflineItineraryList() {
    const list = getOfflineData();
    const formattedList = list.map(item => ({
        id: item.id,
        clientName: item.clientName || 'Untitled Client',
        destination: item.destination || 'Universal Destination',
        startDate: item.startDate || '',
        endDate: item.endDate || '',
        totalCost: item.pricing?.totalCost || 'N/A',
        lastUpdated: item.lastUpdated || new Date().toISOString()
    }));
    renderSidebarList(formattedList);
}

// UI: Render sidebar lists
function renderSidebarList(list) {
    const container = doc('itinerary-list');
    container.innerHTML = '';
    
    if (!list || list.length === 0) {
        container.innerHTML = '<div class="empty-state">No quotes created yet. Create one!</div>';
        return;
    }
    
    list.forEach(item => {
        const div = document.createElement('div');
        div.className = `itinerary-item ${currentItinerary.id === item.id ? 'active' : ''}`;
        div.dataset.id = item.id;
        
        // Date formatting for summary
        const dateRange = item.startDate && item.endDate 
            ? `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`
            : 'No Dates Set';
            
        div.innerHTML = `
            <h4>${item.clientName}</h4>
            <p>📍 ${item.destination}</p>
            <p>📅 ${dateRange}</p>
            <div class="item-meta">
                <span>💰 ${item.totalCost}</span>
                <span>${new Date(item.lastUpdated).toLocaleDateString()}</span>
            </div>
            <button class="btn-duplicate-itinerary" title="Duplicate Quote">📄</button>
            <button class="btn-delete-itinerary" title="Delete Quote">✕</button>
        `;
        
        // Click item to load
        div.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete-itinerary')) {
                e.stopPropagation();
                deleteItinerary(item.id);
            } else if (e.target.classList.contains('btn-duplicate-itinerary')) {
                e.stopPropagation();
                duplicateItinerary(item.id);
            } else {
                loadItinerary(item.id);
            }
        });
        
        container.appendChild(div);
    });
}

// UI Filter
function filterItineraries(e) {
    const val = e.target.value.toLowerCase();
    const items = document.querySelectorAll('.itinerary-item');
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(val)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Load specific Itinerary (Unified)
async function loadItinerary(id) {
    if (isOnline) {
        try {
            const res = await fetch(`/api/itineraries/${id}`);
            if (!res.ok) throw new Error('Quote not found');
            const data = await res.json();
            currentItinerary = data;
            populateForm(data);
        } catch (err) {
            alert('Failed to load itinerary: ' + err.message);
            return;
        }
    } else {
        const list = getOfflineData();
        const data = list.find(item => item.id === id);
        if (data) {
            currentItinerary = data;
            populateForm(data);
        } else {
            alert('Itinerary not found in local browser storage.');
            return;
        }
    }
    
    // Highlight active item
    document.querySelectorAll('.itinerary-item').forEach(el => {
        el.classList.toggle('active', el.dataset.id === id);
    });
    
    // Enable actions
    doc('btn-view-live').disabled = false;
    doc('btn-copy-wa').disabled = false;
    doc('btn-clone').disabled = false;
    doc('editor-action-title').innerHTML = `Editing: ${currentItinerary.clientName} <span id="status-pill" class="status-pill ${isOnline ? 'online' : 'offline'}">${isOnline ? 'Online Mode' : 'Offline Mode (Local)'}</span>`;
}

// Duplicate Itinerary logic
async function duplicateItinerary(id) {
    let sourceData = null;
    if (isOnline) {
        try {
            const res = await fetch(`/api/itineraries/${id}`);
            if (!res.ok) throw new Error('Quote not found');
            sourceData = await res.json();
        } catch (err) {
            alert('Failed to load itinerary to duplicate: ' + err.message);
            return;
        }
    } else {
        const list = getOfflineData();
        sourceData = list.find(item => item.id === id);
    }
    
    if (!sourceData) {
        alert('Failed to find itinerary data.');
        return;
    }
    
    // Create duplicated object
    const duplicated = JSON.parse(JSON.stringify(sourceData));
    duplicated.id = ''; // Clear ID so it saves as new
    duplicated.clientName = ''; // Clear customer name
    duplicated.lastUpdated = new Date().toISOString();
    
    // Load into state
    currentItinerary = duplicated;
    populateForm(duplicated);
    
    // Disable actions
    doc('btn-view-live').disabled = true;
    doc('btn-copy-wa').disabled = true;
    doc('btn-clone').disabled = true;
    doc('editor-action-title').innerHTML = `Duplicating Quote <span id="status-pill" class="status-pill ${isOnline ? 'online' : 'offline'}">${isOnline ? 'Online Mode' : 'Offline Mode (Local)'}</span>`;
    
    showToast('Quote duplicated! Enter a new Client Name and save.');
    
    // Focus client name field
    doc('clientName').focus();
}

// Clone currently edited itinerary state as a new quote
async function cloneCurrentItinerary() {
    // Read current form inputs into state to capture all modifications
    readFormIntoState();
    
    // Create deep copy
    const cloned = JSON.parse(JSON.stringify(currentItinerary));
    cloned.id = ''; // Clear ID so it saves as new
    cloned.clientName = cloned.clientName ? `${cloned.clientName} (Copy)` : 'Untitled Client (Copy)';
    cloned.lastUpdated = new Date().toISOString();
    
    // Load clone into active state
    currentItinerary = cloned;
    populateForm(cloned);
    
    // Save immediately
    await saveItinerary();
    
    showToast('Quote cloned successfully!');
}

// Delete Itinerary (Unified)
async function deleteItinerary(id) {
    if (!confirm('Are you sure you want to delete this itinerary? This action cannot be undone.')) {
        return;
    }
    if (isOnline) {
        try {
            const res = await fetch(`/api/itineraries/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('Itinerary deleted from server!');
                if (currentItinerary.id === id) resetFormToNew();
                fetchItineraryList();
            } else {
                const err = await res.json();
                alert('Failed to delete: ' + err.error);
            }
        } catch (err) {
            console.error('Delete error:', err);
        }
    } else {
        const list = getOfflineData();
        const newList = list.filter(item => item.id !== id);
        saveOfflineData(newList);
        showToast('Itinerary deleted from local storage!');
        if (currentItinerary.id === id) resetFormToNew();
        loadOfflineItineraryList();
    }
}

// Logo upload helper (Unified Base64)
async function uploadLogo(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(evt) {
        currentItinerary.companyDetails.logoUrl = evt.target.result;
        doc('logo-preview').src = evt.target.result;
        showToast('Logo loaded as Base64!');
    };
    reader.onerror = function() {
        alert('Failed to read file.');
    };
    reader.readAsDataURL(file);
}

// Reset form
function resetFormToNew() {
    currentItinerary = {
        id: '',
        clientName: '',
        destination: '',
        refCodes: '',
        startDate: '',
        endDate: '',
        paxCount: '',
        paxDetails: '',
        subTitle: '',
        companyDetails: { ...DEFAULT_COMPANY_DETAILS },
        pricing: {
            currencySymbol: 'INR',
            totalCost: '',
            totalCostLabel: 'Total Cost (With Visa)',
            perPersonCost: '',
            perPersonCostLabel: 'Per Person Cost (With Visa)',
            showHotelCosts: false,
            note: 'flights prices are dynamic the cost is as per rates today.'
        },
        flights: {
            title: 'Flight Itinerary',
            note: '',
            warning: '',
            legs: []
        },
        hotels: [],
        days: [],
        inclusions: [],
        exclusions: [],
        terms: []
    };
    
    populateForm(currentItinerary);
    
    // Highlight list active removal
    document.querySelectorAll('.itinerary-item').forEach(el => el.classList.remove('active'));
    
    doc('btn-view-live').disabled = true;
    doc('btn-copy-wa').disabled = true;
    doc('btn-clone').disabled = true;
    doc('editor-action-title').innerHTML = `Create Custom Quote <span id="status-pill" class="status-pill ${isOnline ? 'online' : 'offline'}">${isOnline ? 'Online Mode' : 'Offline Mode (Local)'}</span>`;
}

// Populate UI form from state
function populateForm(data) {
    doc('clientName').value = data.clientName || '';
    doc('destination').value = data.destination || '';
    doc('refCodes').value = data.refCodes || '';
    doc('startDate').value = data.startDate || '';
    doc('endDate').value = data.endDate || '';
    doc('paxCount').value = data.paxCount || '';
    doc('paxDetails').value = data.paxDetails || '';
    doc('subTitle').value = data.subTitle || '';
    
    // Branding
    const brand = data.companyDetails || DEFAULT_COMPANY_DETAILS;
    doc('companyName').value = brand.name || '';
    doc('companyPhone').value = brand.phone || '';
    doc('companyEmail').value = brand.email || '';
    doc('companyAddress').value = brand.address || '';
    doc('logo-preview').src = brand.logoUrl || '/logo.jpg';
    
    // Pricing
    const pricing = data.pricing || {};
    doc('currencySymbol').value = pricing.currencySymbol || 'INR';
    doc('totalCost').value = pricing.totalCost || '';
    doc('totalCostLabel').value = pricing.totalCostLabel || 'Total Cost (With Visa)';
    doc('perPersonCost').value = pricing.perPersonCost || '';
    doc('perPersonCostLabel').value = pricing.perPersonCostLabel || 'Per Person Cost (With Visa)';
    doc('showHotelCosts').checked = pricing.showHotelCosts || false;
    doc('pricingNote').value = pricing.note || 'flights prices are dynamic the cost is as per rates today.';
    
    // Flights
    const fl = data.flights || {};
    doc('flightsTitle').value = fl.title || 'Flight Itinerary';
    doc('flightsNote').value = fl.note || '';
    
    // Clear and redraw flight legs UI
    const flightsContainer = doc('flights-container');
    flightsContainer.innerHTML = '';
    if (fl.legs && fl.legs.length > 0) {
        fl.legs.forEach(leg => addFlightLeg(leg));
    } else {
        flightsContainer.innerHTML = '<div class="empty-sub-state">No flights added yet. Click "+ Add Flight Leg".</div>';
    }
    
    // Clear and redraw accommodations UI
    const hotelsContainer = doc('hotels-container');
    hotelsContainer.innerHTML = '';
    if (data.hotels && data.hotels.length > 0) {
        data.hotels.forEach(hotel => addHotel(hotel));
    } else {
        hotelsContainer.innerHTML = '<div class="empty-sub-state">No accommodations added yet. Click "+ Add Hotel".</div>';
    }
    
    // Inclusions, Exclusions, Terms
    doc('inclusionsText').value = (data.inclusions || []).join('\n');
    doc('exclusionsText').value = (data.exclusions || []).join('\n');
    doc('termsText').value = (data.terms || []).join('\n');
    
    // Load Timeline Days
    syncTimelineDays(true);
}

// Generate state from form data inputs
function readFormIntoState() {
    currentItinerary.clientName = doc('clientName').value;
    currentItinerary.destination = doc('destination').value;
    currentItinerary.refCodes = doc('refCodes').value;
    currentItinerary.startDate = doc('startDate').value;
    currentItinerary.endDate = doc('endDate').value;
    currentItinerary.paxCount = doc('paxCount').value;
    currentItinerary.paxDetails = doc('paxDetails').value;
    currentItinerary.subTitle = doc('subTitle').value;
    
    // Company details logoUrl is updated dynamically on upload
    currentItinerary.companyDetails = {
        name: doc('companyName').value,
        address: doc('companyAddress').value,
        phone: doc('companyPhone').value,
        email: doc('companyEmail').value,
        logoUrl: doc('logo-preview').getAttribute('src')
    };
    
    currentItinerary.pricing = {
        currencySymbol: doc('currencySymbol').value || 'INR',
        totalCost: doc('totalCost').value,
        totalCostLabel: doc('totalCostLabel').value,
        perPersonCost: doc('perPersonCost').value,
        perPersonCostLabel: doc('perPersonCostLabel').value,
        showHotelCosts: doc('showHotelCosts').checked,
        note: doc('pricingNote').value
    };
    
    // Flights Reading
    const legCards = document.querySelectorAll('.flight-leg-card');
    const legs = [];
    legCards.forEach(card => {
        legs.push({
            type: card.querySelector('.leg-type').value,
            route: card.querySelector('.leg-route').value,
            carrier: card.querySelector('.leg-carrier').value,
            originAirport: card.querySelector('.leg-originAirport').value,
            originDate: card.querySelector('.leg-originDate').value,
            destAirport: card.querySelector('.leg-destAirport').value,
            destDate: card.querySelector('.leg-destDate').value,
            duration: card.querySelector('.leg-duration').value
        });
    });
    currentItinerary.flights = {
        title: doc('flightsTitle').value || 'Flight Itinerary',
        note: doc('flightsNote').value,
        warning: doc('pricingNote').value,
        legs: legs
    };
    
    // Hotels Reading
    const hotelCards = document.querySelectorAll('.hotel-card-item');
    const hotels = [];
    hotelCards.forEach(card => {
        const roomRows = card.querySelectorAll('.room-config-row');
        const rooms = [];
        roomRows.forEach(row => {
            const imgPreview = row.querySelector('.img-preview');
            const imageSrc = imgPreview && imgPreview.src && imgPreview.src.startsWith('data:image') ? imgPreview.src : '';
            rooms.push({
                name: row.querySelector('.room-name-field').value,
                price: row.querySelector('.room-price-field')?.value || '',
                image: imageSrc
            });
        });
        
        hotels.push({
            name: card.querySelector('.hotel-name-field').value,
            checkIn: card.querySelector('.hotel-in-field').value,
            checkOut: card.querySelector('.hotel-out-field').value,
            nights: parseInt(card.querySelector('.hotel-nights-field').value) || 1,
            inclusions: card.querySelector('.hotel-inc-field').value,
            cancellation: card.querySelector('.hotel-canc-field').value,
            rooms: rooms
        });
    });
    currentItinerary.hotels = hotels;
    
    // Day-by-Day Timeline Reading
    const dayCards = document.querySelectorAll('.day-editor-card');
    const days = [];
    dayCards.forEach(card => {
        const index = parseInt(card.dataset.dayIndex);
        const dayNum = parseInt(card.dataset.dayNum);
        const hotelText = card.querySelector('.day-hotel-text').value;
        
        const activityRows = card.querySelectorAll('.activity-editor-row');
        const activities = [];
        activityRows.forEach(row => {
            const type = row.querySelector('.act-type-field').value;
            const cruiseImages = [];
            if (type === 'cruise') {
                row.querySelectorAll('.cruise-gallery-thumbnail img').forEach(img => {
                    cruiseImages.push(img.src);
                });
            }
            
            activities.push({
                type: type,
                title: row.querySelector('.act-title-field').value,
                desc: row.querySelector('.act-desc-field').value,
                roomImages: cruiseImages
            });
        });
        
        days.push({
            dayNum: dayNum,
            hotelText: hotelText,
            activities: activities
        });
    });
    currentItinerary.days = days;
    
    // Lists text areas parsing
    currentItinerary.inclusions = doc('inclusionsText').value.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    currentItinerary.exclusions = doc('exclusionsText').value.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    currentItinerary.terms = doc('termsText').value.split('\n').map(l => l.trim()).filter(l => l.length > 0);
}

// REST/Local: Save Itinerary & Re-compile Itinerary HTML (Unified)
async function saveItinerary() {
    // Validate inputs
    if (!doc('clientName').value || !doc('destination').value || !doc('startDate').value || !doc('endDate').value || !doc('totalCost').value) {
        alert('Please fill out all required fields marked in forms (Client Name, Destination, Dates, Total Cost)');
        return;
    }
    
    // Accidental Overwrite Safeguard
    if (currentItinerary.id && currentItinerary.clientName) {
        const inputName = doc('clientName').value.trim();
        const loadedName = currentItinerary.clientName.trim();
        if (inputName !== loadedName) {
            const confirmSaveAsNew = confirm(`You have changed the Client Name from "${loadedName}" to "${inputName}".\n\nClick "OK" to save this as a NEW quote (keeping the original "${loadedName}" intact).\nClick "Cancel" to overwrite/rename the current quote.`);
            if (confirmSaveAsNew) {
                currentItinerary.id = ''; // Clear ID so it saves as new
            }
        }
    }
    
    readFormIntoState();
    currentItinerary.lastUpdated = new Date().toISOString();
    
    if (isOnline) {
        try {
            const response = await fetch('/api/itineraries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentItinerary)
            });
            
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Server error saving');
            }
            
            const result = await response.json();
            currentItinerary.id = result.id;
            
            showToast('Quote Saved & HTML Compiled!');
            fetchItineraryList();
            
            doc('btn-view-live').disabled = false;
            doc('btn-copy-wa').disabled = false;
            doc('btn-clone').disabled = false;
            doc('editor-action-title').innerHTML = `Editing: ${currentItinerary.clientName} <span id="status-pill" class="status-pill online">Online Mode</span>`;
        } catch (err) {
            alert('Error saving itinerary: ' + err.message);
        }
    } else {
        // Offline Saving logic
        if (!currentItinerary.id) {
            const cleanDest = (currentItinerary.destination || 'trip')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            currentItinerary.id = `${cleanDest || 'trip'}-${Date.now()}`;
        }
        
        const list = getOfflineData();
        const existingIdx = list.findIndex(item => item.id === currentItinerary.id);
        if (existingIdx !== -1) {
            list[existingIdx] = currentItinerary;
        } else {
            list.unshift(currentItinerary);
        }
        saveOfflineData(list);
        
        // Compile static HTML locally and trigger file download
        const compiledHtml = compileStaticHTMLOffline(currentItinerary);
        triggerHTMLDownload(currentItinerary, compiledHtml);
        
        showToast('Saved to browser storage! HTML file downloading.');
        loadOfflineItineraryList();
        
        doc('btn-view-live').disabled = false;
        doc('btn-copy-wa').disabled = false;
        doc('btn-clone').disabled = false;
        doc('editor-action-title').innerHTML = `Editing: ${currentItinerary.clientName} <span id="status-pill" class="status-pill offline">Offline Mode (Local)</span>`;
    }
}

// Action: Open HTML file (Unified)
function openLiveView() {
    if (!currentItinerary.id) return;
    if (isOnline) {
        window.open(`/shared/${currentItinerary.id}.html`, '_blank');
    } else {
        // In offline mode, compile and open a temporary blob URL in a new tab for previewing
        const compiledHtml = compileStaticHTMLOffline(currentItinerary);
        const blob = new Blob([compiledHtml], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }
}

// Action: Copy Whatsapp message
function copyWhatsAppText() {
    readFormIntoState();
    const data = currentItinerary;
    const currency = data.pricing?.currencySymbol || 'INR';
    
    let text = `✈️ *${data.companyDetails?.name || 'SOLVE YOUR TRIP'} - PREMIUM QUOTE*\n`;
    text += `========================================\n\n`;
    text += `👤 *Client Name:* ${data.clientName || 'Valued Guest'}\n`;
    text += `📍 *Destination:* ${data.destination || 'Selected Destination'}\n`;
    
    if (data.startDate && data.endDate) {
        text += `📅 *Dates:* ${formatDate(data.startDate)} to ${formatDate(data.endDate)}\n`;
    }
    if (data.paxCount) {
        text += `👥 *Guests:* ${data.paxCount}\n`;
    }
    text += `\n💰 *Package Cost:* \n`;
    text += `• *${data.pricing?.totalCostLabel || 'Total cost'}:* ${currency} ${data.pricing?.totalCost || 'N/A'}\n`;
    if (data.pricing?.perPersonCost) {
        text += `• *${data.pricing?.perPersonCostLabel || 'Per Person cost'}:* ${currency} ${data.pricing?.perPersonCost}\n`;
    }
    
    if (data.hotels && data.hotels.length > 0) {
        text += `\n🏨 *Hotel Accommodation Summary:*\n`;
        data.hotels.forEach(h => {
            text += `• *${h.name}* (${h.nights} Night${h.nights !== 1 ? 's' : ''})\n`;
            if (h.rooms && h.rooms.length > 0) {
                h.rooms.forEach(r => {
                    text += `  - ${r.name || r}\n`;
                });
            }
        });
    }

    if (data.days && data.days.length > 0) {
        text += `\n📋 *Day-by-Day Outline Itinerary:*\n`;
        let baseDate = data.startDate ? new Date(data.startDate) : null;
        
        data.days.forEach((day, idx) => {
            let dayDateText = '';
            if (baseDate) {
                const currentDayDate = new Date(baseDate);
                currentDayDate.setDate(baseDate.getDate() + idx);
                const options = { day: '2-digit', month: 'short' };
                dayDateText = ` (${currentDayDate.toLocaleDateString('en-GB', options)})`;
            }
            text += `*Day ${day.dayNum}${dayDateText}:*\n`;
            if (day.activities && day.activities.length > 0) {
                day.activities.forEach(a => {
                    let icon = '•';
                    const t = a.type.toLowerCase();
                    if (t === 'flight') icon = '✈️';
                    else if (t === 'hotel') icon = '🏨';
                    else if (t === 'transfer') icon = '🚗';
                    else if (t === 'sic' || t === 'private' || t === 'tickets') icon = '🎟️';
                    else if (t === 'meal') icon = '🍳';
                    else if (t === 'visa') icon = '🛂';
                    else if (t === 'sim') icon = '📱';
                    else if (t === 'insurance') icon = '🛡️';
                    text += `  ${icon} ${a.title}\n`;
                });
            } else {
                text += `  🌴 Leisure day / Self-exploration.\n`;
            }
        });
    }
    
    // Add share links
    if (isOnline) {
        const shareUrl = `${window.location.origin}/shared/${data.id}.html`;
        text += `\n🌐 *Detailed Online Itinerary Link:*\n${shareUrl}\n`;
    }
    
    if (data.pricing?.note) {
        text += `\n⚠️ _Note: ${data.pricing.note}_\n`;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        showToast('WhatsApp summary copied!');
    }).catch(err => {
        alert('Failed to copy text: ' + err);
    });
}

// LocalStorage Helper wrappers
function getOfflineData() {
    try {
        const raw = localStorage.getItem('travel_itineraries');
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveOfflineData(arr) {
    try {
        localStorage.setItem('travel_itineraries', JSON.stringify(arr));
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
    }
}

// File Download compiler in Offline Mode
function triggerHTMLDownload(itineraryData, htmlContent) {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const clientClean = (itineraryData.clientName || 'quote').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const destClean = (itineraryData.destination || 'trip').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const fileName = `itinerary-${clientClean}-${destClean}.html`;
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Offline compilation - wraps state inside a self-contained window.itineraryData injection
function compileStaticHTMLOffline(data) {
    // In Standalone mode, we load the page, but we must inject the actual base template.
    // The base template will be fetched from server if available (e.g. they run index.html locally but server is off), 
    // or we reconstruct it. Let's try to get template.html from disk by generating it.
    // Since template.html and index.html are in the same folder, if opened under file://, we might not be able to fetch template.html.
    // So we define a fallback engine inside app.js itself by reconstructing the base HTML framework.
    // To keep it 100% accurate, we can load a text string representing template.html.
    
    // We define a skeleton of template.html that is identical:
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Travel Quote | ${data.destination || 'Custom'} Tour</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #0f172a;
            --accent: #ca8a04;
            --bg-color: #f8fafc;
            --card-bg: #ffffff;
            --text-main: #334155;
            --text-muted: #64748b;
            --border: #e2e8f0;
            --primary-light: #e0e7ff;
            --accent-light: #fef3c7;
        }
        * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        body { font-family: 'Outfit', sans-serif; color: var(--text-main); background-color: var(--bg-color); margin: 0; padding: 0; line-height: 1.6; }
        .container { max-width: 900px; margin: 40px auto; background: var(--card-bg); box-shadow: 0 20px 40px rgba(0,0,0,0.06); padding: 50px; border-radius: 16px; }
        .header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 25px; border-bottom: 2px solid var(--primary); margin-bottom: 30px; }
        .logo-container img { max-height: 70px; object-fit: contain; }
        .company-details { text-align: right; font-size: 13px; color: var(--text-muted); max-width: 380px; }
        .company-details strong { color: var(--primary); font-size: 16px; }
        .hero { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, var(--primary) 0%, #1e293b 100%); color: white; padding: 30px 40px; border-radius: 12px; margin-bottom: 40px; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.12); }
        .hero-left h1 { margin: 0 0 5px 0; font-size: 32px; font-weight: 800; color: white; letter-spacing: -0.5px; }
        .hero-left p { margin: 0; font-size: 16px; color: #cbd5e1; }
        .hero-right { text-align: right; }
        .hero-right .date { font-size: 18px; font-weight: 600; color: #f59e0b; margin-bottom: 5px; }
        .hero-right .code { font-size: 12px; color: #94a3b8; }
        .pricing-section { display: flex; justify-content: center; gap: 20px; margin-bottom: 40px; flex-wrap: wrap; }
        .price-card { background: #fffbeb; border: 1px solid #fde68a; padding: 24px; border-radius: 12px; text-align: center; flex: 1; min-width: 250px; max-width: 380px; }
        .price-card.secondary { background: #f0fdf4; border-color: #bbf7d0; }
        .price-card .label { font-size: 13px; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .price-card.secondary .label { color: #16a34a; }
        .price-card .amount { font-size: 32px; font-weight: 800; color: var(--primary); margin: 5px 0; }
        .price-card.secondary .amount { color: #16a34a; }
        .price-card .guests { font-size: 13px; color: var(--text-muted); margin-top: 6px; }
        .section-title { font-size: 22px; font-weight: 800; color: var(--primary); margin-top: 40px; margin-bottom: 20px; display: flex; align-items: center; gap: 12px; border-bottom: 2px solid var(--primary); padding-bottom: 8px; }
        .cards-list { display: flex; flex-direction: column; gap: 20px; margin-bottom: 45px; }
        .info-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .flight-leg { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed var(--border); }
        .flight-leg:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
        .carrier-info { display: flex; align-items: center; gap: 12px; }
        .carrier-details h4 { margin: 0; font-size: 16px; font-weight: 700; color: var(--primary); }
        .carrier-details p { margin: 2px 0 0 0; font-size: 12px; color: var(--text-muted); }
        .flight-time-block { text-align: right; min-width: 140px; }
        .flight-time-block.dest { text-align: left; }
        .flight-time-block .airport { font-size: 14px; font-weight: 700; color: var(--primary); }
        .flight-time-block .date { font-size: 12px; color: var(--accent); font-weight: 500; }
        .flight-duration-line { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 0 20px; max-width: 200px; }
        .line-graphic { width: 100%; height: 1px; background: var(--text-muted); position: relative; margin: 6px 0; }
        .line-graphic::before, .line-graphic::after { content: ''; position: absolute; width: 5px; height: 5px; border-radius: 50%; background: var(--text-muted); top: -2px; }
        .line-graphic::after { right: 0; }
        .hotel-card { display: flex; gap: 24px; flex-direction: column; }
        .hotel-info-block { flex: 1; }
        .hotel-info-block h3 { margin: 0 0 8px 0; font-size: 18px; font-weight: 800; color: var(--primary); }
        .hotel-meta-row { display: flex; gap: 20px; font-size: 13px; color: var(--text-muted); margin-bottom: 12px; }
        .room-details-list { background: #f8fafc; border-radius: 8px; padding: 12px 16px; margin-bottom: 12px; border: 1px solid var(--border); }
        .room-row { display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; border-bottom: 1px solid #f1f5f9; }
        .room-row:last-child { border-bottom: none; }
        .hotel-card-footer { display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 600; }
        .hotel-inc { color: #10b981; }
        .hotel-canc { color: var(--accent); }
        .timeline { display: flex; flex-direction: column; gap: 30px; }
        .day { background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01); }
        .day-header { background: #f8fafc; padding: 18px 24px; border-bottom: 1px solid var(--border); }
        .day-title { font-size: 18px; font-weight: 800; color: var(--primary); }
        .day-hotel { font-size: 12px; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; display: inline-block; }
        .activities-timeline-list { padding: 10px 24px 24px 24px; display: flex; flex-direction: column; gap: 16px; }
        .activity-item { position: relative; padding: 16px; border-radius: 8px; background: #ffffff; border: 1px solid var(--border); border-left: 4px solid var(--accent); }
        .activity-item.flight { border-left-color: #ec4899; }
        .activity-item.hotel { border-left-color: #f43f5e; }
        .activity-item.transfer { border-left-color: #10b981; }
        .activity-item.sic { border-left-color: #8b5cf6; }
        .activity-item.tickets { border-left-color: #f59e0b; }
        .activity-item.private { border-left-color: #06b6d4; }
        .activity-item.meal { border-left-color: #22c55e; }
        .activity-item.leisure { border-left-color: #64748b; }
        .activity-item.cruise { border-left-color: #0284c7; }
        .activity-item.visa { border-left-color: #f97316; }
        .activity-item.sim { border-left-color: #14b8a6; }
        .activity-item.insurance { border-left-color: #3b82f6; }

        /* Room & Cruise gallery styles */
        .room-thumbnail-img {
            width: 70px;
            height: 45px;
            object-fit: cover;
            border-radius: 4px;
            border: 1px solid var(--border);
            cursor: pointer;
            transition: transform 0.2s ease;
            flex-shrink: 0;
        }
        .room-thumbnail-img:hover {
            transform: scale(1.05);
        }
        .room-row-flex {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .cruise-gallery {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 12px;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .cruise-gallery-img {
            width: 120px;
            height: 80px;
            object-fit: cover;
            border-radius: 6px;
            border: 1px solid var(--border);
            cursor: pointer;
            transition: transform 0.2s ease;
            flex-shrink: 0;
        }
        .cruise-gallery-img:hover {
            transform: scale(1.05);
        }
        .activity-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
        .activity-lbl { font-weight: 700; font-size: 15px; color: var(--primary); }
        .activity-desc { margin: 0; font-size: 13px; color: var(--text-muted); line-height: 1.5; }
        .list-section { background: #f8fafc; border: 1px solid var(--border); border-radius: 12px; padding: 24px; margin-bottom: 25px; }
        .list-section h3 { margin: 0 0 15px 0; font-size: 16px; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
        .bullet-list { margin: 0; padding-left: 20px; font-size: 13px; color: var(--text-main); }
        .bullet-list li { margin-bottom: 8px; }
        .footer-banner { background: linear-gradient(135deg, var(--primary) 0%, #1e293b 100%); color: white; padding: 35px; border-radius: 12px; text-align: center; margin-top: 40px; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.1); }
        .footer-banner h3 { margin: 0 0 8px 0; font-size: 20px; font-weight: 800; }
        .footer-banner p { margin: 0; font-size: 14px; color: #cbd5e1; }
        .contact-pill { display: inline-block; background: rgba(255, 255, 255, 0.1); padding: 10px 24px; border-radius: 30px; margin-top: 20px; font-weight: 700; font-size: 14px; }
        .page-break { page-break-before: always; }
        @media (max-width: 768px) {
            .container { margin: 10px; padding: 20px; border-radius: 12px; }
            .header { flex-direction: column; align-items: center; text-align: center; gap: 16px; }
            .company-details { text-align: center; }
            .hero { flex-direction: column; align-items: center; text-align: center; gap: 16px; padding: 20px; }
            .hero-right { text-align: center; }
            .flight-leg { flex-direction: column; gap: 12px; align-items: center; text-align: center; }
            .flight-duration-line { max-width: none; width: 100%; padding: 0; }
            .flight-time-block { text-align: center; min-width: auto; }
            .flight-time-block.dest { text-align: center; }
        }
        @media print {
            @page { size: A4; margin: 15mm; }
            body { background: #ffffff !important; color: #111827 !important; font-size: 13px !important; }
            .container { box-shadow: none !important; padding: 0 !important; margin: 0 !important; max-width: 100% !important; width: 100% !important; border: none !important; }
            .header { border-bottom: 2px solid #0f172a !important; padding-bottom: 15px !important; margin-bottom: 25px !important; background: #ffffff !important; }
            .hero { box-shadow: none !important; background: #0f172a !important; color: #ffffff !important; padding: 20px 30px !important; margin-bottom: 25px !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .price-card { background: #fffbeb !important; border: 1px solid #fde68a !important; padding: 18px !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .price-card.secondary { background: #f0fdf4 !important; border-color: #bbf7d0 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .info-card { border: 1px solid #e2e8f0 !important; box-shadow: none !important; padding: 18px !important; margin-bottom: 15px !important; page-break-inside: avoid !important; break-inside: avoid !important; }
            .flight-leg { display: grid !important; grid-template-columns: 2.2fr 1fr 1.3fr 1fr !important; align-items: center !important; gap: 12px !important; border-bottom: 1px dashed #cbd5e1 !important; padding-bottom: 12px !important; margin-bottom: 12px !important; page-break-inside: avoid !important; break-inside: avoid !important; }
            .flight-leg:last-child { border-bottom: none !important; }
            .flight-time-block { text-align: right !important; }
            .flight-time-block.dest { text-align: left !important; }
            .flight-duration-line { padding: 0 !important; max-width: none !important; }
            .line-graphic { background: #64748b !important; }
            .day { margin-bottom: 30px !important; page-break-inside: avoid !important; break-inside: avoid !important; }
            .activity-item { background: #f8fafc !important; border: 1px solid #e2e8f0 !important; border-left: 4px solid var(--accent) !important; padding: 12px 16px !important; page-break-inside: avoid !important; break-inside: avoid !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .activity-item.flight { border-left-color: #ec4899 !important; }
            .activity-item.hotel { border-left-color: #f43f5e !important; }
            .activity-item.transfer { border-left-color: #10b981 !important; }
            .activity-item.sic { border-left-color: #8b5cf6 !important; }
            .activity-item.tickets { border-left-color: #f59e0b !important; }
            .activity-item.private { border-left-color: #06b6d4 !important; }
            .activity-item.meal { border-left-color: #22c55e !important; }
            .activity-item.leisure { border-left-color: #64748b !important; }
            .activity-item.cruise { border-left-color: #0284c7 !important; }
            .activity-item.visa { border-left-color: #f97316 !important; }
            .activity-item.sim { border-left-color: #14b8a6 !important; }
            .activity-item.insurance { border-left-color: #3b82f6 !important; }
            .list-section { page-break-inside: avoid !important; break-inside: avoid !important; }
            .footer-banner { background: #0f172a !important; color: #ffffff !important; padding: 25px !important; margin-top: 35px !important; page-break-inside: avoid !important; break-inside: avoid !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .contact-pill { background: rgba(255, 255, 255, 0.15) !important; padding: 6px 16px !important; margin-top: 12px !important; }
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <div class="logo-container">
            <img id="tpl-logo" src="/logo.jpg" alt="Agency Logo">
        </div>
        <div class="company-details" id="tpl-company-details"></div>
    </div>
    <div class="hero">
        <div class="hero-left">
            <h1 id="tpl-destination">Destination</h1>
            <p id="tpl-duration-sub"></p>
        </div>
        <div class="hero-right">
            <div class="date" id="tpl-dates"></div>
            <div class="code" id="tpl-ref"></div>
        </div>
    </div>
    <div class="pricing-section" id="tpl-pricing-section"></div>
    <div class="page-break"></div>
    <div id="tpl-flights-container" style="display: none;">
        <div class="section-title" id="tpl-flights-title">Flight Itinerary</div>
        <div class="cards-list">
            <div class="info-card">
                <div id="tpl-flights-list"></div>
                <div id="tpl-flights-note-box" style="font-size: 12px; color: var(--text-muted); background: #f8fafc; padding: 12px; border-radius: 6px; margin-top: 15px; display: flex; flex-direction: column; gap: 6px;"></div>
            </div>
        </div>
    </div>
    <div id="tpl-hotels-container" style="display: none;">
        <div class="section-title">Accommodations Booking Summary</div>
        <div class="cards-list" id="tpl-hotels-list"></div>
    </div>
    <div class="section-title">Day-by-Day Customized Timeline</div>
    <div class="timeline" id="tpl-timeline-list" style="margin-bottom: 45px;"></div>
    <div class="page-break"></div>
    <div id="tpl-inclusions-box" class="list-section" style="display: none;">
        <h3>Inclusions</h3>
        <ul class="bullet-list" id="tpl-inclusions-list"></ul>
    </div>
    <div id="tpl-exclusions-box" class="list-section" style="display: none;">
        <h3>Exclusions</h3>
        <ul class="bullet-list" id="tpl-exclusions-list"></ul>
    </div>
    <div id="tpl-terms-box" class="list-section" style="display: none;">
        <h3>Terms & Conditions / Notes</h3>
        <ul class="bullet-list" id="tpl-terms-list"></ul>
    </div>
    <div class="footer-banner" id="tpl-footer-banner">
        <h3 id="tpl-footer-title">Let us plan your next dream vacation!</h3>
        <p id="tpl-footer-sub">Contact our travel consultants today for amendments or booking confirmations.</p>
        <div class="contact-pill" id="tpl-footer-contact"></div>
    </div>
</div>
<script>window.itineraryData = ${JSON.stringify(data, null, 2)};</script>
<script>
document.addEventListener('DOMContentLoaded', () => {
    const data = window.itineraryData;
    if (!data) return;
    document.title = "Premium customized travel quote | " + (data.destination || 'Trip') + " Itinerary";
    const logoImg = document.getElementById('tpl-logo');
    logoImg.src = data.companyDetails?.logoUrl || '/logo.jpg';
    
    const companyDetails = document.getElementById('tpl-company-details');
    companyDetails.innerHTML = "<strong>" + (data.companyDetails?.name || 'SOLVE YOUR TRIP PRIVATE LIMITED') + "</strong><br>" +
        (data.companyDetails?.address || '').split('\\n').join('<br>') + "<br>📞 " + (data.companyDetails?.phone || '') + " | " + (data.companyDetails?.email || '');

    document.getElementById('tpl-destination').textContent = data.destination || 'Custom Trip';
    const totalNights = data.days ? (data.days.length - 1) : 0;
    const totalDays = data.days ? data.days.length : 0;
    document.getElementById('tpl-duration-sub').textContent = data.subTitle || (totalNights + " Nights / " + totalDays + " Days Customized Premium Quote");
    
    document.getElementById('tpl-dates').textContent = data.startDate && data.endDate ? (formatDate(data.startDate) + " - " + formatDate(data.endDate)) : 'Dates TBD';
    document.getElementById('tpl-ref').textContent = data.refCodes ? ("Ref: " + data.refCodes) : '';

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    
    function formatDayHeaderDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
    }

    const pricingSection = document.getElementById('tpl-pricing-section');
    pricingSection.innerHTML = '';
    const currency = data.pricing?.currencySymbol || 'INR';

    if (data.pricing?.totalCost) {
        const card = document.createElement('div');
        card.className = 'price-card';
        card.innerHTML = "<div class='label'>" + (data.pricing.totalCostLabel || 'Total Cost') + "</div>" +
            "<div class='amount'>" + currency + " " + data.pricing.totalCost + "</div>" +
            "<div class='guests'>Prepared for <strong>" + (data.clientName || 'Valued Client') + "</strong> | <strong>" + (data.paxCount || 'Guests') + "</strong></div>";
        pricingSection.appendChild(card);
    }

    if (data.pricing?.perPersonCost) {
        const card = document.createElement('div');
        card.className = 'price-card secondary';
        card.innerHTML = "<div class='label'>" + (data.pricing.perPersonCostLabel || 'Per Person Cost') + "</div>" +
            "<div class='amount'>" + currency + " " + data.pricing.perPersonCost + "</div>" +
            "<div class='guests'>Calculated for " + (data.paxDetails || 'Guests') + "</div>";
        pricingSection.appendChild(card);
    }
    if (pricingSection.children.length === 0) pricingSection.style.display = 'none';

    const flightsContainer = document.getElementById('tpl-flights-container');
    const flightsList = document.getElementById('tpl-flights-list');
    const flightsNoteBox = document.getElementById('tpl-flights-note-box');
    
    if (data.flights && data.flights.legs && data.flights.legs.length > 0) {
        flightsContainer.style.display = 'block';
        if (data.flights.title) document.getElementById('tpl-flights-title').textContent = data.flights.title;
        flightsList.innerHTML = '';
        data.flights.legs.forEach(leg => {
            const flightRow = document.createElement('div');
            flightRow.className = 'flight-leg';
            flightRow.innerHTML = "<div class='carrier-info'><div class='carrier-details'><h4>" + (leg.type || 'Flight') + ": " + (leg.route || '') + "</h4><p>" + (leg.carrier || '') + "</p></div></div>" +
                "<div class='flight-time-block'><div class='airport'>" + (leg.originAirport || '') + "</div><div class='date'>" + (leg.originDate || '') + "</div></div>" +
                "<div class='flight-duration-line'><div class='line-graphic'></div><span class='duration-lbl' style='color:#10b981; font-weight:700; font-size:11px;'>" + (leg.duration || 'Direct') + "</span></div>" +
                "<div class='flight-time-block dest'><div class='airport'>" + (leg.destAirport || '') + "</div><div class='date'>" + (leg.destDate || '') + "</div></div>";
            flightsList.appendChild(flightRow);
        });

        flightsNoteBox.innerHTML = '';
        if (data.flights.note) {
            const div = document.createElement('div');
            div.innerHTML = "🎒 <strong>Included Baggage:</strong> " + data.flights.note;
            flightsNoteBox.appendChild(div);
        }
        if (data.flights.warning) {
            const div = document.createElement('div');
            div.style.color = '#ca8a04';
            div.style.fontWeight = '600';
            div.innerHTML = "⚠️ Note: " + data.flights.warning;
            flightsNoteBox.appendChild(div);
        }
        if (flightsNoteBox.children.length === 0) flightsNoteBox.style.display = 'none';
    } else {
        flightsContainer.style.display = 'none';
    }

    const hotelsContainer = document.getElementById('tpl-hotels-container');
    const hotelsList = document.getElementById('tpl-hotels-list');
    const showHotelCosts = data.pricing?.showHotelCosts === true;
    
    if (data.hotels && data.hotels.length > 0) {
        hotelsContainer.style.display = 'block';
        hotelsList.innerHTML = '';
        data.hotels.forEach(hotel => {
            const hotelDiv = document.createElement('div');
            hotelDiv.className = 'info-card hotel-card';
            const roomsHtml = (hotel.rooms || []).map(room => {
                const nameVal = typeof room === 'string' ? room : room.name;
                const imgHtml = room.image ? ("<img class='room-thumbnail-img' src='" + room.image + "' onclick='window.open(this.src, \\\"_blank\\\")'>") : '';
                return "<div class='room-row' style='display: flex; justify-content: space-between; align-items: center; gap: 15px; padding: 6px 0;'><div class='room-row-flex'>" + imgHtml + "<span>• " + nameVal + "</span></div>" + (showHotelCosts && room.price ? "<span>" + currency + " " + room.price + "</span>" : '') + "</div>";
            }).join('');
            
            hotelDiv.innerHTML = "<div class='hotel-info-block'><h3>" + (hotel.name || 'Custom Hotel') + "</h3>" +
                "<div class='hotel-meta-row'><span>Stay: <strong>" + (hotel.checkIn || '') + " - " + (hotel.checkOut || '') + "</strong></span><span>Duration: <strong>" + (hotel.nights || 0) + " Night(s)</strong></span></div>" +
                "<div class='room-details-list'>" + roomsHtml + "</div>" +
                "<div class='hotel-card-footer'><span class='hotel-inc'>" + (hotel.inclusions || '🍳 Breakfast Included') + "</span><span class='hotel-canc'>" + (hotel.cancellation || '') + "</span></div></div>";
            hotelsList.appendChild(hotelDiv);
        });
    } else {
        hotelsContainer.style.display = 'none';
    }

    const timelineList = document.getElementById('tpl-timeline-list');
    timelineList.innerHTML = '';
    if (data.days && data.days.length > 0) {
        let baseDate = data.startDate ? new Date(data.startDate) : null;
        data.days.forEach((day, index) => {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            let dayDateText = '';
            if (baseDate) {
                const currentDayDate = new Date(baseDate);
                currentDayDate.setDate(baseDate.getDate() + index);
                dayDateText = " - " + formatDayHeaderDate(currentDayDate);
            }
            const hotelTextHtml = day.hotelText ? ("<div class='day-hotel'>Stay: " + day.hotelText + "</div>") : '';
            const activitiesHtml = (day.activities || []).map(act => {
                const actTypeClass = (act.type || 'leisure').toLowerCase();
                let cruiseGalleryHtml = '';
                if (actTypeClass === 'cruise' && act.roomImages && act.roomImages.length > 0) {
                    cruiseGalleryHtml = "<div class='cruise-gallery'>" + act.roomImages.map(imgSrc => "<img class='cruise-gallery-img' src='" + imgSrc + "' onclick='window.open(this.src, \\\"_blank\\\")'>").join('') + "</div>";
                }
                return "<div class='activity-item " + actTypeClass + "'><div class='activity-head'><div class='activity-lbl'>" + act.title + "</div></div>" +
                    (act.desc ? ("<p class='activity-desc'>" + act.desc + "</p>") : '') + cruiseGalleryHtml + "</div>";
            }).join('');
            
            dayDiv.innerHTML = "<div class='day-header'><div class='day-title'>Day " + (day.dayNum || (index + 1)) + dayDateText + "</div>" + hotelTextHtml + "</div>" +
                "<div class='activities-timeline-list'>" + (activitiesHtml || "<div style='font-size:13px; color:var(--text-muted); font-style:italic;'>Leisure day.</div>") + "</div>";
            timelineList.appendChild(dayDiv);
        });
    }

    const incBox = document.getElementById('tpl-inclusions-box');
    if (data.inclusions && data.inclusions.length > 0) {
        incBox.style.display = 'block';
        document.getElementById('tpl-inclusions-list').innerHTML = data.inclusions.map(item => "<li>" + item + "</li>").join('');
    } else incBox.style.display = 'none';

    const excBox = document.getElementById('tpl-exclusions-box');
    if (data.exclusions && data.exclusions.length > 0) {
        excBox.style.display = 'block';
        document.getElementById('tpl-exclusions-list').innerHTML = data.exclusions.map(item => "<li>" + item + "</li>").join('');
    } else excBox.style.display = 'none';

    const termsBox = document.getElementById('tpl-terms-box');
    if (data.terms && data.terms.length > 0) {
        termsBox.style.display = 'block';
        document.getElementById('tpl-terms-list').innerHTML = data.terms.map(item => "<li>" + item + "</li>").join('');
    } else termsBox.style.display = 'none';

    document.getElementById('tpl-footer-contact').innerHTML = "📞 " + (data.companyDetails?.phone || '') + " | " + (data.companyDetails?.email || '');
    document.getElementById('tpl-footer-title').textContent = "Let us plan your next dream vacation to " + (data.destination || 'your destination') + "!";
});
</script>
</body>
</html>`;
}

// DOM Helper: Add Flight card
function addFlightLeg(legData) {
    const container = doc('flights-container');
    
    // Remove empty state message if first element
    if (container.querySelector('.empty-sub-state')) {
        container.innerHTML = '';
    }
    
    const card = document.createElement('div');
    card.className = 'sub-card flight-leg-card';
    card.innerHTML = `
        <div class="sub-card-header">
            <h3>Flight Leg</h3>
            <button type="button" class="btn-remove-sub">Delete</button>
        </div>
        <div class="form-grid col-3">
            <div class="form-group">
                <label>Leg Type</label>
                <select class="leg-type">
                    <option value="Outbound" ${legData.type === 'Outbound' ? 'selected' : ''}>Outbound Flight</option>
                    <option value="Return" ${legData.type === 'Return' ? 'selected' : ''}>Return Flight</option>
                    <option value="Internal" ${legData.type === 'Internal' ? 'selected' : ''}>Internal Connection</option>
                </select>
            </div>
            <div class="form-group">
                <label>Route Route (Label)</label>
                <input type="text" class="leg-route" value="${legData.route || ''}" placeholder="e.g. Delhi (DEL) ✈ Singapore (SIN)">
            </div>
            <div class="form-group">
                <label>Carrier / Flight details</label>
                <input type="text" class="leg-carrier" value="${legData.carrier || ''}" placeholder="e.g. Air India • AI2118 • Economy Class">
            </div>
        </div>
        
        <div class="form-grid col-5" style="margin-top: 10px;">
            <div class="form-group">
                <label>Origin (Code/Term)</label>
                <input type="text" class="leg-originAirport" value="${legData.originAirport || ''}" placeholder="e.g. DEL (T3)">
            </div>
            <div class="form-group">
                <label>Dept Date/Time</label>
                <input type="text" class="leg-originDate" value="${legData.originDate || ''}" placeholder="e.g. Sun 21 Jun, 13:40">
            </div>
            <div class="form-group">
                <label>Duration / Connection</label>
                <input type="text" class="leg-duration" value="${legData.duration || 'Direct'}" placeholder="e.g. Direct, 1 Stop">
            </div>
            <div class="form-group">
                <label>Destination (Code)</label>
                <input type="text" class="leg-destAirport" value="${legData.destAirport || ''}" placeholder="e.g. SIN (T3)">
            </div>
            <div class="form-group">
                <label>Arrv Date/Time</label>
                <input type="text" class="leg-destDate" value="${legData.destDate || ''}" placeholder="e.g. Sun 21 Jun, 21:50">
            </div>
        </div>
    `;
    
    // Delete action
    card.querySelector('.btn-remove-sub').addEventListener('click', () => {
        card.remove();
        if (container.children.length === 0) {
            container.innerHTML = '<div class="empty-sub-state">No flights added yet. Click "+ Add Flight Leg".</div>';
        }
    });
    
    container.appendChild(card);
}

// DOM Helper: Add Hotel card
function addHotel(hotelData) {
    const container = doc('hotels-container');
    
    if (container.querySelector('.empty-sub-state')) {
        container.innerHTML = '';
    }
    
    const card = document.createElement('div');
    card.className = 'sub-card hotel-card-item';
    
    card.innerHTML = `
        <div class="sub-card-header">
            <h3>Hotel Accommodation</h3>
            <button type="button" class="btn-remove-sub">Delete</button>
        </div>
        <div class="form-grid col-3">
            <div class="form-group" style="grid-column: span 2;">
                <label>Hotel Name & Rating</label>
                <input type="text" class="hotel-name-field" value="${hotelData.name || ''}" placeholder="e.g. Novotel Singapore On Kitchener (4★)" required>
            </div>
            <div class="form-group">
                <label>Total Nights</label>
                <input type="number" class="hotel-nights-field" value="${hotelData.nights || 1}" min="1">
            </div>
        </div>
        <div class="form-grid col-2" style="margin-top: 10px;">
            <div class="form-group">
                <label>Check In Date</label>
                <input type="text" class="hotel-in-field" value="${hotelData.checkIn || ''}" placeholder="e.g. June 21, 2026">
            </div>
            <div class="form-group">
                <label>Check Out Date</label>
                <input type="text" class="hotel-out-field" value="${hotelData.checkOut || ''}" placeholder="e.g. June 24, 2026">
            </div>
        </div>
        
        <div class="form-group" style="margin-top: 10px;">
            <label>Rooms Configuration</label>
            <div class="room-configs-list">
                <div class="room-rows-container">
                    <!-- Dynamic room rows loaded dynamically -->
                </div>
                <button type="button" class="btn btn-sm btn-secondary btn-add-room-row" style="margin-top: 8px; max-width: 150px;">+ Add Room</button>
            </div>
        </div>

        <div class="form-grid col-2" style="margin-top: 10px;">
            <div class="form-group">
                <label>Inclusions</label>
                <input type="text" class="hotel-inc-field" value="${hotelData.inclusions || '🍳 Breakfast Included'}" placeholder="e.g. Breakfast Included">
            </div>
            <div class="form-group">
                <label>Cancellation Policy</label>
                <input type="text" class="hotel-canc-field" value="${hotelData.cancellation || 'Free Cancel before check-in'}" placeholder="e.g. Free Cancel 48 Hours before check-in">
            </div>
        </div>
    `;
    
    const rowsContainer = card.querySelector('.room-rows-container');
    const rooms = hotelData.rooms || [];
    
    // Load initial room rows
    if (rooms.length > 0) {
        rooms.forEach(r => {
            const nameVal = typeof r === 'string' ? r : r.name;
            const priceVal = r.price || '';
            const imageVal = r.image || '';
            addRoomRow(rowsContainer, { name: nameVal, price: priceVal, image: imageVal });
        });
    } else {
        addRoomRow(rowsContainer);
    }
    
    // Add Room button listener
    card.querySelector('.btn-add-room-row').addEventListener('click', () => {
        addRoomRow(rowsContainer);
    });

    // Delete Hotel action
    card.querySelector('.btn-remove-sub').addEventListener('click', () => {
        card.remove();
        if (container.children.length === 0) {
            container.innerHTML = '<div class="empty-sub-state">No accommodations added yet. Click "+ Add Hotel".</div>';
        }
    });
    
    container.appendChild(card);
}

// Room Row Builder with Clipboard Paste support
function addRoomRow(rowsContainer, roomData = { name: '', price: '', image: '' }) {
    const div = document.createElement('div');
    div.className = 'room-config-row';
    div.style.cssText = 'display: flex; flex-direction: column; gap: 8px; border-bottom: 1px dashed var(--border-dark); padding-bottom: 12px; margin-bottom: 12px;';
    
    const image = roomData.image || '';
    
    div.innerHTML = `
        <div style="display: flex; gap: 10px; align-items: center;">
            <input type="text" class="room-name-field" style="flex: 2;" value="${roomData.name || ''}" placeholder="e.g. Superior Room with King Bed" required>
            <input type="text" class="room-price-field" style="flex: 1;" value="${roomData.price || ''}" placeholder="Price (Optional)">
            <button type="button" class="btn-remove-sub" style="font-size: 11px;">✕</button>
        </div>
        <div class="image-paste-zone room-image-zone" tabindex="0" title="Click to upload or focus & paste (Ctrl+V) room image">
            <input type="file" class="paste-file-input" accept="image/*" style="display:none">
            <div class="paste-zone-placeholder" style="${image ? 'display:none;' : ''}">
                <span>🖼️ Click to upload / Focus & Paste Room Photo (Ctrl+V)</span>
            </div>
            <div class="paste-zone-preview" style="${image ? '' : 'display:none;'}">
                <img class="img-preview" src="${image}">
                <button type="button" class="btn-remove-image">✕</button>
            </div>
        </div>
    `;
    
    // Set up paste zone events
    const zone = div.querySelector('.room-image-zone');
    setupImagePasteZone(zone, (base64) => {
        const placeholder = zone.querySelector('.paste-zone-placeholder');
        const preview = zone.querySelector('.paste-zone-preview');
        const img = zone.querySelector('.img-preview');
        img.src = base64;
        placeholder.style.display = 'none';
        preview.style.display = 'block';
    });
    
    // Set up remove button events
    zone.querySelector('.btn-remove-image').addEventListener('click', (e) => {
        e.stopPropagation();
        const placeholder = zone.querySelector('.paste-zone-placeholder');
        const preview = zone.querySelector('.paste-zone-preview');
        const img = zone.querySelector('.img-preview');
        img.src = '';
        placeholder.style.display = 'flex';
        preview.style.display = 'none';
    });
    
    // Remove room row action
    div.querySelector('.btn-remove-sub').addEventListener('click', () => {
        if (rowsContainer.querySelectorAll('.room-config-row').length > 1) {
            div.remove();
        } else {
            alert("At least one room is required for a hotel booking.");
        }
    });
    
    rowsContainer.appendChild(div);
}

// Dynamic Timeline day Sync
function syncTimelineDays(forceLoadFromState = false) {
    const startVal = doc('startDate').value;
    const endVal = doc('endDate').value;
    const container = doc('days-container');
    
    if (!startVal || !endVal) {
        container.innerHTML = '<div class="empty-sub-state">Please enter valid Start & End dates to load the timeline.</div>';
        return;
    }
    
    const start = new Date(startVal);
    const end = new Date(endVal);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
        container.innerHTML = '<div class="empty-sub-state">Invalid dates. End Date must be after Start Date.</div>';
        return;
    }
    
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    // Save current user entered days before resetting view
    const tempDaysMap = {};
    if (!forceLoadFromState) {
        document.querySelectorAll('.day-editor-card').forEach(card => {
            const dayNum = parseInt(card.dataset.dayNum);
            const hotelText = card.querySelector('.day-hotel-text').value;
            const activities = [];
            card.querySelectorAll('.activity-editor-row').forEach(row => {
                activities.push({
                    type: row.querySelector('.act-type-field').value,
                    title: row.querySelector('.act-title-field').value,
                    desc: row.querySelector('.act-desc-field').value
                });
            });
            tempDaysMap[dayNum] = { hotelText, activities };
        });
    }
    
    container.innerHTML = '';
    
    for (let i = 1; i <= diffDays; i++) {
        // Calculate day date
        const dayDate = new Date(start);
        dayDate.setDate(start.getDate() + (i - 1));
        const dayDateText = dayDate.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
        
        // Restore values if previously entered, else defaults
        const prevData = (!forceLoadFromState && tempDaysMap[i]) || (currentItinerary.days && currentItinerary.days[i - 1]) || { hotelText: '', activities: [] };
        
        const dayCard = document.createElement('div');
        dayCard.className = `day-editor-card ${i === 1 ? 'open' : ''}`;
        dayCard.dataset.dayIndex = i - 1;
        dayCard.dataset.dayNum = i;
        
        dayCard.innerHTML = `
            <div class="day-editor-header">
                <div class="day-info">
                    <h3>Day ${i} - ${dayDateText}</h3>
                    <p class="hotel-sub-lbl">${prevData.hotelText ? 'Stay: ' + prevData.hotelText : 'Leisure / No accommodation set'}</p>
                </div>
                <span class="chevron">▼</span>
            </div>
            
            <div class="day-editor-body">
                <div class="form-group">
                    <label>Stay Accommodation (Label)</label>
                    <input type="text" class="day-hotel-text" value="${prevData.hotelText || ''}" placeholder="e.g. Novotel Singapore On Kitchener">
                </div>
                
                <div class="day-activities-section">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <h4 style="font-size:12px; text-transform:uppercase; color:var(--accent);">Daily Activities</h4>
                        <button type="button" class="btn btn-sm btn-secondary btn-add-act">+ Add Activity</button>
                    </div>
                    <div class="day-activities-list">
                        <!-- Injected activities -->
                    </div>
                </div>
            </div>
        `;
        
        // Sync Stay label in header on input change
        const stayInput = dayCard.querySelector('.day-hotel-text');
        stayInput.addEventListener('input', (e) => {
            const lbl = dayCard.querySelector('.hotel-sub-lbl');
            lbl.textContent = e.target.value ? `Stay: ${e.target.value}` : 'Leisure / No accommodation set';
        });
        
        // Collapsible header
        dayCard.querySelector('.day-editor-header').addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
                dayCard.classList.toggle('open');
                const chevron = dayCard.querySelector('.chevron');
                chevron.textContent = dayCard.classList.contains('open') ? '▼' : '▲';
            }
        });
        
        // Add Activity Button
        const addActBtn = dayCard.querySelector('.btn-add-act');
        const actList = dayCard.querySelector('.day-activities-list');
        addActBtn.addEventListener('click', () => {
            addActivityRow(actList, { type: 'transfer', title: '', desc: '' });
        });
        
        // Load initial activities
        if (prevData.activities && prevData.activities.length > 0) {
            prevData.activities.forEach(a => addActivityRow(actList, a));
        }
        
        container.appendChild(dayCard);
    }
}

// Activity row insertion
function addActivityRow(listContainer, actData) {
    const div = document.createElement('div');
    div.className = 'activity-editor-row';
    div.innerHTML = `
        <button type="button" class="btn-remove-sub" style="position:absolute; right:10px; top:10px;">✕</button>
        <div class="form-grid col-3">
            <div class="form-group" style="margin-bottom:0;">
                <label>Activity Type</label>
                <select class="act-type-field">
                    <option value="transfer" ${actData.type === 'transfer' ? 'selected' : ''}>Transfer (Car)</option>
                    <option value="sic" ${actData.type === 'sic' ? 'selected' : ''}>Seat-in-Coach Tour</option>
                    <option value="private" ${actData.type === 'private' ? 'selected' : ''}>Private Tour</option>
                    <option value="tickets" ${actData.type === 'tickets' ? 'selected' : ''}>Tickets Only</option>
                    <option value="flight" ${actData.type === 'flight' ? 'selected' : ''}>Flight Leg</option>
                    <option value="hotel" ${actData.type === 'hotel' ? 'selected' : ''}>Hotel Check-In/Out</option>
                    <option value="cruise" ${actData.type === 'cruise' ? 'selected' : ''}>Cruise Booking</option>
                    <option value="meal" ${actData.type === 'meal' ? 'selected' : ''}>Meal Event</option>
                    <option value="visa" ${actData.type === 'visa' ? 'selected' : ''}>Visa Processing</option>
                    <option value="sim" ${actData.type === 'sim' ? 'selected' : ''}>SIM Card Purchase/Pickup</option>
                    <option value="insurance" ${actData.type === 'insurance' ? 'selected' : ''}>Travel Insurance</option>
                    <option value="leisure" ${actData.type === 'leisure' ? 'selected' : ''}>Leisure / Free time</option>
                </select>
            </div>
            <div class="form-group" style="grid-column: span 2; margin-bottom:0;">
                <label>Activity Label/Title</label>
                <input type="text" class="act-title-field" value="${actData.title || ''}" placeholder="e.g. Universal Studio Singapore with Tickets" required>
            </div>
        </div>
        <div class="form-group" style="margin-top:10px; margin-bottom:0;">
            <label>Details / Description (Voucher, operating hours, notes)</label>
            <textarea class="act-desc-field" rows="2" placeholder="Describe the day's activity timings or meetups...">${actData.desc || ''}</textarea>
        </div>
        
        <div class="cruise-images-container" style="margin-top:12px; display: ${actData.type === 'cruise' ? 'block' : 'none'};">
            <label style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 6px; display: block;">Cruise Cabin Photos (Focus & Ctrl+V to paste or click to upload)</label>
            <div class="cruise-images-gallery-row" style="display: flex; gap: 10px; flex-wrap: wrap;">
                <!-- Paste zone -->
                <div class="image-paste-zone cruise-image-paste-zone" tabindex="0" style="width: 100px; height: 70px; flex-shrink: 0;" title="Focus & Paste image (Ctrl+V) or click to upload">
                    <input type="file" class="paste-file-input" accept="image/*" style="display:none" multiple>
                    <div class="paste-zone-placeholder">
                        <span style="font-size: 9px;">📷 Paste / Upload</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const typeSelect = div.querySelector('.act-type-field');
    const cruiseContainer = div.querySelector('.cruise-images-container');
    const galleryRow = div.querySelector('.cruise-images-gallery-row');
    const pasteZone = div.querySelector('.cruise-image-paste-zone');
    
    // Toggle cruise images container on selection change
    typeSelect.addEventListener('change', (e) => {
        if (e.target.value === 'cruise') {
            cruiseContainer.style.display = 'block';
        } else {
            cruiseContainer.style.display = 'none';
        }
    });
    
    // Helper function to append a thumbnail card
    function appendCruiseThumbnail(base64) {
        const thumb = document.createElement('div');
        thumb.className = 'cruise-gallery-thumbnail';
        thumb.style.cssText = 'position:relative; width: 100px; height: 70px; border-radius:6px; border:1px solid var(--border-dark); overflow:hidden; flex-shrink:0;';
        thumb.innerHTML = `
            <img src="${base64}" style="width:100%; height:100%; object-fit:cover;">
            <button type="button" class="btn-remove-image" style="position:absolute; top:2px; right:2px;">✕</button>
        `;
        thumb.querySelector('.btn-remove-image').addEventListener('click', () => thumb.remove());
        galleryRow.insertBefore(thumb, pasteZone);
    }
    
    // Load pre-existing cruise images
    const existingImages = actData.roomImages || [];
    existingImages.forEach(imgSrc => appendCruiseThumbnail(imgSrc));
    
    // Set up paste zone
    setupImagePasteZone(pasteZone, (base64) => {
        appendCruiseThumbnail(base64);
    });
    
    div.querySelector('.btn-remove-sub').addEventListener('click', () => div.remove());
    listContainer.appendChild(div);
}

// Reusable image paste/uploader logic
function setupImagePasteZone(zone, onImageLoaded) {
    const fileInput = zone.querySelector('.paste-file-input');
    
    // Trigger upload dialog on click (except when clicking remove button)
    zone.addEventListener('click', (e) => {
        if (!e.target.classList.contains('btn-remove-image') && e.target.tagName !== 'BUTTON') {
            fileInput.click();
        }
    });
    
    // File select action
    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (evt) => onImageLoaded(evt.target.result);
                reader.readAsDataURL(file);
            });
        }
    });
    
    // Clipboard paste action
    zone.addEventListener('paste', (e) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                const reader = new FileReader();
                reader.onload = (evt) => onImageLoaded(evt.target.result);
                reader.readAsDataURL(blob);
                e.preventDefault();
                break;
            }
        }
    });
}

// Helpers
function showToast(msg) {
    const toast = doc('toast-message');
    toast.textContent = msg;
    toast.className = 'toast-alert show';
    setTimeout(() => {
        toast.className = 'toast-alert';
    }, 3000);
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
