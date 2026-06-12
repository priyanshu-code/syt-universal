// Global State for the current editing itinerary
let isOnline = false;
let baseTemplateHtml = '';

async function prefetchTemplate() {
    try {
        const res = await fetch('template.html');
        if (res.ok) {
            baseTemplateHtml = await res.text();
            console.log('Template template.html pre-fetched successfully.');
        } else {
            console.warn('Failed to prefetch template.html: status', res.status);
        }
    } catch (err) {
        console.warn('Error prefetching template.html:', err);
    }
}

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

// Curated Activity Library
const ACTIVITY_CATALOG = {
    singapore: {
        name: "Singapore Presets",
        activities: {
            uss: {
                title: "Universal Studios Singapore",
                type: "tickets",
                variants: {
                    std: {
                        title: "Universal Studios Singapore - One-Day Admission Ticket",
                        desc: "Includes general admission to all rides, shows, and attractions at Universal Studios Singapore on Sentosa Island. Operating hours: 10:00 AM - 7:00 PM. Present mobile vouchers at the turnstile for entry.",
                        images: [
                            "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=800&q=80"
                        ]
                    },
                    express: {
                        title: "Universal Studios Singapore - Express Pass Ticket",
                        desc: "Includes general admission and one-time skip-the-line express access to selected rides and attractions. Perfect for peak travel periods. Operating hours: 10:00 AM - 7:00 PM.",
                        images: [
                            "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=800&q=80"
                        ]
                    },
                    vip: {
                        title: "Universal Studios Singapore - VIP Experience",
                        desc: "Includes 1-Day admission ticket, VIP Tour Guide, unlimited Express access to rides, private lounge access, S$25 dining voucher, and exclusive character meet-and-greet sessions.",
                        images: [
                            "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=800&q=80"
                        ]
                    }
                }
            },
            gardens: {
                title: "Gardens by the Bay",
                type: "tickets",
                variants: {
                    double: {
                        title: "Gardens by the Bay - Flower Dome & Cloud Forest",
                        desc: "Entry to both cooled conservatories at Gardens by the Bay. Walk amongst thousand-year-old olive trees in the Flower Dome and explore the 35-meter tall mist-filled indoor waterfall in the Cloud Forest. Hours: 9:00 AM - 9:00 PM.",
                        images: [
                            "https://images.unsplash.com/photo-1506970113724-bc41e3896d64?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1546948630-1149ea60dc86?auto=format&fit=crop&w=800&q=80"
                        ]
                    },
                    supertree: {
                        title: "Gardens by the Bay - Floral Fantasy & Supertree Observatory",
                        desc: "Access to the suspended floral displays and interactive 4D ride at Floral Fantasy, plus open-air views of the Marina Bay skyline from the Supertree Observatory canopy level.",
                        images: [
                            "https://images.unsplash.com/photo-1506970113724-bc41e3896d64?auto=format&fit=crop&w=800&q=80"
                        ]
                    }
                }
            },
            night_safari: {
                title: "Singapore Night Safari",
                type: "sic",
                variants: {
                    std: {
                        title: "Singapore Night Safari with Guided Tram Ride",
                        desc: "Admission to the world's first nocturnal wildlife park. Includes a 40-minute open-air tram ride with live commentary through 6 geographical zones, and access to the Creatures of the Night presentation.",
                        images: [
                            "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?auto=format&fit=crop&w=800&q=80"
                        ]
                    }
                }
            },
            cable_car: {
                title: "Sentosa Cable Car Sky Pass",
                type: "tickets",
                variants: {
                    std: {
                        title: "Sentosa Cable Car - Round Trip Sky Pass",
                        desc: "Fly above Singapore's cityscape and Sentosa Island on the Mount Faber Line and Sentosa Line. Includes round-trip access to both lines. Operating hours: 8:45 AM - 8:30 PM.",
                        images: [
                            "https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=800&q=80"
                        ]
                    }
                }
            }
        }
    },
    bali: {
        name: "Bali Presets",
        activities: {
            kecak: {
                title: "Uluwatu Temple Sunset & Kecak Dance",
                type: "private",
                variants: {
                    std: {
                        title: "Uluwatu Sunset Kecak Dance - Standard Ticket",
                        desc: "Visit the iconic Uluwatu Temple perched on a 70-meter cliff above the Indian Ocean. Witness the classical Kecak & Fire Dance performance against a dramatic sunset background.",
                        images: [
                            "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=800&q=80"
                        ]
                    }
                }
            },
            ubud: {
                title: "Ubud Jungle Swing & Tegallalang Rice Terraces",
                type: "private",
                variants: {
                    std: {
                        title: "Ubud Jungle Swing & Tegallalang Walk",
                        desc: "Fly high over the Ubud jungle canopy on a thrilling rope swing (safety harnesses included). Walk through the beautiful stepped Tegallalang Rice Terraces and take photos in bird nests and photo spots.",
                        images: [
                            "https://images.unsplash.com/photo-1518548419070-ad8e59f48934?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1552537160-234326d41a8a?auto=format&fit=crop&w=800&q=80"
                        ]
                    }
                }
            },
            nusa: {
                title: "Nusa Penida West Coast Day Tour",
                type: "private",
                variants: {
                    private: {
                        title: "Nusa Penida West Coast - Private Day Tour",
                        desc: "Includes return fast-boat tickets from Sanur, private AC vehicle on Nusa Penida, local driver-guide, lunch, and entry tickets. Highlights: Kelingking Beach (T-Rex Cliff), Broken Beach, Angel's Billabong, and Crystal Bay.",
                        images: [
                            "https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"
                        ]
                    }
                }
            },
            rafting: {
                title: "Ayung River White Water Rafting",
                type: "private",
                variants: {
                    std: {
                        title: "Ayung River Rafting with Buffet Lunch",
                        desc: "Conquer the Class II-III rapids of Bali's longest river. Includes professional river guides, safety gear, shower facilities, towel, and a hot buffet lunch overlooking the valley.",
                        images: [
                            "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=800&q=80"
                        ]
                    }
                }
            }
        }
    },
    vietnam: {
        name: "Vietnam Presets",
        activities: {
            halong: {
                title: "Ha Long Bay Cruise",
                type: "private",
                variants: {
                    day: {
                        title: "Ha Long Bay 6-Hour Day Cruise & Ti Top Island",
                        desc: "Set sail through limestone karsts. Includes buffet lunch on board, kayaking or bamboo boat ride at Luon Cave, hiking to Ti Top Island summit, and exploring Sung Sot (Surprise) Cave.",
                        images: [
                            "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
                        ]
                    },
                    overnight: {
                        title: "Ha Long Bay Luxury 5★ Overnight Cruise (1 Night)",
                        desc: "Full boarding cabin with en-suite balcony on a 5-star cruise. Includes all meals (lunch, dinner, breakfast, brunch), cooking class, squid fishing, tai chi session, and visits to Sung Sot Cave and Ti Top Island.",
                        images: [
                            "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
                        ]
                    }
                }
            },
            bana: {
                title: "Ba Na Hills & Golden Bridge",
                type: "sic",
                variants: {
                    std: {
                        title: "Ba Na Hills Cable Car & Golden Bridge Admission",
                        desc: "Includes round-trip cable car ride (holder of 4 Guinness World Records). Walk the iconic Golden Bridge held up by giant stone hands. Explore the French Village, Le Jardin D'Amour Gardens, and Fantasy Park.",
                        images: [
                            "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80"
                        ]
                    }
                }
            },
            hoian: {
                title: "Hoi An Ancient Town Walking Tour",
                type: "private",
                variants: {
                    boat: {
                        title: "Hoi An Ancient Town Walk & Basket Boat Ride",
                        desc: "Explore Phung Hung Ancient House, Japanese Covered Bridge, and assembly halls. In the afternoon, transfer to Cam Thanh coconut village for a spinning bamboo basket boat ride in the water palm forest.",
                        images: [
                            "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80"
                        ]
                    }
                }
            },
            cuchi: {
                title: "Cu Chi Tunnels Day Tour",
                type: "sic",
                variants: {
                    halfday: {
                        title: "Cu Chi Tunnels Guided Half-Day Tour",
                        desc: "Explore the historic underground network used during the Vietnam War. Learn about the trap doors, living quarters, kitchens, and weapon factories. Try crawling through a section of the tunnels.",
                        images: [
                            "https://images.unsplash.com/photo-1543157145-f78c636d023d?auto=format&fit=crop&w=800&q=80"
                        ]
                    }
                }
            }
        }
    },
    maldives: {
        name: "Maldives Presets",
        activities: {
            sunset_cruise: {
                title: "Sunset Cruise & Dolphin Watching",
                type: "sic",
                variants: {
                    std: {
                        title: "Maldives Sunset Cruise & Dolphin Safari",
                        desc: "Embark on a traditional Maldivian dhoni boat. Chase the sunset across the Indian Ocean and watch spinner dolphins leap in the wake of the boat. Includes bottled water and soft drinks.",
                        images: [
                            "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=80"
                        ]
                    }
                }
            },
            snorkeling: {
                title: "3-Point Snorkeling Safari",
                type: "private",
                variants: {
                    std: {
                        title: "Maldives 3-Point Snorkeling Reef Safari",
                        desc: "Snorkel in clear waters. Visit three vibrant coral reefs with snorkeling gear and life jackets included. Spot sea turtles, reef sharks, and schools of colorful tropical fish.",
                        images: [
                            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"
                        ]
                    }
                }
            },
            sandbank: {
                title: "Sandbank Picnic Experience",
                type: "sic",
                variants: {
                    std: {
                        title: "Maldives Sandbank Escape & Picnic Lunch",
                        desc: "Speedboat transfer to a secluded white sandbar surrounded by turquoise lagoons. Includes snorkeling around the sandbank reef, packed picnic lunch, beach umbrellas, and soft drinks.",
                        images: [
                            "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80"
                        ]
                    }
                }
            }
        }
    }
};

// DOM Elements
const doc = (id) => document.getElementById(id);

// Load on Startup
document.addEventListener('DOMContentLoaded', async () => {
    setupEventListeners();
    await checkConnectionStatus();
    resetFormToNew();
    parseQueryParamsAndPreFill();
    prefetchTemplate();
});

