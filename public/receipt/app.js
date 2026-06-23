// --- Solve Your Trip Receipt Editor Logic ---

// 1. Initial State Seeded with Original PDF Data
let state = {
    companyName: "Solve Your Trip",
    companyTagline: "Dream it. Plan it. Solve it.",
    companyUrl: "solveyourtrip.com",
    receiptNo: "SYT-RCPT-2026-0001",
    receiptDate: "23 Jun 2026",
    supportPhone: "+91 87964 33706",
    companyAddress: "Solve Your Trip · A-62 F/F, Old No A-32/A, Pl. No 4, 92 C/A, Gali No 5, Vinod Nagar East, East Delhi, Delhi, India — Pin: 110091",
    companyTel: "+91 87964 33706",
    companyEmail: "bookings@solveyourtrip.com",
    guestName: "Syed Shakil Ahmed",
    guestContact: "+91 98199 40524",
    tripPackage: "Flight Booking",
    travelDates: "02 Jul 2026",
    charges: [
        {
            description: "Mumbai - Abu Dhabi -Barcelona (Ethiad Airways)\n2 Adults",
            amount: 75000
        }
    ],
    payments: [
        {
            date: "19 Jun 2026",
            reference: "00901050061767-TPT-BARCELONA TICKET-SYED SHAKIL AHMED",
            amount: 75000
        }
    ],
    showStamp: true,
    signatureType: "image",
    signatureImg: "assets/Sayantan Sign - Director.png",
    directorName: "SAYANTAN PAUL",
    signatureStyle: "style-3",
    notes: "This receipt acknowledges the amount received against the booking referenced above. All payments are subject to the cancellation and refund policy shared at the time of booking. Promotional and sale rates are generally non-refundable. Taxes and optional charges payable directly to the hotel/supplier (where applicable) are not included in this receipt unless specified. Please verify all details and inform us immediately of any discrepancy.",
    receivedThanks: "Received with thanks — Solve Your Trip",
    footerCompany: "Solve Your Trip",
    footerTagline: "Dream it. Plan it. Solve it.",
    footerWhatsapp: "+91 87964 33706",
    footerEmail: "bookings@solveyourtrip.com",
    footerInsta: "@SolveYourTrip",
    amountInWords: ""
};

// 2. DOM Elements Selection
const elReceiptNo = document.getElementById('receiptNo');
const elReceiptDate = document.getElementById('receiptDate');
const elSupportPhone = document.getElementById('supportPhone');
const elGuestName = document.getElementById('guestName');
const elGuestContact = document.getElementById('guestContact');
const elTripPackage = document.getElementById('tripPackage');
const elTravelDates = document.getElementById('travelDates');
const elShowStamp = document.getElementById('showStamp');
const elSignatureType = document.getElementById('signatureType');
const elSigImageUploadGroup = document.getElementById('sigImageUploadGroup');
const elSignatureStyleGroup = document.getElementById('signatureStyleGroup');
const elUploadSigImg = document.getElementById('uploadSigImg');
const elDirectorName = document.getElementById('directorName');
const elSignatureStyle = document.getElementById('signatureStyle');
const elReceiptNotes = document.getElementById('receiptNotes');

