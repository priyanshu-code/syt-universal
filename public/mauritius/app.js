// ==========================================================================
// DEFAULT SAMPLE MAURITIUS TRIP CONFIGURATION (SOLVE YOUR TRIP BASELINE)
// ==========================================================================
const DEFAULT_QUOTE_DATA = {
    guest: {
        name: "Vishal Gurnani",
        adultsCount: "2 Adults",
        checkIn: "2026-05-11",
        checkOut: "2026-05-15",
        duration: "4 Nights",
        price: "INR 3,45,000",
        originalPrice: "INR 4,10,000",
        priceValidTill: "2026-04-15",
        paymentDeadline: "2026-04-20",
        cancellationPolicy: "Non-cancellable"
    },
    resort: {
        name: "JW Marriott Mauritius Kaafu Atoll Island Resort",
        tag: "Private Island",
        stars: "5.0 (Luxury)",
        location: "Vagaru Island, Shaviyani Atoll, Mauritius",
        backdrop: "https://d2r52dqajtv0mz.cloudfront.net/activity/ao0iq65/photos/1761835106585jw-mlejm-residence-topview1-18168_Wide-Hor_mn2avw_0_0",
        photos: [
            "https://d2r52dqajtv0mz.cloudfront.net/activity/ao0iq65/photos/1761835106585jw-mlejm-residence-topview1-18168_Wide-Hor_mn2avw_0_0",
            "https://d2r52dqajtv0mz.cloudfront.net/activity/ao0iq65/photos/1761835105416jw-mlejm-residence-exterior-41538_Wide-Hor_sfez0t_0_1",
            "https://d2r52dqajtv0mz.cloudfront.net/activity/ao0iq65/photos/1761835104140jw-mlejm-residence-living-37324_Wide-Hor_lsbpzj_0_2",
            "https://d2r52dqajtv0mz.cloudfront.net/activity/ao0iq65/photos/1761835109472jw-mlejm-pool-villa-bedroom-10151_Wide-Hor_z3ukw3_0_3",
            "https://d2r52dqajtv0mz.cloudfront.net/activity/ao0iq65/photos/1761835109973jw-mlejm-pool-villa-pool-10647_Wide-Hor_tn8ivg_0_4"
        ]
    },
    stayType: "full", // "full" or "split"
    optionTitle: "4N Overwater Pool Villa (Half Board)",
    mealPlan: "Half Board (HB)",
    mealPlanDetails: "Daily buffet breakfast and dinner at Aailaa Restaurant.\n60% discount on food when dining at signature restaurants Hashi & Shizuku.\nChilled welcome amenities and access to non-motorized water sports.",
    rooms: [
        {
            name: "Overwater Pool Villa",
            nights: 4,
            size: "1668 sq-ft",
            photos: [
                "https://s3.ap-south-1.amazonaws.com/cdn.passprt.co/activity/ao0iq65/photos/1761823491418jw-mlejm-overwater-villa-31047_Wide-Hor_g6baph_1_0",
                "https://s3.ap-south-1.amazonaws.com/cdn.passprt.co/activity/ao0iq65/photos/1761823488798jw-mlejm-overwater-villa-12398_Wide-Hor_cgk95z_1_1",
                "https://s3.ap-south-1.amazonaws.com/cdn.passprt.co/activity/ao0iq65/photos/1761823490344jw-mlejm-overwater-bedroom-18442_Wide-Hor_lq5yem_1_2"
            ],
            amenities: ["Private Pool", "Butler Service", "Minibar", "Ocean View", "Direct Lagoon Access"]
        }
    ],
    transfers: {
        type: "SPEEDBOAT",
        duration: "25 min",
        baggage: "20kg check-in + 5kg cabin per person",
        onwardSteps: [
            "Land at Mauritius Airport",
            "Airport Welcome",
            "Wait in Lounge",
            "Speedboat Transfer",
            "Resort Welcome & Check-in"
        ],
        returnSteps: [
            "Resort Check-out",
            "Speedboat Transfer",
            "Airport Check-in",
            "Depart from Mauritius Airport"
        ]
    },
    inclusions: [
        "Welcome drinks & chilled towels upon arrival",
        "Daily gourmet buffet breakfast & dinner at selection of resort restaurants",
        "Complimentary snorkeling gear & non-motorized water sports",
        "24/7 dedicated Island Butler Service",
        "Access to fitness center, infinity pools, and kids play zone"
    ],
    honeymoonBenefits: [
        "Minimum 4 nights stay required to qualify",
        "A chilled bottle of Champagne waiting in villa upon arrival",
        "One-time private romantic beach dinner (weather permitting)",
        "Special floral bath and bed decoration turndown service",
        "Note: Must present wedding certificate issued within last 12 months at check-in"
    ],
    occasionType: "honeymoon",
    expert: {
        name: "Akanksha",
        title: "Mauritius Expert",
        tripsCount: "Planned 1000+ trips",
        photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        whatsapp: "919004763333",
        intro: "Dedicated to curating seamless luxury experiences. I am available to adapt this itinerary to your preference."
    }
};

// Available Room Amenities Dictionary (with Emojis)
const ALL_AMENITIES = [
    { name: "Private Pool", icon: "🏊" },
    { name: "Butler Service", icon: "🤵" },
    { name: "Minibar", icon: "🍷" },
    { name: "Ocean View", icon: "🌊" },
    { name: "Direct Lagoon Access", icon: "🪜" },
    { name: "Outdoor Bathtub", icon: "🛁" },
    { name: "Free Wi-Fi", icon: "📶" },
    { name: "Air Conditioning", icon: "❄️" },
    { name: "Private Deck", icon: "🌅" },
    { name: "Jacuzzi", icon: "🛀" }
];

// Onward/Return Steps presets based on transfer mode
const TRANSFER_PRESETS = {
    "SPEEDBOAT": {
        onward: ["Land at Mauritius Airport", "Airport Welcome", "Wait in Lounge", "Speedboat Transfer", "Resort Welcome & Check-in"],
        return: ["Resort Check-out", "Speedboat Transfer", "Airport Check-in", "Depart from Mauritius Airport"]
    },
    "SEAPLANE": {
        onward: ["Land at Mauritius Airport", "Meet & Greet", "VIP Lounge Wait", "Scenic Seaplane Flight", "Resort Arrival & Welcome"],
        return: ["Resort Check-out", "Seaplane Flight", "Mauritius Airport Transfer", "Depart from Mauritius Airport"]
    },
    "DOMESTIC FLIGHT + SPEEDBOAT": {
        onward: ["Land at Mauritius Airport", "Domestic Terminal Check-in", "Fly to Domestic Airport", "Speedboat Transfer", "Resort Welcome"],
        return: ["Resort Check-out", "Speedboat Transfer", "Domestic Flight to Mauritius Airport", "Depart from Mauritius Airport"]
    },
    "YACHT": {
        onward: ["Land at Mauritius Airport", "VIP Host Meet", "Luxury Yacht Boarding", "Yacht Cruise with Refreshments", "Resort Arrival"],
        return: ["Resort Check-out", "Yacht Cruise", "VIP Mauritius Airport Transfer", "Depart from Mauritius Airport"]
    },
    "SIC TAXI": {
        onward: ["Land at Mauritius Airport", "Airport Welcome", "SIC Taxi Transfer", "Resort Welcome & Check-in"],
        return: ["Resort Check-out", "SIC Taxi Transfer", "Airport Check-in", "Depart from Mauritius Airport"]
    },
    "PRIVATE TAXI": {
        onward: ["Land at Mauritius Airport", "Airport Welcome", "Private Taxi Transfer", "Resort Welcome & Check-in"],
        return: ["Resort Check-out", "Private Taxi Transfer", "Airport Check-in", "Depart from Mauritius Airport"]
    }
};

// App Global State
let state = {};
let roomSlidesIndices = {}; // Track slide index per room index dynamically
let currentLightboxIndex = 0;
let activeJourneyTab = "onward";

// LocalStorage key
const STORAGE_KEY = "mauritius_quote_creator_state";

// ==========================================================================
// APP INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    loadState();
    parseQueryParamsAndPreFill();
    setupMobileTabs();
    initBuilderFormControls();
    renderPreview();
    setupQuoteEventListeners();
    
    // Check database status
    fetch("/api/status")
        .then(res => res.json())
        .then(data => {
            if (!data.dbConnected) {
                const banner = document.getElementById("db-warning-banner");
                if (banner) banner.style.display = "block";
            }
        })
        .catch(err => console.error("Failed to check status:", err));
});

// Helper: Pre-fill from URL inquiry parameters
function parseQueryParamsAndPreFill() {
    const params = new URLSearchParams(window.location.search);
    const guestName = params.get('guestName');
    const checkIn = params.get('checkIn');
    const nights = params.get('nights');
    const inquiryId = params.get('inquiryId');
    
    if (guestName || checkIn || nights || inquiryId) {
        if (guestName) state.guest.name = decodeURIComponent(guestName);
        if (checkIn) state.guest.checkIn = decodeURIComponent(checkIn);
        
        if (checkIn && nights) {
            const d = new Date(decodeURIComponent(checkIn));
            d.setDate(d.getDate() + parseInt(decodeURIComponent(nights)));
            state.guest.checkOut = d.toISOString().split('T')[0];
            state.guest.duration = `${decodeURIComponent(nights)} Nights`;
            
            // Recalculate payment deadline (21 days before check-in)
            const dDead = new Date(decodeURIComponent(checkIn));
            dDead.setDate(dDead.getDate() - 21);
            state.guest.paymentDeadline = dDead.toISOString().split('T')[0];
        }
        
        if (inquiryId) {
            state.optionTitle = `4N Overwater Pool Villa (Ref: ${decodeURIComponent(inquiryId)})`;
        }
        
        // Save state changes
        saveState();
    }
}