// Helper: Pre-fill form from URL inquiry parameters
function parseQueryParamsAndPreFill() {
    const params = new URLSearchParams(window.location.search);
    const clientName = params.get('clientName');
    const destination = params.get('destination');
    const startDate = params.get('startDate');
    const endDate = params.get('endDate');
    const paxCount = params.get('paxCount');
    
    if (clientName || destination || startDate || endDate || paxCount) {
        if (clientName) doc('clientName').value = decodeURIComponent(clientName);
        if (destination) doc('destination').value = decodeURIComponent(destination);
        if (startDate) doc('startDate').value = decodeURIComponent(startDate);
        if (endDate) doc('endDate').value = decodeURIComponent(endDate);
        if (paxCount) doc('paxCount').value = decodeURIComponent(paxCount);
        
        // Sync timeline days
        syncTimelineDays(true);
        
        // Force rendering state update
        readFormIntoState();
        showToast('Inquiry details pre-filled!');
    }
}

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

            // Check MongoDB connectivity status
            fetch('/api/status')
                .then(r => r.json())
                .then(data => {
                    const banner = doc('db-warning-banner');
                    if (banner) {
                        banner.style.display = data.dbConnected ? 'none' : 'block';
                    }
                })
                .catch(err => console.error('Error checking DB status:', err));
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
    delete duplicated._id; // Remove MongoDB internal ID so it creates a new record
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
    delete cloned._id; // Remove MongoDB internal ID so it creates a new record
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
    
    compressAndResizeImage(file, 800, 800, 0.7)
        .then((compressedBase64) => {
            currentItinerary.companyDetails.logoUrl = compressedBase64;
            doc('logo-preview').src = compressedBase64;
            showToast('Logo loaded as compressed Base64!');
        })
        .catch((err) => {
            console.error("Logo compression failed, falling back to raw upload:", err);
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
        });
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
            const activityImages = [];
            row.querySelectorAll('.act-gallery-thumbnail img').forEach(img => {
                activityImages.push(img.src);
            });
            
            activities.push({
                type: type,
                title: row.querySelector('.act-title-field').value,
                desc: row.querySelector('.act-desc-field').value,
                roomImages: activityImages
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
    
    // Proactively compress any large base64 images before saving
    try {
        await proactivelyCompressStateImages(currentItinerary);
    } catch (cErr) {
        console.error("Image compression failed before saving:", cErr);
    }
    
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
                    else if (t === 'sim_insurance') icon = '📱🛡️';
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
    if (baseTemplateHtml) {
        const injectedScript = `<script>window.itineraryData = ${JSON.stringify(data, null, 2)};</script>`;
        const placeholder = "<!-- ITINERARY_DATA_INJECTION_PLACEHOLDER -->";
        if (baseTemplateHtml.includes(placeholder)) {
            return baseTemplateHtml.replace(placeholder, injectedScript);
        } else {
            return baseTemplateHtml.replace("</body>", `${injectedScript}</body>`);
        }
    }
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Travel Quote | Customized Itinerary</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Leaflet JS & CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <!-- GSAP & ScrollTrigger -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <!-- Three.js & OrbitControls -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
    <style>
        :root {
            /* Champagne & Midnight Blue Palette */
            --primary-color: #0b1521; /* Midnight Navy Blue */
            --primary-light: #f5f7f9; /* Silk Gray Background */
            --primary-dark: #050a10; /* Deep Velvet Black */
            --accent-color: #c5a059; /* Champagne Gold */
            --accent-dark: #a8823d; /* Rich Bronze Gold */
            --accent-light: #f8f6f0; /* Warm Sand Silk background */
            --accent-red: #e05e5e; /* Coral Rose */
            --success: #2e7d32;
            --danger: #d32f2f;

            /* Neutrals */
            --text-main: #1f2937; /* Off-black Charcoal */
            --text-secondary: #4b5563; /* Warm Slate */
            --text-muted: #9ca3af; /* Muted Silver */
            --bg-main: #fcfbf8; /* Luxe Ivory Cream */
            --bg-card: #ffffff; /* Alabaster White */
            --border-color: #e5e7eb; /* Soft Edge Grey */
            --border-gold: rgba(197, 160, 89, 0.25); /* Elegant Thin Gold Line */

            /* Tokens */
            --border-radius-sm: 0px; /* Hard classic clean lines */
            --border-radius-md: 4px;
            --border-radius-lg: 8px;
            --border-radius-full: 9999px;
            --shadow-sm: 0 2px 10px rgba(9, 17, 30, 0.03);
            --shadow-md: 0 10px 30px rgba(9, 17, 30, 0.06);
            --shadow-lg: 0 20px 50px rgba(197, 160, 89, 0.12);

            /* Typography */
            --font-heading: "Cormorant Garamond", "Georgia", serif;
            --font-body: "Inter", "Segoe UI", system-ui, sans-serif;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        body {
            font-family: var(--font-body);
            background-color: var(--bg-main);
            color: var(--text-main);
            line-height: 1.65;
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
        }

        h1, h2, h3, h4, h5, h6 {
            font-family: var(--font-heading);
            font-weight: 500;
            color: var(--primary-color);
        }

        a {
            color: inherit;
            text-decoration: none;
        }

        /* Scrollbars */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: var(--accent-color);
            border-radius: var(--border-radius-full);
        }
        ::-webkit-scrollbar-thumb:hover {
            background: var(--accent-dark);
        }

        /* Sticky Elegant Header */
        .client-header {
            background-color: var(--bg-card);
            border-bottom: 1px solid var(--accent-color);
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: var(--shadow-sm);
        }

        .client-header-container {
            max-width: 1100px;
            margin: 0 auto;
            height: 80px;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .company-logo {
            display: flex;
            align-items: center;
            gap: 12px;
            color: var(--accent-color);
        }

        .logo-img {
            height: 48px;
            width: auto;
            object-fit: contain;
        }

        .logo-text {
            display: flex;
            flex-direction: column;
            line-height: 1.1;
        }

        .logo-main {
            font-family: var(--font-heading);
            font-weight: 700;
            font-size: 20px;
            letter-spacing: 2px;
            color: var(--primary-color);
        }

        .logo-sub {
            font-size: 8px;
            font-weight: 600;
            letter-spacing: 2.5px;
            color: var(--accent-color);
            text-transform: uppercase;
        }

        .client-nav {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .client-nav .nav-link {
            font-weight: 500;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--text-main);
            padding: 6px 0;
            position: relative;
            transition: color 0.3s;
        }

        .client-nav .nav-link::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 1px;
            background-color: var(--accent-color);
            transition: width 0.3s ease;
        }

        .client-nav .nav-link:hover::after {
            width: 100%;
        }

        .client-nav .nav-link:hover {
            color: var(--accent-dark);
        }

        .client-nav .btn-nav-book {
            background-color: var(--primary-color);
            color: var(--accent-light) !important;
            padding: 8px 16px;
            border: 1px solid var(--accent-color);
            font-weight: 600;
            letter-spacing: 1px;
            transition: background-color 0.3s, color 0.3s;
        }

        .client-nav .btn-nav-book:hover {
            background-color: var(--accent-color);
            color: var(--primary-dark) !important;
        }

        .client-nav .btn-nav-book::after {
            display: none;
        }

        /* 1. Cinematic Hero Section */
        .cinematic-hero {
            position: relative;
            height: 70vh;
            width: 100%;
            overflow: hidden;
            background-color: var(--primary-dark);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .hero-image-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }

        .hero-image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.75;
        }

        .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(9, 17, 30, 0.2) 0%, rgba(9, 17, 30, 0.75) 100%);
            z-index: 2;
        }

        .hero-frame-container {
            position: relative;
            z-index: 3;
            padding: 30px;
            width: 100%;
            max-width: 900px;
            box-sizing: border-box;
        }

        .hero-title-frame {
            border: 1px solid var(--accent-color);
            padding: 40px;
            background: rgba(11, 21, 33, 0.75);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            text-align: center;
            color: white;
            outline: 1px solid var(--accent-color);
            outline-offset: -6px;
        }

        .hero-pretitle {
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 3px;
            color: var(--accent-color);
            margin-bottom: 15px;
        }

        .cinematic-hero .resort-title {
            font-family: var(--font-heading);
            font-size: 44px;
            font-weight: 300;
            line-height: 1.15;
            color: white !important;
            text-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
            margin-bottom: 5px;
        }

        .hero-divider {
            width: 80px;
            height: 1px;
            background-color: var(--accent-color);
            margin: 20px auto;
        }

        .hero-subtitle {
            font-size: 9px;
            font-weight: 600;
            letter-spacing: 2px;
            color: var(--accent-light);
            opacity: 0.8;
            margin-bottom: 5px;
        }

        .cinematic-hero .guest-name {
            font-family: var(--font-heading);
            font-size: 32px;
            font-weight: 400;
            color: white !important;
            margin-bottom: 20px;
        }

        .hero-meta-badge-row {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
        }

        .hero-badge {
            font-size: 11px;
            font-weight: 500;
            letter-spacing: 0.5px;
            color: rgba(255, 255, 255, 0.9);
        }

        .hero-badge-separator {
            color: var(--accent-color);
        }

        /* 2. Detail Highlights Compartment Bar */
        .details-highlight-bar {
            width: 100%;
            background-color: var(--accent-light);
            border-top: 1px solid var(--border-color);
            border-bottom: 1px solid var(--border-color);
            padding: 24px 0;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            box-sizing: border-box;
        }

        .highlight-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            flex: 1;
        }

        .highlight-lbl {
            font-size: 9px;
            font-weight: 600;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .highlight-val {
            font-family: var(--font-heading);
            font-size: 18px;
            color: var(--primary-color);
            font-weight: 600;
        }

        .highlight-divider {
            width: 1px;
            height: 30px;
            background-color: var(--border-color);
        }

        /* Scroll anchor wrapper */
        .client-body-container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 50px 20px;
            display: flex;
            flex-direction: column;
            gap: 60px;
            box-sizing: border-box;
        }

        .proposal-section {
            width: 100%;
            scroll-margin-top: 100px; /* Offset for sticky header */
        }

        /* 3. Welcome Letter & Expert Card */
        .welcome-expert-grid {
            display: grid;
            grid-template-columns: 1.35fr 1fr;
            gap: 30px;
            align-items: stretch;
        }

        .welcome-letter-card {
            background-color: var(--bg-card);
            border: 1px solid var(--border-gold);
            padding: 35px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-shadow: var(--shadow-sm);
        }

        .greeting-badge {
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 1.5px;
            color: var(--accent-dark);
            border: 1px solid var(--accent-color);
            padding: 4px 12px;
            align-self: flex-start;
            margin-bottom: 20px;
        }

        .welcome-greeting-title {
            font-size: 28px;
            font-weight: 500;
            line-height: 1.25;
            margin-bottom: 20px;
        }

        .welcome-letter-body {
            font-size: 14px;
            line-height: 1.75;
            color: var(--text-secondary);
        }

        .welcome-letter-body p {
            margin-bottom: 12px;
        }

        .welcome-letter-signature {
            margin-top: 30px;
            border-top: 1px dashed var(--border-gold);
            padding-top: 20px;
        }

        .sig-name {
            font-family: var(--font-heading);
            font-size: 24px;
            font-weight: bold;
            color: var(--accent-dark);
        }

        .sig-title {
            font-size: 11px;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .expert-profile-card {
            background-color: var(--primary-color);
            border: 1px solid var(--accent-color);
            color: white;
            padding: 35px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-shadow: var(--shadow-md);
        }

        .expert-profile-card .greeting-badge {
            color: var(--accent-color);
            border-color: var(--accent-color);
        }

        .expert-header-info {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 15px;
        }

        .avatar-container {
            position: relative;
            width: 90px;
            height: 90px;
            margin-bottom: 12px;
        }

        .expert-avatar {
            width: 100%;
            height: 100%;
            border-radius: var(--border-radius-full);
            object-fit: cover;
            border: 2px solid var(--accent-color);
            background-color: var(--bg-main);
        }

        .avatar-ring {
            position: absolute;
            top: -5px;
            left: -5px;
            right: -5px;
            bottom: -5px;
            border: 1px dashed var(--accent-color);
            border-radius: var(--border-radius-full);
            opacity: 0.4;
        }

        .expert-profile-card h3 {
            font-size: 22px;
            color: var(--accent-color) !important;
            margin-bottom: 4px;
        }

        .expert-profile-card p {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
        }

        .expert-profile-card .expert-meta {
            font-size: 10px;
            color: var(--accent-color);
            font-weight: 600;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin-top: 2px;
        }

        .expert-divider {
            height: 1px;
            background-color: rgba(212, 175, 55, 0.2);
            margin: 15px 0;
            width: 100%;
        }

        .expert-intro-p {
            font-size: 13px;
            line-height: 1.6;
            color: rgba(255, 255, 255, 0.8);
            text-align: center;
            margin-bottom: 20px;
        }

        .expert-profile-card .whatsapp-cta-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background-color: #25d366;
            color: white;
            padding: 12px 15px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            width: 100%;
            box-shadow: 0 4px 10px rgba(37, 211, 102, 0.15);
            transition: background-color 0.2s, transform 0.2s;
        }

        .expert-profile-card .whatsapp-cta-btn:hover {
            background-color: #128c7e;
            transform: translateY(-2px);
        }

        /* 4. Section Title Headers */
        .section-title-wrapper {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-bottom: 35px;
            border-left: 2px solid var(--accent-color);
            padding-left: 15px;
        }

        .section-title-wrapper.center-align {
            align-items: center;
            border-left: none;
            padding-left: 0;
            text-align: center;
        }

        .section-title-wrapper h2 {
            font-size: 32px;
            font-weight: 500;
            color: var(--primary-color);
        }

        .section-subtitle-tag {
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 2px;
            color: var(--accent-dark);
        }

        /* 3D Route Map & Flight section */
        .overview-details-grid {
            display: grid;
            grid-template-columns: 1.25fr 1fr;
            gap: 30px;
            align-items: start;
        }

        .globe-wrapper {
            background-color: var(--bg-card);
            border: 1px solid var(--border-gold);
            padding: 25px;
            box-shadow: var(--shadow-sm);
        }

        #three-globe-container {
            width: 100%;
            height: 380px;
            cursor: grab;
            position: relative;
        }

        #three-globe-container:active {
            cursor: grabbing;
        }

        #three-globe-container canvas {
            display: block;
            width: 100% !important;
            height: 100% !important;
            outline: none;
        }

        .flight-legs-card {
            background-color: var(--bg-card);
            border: 1px solid var(--border-gold);
            padding: 30px;
            box-shadow: var(--shadow-sm);
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .flight-leg-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px dashed var(--border-color);
            padding-bottom: 20px;
        }

        .flight-leg-item:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }

        .carrier-badge-group {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .carrier-logo-ring {
            width: 38px;
            height: 38px;
            border-radius: var(--border-radius-full);
            background-color: var(--accent-light);
            border: 1px solid var(--border-gold);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }

        .carrier-name-block h4 {
            font-size: 16px;
            font-weight: 700;
            color: var(--primary-color);
            font-family: var(--font-body);
        }

        .carrier-name-block p {
            font-size: 11px;
            color: var(--text-secondary);
        }

        .flight-airport-node {
            text-align: right;
        }
        .flight-airport-node.dest {
            text-align: left;
        }

        .airport-code-text {
            font-family: var(--font-heading);
            font-size: 20px;
            font-weight: bold;
            color: var(--primary-color);
        }

        .airport-date-lbl {
            font-size: 11px;
            color: var(--accent-dark);
            font-weight: 500;
        }

        .flight-transit-bar {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0 20px;
            max-width: 140px;
        }

        .transit-line-bar {
            width: 100%;
            height: 1px;
            background-color: var(--accent-color);
            position: relative;
            margin: 6px 0;
        }

        .transit-line-bar::before, .transit-line-bar::after {
            content: "";
            position: absolute;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: var(--accent-dark);
            top: -2px;
        }
        .transit-line-bar::after { right: 0; }

        .transit-duration-text {
            font-size: 10px;
            color: var(--success);
            font-weight: 600;
            text-transform: uppercase;
        }

        .flight-notes-box {
            font-size: 12px;
            color: var(--text-secondary);
            background-color: var(--primary-light);
            padding: 15px;
            border-radius: var(--border-radius-sm);
            border: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        /* 5. Accommodations Sanctuary Redesign */
        .stays-list-container {
            display: flex;
            flex-direction: column;
            gap: 40px;
        }

        .editorial-villa-card {
            display: grid;
            grid-template-columns: 1.15fr 1fr;
            border: 1px solid var(--border-gold);
            background-color: var(--bg-card);
            overflow: hidden;
            box-shadow: var(--shadow-sm);
        }

        .villa-slider-column {
            position: relative;
            width: 100%;
            height: 100%;
            min-height: 380px;
            overflow: hidden;
            background-color: var(--primary-dark);
        }

        .slides-container {
            display: flex;
            width: 100%;
            height: 100%;
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .room-slide {
            min-width: 100%;
            height: 100%;
        }

        .room-slide img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .slider-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 36px;
            height: 36px;
            border-radius: var(--border-radius-full);
            background-color: rgba(255, 255, 255, 0.85);
            border: 1px solid var(--border-gold);
            color: var(--primary-color);
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            cursor: pointer;
            transition: all 0.2s;
            z-index: 10;
        }

        .slider-btn:hover {
            background-color: var(--primary-color);
            color: var(--accent-color);
            border-color: var(--accent-color);
        }

        .slider-btn.prev { left: 15px; }
        .slider-btn.next { right: 15px; }

        .slider-dots {
            position: absolute;
            bottom: 15px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 6px;
            z-index: 10;
        }

        .slider-dot {
            width: 6px;
            height: 6px;
            border-radius: var(--border-radius-full);
            background-color: rgba(255, 255, 255, 0.4);
            cursor: pointer;
            transition: all 0.25s;
        }

        .slider-dot.active {
            background-color: var(--accent-color);
            width: 15px;
        }

        .villa-details-column {
            padding: 35px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
        }

        .villa-header-block {
            border-bottom: 1px solid var(--border-gold);
            padding-bottom: 18px;
            margin-bottom: 20px;
        }

        .villa-badge {
            font-size: 10px;
            font-weight: 600;
            color: var(--accent-dark);
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 5px;
            display: inline-block;
        }

        .room-name {
            font-family: var(--font-heading);
            font-size: 30px;
            font-weight: 500;
            color: var(--primary-color);
            line-height: 1.2;
        }

        .room-meta-row {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 13px;
            color: var(--text-secondary);
            margin-top: 6px;
            flex-wrap: wrap;
        }

        .room-meal-plan {
            color: var(--accent-dark);
            font-weight: 600;
            text-transform: uppercase;
            font-size: 11px;
        }

        .amenity-header-title {
            font-family: var(--font-heading);
            font-size: 18px;
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 12px;
        }

        .room-amenities-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 20px;
        }

        .amenity-pill {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 13px;
        }

        .amenity-icon-box {
            width: 26px;
            height: 26px;
            border-radius: var(--border-radius-full);
            background-color: var(--accent-light);
            border: 1px solid var(--border-gold);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
        }

        .hotel-policy-foot {
            margin-top: auto;
            border-top: 1px solid var(--border-color);
            padding-top: 15px;
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .hotel-policy-foot .inc { color: var(--success); }
        .hotel-policy-foot .canc { color: var(--accent-dark); }

        /* 6. Day-by-Day Timeline */
        .timeline {
            position: relative;
            padding-left: 45px;
            margin-left: 20px;
            border-left: 1px solid var(--border-gold);
            display: flex;
            flex-direction: column;
            gap: 40px;
        }

        .day-node {
            position: relative;
        }

        .day-badge {
            position: absolute;
            left: -66px;
            top: 2px;
            width: 40px;
            height: 40px;
            border-radius: var(--border-radius-full);
            background: var(--bg-main);
            border: 1px solid var(--accent-color);
            color: var(--accent-dark);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 14px;
            z-index: 2;
            transition: all 0.3s;
            font-family: var(--font-heading);
            box-shadow: var(--shadow-sm);
        }

        .day-node:hover .day-badge {
            border-color: var(--primary-color);
            background: var(--accent-light);
            color: var(--primary-color);
        }

        .day-card {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow-sm);
            transition: border-color 0.3s;
        }

        .day-card:hover {
            border-color: var(--accent-color);
        }

        .day-card-header {
            background-color: var(--primary-light);
            padding: 20px 30px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .day-card-title {
            font-family: var(--font-heading);
            font-size: 22px;
            font-weight: 600;
            color: var(--primary-color);
        }

        .day-card-hotel {
            font-size: 10px;
            font-weight: 700;
            color: var(--accent-dark);
            text-transform: uppercase;
            letter-spacing: 1px;
            background: var(--accent-light);
            padding: 5px 14px;
            border: 1px solid var(--border-gold);
        }

        .activities-list {
            padding: 30px;
            display: flex;
            flex-direction: column;
            gap: 25px;
        }

        .activity-card {
            position: relative;
            padding: 24px;
            background: var(--bg-main);
            border: 1px solid var(--border-color);
            border-left: 4px solid var(--accent-color);
            display: flex;
            gap: 20px;
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .activity-card:hover {
            transform: translateX(4px);
            box-shadow: var(--shadow-sm);
        }

        .activity-card.flight { border-left-color: #ec4899; }
        .activity-card.hotel { border-left-color: #f43f5e; }
        .activity-card.transfer { border-left-color: #10b981; }
        .activity-card.sic { border-left-color: #8b5cf6; }
        .activity-card.tickets { border-left-color: #f59e0b; }
        .activity-card.private { border-left-color: #06b6d4; }
        .activity-card.meal { border-left-color: #22c55e; }
        .activity-card.leisure { border-left-color: #64748b; }
        .activity-card.cruise { border-left-color: #0284c7; }
        .activity-card.visa { border-left-color: #f97316; }
        .activity-card.sim_insurance { border-left-color: #0d9488; }

        .activity-icon-badge {
            width: 40px;
            height: 40px;
            border-radius: var(--border-radius-full);
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
            box-shadow: var(--shadow-sm);
        }

        .activity-body {
            flex: 1;
        }

        .activity-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .activity-lbl {
            font-weight: 700;
            font-size: 16px;
            color: var(--primary-color);
            font-family: var(--font-body);
        }

        .activity-desc {
            margin: 0;
            font-size: 13.5px;
            color: var(--text-secondary);
            line-height: 1.6;
        }

        .act-gallery {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            margin-top: 15px;
        }

        .act-gallery-img {
            width: 120px;
            height: 80px;
            object-fit: cover;
            border: 1px solid var(--border-color);
            cursor: pointer;
            transition: transform 0.3s;
        }

        .act-gallery-img:hover {
            transform: scale(1.04);
            border-color: var(--accent-color);
        }

        /* 7. Journey Map Tab */
        .map-card {
            background-color: var(--bg-card);
            border: 1px solid var(--border-gold);
            padding: 24px;
            box-shadow: var(--shadow-sm);
        }

        #journey-map {
            height: 550px;
            border: 1px solid var(--border-color);
        }

        .map-legend {
            display: flex;
            gap: 24px;
            justify-content: center;
            margin-top: 20px;
            font-size: 12px;
            color: var(--text-secondary);
            flex-wrap: wrap;
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .custom-pin-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            background: rgba(197, 160, 89, 0.2);
            border: 2px solid var(--accent-color);
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 0 10px rgba(197, 160, 89, 0.4);
            animation: pulseGlow 2s infinite;
        }

        .custom-pin-icon span {
            transform: rotate(45deg);
            font-size: 13px;
        }

        .custom-pin-icon.hotel {
            background: rgba(244, 63, 94, 0.2);
            border-color: #f43f5e;
            box-shadow: 0 0 10px rgba(244, 63, 94, 0.4);
        }

        .custom-map-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            text-shadow: 0 0 5px rgba(0,0,0,0.1);
        }

        @keyframes pulseGlow {
            0% { transform: rotate(-45deg) scale(1); }
            50% { transform: rotate(-45deg) scale(1.08); }
            100% { transform: rotate(-45deg) scale(1); }
        }

        /* 8. Curated Benefits & Inclusions */
        .lists-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
        }

        .list-box {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            padding: 35px;
            box-shadow: var(--shadow-sm);
        }

        .list-box h3 {
            margin-bottom: 20px;
            font-size: 18px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 1.5px solid var(--border-color);
            padding-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .list-box.inclusions h3 { color: var(--success); border-color: rgba(46, 125, 50, 0.15); }
        .list-box.exclusions h3 { color: var(--danger); border-color: rgba(211, 47, 47, 0.15); }

        .bullet-list {
            list-style: none;
        }

        .bullet-list li {
            margin-bottom: 12px;
            font-size: 13.5px;
            color: var(--text-secondary);
            position: relative;
            padding-left: 24px;
            line-height: 1.6;
        }

        .list-box.inclusions li::before {
            content: "✓";
            position: absolute;
            left: 0;
            color: var(--success);
            font-weight: bold;
        }

        .list-box.exclusions li::before {
            content: "✕";
            position: absolute;
            left: 0;
            color: var(--danger);
            font-weight: bold;
        }

        .terms-box {
            border: 1px dashed var(--border-gold);
            background-color: var(--accent-light);
            padding: 35px;
            box-shadow: var(--shadow-sm);
        }

        .terms-box h3 {
            font-size: 18px;
            font-weight: 700;
            color: var(--primary-color);
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 1.5px solid var(--border-gold);
            padding-bottom: 12px;
            margin-bottom: 20px;
        }

        .terms-box li::before {
            content: "•";
            position: absolute;
            left: 0;
            color: var(--accent-color);
            font-weight: bold;
        }

        /* 9. Billing Invoice Table Section */
        .reservation-dashboard-card {
            border: 1px solid var(--border-gold);
            background-color: var(--bg-card);
            padding: 40px;
            box-shadow: var(--shadow-md);
        }

        .dashboard-header-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border-gold);
            padding-bottom: 16px;
            margin-bottom: 24px;
        }

        .brand-crest-container {
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: var(--font-heading);
            font-size: 20px;
            font-weight: bold;
            color: var(--primary-color);
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .offer-timer-tag {
            font-size: 12px;
            font-weight: 600;
            color: var(--accent-dark);
            background-color: var(--accent-light);
            padding: 6px 14px;
            border: 1px solid var(--border-gold);
            letter-spacing: 0.5px;
        }

        .invoice-details-table {
            width: 100%;
            display: flex;
            flex-direction: column;
            margin-bottom: 30px;
        }

        .invoice-header-row {
            display: grid;
            grid-template-columns: 1.5fr 1fr 1fr;
            background-color: var(--primary-light);
            padding: 14px 20px;
            font-weight: 700;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--primary-color);
            border-bottom: 1px solid var(--border-color);
        }

        .invoice-body-row {
            display: grid;
            grid-template-columns: 1.5fr 1fr 1fr;
            padding: 20px;
            border-bottom: 1px solid var(--border-color);
            font-size: 13.5px;
            align-items: center;
        }

        .invoice-body-row .desc-cell {
            display: flex;
            flex-direction: column;
        }

        .invoice-body-row .desc-cell strong {
            color: var(--primary-color);
            font-size: 15px;
        }

        .invoice-body-row .sub-cell-text {
            font-size: 11px;
            color: var(--text-secondary);
            margin-top: 3px;
        }

        .invoice-body-row .stay-cell {
            display: flex;
            flex-direction: column;
            color: var(--text-main);
        }

        .invoice-body-row .price-cell {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }

        .old-price-strike {
            font-size: 13px;
            text-decoration: line-through;
            color: var(--text-muted);
        }

        .new-price-highlight {
            font-size: 18px;
            font-weight: 700;
            color: var(--accent-dark);
            font-family: var(--font-heading);
        }

        .invoice-footer-row {
            display: grid;
            grid-template-columns: 1.5fr 2fr;
            padding: 25px 20px;
            background-color: var(--accent-light);
            border-top: 1px solid var(--border-gold);
            align-items: start;
        }

        .terms-notes-column {
            display: flex;
            flex-direction: column;
            gap: 10px;
            font-size: 12.5px;
            color: var(--text-secondary);
        }

        .term-line strong {
            color: var(--primary-color);
        }

        .grand-total-block {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            text-align: right;
        }

        .total-label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: var(--text-secondary);
        }

        .total-value-text {
            font-family: var(--font-heading);
            font-size: 36px;
            font-weight: 700;
            color: var(--primary-color);
            line-height: 1.1;
            margin: 4px 0;
        }

        .tax-note-text {
            font-size: 10.5px;
            color: var(--text-muted);
            letter-spacing: 0.2px;
        }

        .reservation-actions-row {
            display: flex;
            justify-content: flex-end;
            gap: 15px;
            margin-top: 25px;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            border-radius: var(--border-radius-sm);
            border: none;
            padding: 12px 24px;
            cursor: pointer;
            transition: all 0.3s;
            font-family: var(--font-body);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .btn-primary {
            background-color: var(--primary-color);
            color: white;
            border: 1px solid var(--accent-color);
        }

        .btn-primary:hover {
            background-color: var(--accent-color);
            color: var(--primary-dark);
        }

        .btn-secondary {
            background-color: #25d366;
            color: white;
            box-shadow: 0 4px 10px rgba(37,211,102,0.15);
        }

        .btn-secondary:hover {
            background-color: #128c7e;
            transform: translateY(-2px);
        }

        /* Footer Details */
        .client-footer {
            background-color: var(--primary-dark);
            color: var(--text-muted);
            padding: 40px 20px;
            border-top: 1px solid var(--accent-color);
            text-align: center;
            font-size: 12px;
        }

        .footer-container {
            max-width: 1100px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .footer-links {
            display: flex;
            gap: 15px;
            justify-content: center;
            font-weight: 500;
        }

        /* 10. Luxury splitscreen entrance preloader */
        #luxury-preloader {
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            background: #03050a;
            z-index: 100000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            user-select: none;
            overflow: hidden;
        }

        .preloader-top, .preloader-bottom {
            position: absolute;
            left: 0; width: 100%; height: 50.5%;
            background: #03050a;
            transition: transform 1s cubic-bezier(0.85, 0, 0.15, 1);
        }
        .preloader-top { top: 0; border-bottom: 1px solid rgba(255,255,255,0.03); }
        .preloader-bottom { bottom: 0; border-top: 1px solid rgba(255,255,255,0.03); }

        .preloader-content {
            position: relative;
            z-index: 100002;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }

        .preloader-logo {
            font-family: var(--font-heading);
            font-size: 36px;
            font-weight: 700;
            letter-spacing: 3px;
            background: linear-gradient(135deg, #ffffff 40%, #c5a059 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-transform: uppercase;
            filter: drop-shadow(0 0 15px rgba(197, 160, 89, 0.1));
            opacity: 0;
            transform: translateY(20px);
        }

        .preloader-progress-bar {
            width: 240px;
            height: 2px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            overflow: hidden;
            position: relative;
            opacity: 0;
        }

        .preloader-progress-fill {
            position: absolute;
            top: 0; left: 0;
            width: 0%; height: 100%;
            background: linear-gradient(90deg, #fef08a 0%, #ca8a04 100%);
            box-shadow: 0 0 10px rgba(197, 160, 89, 0.4);
        }

        .preloader-counter {
            font-family: var(--font-body);
            font-size: 14px;
            font-weight: 600;
            color: var(--accent-color);
            letter-spacing: 1px;
            opacity: 0;
        }

        /* Lightbox modal overlay */
        .lightbox-modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(4, 5, 9, 0.98);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            justify-content: center;
            align-items: center;
            user-select: none;
        }

        .lightbox-close {
            position: absolute;
            top: 30px;
            right: 40px;
            color: var(--text-muted);
            font-size: 48px;
            font-weight: 300;
            cursor: pointer;
            transition: color 0.2s;
        }

        .lightbox-close:hover { color: white; }

        .lightbox-content-container {
            position: relative;
            max-width: 85%;
            max-height: 75%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .lightbox-content {
            max-width: 100%;
            max-height: 75vh;
            border-radius: var(--border-radius-md);
            border: 1px solid rgba(255,255,255,0.08);
            box-shadow: 0 25px 60px rgba(0,0,0,0.8);
            transform: scale(0.96);
            opacity: 0;
            transition: all 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .lightbox-content.active {
            transform: scale(1);
            opacity: 1;
        }

        .lightbox-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: white;
            width: 50px;
            height: 50px;
            border-radius: var(--border-radius-full);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            cursor: pointer;
            transition: all 0.3s;
            z-index: 10;
        }
        .lightbox-arrow:hover {
            background: var(--accent-color);
            border-color: var(--accent-color);
            box-shadow: 0 0 15px rgba(197, 160, 89, 0.4);
        }
        .lightbox-arrow.prev { left: -80px; }
        .lightbox-arrow.next { right: -80px; }

        .lightbox-caption {
            position: absolute;
            bottom: -60px;
            color: white;
            font-size: 14px;
            font-weight: 600;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255,255,255,0.08);
            padding: 8px 24px;
            border-radius: 30px;
            font-family: var(--font-heading);
            letter-spacing: 0.5px;
        }

        .lightbox-counter {
            position: absolute;
            top: -50px;
            color: var(--text-muted);
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 1px;
        }

        /* Responsive */
        @media (max-width: 960px) {
            .client-header-container {
                height: 70px;
            }
            .client-nav {
                display: none; /* simple stack or responsive hidden */
            }
            .cinematic-hero {
                height: 55vh;
            }
            .cinematic-hero .resort-title {
                font-size: 32px;
            }
            .cinematic-hero .guest-name {
                font-size: 24px;
            }
            .details-highlight-bar {
                flex-direction: column;
                gap: 15px;
                padding: 20px;
            }
            .highlight-divider {
                display: none;
            }
            .welcome-expert-grid {
                grid-template-columns: 1fr;
            }
            .overview-details-grid {
                grid-template-columns: 1fr;
            }
            .editorial-villa-card {
                grid-template-columns: 1fr;
            }
            .villa-slider-column {
                min-height: 280px;
            }
            .lists-grid {
                grid-template-columns: 1fr;
            }
            .invoice-header-row, .invoice-body-row {
                grid-template-columns: 1.2fr 1fr;
            }
            .invoice-header-row span:nth-child(2), .invoice-body-row .stay-cell {
                display: none;
            }
            .invoice-footer-row {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            .grand-total-block {
                align-items: flex-start;
                text-align: left;
            }
            .lightbox-arrow.prev { left: 10px; }
            .lightbox-arrow.next { right: 10px; }
            .lightbox-content-container { max-width: 95%; }
        }

        /* Printable PDF settings */
        @media print {
            @page {
                size: A4;
                margin: 15mm;
            }
            body {
                background: white !important;
                color: black !important;
            }
            .client-header, #luxury-preloader, .lightbox-modal, .reservation-actions-row {
                display: none !important;
            }
            .client-body-container {
                padding: 0 !important;
                gap: 30px !important;
            }
            .cinematic-hero {
                height: auto !important;
                background: white !important;
                color: black !important;
                padding: 20px 0 !important;
            }
            .hero-title-frame {
                border: none !important;
                background: white !important;
                color: black !important;
                outline: none !important;
            }
            .cinematic-hero .resort-title, .cinematic-hero .guest-name {
                color: black !important;
            }
            .editorial-villa-card {
                display: block !important;
                page-break-inside: avoid;
            }
            .villa-slider-column {
                display: none !important; /* Hide image slider on print to save paper */
            }
            .villa-details-column {
                border-left: none !important;
                padding: 10px 0 !important;
            }
            .welcome-expert-grid, .overview-details-grid {
                display: block !important;
            }
            .expert-profile-card {
                background: white !important;
                color: black !important;
                border: 1px solid var(--border-color) !important;
                margin-top: 20px;
                page-break-inside: avoid;
            }
            .expert-profile-card h3, .expert-profile-card p, .expert-profile-card .expert-intro-p {
                color: black !important;
            }
            .expert-profile-card .whatsapp-cta-btn {
                display: none !important;
            }
            .globe-wrapper {
                display: none !important; /* Hide 3D canvas on PDF */
            }
            .list-box {
                page-break-inside: avoid;
            }
            .invoice-footer-row {
                background: white !important;
                border-top: 1.5px solid black !important;
            }
        }
    </style>
</head>
<body>

<!-- Immersive Preloader Overlay -->
<div id="luxury-preloader">
    <div class="preloader-top"></div>
    <div class="preloader-bottom"></div>
    <div class="preloader-content">
        <div class="preloader-logo" id="preloader-brand-name">Solve Your Trip</div>
        <div class="preloader-progress-bar">
            <div class="preloader-progress-fill" id="preloader-progress-fill"></div>
        </div>
        <div class="preloader-counter" id="preloader-counter">0%</div>
    </div>
</div>

<!-- Sticky Header -->
<header class="client-header">
    <div class="client-header-container">
        <div class="company-logo">
            <img id="tpl-logo" src="/logo.jpg" alt="Agency Logo" class="logo-img">
            <div class="logo-text">
                <span class="logo-main" id="tpl-logo-text">Solve Your Trip</span>
                <span class="logo-sub">EXPLORE BESPOKE LUXURY</span>
            </div>
        </div>
        <nav class="client-nav">
            <a href="#sec-overview" class="nav-link">Overview</a>
            <a href="#sec-stays" class="nav-link" id="nav-link-stays">Sanctuary</a>
            <a href="#sec-timeline" class="nav-link">Timeline</a>
            <a href="#sec-journey" class="nav-link" id="nav-link-journey">The Journey</a>
            <a href="#sec-inclusions" class="nav-link" id="nav-link-inclusions">Inclusions</a>
            <a href="#sec-pricing" class="nav-link btn-nav-book">Book Proposal</a>
        </nav>
    </div>
</header>

<!-- 1. Cinematic Hero Section -->
<section class="cinematic-hero">
    <div class="hero-image-container">
        <img id="preview-hero-img" src="" alt="Resort Widescreen Cover" />
    </div>
    <div class="hero-overlay"></div>
    <div class="hero-frame-container">
        <div class="hero-title-frame">
            <p class="hero-pretitle">A PRIVATE COLLECTION EXCURSION</p>
            <h1 class="resort-title" id="tpl-destination">Destination</h1>
            <div class="hero-divider"></div>
            <p class="hero-subtitle">CURATED EXCLUSIVELY FOR</p>
            <h2 class="guest-name" id="tpl-guest-name">Valued Client</h2>
            <div class="hero-meta-badge-row">
                <span id="tpl-resort-tag" class="hero-badge">Private Collection</span>
                <span class="hero-badge-separator">•</span>
                <span id="tpl-resort-stars" class="hero-badge">5.0 (Luxury)</span>
                <span class="hero-badge-separator">•</span>
                <span id="tpl-dates" class="hero-badge">Dates Range</span>
            </div>
        </div>
    </div>
</section>

<!-- 2. Detail Highlights Compartment Bar -->
<section class="details-highlight-bar">
    <div class="highlight-item">
        <span class="highlight-lbl">Guests</span>
        <strong id="invoice-guests" class="highlight-val">-</strong>
    </div>
    <div class="highlight-divider"></div>
    <div class="highlight-item">
        <span class="highlight-lbl">Check-In</span>
        <strong id="invoice-check-in" class="highlight-val">-</strong>
    </div>
    <div class="highlight-divider"></div>
    <div class="highlight-item">
        <span class="highlight-lbl">Check-Out</span>
        <strong id="invoice-check-out" class="highlight-val">-</strong>
    </div>
    <div class="highlight-divider"></div>
    <div class="highlight-item">
        <span class="highlight-lbl">Duration</span>
        <strong id="invoice-duration" class="highlight-val">-</strong>
    </div>
    <div class="highlight-divider"></div>
    <div class="highlight-item">
        <span class="highlight-lbl">Reference Code</span>
        <strong id="invoice-refcode" class="highlight-val">-</strong>
    </div>
</section>

<!-- Scrollable Content Sections -->
<div class="client-body-container">

    <!-- 3. Welcome Letter & Expert Profile Section -->
    <section id="sec-overview" class="proposal-section scroll-anchor-section">
        <div class="welcome-expert-grid">
            <!-- Left: Personalized Welcome Greeting -->
            <div class="welcome-letter-card">
                <div>
                    <span class="greeting-badge">PERSONAL CONCIERGE</span>
                    <h2 class="welcome-greeting-title">Your Curated Vacation Sanctuary</h2>
                    <div class="welcome-letter-body">
                        <p>Dear <span id="welcome-letter-guest-name">Valued Client</span>,</p>
                        <p>
                            Welcome to your customized itinerary prepared by <strong>Solve Your Trip</strong>. 
                            We have hand-selected spectacular stops at <span id="welcome-letter-resort-name">your destination</span>, 
                            featuring premium accommodation suites, private transfers, and specialized occasion inclusions.
                        </p>
                        <p>
                            Our destination experts are committed to crafting perfect memories for you. 
                            Below, you will find complete details regarding your accommodation, private transit mapping, and curated inclusions. 
                            We look forward to welcoming you.
                        </p>
                    </div>
                </div>
                <div class="welcome-letter-signature">
                    <div class="sig-name" id="welcome-letter-expert-name">Solve Your Trip</div>
                    <div class="sig-title" id="welcome-letter-expert-title-sub">Travel Specialist</div>
                </div>
            </div>

            <!-- Right: Expert Profile Card -->
            <div class="expert-profile-card">
                <span class="greeting-badge">YOUR SPECIALIST</span>
                <div class="expert-header-info">
                    <div class="avatar-container">
                        <img src="" alt="Expert Avatar" class="expert-avatar" id="preview-expert-photo" />
                        <div class="avatar-ring"></div>
                    </div>
                    <h3 id="preview-expert-name">Travel Expert</h3>
                    <p id="preview-expert-title">Destination Specialist</p>
                    <p id="preview-expert-trips" class="expert-meta">Planned 1000+ trips</p>
                </div>
                <div class="expert-divider"></div>
                <p class="expert-intro-p" id="preview-expert-intro">
                    Dedicated to curating seamless luxury experiences. I am available to adapt this itinerary to your preference.
                </p>
                <a href="#" target="_blank" class="whatsapp-cta-btn" id="preview-expert-whatsapp-link">
                    💬 Connect on WhatsApp
                </a>
            </div>
        </div>
    </section>

    <!-- 4. Interactive 3D Globe & Flights -->
    <section class="proposal-section">
        <div class="section-title-wrapper">
            <p class="section-subtitle-tag">ROUTE GRAPHICS & FLIGHTS</p>
            <h2>The Journey Mapping</h2>
        </div>
        <div class="overview-details-grid">
            <!-- 3D Interactive WebGL Globe -->
            <div class="globe-wrapper" id="three-globe-wrapper" style="display: none;">
                <h3 class="amenity-header-title">Interactive 3D Globe</h3>
                <p style="margin-bottom: 15px; font-size: 13px; color: var(--text-secondary);">
                    Spin the interactive WebGL globe to view flight arches and destination stop pins.
                </p>
                <div id="three-globe-container"></div>
            </div>

            <!-- Flight Legs list -->
            <div class="flight-legs-card" id="tpl-flights-container" style="display: none;">
                <h3 class="amenity-header-title" id="tpl-flights-title">Flight Details</h3>
                <div id="tpl-flights-list">
                    <!-- Injected dynamically -->
                </div>
                <div class="flight-notes-box" id="tpl-flights-note-box">
                    <!-- Injected dynamically -->
                </div>
            </div>
        </div>
    </section>

    <!-- 5. Stays Accommodation Sanctuary -->
    <section id="sec-stays" class="proposal-section scroll-anchor-section" style="display: none;">
        <div class="section-title-wrapper center-align">
            <p class="section-subtitle-tag">VILLA ACCOMMODATION & SPECIFICATIONS</p>
            <h2>Stay Sanctuary</h2>
        </div>
        <div class="stays-list-container" id="tpl-hotels-list">
            <!-- Injected dynamically -->
        </div>
    </section>

    <!-- 6. Day-by-Day Timeline Section -->
    <section id="sec-timeline" class="proposal-section scroll-anchor-section">
        <div class="section-title-wrapper center-align">
            <p class="section-subtitle-tag">DAILY SCHEDULE & TOURS</p>
            <h2>Day-by-Day Customized Timeline</h2>
        </div>
        <div class="timeline" id="tpl-timeline-list">
            <!-- Injected dynamically -->
        </div>
    </section>

    <!-- 7. Route Map (Leaflet Light Version) -->
    <section id="sec-journey" class="proposal-section scroll-anchor-section" style="display: none;">
        <div class="section-title-wrapper center-align">
            <p class="section-subtitle-tag">MAP TRANSITS & STOPS</p>
            <h2>Interactive Journey Route Map</h2>
        </div>
        <div class="map-card">
            <div id="journey-map" style="height: 500px; border-radius: var(--border-radius-md);"></div>
            <div class="map-legend">
                <span class="legend-item"><span class="legend-icon">✈️</span> Flight Transit</span>
                <span class="legend-item"><span class="legend-icon">🚗</span> Land Taxi / Transfer</span>
                <span class="legend-item"><span class="legend-icon">🚢</span> Water Ferry / Cruise</span>
                <span class="legend-item"><span class="legend-icon">🏨</span> Hotel Stay</span>
                <span class="legend-item"><span class="legend-icon">📍</span> Sightseeing / Stop</span>
            </div>
        </div>
    </section>

    <!-- 8. Curated Benefits & Inclusions -->
    <section id="sec-inclusions" class="proposal-section scroll-anchor-section">
        <div class="section-title-wrapper">
            <p class="section-subtitle-tag">INCLUSIONS, EXCLUSIONS & POLICIES</p>
            <h2>Benefits Sanctuary</h2>
        </div>
        <div class="lists-grid">
            <div id="tpl-inclusions-box" class="list-box inclusions" style="display: none;">
                <h3>Inclusions</h3>
                <ul class="bullet-list" id="tpl-inclusions-list"></ul>
            </div>
            
            <div id="tpl-exclusions-box" class="list-box exclusions" style="display: none;">
                <h3>Exclusions</h3>
                <ul class="bullet-list" id="tpl-exclusions-list"></ul>
            </div>
        </div>
        <div id="tpl-terms-box" class="terms-box" style="display: none; margin-top: 30px;">
            <h3>Terms, Conditions & Booking Notes</h3>
            <ul class="bullet-list" id="tpl-terms-list"></ul>
        </div>
    </section>

    <!-- 9. Invoice Pricing Summary -->
    <section id="sec-pricing" class="proposal-section scroll-anchor-section">
        <div class="section-title-wrapper center-align">
            <p class="section-subtitle-tag">RESERVATION & BOOKING SUMMARY</p>
            <h2>Bespoke Pricing Invoice</h2>
        </div>
        
        <div class="reservation-dashboard-card">
            <div class="dashboard-header-bar">
                <div class="brand-crest-container">
                    <span>Solve Your Trip</span>
                </div>
                <div class="offer-timer-tag" id="invoice-valid-till">
                    ⌛ Proposal Valid Until: TBD
                </div>
            </div>

            <div class="invoice-details-table">
                <div class="invoice-header-row">
                    <span>Description</span>
                    <span>Stay Period / Info</span>
                    <span style="text-align: right;">Price Summary</span>
                </div>
                <div id="invoice-items-list">
                    <!-- Injected dynamically -->
                </div>
                <div class="invoice-footer-row">
                    <div class="terms-notes-column">
                        <div class="term-line" id="invoice-payment-deadline-box" style="display: none;">
                            📌 Booking Deadline: <strong id="invoice-payment-deadline">TBD</strong>
                        </div>
                        <div class="term-line" id="invoice-cancel-policy-box" style="display: none;">
                            📌 Cancellation Policy: <span id="invoice-cancel-policy">TBD</span>
                        </div>
                    </div>
                    <div class="grand-total-block">
                        <span class="total-label" id="tpl-pricing-label">Grand Total</span>
                        <strong class="total-value-text" id="invoice-price-grand">INR 0.00</strong>
                        <span class="tax-note-text">Inclusive of all green taxes, service charges & resort fees</span>
                    </div>
                </div>
            </div>

            <div class="reservation-actions-row">
                <button class="btn btn-primary" onclick="requestQuoteAdjustment()">Request Customizations</button>
                <a href="#" target="_blank" class="btn btn-secondary" id="footer-book-btn">Approve & Book Now</a>
            </div>
        </div>
    </section>

</div>

<!-- Footer -->
<footer class="client-footer">
    <div class="footer-container">
        <p>© 2026 Solve Your Trip Technologies Pvt. Ltd. | Explore Bespoke Luxury.</p>
        <div class="footer-links">
            <span>Terms of Service</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Booking Guide</span>
        </div>
    </div>
</footer>

<!-- Lightbox Modal Slider -->
<div id="custom-lightbox" class="lightbox-modal">
    <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
    <div class="lightbox-content-container">
        <button class="lightbox-arrow prev" onclick="prevSlide(event)">&larr;</button>
        <div class="lightbox-counter" id="lightbox-counter">1 / 1</div>
        <img class="lightbox-content" id="lightbox-img">
        <div class="lightbox-caption" id="lightbox-caption"></div>
        <button class="lightbox-arrow next" onclick="nextSlide(event)">&rarr;</button>
    </div>
</div>

<!-- CLIENT ADJUSTMENT REQUEST MODAL -->
<div id="adjustment-modal" style="display: none; position: fixed; z-index: 200000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(4, 5, 9, 0.85); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); justify-content: center; align-items: center;">
    <div style="background: white; border: 1px solid var(--accent-color); padding: 35px; width: 90%; max-width: 500px; box-shadow: var(--shadow-lg);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid var(--border-color); padding-bottom: 12px; margin-bottom: 20px;">
            <h3 style="font-size: 20px; font-weight: 600; color: var(--primary-color);">Request Quote Adjustments</h3>
            <span style="font-size: 24px; cursor: pointer; color: var(--text-muted);" onclick="closeAdjustmentModal()">&times;</span>
        </div>
        <form id="adjustment-form" onsubmit="submitAdjustmentRequest(event)">
            <div style="display: flex; flex-direction: column; gap: 5px; margin-bottom: 15px;">
                <label style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">What changes would you like?</label>
                <textarea id="adj-message" rows="4" style="font-family: var(--font-body); font-size: 13px; padding: 10px; border: 1px solid var(--border-color); background: var(--bg-main); outline: none;" placeholder="e.g. Can we change dates or upgrade hotel options?" required></textarea>
            </div>
            <div style="display: flex; flex-direction: column; gap: 5px; margin-bottom: 20px;">
                <label style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Your Contact Phone</label>
                <input type="text" id="adj-client-phone" style="font-family: var(--font-body); font-size: 13px; padding: 10px; border: 1px solid var(--border-color); background: var(--bg-main); outline: none;" placeholder="e.g. +91 98765 43210" required />
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
                <button type="button" class="btn btn-primary" style="background: transparent; color: var(--primary-color); border: 1px solid var(--border-color);" onclick="closeAdjustmentModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Send via WhatsApp</button>
            </div>
        </form>
    </div>
</div>

<script>window.itineraryData = ${JSON.stringify(data, null, 2)};</script>

<script>
// Category Icons Map
const CATEGORY_ICONS = {
    transfer: '🚗',
    sic: '🎟️',
    private: '⭐',
    tickets: '🎫',
    flight: '✈️',
    hotel: '🏨',
    cruise: '🚢',
    meal: '🍽️',
    visa: '🛂',
    sim_insurance: '📱',
    leisure: '🌴'
};

// Global Lightbox Slideshow State
let lightboxImages = [];
let currentImageIndex = 0;

function openActLightbox(src, caption = '') {
    const lightbox = document.getElementById('custom-lightbox');
    lightboxImages = [];
    currentImageIndex = 0;
    
    // Find images in room slide or current gallery
    let parentCard = event.currentTarget.closest('.act-gallery') || event.currentTarget.closest('.slides-container');
    if (parentCard) {
        const imgs = parentCard.querySelectorAll('img');
        imgs.forEach((img, idx) => {
            lightboxImages.push({
                src: img.src,
                caption: caption || 'Photo'
            });
            if (img.src === src) {
                currentImageIndex = idx;
            }
        });
    } else {
        lightboxImages.push({ src: src, caption: caption });
    }
    
    updateLightboxSlide();
    lightbox.style.display = 'flex';
}

function updateLightboxSlide() {
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');
    const counter = document.getElementById('lightbox-counter');
    const prevBtn = document.querySelector('.lightbox-arrow.prev');
    const nextBtn = document.querySelector('.lightbox-arrow.next');
    
    img.classList.remove('active');
    
    if (lightboxImages.length <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (counter) counter.style.display = 'none';
    } else {
        if (prevBtn) prevBtn.style.display = 'flex';
        if (nextBtn) nextBtn.style.display = 'flex';
        if (counter) counter.style.display = 'block';
    }
    
    setTimeout(() => {
        const currentSlide = lightboxImages[currentImageIndex];
        img.src = currentSlide.src;
        cap.textContent = currentSlide.caption;
        counter.textContent = \`\${currentImageIndex + 1} / \${lightboxImages.length}\`;
        img.classList.add('active');
    }, 150);
}

function prevSlide(e) {
    e.stopPropagation();
    if (lightboxImages.length <= 1) return;
    currentImageIndex = (currentImageIndex - 1 + lightboxImages.length) % lightboxImages.length;
    updateLightboxSlide();
}

function nextSlide(e) {
    e.stopPropagation();
    if (lightboxImages.length <= 1) return;
    currentImageIndex = (currentImageIndex + 1) % lightboxImages.length;
    updateLightboxSlide();
}

function closeLightbox() {
    document.getElementById('custom-lightbox').style.display = 'none';
}

document.getElementById('custom-lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'custom-lightbox' || e.target.classList.contains('lightbox-content-container')) {
        closeLightbox();
    }
});

// Close Adjustment modal
function closeAdjustmentModal() {
    document.getElementById('adjustment-modal').style.display = 'none';
}

function requestQuoteAdjustment() {
    document.getElementById('adjustment-modal').style.display = 'flex';
}

function submitAdjustmentRequest(e) {
    e.preventDefault();
    const data = window.itineraryData;
    const msg = document.getElementById('adj-message').value;
    const phone = document.getElementById('adj-client-phone').value;
    const ref = data.refCodes || '';
    const text = \`Hi, I am reviewing my quote Ref: \${ref} for \${data.destination || 'Trip'}. I would like to request changes: \${msg}. My contact is \${phone}.\`;
    
    const agencyPhone = (data.companyDetails?.phone || '').replace(/[^0-9]/g, '') || '916280975235';
    window.open(\`https://wa.me/\${agencyPhone}?text=\${encodeURIComponent(text)}\`, '_blank');
    closeAdjustmentModal();
}

// Room sliders state
let roomSliderIndices = {};

function moveRoomSlide(roomIdx, direction) {
    const slider = document.getElementById(\`slides-container-\${roomIdx}\`);
    if (!slider) return;
    const slides = slider.querySelectorAll('.room-slide');
    const total = slides.length;
    if (total <= 1) return;
    
    let currentIdx = roomSliderIndices[roomIdx] || 0;
    currentIdx = (currentIdx + direction + total) % total;
    roomSliderIndices[roomIdx] = currentIdx;
    
    slider.style.transform = \`translateX(-\${currentIdx * 100}%)\`;
    
    // Update dots
    const dots = document.querySelectorAll(\`#slider-dots-\${roomIdx} .slider-dot\`);
    dots.forEach((dot, dIdx) => {
        if (dIdx === currentIdx) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}

function setRoomSlide(roomIdx, slideIdx) {
    const slider = document.getElementById(\`slides-container-\${roomIdx}\`);
    if (!slider) return;
    roomSliderIndices[roomIdx] = slideIdx;
    slider.style.transform = \`translateX(-\${slideIdx * 100}%)\`;
    const dots = document.querySelectorAll(\`#slider-dots-\${roomIdx} .slider-dot\`);
    dots.forEach((dot, dIdx) => {
        if (dIdx === slideIdx) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const data = window.itineraryData;
    if (!data) {
        console.error("No itinerary data injected.");
        return;
    }

    // 1. Tab and page title
    document.title = \`Luxury customized travel quote | \${data.destination || 'Trip'} Itinerary\`;

    // 2. Logo & Header
    const logoImg = document.getElementById('tpl-logo');
    logoImg.src = data.companyDetails?.logoUrl || '/logo.jpg';
    
    const logoTextMain = document.getElementById('tpl-logo-text');
    if (logoTextMain && data.companyDetails?.name) {
        logoTextMain.textContent = data.companyDetails.name;
    }

    // 3. Cover page & Widescreen Hero
    document.getElementById('tpl-destination').textContent = data.destination || 'Custom Itinerary';
    document.getElementById('tpl-guest-name').textContent = data.clientName || 'Valued Client';
    document.getElementById('welcome-letter-guest-name').textContent = data.clientName || 'Valued Client';
    document.getElementById('welcome-letter-resort-name').textContent = data.destination || 'your destination';

    const totalNights = data.days ? (data.days.length - 1) : 0;
    const totalDays = data.days ? data.days.length : 0;
    
    const startDateFormatted = formatDate(data.startDate);
    const endDateFormatted = formatDate(data.endDate);
    const datesRangeText = startDateFormatted && endDateFormatted ? \`\${startDateFormatted} - \${endDateFormatted}\` : 'Dates TBD';
    document.getElementById('tpl-dates').textContent = datesRangeText;

    if (data.refCodes) {
        document.getElementById('invoice-refcode').textContent = data.refCodes;
    } else {
        document.getElementById('invoice-refcode').parentElement.style.display = 'none';
    }

    // 4. Compartments highlights bar
    document.getElementById('invoice-guests').textContent = data.paxCount || '2 Guests';
    document.getElementById('invoice-check-in').textContent = startDateFormatted || 'TBD';
    document.getElementById('invoice-check-out').textContent = endDateFormatted || 'TBD';
    document.getElementById('invoice-duration').textContent = \`\${totalNights} Nights / \${totalDays} Days\`;

    // 5. Hero Background image resolution
    let heroImgSrc = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80'; // default luxury beach
    if (data.hotels && data.hotels[0] && data.hotels[0].rooms && data.hotels[0].rooms[0] && data.hotels[0].rooms[0].image) {
        heroImgSrc = data.hotels[0].rooms[0].image;
    } else if (data.days) {
        for (const day of data.days) {
            if (day.activities) {
                for (const act of day.activities) {
                    if (act.roomImages && act.roomImages[0]) {
                        heroImgSrc = act.roomImages[0];
                        break;
                    }
                }
            }
            if (heroImgSrc !== 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80') break;
        }
    }
    document.getElementById('preview-hero-img').src = heroImgSrc;

    // 6. Expert Details
    const expertName = data.expert?.name || 'Solve Your Trip Team';
    const expertTitle = data.expert?.title || 'Travel Concierge Specialist';
    const expertTrips = data.expert?.tripsCount || 'Planned 1000+ trips';
    const expertIntro = data.expert?.intro || 'Dedicated to curating seamless luxury experiences. I am available to adapt this itinerary to your preference.';
    const expertPhoto = data.expert?.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';
    
    document.getElementById('preview-expert-photo').src = expertPhoto;
    document.getElementById('preview-expert-name').textContent = expertName;
    document.getElementById('preview-expert-title').textContent = expertTitle;
    document.getElementById('preview-expert-trips').textContent = expertTrips;
    document.getElementById('preview-expert-intro').textContent = expertIntro;
    
    document.getElementById('welcome-letter-expert-name').textContent = expertName;
    document.getElementById('welcome-letter-expert-title-sub').textContent = expertTitle;

    const waText = \`Hi, I am reviewing my quote Ref: \${data.refCodes || ''} for \${data.destination || 'Trip'}. I would like to discuss it.\`;
    const cleanPhone = (data.expert?.whatsapp || data.companyDetails?.phone || '916280975235').replace(/[^0-9]/g, '');
    document.getElementById('preview-expert-whatsapp-link').href = \`https://wa.me/\${cleanPhone}?text=\${encodeURIComponent(waText)}\`;
    document.getElementById('footer-book-btn').href = \`https://wa.me/\${cleanPhone}?text=\${encodeURIComponent('I approve and want to book my quote Ref: ' + (data.refCodes || ''))}\`;

    // Helper: Date Format
    function formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return d.toLocaleDateString('en-GB', options);
    }
    
    function formatDayHeaderDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const options = { weekday: 'short', day: '2-digit', month: 'short' };
        return d.toLocaleDateString('en-GB', options);
    }

    // 7. Accommodations (Stays) Render
    const hotelsSection = document.getElementById('sec-stays');
    const hotelsList = document.getElementById('tpl-hotels-list');
    const showHotelCosts = data.pricing?.showHotelCosts === true;
    const currency = data.pricing?.currencySymbol || 'INR';
    
    if (data.hotels && data.hotels.length > 0) {
        hotelsSection.style.display = 'block';
        document.getElementById('nav-link-stays').style.display = 'inline-block';
        hotelsList.innerHTML = '';
        
        data.hotels.forEach((hotel, idx) => {
            const hotelDiv = document.createElement('div');
            hotelDiv.className = 'editorial-villa-card';
            
            // Build Slides HTML
            let slidesHtml = '';
            let dotsHtml = '';
            let roomPhotos = [];
            
            // Collect all unique room photos
            (hotel.rooms || []).forEach(room => {
                if (room.image && !roomPhotos.includes(room.image)) {
                    roomPhotos.push(room.image);
                }
            });
            
            // Fallback default hotel images if no room photos
            if (roomPhotos.length === 0) {
                roomPhotos = [
                    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500',
                    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500',
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'
                ];
            }
            
            roomPhotos.forEach((src, pIdx) => {
                slidesHtml += \`
                    <div class="room-slide">
                        <img src="\${src}" onclick="openActLightbox(this.src, '\${(hotel.name || '').replace(/'/g, "\\\\'")}')" />
                    </div>
                \`;
                dotsHtml += \`
                    <span class="slider-dot \${pIdx === 0 ? 'active' : ''}" onclick="setRoomSlide(\${idx}, \${pIdx})"></span>
                \`;
            });
            
            const roomsListHtml = (hotel.rooms || []).map(room => {
                const nameVal = typeof room === 'string' ? room : room.name;
                return \`
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding: 8px 0; font-size: 13.5px;">
                        <span>• \${nameVal}</span>
                        \${showHotelCosts && room.price ? \`<span style="color: var(--accent-dark); font-weight: 700;">\${currency} \${room.price}</span>\` : ''}
                    </div>
                \`;
            }).join('');
            
            // Amenities dictionary mapping
            const sampleAmenities = ['Ocean View', 'Private Deck', 'Direct Lagoon Access', 'Air Conditioning', 'Free Wi-Fi', 'Outdoor Bathtub'];
            const amenitiesHtml = sampleAmenities.map(am => \`
                <div class="amenity-pill">
                    <div class="amenity-icon-box">⭐</div>
                    <span>\${am}</span>
                </div>
            \`).join('');

            hotelDiv.innerHTML = \`
                <div class="villa-slider-column">
                    <div class="room-photo-slider">
                        <div class="slides-container" id="slides-container-\${idx}">
                            \${slidesHtml}
                        </div>
                        \${roomPhotos.length > 1 ? \`
                            <button class="slider-btn prev" onclick="moveRoomSlide(\${idx}, -1)">&larr;</button>
                            <button class="slider-btn next" onclick="moveRoomSlide(\${idx}, 1)">&rarr;</button>
                            <div class="slider-dots" id="slider-dots-\${idx}">
                                \${dotsHtml}
                            </div>
                        \` : ''}
                    </div>
                </div>
                <div class="villa-details-column">
                    <div class="villa-header-block">
                        <span class="villa-badge">Stay Sanctuary</span>
                        <h3 class="room-name">\${hotel.name || 'Luxury Suite stay'}</h3>
                        <div class="room-meta-row">
                            <span>Stay Period: <strong>\${hotel.checkIn || ''} - \${hotel.checkOut || ''}</strong></span>
                            <span>| Duration: <strong>\${hotel.nights || 0} Night\${hotel.nights !== 1 ? 's' : ''}</strong></span>
                        </div>
                    </div>
                    
                    <div class="rooms-details-list" style="margin-bottom: 20px;">
                        <h4 class="amenity-header-title">Rooms Confirmed</h4>
                        \${roomsListHtml}
                    </div>

                    <div style="margin-bottom: 20px;">
                        <h4 class="amenity-header-title">Villa Specs & Comforts</h4>
                        <div class="room-amenities-grid">
                            \${amenitiesHtml}
                        </div>
                    </div>

                    <div class="hotel-policy-foot">
                        <span class="inc">🍳 \${hotel.inclusions || 'Breakfast Included'}</span>
                        <span class="canc">🛡️ \${hotel.cancellation || 'Free Cancellation'}</span>
                    </div>
                </div>
            \`;
            hotelsList.appendChild(hotelDiv);
            roomSliderIndices[idx] = 0; // init slider tracker
        });
    } else {
        hotelsSection.style.display = 'none';
        document.getElementById('nav-link-stays').style.display = 'none';
    }

    // 8. Day-by-Day Timeline Render
    const timelineList = document.getElementById('tpl-timeline-list');
    timelineList.innerHTML = '';
    
    if (data.days && data.days.length > 0) {
        let baseDate = data.startDate ? new Date(data.startDate) : null;
        
        data.days.forEach((day, index) => {
            const dayNode = document.createElement('div');
            dayNode.className = 'day-node';
            
            let dayDateText = '';
            if (baseDate) {
                const currentDayDate = new Date(baseDate);
                currentDayDate.setDate(baseDate.getDate() + index);
                dayDateText = \` - \${formatDayHeaderDate(currentDayDate)}\`;
            }
            
            const hotelTextHtml = day.hotelText 
                ? \`<div class="day-card-hotel">Stay: \${day.hotelText}</div>\`
                : '';
                
            const activitiesHtml = (day.activities || []).map(act => {
                const actTypeClass = (act.type || 'leisure').toLowerCase();
                const icon = CATEGORY_ICONS[actTypeClass] || '⭐';
                
                let galleryHtml = '';
                if (act.roomImages && act.roomImages.length > 0) {
                    galleryHtml = \`
                        <div class="act-gallery">
                            \${act.roomImages.map(imgSrc => \`<img class="act-gallery-img" src="\${imgSrc}" onclick="openActLightbox(this.src, '\${(act.title || 'Activity').replace(/'/g, "\\\\'")}')">\`).join('')}
                        </div>
                    \`;
                }
                
                return \`
                    <div class="activity-card \${actTypeClass}">
                        <div class="activity-icon-badge">\${icon}</div>
                        <div class="activity-body">
                            <div class="activity-head">
                                <div class="activity-lbl">\${act.title || 'Activity'}</div>
                            </div>
                            \${act.desc ? \`<p class="activity-desc">\${act.desc}</p>\` : ''}
                            \${galleryHtml}
                        </div>
                    </div>
                \`;
            }).join('');
            
            dayNode.innerHTML = \`
                <div class="day-badge">\${day.dayNum || (index + 1)}</div>
                <div class="day-card">
                    <div class="day-card-header">
                        <div class="day-card-title">Day \${day.dayNum || (index + 1)}\${dayDateText}</div>
                        \${hotelTextHtml}
                    </div>
                    <div class="activities-list">
                        \${activitiesHtml || '<div style="font-size: 13.5px; color: var(--text-muted); font-style: italic; text-align: center; padding: 15px;">🌴 Leisure day / Self-exploration.</div>'}
                    </div>
                </div>
            \`;
            timelineList.appendChild(dayNode);
        });
    }

    // 9. Flights & 3D Globe Coordinate calculations
    const COORDINATES_DB = {
        'DEL': [28.5562, 77.1000],
        'SIN': [1.3644, 103.9915],
        'DPS': [-8.7482, 115.1671],
        'HAN': [21.2212, 105.8072],
        'DAD': [16.0439, 108.1994],
        'SGN': [10.8185, 106.6517],
        'MLE': [4.1918, 73.5291],
        'SINGAPORE': [1.3521, 103.8198],
        'MARINA BAY SANDS': [1.2829, 103.8586],
        'GARDENS BY THE BAY': [1.2816, 103.8636],
        'UNIVERSAL STUDIOS': [1.2540, 103.8238],
        'SENTOSA': [1.2494, 103.8303],
        'NIGHT SAFARI': [1.4022, 103.7880],
        'CABLE CAR': [1.2647, 103.8174],
        'BALI': [-8.4095, 115.1889],
        'UBUD': [-8.5069, 115.2625],
        'ULUWATU': [-8.8291, 115.0849],
        'NUSA PENIDA': [-8.7278, 115.4827],
        'AYUNG RIVER': [-8.5307, 115.2638],
        'SEMINYAK': [-8.6913, 115.1682],
        'VIETNAM': [14.0583, 108.2772],
        'HANOI': [21.0285, 105.8542],
        'HA LONG BAY': [20.9754, 107.0469],
        'DA NANG': [16.0544, 108.2022],
        'GOLDEN BRIDGE': [15.9984, 107.9959],
        'BA NA HILLS': [15.9984, 107.9959],
        'HOI AN': [15.8801, 108.3380],
        'HO CHI MINH': [10.8231, 106.6297],
        'CU CHI TUNNELS': [11.1424, 106.4632],
        'MALDIVES': [3.2028, 73.2207],
        'MALE': [4.1755, 73.5093],
        'MAAFUSHI': [3.9454, 73.4897],
        'HURAWALHI': [5.5212, 73.4371],
        'MEERU': [4.4533, 73.7167]
    };

    function getCoordinates(name, destination) {
        if (!name) return null;
        const normalized = name.toUpperCase().trim();
        for (const key in COORDINATES_DB) {
            if (normalized.includes(key)) {
                return COORDINATES_DB[key];
            }
        }
        const airportMatch = normalized.match(/\\b([A-Z]{3})\\b/);
        if (airportMatch && COORDINATES_DB[airportMatch[1]]) {
            return COORDINATES_DB[airportMatch[1]];
        }
        const destNormalized = (destination || '').toUpperCase().trim();
        for (const key in COORDINATES_DB) {
            if (destNormalized.includes(key)) {
                const base = COORDINATES_DB[key];
                return [base[0] + (Math.random() - 0.5) * 0.04, base[1] + (Math.random() - 0.5) * 0.04];
            }
        }
        return null;
    }

    function detectTransitMode(title, desc, type) {
        const text = ((title || '') + ' ' + (desc || '') + ' ' + (type || '')).toLowerCase();
        if (text.includes('flight') || text.includes('✈') || text.includes('airline') || text.includes('airways')) {
            return { mode: 'flight', icon: '✈️', color: '#c5a059' };
        }
        if (text.includes('boat') || text.includes('ferry') || text.includes('cruise') || text.includes('speedboat') || text.includes('sail') || text.includes('reef') || text.includes('snorkeling')) {
            return { mode: 'boat', icon: '🚢', color: '#0284c7' };
        }
        return { mode: 'taxi', icon: '🚗', color: '#10b981' };
    }

    const routeNodes = [];

    // Parse flights
    const flightsContainer = document.getElementById('tpl-flights-container');
    const flightsList = document.getElementById('tpl-flights-list');
    const flightsNoteBox = document.getElementById('tpl-flights-note-box');
    
    if (data.flights && data.flights.legs && data.flights.legs.length > 0) {
        flightsContainer.style.display = 'flex';
        if (data.flights.title) {
            document.getElementById('tpl-flights-title').textContent = data.flights.title;
        }
        
        flightsList.innerHTML = '';
        data.flights.legs.forEach(leg => {
            const orgCode = (leg.originAirport || '').substring(0, 3).toUpperCase();
            const dstCode = (leg.destAirport || '').substring(0, 3).toUpperCase();
            const orgCoords = getCoordinates(orgCode, data.destination);
            const dstCoords = getCoordinates(dstCode, data.destination);
            
            if (orgCoords && !routeNodes.some(n => n.name === orgCode)) {
                routeNodes.push({ name: orgCode, coords: orgCoords, type: 'airport', label: leg.originAirport || orgCode });
            }
            if (dstCoords && !routeNodes.some(n => n.name === dstCode)) {
                routeNodes.push({ name: dstCode, coords: dstCoords, type: 'airport', label: leg.destAirport || dstCode });
            }

            const flightRow = document.createElement('div');
            flightRow.className = 'flight-leg-item';
            flightRow.innerHTML = \`
                <div class="carrier-badge-group">
                    <div class="carrier-logo-ring">✈️</div>
                    <div class="carrier-name-block">
                        <h4>\${leg.type || 'Flight'}: \${leg.route || ''}</h4>
                        <p>\${leg.carrier || ''}</p>
                    </div>
                </div>
                <div class="flight-airport-node">
                    <div class="airport-code-text">\${leg.originAirport || ''}</div>
                    <div class="airport-date-lbl">\${leg.originDate || ''}</div>
                </div>
                <div class="flight-transit-bar">
                    <div class="transit-line-bar"></div>
                    <span class="transit-duration-text">\${leg.duration || 'Direct'}</span>
                </div>
                <div class="flight-airport-node dest">
                    <div class="airport-code-text">\${leg.destAirport || ''}</div>
                    <div class="airport-date-lbl">\${leg.destDate || ''}</div>
                </div>
            \`;
            flightsList.appendChild(flightRow);
        });

        flightsNoteBox.innerHTML = '';
        if (data.flights.note) {
            const div = document.createElement('div');
            div.innerHTML = \`🎒 <strong>Inclusions & Baggage:</strong> \${data.flights.note}\`;
            flightsNoteBox.appendChild(div);
        }
        if (data.flights.warning) {
            const div = document.createElement('div');
            div.style.color = 'var(--accent-red)';
            div.style.fontWeight = '600';
            div.innerHTML = \`⚠️ Note: \${data.flights.warning}\`;
            flightsNoteBox.appendChild(div);
        }
    } else {
        flightsContainer.style.display = 'none';
    }

    // Parse Hotel coordinates
    if (data.hotels && data.hotels.length > 0) {
        data.hotels.forEach(hotel => {
            const coords = getCoordinates(hotel.name, data.destination);
            if (coords) {
                routeNodes.push({ name: hotel.name, coords: coords, type: 'hotel', label: hotel.name });
            }
        });
    }

    // Parse day activities coordinates
    if (data.days && data.days.length > 0) {
        data.days.forEach((day, dIdx) => {
            if (day.activities && day.activities.length > 0) {
                day.activities.forEach((act, aIdx) => {
                    const coords = getCoordinates(act.title, data.destination);
                    if (coords && !routeNodes.some(n => n.name === act.title)) {
                        routeNodes.push({
                            name: act.title,
                            coords: coords,
                            type: 'activity',
                            label: act.title,
                            dayNum: day.dayNum || (dIdx + 1),
                            desc: act.desc
                        });
                    }
                });
            }
        });
    }

    // 10. WebGL 3D Globe Render (Transparent alpha mode)
    let isWebGLSupported = true;
    try {
        const testCanvas = document.createElement('canvas');
        isWebGLSupported = !!(window.WebGLRenderingContext && (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')));
    } catch (e) {
        isWebGLSupported = false;
    }

    if (isWebGLSupported && routeNodes.length >= 2) {
        document.getElementById('three-globe-wrapper').style.display = 'block';
        initThreeGlobe(routeNodes);
    }

    function initThreeGlobe(nodes) {
        const container = document.getElementById('three-globe-container');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        const scene = new THREE.Scene();
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);
        
        const dirLight = new THREE.DirectionalLight(0xc5a059, 1.0);
        dirLight.position.set(5, 5, 5);
        scene.add(dirLight);
        
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 0, 150);
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);
        
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false; // keep layout stable
        
        const globeGroup = new THREE.Group();
        scene.add(globeGroup);
        
        const GlobeRadius = 46;
        
        // Earth solid core (white-cream for light theme)
        const earthGeom = new THREE.SphereGeometry(GlobeRadius - 0.2, 64, 64);
        const earthMat = new THREE.MeshBasicMaterial({ color: 0xfbfaf6 });
        const earth = new THREE.Mesh(earthGeom, earthMat);
        globeGroup.add(earth);
        
        // Earth luxury gold wireframe grid
        const wireGeom = new THREE.SphereGeometry(GlobeRadius, 32, 32);
        const wireMat = new THREE.MeshBasicMaterial({
            color: 0xc5a059,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        const wireGlobe = new THREE.Mesh(wireGeom, wireMat);
        globeGroup.add(wireGlobe);
        
        function latLngToVector3(lat, lng, radius) {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lng + 180) * (Math.PI / 180);
            const x = -(radius * Math.sin(phi) * Math.sin(theta));
            const y = radius * Math.cos(phi);
            const z = radius * Math.sin(phi) * Math.cos(theta);
            return new THREE.Vector3(x, y, z);
        }
        
        const animateParticles = [];
        
        // Plot markers on globe
        nodes.forEach(node => {
            const pos = latLngToVector3(node.coords[0], node.coords[1], GlobeRadius);
            
            // Marker sphere
            const markerGeom = new THREE.SphereGeometry(1.2, 16, 16);
            const color = node.type === 'hotel' ? 0xf43f5e : (node.type === 'airport' ? 0xc5a059 : 0x10b981);
            const markerMat = new THREE.MeshBasicMaterial({ color: color });
            const markerMesh = new THREE.Mesh(markerGeom, markerMat);
            markerMesh.position.copy(pos);
            globeGroup.add(markerMesh);
            
            // Glow Ring
            const ringGeom = new THREE.RingGeometry(1.4, 2.0, 16);
            const ringMat = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
            const ring = new THREE.Mesh(ringGeom, ringMat);
            ring.position.copy(pos);
            ring.lookAt(new THREE.Vector3(0, 0, 0));
            globeGroup.add(ring);
        });
        
        // Draw Bezier arches for flights
        for (let i = 0; i < nodes.length - 1; i++) {
            const nodeA = nodes[i];
            const nodeB = nodes[i + 1];
            const transit = detectTransitMode(nodeB.label, nodeB.desc, nodeB.type);
            
            if (transit.mode === 'flight') {
                drawFlightArch(nodeA.coords, nodeB.coords, 0xc5a059);
            }
        }
        
        function drawFlightArch(start, end, colorHex) {
            const startVec = latLngToVector3(start[0], start[1], GlobeRadius);
            const endVec = latLngToVector3(end[0], end[1], GlobeRadius);
            
            const midVec = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
            const dist = startVec.distanceTo(endVec);
            const height = GlobeRadius + dist * 0.28;
            midVec.normalize().multiplyScalar(height);
            
            const curve = new THREE.QuadraticBezierCurve3(startVec, midVec, endVec);
            const points = curve.getPoints(50);
            const curveGeom = new THREE.BufferGeometry().setFromPoints(points);
            
            const curveMat = new THREE.LineBasicMaterial({
                color: colorHex,
                transparent: true,
                opacity: 0.5
            });
            const line = new THREE.Line(curveGeom, curveMat);
            globeGroup.add(line);
            
            // Pulsing light particle
            const particleGeom = new THREE.SphereGeometry(0.7, 8, 8);
            const particleMat = new THREE.MeshBasicMaterial({ color: 0x0b1521 });
            const particle = new THREE.Mesh(particleGeom, particleMat);
            globeGroup.add(particle);
            
            animateParticles.push({
                mesh: particle,
                curve: curve,
                progress: Math.random(),
                speed: 0.005 + Math.random() * 0.003
            });
        }
        
        // Center camera focus
        if (nodes.length > 0) {
            const targetPos = latLngToVector3(nodes[0].coords[0], nodes[0].coords[1], GlobeRadius);
            globeGroup.lookAt(targetPos);
            globeGroup.rotation.y += Math.PI; // Counter-look angle
        }
        
        function tick() {
            controls.update();
            globeGroup.rotation.y += 0.0012;
            
            animateParticles.forEach(p => {
                p.progress += p.speed;
                if (p.progress >= 1) p.progress = 0;
                
                const pos = p.curve.getPointAt(p.progress);
                p.mesh.position.copy(pos);
            });
            
            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        }
        tick();
        
        window.addEventListener('resize', () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        });
    }

    // 11. Interactive Journey Map (Leaflet Light Voyager Tiles)
    const mapSection = document.getElementById('sec-journey');
    if (routeNodes.length >= 2) {
        mapSection.style.display = 'block';
        document.getElementById('nav-link-journey').style.display = 'inline-block';
        
        const map = L.map('journey-map', {
            zoomControl: true,
            scrollWheelZoom: false
        });
        window.journeyMap = map;

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; CartoDB'
        }).addTo(map);

        const bounds = [];
        routeNodes.forEach(node => {
            bounds.push(node.coords);
            const pinClass = node.type === 'hotel' ? 'custom-pin-icon hotel' : 'custom-pin-icon';
            const pinEmoji = node.type === 'hotel' ? '🏨' : (node.type === 'airport' ? '✈️' : '📍');
            
            const pinIcon = L.divIcon({
                className: 'custom-pin-wrapper',
                html: \`<div class="\${pinClass}"><span>\${pinEmoji}</span></div>\`,
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            });

            const marker = L.marker(node.coords, { icon: pinIcon }).addTo(map);
            let popupContent = \`<h4 style="font-family:var(--font-heading);font-weight:700;font-size:14px;color:var(--primary-color);margin-bottom:3px;">\${node.label}</h4>\`;
            if (node.type === 'hotel') popupContent += \`<p style="font-size:11px;color:var(--text-secondary);margin:0;">Accommodations Stay</p>\`;
            else if (node.type === 'airport') popupContent += \`<p style="font-size:11px;color:var(--text-secondary);margin:0;">Transit Airport Hub</p>\`;
            else if (node.dayNum) popupContent += \`<p style="font-size:11px;color:var(--text-secondary);margin:0;">Day \${node.dayNum} Stop: \${node.desc || ''}</p>\`;
            
            marker.bindPopup(popupContent);
        });

        const journeyMapBounds = L.latLngBounds(bounds);
        map.fitBounds(journeyMapBounds, { padding: [50, 50] });

        // Draw transits
        for (let i = 0; i < routeNodes.length - 1; i++) {
            const nodeA = routeNodes[i];
            const nodeB = routeNodes[i + 1];
            const transit = detectTransitMode(nodeB.label, nodeB.desc, nodeB.type);
            
            const polyline = L.polyline([nodeA.coords, nodeB.coords], {
                color: transit.color,
                dashArray: '6, 6',
                weight: 3,
                opacity: 0.85
            }).addTo(map);

            const startLatLng = L.latLng(nodeA.coords);
            const endLatLng = L.latLng(nodeB.coords);
            
            const vehicleDivIcon = L.divIcon({
                className: 'custom-map-icon',
                html: \`<span>\${transit.icon}</span>\`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            const vehicleMarker = L.marker(nodeA.coords, { icon: vehicleDivIcon }).addTo(map);
            let progress = Math.random();
            const speed = 0.0025 + Math.random() * 0.0015;

            function animateVehicle() {
                progress += speed;
                if (progress >= 1) progress = 0;
                
                const currentLat = startLatLng.lat + (endLatLng.lat - startLatLng.lat) * progress;
                const currentLng = startLatLng.lng + (endLatLng.lng - startLatLng.lng) * progress;
                vehicleMarker.setLatLng([currentLat, currentLng]);
                
                requestAnimationFrame(animateVehicle);
            }
            animateVehicle();
        }
    } else {
        mapSection.style.display = 'none';
        document.getElementById('nav-link-journey').style.display = 'none';
    }

    // 12. Inclusions, Exclusions, Terms Render
    const inclusionsBtn = document.getElementById('nav-link-inclusions');
    const incBox = document.getElementById('tpl-inclusions-box');
    const incList = document.getElementById('tpl-inclusions-list');
    let hasInclusions = false;

    if (data.inclusions && data.inclusions.length > 0) {
        incBox.style.display = 'block';
        incList.innerHTML = data.inclusions.map(item => \`<li>\${item}</li>\`).join('');
        hasInclusions = true;
    } else {
        incBox.style.display = 'none';
    }

    const excBox = document.getElementById('tpl-exclusions-box');
    const excList = document.getElementById('tpl-exclusions-list');
    if (data.exclusions && data.exclusions.length > 0) {
        excBox.style.display = 'block';
        excList.innerHTML = data.exclusions.map(item => \`<li>\${item}</li>\`).join('');
        hasInclusions = true;
    } else {
        excBox.style.display = 'none';
    }

    const termsBox = document.getElementById('tpl-terms-box');
    const termsList = document.getElementById('tpl-terms-list');
    if (data.terms && data.terms.length > 0) {
        termsBox.style.display = 'block';
        termsList.innerHTML = data.terms.map(item => \`<li>\${item}</li>\`).join('');
        hasInclusions = true;
    } else {
        termsBox.style.display = 'none';
    }
    
    if (hasInclusions) {
        inclusionsBtn.style.display = 'inline-block';
    } else {
        inclusionsBtn.style.display = 'none';
    }

    // 13. Billing Invoice Render
    const invoiceItemsList = document.getElementById('invoice-items-list');
    invoiceItemsList.innerHTML = '';
    
    // Add flights row to billing table if included
    if (data.flights && data.flights.legs && data.flights.legs.length > 0) {
        const row = document.createElement('div');
        row.className = 'invoice-body-row';
        
        let flightRoutes = data.flights.legs.map(l => l.route).join(' | ');
        row.innerHTML = \`
            <div class="desc-cell">
                <strong>Flights Package Booking</strong>
                <span class="sub-cell-text">\${data.flights.legs[0].carrier || 'International flights'}</span>
            </div>
            <div class="stay-cell">
                <span>Route: \${flightRoutes}</span>
                <span class="sub-cell-text">\${data.flights.note || 'Confirmed Baggage Inclusions'}</span>
            </div>
            <div class="price-cell">
                <span class="new-price-highlight">Included</span>
            </div>
        \`;
        invoiceItemsList.appendChild(row);
    }

    // Add Stays rows to billing table if included
    if (data.hotels && data.hotels.length > 0) {
        data.hotels.forEach(hotel => {
            const row = document.createElement('div');
            row.className = 'invoice-body-row';
            
            let roomsStr = hotel.rooms.map(r => typeof r === 'string' ? r : r.name).join(', ');
            row.innerHTML = \`
                <div class="desc-cell">
                    <strong>\${hotel.name || 'Resort Stay'}</strong>
                    <span class="sub-cell-text">\${roomsStr}</span>
                </div>
                <div class="stay-cell">
                    <span>\${hotel.nights || 0} Nights Stay</span>
                    <span class="sub-cell-text">Period: \${hotel.checkIn || ''} - \${hotel.checkOut || ''}</span>
                </div>
                <div class="price-cell">
                    <span class="new-price-highlight">Included</span>
                </div>
            \`;
            invoiceItemsList.appendChild(row);
        });
    }

    // Grand totals
    if (data.pricing?.totalCost) {
        document.getElementById('invoice-price-grand').textContent = \`\${currency} \${data.pricing.totalCost}\`;
    }
    if (data.pricing?.totalCostLabel) {
        document.getElementById('tpl-pricing-label').textContent = data.pricing.totalCostLabel;
    }
    if (data.pricing?.priceValidTill) {
        document.getElementById('invoice-valid-till').textContent = \`⌛ Proposal Valid Until: \${formatDate(data.pricing.priceValidTill)}\`;
    } else if (data.guest?.priceValidTill) {
        document.getElementById('invoice-valid-till').textContent = \`⌛ Proposal Valid Until: \${formatDate(data.guest.priceValidTill)}\`;
    } else {
        document.getElementById('invoice-valid-till').style.display = 'none';
    }

    // Deadlines
    const deadlineBox = document.getElementById('invoice-payment-deadline-box');
    const deadlineVal = document.getElementById('invoice-payment-deadline');
    if (data.pricing?.paymentDeadline) {
        deadlineBox.style.display = 'block';
        deadlineVal.textContent = formatDate(data.pricing.paymentDeadline);
    } else if (data.guest?.paymentDeadline) {
        deadlineBox.style.display = 'block';
        deadlineVal.textContent = formatDate(data.guest.paymentDeadline);
    } else {
        deadlineBox.style.display = 'none';
    }

    // Cancellation policy
    const cancelBox = document.getElementById('invoice-cancel-policy-box');
    const cancelVal = document.getElementById('invoice-cancel-policy');
    if (data.hotels && data.hotels[0] && data.hotels[0].cancellation) {
        cancelBox.style.display = 'block';
        cancelVal.textContent = data.hotels[0].cancellation;
    } else if (data.guest?.cancellationPolicy) {
        cancelBox.style.display = 'block';
        cancelVal.textContent = data.guest.cancellationPolicy;
    } else {
        cancelBox.style.display = 'none';
    }

    // ==========================================
    // GSAP PRELOADER & splitscreen entrance
    // ==========================================
    const preloaderTl = gsap.timeline();
    
    gsap.set('.preloader-logo', { opacity: 0, y: 30 });
    gsap.set('.preloader-progress-bar', { opacity: 0 });
    gsap.set('.preloader-counter', { opacity: 0 });
    
    preloaderTl.to('.preloader-logo', { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" })
               .to('.preloader-progress-bar', { opacity: 1, duration: 0.6 }, "-=0.4")
               .to('.preloader-counter', { opacity: 1, duration: 0.6 }, "-=0.6")
               .to('#preloader-progress-fill', { 
                   width: "100%", 
                   duration: 2.0, 
                   ease: "power2.inOut",
                   onUpdate: function() {
                       const progress = Math.round(this.progress() * 100);
                       document.getElementById('preloader-counter').textContent = progress + '%';
                   }
               })
               .to('.preloader-content', { opacity: 0, y: -40, duration: 0.8, ease: "power3.in" })
               .to('.preloader-top', { y: "-100%", duration: 1.2, ease: "power4.inOut" })
               .to('.preloader-bottom', { y: "100%", duration: 1.2, ease: "power4.inOut" }, "-=1.2")
               .set('#luxury-preloader', { display: "none" })
               .add(() => {
                   ScrollTrigger.refresh();
               });

    // 14. GSAP ScrollTrigger Viewport Reveals
    gsap.registerPlugin(ScrollTrigger);
    
    document.querySelectorAll('.day-node, .editorial-villa-card, .welcome-expert-grid, .flight-legs-card, .globe-wrapper, .list-box, .reservation-dashboard-card').forEach(card => {
        gsap.from(card, {
            y: 45,
            opacity: 0,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: {
                trigger: card,
                start: "top 88%",
                toggleActions: "play none none none"
            }
        });
    });
});
</script>

</body>
</html>
`;
}

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
    div.style.cssText = 'position:relative; margin-bottom: 20px; padding: 20px; border-left: 4px solid var(--accent);';
    div.innerHTML = `
        <button type="button" class="btn-remove-sub" style="position:absolute; right:10px; top:10px;">✕</button>
        
        <div class="form-grid col-4" style="margin-bottom: 12px;">
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
                    <option value="sim_insurance" ${actData.type === 'sim_insurance' ? 'selected' : ''}>SIM+Insurance</option>
                    <option value="leisure" ${actData.type === 'leisure' ? 'selected' : ''}>Leisure / Free time</option>
                </select>
            </div>
            <div class="form-group" style="margin-bottom:0;">
                <label>Library Catalog</label>
                <select class="act-catalog-field">
                    <option value="custom">Custom / Manual</option>
                    <option value="singapore">Singapore Presets</option>
                    <option value="bali">Bali Presets</option>
                    <option value="vietnam">Vietnam Presets</option>
                    <option value="maldives">Maldives Presets</option>
                </select>
            </div>
            <div class="form-group" style="margin-bottom:0;">
                <label>Select Activity</label>
                <select class="act-preset-field" disabled>
                    <option value="">-- Choose Activity --</option>
                </select>
            </div>
            <div class="form-group" style="margin-bottom:0;">
                <label>Select Variant</label>
                <select class="act-variant-field" disabled>
                    <option value="">-- Choose Variant --</option>
                </select>
            </div>
        </div>
        
        <div class="form-group" style="margin-bottom:12px;">
            <label>Activity Label/Title</label>
            <input type="text" class="act-title-field" value="${actData.title || ''}" placeholder="e.g. Universal Studio Singapore with Tickets" required>
        </div>
        
        <div class="form-group" style="margin-bottom:12px;">
            <label>Details / Description (Voucher, operating hours, notes)</label>
            <textarea class="act-desc-field" rows="2" placeholder="Describe the day's activity timings or meetups...">${actData.desc || ''}</textarea>
        </div>
        
        <div class="act-images-container" style="margin-top:12px;">
            <label style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 6px; display: block;">Activity / Attraction Photos (Paste or click to upload)</label>
            <div class="act-images-gallery-row" style="display: flex; gap: 10px; flex-wrap: wrap;">
                <!-- Paste zone -->
                <div class="image-paste-zone act-image-paste-zone" tabindex="0" style="width: 100px; height: 70px; flex-shrink: 0;" title="Focus & Paste image (Ctrl+V) or click to upload">
                    <input type="file" class="paste-file-input" accept="image/*" style="display:none" multiple>
                    <div class="paste-zone-placeholder">
                        <span style="font-size: 9px;">📷 Paste / Upload</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const catalogSelect = div.querySelector('.act-catalog-field');
    const presetSelect = div.querySelector('.act-preset-field');
    const variantSelect = div.querySelector('.act-variant-field');
    const galleryRow = div.querySelector('.act-images-gallery-row');
    const pasteZone = div.querySelector('.act-image-paste-zone');
    
    // Helper function to append a thumbnail card
    function appendActThumbnail(imgSrc) {
        const thumb = document.createElement('div');
        thumb.className = 'act-gallery-thumbnail';
        thumb.style.cssText = 'position:relative; width: 100px; height: 70px; border-radius:6px; border:1px solid var(--border-dark); overflow:hidden; flex-shrink:0;';
        thumb.innerHTML = `
            <img src="${imgSrc}" style="width:100%; height:100%; object-fit:cover;">
            <button type="button" class="btn-remove-image" style="position:absolute; top:2px; right:2px;">✕</button>
        `;
        thumb.querySelector('.btn-remove-image').addEventListener('click', () => thumb.remove());
        galleryRow.insertBefore(thumb, pasteZone);
    }
    
    // Catalog Select Change
    catalogSelect.addEventListener('change', (e) => {
        const catKey = e.target.value;
        presetSelect.innerHTML = '<option value="">-- Choose Activity --</option>';
        variantSelect.innerHTML = '<option value="">-- Choose Variant --</option>';
        
        if (catKey === 'custom') {
            presetSelect.disabled = true;
            variantSelect.disabled = true;
        } else {
            presetSelect.disabled = false;
            variantSelect.disabled = true;
            const cat = ACTIVITY_CATALOG[catKey];
            if (cat && cat.activities) {
                for (const actKey in cat.activities) {
                    const opt = document.createElement('option');
                    opt.value = actKey;
                    opt.textContent = cat.activities[actKey].title;
                    presetSelect.appendChild(opt);
                }
            }
        }
    });
    
    // Preset Select Change
    presetSelect.addEventListener('change', (e) => {
        const catKey = catalogSelect.value;
        const actKey = e.target.value;
        variantSelect.innerHTML = '<option value="">-- Choose Variant --</option>';
        
        if (!actKey) {
            variantSelect.disabled = true;
        } else {
            variantSelect.disabled = false;
            const cat = ACTIVITY_CATALOG[catKey];
            const act = cat && cat.activities[actKey];
            if (act && act.variants) {
                for (const varKey in act.variants) {
                    const opt = document.createElement('option');
                    opt.value = varKey;
                    opt.textContent = act.variants[varKey].title;
                    variantSelect.appendChild(opt);
                }
            }
        }
    });
    
    // Variant Select Change
    variantSelect.addEventListener('change', (e) => {
        const catKey = catalogSelect.value;
        const actKey = presetSelect.value;
        const varKey = e.target.value;
        
        if (varKey) {
            const cat = ACTIVITY_CATALOG[catKey];
            const act = cat && cat.activities[actKey];
            const variant = act && act.variants[varKey];
            if (variant) {
                div.querySelector('.act-title-field').value = variant.title;
                div.querySelector('.act-desc-field').value = variant.desc;
                if (act.type) {
                    div.querySelector('.act-type-field').value = act.type;
                }
                
                // Clear current thumbnails (except uploader paste zone)
                div.querySelectorAll('.act-gallery-thumbnail').forEach(el => el.remove());
                
                // Add preset images
                if (variant.images) {
                    variant.images.forEach(imgUrl => appendActThumbnail(imgUrl));
                }
            }
        }
    });
    
    // Load pre-existing activity images
    const existingImages = actData.roomImages || [];
    existingImages.forEach(imgSrc => appendActThumbnail(imgSrc));
    
    // Auto-detect and populate catalog dropdowns if title matches a preset
    let foundCatalog = 'custom';
    let foundActivityKey = '';
    let foundVariantKey = '';
    
    if (actData.title) {
        for (const catKey in ACTIVITY_CATALOG) {
            const cat = ACTIVITY_CATALOG[catKey];
            for (const actKey in cat.activities) {
                const act = cat.activities[actKey];
                for (const varKey in act.variants) {
                    const variant = act.variants[varKey];
                    if (variant.title.toLowerCase().trim() === actData.title.toLowerCase().trim()) {
                        foundCatalog = catKey;
                        foundActivityKey = actKey;
                        foundVariantKey = varKey;
                        break;
                    }
                }
                if (foundCatalog !== 'custom') break;
            }
            if (foundCatalog !== 'custom') break;
        }
    } else {
        // Fallback: guess catalog from overall destination field
        const destInputVal = (doc('destination')?.value || '').toLowerCase();
        if (destInputVal.includes('singapore')) foundCatalog = 'singapore';
        else if (destInputVal.includes('bali')) foundCatalog = 'bali';
        else if (destInputVal.includes('vietnam')) foundCatalog = 'vietnam';
        else if (destInputVal.includes('maldives')) foundCatalog = 'maldives';
    }
    
    // Programmatically trigger selection triggers
    if (foundCatalog !== 'custom') {
        catalogSelect.value = foundCatalog;
        presetSelect.disabled = false;
        
        const cat = ACTIVITY_CATALOG[foundCatalog];
        if (cat && cat.activities) {
            for (const actKey in cat.activities) {
                const opt = document.createElement('option');
                opt.value = actKey;
                opt.textContent = cat.activities[actKey].title;
                if (actKey === foundActivityKey) opt.selected = true;
                presetSelect.appendChild(opt);
            }
        }
        
        if (foundActivityKey) {
            variantSelect.disabled = false;
            const act = cat.activities[foundActivityKey];
            if (act && act.variants) {
                for (const varKey in act.variants) {
                    const opt = document.createElement('option');
                    opt.value = varKey;
                    opt.textContent = act.variants[varKey].title;
                    if (varKey === foundVariantKey) opt.selected = true;
                    variantSelect.appendChild(opt);
                }
            }
        }
    }
    
    // Set up paste zone
    setupImagePasteZone(pasteZone, (base64) => {
        appendActThumbnail(base64);
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
                compressAndResizeImage(file)
                    .then((compressedBase64) => {
                        onImageLoaded(compressedBase64);
                    })
                    .catch((err) => {
                        console.error("Compression failed, falling back to raw upload:", err);
                        const reader = new FileReader();
                        reader.onload = (evt) => onImageLoaded(evt.target.result);
                        reader.readAsDataURL(file);
                    });
            });
        }
    });
    
    // Clipboard paste action
    zone.addEventListener('paste', (e) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                compressAndResizeImage(blob)
                    .then((compressedBase64) => {
                        onImageLoaded(compressedBase64);
                    })
                    .catch((err) => {
                        console.error("Compression failed, falling back to raw upload:", err);
                        const reader = new FileReader();
                        reader.onload = (evt) => onImageLoaded(evt.target.result);
                        reader.readAsDataURL(blob);
                    });
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

// Utility: Compress and resize image client-side to keep base64 payloads lightweight
function compressAndResizeImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.7) {
    return new Promise((resolve, reject) => {
        if (!file || !file.type.startsWith("image/")) {
            resolve(""); // Resolve empty string for invalid/missing files rather than rejecting
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;
                
                // Calculate new dimensions keeping aspect ratio
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }
                
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                
                // Compress image to jpeg
                const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
                resolve(compressedBase64);
            };
            img.onerror = (err) => {
                reject(err);
            };
            img.src = e.target.result;
        };
        reader.onerror = (err) => {
            reject(err);
        };
        reader.readAsDataURL(file);
    });
}

// Helper to compress pre-existing base64 images to keep state lightweight
function compressBase64Image(base64Str, maxWidth = 1200, maxHeight = 1200, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            let width = img.width;
            let height = img.height;
            
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }
            
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            
            const compressed = canvas.toDataURL("image/jpeg", quality);
            resolve(compressed);
        };
        img.onerror = (err) => {
            reject(err);
        };
        img.src = base64Str;
    });
}

// Recursively traverse state and proactively compress large base64 images
async function proactivelyCompressStateImages(obj, path = "") {
    if (!obj || typeof obj !== "object") return;
    
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const val = obj[key];
            if (typeof val === "string" && val.startsWith("data:image")) {
                // Check if it's large (length > 200,000 characters is ~150KB)
                if (val.length > 200000) {
                    console.log(`Proactively compressing large image at state.${path ? path + '.' : ''}${key}...`);
                    try {
                        const compressed = await compressBase64Image(val);
                        obj[key] = compressed;
                        console.log(`Compressed state.${path ? path + '.' : ''}${key} from ${val.length} to ${compressed.length} chars.`);
                    } catch (err) {
                        console.error(`Failed to compress image at state.${path ? path + '.' : ''}${key}:`, err);
                    }
                }
            } else if (typeof val === "object") {
                await proactivelyCompressStateImages(val, path ? `${path}.${key}` : key);
            }
        }
    }
}