// Preview DOM elements
const pvCompanyName = document.getElementById('pvCompanyName');
const pvCompanyTagline = document.getElementById('pvCompanyTagline');
const pvCompanyUrl = document.getElementById('pvCompanyUrl');
const pvReceiptNo = document.getElementById('pvReceiptNo');
const pvReceiptDate = document.getElementById('pvReceiptDate');
const pvSupportPhone = document.getElementById('pvSupportPhone');
const pvCompanyAddress = document.getElementById('pvCompanyAddress');
const pvCompanyTel = document.getElementById('pvCompanyTel');
const pvCompanyEmail = document.getElementById('pvCompanyEmail');
const pvGuestName = document.getElementById('pvGuestName');
const pvGuestContact = document.getElementById('pvGuestContact');
const pvTripPackage = document.getElementById('pvTripPackage');
const pvTravelDates = document.getElementById('pvTravelDates');
const pvChargeTableBody = document.getElementById('pvChargeTableBody');
const pvPaymentTableBody = document.getElementById('pvPaymentTableBody');
const pvSubtotal = document.getElementById('pvSubtotal');
const pvTotalPaid = document.getElementById('pvTotalPaid');
const pvBalanceDue = document.getElementById('pvBalanceDue');
const pvGrandTotal = document.getElementById('pvGrandTotal');
const pvAmountInWords = document.getElementById('pvAmountInWords');
const pvNotesAndTerms = document.getElementById('pvNotesAndTerms');
const stampContainer = document.getElementById('stampContainer');
const pvStampSignature = document.getElementById('pvStampSignature');
const pvStampDirector = document.getElementById('pvStampDirector');
const pvReceivedThanks = document.getElementById('pvReceivedThanks');
const pvFooterCompany = document.getElementById('pvFooterCompany');
const pvFooterTagline = document.getElementById('pvFooterTagline');
const pvFooterWhatsapp = document.getElementById('pvFooterWhatsapp');
const pvFooterEmail = document.getElementById('pvFooterEmail');
const pvFooterInsta = document.getElementById('pvFooterInsta');

// Sidebar containers
const chargeRowsContainer = document.getElementById('chargeRowsContainer');
const paymentRowsContainer = document.getElementById('paymentRowsContainer');

// Buttons & Utilities
const btnAddCharge = document.getElementById('addChargeRow');
const btnAddPayment = document.getElementById('addPaymentRow');
const btnPrint = document.getElementById('printBtn');
const btnExport = document.getElementById('exportBtn');
const btnImport = document.getElementById('importFile');