// Helper to parse older/legacy string dates into ISO format (YYYY-MM-DD)
function parseToISODate(dateStr) {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
    }
    const cleaned = dateStr.replace(/'/g, '').replace(/\s+/g, ' ').trim();
    const parts = cleaned.split(' ');
    if (parts.length >= 3) {
        const day = parseInt(parts[0], 10);
        const monthStr = parts[1].toLowerCase();
        let year = parseInt(parts[2], 10);
        if (year < 100) year += 2000;
        
        const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
        let monthIdx = months.findIndex(m => monthStr.startsWith(m));
        if (monthIdx !== -1) {
            const mm = String(monthIdx + 1).padStart(2, '0');
            const dd = String(day).padStart(2, '0');
            return `${year}-${mm}-${dd}`;
        }
    }
    try {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
            return d.toISOString().split('T')[0];
        }
    } catch (e) {}
    return dateStr;
}

// Helper to format ISO dates to luxury display strings (e.g. "11 May' 26")
function formatDisplayDate(isoDate) {
    if (!isoDate) return "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
        return isoDate;
    }
    const parts = isoDate.split('-');
    const yearStr = parts[0].slice(-2);
    const monthIdx = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthStr = months[monthIdx] || "Jan";
    return `${day} ${monthStr}' ${yearStr}`;
}

// Helper to format ISO dates to short strings (e.g. "11 May")
function formatShortDisplayDate(isoDate) {
    if (!isoDate) return "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
        const cleaned = isoDate.replace(/'/g, '').replace(/\s+/g, ' ').trim();
        const parts = cleaned.split(' ');
        if (parts.length >= 2) {
            return `${parts[0]} ${parts[1]}`;
        }
        return isoDate;
    }
    const parts = isoDate.split('-');
    const monthIdx = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthStr = months[monthIdx] || "Jan";
    return `${day} ${monthStr}`;
}

// Calculate night duration from check-in and check-out dates
function calculateNights(checkIn, checkOut) {
    if (!checkIn || !checkOut) return 0;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffTime = d2 - d1;
    if (diffTime <= 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Calculate payment deadline (exactly 21 days before check-in)
function calculatePaymentDeadline(checkIn) {
    if (!checkIn) return "";
    const d = new Date(checkIn);
    d.setDate(d.getDate() - 21);
    return d.toISOString().split('T')[0];
}

// Check if cancellation policy should be locked to Non-cancellable
function checkCancellationPolicyLock() {
    if (!state.guest.checkIn) return;
    const checkInDate = new Date(state.guest.checkIn);
    const today = new Date();
    checkInDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = checkInDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const cancelSelect = document.getElementById("q-cancellation-policy-select");
    if (diffDays <= 30) {
        state.guest.cancellationPolicy = "Non-cancellable";
        if (cancelSelect) {
            cancelSelect.value = "Non-cancellable";
            cancelSelect.disabled = true;
        }
    } else {
        if (cancelSelect) {
            cancelSelect.disabled = false;
        }
    }
}

// Migrate older single-room configurations to list configuration
function migrateState(parsed) {
    if (!parsed) return parsed;
    
    // Copy mealPlan to root if it is in room or rooms[0]
    if (parsed.room) {
        if (!parsed.mealPlan && parsed.room.mealPlan) {
            parsed.mealPlan = parsed.room.mealPlan;
        }
        if (!parsed.mealPlanDetails && parsed.room.mealPlanDetails) {
            parsed.mealPlanDetails = parsed.room.mealPlanDetails;
        }
    } else if (parsed.rooms && parsed.rooms[0]) {
        if (!parsed.mealPlan && parsed.rooms[0].mealPlan) {
            parsed.mealPlan = parsed.rooms[0].mealPlan;
        }
        if (!parsed.mealPlanDetails && parsed.rooms[0].mealPlanDetails) {
            parsed.mealPlanDetails = parsed.rooms[0].mealPlanDetails;
        }
    }
    
    if (parsed.room && (!parsed.rooms || parsed.rooms.length === 0)) {
        const legacyRoom = parsed.room;
        let nights = 4;
        if (legacyRoom.nightsTag) {
            const match = legacyRoom.nightsTag.match(/(\d+)\s*Night/i);
            if (match) nights = parseInt(match[1], 10);
        }
        parsed.rooms = [
            {
                name: legacyRoom.name || "Overwater Pool Villa",
                nights: nights,
                size: legacyRoom.size || "1668 sq-ft",
                photos: legacyRoom.photos || [
                    "https://s3.ap-south-1.amazonaws.com/cdn.passprt.co/activity/ao0iq65/photos/1761823491418jw-mlejm-overwater-villa-31047_Wide-Hor_g6baph_1_0",
                    "https://s3.ap-south-1.amazonaws.com/cdn.passprt.co/activity/ao0iq65/photos/1761823488798jw-mlejm-overwater-villa-12398_Wide-Hor_cgk95z_1_1",
                    "https://s3.ap-south-1.amazonaws.com/cdn.passprt.co/activity/ao0iq65/photos/1761823490344jw-mlejm-overwater-bedroom-18442_Wide-Hor_lq5yem_1_2"
                ],
                amenities: legacyRoom.amenities || ["Private Pool", "Butler Service", "Minibar", "Ocean View", "Direct Lagoon Access"]
            }
        ];
        if (!parsed.optionTitle && legacyRoom.optionTitle) {
            parsed.optionTitle = legacyRoom.optionTitle;
        }
        delete parsed.room;
    }
    
    // Clean up any remaining mealPlan inside individual rooms
    if (parsed.rooms) {
        parsed.rooms.forEach(r => {
            delete r.mealPlan;
            delete r.mealPlanDetails;
        });
    }

    if (!parsed.mealPlan) {
        parsed.mealPlan = DEFAULT_QUOTE_DATA.mealPlan;
    }
    if (!parsed.mealPlanDetails) {
        parsed.mealPlanDetails = DEFAULT_QUOTE_DATA.mealPlanDetails;
    }
    
    if (!parsed.stayType) {
        parsed.stayType = "full";
    }
    if (!parsed.optionTitle) {
        parsed.optionTitle = DEFAULT_QUOTE_DATA.optionTitle;
    }
    
    // Parse old dates
    if (parsed.guest) {
        parsed.guest.checkIn = parseToISODate(parsed.guest.checkIn || DEFAULT_QUOTE_DATA.guest.checkIn);
        parsed.guest.checkOut = parseToISODate(parsed.guest.checkOut || DEFAULT_QUOTE_DATA.guest.checkOut);
        parsed.guest.priceValidTill = parseToISODate(parsed.guest.priceValidTill || DEFAULT_QUOTE_DATA.guest.priceValidTill);
        parsed.guest.paymentDeadline = parseToISODate(parsed.guest.paymentDeadline || DEFAULT_QUOTE_DATA.guest.paymentDeadline);
        
        if (parsed.guest.cancellationPolicy === "This booking is non-cancellable.") {
            parsed.guest.cancellationPolicy = "Non-cancellable";
        } else if (parsed.guest.cancellationPolicy === "Free cancellation policy applies.") {
            parsed.guest.cancellationPolicy = "Free cancellation";
        }
    }
    
    if (!parsed.occasionType) {
        parsed.occasionType = "honeymoon";
    }
    
    return parsed;
}

// Load state from local storage or defaults
function loadState() {
    // If this is a shared preview page, use injected data (read-only mode)
    if (window.mauritiusQuoteData) {
        state = window.mauritiusQuoteData;
        state = migrateState(state);
        document.body.classList.add("preview-readonly-mode");
        return;
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            state = JSON.parse(saved);
            state = migrateState(state);
        } catch (e) {
            console.error("Error loading state. Reverting to default.", e);
            state = JSON.parse(JSON.stringify(DEFAULT_QUOTE_DATA));
        }
    } else {
        state = JSON.parse(JSON.stringify(DEFAULT_QUOTE_DATA));
    }

    // Proactively compress any legacy oversized base64 images
    proactivelyCompressStateImages(state).then(() => {
        renderPreview();
    });
}

// Save state to local storage
function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.warn("Storage quota exceeded. State changes not persisted to localStorage:", e);
    }
}

// ==========================================================================
// MOBILE TABS MANAGER
// ==========================================================================
function setupMobileTabs() {
    const btnBuilder = document.getElementById("tab-btn-builder");
    const btnPreview = document.getElementById("tab-btn-preview");
    const paneBuilder = document.getElementById("builder-pane-el");
    const panePreview = document.getElementById("preview-pane-el");

    if (!btnBuilder || !btnPreview) return;

    btnBuilder.addEventListener("click", () => {
        btnBuilder.classList.add("active");
        btnPreview.classList.remove("active");
        paneBuilder.classList.add("active-view");
        panePreview.classList.remove("active-view");
    });

    btnPreview.addEventListener("click", () => {
        btnPreview.classList.add("active");
        btnBuilder.classList.remove("active");
        panePreview.classList.add("active-view");
        paneBuilder.classList.remove("active-view");
    });
}

