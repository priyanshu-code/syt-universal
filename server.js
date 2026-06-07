const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3101;

// Ensure directories exist
const DATA_DIR = process.env.DATA_DIR;

const DRAFTS_DIR = DATA_DIR ? path.join(DATA_DIR, "itineraries") : path.join(__dirname, "itineraries");
const QUOTES_DIR = DATA_DIR ? path.join(DATA_DIR, "quotes") : path.join(__dirname, "quotes");
const PUBLIC_DIR = path.join(__dirname, "public");
const SHARED_DIR = DATA_DIR ? path.join(DATA_DIR, "shared") : path.join(PUBLIC_DIR, "shared");
const QUOTES_SHARED_DIR = DATA_DIR ? path.join(DATA_DIR, "quotes-shared") : path.join(PUBLIC_DIR, "quotes-shared");

[DRAFTS_DIR, QUOTES_DIR, PUBLIC_DIR, SHARED_DIR, QUOTES_SHARED_DIR].forEach(
  (dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
);

// Middlewares
app.use(express.json({ limit: "25mb" })); // Increased limit for Base64 logos
app.use(express.static(PUBLIC_DIR));

// Serve persistent shared files if DATA_DIR is configured (Render Persistent Disk)
if (DATA_DIR) {
  app.use("/shared", express.static(SHARED_DIR));
  app.use("/quotes-shared", express.static(QUOTES_SHARED_DIR));
}

// Serve universal app at /universal/*
app.use("/universal", express.static(path.join(PUBLIC_DIR, "universal")));

// Serve maldives app at /maldives/*
app.use("/maldives", express.static(path.join(PUBLIC_DIR, "maldives")));

// Helper: Compile JSON into HTML template
function compileItineraryHTML(itineraryData) {
  const templatePath = path.join(PUBLIC_DIR, "universal", "template.html");
  if (!fs.existsSync(templatePath)) {
    throw new Error(
      "Base template.html does not exist in public/universal/ folder"
    );
  }

  let templateContent = fs.readFileSync(templatePath, "utf8");

  // Inject the JSON data into the script window variable block
  const injectedScript = `<script>window.itineraryData = ${JSON.stringify(itineraryData, null, 2)};</script>`;

  // Replace the placeholder script in template.html
  const placeholder = "<!-- ITINERARY_DATA_INJECTION_PLACEHOLDER -->";
  if (templateContent.includes(placeholder)) {
    templateContent = templateContent.replace(placeholder, injectedScript);
  } else {
    // Fallback: append before </body>
    templateContent = templateContent.replace(
      "</body>",
      `${injectedScript}</body>`
    );
  }

  // Write the output file
  const outputPath = path.join(SHARED_DIR, `${itineraryData.id}.html`);
  fs.writeFileSync(outputPath, templateContent, "utf8");
  return `/shared/${itineraryData.id}.html`;
}

// Helper: Compile Maldives Quote into HTML preview
function compileMaldivesHTML(quoteData) {
  const templatePath = path.join(PUBLIC_DIR, "maldives", "index.html");
  if (!fs.existsSync(templatePath)) {
    throw new Error(
      "Base index.html does not exist in public/maldives/ folder"
    );
  }

  let templateContent = fs.readFileSync(templatePath, "utf8");

  // Rewrite relative asset paths to absolute /maldives/ paths
  templateContent = templateContent
    .replace(/href="style\.css"/g, 'href="/maldives/style.css"')
    .replace(/src="app\.js"/g, 'src="/maldives/app.js"')
    .replace(/src="logo\.jpg"/g, 'src="/maldives/logo.jpg"');

  // Strip builder UI — remove mobile tabs header
  templateContent = templateContent.replace(
    /[ \t]*<!-- Tab Toggle for mobile[\s\S]*?<\/div>\s*\n/,
    ""
  );

  // Strip builder UI — remove entire left pane aside (builder)
  templateContent = templateContent.replace(
    /[ \t]*<!-- LEFT PANE: Editor \/ Quote Builder -->[\s\S]*?<\/aside>\s*\n/,
    ""
  );

  // Make workspace a single full-width column for the preview
  templateContent = templateContent.replace(
    'class="workspace-container"',
    'class="workspace-container" style="display:block;padding:0;margin:0;"'
  );

  // Inject the quote state
  const injectedScript = `<script>window.maldivesQuoteData = ${JSON.stringify(quoteData, null, 2)};</script>`;

  // Append before </body>
  templateContent = templateContent.replace(
    "</body>",
    `${injectedScript}</body>`
  );

  // Write the output file
  const outputPath = path.join(QUOTES_SHARED_DIR, `${quoteData.id}.html`);
  fs.writeFileSync(outputPath, templateContent, "utf8");
  return `/quotes-shared/${quoteData.id}.html`;
}

// API: List all itineraries
app.get("/api/itineraries", (req, res) => {
  try {
    if (!fs.existsSync(DRAFTS_DIR)) {
      return res.json([]);
    }
    const files = fs
      .readdirSync(DRAFTS_DIR)
      .filter((file) => file.endsWith(".json"));
    const list = files.map((filename) => {
      const filePath = path.join(DRAFTS_DIR, filename);
      const rawContent = fs.readFileSync(filePath, "utf8");
      const data = JSON.parse(rawContent);
      const stat = fs.statSync(filePath);
      return {
        id: data.id,
        clientName: data.clientName || "Untitled Client",
        destination: data.destination || "Universal Destination",
        startDate: data.startDate || "",
        endDate: data.endDate || "",
        totalCost: data.pricing?.totalCost || "N/A",
        lastUpdated: stat.mtime,
      };
    });

    // Sort by last updated descending
    list.sort((a, b) => b.lastUpdated - a.lastUpdated);
    res.json(list);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to retrieve itineraries: " + err.message });
  }
});

// API: Get itinerary detail
app.get("/api/itineraries/:id", (req, res) => {
  try {
    const id = req.params.id;
    const filePath = path.join(DRAFTS_DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    const rawContent = fs.readFileSync(filePath, "utf8");
    res.json(JSON.parse(rawContent));
  } catch (err) {
    res.status(500).json({ error: "Failed to load itinerary: " + err.message });
  }
});

// API: Create or Update itinerary
app.post("/api/itineraries", (req, res) => {
  try {
    const itinerary = req.body;
    if (!itinerary.id) {
      // Generate a unique ID if it doesn't exist
      const cleanDest = (itinerary.destination || "trip")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      itinerary.id = `${cleanDest || "trip"}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    // Ensure dates are parsed correctly
    itinerary.lastUpdated = new Date().toISOString();

    // Save JSON draft
    const filePath = path.join(DRAFTS_DIR, `${itinerary.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(itinerary, null, 2), "utf8");

    // Compile static HTML
    const shareUrl = compileItineraryHTML(itinerary);

    res.json({
      success: true,
      id: itinerary.id,
      shareUrl: shareUrl,
      message: "Itinerary saved and HTML compiled successfully",
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to save itinerary: " + err.message });
  }
});

// API: Delete itinerary
app.delete("/api/itineraries/:id", (req, res) => {
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
      res.json({ success: true, message: "Itinerary deleted successfully" });
    } else {
      res.status(404).json({ error: "Itinerary not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete itinerary: " + err.message });
  }
});

// ==========================================================================
// MALDIVES QUOTES API
// ==========================================================================

// API: List all quotes
app.get("/api/quotes", (req, res) => {
  try {
    if (!fs.existsSync(QUOTES_DIR)) {
      return res.json([]);
    }
    const files = fs
      .readdirSync(QUOTES_DIR)
      .filter((file) => file.endsWith(".json"));
    const list = files.map((filename) => {
      const filePath = path.join(QUOTES_DIR, filename);
      const rawContent = fs.readFileSync(filePath, "utf8");
      const data = JSON.parse(rawContent);
      const stat = fs.statSync(filePath);
      return {
        id: data.id,
        guestName: data.guest?.name || "Unnamed Guest",
        checkIn: data.guest?.checkIn || "",
        duration: data.guest?.duration || "",
        price: data.guest?.price || "N/A",
        lastUpdated: stat.mtime,
      };
    });

    // Sort by last updated descending
    list.sort((a, b) => b.lastUpdated - a.lastUpdated);
    res.json(list);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to retrieve quotes: " + err.message });
  }
});

// API: Get quote detail
app.get("/api/quotes/:id", (req, res) => {
  try {
    const id = req.params.id;
    const filePath = path.join(QUOTES_DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Quote not found" });
    }
    const rawContent = fs.readFileSync(filePath, "utf8");
    res.json(JSON.parse(rawContent));
  } catch (err) {
    res.status(500).json({ error: "Failed to load quote: " + err.message });
  }
});

// API: Create or Update quote
app.post("/api/quotes", (req, res) => {
  try {
    const quote = req.body;
    if (!quote.id) {
      // Generate a unique ID
      quote.id = `maldives-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    // Ensure timestamp
    quote.lastUpdated = new Date().toISOString();

    // Save JSON draft
    const filePath = path.join(QUOTES_DIR, `${quote.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(quote, null, 2), "utf8");

    // Compile static HTML
    const shareUrl = compileMaldivesHTML(quote);

    res.json({
      success: true,
      id: quote.id,
      shareUrl: shareUrl,
      message: "Quote saved and preview compiled successfully",
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to save quote: " + err.message });
  }
});

// API: Delete quote
app.delete("/api/quotes/:id", (req, res) => {
  try {
    const id = req.params.id;
    const jsonPath = path.join(QUOTES_DIR, `${id}.json`);
    const htmlPath = path.join(QUOTES_SHARED_DIR, `${id}.html`);

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
      res.json({ success: true, message: "Quote deleted successfully" });
    } else {
      res.status(404).json({ error: "Quote not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete quote: " + err.message });
  }
});

// Fallback routes: Serve index.html for SPA routing
app.get("/universal/*", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "universal", "index.html"));
});

app.get("/maldives/*", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "maldives", "index.html"));
});

// Serve landing page for root and unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Solve Your Trip - Travel Creator Suite`);
  console.log(`🔗 Home: http://localhost:${PORT}`);
  console.log(`🏝️ Maldives Creator: http://localhost:${PORT}/maldives`);
  console.log(`✈️ Universal Creator: http://localhost:${PORT}/universal`);
  console.log(`💾 Itineraries: ${DRAFTS_DIR}`);
  console.log(`💾 Quotes: ${QUOTES_DIR}`);
  console.log(`==================================================`);
});
