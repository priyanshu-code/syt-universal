// --- Solve Your Trip Reimbursement Only Invoice Controller ---

// 1. Initial State Seeded with Sample Reimbursement Data
let state = {
    companyName: "Solve Your Trip Technologies Private Limited",
    companyAddress: "A-62 F/F, Old No A-32/A, Pl. No 4, 92 C/A, Gali No 5, Vinod Nagar East, East Delhi, Delhi, India — Pin: 110091",
    companyGstin: "07ABTCS9189H1ZB",
    companyCin: "U79120DL2026PTC466999",
    companyMsme: "UDYAM-DL-02-0119445",
    companyState: "Delhi",
    companyStateCode: "07",
    companyTel: "+91 87964 33706",
    companyEmail: "bookings@solveyourtrip.com",
    
    guestName: "SOLVE YOUR TRIP",
    guestAddress: "A-62 F/F OLD NO A 32/A PI, NO 492 C/A GNO\n5 Vinod N, East Delhi, East Delhi, East Delhi 110091, Delhi",
    guestGstin: "N/A",
    guestState: "Delhi",
    guestStateCode: "07",

    invoiceNo: "2026-27/5042",
    invoiceDate: "15-Jun-26",
    deliveryNote: "Standard",
    modeTermsOfPayment: "Bank Transfer",
    referenceNoDate: "DEL131432 dt. 15-Jun-26",
    otherReferences: "N/A",
    buyersOrderNo: "N/A",
    buyersOrderDate: "N/A",
    dispatchDocNo: "N/A",
    deliveryNoteDate: "N/A",
    dispatchedThrough: "Courier",
    destination: "Delhi",
    termsOfDelivery: "Reimbursement for government/official service charges. Facilitation fee strictly non-refundable.",

    items: [
        {
            description: "SINGAPORE VISA FEE (D)\n3080 x 3\nSANJEEV KUAMR CHANANA\nMUSKAN\nRANVEER",
            hsnSac: "N/A",
            quantity: 3,
            rate: 3080.00,
            per: "NOS",
            isTaxable: false
        }
    ],

    remarks: "DEL131432 x 3 Singapore Visa processing fees reimbursement.",
    declaration: "We declare that this invoice shows the actual price of the goods/services described and that all particulars are true and correct. These represent pure reimbursements.",
    
    showStamp: true,
    signatureType: "image",
    signatureImg: "assets/Sayantan Sign - Director.png",
    directorName: "SAYANTAN PAUL",
    signatureStyle: "style-3"
};

// 2. DOM Elements Selection - Sidebar Inputs
const elCompanyName = document.getElementById('companyName');
const elCompanyGstin = document.getElementById('companyGstin');
const elCompanyCin = document.getElementById('companyCin');
const elCompanyMsme = document.getElementById('companyMsme');
const elCompanyAddress = document.getElementById('companyAddress');
const elCompanyTel = document.getElementById('companyTel');
const elCompanyEmail = document.getElementById('companyEmail');

const elGuestName = document.getElementById('guestName');
const elGuestGstin = document.getElementById('guestGstin');
const elGuestAddress = document.getElementById('guestAddress');
const elPlaceOfSupply = document.getElementById('placeOfSupply');

const elInvoiceNo = document.getElementById('invoiceNo');
const elInvoiceDate = document.getElementById('invoiceDate');
const elDeliveryNote = document.getElementById('deliveryNote');
const elModeTermsOfPayment = document.getElementById('modeTermsOfPayment');
const elReferenceNoDate = document.getElementById('referenceNoDate');
const elOtherReferences = document.getElementById('otherReferences');
const elBuyersOrderNo = document.getElementById('buyersOrderNo');
const elBuyersOrderDate = document.getElementById('buyersOrderDate');
const elDispatchDocNo = document.getElementById('dispatchDocNo');
const elDeliveryNoteDate = document.getElementById('deliveryNoteDate');
const elDispatchedThrough = document.getElementById('dispatchedThrough');
const elDestination = document.getElementById('destination');
const elTermsOfDelivery = document.getElementById('termsOfDelivery');

const elRemarksInput = document.getElementById('remarksInput');
const elDeclarationInput = document.getElementById('declarationInput');

const elShowStamp = document.getElementById('showStamp');
const elSignatureType = document.getElementById('signatureType');
const elSigImageUploadGroup = document.getElementById('sigImageUploadGroup');
const elSignatureStyleGroup = document.getElementById('signatureStyleGroup');
const elUploadSigImg = document.getElementById('uploadSigImg');
const elDirectorName = document.getElementById('directorName');
const elSignatureStyle = document.getElementById('signatureStyle');