// ==========================================================================
// BIND EDITOR CONTROLS & LISTENERS
// ==========================================================================
function initBuilderFormControls() {
    const stayTypeEl = document.getElementById("q-stay-type");
    if (stayTypeEl) {
        stayTypeEl.value = state.stayType || "full";
    }

    const cancelSelect = document.getElementById("q-cancellation-policy-select");
    if (cancelSelect) {
        cancelSelect.value = state.guest.cancellationPolicy || "Free cancellation";
    }
    checkCancellationPolicyLock();

    // 1. Text Inputs
    const textBindings = [
        { id: "q-guest-name", path: "guest.name" },
        { id: "q-guest-adults", path: "guest.adultsCount" },
        { id: "q-check-in", path: "guest.checkIn" },
        { id: "q-check-out", path: "guest.checkOut" },
        { id: "q-duration", path: "guest.duration" },
        { id: "q-price", path: "guest.price" },
        { id: "q-original-price", path: "guest.originalPrice" },
        { id: "q-price-valid-till", path: "guest.priceValidTill" },
        { id: "q-payment-deadline", path: "guest.paymentDeadline" },
        { id: "q-option-title", path: "optionTitle" },
        { id: "q-meal-plan", path: "mealPlan" },
        { id: "q-meal-plan-details", path: "mealPlanDetails" },
        
        { id: "q-resort-name", path: "resort.name" },
        { id: "q-resort-tag", path: "resort.tag" },
        { id: "q-resort-stars", path: "resort.stars" },
        { id: "q-resort-location", path: "resort.location" },
        { id: "q-resort-backdrop", path: "resort.backdrop" },
        
        { id: "q-photo-0", path: "resort.photos.0" },
        { id: "q-photo-1", path: "resort.photos.1" },
        { id: "q-photo-2", path: "resort.photos.2" },
        { id: "q-photo-3", path: "resort.photos.3" },
        { id: "q-photo-4", path: "resort.photos.4" },
        
        { id: "q-transfer-type", path: "transfers.type" },
        { id: "q-transfer-duration", path: "transfers.duration" },
        { id: "q-transfer-baggage", path: "transfers.baggage" },
        
        { id: "q-expert-name", path: "expert.name" },
        { id: "q-expert-title", path: "expert.title" },
        { id: "q-expert-trips", path: "expert.tripsCount" },
        { id: "q-expert-whatsapp", path: "expert.whatsapp" },
        { id: "q-expert-photo", path: "expert.photo" },
        { id: "q-expert-intro", path: "expert.intro" }
    ];

    textBindings.forEach(binding => {
        const inputEl = document.getElementById(binding.id);
        if (!inputEl) return;

        const initialVal = getValueByPath(state, binding.path) || "";
        inputEl.value = (initialVal.startsWith("data:image")) ? "[Local Uploaded Image]" : initialVal;

        const updateVal = () => {
            if (inputEl.value !== "[Local Uploaded Image]") {
                setValueByPath(state, binding.path, inputEl.value);
                
                if (binding.id === "q-check-in" || binding.id === "q-check-out") {
                    updateDatesAndCalculations();
                }
                
                saveState();
                renderPreview();
            }
        };
        inputEl.addEventListener("input", updateVal);
        inputEl.addEventListener("change", updateVal);
    });

    updateDatesAndCalculations();

    if (cancelSelect) {
        cancelSelect.addEventListener("change", (e) => {
            state.guest.cancellationPolicy = e.target.value;
            saveState();
            renderPreview();
        });
    }

    if (stayTypeEl) {
        stayTypeEl.addEventListener("change", (e) => {
            state.stayType = e.target.value;
            if (state.stayType === "full") {
                if (state.rooms.length > 1) {
                    state.rooms = [state.rooms[0]];
                }
                const totalStayNights = calculateNights(state.guest.checkIn, state.guest.checkOut);
                state.rooms[0].nights = totalStayNights;
            }
            saveState();
            renderRoomsBuilder();
            renderPreview();
        });
    }

    const occasionTypeEl = document.getElementById("q-occasion-type");
    if (occasionTypeEl) {
        occasionTypeEl.value = state.occasionType || "honeymoon";
        occasionTypeEl.addEventListener("change", (e) => {
            state.occasionType = e.target.value;
            saveState();
            renderDynamicBenefitsForms();
            renderPreview();
        });
    }

    // 2. Image File Upload Bindings
    initImageFileUploader("upload-photo-0", "resort.photos.0", "q-photo-0");
    initImageFileUploader("upload-photo-1", "resort.photos.1", "q-photo-1");
    initImageFileUploader("upload-photo-2", "resort.photos.2", "q-photo-2");
    initImageFileUploader("upload-photo-3", "resort.photos.3", "q-photo-3");
    initImageFileUploader("upload-photo-4", "resort.photos.4", "q-photo-4");
    initImageFileUploader("upload-resort-backdrop", "resort.backdrop", "q-resort-backdrop");
    initImageFileUploader("upload-expert-photo", "expert.photo", "q-expert-photo");

    // 3. Transfer steps
    const onwardStepsInput = document.getElementById("q-transfer-onward-steps");
    const returnStepsInput = document.getElementById("q-transfer-return-steps");
    
    if (onwardStepsInput && returnStepsInput) {
        onwardStepsInput.value = (state.transfers.onwardSteps || []).join(", ");
        returnStepsInput.value = (state.transfers.returnSteps || []).join(", ");

        onwardStepsInput.addEventListener("input", () => {
            state.transfers.onwardSteps = onwardStepsInput.value.split(",").map(s => s.trim()).filter(Boolean);
            saveState();
            renderPreview();
        });

        returnStepsInput.addEventListener("input", () => {
            state.transfers.returnSteps = returnStepsInput.value.split(",").map(s => s.trim()).filter(Boolean);
            saveState();
            renderPreview();
        });
    }

    // 4. Transfer presets dropdown
    const transferTypeSelect = document.getElementById("q-transfer-type");
    if (transferTypeSelect) {
        transferTypeSelect.addEventListener("change", (e) => {
            const selected = e.target.value;
            const preset = TRANSFER_PRESETS[selected];
            if (preset) {
                state.transfers.onwardSteps = [...preset.onward];
                state.transfers.returnSteps = [...preset.return];
                if (onwardStepsInput) onwardStepsInput.value = state.transfers.onwardSteps.join(", ");
                if (returnStepsInput) returnStepsInput.value = state.transfers.returnSteps.join(", ");
                saveState();
                renderPreview();
            }
        });
    }

    // 5. Inclusions & Honeymoon Benefits lists
    renderDynamicBenefitsForms();

    // 6. Dynamic room builder initialization
    renderRoomsBuilder();

    // 7. Global Action Buttons
    document.getElementById("btn-reset")?.addEventListener("click", () => {
        if (confirm("Reset quote to original Solve Your Trip sample quote? Any unsaved edits will be lost.")) {
            state = JSON.parse(JSON.stringify(DEFAULT_QUOTE_DATA));
            saveState();
            
            const stayTypeEl = document.getElementById("q-stay-type");
            if (stayTypeEl) stayTypeEl.value = state.stayType || "full";
            const cancelSelect = document.getElementById("q-cancellation-policy-select");
            if (cancelSelect) cancelSelect.value = state.guest.cancellationPolicy || "Free cancellation";
            
            initBuilderFormControls();
            renderPreview();
        }
    });

    document.getElementById("btn-export")?.addEventListener("click", exportQuoteJSON);
    document.getElementById("input-import")?.addEventListener("change", importQuoteJSON);

    // 8. Transit Tab Switchers
    const tabOnward = document.getElementById("journey-tab-onward");
    const tabReturn = document.getElementById("journey-tab-return");
    if (tabOnward && tabReturn) {
        tabOnward.replaceWith(tabOnward.cloneNode(true));
        tabReturn.replaceWith(tabReturn.cloneNode(true));
        
        const newTabOnward = document.getElementById("journey-tab-onward");
        const newTabReturn = document.getElementById("journey-tab-return");
        
        newTabOnward.addEventListener("click", () => {
            newTabOnward.classList.add("active");
            newTabReturn.classList.remove("active");
            activeJourneyTab = "onward";
            renderPreview();
        });
        newTabReturn.addEventListener("click", () => {
            newTabReturn.classList.add("active");
            newTabOnward.classList.remove("active");
            activeJourneyTab = "return";
            renderPreview();
        });
    }

    // 9. Smooth Scroll for Top Nav links
    const navLinks = document.querySelectorAll(".client-nav .nav-link");
    const previewPane = document.getElementById("preview-pane-el");
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetAttr = link.getAttribute("href");
            if (targetAttr && targetAttr.startsWith("#")) {
                e.preventDefault();
                const targetId = targetAttr.substring(1);
                const targetEl = document.getElementById(targetId);
                if (targetEl && previewPane) {
                    const topOffset = targetEl.offsetTop - 90;
                    previewPane.scrollTo({
                        top: topOffset,
                        behavior: "smooth"
                    });
                }
            }
        });
    });
}

// Update nights and deadlines based on check-in change
function updateDatesAndCalculations() {
    const totalStayNights = calculateNights(state.guest.checkIn, state.guest.checkOut);
    state.guest.duration = `${totalStayNights} Nights`;
    
    if (state.guest.checkIn) {
        state.guest.paymentDeadline = calculatePaymentDeadline(state.guest.checkIn);
    }
    
    const durationInput = document.getElementById("q-duration");
    if (durationInput) durationInput.value = state.guest.duration;
    
    const paymentDeadlineInput = document.getElementById("q-payment-deadline");
    if (paymentDeadlineInput) paymentDeadlineInput.value = state.guest.paymentDeadline;
    
    if (state.stayType === "full" && state.rooms && state.rooms[0]) {
        state.rooms[0].nights = totalStayNights;
        renderRoomsBuilder();
    }
    
    checkCancellationPolicyLock();
    validateRoomNights();
}

// Add Room Option Event handler setup
const addRoomBtn = document.getElementById("btn-add-room-option");
if (addRoomBtn) {
    addRoomBtn.replaceWith(addRoomBtn.cloneNode(true));
    const newAddRoomBtn = document.getElementById("btn-add-room-option");
    newAddRoomBtn.addEventListener("click", () => {
        state.rooms.push({
            name: "New Villa Option",
            nights: 2,
            size: "1500 sq-ft",
            photos: [
                "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500",
                "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=500",
                "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=500"
            ],
            amenities: ["Private Pool", "Ocean View", "Direct Lagoon Access"]
        });
        saveState();
        renderRoomsBuilder();
        renderPreview();
    });
}

