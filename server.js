const express = require("express");
const path = require("path");
const fs = require("fs");
const { MongoClient } = require("mongodb");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3101;

// Credentials and Session Configuration
const AUTH_USERNAME = process.env.AUTH_USERNAME || "admin_SYT";
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || "solveyourtrip26052026_noaccessfeasible";
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");

function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;
  if (rc) {
    rc.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
  }
  return list;
}

function generateSessionToken(username) {
  const hmac = crypto.createHmac("sha256", SESSION_SECRET);
  hmac.update(username);
  return `${username}:${hmac.digest("hex")}`;
}

function validateSessionToken(token) {
  if (!token) return false;
  const parts = token.split(":");
  if (parts.length !== 2) return false;
  const username = parts[0];
  const expectedToken = generateSessionToken(username);
  return token === expectedToken && username === AUTH_USERNAME;
}

// Ensure directories exist
const DATA_DIR = process.env.DATA_DIR;

const DRAFTS_DIR = DATA_DIR ? path.join(DATA_DIR, "itineraries") : path.join(__dirname, "itineraries");
const QUOTES_DIR = DATA_DIR ? path.join(DATA_DIR, "quotes") : path.join(__dirname, "quotes");
const PUBLIC_DIR = path.join(__dirname, "public");
const SHARED_DIR = DATA_DIR ? path.join(DATA_DIR, "shared") : path.join(PUBLIC_DIR, "shared");
const QUOTES_SHARED_DIR = DATA_DIR ? path.join(DATA_DIR, "quotes-shared") : path.join(PUBLIC_DIR, "quotes-shared");
const INQUIRIES_DIR = DATA_DIR ? path.join(DATA_DIR, "inquiries") : path.join(__dirname, "inquiries");

[DRAFTS_DIR, QUOTES_DIR, PUBLIC_DIR, SHARED_DIR, QUOTES_SHARED_DIR, INQUIRIES_DIR].forEach(
  (dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
);

// Middlewares
app.use(express.json({ limit: "25mb" })); // Increased limit for Base64 logos

// Route protection middleware
app.use((req, res, next) => {
  const cookies = parseCookies(req);
  const token = cookies.syt_session;
  const pathName = req.path;
  
  // Define public paths
  const isCustomerHome = pathName === "/" || pathName === "/index.html" || pathName === "/about" || pathName === "/about.html";
  const isCustomerAsset = pathName.startsWith("/customer/");
  const isPublicApi = (pathName === "/api/inquiries" && req.method === "POST") || (pathName === "/api/settings" && req.method === "GET");
  const isLoginPath = pathName === "/login" || pathName === "/login.html" || pathName === "/api/login";
  const isSharedPath = pathName.startsWith("/shared/") || pathName.startsWith("/quotes-shared/");
  const isSharedAsset = pathName === "/maldives/app.js" || pathName === "/maldives/style.css" || pathName === "/maldives/logo.jpg" || pathName === "/logo.jpg";
  const isFavicon = pathName === "/favicon.ico";

  if (isCustomerHome || isCustomerAsset || isPublicApi || isLoginPath || isSharedPath || isSharedAsset || isFavicon) {
    return next();
  }

  // Check authentication
  if (validateSessionToken(token)) {
    return next();
  }

  // Not authenticated
  if (pathName.startsWith("/api/")) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  // Redirect to login page
  res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}`);
});

// Authentication Routes
app.get("/login", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "login.html"));
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
    const token = generateSessionToken(username);
    // Set cookie: HttpOnly, SameSite=Strict, Max-Age of 30 days. Secure flag in production.
    const isProduction = process.env.NODE_ENV === "production" || !!process.env.PORT;
    let cookieStr = `syt_session=${token}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=Strict`;
    if (isProduction) {
      cookieStr += "; Secure";
    }
    res.setHeader("Set-Cookie", cookieStr);
    return res.json({ success: true });
  }
  return res.status(400).json({ error: "Invalid username or password" });
});

app.get("/logout", (req, res) => {
  res.setHeader("Set-Cookie", "syt_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict");
  res.redirect("/login");
});

// Geolocation lookup helper
async function getIPLocation(ip) {
  if (!ip || ip === "::1" || ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.16.") || ip.startsWith("172.31.")) {
    return "Local Host / Developer";
  }
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city`);
    if (!response.ok) return "Unknown Location";
    const data = await response.json();
    if (data && data.status === "success") {
      const city = data.city || "";
      const region = data.regionName || "";
      const country = data.country || "";
      return [city, region, country].filter(Boolean).join(", ") || "Unknown Location";
    }
    return "Unknown Location";
  } catch (err) {
    console.error("IP Geolocation error:", err.message);
    return "Unknown Location";
  }
}