// Preview Pane DOM elements
const pvCompanyName = document.getElementById('pvCompanyName');
const pvCompanyAddress = document.getElementById('pvCompanyAddress');
const pvCompanyGstin = document.getElementById('pvCompanyGstin');
const pvCompanyCin = document.getElementById('pvCompanyCin');
const pvCompanyMsme = document.getElementById('pvCompanyMsme');
const pvCompanyState = document.getElementById('pvCompanyState');
const pvCompanyStateCode = document.getElementById('pvCompanyStateCode');
const pvCompanyTel = document.getElementById('pvCompanyTel');
const pvCompanyEmail = document.getElementById('pvCompanyEmail');

const pvInvoiceNo = document.getElementById('pvInvoiceNo');
const pvInvoiceDate = document.getElementById('pvInvoiceDate');
const pvDeliveryNote = document.getElementById('pvDeliveryNote');
const pvModeTermsOfPayment = document.getElementById('pvModeTermsOfPayment');
const pvReferenceNoDate = document.getElementById('pvReferenceNoDate');
const pvOtherReferences = document.getElementById('pvOtherReferences');
const pvBuyersOrderNo = document.getElementById('pvBuyersOrderNo');
const pvBuyersOrderDate = document.getElementById('pvBuyersOrderDate');
const pvDispatchDocNo = document.getElementById('pvDispatchDocNo');
const pvDispatchDocDate = document.getElementById('pvDispatchDocDate');
const pvDispatchedThrough = document.getElementById('pvDispatchedThrough');
const pvDestination = document.getElementById('pvDestination');

const pvGuestName = document.getElementById('pvGuestName');
const pvGuestAddress = document.getElementById('pvGuestAddress');
const pvGuestGstin = document.getElementById('pvGuestGstin');
const pvGuestState = document.getElementById('pvGuestState');
const pvGuestStateCode = document.getElementById('pvGuestStateCode');
const pvTermsOfDelivery = document.getElementById('pvTermsOfDelivery');

const pvInvoiceTableBody = document.getElementById('pvInvoiceTableBody');
const pvInvoiceTableFoot = document.getElementById('pvInvoiceTableFoot');
const pvAmountInWords = document.getElementById('pvAmountInWords');

const pvRemarks = document.getElementById('pvRemarks');
const pvDeclaration = document.getElementById('pvDeclaration');

// Stamp & Sign Elements
const stampContainer = document.getElementById('stampContainer');
const pvStampSignature = document.getElementById('pvStampSignature');
const pvStampDirector = document.getElementById('pvStampDirector');
const pvSigCompanyTitle = document.getElementById('pvSigCompanyTitle');

// Sidebar containers
const itemRowsContainer = document.getElementById('itemRowsContainer');

// Buttons & Utilities
const btnAddInvoiceItem = document.getElementById('addInvoiceItem');
const btnPrint = document.getElementById('printBtn');
const btnExport = document.getElementById('exportBtn');
const btnImport = document.getElementById('importFile');

// State Code Mapping for States
const StateCodes = {
    "Delhi": "07",
    "Maharashtra": "27",
    "Haryana": "06",
    "Uttar Pradesh": "09",
    "Karnataka": "29",
    "Tamil Nadu": "33",
    "West Bengal": "19",
    "Gujarat": "24",
    "Punjab": "03"
};

// 3. Indian Currency Formatter
function formatCurrency(val) {
    if (isNaN(val) || val === null) return '0.00';
    return Number(val).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function parseAmount(str) {
    if (!str) return 0;
    const cleanStr = String(str).replace(/[^\d.-]/g, '');
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num;
}

// 4. Number to Words converter
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
    
    const decimalPart = Math.round((amount - num) * 100);
    let decimalWords = '';
    if (decimalPart > 0) {
        if (decimalPart < 20) {
            decimalWords = ones[decimalPart] + ' Paise ';
        } else {
            decimalWords = tens[Math.floor(decimalPart / 10)] + ' ';
            if (decimalPart % 10 > 0) {
                decimalWords += ones[decimalPart % 10] + ' ';
            }
            decimalWords += 'Paise ';
        }
    }
    
    const result = words.trim();
    const rupeesStr = 'INR ' + result.charAt(0).toUpperCase() + result.slice(1) + ' Rupees';
    if (decimalWords !== '') {
        return rupeesStr + ' and ' + decimalWords.trim() + ' Only.';
    } else {
        return rupeesStr + ' Only.';
    }
}