// Dynamic Rooms UI Form Builder
function renderRoomsBuilder() {
    const container = document.getElementById("dynamic-rooms-builder-container");
    if (!container) return;
    container.innerHTML = "";

    const splitActions = document.getElementById("split-stay-actions");
    if (splitActions) {
        splitActions.style.display = state.stayType === "split" ? "block" : "none";
    }

    state.rooms.forEach((room, index) => {
        const block = document.createElement("div");
        block.className = "room-builder-block";

        const roomTitle = room.name || `Room Option ${index + 1}`;
        const nightsText = room.nights ? `${room.nights} Nights` : "";

        block.innerHTML = `
            <div class="room-builder-header">
                <span class="room-builder-title">
                    🏨 Room ${index + 1}: ${roomTitle} (${nightsText})
                </span>
                ${state.stayType === 'split' ? `
                    <button type="button" class="btn-remove-room" data-index="${index}">
                        Remove
                    </button>
                ` : ''}
            </div>
            
            <div class="section-form-grid" style="grid-template-columns: 1fr 1fr; display: grid; gap: 12px; padding: 0;">
                <div class="form-group col-span-2">
                    <label>Room Type / Name</label>
                    <input type="text" class="room-name-input" data-index="${index}" value="${room.name || ''}" placeholder="e.g. Beach Villa with Pool">
                </div>
                
                <div class="form-group">
                    <label>Nights allocated</label>
                    <input type="number" class="room-nights-input" data-index="${index}" value="${room.nights || 0}" min="1">
                </div>
                
                <div class="form-group">
                    <label>Room Size</label>
                    <input type="text" class="room-size-input" data-index="${index}" value="${room.size || ''}" placeholder="e.g. 1668 sq-ft">
                </div>
                
                <!-- Photos Grid inside Room -->
                <div class="form-group col-span-2">
                    <label>Room Gallery Photos (3 Images)</label>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        ${[0, 1, 2].map(pIdx => {
                            const photoUrl = room.photos && room.photos[pIdx] ? room.photos[pIdx] : "";
                            const displayVal = photoUrl.startsWith("data:image") ? "[Local Uploaded Image]" : photoUrl;
                            return `
                                <div class="file-input-wrapper" style="display: flex; gap: 6px; align-items: center; width: 100%;">
                                    <input type="text" class="room-photo-input" data-index="${index}" data-photo-index="${pIdx}" value="${displayVal}" placeholder="Photo ${pIdx + 1} URL" style="flex: 1;">
                                    <label class="btn btn-secondary btn-file-upload" style="cursor: pointer; padding: 6px 12px; font-size: 11px; margin: 0;">
                                        📁 File
                                        <input type="file" class="room-upload-photo" data-index="${index}" data-photo-index="${pIdx}" accept="image/*" style="display:none;">
                                    </label>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Amenities Checklist -->
                <div class="form-group col-span-2">
                    <label>Room Amenities</label>
                    <div class="room-amenities-container" data-index="${index}" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-top: 5px;">
                        <!-- Checkboxes will be rendered here -->
                    </div>
                </div>
            </div>
        `;

        // Render Room Amenities checkboxes
        const amenitiesContainer = block.querySelector(".room-amenities-container");
        if (amenitiesContainer) {
            ALL_AMENITIES.forEach(amenity => {
                const isChecked = room.amenities && room.amenities.includes(amenity.name);
                const lbl = document.createElement("label");
                lbl.className = "amenity-checkbox-label";
                lbl.innerHTML = `
                    <input type="checkbox" value="${amenity.name}" ${isChecked ? "checked" : ""}>
                    <span>${amenity.icon} ${amenity.name}</span>
                `;
                
                lbl.querySelector("input").addEventListener("change", (e) => {
                    if (!room.amenities) room.amenities = [];
                    if (e.target.checked) {
                        if (!room.amenities.includes(amenity.name)) {
                            room.amenities.push(amenity.name);
                        }
                    } else {
                        room.amenities = room.amenities.filter(name => name !== amenity.name);
                    }
                    saveState();
                    renderPreview();
                });
                amenitiesContainer.appendChild(lbl);
            });
        }

        container.appendChild(block);
    });

    bindRoomsBuilderListeners();
    validateRoomNights();
}

function bindRoomsBuilderListeners() {
    // 1. Room Name Input
    document.querySelectorAll(".room-name-input").forEach(input => {
        input.addEventListener("input", (e) => {
            const idx = parseInt(e.target.getAttribute("data-index"), 10);
            state.rooms[idx].name = e.target.value;
            const titleEl = e.target.closest(".room-builder-block").querySelector(".room-builder-title");
            if (titleEl) {
                const nightsText = state.rooms[idx].nights ? `${state.rooms[idx].nights} Nights` : "";
                titleEl.innerText = `🏨 Room ${idx + 1}: ${e.target.value || 'Room Option'} (${nightsText})`;
            }
            saveState();
            renderPreview();
        });
    });

    // 2. Room Nights Input
    document.querySelectorAll(".room-nights-input").forEach(input => {
        input.addEventListener("input", (e) => {
            const idx = parseInt(e.target.getAttribute("data-index"), 10);
            let val = parseInt(e.target.value, 10);
            if (isNaN(val) || val < 0) val = 0;
            state.rooms[idx].nights = val;
            
            const titleEl = e.target.closest(".room-builder-block").querySelector(".room-builder-title");
            if (titleEl) {
                const nightsText = val ? `${val} Nights` : "";
                titleEl.innerText = `🏨 Room ${idx + 1}: ${state.rooms[idx].name || 'Room Option'} (${nightsText})`;
            }
            
            validateRoomNights();
            saveState();
            renderPreview();
        });
    });

    // 3. Room Size Input
    document.querySelectorAll(".room-size-input").forEach(input => {
        input.addEventListener("input", (e) => {
            const idx = parseInt(e.target.getAttribute("data-index"), 10);
            state.rooms[idx].size = e.target.value;
            saveState();
            renderPreview();
        });
    });

    // 6. Room Photo URL Inputs
    document.querySelectorAll(".room-photo-input").forEach(input => {
        input.addEventListener("input", (e) => {
            const idx = parseInt(e.target.getAttribute("data-index"), 10);
            const pIdx = parseInt(e.target.getAttribute("data-photo-index"), 10);
            if (e.target.value !== "[Local Uploaded Image]") {
                if (!state.rooms[idx].photos) state.rooms[idx].photos = ["", "", ""];
                state.rooms[idx].photos[pIdx] = e.target.value;
                saveState();
                renderPreview();
            }
        });
    });

    // 7. Room Upload File Inputs
    document.querySelectorAll(".room-upload-photo").forEach(fileInput => {
        fileInput.addEventListener("change", (e) => {
            const idx = parseInt(fileInput.getAttribute("data-index"), 10);
            const pIdx = parseInt(fileInput.getAttribute("data-photo-index"), 10);
            const file = e.target.files[0];
            if (!file || !file.type.startsWith("image/")) return;

            compressAndResizeImage(file)
                .then((compressedBase64) => {
                    if (!state.rooms[idx].photos) state.rooms[idx].photos = ["", "", ""];
                    state.rooms[idx].photos[pIdx] = compressedBase64;
                    saveState();
                    renderPreview();
                    
                    const textInput = fileInput.closest(".file-input-wrapper").querySelector(".room-photo-input");
                    if (textInput) {
                        textInput.value = "[Local Uploaded Image]";
                    }
                })
                .catch((err) => {
                    console.error("Compression failed, falling back to raw upload:", err);
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        if (!state.rooms[idx].photos) state.rooms[idx].photos = ["", "", ""];
                        state.rooms[idx].photos[pIdx] = event.target.result;
                        saveState();
                        renderPreview();
                        
                        const textInput = fileInput.closest(".file-input-wrapper").querySelector(".room-photo-input");
                        if (textInput) {
                            textInput.value = "[Local Uploaded Image]";
                        }
                    };
                    reader.readAsDataURL(file);
                });
        });
    });

    // 8. Remove Room Button
    document.querySelectorAll(".btn-remove-room").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idx = parseInt(e.target.getAttribute("data-index"), 10);
            if (state.rooms.length > 1) {
                state.rooms.splice(idx, 1);
                saveState();
                renderRoomsBuilder();
                renderPreview();
            }
        });
    });
}

// Validate room nights matches checkin-checkout total
function validateRoomNights() {
    const totalStayNights = calculateNights(state.guest.checkIn, state.guest.checkOut);
    const roomsNightsSum = state.rooms.reduce((sum, r) => sum + parseInt(r.nights || 0, 10), 0);
    
    const warningEl = document.getElementById("rooms-nights-warning");
    if (warningEl) {
        if (totalStayNights !== roomsNightsSum) {
            warningEl.style.display = "block";
            warningEl.innerText = `⚠️ Warning: Total nights allocated in rooms (${roomsNightsSum} nights) does not match check-in/out stay duration (${totalStayNights} nights).`;
        } else {
            warningEl.style.display = "none";
        }
    }
}

// Utility: Compress and resize image client-side to keep base64 payloads lightweight
function compressAndResizeImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.7) {
    return new Promise((resolve, reject) => {
        if (!file || !file.type.startsWith("image/")) {
            reject(new Error("File is not an image"));
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
                        saveState();
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

// FileReader Base64 Image Uploader helper (supporting drag & drop + clipboard paste)
function initImageFileUploader(fileInputId, statePath, textInputId) {
    const fileInput = document.getElementById(fileInputId);
    const textInput = document.getElementById(textInputId);
    if (!fileInput) return;

    const wrapper = fileInput.closest(".file-input-wrapper");

    const handleFile = (file) => {
        if (!file || !file.type.startsWith("image/")) return;

        compressAndResizeImage(file)
            .then((compressedBase64) => {
                setValueByPath(state, statePath, compressedBase64);
                saveState();
                renderPreview();
                if (textInput) {
                    textInput.value = "[Local Uploaded Image]";
                }
            })
            .catch((err) => {
                console.error("Compression failed, falling back to raw upload:", err);
                const reader = new FileReader();
                reader.onload = (event) => {
                    setValueByPath(state, statePath, event.target.result);
                    saveState();
                    renderPreview();
                    if (textInput) {
                        textInput.value = "[Local Uploaded Image]";
                    }
                };
                reader.readAsDataURL(file);
            });
    };

    fileInput.addEventListener("change", (e) => {
        handleFile(e.target.files[0]);
    });

    if (wrapper) {
        wrapper.addEventListener("dragover", (e) => {
            e.preventDefault();
            wrapper.classList.add("drag-over");
        });

        wrapper.addEventListener("dragleave", (e) => {
            e.preventDefault();
            wrapper.classList.remove("drag-over");
        });

        wrapper.addEventListener("drop", (e) => {
            e.preventDefault();
            wrapper.classList.remove("drag-over");
            const file = e.dataTransfer.files[0];
            handleFile(file);
        });
    }

    if (textInput) {
        textInput.addEventListener("paste", (e) => {
            const clipboardItems = (e.clipboardData || e.originalEvent.clipboardData).items;
            for (let i = 0; i < clipboardItems.length; i++) {
                if (clipboardItems[i].type.indexOf("image") === 0) {
                    const file = clipboardItems[i].getAsFile();
                    handleFile(file);
                    e.preventDefault();
                    break;
                }
            }
        });
    }
}

// Render benefits list in Editor Pane
function renderDynamicBenefitsForms() {
    const honeymoonContainer = document.getElementById("honeymoon-benefits-container");
    const inclusionsContainer = document.getElementById("general-inclusions-container");

    const occasion = state.occasionType || "honeymoon";
    const occasionLabel = document.getElementById("occasion-label");
    const addOccasionBenefitBtn = document.getElementById("add-occasion-benefit-btn");

    if (occasionLabel) {
        if (occasion === "none") {
            occasionLabel.innerText = "Occasion Benefits (Currently Hidden)";
        } else if (occasion === "honeymoon") {
            occasionLabel.innerText = "Honeymoon Benefits";
        } else if (occasion === "birthday") {
            occasionLabel.innerText = "Birthday Benefits";
        } else if (occasion === "anniversary") {
            occasionLabel.innerText = "Anniversary Benefits";
        }
    }

    if (addOccasionBenefitBtn) {
        if (occasion === "none") {
            addOccasionBenefitBtn.style.display = "none";
        } else {
            addOccasionBenefitBtn.style.display = "inline-block";
        }
    }

    if (honeymoonContainer) {
        if (occasion === "none") {
            honeymoonContainer.style.display = "none";
        } else {
            honeymoonContainer.style.display = "block";
            honeymoonContainer.innerHTML = "";
            state.honeymoonBenefits.forEach((benefit, index) => {
                honeymoonContainer.appendChild(createDynamicListRow(benefit, index, "honeymoonBenefits"));
            });
        }
    }

    if (inclusionsContainer) {
        inclusionsContainer.innerHTML = "";
        state.inclusions.forEach((inc, index) => {
            inclusionsContainer.appendChild(createDynamicListRow(inc, index, "inclusions"));
        });
    }
}

function createDynamicListRow(text, index, stateArrayName) {
    const row = document.createElement("div");
    row.className = "dynamic-list-row";
    row.innerHTML = `
        <input type="text" value="${text.replace(/"/g, '&quot;')}" placeholder="Enter detail line item...">
        <button type="button" class="btn-remove-row" title="Remove item">✕</button>
    `;

    row.querySelector("input").addEventListener("input", (e) => {
        state[stateArrayName][index] = e.target.value;
        saveState();
        renderPreview();
    });

    row.querySelector(".btn-remove-row").addEventListener("click", () => {
        state[stateArrayName].splice(index, 1);
        saveState();
        renderDynamicBenefitsForms();
        renderPreview();
    });

    return row;
}

function addHoneymoonBenefit() {
    const occasion = state.occasionType || "honeymoon";
    let defaultText = "New honeymoon package benefit";
    if (occasion === "birthday") {
        defaultText = "New birthday celebration benefit";
    } else if (occasion === "anniversary") {
        defaultText = "New anniversary celebration benefit";
    } else if (occasion === "none") {
        defaultText = "New occasion benefit";
    }
    state.honeymoonBenefits.push(defaultText);
    saveState();
    renderDynamicBenefitsForms();
    renderPreview();
}

function addGeneralInclusion() {
    state.inclusions.push("New package inclusion detail");
    saveState();
    renderDynamicBenefitsForms();
    renderPreview();
}

// ==========================================================================
// RENDER CLIENT PREVIEW (Live Updates)
// ==========================================================================
function renderPreview() {
    const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    };

    // 1. Widescreen Hero Image & Titles
    const heroImg = document.getElementById("preview-hero-img");
    if (heroImg) {
        heroImg.src = state.resort.backdrop || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500";
    }
    
    setText("preview-hero-resort-name", state.resort.name);
    setText("preview-hero-guest-name", state.guest.name);
    setText("preview-resort-tag", state.resort.tag);
    setText("preview-resort-stars", state.resort.stars);
    setText("preview-dates-range", `${formatDisplayDate(state.guest.checkIn)} - ${formatDisplayDate(state.guest.checkOut)}`);

    // 2. Welcome letter elements
    setText("welcome-letter-guest-name", state.guest.name);
    setText("welcome-letter-resort-name", state.resort.name);
    setText("welcome-letter-expert-name", state.expert.name);

    // 3. Highlight Details Bar
    setText("invoice-duration", state.guest.duration);
    setText("invoice-guests", state.guest.adultsCount);
    
    // For highlights bar, show the global meal plan
    const mealPlanStr = (state.mealPlan || "Half Board").replace(/\s*\(.*\)/, "").trim();
    setText("invoice-meal-plan", mealPlanStr);
    setText("invoice-check-in", formatDisplayDate(state.guest.checkIn));
    setText("invoice-check-out", formatDisplayDate(state.guest.checkOut));

    // 4. Gallery Photos
    state.resort.photos.forEach((photoUrl, idx) => {
        const cellImg = document.querySelector(`#photo-cell-${idx} img`);
        if (cellImg) {
            cellImg.src = photoUrl || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500";
        }
    });

    // 5. Suite Sanctuary (Render dynamic room blocks)
    const villasContainer = document.getElementById("preview-villas-container");
    if (villasContainer) {
        villasContainer.innerHTML = "";
        state.rooms.forEach((room, roomIndex) => {
            if (roomSlidesIndices[roomIndex] === undefined) {
                roomSlidesIndices[roomIndex] = 0;
            }
            
            const slidesHTML = (room.photos || []).map((photoUrl, idx) => `
                <div class="room-slide">
                    <img src="${photoUrl || 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=500'}" alt="Room photo ${idx+1}">
                </div>
            `).join('');

            const dotsHTML = (room.photos || []).map((_, idx) => `
                <div class="slider-dot ${idx === roomSlidesIndices[roomIndex] ? 'active' : ''}" onclick="setRoomSlideIndex(${roomIndex}, ${idx})"></div>
            `).join('');

            const nightsTag = `Room ${roomIndex + 1} • ${room.nights || 0} Nights`;
            
            const amenitiesHTML = (room.amenities || []).map(amenityName => {
                const dictAmenity = ALL_AMENITIES.find(a => a.name.toLowerCase() === amenityName.toLowerCase() || (a.name === "Jacuzzi" && amenityName.toLowerCase() === "jaccuzi")) || { icon: "✓", name: amenityName };
                return `
                    <div class="amenity-pill">
                        <div class="amenity-icon-box">${dictAmenity.icon}</div>
                        <span>${dictAmenity.name}</span>
                    </div>
                `;
            }).join('');

            const villaCardHTML = `
                <div class="editorial-villa-card" style="margin-bottom: 25px;">
                    <div class="villa-slider-column" style="position: relative; overflow: hidden;">
                        <div class="room-photo-slider" style="position: relative; overflow: hidden; width: 100%; height: 100%;">
                            <div class="slides-container" id="room-slides-container-${roomIndex}" style="display: flex; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); height: 100%;">
                                ${slidesHTML}
                            </div>
                            <button class="slider-btn prev" onclick="slideRoom(${roomIndex}, -1)">&larr;</button>
                            <button class="slider-btn next" onclick="slideRoom(${roomIndex}, 1)">&rarr;</button>
                            <div class="slider-dots" id="room-slider-dots-${roomIndex}">
                                ${dotsHTML}
                            </div>
                        </div>
                    </div>
                    <div class="villa-details-column">
                        <div class="villa-header-block">
                            <span class="villa-badge">${nightsTag}</span>
                            <h3 class="room-name">${room.name || ""}</h3>
                            <div class="room-meta-row">
                                <span class="room-size">${room.size || ""}</span>
                            </div>
                        </div>
                        <div>
                            <h4 class="amenity-header-title">Villa Sanctuary Amenities</h4>
                            <div class="room-amenities-grid">
                                ${amenitiesHTML}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            villasContainer.insertAdjacentHTML('beforeend', villaCardHTML);
            updateRoomSliderPosition(roomIndex);
        });
    } else {
        // Fallback for older static HTML templates that don't have #preview-villas-container
        const room = (state.rooms && state.rooms[0]) || state.room || {};
        setText("preview-room-name", room.name || "");
        setText("preview-room-size", room.size || "");
        setText("preview-room-meal-plan", `${state.mealPlan || room.mealPlan || "Half Board"} Included`);
        
        const nightsTag = room.nightsTag || (room.nights ? `1 Room • ${room.nights} Nights` : "");
        setText("preview-room-nights-badge", nightsTag);
        
        // Render room slides
        const slidesContainer = document.getElementById("room-slides-container");
        const dotsContainer = document.getElementById("room-slider-dots");
        if (slidesContainer && dotsContainer) {
            slidesContainer.innerHTML = "";
            dotsContainer.innerHTML = "";
            
            const roomPhotos = room.photos || [];
            if (roomSlidesIndices[0] === undefined) {
                roomSlidesIndices[0] = 0;
            }
            
            roomPhotos.forEach((photoUrl, idx) => {
                const slide = document.createElement("div");
                slide.className = "room-slide";
                slide.innerHTML = `<img src="${photoUrl || 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=500'}" alt="Room photo ${idx+1}">`;
                slidesContainer.appendChild(slide);

                const dot = document.createElement("div");
                dot.className = `slider-dot ${idx === roomSlidesIndices[0] ? 'active' : ''}`;
                dot.addEventListener("click", () => {
                    setRoomSlideIndex(0, idx);
                });
                dotsContainer.appendChild(dot);
            });

            updateRoomSliderPosition(0);
        }
        
        // Render room amenities list
        const amenitiesGrid = document.getElementById("preview-amenities-grid");
        if (amenitiesGrid) {
            amenitiesGrid.innerHTML = "";
            (room.amenities || []).forEach(amenityName => {
                const dictAmenity = ALL_AMENITIES.find(a => a.name.toLowerCase() === amenityName.toLowerCase() || (a.name === "Jacuzzi" && amenityName.toLowerCase() === "jaccuzi")) || { icon: "✓", name: amenityName };
                const pill = document.createElement("div");
                pill.className = "amenity-pill";
                pill.innerHTML = `
                    <div class="amenity-icon-box">${dictAmenity.icon}</div>
                    <span>${dictAmenity.name}</span>
                `;
                amenitiesGrid.appendChild(pill);
            });
        }
    }

    // Global Meal Plan Details Card
    const globalMealPlanTitle = document.getElementById("preview-meal-plan-title");
    if (globalMealPlanTitle) {
        globalMealPlanTitle.innerText = `${(state.mealPlan || "Half Board").replace(/\s*\(.*\)/, "")} Meal Plan Details`;
    }
    const globalMealPlanDetails = document.getElementById("preview-meal-plan-details");
    if (globalMealPlanDetails) {
        globalMealPlanDetails.innerHTML = "";
        const detailsText = state.mealPlanDetails || "";
        const items = detailsText.split("\n").map(item => item.trim()).filter(Boolean);
        if (items.length > 0) {
            const ul = document.createElement("ul");
            items.forEach(item => {
                const li = document.createElement("li");
                li.innerText = item;
                ul.appendChild(li);
            });
            globalMealPlanDetails.appendChild(ul);
        } else {
            globalMealPlanDetails.innerHTML = "<p>No specific meal plan details provided.</p>";
        }
    }

    // 7. Tabbed Transit Route Map
    setText("route-map-mode", state.transfers.type);
    setText("route-map-duration", state.transfers.duration);
    setText("route-map-baggage", state.transfers.baggage);
    setText("route-resort-label", state.resort.name);

    const vehicleIconEl = document.getElementById("route-vehicle-icon");
    if (vehicleIconEl) {
        let vIcon = "🚤";
        const tType = state.transfers.type.toLowerCase();
        if (tType.includes("plane") || tType.includes("flight")) {
            vIcon = "🛩️";
        } else if (tType.includes("yacht")) {
            vIcon = "🛥️";
        } else if (tType.includes("boat")) {
            vIcon = "🚤";
        } else if (tType.includes("taxi") || tType.includes("cab") || tType.includes("car")) {
            vIcon = "🚖";
        }
        vehicleIconEl.innerText = vIcon;
    }

    const activeTimelineSteps = (activeJourneyTab === "onward") ? (state.transfers.onwardSteps || []) : (state.transfers.returnSteps || []);
    renderTransferStepsTimeline("active-journey-stepper", activeTimelineSteps, state.transfers.type);

    // 8. General Inclusions
    const incList = document.getElementById("preview-general-inclusions");
    if (incList) {
        incList.innerHTML = "";
        (state.inclusions || []).forEach(incText => {
            if (!incText.trim()) return;
            const li = document.createElement("li");
            li.innerHTML = incText;
            incList.appendChild(li);
        });
    }

    // Occasion and Honeymoon benefits
    const occasion = state.occasionType || "honeymoon";
    const occasionCard = document.getElementById("card-honeymoon-inclusions");
    const occasionTitle = document.getElementById("preview-occasion-title");
    const welcomeOccasionText = document.getElementById("welcome-letter-occasion-text");

    if (welcomeOccasionText) {
        if (occasion === "none") {
            welcomeOccasionText.innerText = "exclusive package inclusions";
        } else if (occasion === "honeymoon") {
            welcomeOccasionText.innerText = "exclusive honeymoon inclusions";
        } else if (occasion === "birthday") {
            welcomeOccasionText.innerText = "exclusive birthday inclusions";
        } else if (occasion === "anniversary") {
            welcomeOccasionText.innerText = "exclusive anniversary inclusions";
        }
    }

    if (occasionCard) {
        if (occasion === "none") {
            occasionCard.style.display = "none";
        } else {
            occasionCard.style.display = "block";
            
            if (occasionTitle) {
                if (occasion === "honeymoon") {
                    occasionTitle.innerHTML = "💕 Honeymoon Inclusions";
                } else if (occasion === "birthday") {
                    occasionTitle.innerHTML = "🎂 Birthday Inclusions";
                } else if (occasion === "anniversary") {
                    occasionTitle.innerHTML = "🥂 Anniversary Inclusions";
                }
            }
        }
    }

    const hmList = document.getElementById("preview-honeymoon-benefits");
    if (hmList) {
        hmList.innerHTML = "";
        if (occasion !== "none") {
            (state.honeymoonBenefits || []).forEach(benefitText => {
                if (!benefitText.trim()) return;
                const li = document.createElement("li");
                if (benefitText.startsWith("Note:")) {
                    li.innerHTML = `<strong>Note: </strong><em>${benefitText.substring(5).trim()}</em>`;
                    li.className = "inclusions-note";
                } else {
                    li.innerHTML = benefitText;
                }
                hmList.appendChild(li);
            });
        }
    }

    // 9. Expert details
    const expertImg = document.getElementById("preview-expert-photo");
    if (expertImg) expertImg.src = state.expert.photo || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150";
    setText("preview-expert-name", state.expert.name);
    setText("preview-expert-title", state.expert.title);
    setText("preview-expert-trips", state.expert.tripsCount);
    setText("preview-expert-intro", state.expert.intro);

    const whatsappMsgText = `Hi ${state.expert.name}, I am reviewing the curated Solve Your Trip proposal for ${state.resort.name} (Client: ${state.guest.name}). I'd like to discuss scheduling and options!`;
    const whatsappLink = `https://wa.me/${state.expert.whatsapp}?text=${encodeURIComponent(whatsappMsgText)}`;
    
    const waButton = document.getElementById("preview-expert-whatsapp-link");
    if (waButton) waButton.href = whatsappLink;

    setText("mobile-bottom-price", state.guest.price);
    const mobWhatsApp = document.getElementById("mobile-bottom-whatsapp");
    if (mobWhatsApp) mobWhatsApp.href = whatsappLink;

    // 10. Bottom Invoice Panel (Reservation card)
    setText("invoice-resort-name-cell", `${state.resort.name} Stay`);
    
    let invoiceRoomText = "";
    if (state.stayType === "split") {
        invoiceRoomText = state.rooms.map(r => `${r.nights}N ${r.name}`).join(" + ") + ` (${state.mealPlan || ""})`;
    } else {
        const room = state.rooms[0] || {};
        invoiceRoomText = `${room.name || ""} (${state.mealPlan || ""})`;
    }
    setText("invoice-room-name-cell", invoiceRoomText);
    setText("invoice-stay-nights", state.guest.duration);
    setText("invoice-stay-dates", `${formatShortDisplayDate(state.guest.checkIn)} - ${formatShortDisplayDate(state.guest.checkOut)}`);
    setText("invoice-original-price", state.guest.originalPrice);
    setText("invoice-price", state.guest.price);
    setText("invoice-price-grand", state.guest.price);
    setText("invoice-payment-deadline", formatDisplayDate(state.guest.paymentDeadline));
    
    let displayCancelPolicy = state.guest.cancellationPolicy;
    if (displayCancelPolicy === "Non-cancellable") {
        displayCancelPolicy = "This booking is non-cancellable.";
    } else if (displayCancelPolicy === "Free cancellation") {
        displayCancelPolicy = "Free cancellation policy applies.";
    }
    setText("invoice-cancel-policy", displayCancelPolicy);
    
    const validTillEls = document.querySelectorAll("#invoice-valid-till");
    validTillEls.forEach(el => {
        el.innerText = formatDisplayDate(state.guest.priceValidTill);
    });

    const footerBookBtn = document.getElementById("footer-book-btn");
    if (footerBookBtn) {
        const bookMsgText = `Hi ${state.expert.name}, I am ready to approve and book the Solve Your Trip Mauritius proposal for ${state.resort.name} (Client: ${state.guest.name}) at ${state.guest.price}!`;
        footerBookBtn.href = `https://wa.me/${state.expert.whatsapp}?text=${encodeURIComponent(bookMsgText)}`;
    }

    // 11. Luxury Print Cover Page
    const printCoverHeroImg = document.getElementById("print-cover-hero-img");
    if (printCoverHeroImg) {
        printCoverHeroImg.src = state.resort.backdrop || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500";
    }
    setText("print-cover-resort-name", state.resort.name);
    setText("print-cover-guest-name", state.guest.name);
    setText("print-cover-check-in", formatDisplayDate(state.guest.checkIn));
    setText("print-cover-check-out", formatDisplayDate(state.guest.checkOut));
    setText("print-cover-duration", state.guest.duration);
    setText("print-cover-guest-count", state.guest.adultsCount);
}

// Generate the visual steps timeline for transfers (VERTICAL TIMELINE FLOW)
function renderTransferStepsTimeline(containerId, stepsArray, transferType) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    stepsArray.forEach((stepName, index) => {
        const step = document.createElement("div");
        step.className = "vertical-timeline-node";
        
        let icon = "🏨";
        const lowercaseStep = stepName.toLowerCase();
        
        if (lowercaseStep.includes("land") || lowercaseStep.includes("airport") || lowercaseStep.includes("depart") || lowercaseStep.includes("plane")) {
            icon = "✈️";
        } else if (lowercaseStep.includes("wait") || lowercaseStep.includes("lounge") || lowercaseStep.includes("hour") || lowercaseStep.includes("min")) {
            icon = "⏳";
        } else if (lowercaseStep.includes("taxi") || lowercaseStep.includes("cab") || lowercaseStep.includes("car")) {
            icon = "🚖";
        } else if (lowercaseStep.includes("boat") || lowercaseStep.includes("speedboat") || lowercaseStep.includes("transfer") || lowercaseStep.includes("sail")) {
            const lowTransferType = transferType.toLowerCase();
            if (lowTransferType.includes("seaplane")) {
                icon = "🛩️";
            } else if (lowTransferType.includes("taxi") || lowTransferType.includes("cab") || lowTransferType.includes("car")) {
                icon = "🚖";
            } else {
                icon = "🚤";
            }
        } else if (lowercaseStep.includes("check") || lowercaseStep.includes("resort") || lowercaseStep.includes("welcome")) {
            icon = "🌴";
        }

        step.innerHTML = `
            <div class="node-icon-circle">${icon}</div>
            <div class="node-content-box">
                <div class="node-step-label">${stepName}</div>
            </div>
        `;
        container.appendChild(step);
    });
}

function slideRoom(roomIndex, direction) {
    // Backward compatibility: if only 1 argument is passed, it is the direction for room 0
    if (direction === undefined) {
        direction = roomIndex;
        roomIndex = 0;
    }

    const room = (state.rooms && state.rooms[roomIndex]) || (roomIndex === 0 ? state.room : null);
    if (!room || !room.photos) return;
    const maxIndex = room.photos.length - 1;
    if (maxIndex < 0) return;
    
    if (roomSlidesIndices[roomIndex] === undefined) {
        roomSlidesIndices[roomIndex] = 0;
    }
    
    roomSlidesIndices[roomIndex] += direction;
    if (roomSlidesIndices[roomIndex] < 0) roomSlidesIndices[roomIndex] = maxIndex;
    if (roomSlidesIndices[roomIndex] > maxIndex) roomSlidesIndices[roomIndex] = 0;
    
    updateRoomSliderPosition(roomIndex);
}

function setRoomSlideIndex(roomIndex, idx) {
    roomSlidesIndices[roomIndex] = idx;
    updateRoomSliderPosition(roomIndex);
}

function updateRoomSliderPosition(roomIndex) {
    let containerId = `room-slides-container-${roomIndex}`;
    let dotsContainerId = `room-slider-dots-${roomIndex}`;
    
    let slidesContainer = document.getElementById(containerId);
    if (!slidesContainer && roomIndex === 0) {
        slidesContainer = document.getElementById("room-slides-container");
        dotsContainerId = "room-slider-dots";
    }
    
    if (!slidesContainer) return;
    const activeIndex = roomSlidesIndices[roomIndex] || 0;
    slidesContainer.style.transform = `translateX(-${activeIndex * 100}%)`;

    const dots = document.querySelectorAll(`#${dotsContainerId} .slider-dot`);
    dots.forEach((dot, idx) => {
        if (idx === activeIndex) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });
}

// ==========================================================================
// LIGHTBOX GALLERY FOR COLLAGE PHOTOS
// ==========================================================================
function openLightbox(photoIndex) {
    currentLightboxIndex = photoIndex;
    const lightboxModal = document.getElementById("lightbox-modal");
    if (!lightboxModal) return;

    updateLightboxImage();
    lightboxModal.classList.add("active");
}

// Event argument is optional to support direct onclick calls
function closeLightbox(event) {
    const lightboxModal = document.getElementById("lightbox-modal");
    if (lightboxModal) {
        lightboxModal.classList.remove("active");
    }
}

function navigateLightbox(direction, event) {
    if (event) event.stopPropagation();
    const maxIndex = state.resort.photos.length - 1;
    currentLightboxIndex += direction;
    if (currentLightboxIndex < 0) currentLightboxIndex = maxIndex;
    if (currentLightboxIndex > maxIndex) currentLightboxIndex = 0;

    updateLightboxImage();
}

function updateLightboxImage() {
    const lbImg = document.getElementById("lightbox-image");
    const lbCaption = document.getElementById("lightbox-caption");
    if (lbImg && lbCaption) {
        const photoUrl = state.resort.photos[currentLightboxIndex];
        lbImg.src = photoUrl || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500";
        lbCaption.innerText = `${state.resort.name} - Mood Collage ${currentLightboxIndex + 1}`;
    }
}

// ==========================================================================
// CLIENT ADJUSTMENTS REQUESTS MODAL
// ==========================================================================
function requestQuoteAdjustment() {
    const modal = document.getElementById("adjustment-modal");
    if (modal) modal.classList.add("active");
}

function closeAdjustmentModal(event) {
    const modal = document.getElementById("adjustment-modal");
    if (modal) modal.classList.remove("active");
}

function submitAdjustmentRequest(event) {
    event.preventDefault();
    const msg = document.getElementById("adj-message").value;
    const phone = document.getElementById("adj-client-phone").value;
    const waText = `Hi ${state.expert.name}, I am reviewing the Solve Your Trip proposal for ${state.resort.name}.\n\nI would like to request some customization:\n"${msg}"\n\nMy contact number: ${phone}`;
    const whatsappUrl = `https://wa.me/${state.expert.whatsapp}?text=${encodeURIComponent(waText)}`;
    window.open(whatsappUrl, "_blank");
    closeAdjustmentModal();
}

// ==========================================================================
// IMPORT & EXPORT QUOTES (JSON FILE)
// ==========================================================================
function exportQuoteJSON() {
    const filename = `SolveYourTrip_Quote_${state.guest.name.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.json`;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 4));
    
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function importQuoteJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            let parsed = JSON.parse(e.target.result);
            parsed = migrateState(parsed);
            
            if (parsed.guest && parsed.resort && parsed.rooms && parsed.transfers) {
                state = parsed;
                saveState();
                
                const stayTypeEl = document.getElementById("q-stay-type");
                if (stayTypeEl) stayTypeEl.value = state.stayType || "full";
                const cancelSelect = document.getElementById("q-cancellation-policy-select");
                if (cancelSelect) cancelSelect.value = state.guest.cancellationPolicy || "Free cancellation";
                
                initBuilderFormControls();
                renderPreview();
                alert("Quote imported successfully!");
            } else {
                alert("Error: File is not a valid Quote configuration JSON.");
            }
        } catch (err) {
            console.error("JSON parsing error", err);
            alert("Error reading file. Please ensure it is a valid JSON.");
        }
    };
    reader.readAsText(file);
    event.target.value = "";
}

