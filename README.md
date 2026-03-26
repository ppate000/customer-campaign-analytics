# Customer Campaign Analytics Static Site

This is the static GitHub Pages version of the Customer Campaign Analytics project.

## What it is
A portfolio-ready HTML/CSS/JavaScript dashboard that presents campaign, segment, and customer analytics using preloaded data.

## Why this version exists
GitHub Pages only supports static files. This package removes the Flask backend and turns the project into a site you can deploy directly.

## Files
- `index.html` - main dashboard page
- `styles.css` - styling
- `script.js` - rendering, filtering, theme toggle
- `data.js` - preloaded dashboard data
- `.nojekyll` - avoids GitHub Pages Jekyll processing issues

## Run locally
You can open `index.html` directly in your browser, or use a lightweight local server.

### Option 1: open directly
Double-click `index.html`

### Option 2: local server
```bash
python3 -m http.server 8000
```
Then open `http://127.0.0.1:8000`

## Deploy to GitHub Pages
1. Create a GitHub repo
2. Upload all files in this folder to the repo root
3. Go to Settings > Pages
4. Set source to your main branch and root folder
5. Save

After GitHub Pages publishes, your site will be live.
