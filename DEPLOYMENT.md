# Deployment Guide for KirunaNX Update Checker API

This guide covers different deployment options for the API endpoint at `/api/v1/kiruna-update-checker/`.

## Option 1: Vercel (Recommended - Easiest)

Vercel is great for static sites with serverless functions.

### Steps:
1. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   cd /Users/kirakira/Projects/its-kirakira.com
   vercel
   ```

3. Follow the prompts to link your project or create a new one.

4. The API will be available at:
   - `https://your-project.vercel.app/api/v1/kiruna-update-checker/`
   - Or your custom domain if configured

**Note:** Make sure `api/v1/kiruna-update-checker/vercel.js` exists (it's the Vercel-specific handler).

## Option 2: Netlify

Netlify also supports serverless functions.

### Steps:
1. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Deploy:
   ```bash
   cd /Users/kirakira/Projects/its-kirakira.com
   netlify deploy --prod
   ```

3. Or connect via GitHub:
   - Go to [Netlify](https://app.netlify.com)
   - Import your repository
   - Netlify will automatically detect `netlify.toml`

**Note:** The function is in `.netlify/functions/kiruna-update-checker.js`

## Option 3: Traditional PHP Hosting

If your hosting supports PHP, you can use the PHP version.

### Steps:
1. Upload `api/v1/kiruna-update-checker/index.php` to your server
2. Ensure PHP is enabled
3. The endpoint will be available at:
   `https://its-kirakira.com/api/v1/kiruna-update-checker/`

### Testing:
```bash
# Test with invalid key (should return "Invalid Request")
curl "https://its-kirakira.com/api/v1/kiruna-update-checker/"

# Test with valid key (should return "UpdateNone")
curl "https://its-kirakira.com/api/v1/kiruna-update-checker/?key=YOUR_API_KEY"
```

## Option 4: GitHub Pages + Cloudflare Workers

If you're using GitHub Pages, you can add Cloudflare Workers for the API.

### Steps:
1. Keep your static site on GitHub Pages
2. Create a Cloudflare Worker:
   - Go to Cloudflare Dashboard → Workers
   - Create a new Worker
   - Copy the code from `api/v1/kiruna-update-checker/index.js`
   - Add route: `its-kirakira.com/api/v1/kiruna-update-checker/*`

## Option 5: Node.js/Express Server

If you have a VPS or server, you can run a simple Express server.

### Steps:
1. Create `server.js` in the root:
```javascript
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('.'));

app.all('/api/v1/kiruna-update-checker/', require('./api/v1/kiruna-update-checker/index.js'));

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

2. Install dependencies:
```bash
npm init -y
npm install express
```

3. Run:
```bash
node server.js
```

## Testing the API

After deployment, test with:

```bash
# Should return "Invalid Request"
curl "https://its-kirakira.com/api/v1/kiruna-update-checker/"

# Should return "UpdateNone"
curl "https://its-kirakira.com/api/v1/kiruna-update-checker/?key=3302b00ddb20209ad5b2a7158373a2f0bfafb2facd055f36f24a487371b59abb796ce611149b02c8d56c9eafcc859be07efca955a2bccfe083f62ee3951f1b58edc56430d69ea5643e93c00805cf1c2ba1915bb663cf6615c8594ce135e8cf874257b6bbd47e931f825203e9625fd9a2bf2ba561af99a0ccbde24782b8f69c9d4edaebf967fddea23025746a9f2a0fb636b33b4ab3330fcc075f362bef21a3148dc2ee3891b66144b3bcaddb24f06ffde423739d504113cec851e9a5577e3eac5844b5e7432c0dd0ed23b41b1f701f99fc67f993462fdad7c375b21b21bff96e27f0565feec08dc601529e9d5e73319ec454ece373c2c247711df59cc60c28687d7c9dfa6a79c9ef2f3e29d4ab2adadb01ebd861d9177d0affb745c4254e58db971b779897b60a56d68bd426c6566f0d015c4182570ad5beaae6a44e06f28dd7"
```

## Recommended: Vercel

For the easiest deployment with automatic HTTPS and custom domain support, use **Vercel**. It's free for personal projects and handles everything automatically.