// ==========================================================================
// UTILITY HELPERS FOR DEEP OBJECT GET/SET BY STRING PATHS
// ==========================================================================
function getValueByPath(obj, path) {
    return path.split('.').reduce((acc, part) => {
        return acc && acc[part] !== undefined ? acc[part] : null;
    }, obj);
}

// Set nested object path value
function setValueByPath(obj, path, value) {
    const parts = path.split('.');
    const last = parts.pop();
    const target = parts.reduce((acc, part) => {
        if (!acc[part]) acc[part] = {};
        return acc[part];
    }, obj);
    if (target) {
        target[last] = value;
    }
}

// ==========================================================================
// API INTEGRATION & CLONE FUNCTIONALITY
// ==========================================================================

// Save the current quote to server API
async function saveQuoteToAPI() {
    try {
        if (!state.id) {
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 1000);
            state.id = `mauritius-${timestamp}-${random}`;
        }

        const response = await fetch('/api/mauritius-quotes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state)
        });

        if (!response.ok) {
            let errorMsg = response.statusText || '';
            try {
                const errData = await response.json();
                if (errData && errData.error) errorMsg = errData.error;
            } catch (_) {}
            throw new Error(`Failed to save: ${errorMsg}`);
        }
        const result = await response.json();
        
        updateKillLinkButton();
        alert(`✅ Quote saved!\n\nShare link:\n${window.location.origin}${result.shareUrl}`);
        copyToClipboard(window.location.origin + result.shareUrl);
        loadSavedQuotes();
    } catch (err) {
        alert(`Failed to save quote: ${err.message}`);
    }
}