// 3. Indian Currency Formatter (groups as 75,000, 1,50,000)
function formatCurrency(val) {
    if (isNaN(val) || val === null) return '0';
    return Number(val).toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

// Parse string amount into clean float number
function parseAmount(str) {
    if (!str) return 0;
    const cleanStr = String(str).replace(/[^\d.-]/g, '');
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num;
}

// 4. Number to Words converter (Indian System: Crore, Lakh, Thousand)
function convertNumberToWords(amount) {
    const num = Math.floor(amount);
    if (num === 0) return 'Zero Rupees Only.';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    function convertLessThanOneThousand(n) {
        if (n === 0) return '';
        let temp = '';
        if (n >= 100) {
            temp += ones[Math.floor(n / 100)] + ' Hundred ';
            n %= 100;
        }
        if (n >= 20) {
            temp += tens[Math.floor(n / 10)] + ' ';
            n %= 10;
        }
        if (n > 0) {
            temp += ones[n] + ' ';
        }
        return temp.trim();
    }
    
    let words = '';
    
    let crore = Math.floor(num / 10000000);
    let rem = num % 10000000;
    let lakh = Math.floor(rem / 100000);
    rem %= 100000;
    let thousand = Math.floor(rem / 1000);
    rem %= 1000;
    let hundred = Math.floor(rem / 100);
    let remaining = rem % 100;
    
    if (crore > 0) {
        words += convertLessThanOneThousand(crore) + ' Crore ';
    }
    if (lakh > 0) {
        words += convertLessThanOneThousand(lakh) + ' Lakh ';
    }
    if (thousand > 0) {
        words += convertLessThanOneThousand(thousand) + ' Thousand ';
    }
    if (hundred > 0) {
        words += ones[hundred] + ' Hundred ';
    }
    
    if (remaining > 0) {
        if (words !== '') words += 'and ';
        if (remaining < 20) {
            words += ones[remaining] + ' ';
        } else {
            words += tens[Math.floor(remaining / 10)] + ' ';
            if (remaining % 10 > 0) {
                words += ones[remaining % 10] + ' ';
            }
        }
    }
    
    // Capitalize first letter and append Rupees Only.
    const result = words.trim();
    return result.charAt(0).toUpperCase() + result.slice(1) + ' Rupees Only.';
}

// 5. App Core Calculations
function runCalculations() {
    let subtotal = 0;
    state.charges.forEach(c => {
        subtotal += Number(c.amount || 0);
    });
    
    let totalPaid = 0;
    state.payments.forEach(p => {
        totalPaid += Number(p.amount || 0);
    });
    
    let balanceDue = subtotal - totalPaid;
    let grandTotal = subtotal;

    // Check if grandTotal has changed, or if state.amountInWords is empty
    if (state.grandTotal !== grandTotal || !state.amountInWords) {
        state.grandTotal = grandTotal;
        state.amountInWords = convertNumberToWords(grandTotal);
    } else {
        state.grandTotal = grandTotal;
    }

    // Update state totals
    state.subtotal = subtotal;
    state.totalPaid = totalPaid;
    state.balanceDue = balanceDue;

    // Render totals to preview
    pvSubtotal.innerText = '₹ ' + formatCurrency(subtotal);
    pvTotalPaid.innerText = '₹ ' + formatCurrency(totalPaid);
    pvBalanceDue.innerText = '₹ ' + formatCurrency(balanceDue);
    pvGrandTotal.innerText = '₹ ' + formatCurrency(grandTotal);

    // Set amount in words from state
    pvAmountInWords.innerText = state.amountInWords;

    // Dynamic Paid/Partial/Unpaid Badge Switcher
    const pvPaidBadge = document.getElementById('pvPaidBadge');
    if (balanceDue <= 0 && grandTotal > 0) {
        pvPaidBadge.innerHTML = '<span class="dot">●</span> PAID IN FULL';
        pvPaidBadge.className = 'paid-badge status-paid';
    } else if (totalPaid > 0 && balanceDue > 0) {
        pvPaidBadge.innerHTML = '<span class="dot">●</span> PARTIALLY PAID';
        pvPaidBadge.className = 'paid-badge status-partial';
    } else {
        pvPaidBadge.innerHTML = '<span class="dot">●</span> UNPAID';
        pvPaidBadge.className = 'paid-badge status-unpaid';
    }
}

// 6. Synchronize State to UI
function updateUI() {
    // Sync to Sidebar Inputs (only update if not currently typing, to protect caret focus)
    if (document.activeElement !== elReceiptNo) elReceiptNo.value = state.receiptNo;
    if (document.activeElement !== elReceiptDate) elReceiptDate.value = state.receiptDate;
    if (document.activeElement !== elSupportPhone) elSupportPhone.value = state.supportPhone;
    if (document.activeElement !== elGuestName) elGuestName.value = state.guestName;
    if (document.activeElement !== elGuestContact) elGuestContact.value = state.guestContact;
    if (document.activeElement !== elTripPackage) elTripPackage.value = state.tripPackage;
    if (document.activeElement !== elTravelDates) elTravelDates.value = state.travelDates;
    if (document.activeElement !== elDirectorName) elDirectorName.value = state.directorName;
    if (document.activeElement !== elReceiptNotes) elReceiptNotes.value = state.notes;
    elShowStamp.checked = state.showStamp;
    elSignatureType.value = state.signatureType;
    elSignatureStyle.value = state.signatureStyle;

    // Toggle sidebar groups based on signature type
    if (state.signatureType === 'image') {
        elSigImageUploadGroup.style.display = 'block';
        elSignatureStyleGroup.style.display = 'none';
    } else {
        elSigImageUploadGroup.style.display = 'none';
        elSignatureStyleGroup.style.display = 'block';
    }

    // Sync to Preview Page Elements
    pvCompanyName.innerText = state.companyName;
    pvCompanyTagline.innerText = state.companyTagline;
    pvCompanyUrl.innerText = state.companyUrl;
    pvReceiptNo.innerText = state.receiptNo;
    pvReceiptDate.innerText = state.receiptDate;
    pvSupportPhone.innerText = state.supportPhone;
    pvCompanyAddress.innerText = state.companyAddress;
    pvCompanyTel.innerText = state.companyTel;
    pvCompanyEmail.innerText = state.companyEmail;
    pvGuestName.innerText = state.guestName;
    pvGuestContact.innerText = state.guestContact;
    pvTripPackage.innerText = state.tripPackage;
    pvTravelDates.innerText = state.travelDates;
    pvNotesAndTerms.innerText = state.notes;
    pvReceivedThanks.innerText = state.receivedThanks;
    pvFooterCompany.innerText = state.footerCompany;
    pvFooterTagline.innerText = state.footerTagline;
    pvFooterWhatsapp.innerText = state.footerWhatsapp;
    pvFooterEmail.innerText = state.footerEmail;
    pvFooterInsta.innerText = state.footerInsta;

    // Sync Stamp & Signature
    stampContainer.style.opacity = state.showStamp ? '1' : '0';
    stampContainer.style.pointerEvents = state.showStamp ? 'all' : 'none';
    
    // Toggle image vs text signature in preview
    const pvDigitalStamp = document.getElementById('pvDigitalStamp');
    const pvImageStamp = document.getElementById('pvImageStamp');
    const pvStampSigImg = document.getElementById('pvStampSigImg');
    
    if (state.signatureType === 'image') {
        pvDigitalStamp.style.display = 'none';
        pvImageStamp.style.display = 'block';
        pvStampSigImg.src = state.signatureImg;
    } else {
        pvDigitalStamp.style.display = 'flex';
        pvImageStamp.style.display = 'none';
        
        // Render digital signature text inside pvDigitalStamp
        const pvStampSignature = document.getElementById('pvStampSignature');
        const directorFirstName = state.directorName.split(' ')[0] || 'Sayantan';
        pvStampSignature.innerText = directorFirstName.charAt(0).toUpperCase() + directorFirstName.slice(1).toLowerCase();
        pvStampSignature.className = 'stamp-signature';
        pvStampSignature.classList.add(state.signatureStyle);
        
        const pvStampDirector = document.getElementById('pvStampDirector');
        pvStampDirector.innerText = 'DIRECTOR - ' + state.directorName.toUpperCase();
    }



    // Redraw Tables & run calculations
    renderTables();
    runCalculations();
}

// 7. Dynamic Table Rendering
function renderTables() {
    // --- Render Charge Summary Table ---
    // A. Sidebar Editor Rows
    chargeRowsContainer.innerHTML = '';
    state.charges.forEach((charge, index) => {
        const row = document.createElement('div');
        row.className = 'dynamic-row-item';
        row.innerHTML = `
            <div class="row-desc">
                <input type="text" placeholder="Description" value="${charge.description.replace(/"/g, '&quot;')}" data-index="${index}" class="sidebar-charge-desc">
            </div>
            <div class="row-amount">
                <input type="number" placeholder="Amount" value="${charge.amount}" data-index="${index}" class="sidebar-charge-amount">
            </div>
            <button type="button" class="btn-remove-row" data-index="${index}" title="Remove Item">&times;</button>
        `;
        chargeRowsContainer.appendChild(row);
    });

    // B. Preview Table Body
    pvChargeTableBody.innerHTML = '';
    state.charges.forEach((charge, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="width: 50px;" class="cell-index">${index + 1}</td>
            <td contenteditable="true" class="pv-charge-desc" data-index="${index}">${charge.description.replace(/\n/g, '<br>')}</td>
            <td style="width: 150px;" contenteditable="true" class="text-right pv-charge-amount" data-index="${index}">₹ ${formatCurrency(charge.amount)}</td>
        `;
        pvChargeTableBody.appendChild(tr);
    });

    // --- Render Payment Received Table ---
    // A. Sidebar Editor Rows
    paymentRowsContainer.innerHTML = '';
    state.payments.forEach((payment, index) => {
        const row = document.createElement('div');
        row.className = 'dynamic-row-item';
        row.style.flexDirection = 'column';
        row.style.alignItems = 'stretch';
        row.innerHTML = `
            <div style="display: flex; gap: 8px; margin-bottom: 4px;">
                <input type="text" placeholder="Date (e.g. 19 Jun 2026)" value="${payment.date}" data-index="${index}" class="sidebar-pay-date" style="width: 120px;">
                <input type="number" placeholder="Amount" value="${payment.amount}" data-index="${index}" class="sidebar-pay-amount" style="flex: 1;">
                <button type="button" class="btn-remove-row remove-pay-btn" data-index="${index}" style="align-self: center;">&times;</button>
            </div>
            <input type="text" placeholder="Mode / Reference" value="${payment.reference.replace(/"/g, '&quot;')}" data-index="${index}" class="sidebar-pay-ref">
        `;
        paymentRowsContainer.appendChild(row);
    });

    // B. Preview Table Body
    pvPaymentTableBody.innerHTML = '';
    state.payments.forEach((payment, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="width: 90px;" contenteditable="true" class="pv-pay-date" data-index="${index}">${payment.date}</td>
            <td contenteditable="true" class="pv-pay-ref" data-index="${index}">${payment.reference}</td>
            <td style="width: 100px;" contenteditable="true" class="text-right pv-pay-amount" data-index="${index}">₹ ${formatCurrency(payment.amount)}</td>
        `;
        pvPaymentTableBody.appendChild(tr);
    });
}

