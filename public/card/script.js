document.addEventListener('DOMContentLoaded', () => {
    const businessCard = document.getElementById('businessCard');
    const cardScene = document.getElementById('cardScene');
    const btnSaveContact = document.getElementById('btnSaveContact');
    const btnShareCard = document.getElementById('btnShareCard');
    const btnPrintCard = document.getElementById('btnPrintCard');
    const toastContainer = document.getElementById('toastContainer');

    // ==========================================
    // 1. Interactive 3D Parallax Tilt Effect
    // ==========================================
    const cardGlows = document.querySelectorAll('.card-glow');
    let isFlipped = false;

    cardScene.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return; // Disable tilt on mobile for better usability

        const rect = cardScene.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within element
        const y = e.clientY - rect.top;  // y position within element
        
        // Calculate percentages from center (-50 to 50)
        const percentX = (x / rect.width - 0.5) * 100;
        const percentY = (y / rect.height - 0.5) * 100;
        
        // Rotate values (max 15 degrees)
        const rotateY = percentX * 0.3;
        const rotateX = -percentY * 0.3;

        // Apply rotation to card, respecting its flipped state
        if (isFlipped) {
            businessCard.style.transform = `rotateY(${180 + rotateY}deg) rotateX(${rotateX}deg)`;
        } else {
            businessCard.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        }

        // Apply lighting/glow effect based on cursor
        cardGlows.forEach(glow => {
            glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(32, 178, 184, 0.22) 0%, transparent 60%)`;
        });
    });

    // Reset tilt on mouse leave
    cardScene.addEventListener('mouseleave', () => {
        businessCard.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
        if (isFlipped) {
            businessCard.style.transform = 'rotateY(180deg)';
        } else {
            businessCard.style.transform = 'rotateY(0deg)';
        }
        
        cardGlows.forEach(glow => {
            glow.style.background = `radial-gradient(circle at 50% 50%, rgba(32, 178, 184, 0.15) 0%, transparent 60%)`;
        });
    });

    // Remove transition during mousemove for responsive feel
    cardScene.addEventListener('mouseenter', () => {
        businessCard.style.transition = 'none';
    });

    // ==========================================
    // 2. Click to Flip Card Interaction
    // ==========================================
    businessCard.addEventListener('click', () => {
        isFlipped = !isFlipped;
        businessCard.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        if (isFlipped) {
            businessCard.classList.add('flipped');
            businessCard.style.transform = 'rotateY(180deg)';
        } else {
            businessCard.classList.remove('flipped');
            businessCard.style.transform = 'rotateY(0deg)';
        }
        showToast("Flipped Card");
    });

    // ==========================================
    // 3. VCard Generator & Downloader
    // ==========================================
    btnSaveContact.addEventListener('click', () => {
        // vCard data definition (vCard v3.0 standard)
        const vcard = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            'FN:Sayantan Paul',
            'N:Paul;Sayantan;;;',
            'ORG:Solve Your Trip',
            'TITLE:Director',
            'TEL;TYPE=CELL,VOICE:+919748657377',
            'EMAIL;TYPE=PREF,INTERNET:sayantan@solveyourtrip.com',
            'URL:https://solveyourtrip.com',
            'NOTE:Solve Your Trip - Dream it. Plan it. Solve it.',
            'REV:' + new Date().toISOString(),
            'END:VCARD'
        ].join('\r\n');

        const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Sayantan_Paul.vcf';
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);

        showToast("Contact file downloaded!");
    });

    // ==========================================
    // 4. Web Share API Integration
    // ==========================================
    btnShareCard.addEventListener('click', async () => {
        const shareData = {
            title: 'Sayantan Paul - Solve Your Trip',
            text: 'Sayantan Paul - Director at Solve Your Trip. Click to view digital business card and save contact.',
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                showToast("Shared successfully!");
            } catch (err) {
                // Ignore AbortError when user cancels the share dialog
                if (err.name !== 'AbortError') {
                    fallbackShare();
                }
            }
        } else {
            fallbackShare();
        }
    });

    function fallbackShare() {
        // Fallback: Copy link to clipboard
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                showToast("Link copied to clipboard!");
            })
            .catch(() => {
                showToast("Unable to share/copy link");
            });
    }

    // ==========================================
    // 5. Card Printing Handler
    // ==========================================
    btnPrintCard.addEventListener('click', () => {
        window.print();
    });

    // ==========================================
    // 6. Copy Back-Face Details on Click
    // ==========================================
    const detailItems = document.querySelectorAll('.back-detail-item');
    detailItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card from flipping when clicking contact detail
            const textToCopy = item.querySelector('span').innerText;
            
            // Clean up text if copying phone
            const cleanedText = textToCopy.includes('+91') ? textToCopy.replace(/-/g, '') : textToCopy;
            
            navigator.clipboard.writeText(cleanedText)
                .then(() => {
                    showToast(`Copied: ${textToCopy}`);
                })
                .catch(() => {
                    showToast("Failed to copy text");
                });
        });
    });

    // ==========================================
    // Helper: Toast Notifications
    // ==========================================
    function showToast(message) {
        // Remove existing toast if any to prevent clutter
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerText = message;
        toastContainer.appendChild(toast);

        // Remove toast from DOM after animation completes (3 seconds total)
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
});