// Load all saved quotes from server and render sidebar list
async function loadSavedQuotes() {
    try {
        const response = await fetch('/api/mauritius-quotes');
        if (!response.ok) return [];
        const quotes = await response.json();
        renderSavedQuotesList(quotes);
        return quotes;
    } catch (err) {
        return [];
    }
}

// Render the saved quotes list in the sidebar panel
function renderSavedQuotesList(quotes) {
    const container = document.getElementById('saved-quotes-list');
    if (!container) return;

    if (!quotes || quotes.length === 0) {
        container.innerHTML = '<p class="no-quotes-msg">No saved quotes yet. Hit 💾 Save to create one.</p>';
        return;
    }

    container.innerHTML = '';
    quotes.forEach(q => {
        const isActive = state.id === q.id;
        const isKilled = !!(q.linkKilled || q.isKilled);
        const statusIcon = isKilled ? '🚫' : '🟢';
        const statusClass = isKilled ? 'status-killed' : 'status-active';
        const item = document.createElement('div');
        item.className = `quote-list-item${isActive ? ' active' : ''}`;
        item.innerHTML = `
            <div class="quote-item-info" onclick="loadQuoteFromAPI('${q.id}')">
                <div class="quote-item-name"><span class="${statusClass}" style="margin-right: 4px;">${statusIcon}</span>${q.guestName || 'Unnamed Guest'}</div>
                <div class="quote-item-resort" style="font-size: 11px; font-weight: 500; color: var(--text-main); opacity: 0.8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px;">${q.resortName || 'Unnamed Resort'}</div>
                <div class="quote-item-meta">${q.duration || ''} · ${q.price || ''}</div>
                <div class="quote-item-date">${q.checkIn || ''}</div>
            </div>
            <div class="quote-item-actions">
                <button class="btn-icon-sm" title="${isKilled ? 'Activate Link' : 'Kill Link'}" onclick="event.stopPropagation(); toggleLinkStatusFromSidebar('${q.id}', ${!isKilled})">${isKilled ? '⚡' : '💀'}</button>
                <button class="btn-icon-sm" title="Open preview" onclick="event.stopPropagation(); window.open('/quotes-shared/${q.id}.html','_blank')">🔗</button>
                <button class="btn-icon-sm btn-danger-sm" title="Delete" onclick="event.stopPropagation(); deleteQuoteFromAPI('${q.id}')">🗑️</button>
            </div>
        `;
        container.appendChild(item);
    });
}