// 8. Event Listeners - Sidebar Inputs (Syncing to State)
document.addEventListener('input', (e) => {
    // Meta fields
    if (e.target.id === 'receiptNo') { state.receiptNo = e.target.value; updateUI(); }
    if (e.target.id === 'receiptDate') { state.receiptDate = e.target.value; updateUI(); }
    if (e.target.id === 'supportPhone') { state.supportPhone = e.target.value; updateUI(); }
    if (e.target.id === 'guestName') { state.guestName = e.target.value; updateUI(); }
    if (e.target.id === 'guestContact') { state.guestContact = e.target.value; updateUI(); }
    if (e.target.id === 'tripPackage') { state.tripPackage = e.target.value; updateUI(); }
    if (e.target.id === 'travelDates') { state.travelDates = e.target.value; updateUI(); }
    if (e.target.id === 'directorName') { state.directorName = e.target.value; updateUI(); }
    if (e.target.id === 'receiptNotes') { state.notes = e.target.value; updateUI(); }

    // Dynamic Charge Row inputs in Sidebar
    if (e.target.classList.contains('sidebar-charge-desc')) {
        const idx = parseInt(e.target.dataset.index);
        state.charges[idx].description = e.target.value;
        // Directly sync matching cell to avoid full re-rendering and losing focus
        const pvCell = pvChargeTableBody.querySelector(`.pv-charge-desc[data-index="${idx}"]`);
        if (pvCell) pvCell.innerHTML = e.target.value.replace(/\n/g, '<br>');
    }
    if (e.target.classList.contains('sidebar-charge-amount')) {
        const idx = parseInt(e.target.dataset.index);
        state.charges[idx].amount = parseAmount(e.target.value);
        const pvCell = pvChargeTableBody.querySelector(`.pv-charge-amount[data-index="${idx}"]`);
        if (pvCell) pvCell.innerText = '₹ ' + formatCurrency(state.charges[idx].amount);
        runCalculations();
    }

    // Dynamic Payment Row inputs in Sidebar
    if (e.target.classList.contains('sidebar-pay-date')) {
        const idx = parseInt(e.target.dataset.index);
        state.payments[idx].date = e.target.value;
        const pvCell = pvPaymentTableBody.querySelector(`.pv-pay-date[data-index="${idx}"]`);
        if (pvCell) pvCell.innerText = e.target.value;
    }
    if (e.target.classList.contains('sidebar-pay-ref')) {
        const idx = parseInt(e.target.dataset.index);
        state.payments[idx].reference = e.target.value;
        const pvCell = pvPaymentTableBody.querySelector(`.pv-pay-ref[data-index="${idx}"]`);
        if (pvCell) pvCell.innerText = e.target.value;
    }
    if (e.target.classList.contains('sidebar-pay-amount')) {
        const idx = parseInt(e.target.dataset.index);
        state.payments[idx].amount = parseAmount(e.target.value);
        const pvCell = pvPaymentTableBody.querySelector(`.pv-pay-amount[data-index="${idx}"]`);
        if (pvCell) pvCell.innerText = '₹ ' + formatCurrency(state.payments[idx].amount);
        runCalculations();
    }

    // Inline contenteditable preview edits
    if (e.target.hasAttribute('contenteditable')) {
        const id = e.target.id;
        const val = e.target.innerText.trim();

        if (id === 'pvCompanyName') {
            state.companyName = val;
            const el = document.getElementById('pvStampCompany');
            if (el) el.innerText = val.toUpperCase();
        }
        if (id === 'pvCompanyTagline') state.companyTagline = val;
        if (id === 'pvCompanyUrl') state.companyUrl = val;
        if (id === 'pvReceiptNo') {
            state.receiptNo = val;
            if (document.activeElement !== elReceiptNo) elReceiptNo.value = val;
        }
        if (id === 'pvReceiptDate') {
            state.receiptDate = val;
            if (document.activeElement !== elReceiptDate) elReceiptDate.value = val;
        }
        if (id === 'pvSupportPhone') {
            state.supportPhone = val;
            if (document.activeElement !== elSupportPhone) elSupportPhone.value = val;
        }
        if (id === 'pvCompanyAddress') state.companyAddress = val;
        if (id === 'pvCompanyTel') state.companyTel = val;
        if (id === 'pvCompanyEmail') state.companyEmail = val;
        if (id === 'pvGuestName') {
            state.guestName = val;
            if (document.activeElement !== elGuestName) elGuestName.value = val;
        }
        if (id === 'pvGuestContact') {
            state.guestContact = val;
            if (document.activeElement !== elGuestContact) elGuestContact.value = val;
        }
        if (id === 'pvTripPackage') {
            state.tripPackage = val;
            if (document.activeElement !== elTripPackage) elTripPackage.value = val;
        }
        if (id === 'pvTravelDates') {
            state.travelDates = val;
            if (document.activeElement !== elTravelDates) elTravelDates.value = val;
        }
        if (id === 'pvNotesAndTerms') {
            state.notes = val;
            if (document.activeElement !== elReceiptNotes) elReceiptNotes.value = val;
        }
        if (id === 'pvReceivedThanks') state.receivedThanks = val;
        if (id === 'pvFooterCompany') state.footerCompany = val;
        if (id === 'pvFooterTagline') state.footerTagline = val;
        if (id === 'pvFooterWhatsapp') state.footerWhatsapp = val;
        if (id === 'pvFooterEmail') state.footerEmail = val;
        if (id === 'pvFooterInsta') state.footerInsta = val;

        if (id === 'pvStampSignature') {
            state.directorName = val.toUpperCase();
            if (document.activeElement !== elDirectorName) elDirectorName.value = val;
            const el = document.getElementById('pvStampDirector');
            if (el) el.innerText = 'DIRECTOR - ' + val.toUpperCase();
        }
        if (id === 'pvStampDirector') {
            const cleanDir = val.replace('DIRECTOR -', '').trim();
            state.directorName = cleanDir;
            if (document.activeElement !== elDirectorName) elDirectorName.value = cleanDir;
        }
        if (id === 'pvAmountInWords') {
            state.amountInWords = val;
        }

        // Inline Table Cells Edits on input
        if (e.target.classList.contains('pv-charge-desc')) {
            const idx = parseInt(e.target.dataset.index);
            const textVal = e.target.innerHTML.replace(/<br>/g, '\n').replace(/<\/?[^>]+(>|$)/g, "");
            state.charges[idx].description = textVal;
            const sidebarInput = chargeRowsContainer.querySelector(`.sidebar-charge-desc[data-index="${idx}"]`);
            if (sidebarInput) sidebarInput.value = textVal;
        }
        if (e.target.classList.contains('pv-charge-amount')) {
            const idx = parseInt(e.target.dataset.index);
            state.charges[idx].amount = parseAmount(val);
            const sidebarInput = chargeRowsContainer.querySelector(`.sidebar-charge-amount[data-index="${idx}"]`);
            if (sidebarInput) sidebarInput.value = state.charges[idx].amount;
            runCalculations();
        }
        if (e.target.classList.contains('pv-pay-date')) {
            const idx = parseInt(e.target.dataset.index);
            state.payments[idx].date = val;
            const sidebarInput = paymentRowsContainer.querySelector(`.sidebar-pay-date[data-index="${idx}"]`);
            if (sidebarInput) sidebarInput.value = val;
        }
        if (e.target.classList.contains('pv-pay-ref')) {
            const idx = parseInt(e.target.dataset.index);
            state.payments[idx].reference = val;
            const sidebarInput = paymentRowsContainer.querySelector(`.sidebar-pay-ref[data-index="${idx}"]`);
            if (sidebarInput) sidebarInput.value = val;
        }
        if (e.target.classList.contains('pv-pay-amount')) {
            const idx = parseInt(e.target.dataset.index);
            state.payments[idx].amount = parseAmount(val);
            const sidebarInput = paymentRowsContainer.querySelector(`.sidebar-pay-amount[data-index="${idx}"]`);
            if (sidebarInput) sidebarInput.value = state.payments[idx].amount;
            runCalculations();
        }
    }
});