// Track Link View Event
async function trackLinkView(id, type, data, req) {
  try {
    const rawIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    const ip = rawIp.split(",")[0].trim();
    const userAgent = req.headers["user-agent"] || "";
    const timestamp = new Date();

    // Fetch location in background
    const location = await getIPLocation(ip);

    const guestName = (type === "maldives") ? (data?.guest?.name || "Unknown") : (data?.clientName || "Unknown");
    const resortName = (type === "maldives") ? (data?.resort?.name || "Maldives Resort") : (data?.destination || data?.subTitle || "Universal Itinerary");

    const clickEvent = {
      clickId: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      linkId: id,
      type,
      guestName,
      resortName,
      timestamp: timestamp.toISOString(),
      ip,
      location,
      userAgent
    };

    if (db) {
      await db.collection("link_clicks").insertOne(clickEvent);
      console.log(`[Tracker] Logged click in DB for ${guestName} (${type})`);
    } else {
      const CLICKS_FILE = path.join(DATA_DIR || __dirname, "link_clicks.json");
      let clicks = [];
      if (fs.existsSync(CLICKS_FILE)) {
        try {
          clicks = JSON.parse(fs.readFileSync(CLICKS_FILE, "utf8"));
        } catch (e) {
          clicks = [];
        }
      }
      clicks.push(clickEvent);
      if (clicks.length > 5000) {
        clicks = clicks.slice(-5000);
      }
      fs.writeFileSync(CLICKS_FILE, JSON.stringify(clicks, null, 2), "utf8");
      console.log(`[Tracker] Logged click in local file for ${guestName} (${type})`);
    }
  } catch (err) {
    console.error("[Tracker] Failed to log click:", err.message);
  }
}

// ==========================================================================
// DYNAMIC COMPILERS & SERVERS (ON-THE-FLY)
// ==========================================================================

// Route: Serve Compiled Itinerary shared HTML dynamically from DB
app.get("/shared/:id.html", async (req, res) => {
  try {
    const id = req.params.id;
    let itineraryData = null;

    if (db) {
      itineraryData = await db.collection("itineraries").findOne({ id });
    }

    // Fallback: If not found in DB or DB not active, check local disk file
    if (!itineraryData) {
      const localHtmlPath = path.join(SHARED_DIR, `${id}.html`);
      if (fs.existsSync(localHtmlPath)) {
        let fallbackData = null;
        try {
          const jsonPath = path.join(DRAFTS_DIR, `${id}.json`);
          if (fs.existsSync(jsonPath)) {
            fallbackData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
          }
        } catch (e) {}
        trackLinkView(id, "universal", fallbackData, req);
        return res.sendFile(localHtmlPath);
      }
      return res.status(404).send("Itinerary shared page not found");
    }

    trackLinkView(id, "universal", itineraryData, req);

    // Compile template in memory
    const templatePath = path.join(PUBLIC_DIR, "universal", "template.html");
    if (!fs.existsSync(templatePath)) {
      return res.status(500).send("Base template.html does not exist");
    }

    let templateContent = fs.readFileSync(templatePath, "utf8");
    const injectedScript = `<script>window.itineraryData = ${JSON.stringify(itineraryData, null, 2)};</script>`;
    const placeholder = "<!-- ITINERARY_DATA_INJECTION_PLACEHOLDER -->";

    if (templateContent.includes(placeholder)) {
      templateContent = templateContent.replace(placeholder, injectedScript);
    } else {
      templateContent = templateContent.replace("</body>", `${injectedScript}</body>`);
    }

    res.setHeader("Content-Type", "text/html");
    res.send(templateContent);
  } catch (err) {
    res.status(500).send("Error compiling shared page: " + err.message);
  }
});