// Load a specific quote
async function loadQuoteFromAPI(id) {
    try {
        const response = await fetch(`/api/mauritius-quotes/${id}`);
        if (!response.ok) throw new Error('Quote not found');
        let parsed = await response.json();
        parsed = migrateState(parsed);
        state = parsed;
        saveState();
        initBuilderFormControls(); // Refresh builder inputs
        renderPreview();
        updateKillLinkButton();
        alert(`✅ Loaded: ${state.guest.name}`);
    } catch (err) {
        alert(`Failed to load quote: ${err.message}`);
    }
}

// Delete a quote
async function deleteQuoteFromAPI(id) {
    if (!confirm('Delete this quote?')) return;
    try {
        await fetch(`/api/mauritius-quotes/${id}`, { method: 'DELETE' });
        // If we deleted the currently loaded quote, reset to new
        if (state.id === id) {
            state = JSON.parse(JSON.stringify(DEFAULT_QUOTE_DATA));
            delete state.id;
            saveState();
            initBuilderFormControls();
            renderPreview();
        }
        loadSavedQuotes();
    } catch (err) {
        alert(`Failed to delete: ${err.message}`);
    }
}

// Copy to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        });
    }
}

// Copy to WhatsApp
function copyWhatsAppText() {
    const text = `Dear ${state.guest?.name || 'Guest'},\n\n🏝️ Your Mauritius Getaway\n✈️ ${formatDisplayDate(state.guest?.checkIn) || ''}\n🏨 ${state.resort?.name || 'Resort'}\n💰 ${state.guest?.price || 'Quote'}\n\nWe look forward to serving you!`;
    copyToClipboard(text);
    alert('✅ Copied to clipboard!');
}