// 5. Core Calculations
function runCalculations() {
    let subtotal = 0;
    let totalQty = 0;

    state.items.forEach(item => {
        subtotal += Number(item.quantity || 0) * Number(item.rate || 0);
        totalQty += Number(item.quantity || 0);
    });

    let grandTotal = Math.round(subtotal);
    let roundOff = grandTotal - subtotal;

    state.grandTotal = grandTotal;
    state.roundOff = roundOff;
    state.totalQty = totalQty;

    state.amountInWords = convertNumberToWords(grandTotal);
    pvAmountInWords.innerText = state.amountInWords;
}

// 6. UI Synchronization
function updateUI() {
    if (document.activeElement !== elCompanyName) elCompanyName.value = state.companyName;
    if (document.activeElement !== elCompanyGstin) elCompanyGstin.value = state.companyGstin;
    if (document.activeElement !== elCompanyCin) elCompanyCin.value = state.companyCin;
    if (document.activeElement !== elCompanyMsme) elCompanyMsme.value = state.companyMsme;
    if (document.activeElement !== elCompanyAddress) elCompanyAddress.value = state.companyAddress;
    if (document.activeElement !== elCompanyTel) elCompanyTel.value = state.companyTel;
    if (document.activeElement !== elCompanyEmail) elCompanyEmail.value = state.companyEmail;

    if (document.activeElement !== elGuestName) elGuestName.value = state.guestName;
    if (document.activeElement !== elGuestGstin) elGuestGstin.value = state.guestGstin;
    if (document.activeElement !== elGuestAddress) elGuestAddress.value = state.guestAddress;
    if (document.activeElement !== elPlaceOfSupply) elPlaceOfSupply.value = state.guestState;

    if (document.activeElement !== elInvoiceNo) elInvoiceNo.value = state.invoiceNo;
    if (document.activeElement !== elInvoiceDate) elInvoiceDate.value = state.invoiceDate;
    if (document.activeElement !== elDeliveryNote) elDeliveryNote.value = state.deliveryNote;
    if (document.activeElement !== elModeTermsOfPayment) elModeTermsOfPayment.value = state.modeTermsOfPayment;
    if (document.activeElement !== elReferenceNoDate) elReferenceNoDate.value = state.referenceNoDate;
    if (document.activeElement !== elOtherReferences) elOtherReferences.value = state.otherReferences;
    if (document.activeElement !== elBuyersOrderNo) elBuyersOrderNo.value = state.buyersOrderNo;
    if (document.activeElement !== elBuyersOrderDate) elBuyersOrderDate.value = state.buyersOrderDate;
    if (document.activeElement !== elDispatchDocNo) elDispatchDocNo.value = state.dispatchDocNo;
    if (document.activeElement !== elDeliveryNoteDate) elDeliveryNoteDate.value = state.deliveryNoteDate;
    if (document.activeElement !== elDispatchedThrough) elDispatchedThrough.value = state.dispatchedThrough;
    if (document.activeElement !== elDestination) elDestination.value = state.destination;
    if (document.activeElement !== elTermsOfDelivery) elTermsOfDelivery.value = state.termsOfDelivery;

    if (document.activeElement !== elRemarksInput) elRemarksInput.value = state.remarks;
    if (document.activeElement !== elDeclarationInput) elDeclarationInput.value = state.declaration;

    elShowStamp.checked = state.showStamp;
    elSignatureType.value = state.signatureType;
    elSignatureStyle.value = state.signatureStyle;
    if (document.activeElement !== elDirectorName) elDirectorName.value = state.directorName;

    if (state.signatureType === 'image') {
        elSigImageUploadGroup.style.display = 'block';
        elSignatureStyleGroup.style.display = 'none';
    } else {
        elSigImageUploadGroup.style.display = 'none';
        elSignatureStyleGroup.style.display = 'block';
    }

    pvCompanyName.innerText = state.companyName;
    pvCompanyAddress.innerText = state.companyAddress;
    pvCompanyGstin.innerText = state.companyGstin;
    if (pvCompanyCin) pvCompanyCin.innerText = state.companyCin;
    if (pvCompanyMsme) pvCompanyMsme.innerText = state.companyMsme;
    pvCompanyState.innerText = state.companyState;
    pvCompanyStateCode.innerText = state.companyStateCode;
    pvCompanyTel.innerText = state.companyTel;
    pvCompanyEmail.innerText = state.companyEmail;

    pvInvoiceNo.innerText = state.invoiceNo;
    pvInvoiceDate.innerText = state.invoiceDate;
    pvDeliveryNote.innerText = state.deliveryNote;
    pvModeTermsOfPayment.innerText = state.modeTermsOfPayment;
    pvReferenceNoDate.innerText = state.referenceNoDate;
    pvOtherReferences.innerText = state.otherReferences;
    pvBuyersOrderNo.innerText = state.buyersOrderNo;
    pvBuyersOrderDate.innerText = state.buyersOrderDate;
    pvDispatchDocNo.innerText = state.dispatchDocNo;
    pvDispatchDocDate.innerText = state.deliveryNoteDate;
    pvDispatchedThrough.innerText = state.dispatchedThrough;
    pvDestination.innerText = state.destination;

    pvGuestName.innerText = state.guestName;
    pvGuestAddress.innerText = state.guestAddress;
    pvGuestGstin.innerText = state.guestGstin;
    pvGuestState.innerText = state.guestState;
    pvGuestStateCode.innerText = state.guestStateCode;
    pvTermsOfDelivery.innerText = state.termsOfDelivery;

    pvRemarks.innerText = state.remarks;
    pvDeclaration.innerText = state.declaration;

    stampContainer.style.opacity = state.showStamp ? '1' : '0';
    stampContainer.style.pointerEvents = state.showStamp ? 'all' : 'none';
    
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
        
        const pvStampSignature = document.getElementById('pvStampSignature');
        const directorFirstName = state.directorName.split(' ')[0] || 'Sayantan';
        pvStampSignature.innerText = directorFirstName.charAt(0).toUpperCase() + directorFirstName.slice(1).toLowerCase();
        pvStampSignature.className = 'stamp-signature';
        pvStampSignature.classList.add(state.signatureStyle);
        
        const pvStampDirector = document.getElementById('pvStampDirector');
        pvStampDirector.innerText = 'DIRECTOR - ' + state.directorName.toUpperCase();
    }

    if (pvSigCompanyTitle) {
        pvSigCompanyTitle.innerText = "For " + state.companyName;
    }

    renderPreviewTable();
    runCalculations();
    saveState();
}