// Route: Serve Compiled Maldives quote HTML dynamically from DB
app.get("/quotes-shared/:id.html", async (req, res) => {
  try {
    const id = req.params.id;
    let quoteData = null;

    if (db) {
      quoteData = await db.collection("quotes").findOne({ id });
    }

    // Fallback: If not found in DB or DB not active, check local disk file
    if (!quoteData) {
      const localHtmlPath = path.join(QUOTES_SHARED_DIR, `${id}.html`);
      if (fs.existsSync(localHtmlPath)) {
        let fallbackData = null;
        try {
          const jsonPath = path.join(QUOTES_DIR, `${id}.json`);
          if (fs.existsSync(jsonPath)) {
            fallbackData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
          }
        } catch (e) {}
        trackLinkView(id, "maldives", fallbackData, req);
        return res.sendFile(localHtmlPath);
      }
      return res.status(404).send("Quote shared page not found");
    }

    trackLinkView(id, "maldives", quoteData, req);

    // Compile Maldives template in memory
    const templatePath = path.join(PUBLIC_DIR, "maldives", "index.html");
    if (!fs.existsSync(templatePath)) {
      return res.status(500).send("Base index.html for Maldives does not exist");
    }

    let templateContent = fs.readFileSync(templatePath, "utf8");

    // Rewrite relative asset paths
    templateContent = templateContent
      .replace(/href="style\.css"/g, 'href="/maldives/style.css"')
      .replace(/src="app\.js"/g, 'src="/maldives/app.js"')
      .replace(/src="logo\.jpg"/g, 'src="/maldives/logo.jpg"');

    // Strip builder UI
    templateContent = templateContent.replace(
      /[ \t]*<!-- Tab Toggle for mobile[\s\S]*?<\/div>\s*\n/,
      ""
    );
    templateContent = templateContent.replace(
      /[ \t]*<!-- LEFT PANE: Editor \/ Quote Builder -->[\s\S]*?<\/aside>\s*\n/,
      ""
    );
    templateContent = templateContent.replace(
      'class="workspace-container"',
      'class="workspace-container" style="display:block;padding:0;margin:0;"'
    );

    const injectedScript = `<script>window.maldivesQuoteData = ${JSON.stringify(quoteData, null, 2)};</script>`;
    templateContent = templateContent.replace("</body>", `${injectedScript}</body>`);

    res.setHeader("Content-Type", "text/html");
    res.send(templateContent);
  } catch (err) {
    res.status(500).send("Error compiling shared page: " + err.message);
  }
});

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

// MongoDB Connection
let db = null;
if (process.env.MONGODB_URI) {
  const client = new MongoClient(process.env.MONGODB_URI);
  client.connect()
    .then(() => {
      db = client.db("travel_creator");
      console.log("==================================================");
      console.log("🍃 Connected to MongoDB Atlas successfully");
      console.log("==================================================");
    })
    .catch(err => {
      console.error("❌ MongoDB connection error:", err.message);
    });
}

// Helper: Compile JSON into HTML template (Fallback local file generation)
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

// Helper: Compile Maldives Quote into HTML preview (Fallback local file generation)
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



// ==========================================================================
// SYSTEM STATUS API
// ==========================================================================

app.get("/api/status", (req, res) => {
  res.json({
    dbConnected: db !== null,
    persistence: db ? "MongoDB Atlas" : "Local Filesystem"
  });
});

// ==========================================================================
// UNIVERSAL ITINERARIES API
// ==========================================================================