// Open preview
function openLivePreview() {
    if (!state.id) {
        alert('Please save this quote first.');
        return;
    }
    window.open(`/quotes-shared/${state.id}.html`, '_blank');
}

// Duplicate quote — clone + save to API so a share link is generated
async function duplicateQuote() {
    const cloned = JSON.parse(JSON.stringify(state));
    delete cloned._id; // Remove MongoDB internal ID so it creates a new record
    cloned.id = `mauritius-${Date.now()}-${Math.random() * 1000 | 0}`;
    cloned.guest.name = cloned.guest.name + ' (Copy)';
    state = cloned;
    saveState();
    renderPreview();
    // Auto-save so the clone gets a real share link immediately
    await saveQuoteToAPI();
}

// Reset to a blank new quote
function resetToNew() {
    if (!confirm('Start a new blank quote? Unsaved changes will be lost.')) return;
    state = JSON.parse(JSON.stringify(DEFAULT_QUOTE_DATA));
    delete state.id;
    saveState();
    initBuilderFormControls();
    renderPreview();
    updateKillLinkButton();
}

// Update appearance of the Kill Link button based on state
function updateKillLinkButton() {
    const btn = document.getElementById("btn-kill-link");
    if (!btn) return;
    if (!state.id) {
        btn.style.display = "none";
        return;
    }
    btn.style.display = "inline-flex";
    if (state.linkKilled || state.isKilled) {
        btn.innerHTML = "⚡ Activate Link";
        btn.title = "This link is currently killed. Click to activate it.";
        btn.style.backgroundColor = "var(--accent-color)";
        btn.style.color = "#ffffff";
        btn.style.borderColor = "var(--accent-color)";
    } else {
        btn.innerHTML = "💀 Kill Link";
        btn.title = "Click to deactivate the client's shared preview link.";
        btn.style.backgroundColor = "";
        btn.style.color = "";
        btn.style.borderColor = "";
    }
}

// Toggle link status of the currently loaded quote
async function toggleCurrentLinkStatus() {
    if (!state.id) {
        alert('Please save the quote first before managing its link.');
        return;
    }
    const currentStatus = !!(state.linkKilled || state.isKilled);
    const nextStatus = !currentStatus;
    const confirmMessage = nextStatus
        ? 'Are you sure you want to KILL the shared preview link? The guest will no longer be able to view it.'
        : 'Do you want to REACTIVATE the shared preview link?';
    
    if (!confirm(confirmMessage)) return;

    state.linkKilled = nextStatus;
    state.isKilled = nextStatus;
    saveState();
    updateKillLinkButton();

    // Now save to the server
    await saveQuoteToAPIQuietly();
}

// Quietly save quote state to the server (no alerts, updates list)
async function saveQuoteToAPIQuietly() {
    try {
        const response = await fetch('/api/mauritius-quotes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state)
        });
        if (!response.ok) throw new Error('Failed to update quote on server');
        loadSavedQuotes();
    } catch (err) {
        console.error('Silent save error:', err);
    }
}

// Toggle link status of any quote directly from the sidebar list
async function toggleLinkStatusFromSidebar(id, newStatus) {
    try {
        const response = await fetch(`/api/mauritius-quotes/${id}`);
        if (!response.ok) throw new Error('Quote not found');
        const quote = await response.json();
        quote.linkKilled = newStatus;
        quote.isKilled = newStatus;
        
        // Save the updated quote
        const saveResponse = await fetch('/api/mauritius-quotes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quote)
        });
        if (!saveResponse.ok) throw new Error('Failed to save updated quote');
        
        // If this quote is currently loaded in the builder, update our local state too!
        if (state.id === id) {
            state.linkKilled = newStatus;
            state.isKilled = newStatus;
            saveState();
            updateKillLinkButton();
        }
        
        // Reload list
        loadSavedQuotes();
    } catch (err) {
        alert(`Failed to toggle link status: ${err.message}`);
    }
}

// Copy professional email summary to clipboard
function copyEmailText() {
    if (!state.id) {
        alert('Please save the quote first before generating the email copy format.');
        return;
    }
    
    const guest = state.guest || {};
    const resort = state.resort || {};
    
    // Format check-in/check-out dates
    const checkInDate = guest.checkIn ? new Date(guest.checkIn) : null;
    const checkOutDate = guest.checkOut ? new Date(guest.checkOut) : null;
    
    const checkInStr = checkInDate && !isNaN(checkInDate) 
        ? checkInDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) 
        : (guest.checkIn || 'N/A');
        
    const checkOutStr = checkOutDate && !isNaN(checkOutDate) 
        ? checkOutDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) 
        : (guest.checkOut || 'N/A');
    
    // Format validity & deadline dates
    const validDate = guest.priceValidTill ? new Date(guest.priceValidTill) : null;
    const deadlineDate = guest.paymentDeadline ? new Date(guest.paymentDeadline) : null;
    
    const validStr = validDate && !isNaN(validDate)
        ? validDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : (guest.priceValidTill || 'N/A');
        
    const deadlineStr = deadlineDate && !isNaN(deadlineDate)
        ? deadlineDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : (guest.paymentDeadline || 'N/A');

    // Build rooms text
    let roomsText = '';
    if (state.rooms && state.rooms.length > 0) {
        roomsText = state.rooms.map((r, i) => `* Room Option ${i + 1}: ${r.name || 'Room'} (${r.nights || 0} Nights, ${r.size || 'N/A'})`).join('\n');
    } else {
        roomsText = '* Standard Villa arrangements';
    }

    // Build inclusions text
    let inclusionsText = '';
    if (state.generalInclusions && state.generalInclusions.length > 0) {
        inclusionsText += '\nGeneral Inclusions:\n' + state.generalInclusions.map(inc => `* ${inc}`).join('\n');
    }
    if (state.honeymoonBenefits && state.honeymoonBenefits.length > 0) {
        const occasionTitle = (state.occasionType || 'honeymoon').toUpperCase();
        inclusionsText += `\n\n${occasionTitle} Benefits:\n` + state.honeymoonBenefits.map(ben => `* ${ben}`).join('\n');
    }
    if (!inclusionsText) {
        inclusionsText = '\nStandard resort inclusions apply.';
    }

    const shareUrl = `${window.location.origin}/quotes-shared/${state.id}.html`;
    const subjectLine = `Bespoke Mauritius Proposal - ${resort.name || 'Mauritius Resort'} (Prepared for ${guest.name || 'Guest'})`;

    const emailBody = `Dear ${guest.name || 'Guest'},

Thank you for choosing Solve Your Trip to plan your luxury getaway to the Mauritius. 

We are pleased to present your customized itinerary proposal. Below is a summary of your luxury resort arrangements:

==================================================
🏨 RESORT & ARRIVAL DETAILS
==================================================
Resort: ${resort.name || 'Mauritius Resort'}
Check-in Date: ${checkInStr}
Check-out Date: ${checkOutStr}
Duration: ${guest.duration || 'N/A'}
Room Category Details:
${roomsText}
Meal Plan: ${state.mealPlan || 'N/A'}
Meal Details: ${state.mealPlanDetails || 'N/A'}

==================================================
💰 QUOTE PRICING & DEADLINES
==================================================
Special Discounted Price: ${guest.price || 'N/A'} (Inclusive of all taxes and green tax)
Original Rates: ${guest.originalPrice || 'N/A'}
Price Validity: Until ${validStr}
Payment Deadline: ${deadlineStr}
Cancellation Policy: ${guest.cancellationPolicy || 'N/A'}

==================================================
✨ EXCLUSIVE BENEFITS & INCLUSIONS
==================================================${inclusionsText}

==================================================
🔗 INTERACTIVE PROPOSAL PREVIEW
==================================================
To view the full details of your proposal, resort gallery, and complete room configurations, please open your personalized interactive preview link:
${shareUrl}

For any customizations or changes, you can request adjustments directly through the interactive proposal link or contact our concierge desk.

We look forward to welcoming you to the Mauritius!

Warm regards,

Concierge Desk
Solve Your Trip Private Limited
Email: bookings@solveyourtrip.com
Phone: +91 62809 75235`;

    const fullText = `Subject: ${subjectLine}\n\n${emailBody}`;
    
    copyToClipboard(fullText);
    alert('✅ Professional email format copied to clipboard!');
}

// Setup listeners
function setupQuoteEventListeners() {
    document.getElementById('btn-new')?.addEventListener('click', resetToNew);
    document.getElementById('btn-save')?.addEventListener('click', saveQuoteToAPI);
    document.getElementById('btn-copy-wa')?.addEventListener('click', copyWhatsAppText);
    document.getElementById('btn-copy-email')?.addEventListener('click', copyEmailText);
    document.getElementById('btn-view-live')?.addEventListener('click', openLivePreview);
    document.getElementById('btn-kill-link')?.addEventListener('click', toggleCurrentLinkStatus);
    document.getElementById('btn-duplicate')?.addEventListener('click', duplicateQuote);
    loadSavedQuotes();
    updateKillLinkButton();
}

// Attach functions to the global scope to ensure inline elements and dynamic ones can trigger them
window.slideRoom = slideRoom;
window.setRoomSlideIndex = setRoomSlideIndex;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.navigateLightbox = navigateLightbox;
window.requestQuoteAdjustment = requestQuoteAdjustment;
window.closeAdjustmentModal = closeAdjustmentModal;
window.submitAdjustmentRequest = submitAdjustmentRequest;
window.addHoneymoonBenefit = addHoneymoonBenefit;
window.addGeneralInclusion = addGeneralInclusion;
window.loadQuoteFromAPI = loadQuoteFromAPI;
window.deleteQuoteFromAPI = deleteQuoteFromAPI;
window.toggleLinkStatusFromSidebar = toggleLinkStatusFromSidebar;
window.copyEmailText = copyEmailText;