function saveState() {
    localStorage.setItem('syt_reimbursement_invoice_state', JSON.stringify(state));
}

function renderSidebar() {
    // Sidebar list
    itemRowsContainer.innerHTML = '';
    state.items.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'dynamic-row-item';
        row.style.flexDirection = 'column';
        row.style.alignItems = 'stretch';
        row.style.gap = '4px';
        row.innerHTML = `
            <div style="display: flex; gap: 8px;">
                <textarea placeholder="Service Description" data-index="${index}" class="sidebar-item-desc" rows="2" style="flex: 1; font-family: inherit; font-size: 12px; padding: 5px; background: var(--bg-dark); border: 1px solid var(--border-dark); color: var(--text-light); border-radius: var(--radius-sm);">${item.description}</textarea>
                <button type="button" class="btn-remove-row remove-item-btn" data-index="${index}" title="Remove Row" style="margin-top: 10px;">&times;</button>
            </div>
            <div style="display: flex; gap: 6px;">
                <input type="text" placeholder="HSN/SAC" value="${item.hsnSac}" data-index="${index}" class="sidebar-item-sac" style="width: 80px;">
                <input type="number" placeholder="Qty" value="${item.quantity}" data-index="${index}" class="sidebar-item-qty" style="width: 60px;">
                <input type="number" step="0.01" placeholder="Rate" value="${item.rate}" data-index="${index}" class="sidebar-item-rate" style="flex: 1;">
                <input type="text" placeholder="per" value="${item.per}" data-index="${index}" class="sidebar-item-per" style="width: 50px;">
            </div>
        `;
        itemRowsContainer.appendChild(row);
    });
}