// API: List all itineraries
app.get("/api/itineraries", async (req, res) => {
  try {
    if (db) {
      const docs = await db.collection("itineraries")
        .find()
        .project({
          id: 1,
          clientName: 1,
          destination: 1,
          startDate: 1,
          endDate: 1,
          "pricing.totalCost": 1,
          lastUpdated: 1
        })
        .sort({ lastUpdated: -1 })
        .toArray();
      
      const list = docs.map(doc => ({
        id: doc.id,
        clientName: doc.clientName || "Untitled Client",
        destination: doc.destination || "Universal Destination",
        startDate: doc.startDate || "",
        endDate: doc.endDate || "",
        totalCost: doc.pricing?.totalCost || "N/A",
        lastUpdated: doc.lastUpdated
      }));
      return res.json(list);
    }

    // Fallback: File system
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
    list.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    res.json(list);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to retrieve itineraries: " + err.message });
  }
});

// API: Get itinerary detail
app.get("/api/itineraries/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (db) {
      const doc = await db.collection("itineraries").findOne({ id });
      if (!doc) {
        return res.status(404).json({ error: "Itinerary not found" });
      }
      return res.json(doc);
    }

    // Fallback: File system
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
app.post("/api/itineraries", async (req, res) => {
  try {
    const itinerary = req.body;
    delete itinerary._id; // Prevent MongoDB duplicate key error on upsert/update
    if (!itinerary.id) {
      // Generate a unique ID if it doesn't exist
      const cleanDest = (itinerary.destination || "trip")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      itinerary.id = `${cleanDest || "trip"}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    itinerary.lastUpdated = new Date().toISOString();

    if (db) {
      // Save to MongoDB
      await db.collection("itineraries").updateOne(
        { id: itinerary.id },
        { $set: itinerary },
        { upsert: true }
      );
    } else {
      // Fallback: Save JSON draft locally and compile HTML
      const filePath = path.join(DRAFTS_DIR, `${itinerary.id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(itinerary, null, 2), "utf8");
      compileItineraryHTML(itinerary);
    }

    res.json({
      success: true,
      id: itinerary.id,
      shareUrl: `/shared/${itinerary.id}.html`,
      message: "Itinerary saved successfully",
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to save itinerary: " + err.message });
  }
});

// API: Delete itinerary
app.delete("/api/itineraries/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (db) {
      const result = await db.collection("itineraries").deleteOne({ id });
      if (result.deletedCount > 0) {
        return res.json({ success: true, message: "Itinerary deleted successfully" });
      } else {
        return res.status(404).json({ error: "Itinerary not found" });
      }
    }

    // Fallback: File system
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
app.get("/api/quotes", async (req, res) => {
  try {
    if (db) {
      const docs = await db.collection("quotes")
        .find()
        .project({
          id: 1,
          "guest.name": 1,
          "guest.checkIn": 1,
          "guest.duration": 1,
          "guest.price": 1,
          "resort.name": 1,
          lastUpdated: 1
        })
        .sort({ lastUpdated: -1 })
        .toArray();
      
      const list = docs.map(doc => ({
        id: doc.id,
        guestName: doc.guest?.name || "Unnamed Guest",
        resortName: doc.resort?.name || "Unnamed Resort",
        checkIn: doc.guest?.checkIn || "",
        duration: doc.guest?.duration || "",
        price: doc.guest?.price || "N/A",
        lastUpdated: doc.lastUpdated
      }));
      return res.json(list);
    }

    // Fallback: File system
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
        resortName: data.resort?.name || "Unnamed Resort",
        checkIn: data.guest?.checkIn || "",
        duration: data.guest?.duration || "",
        price: data.guest?.price || "N/A",
        lastUpdated: stat.mtime,
      };
    });

    // Sort by last updated descending
    list.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    res.json(list);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to retrieve quotes: " + err.message });
  }
});