// Dropdowns & Checkboxes in Sidebar
elShowStamp.addEventListener('change', (e) => {
    state.showStamp = e.target.checked;
    updateUI();
});

elSignatureType.addEventListener('change', (e) => {
    state.signatureType = e.target.value;
    updateUI();
});

elSignatureStyle.addEventListener('change', (e) => {
    state.signatureStyle = e.target.value;
    updateUI();
});

// Signature Image File Uploader Handler
elUploadSigImg.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        state.signatureImg = event.target.result;
        updateUI();
    };
    reader.readAsDataURL(file);
});

// 9. Event Listeners - Inline edits on Preview (Syncing back to State)
document.addEventListener('blur', (e) => {
    if (!e.target.hasAttribute('contenteditable')) return;

    const id = e.target.id;
    const value = e.target.innerText.trim();

    // Check simple metadata preview fields
    if (id === 'pvCompanyName') state.companyName = value;
    if (id === 'pvCompanyTagline') state.companyTagline = value;
    if (id === 'pvCompanyUrl') state.companyUrl = value;
    if (id === 'pvReceiptNo') state.receiptNo = value;
    if (id === 'pvReceiptDate') state.receiptDate = value;
    if (id === 'pvSupportPhone') state.supportPhone = value;
    if (id === 'pvCompanyAddress') state.companyAddress = value;
    if (id === 'pvGuestName') state.guestName = value;
    if (id === 'pvGuestContact') state.guestContact = value;
    if (id === 'pvAmountInWords') state.amountInWords = value;
    if (id === 'pvTripPackage') state.tripPackage = value;
    if (id === 'pvTravelDates') state.travelDates = value;
    if (id === 'pvNotesAndTerms') state.notes = value;
    if (id === 'pvReceivedThanks') state.receivedThanks = value;
    if (id === 'pvFooterCompany') state.footerCompany = value;
    if (id === 'pvFooterTagline') state.footerTagline = value;
    
    // Address numbers & info
    if (id === 'pvCompanyTel') state.companyTel = value;
    if (id === 'pvCompanyEmail') state.companyEmail = value;
    if (id === 'pvFooterWhatsapp') state.footerWhatsapp = value;
    if (id === 'pvFooterEmail') state.footerEmail = value;
    if (id === 'pvFooterInsta') state.footerInsta = value;

    // Stamp structures
    if (id === 'pvStampCompany') state.companyName = value; // Tie back to company name
    if (id === 'pvStampSignature') {
        // Update director first name based on signature edits
        state.directorName = value.toUpperCase();
    }
    if (id === 'pvStampDirector') {
        const cleanDir = value.replace('DIRECTOR -', '').trim();
        state.directorName = cleanDir;
    }

    // Dynamic Table - Charge Summary Cell Edits
    if (e.target.classList.contains('pv-charge-desc')) {
        const idx = parseInt(e.target.dataset.index);
        // Replace innerHTML with clean text representation, keeping linebreaks
        const textVal = e.target.innerHTML.replace(/<br>/g, '\n').replace(/<\/?[^>]+(>|$)/g, "");
        state.charges[idx].description = textVal;
    }
    if (e.target.classList.contains('pv-charge-amount')) {
        const idx = parseInt(e.target.dataset.index);
        state.charges[idx].amount = parseAmount(value);
    }

    // Dynamic Table - Payments Received Cell Edits
    if (e.target.classList.contains('pv-pay-date')) {
        const idx = parseInt(e.target.dataset.index);
        state.payments[idx].date = value;
    }
    if (e.target.classList.contains('pv-pay-ref')) {
        const idx = parseInt(e.target.dataset.index);
        state.payments[idx].reference = value;
    }
    if (e.target.classList.contains('pv-pay-amount')) {
        const idx = parseInt(e.target.dataset.index);
        state.payments[idx].amount = parseAmount(value);
    }

    // Always trigger UI update to sync form inputs and recalculate state
    updateUI();
}, true); // Use capture phase to handle blur on contenteditable properly