function renderPreviewTable() {
    // Preview table
    pvInvoiceTableBody.innerHTML = '';
    let globalIndex = 1;

    state.items.forEach((item, idx) => {
        let tr = document.createElement('tr');
        let rawIdx = state.items.indexOf(item);
        let amount = Number(item.quantity || 0) * Number(item.rate || 0);

        tr.innerHTML = `
            <td class="cell-index">${globalIndex++}</td>
            <td contenteditable="true" class="pv-item-desc" data-index="${rawIdx}">${item.description.replace(/\n/g, '<br>')}</td>
            <td contenteditable="true" class="text-center pv-item-sac" data-index="${rawIdx}">${item.hsnSac}</td>
            <td contenteditable="true" class="text-center pv-item-qty" data-index="${rawIdx}">${item.quantity} ${item.per}</td>
            <td contenteditable="true" class="text-right pv-item-rate" data-index="${rawIdx}">${formatCurrency(item.rate)}</td>
            <td contenteditable="true" class="text-center pv-item-per" data-index="${rawIdx}">${item.per}</td>
            <td class="text-right" style="font-weight: 700;">${formatCurrency(amount)}</td>
        `;
        pvInvoiceTableBody.appendChild(tr);
    });

    // Round Off
    let roundOff = state.roundOff || 0;
    if (Math.abs(roundOff) > 0.001) {
        let trRound = document.createElement('tr');
        trRound.className = 'tally-border-top';
        trRound.innerHTML = `
            <td></td>
            <td style="font-style: italic;">Round Off</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="text-right" style="font-weight: 700;">${roundOff > 0 ? '+' : ''}${formatCurrency(roundOff)}</td>
        `;
        pvInvoiceTableBody.appendChild(trRound);
    }

    pvInvoiceTableFoot.innerHTML = `
        <tr class="tally-border-top tally-double-bottom">
            <td colspan="3" style="text-align: right; font-weight: 800; color: var(--receipt-navy);">Total</td>
            <td class="text-center" style="font-weight: 800;">${state.totalQty} NOS</td>
            <td></td>
            <td></td>
            <td class="text-right" style="color: var(--receipt-navy); font-weight: 800; font-size: 12px;">₹ ${formatCurrency(state.grandTotal)}</td>
        </tr>
    `;
}

