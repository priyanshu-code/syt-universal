// Mobile Navigation Menu Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        // Toggle mobile hamburger animations
        const spans = navToggle.querySelectorAll('span');
        if (navToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.querySelectorAll('span').forEach(s => s.style.transform = 'none');
            navToggle.querySelectorAll('span')[1].style.opacity = '1';
        });
    });
}

// ==========================================================================
// TRIP CODE LOOKUP ROUTER
// ==========================================================================
function lookupTrip() {
    const tripCodeInput = document.getElementById('tripCodeInput');
    const errorMsg = document.getElementById('lookupError');
    let code = tripCodeInput.value.trim();
    
    errorMsg.style.display = 'none';
    
    if (!code) {
        errorMsg.textContent = 'Please enter a valid Trip Code.';
        errorMsg.style.display = 'block';
        return;
    }
    
    // Clean code (strip .html suffix if user pasted the full filename)
    code = code.replace(/\.html$/i, '');
    
    // Check code prefix to route correctly
    if (code.toLowerCase().startsWith('maldives-')) {
        window.open(`/quotes-shared/${code}.html`, '_blank');
    } else {
        window.open(`/shared/${code}.html`, '_blank');
    }
}

// Support hitting enter on the input field
const codeInput = document.getElementById('tripCodeInput');
if (codeInput) {
    codeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            lookupTrip();
        }
    });
}

// ==========================================================================
// MULTI-STEP TRIP CONFIGURATOR WIZARD
// ==========================================================================
let currentStep = 1;
const totalSteps = 5;
const modal = document.getElementById('plannerModal');

// Date restraints: disable past dates
const today = new Date().toISOString().split('T')[0];
const plannerStartDate = document.getElementById('plannerStartDate');
const plannerEndDate = document.getElementById('plannerEndDate');
if (plannerStartDate && plannerEndDate) {
    plannerStartDate.min = today;
    plannerStartDate.addEventListener('change', () => {
        plannerEndDate.min = plannerStartDate.value;
    });
}

function openPlanner(destination = '') {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Lock body scroll
    
    // Reset wizard state
    currentStep = 1;
    showStep(currentStep);
    
    // Reset form inputs (except destination if prefilled)
    document.getElementById('plannerStartDate').value = '';
    document.getElementById('plannerEndDate').value = '';
    document.getElementById('plannerName').value = '';
    document.getElementById('plannerEmail').value = '';
    document.getElementById('plannerPhone').value = '';
    document.getElementById('plannerNotes').value = '';
    
    // Reset checkboxes
    document.querySelectorAll('input[name="plannerInterests"]').forEach(cb => cb.checked = false);
    
    // Pre-fill destination if supplied
    if (destination) {
        const destRadios = document.querySelectorAll('input[name="plannerDest"]');
        let matched = false;
        destRadios.forEach(radio => {
            if (radio.value.toLowerCase() === destination.toLowerCase() || 
                (destination.toLowerCase().includes('singapore') && radio.value.includes('Singapore'))) {
                radio.checked = true;
                matched = true;
            }
        });
        if (!matched) {
            // Check "Other" radio button if no matches
            document.querySelector('input[name="plannerDest"][value="Other"]').checked = true;
        }
    } else {
        // Clear radios selection by default
        document.querySelectorAll('input[name="plannerDest"]').forEach(r => r.checked = false);
    }
    
    // Clear submission errors
    document.getElementById('plannerSubmitError').style.display = 'none';
}

function closePlanner() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scroll
}

// Close modal when clicking backdrop
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closePlanner();
    }
});