// Prevent Enter key from inserting new block tags in inline elements (except textareas & description cells)
document.addEventListener('keydown', (e) => {
    if (e.target.hasAttribute('contenteditable') && e.key === 'Enter') {
        if (!e.target.classList.contains('pv-charge-desc') && e.target.id !== 'pvNotesAndTerms' && e.target.id !== 'pvCompanyAddress') {
            e.preventDefault();
            e.target.blur(); // Blur on Enter to save
        }
    }
});

// 10. Table Dynamic Row Manipulations
// Charges Row Add/Remove
btnAddCharge.addEventListener('click', () => {
    state.charges.push({
        description: "New Charge Item Description",
        amount: 0
    });
    updateUI();
});

chargeRowsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-remove-row')) {
        const idx = parseInt(e.target.dataset.index);
        if (state.charges.length > 1) {
            state.charges.splice(idx, 1);
            updateUI();
        } else {
            alert("At least one charge summary row must exist.");
        }
    }
});

// Payments Row Add/Remove
btnAddPayment.addEventListener('click', () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    state.payments.push({
        date: formattedDate,
        reference: "Reference Number",
        amount: 0
    });
    updateUI();
});

paymentRowsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-remove-row')) {
        const idx = parseInt(e.target.dataset.index);
        if (state.payments.length > 1) {
            state.payments.splice(idx, 1);
            updateUI();
        } else {
            alert("At least one payment row must exist.");
        }
    }
});

// 11. PDF Print Trigger
btnPrint.addEventListener('click', () => {
    window.print();
});

// 12. State Export & Import (JSON)
btnExport.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 4));
    const downloadAnchor = document.createElement('a');
    
    // Format filename using receipt number
    const safeReceiptNo = state.receiptNo.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `receipt_${safeReceiptNo}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
});

btnImport.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const importedState = JSON.parse(event.target.result);
            // Verify structural presence of essential fields
            if (importedState && typeof importedState === 'object' && Array.isArray(importedState.charges) && Array.isArray(importedState.payments)) {
                state = { ...state, ...importedState };
                updateUI();
                alert("Receipt data imported successfully!");
            } else {
                alert("Invalid JSON format. Make sure it matches receipt configurations.");
            }
        } catch (err) {
            alert("Error parsing file. Please check that it is a valid JSON document.");
            console.error(err);
        }
    };
    reader.readAsText(file);
    // Clear value to allow importing the same file again
    e.target.value = '';
});

// 13. App Bootstrap Initialization
window.addEventListener('DOMContentLoaded', () => {
    updateUI();
});