// 8. Event Listeners
document.addEventListener('input', (e) => {
    if (e.target.id === 'companyName') { state.companyName = e.target.value; updateUI(); }
    if (e.target.id === 'companyGstin') { state.companyGstin = e.target.value; updateUI(); }
    if (e.target.id === 'companyCin') { state.companyCin = e.target.value; updateUI(); }
    if (e.target.id === 'companyMsme') { state.companyMsme = e.target.value; updateUI(); }
    if (e.target.id === 'companyAddress') { state.companyAddress = e.target.value; updateUI(); }
    if (e.target.id === 'companyTel') { state.companyTel = e.target.value; updateUI(); }
    if (e.target.id === 'companyEmail') { state.companyEmail = e.target.value; updateUI(); }

    if (e.target.id === 'guestName') { state.guestName = e.target.value; updateUI(); }
    if (e.target.id === 'guestGstin') { state.guestGstin = e.target.value; updateUI(); }
    if (e.target.id === 'guestAddress') { state.guestAddress = e.target.value; updateUI(); }

    if (e.target.id === 'invoiceNo') {
        let val = e.target.value;
        if (val.length > 15) {
            val = val.substring(0, 15);
            e.target.value = val;
        }
        state.invoiceNo = val;
        updateUI();
    }
    if (e.target.id === 'invoiceDate') { state.invoiceDate = e.target.value; updateUI(); }
    if (e.target.id === 'deliveryNote') { state.deliveryNote = e.target.value; updateUI(); }
    if (e.target.id === 'modeTermsOfPayment') { state.modeTermsOfPayment = e.target.value; updateUI(); }
    if (e.target.id === 'referenceNoDate') { state.referenceNoDate = e.target.value; updateUI(); }
    if (e.target.id === 'otherReferences') { state.otherReferences = e.target.value; updateUI(); }
    if (e.target.id === 'buyersOrderNo') { state.buyersOrderNo = e.target.value; updateUI(); }
    if (e.target.id === 'buyersOrderDate') { state.buyersOrderDate = e.target.value; updateUI(); }
    if (e.target.id === 'dispatchDocNo') { state.dispatchDocNo = e.target.value; updateUI(); }
    if (e.target.id === 'deliveryNoteDate') { state.deliveryNoteDate = e.target.value; updateUI(); }
    if (e.target.id === 'dispatchedThrough') { state.dispatchedThrough = e.target.value; updateUI(); }
    if (e.target.id === 'destination') { state.destination = e.target.value; updateUI(); }
    if (e.target.id === 'termsOfDelivery') { state.termsOfDelivery = e.target.value; updateUI(); }

    if (e.target.id === 'remarksInput') { state.remarks = e.target.value; updateUI(); }
    if (e.target.id === 'declarationInput') { state.declaration = e.target.value; updateUI(); }
    if (e.target.id === 'directorName') { state.directorName = e.target.value; updateUI(); }

    if (e.target.classList.contains('sidebar-item-desc')) {
        const idx = parseInt(e.target.dataset.index);
        state.items[idx].description = e.target.value;
        const pvCell = pvInvoiceTableBody.querySelector(`.pv-item-desc[data-index="${idx}"]`);
        if (pvCell) pvCell.innerHTML = e.target.value.replace(/\n/g, '<br>');
    }
    if (e.target.classList.contains('sidebar-item-sac')) {
        const idx = parseInt(e.target.dataset.index);
        state.items[idx].hsnSac = e.target.value;
        const pvCell = pvInvoiceTableBody.querySelector(`.pv-item-sac[data-index="${idx}"]`);
        if (pvCell) pvCell.innerText = e.target.value;
        runCalculations();
    }
    if (e.target.classList.contains('sidebar-item-qty')) {
        const idx = parseInt(e.target.dataset.index);
        state.items[idx].quantity = parseAmount(e.target.value);
        runCalculations();
        renderPreviewTable();
    }
    if (e.target.classList.contains('sidebar-item-rate')) {
        const idx = parseInt(e.target.dataset.index);
        state.items[idx].rate = parseAmount(e.target.value);
        runCalculations();
        renderPreviewTable();
    }
    if (e.target.classList.contains('sidebar-item-per')) {
        const idx = parseInt(e.target.dataset.index);
        state.items[idx].per = e.target.value;
        runCalculations();
        renderPreviewTable();
    }

    // contenteditable
    if (e.target.hasAttribute('contenteditable')) {
        const id = e.target.id;
        const val = e.target.innerText.trim();

        if (id === 'pvCompanyName') {
            state.companyName = val;
            const el = document.getElementById('pvStampCompany');
            if (el) el.innerText = val.toUpperCase();
        }
        if (id === 'pvCompanyAddress') state.companyAddress = val;
        if (id === 'pvCompanyGstin') state.companyGstin = val;
        if (id === 'pvCompanyCin') state.companyCin = val;
        if (id === 'pvCompanyMsme') state.companyMsme = val;

        if (id === 'pvInvoiceNo') {
            let truncated = val;
            if (truncated.length > 15) {
                truncated = truncated.substring(0, 15);
                e.target.innerText = truncated;
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(e.target);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
            }
            state.invoiceNo = truncated;
            if (document.activeElement !== elInvoiceNo) elInvoiceNo.value = truncated;
        }
        if (id === 'pvInvoiceDate') {
            state.invoiceDate = val;
            if (document.activeElement !== elInvoiceDate) elInvoiceDate.value = val;
        }
        if (id === 'pvDeliveryNote') {
            state.deliveryNote = val;
            if (document.activeElement !== elDeliveryNote) elDeliveryNote.value = val;
        }
        if (id === 'pvModeTermsOfPayment') {
            state.modeTermsOfPayment = val;
            if (document.activeElement !== elModeTermsOfPayment) elModeTermsOfPayment.value = val;
        }
        if (id === 'pvReferenceNoDate') {
            state.referenceNoDate = val;
            if (document.activeElement !== elReferenceNoDate) elReferenceNoDate.value = val;
        }
        if (id === 'pvOtherReferences') {
            state.otherReferences = val;
            if (document.activeElement !== elOtherReferences) elOtherReferences.value = val;
        }
        if (id === 'pvBuyersOrderNo') {
            state.buyersOrderNo = val;
            if (document.activeElement !== elBuyersOrderNo) elBuyersOrderNo.value = val;
        }
        if (id === 'pvBuyersOrderDate') {
            state.buyersOrderDate = val;
            if (document.activeElement !== elBuyersOrderDate) elBuyersOrderDate.value = val;
        }
        if (id === 'pvDispatchDocNo') {
            state.dispatchDocNo = val;
            if (document.activeElement !== elDispatchDocNo) elDispatchDocNo.value = val;
        }
        if (id === 'pvDispatchDocDate') {
            state.deliveryNoteDate = val;
            if (document.activeElement !== elDeliveryNoteDate) elDeliveryNoteDate.value = val;
        }
        if (id === 'pvDispatchedThrough') {
            state.dispatchedThrough = val;
            if (document.activeElement !== elDispatchedThrough) elDispatchedThrough.value = val;
        }
        if (id === 'pvDestination') {
            state.destination = val;
            if (document.activeElement !== elDestination) elDestination.value = val;
        }

        if (id === 'pvGuestName') {
            state.guestName = val;
            if (document.activeElement !== elGuestName) elGuestName.value = val;
        }
        if (id === 'pvGuestAddress') {
            state.guestAddress = val;
            if (document.activeElement !== elGuestAddress) elGuestAddress.value = val;
        }
        if (id === 'pvGuestGstin') {
            state.guestGstin = val;
            if (document.activeElement !== elGuestGstin) elGuestGstin.value = val;
        }
        if (id === 'pvGuestState') {
            state.guestState = val;
            if (document.activeElement !== elPlaceOfSupply) elPlaceOfSupply.value = val;
        }
        if (id === 'pvGuestStateCode') state.guestStateCode = val;
        if (id === 'pvTermsOfDelivery') {
            state.termsOfDelivery = val;
            if (document.activeElement !== elTermsOfDelivery) elTermsOfDelivery.value = val;
        }

        if (id === 'pvRemarks') {
            state.remarks = val;
            if (document.activeElement !== elRemarksInput) elRemarksInput.value = val;
        }
        if (id === 'pvDeclaration') {
            state.declaration = val;
            if (document.activeElement !== elDeclarationInput) elDeclarationInput.value = val;
        }

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

        if (e.target.classList.contains('pv-item-desc')) {
            const idx = parseInt(e.target.dataset.index);
            const textVal = e.target.innerHTML.replace(/<br>/g, '\n').replace(/<\/?[^>]+(>|$)/g, "");
            state.items[idx].description = textVal;
            const sidebarInput = itemRowsContainer.querySelector(`.sidebar-item-desc[data-index="${idx}"]`);
            if (sidebarInput) sidebarInput.value = textVal;
        }
        if (e.target.classList.contains('pv-item-sac')) {
            const idx = parseInt(e.target.dataset.index);
            state.items[idx].hsnSac = val;
            const sidebarInput = itemRowsContainer.querySelector(`.sidebar-item-sac[data-index="${idx}"]`);
            if (sidebarInput) sidebarInput.value = val;
            runCalculations();
        }
        if (e.target.classList.contains('pv-item-qty')) {
            const idx = parseInt(e.target.dataset.index);
            let num = parseAmount(val.split(' ')[0]);
            state.items[idx].quantity = num;
            const sidebarInput = itemRowsContainer.querySelector(`.sidebar-item-qty[data-index="${idx}"]`);
            if (sidebarInput) sidebarInput.value = num;
            runCalculations();
        }
        if (e.target.classList.contains('pv-item-rate')) {
            const idx = parseInt(e.target.dataset.index);
            let num = parseAmount(val);
            state.items[idx].rate = num;
            const sidebarInput = itemRowsContainer.querySelector(`.sidebar-item-rate[data-index="${idx}"]`);
            if (sidebarInput) sidebarInput.value = num;
            runCalculations();
        }
        if (e.target.classList.contains('pv-item-per')) {
            const idx = parseInt(e.target.dataset.index);
            state.items[idx].per = val;
            const sidebarInput = itemRowsContainer.querySelector(`.sidebar-item-per[data-index="${idx}"]`);
            if (sidebarInput) sidebarInput.value = val;
            runCalculations();
        }
    }
});

