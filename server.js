const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure directories exist
const DRAFTS_DIR = path.join(__dirname, 'itineraries');
const PUBLIC_DIR = path.join(__dirname, 'public');
const SHARED_DIR = path.join(PUBLIC_DIR, 'shared');

[DRAFTS_DIR, PUBLIC_DIR, SHARED_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Middlewares
app.use(express.json({ limit: '25mb' })); // Increased limit for Base64 logos
app.use(express.static(PUBLIC_DIR));

// Helper: Compile JSON into HTML template
function compileItineraryHTML(itineraryData) {
    const templatePath = path.join(PUBLIC_DIR, 'template.html');
    if (!fs.existsSync(templatePath)) {
        throw new Error('Base template.html does not exist in public/ folder');
    }
    
    let templateContent = fs.readFileSync(templatePath, 'utf8');
    
    // Inject the JSON data into the script window variable block
    const injectedScript = `<script>window.itineraryData = ${JSON.stringify(itineraryData, null, 2)};</script>`;
    
    // Replace the placeholder script in template.html
    const placeholder = '<!-- ITINERARY_DATA_INJECTION_PLACEHOLDER -->';
    if (templateContent.includes(placeholder)) {
        templateContent = templateContent.replace(placeholder, injectedScript);
    } else {
        // Fallback: append before </body>
        templateContent = templateContent.replace('</body>', `${injectedScript}</body>`);
    }

    // Write the output file
    const outputPath = path.join(SHARED_DIR, `${itineraryData.id}.html`);
    fs.writeFileSync(outputPath, templateContent, 'utf8');
    return `/shared/${itineraryData.id}.html`;
}

// API: List all itineraries
app.get('/api/itineraries', (req, res) => {
    try {
        if (!fs.existsSync(DRAFTS_DIR)) {
            return res.json([]);
        }
        const files = fs.readdirSync(DRAFTS_DIR).filter(file => file.endsWith('.json'));
        const list = files.map(filename => {
            const filePath = path.join(DRAFTS_DIR, filename);
            const rawContent = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(rawContent);
            const stat = fs.statSync(filePath);
            return {
                id: data.id,
                clientName: data.clientName || 'Untitled Client',
                destination: data.destination || 'Universal Destination',
                startDate: data.startDate || '',
                endDate: data.endDate || '',
                totalCost: data.pricing?.totalCost || 'N/A',
                lastUpdated: stat.mtime
            };
        });
        
        // Sort by last updated descending
        list.sort((a, b) => b.lastUpdated - a.lastUpdated);
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve itineraries: ' + err.message });
    }
});

// API: Get itinerary detail
app.get('/api/itineraries/:id', (req, res) => {
    try {
        const id = req.params.id;
        const filePath = path.join(DRAFTS_DIR, `${id}.json`);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Itinerary not found' });
        }
        const rawContent = fs.readFileSync(filePath, 'utf8');
        res.json(JSON.parse(rawContent));
    } catch (err) {
        res.status(500).json({ error: 'Failed to load itinerary: ' + err.message });
    }
});

// API: Create or Update itinerary
app.post('/api/itineraries', (req, res) => {
    try {
        const itinerary = req.body;
        if (!itinerary.id) {
            // Generate a unique ID if it doesn't exist
            const cleanDest = (itinerary.destination || 'trip')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            itinerary.id = `${cleanDest || 'trip'}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        }
        
        // Ensure dates are parsed correctly
        itinerary.lastUpdated = new Date().toISOString();
        
        // Save JSON draft
        const filePath = path.join(DRAFTS_DIR, `${itinerary.id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(itinerary, null, 2), 'utf8');
        
        // Compile static HTML
        const shareUrl = compileItineraryHTML(itinerary);
        
        res.json({
            success: true,
            id: itinerary.id,
            shareUrl: shareUrl,
            message: 'Itinerary saved and HTML compiled successfully'
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save itinerary: ' + err.message });
    }
});

// API: Delete itinerary
app.delete('/api/itineraries/:id', (req, res) => {
    try {
        const id = req.params.id;
        const jsonPath = path.join(DRAFTS_DIR, `${id}.json`);
        const htmlPath = path.join(SHARED_DIR, `${id}.html`);
        
        let deletedJson = false;
        let deletedHtml = false;
        
        if (fs.existsSync(jsonPath)) {
            fs.unlinkSync(jsonPath);
            deletedJson = true;
        }
        if (fs.existsSync(htmlPath)) {
            fs.unlinkSync(htmlPath);
            deletedHtml = true;
        }
        
        if (deletedJson || deletedHtml) {
            res.json({ success: true, message: 'Itinerary deleted successfully' });
        } else {
            res.status(404).json({ error: 'Itinerary not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete itinerary: ' + err.message });
    }
});

// Fallback: Serve creator interface for root
app.get('*', (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Universal Travel Itinerary Planner is running!`);
    console.log(`🔗 Dashboard: http://localhost:${PORT}`);
    console.log(`💾 Drafts saved in: ${DRAFTS_DIR}`);
    console.log(`🌐 Public directory: ${PUBLIC_DIR}`);
    console.log(`==================================================`);
});