function showStep(stepNumber) {
    // Hide all step panes & success states
    document.querySelectorAll('.modal-step-pane').forEach(pane => {
        pane.classList.remove('active');
        pane.style.display = 'none';
    });
    
    // Show current step pane
    const currentPane = document.querySelector(`.modal-step-pane[data-step="${stepNumber}"]`);
    if (currentPane) {
        currentPane.classList.add('active');
        currentPane.style.display = 'block';
    }
    
    // Update progress dots
    const dots = document.querySelectorAll('.step-dot');
    dots.forEach((dot, idx) => {
        const dStep = parseInt(dot.getAttribute('data-step'));
        dot.className = 'step-dot';
        if (dStep < stepNumber) {
            dot.classList.add('complete');
        } else if (dStep === stepNumber) {
            dot.classList.add('active');
        }
    });
    
    // Update progress bar fill
    const progressFill = document.getElementById('progressFill');
    const widthPercentage = ((stepNumber - 1) / (totalSteps - 1)) * 100;
    progressFill.style.width = `${widthPercentage}%`;
}

function nextStep() {
    // Validate current step before proceeding
    if (!validateStep(currentStep)) return;
    
    if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function validateStep(step) {
    if (step === 1) {
        // Validate destination selected
        const selectedDest = document.querySelector('input[name="plannerDest"]:checked');
        if (!selectedDest) {
            alert('Please select a destination to continue.');
            return false;
        }
    }
    
    if (step === 2) {
        // Validate dates & guest count
        const start = document.getElementById('plannerStartDate').value;
        const end = document.getElementById('plannerEndDate').value;
        const pax = document.getElementById('plannerPax').value;
        
        if (!start || !end) {
            alert('Please choose tentative travel dates.');
            return false;
        }
        if (new Date(start) > new Date(end)) {
            alert('Check-out date must be after check-in date.');
            return false;
        }
        if (!pax || parseInt(pax) < 1) {
            alert('Please enter a valid guest count (at least 1 traveler).');
            return false;
        }
    }
    
    return true;
}

// ==========================================================================
// API INQUIRY SUBMISSION
// ==========================================================================
async function submitInquiry() {
    const errorDiv = document.getElementById('plannerSubmitError');
    errorDiv.style.display = 'none';
    
    // Mandatory Contact Fields Validation
    const name = document.getElementById('plannerName').value.trim();
    const email = document.getElementById('plannerEmail').value.trim();
    const phone = document.getElementById('plannerPhone').value.trim();
    
    if (!name || !email || !phone) {
        errorDiv.textContent = 'Please fill out all required fields (* Name, Email, WhatsApp Phone).';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Simple Email Regex Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorDiv.textContent = 'Please enter a valid email address.';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Prepare Data Payload
    const destination = document.querySelector('input[name="plannerDest"]:checked').value;
    const startDate = document.getElementById('plannerStartDate').value;
    const endDate = document.getElementById('plannerEndDate').value;
    const travelers = document.getElementById('plannerTravelers').value;
    const paxCount = parseInt(document.getElementById('plannerPax').value) || 2;
    const budget = document.querySelector('input[name="plannerBudget"]:checked').value;
    const specialRequests = document.getElementById('plannerNotes').value.trim();
    
    // Extract checked interests
    const interests = [];
    document.querySelectorAll('input[name="plannerInterests"]:checked').forEach(cb => {
        interests.push(cb.value);
    });
    
    const payload = {
        destination,
        startDate,
        endDate,
        travelers,
        paxCount,
        budget,
        interests,
        guestName: name,
        guestEmail: email,
        guestPhone: phone,
        specialRequests
    };
    
    // Disable submit button and show spinner status
    const submitBtn = document.getElementById('btnSubmitPlanner');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting Request...';
    
    try {
        const response = await fetch('/api/inquiries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Show Success pane
            document.querySelectorAll('.modal-step-pane').forEach(p => {
                p.classList.remove('active');
                p.style.display = 'none';
            });
            
            document.getElementById('successGuestName').textContent = name;
            document.getElementById('successInquiryId').textContent = data.id;
            
            const successPane = document.getElementById('successPane');
            successPane.style.display = 'block';
            successPane.classList.add('active');
            
            // Mark all steps complete
            document.querySelectorAll('.step-dot').forEach(dot => {
                dot.className = 'step-dot complete';
            });
            document.getElementById('progressFill').style.width = '100%';
        } else {
            throw new Error(data.error || 'Failed to submit trip plan request.');
        }
    } catch (err) {
        errorDiv.textContent = `Error: ${err.message}`;
        errorDiv.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}