elPlaceOfSupply.addEventListener('change', (e) => {
    state.guestState = e.target.value;
    state.guestStateCode = StateCodes[e.target.value] || "07";
    updateUI();
});

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

// Blur Listener
document.addEventListener('blur', (e) => {
    if (!e.target.hasAttribute('contenteditable')) return;

    const id = e.target.id;
    const value = e.target.innerText.trim();

    if (id === 'pvCompanyName') state.companyName = value;
    if (id === 'pvCompanyAddress') state.companyAddress = value;
    if (id === 'pvCompanyGstin') state.companyGstin = value;
    if (id === 'pvCompanyCin') state.companyCin = value;
    if (id === 'pvCompanyMsme') state.companyMsme = value;
    if (id === 'pvCompanyState') state.companyState = value;
    if (id === 'pvCompanyStateCode') state.companyStateCode = value;
    if (id === 'pvCompanyTel') state.companyTel = value;
    if (id === 'pvCompanyEmail') state.companyEmail = value;

    if (id === 'pvInvoiceNo') {
        let truncated = value;
        if (truncated.length > 15) {
            truncated = truncated.substring(0, 15);
        }
        state.invoiceNo = truncated;
    }
    if (id === 'pvInvoiceDate') state.invoiceDate = value;
    if (id === 'pvDeliveryNote') state.deliveryNote = value;
    if (id === 'pvModeTermsOfPayment') state.modeTermsOfPayment = value;
    if (id === 'pvReferenceNoDate') state.referenceNoDate = value;
    if (id === 'pvOtherReferences') state.otherReferences = value;
    if (id === 'pvBuyersOrderNo') state.buyersOrderNo = value;
    if (id === 'pvBuyersOrderDate') state.buyersOrderDate = value;
    if (id === 'pvDispatchDocNo') state.dispatchDocNo = value;
    if (id === 'pvDispatchDocDate') state.deliveryNoteDate = value;
    if (id === 'pvDispatchedThrough') state.dispatchedThrough = value;
    if (id === 'pvDestination') state.destination = value;

    if (id === 'pvGuestName') state.guestName = value;
    if (id === 'pvGuestAddress') state.guestAddress = value;
    if (id === 'pvGuestGstin') state.guestGstin = value;
    if (id === 'pvGuestState') {
        state.guestState = value;
        state.guestStateCode = StateCodes[value] || "07";
    }
    if (id === 'pvGuestStateCode') state.guestStateCode = value;
    if (id === 'pvTermsOfDelivery') state.termsOfDelivery = value;

    if (id === 'pvRemarks') state.remarks = value;
    if (id === 'pvDeclaration') state.declaration = value;

    if (id === 'pvStampCompany') state.companyName = value;
    if (id === 'pvStampSignature') state.directorName = value;
    if (id === 'pvStampDirector') {
        state.directorName = value.replace('DIRECTOR -', '').trim();
    }

    if (e.target.classList.contains('pv-item-desc')) {
        const idx = parseInt(e.target.dataset.index);
        const textVal = e.target.innerHTML.replace(/<br>/g, '\n').replace(/<\/?[^>]+(>|$)/g, "");
        state.items[idx].description = textVal;
    }
    if (e.target.classList.contains('pv-item-sac')) {
        const idx = parseInt(e.target.dataset.index);
        state.items[idx].hsnSac = value;
    }
    if (e.target.classList.contains('pv-item-qty')) {
        const idx = parseInt(e.target.dataset.index);
        let num = parseAmount(value.split(' ')[0]);
        state.items[idx].quantity = num;
    }
    if (e.target.classList.contains('pv-item-rate')) {
        const idx = parseInt(e.target.dataset.index);
        state.items[idx].rate = parseAmount(value);
    }
    if (e.target.classList.contains('pv-item-per')) {
        const idx = parseInt(e.target.dataset.index);
        state.items[idx].per = value;
    }

    updateUI();
}, true);

