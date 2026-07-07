const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'public', 'universal', 'template.html');
const appJsPath = path.join(__dirname, 'public', 'universal', 'app.js');

if (!fs.existsSync(templatePath)) {
    console.error("template.html not found!");
    process.exit(1);
}

if (!fs.existsSync(appJsPath)) {
    console.error("app.js not found!");
    process.exit(1);
}

const templateHtml = fs.readFileSync(templatePath, 'utf8');
const appJs = fs.readFileSync(appJsPath, 'utf8');

// Escape template for ES6 template literal
let escaped = templateHtml
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\${/g, '\\${');

// Inject the raw interpolation for window.itineraryData where the placeholder is
const placeholder = '<!-- ITINERARY_DATA_INJECTION_PLACEHOLDER -->';
if (escaped.includes(placeholder)) {
    escaped = escaped.replace(placeholder, '<script>window.itineraryData = ${JSON.stringify(data, null, 2)};</script>');
} else {
    escaped = escaped.replace('</body>', '<script>window.itineraryData = ${JSON.stringify(data, null, 2)};</script></body>');
}

// Construct the new compileStaticHTMLOffline function
const newFunctionContent = `function compileStaticHTMLOffline(data) {
    if (baseTemplateHtml) {
        const injectedScript = \`<script>window.itineraryData = \${JSON.stringify(data, null, 2)};</script>\`;
        const placeholder = "<!-- ITINERARY_DATA_INJECTION_PLACEHOLDER -->";
        if (baseTemplateHtml.includes(placeholder)) {
            return baseTemplateHtml.replace(placeholder, injectedScript);
        } else {
            return baseTemplateHtml.replace("</body>", \`\${injectedScript}</body>\`);
        }
    }
    return \`${escaped}\`;
}

`;

// Find compileStaticHTMLOffline function in app.js and replace it
// It starts with 'function compileStaticHTMLOffline(' and ends right before 'function addFlightLeg('
const functionStartToken = 'function compileStaticHTMLOffline(';
const nextFunctionToken = 'function addFlightLeg(';

const startIndex = appJs.indexOf(functionStartToken);
const endIndex = appJs.indexOf(nextFunctionToken);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find compileStaticHTMLOffline or addFlightLeg in app.js");
    process.exit(1);
}

const updatedAppJs = appJs.substring(0, startIndex) + newFunctionContent + appJs.substring(endIndex);

fs.writeFileSync(appJsPath, updatedAppJs, 'utf8');
console.log("Successfully synchronized template.html with app.js compileStaticHTMLOffline fallback.");