// API: Get quote detail
app.get("/api/quotes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (db) {
      const doc = await db.collection("quotes").findOne({ id });
      if (!doc) {
        return res.status(404).json({ error: "Quote not found" });
      }
      return res.json(doc);
    }

    // Fallback: File system
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
app.post("/api/quotes", async (req, res) => {
  try {
    const quote = req.body;
    delete quote._id; // Prevent MongoDB duplicate key error on upsert/update
    if (!quote.id) {
      // Generate a unique ID
      quote.id = `maldives-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    quote.lastUpdated = new Date().toISOString();

    if (db) {
      // Save to MongoDB
      await db.collection("quotes").updateOne(
        { id: quote.id },
        { $set: quote },
        { upsert: true }
      );
    } else {
      // Fallback: Save JSON draft locally and compile HTML
      const filePath = path.join(QUOTES_DIR, `${quote.id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(quote, null, 2), "utf8");
      compileMaldivesHTML(quote);
    }

    res.json({
      success: true,
      id: quote.id,
      shareUrl: `/quotes-shared/${quote.id}.html`,
      message: "Quote saved successfully",
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to save quote: " + err.message });
  }
});

// API: Delete quote
app.delete("/api/quotes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (db) {
      const result = await db.collection("quotes").deleteOne({ id });
      if (result.deletedCount > 0) {
        return res.json({ success: true, message: "Quote deleted successfully" });
      } else {
        return res.status(404).json({ error: "Quote not found" });
      }
    }

    // Fallback: File system
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

// ==========================================================================
// COMPANY SETTINGS API
// ==========================================================================

const SETTINGS_FILE = DATA_DIR ? path.join(DATA_DIR, "settings.json") : path.join(__dirname, "settings.json");

const DEFAULT_SETTINGS = {
  companyName: "SOLVE YOUR TRIP PRIVATE LIMITED",
  address: "A-62 F/F OLD NO A 32/A Pl, NO 492 C/A GNO 5 Vinod Nagar, East Delhi, Delhi - 110091",
  cin: "U79110DL2026PTC412345",
  pan: "AAGCS9482M",
  tan: "DELA84729C",
  udyam: "UDYAM-DL-08-0123456",
  email: "bookings@solveyourtrip.com",
  phone: "+91 62809 75235",
  founders: [
    {
      name: "Sayantan Paul",
      role: "CEO & Co-Founder",
      bio: "A technology architect and passionate global explorer with 10+ years of software design experience. Sayantan created Solve Your Trip's proprietary interactive itinerary engine, merging custom UI workflows with travel planning database APIs to replace static document layouts.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      linkedin: "https://linkedin.com",
      email: "sayantan@solveyourtrip.com"
    },
    {
      name: "Utkarsha Bangari",
      role: "COO & Co-Founder",
      bio: "A luxury hospitality specialist and destination relations expert. Utkarsha directs our property alliances and international ground operations. Dedicated to forging direct tie-ups with global properties and ensuring direct, verified rates with seamless transfers.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
      linkedin: "https://linkedin.com",
      email: "utkarsha@solveyourtrip.com"
    },
    {
      name: "Priyanshu Rawat",
      role: "CPO & Co-Founder",
      bio: "A digital product expert and UX enthusiast. Priyanshu oversees our customer experience portals, interactive quote platforms, and internal suite integrations, translating complex booking configurations into visually stunning, interactive web experiences.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
      linkedin: "https://linkedin.com",
      email: "priyanshu@solveyourtrip.com"
    }
  ]
};

// API: Get Company Profile settings
app.get("/api/settings", async (req, res) => {
  try {
    if (db) {
      const doc = await db.collection("settings").findOne({ id: "company_profile" });
      if (doc) {
        return res.json(doc.settings);
      }
    } else {
      if (fs.existsSync(SETTINGS_FILE)) {
        const raw = fs.readFileSync(SETTINGS_FILE, "utf8");
        return res.json(JSON.parse(raw));
      }
    }
    // Return default if not set
    res.json(DEFAULT_SETTINGS);
  } catch (err) {
    res.status(500).json({ error: "Failed to get settings: " + err.message });
  }
});

// API: Save Company Profile settings
app.post("/api/settings", async (req, res) => {
  try {
    const settings = req.body;
    if (db) {
      await db.collection("settings").updateOne(
        { id: "company_profile" },
        { $set: { id: "company_profile", settings, lastUpdated: new Date().toISOString() } },
        { upsert: true }
      );
    } else {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf8");
    }
    res.json({ success: true, message: "Settings saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save settings: " + err.message });
  }
});

// ==========================================================================
// PROPOSAL LINK TRACKER API
// ==========================================================================

// API: Get link clicks stats
app.get("/api/tracker/stats", async (req, res) => {
  try {
    const rawIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    const agentIp = rawIp.split(",")[0].trim();

    if (db) {
      const clicks = await db.collection("link_clicks")
        .find()
        .sort({ timestamp: -1 })
        .limit(1000)
        .toArray();
      return res.json({ agentIp, clicks });
    } else {
      const CLICKS_FILE = path.join(DATA_DIR || __dirname, "link_clicks.json");
      if (fs.existsSync(CLICKS_FILE)) {
        try {
          const clicks = JSON.parse(fs.readFileSync(CLICKS_FILE, "utf8"));
          clicks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          return res.json({ agentIp, clicks: clicks.slice(0, 1000) });
        } catch (e) {
          return res.json({ agentIp, clicks: [] });
        }
      }
      return res.json({ agentIp, clicks: [] });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to load tracker stats: " + err.message });
  }
});

// API: Clear link clicks history
app.delete("/api/tracker/stats", async (req, res) => {
  try {
    if (db) {
      await db.collection("link_clicks").deleteMany({});
      return res.json({ success: true, message: "Tracker history cleared" });
    } else {
      const CLICKS_FILE = path.join(DATA_DIR || __dirname, "link_clicks.json");
      if (fs.existsSync(CLICKS_FILE)) {
        fs.writeFileSync(CLICKS_FILE, JSON.stringify([], null, 2), "utf8");
      }
      return res.json({ success: true, message: "Tracker history cleared" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to clear tracker stats: " + err.message });
  }
});

// ==========================================================================
// CUSTOMER INQUIRIES API
// ==========================================================================

// API: List all customer inquiries
app.get("/api/inquiries", async (req, res) => {
  try {
    if (db) {
      const docs = await db.collection("inquiries")
        .find()
        .sort({ createdAt: -1 })
        .toArray();
      return res.json(docs);
    }

    // Fallback: File system
    if (!fs.existsSync(INQUIRIES_DIR)) {
      return res.json([]);
    }
    const files = fs
      .readdirSync(INQUIRIES_DIR)
      .filter((file) => file.endsWith(".json"));
    const list = files.map((filename) => {
      const filePath = path.join(INQUIRIES_DIR, filename);
      const rawContent = fs.readFileSync(filePath, "utf8");
      return JSON.parse(rawContent);
    });

    // Sort by createdAt descending
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(list);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to retrieve inquiries: " + err.message });
  }
});

// API: Save an inquiry (Public POST)
app.post("/api/inquiries", async (req, res) => {
  try {
    const inquiry = req.body;
    inquiry.id = `inq-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    inquiry.createdAt = new Date().toISOString();
    inquiry.status = "Pending";

    if (db) {
      await db.collection("inquiries").insertOne(inquiry);
    } else {
      const filePath = path.join(INQUIRIES_DIR, `${inquiry.id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(inquiry, null, 2), "utf8");
    }

    res.json({
      success: true,
      id: inquiry.id,
      message: "Inquiry submitted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit inquiry: " + err.message });
  }
});

// API: Delete inquiry
app.delete("/api/inquiries/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (db) {
      const result = await db.collection("inquiries").deleteOne({ id });
      if (result.deletedCount > 0) {
        return res.json({ success: true, message: "Inquiry deleted successfully" });
      } else {
        return res.status(404).json({ error: "Inquiry not found" });
      }
    }

    // Fallback: File system
    const filePath = path.join(INQUIRIES_DIR, `${id}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.json({ success: true, message: "Inquiry deleted successfully" });
    }
    res.status(404).json({ error: "Inquiry not found" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete inquiry: " + err.message });
  }
});

// Route: Serve creators dashboard
app.get("/creators", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "creators.html"));
});

// Route: Serve about us page
app.get("/about", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "about.html"));
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
  console.log(`💾 Hybrid Persistence Server Active`);
  console.log(`==================================================`);
});