document.addEventListener('keydown', (e) => {
    if (e.target.hasAttribute('contenteditable') && e.key === 'Enter') {
        if (!e.target.classList.contains('pv-item-desc') && e.target.id !== 'pvRemarks' && e.target.id !== 'pvDeclaration' && e.target.id !== 'pvCompanyAddress' && e.target.id !== 'pvGuestAddress' && e.target.id !== 'pvTermsOfDelivery') {
            e.preventDefault();
            e.target.blur();
        }
    }
});

btnAddInvoiceItem.addEventListener('click', () => {
    state.items.push({
        description: "New Reimbursement Item Line",
        hsnSac: "N/A",
        quantity: 1,
        rate: 0,
        per: "NOS",
        isTaxable: false
    });
    updateUI();
    renderSidebar();
});

itemRowsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item-btn')) {
        const idx = parseInt(e.target.dataset.index);
        if (state.items.length > 1) {
            state.items.splice(idx, 1);
            updateUI();
            renderSidebar();
        } else {
            alert("At least one item line must exist in the invoice.");
        }
    }
});

btnPrint.addEventListener('click', () => {
    window.print();
});

btnExport.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 4));
    const downloadAnchor = document.createElement('a');
    const safeInvoiceNo = state.invoiceNo.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `invoice_reimbursement_${safeInvoiceNo}.json`);
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
            if (importedState && typeof importedState === 'object' && Array.isArray(importedState.items)) {
                state = { ...state, ...importedState };
                updateUI();
                renderSidebar();
                alert("Reimbursement Invoice data imported successfully!");
            }
        } catch (err) {
            alert("Error parsing file.");
        }
    };
    reader.readAsText(file);
    e.target.value = '';
});

// Bootstrap Initialization
window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('syt_reimbursement_invoice_state');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
                state = { ...state, ...parsed };
            }
        } catch (err) {
            console.error(err);
        }
    }
    updateUI();
    renderSidebar();
});
