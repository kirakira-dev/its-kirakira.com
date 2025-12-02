# Cloudflare Workers Setup Guide

This guide will help you set up a Cloudflare Worker to handle the API endpoint while keeping your static site on GitHub Pages.

## Prerequisites

1. A Cloudflare account (free tier works)
2. Your domain `its-kirakira.com` should be managed by Cloudflare (or you can add it)

## Step-by-Step Setup

### Step 1: Add Domain to Cloudflare (if not already)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click "Add a Site"
3. Enter `its-kirakira.com`
4. Follow the prompts to update your nameservers
5. Wait for DNS propagation (usually 5-30 minutes)

### Step 2: Create a Cloudflare Worker

1. In Cloudflare Dashboard, go to **Workers & Pages** → **Create application**
2. Click **Create Worker**
3. Name it something like `kiruna-api` or `its-kirakira-api`
4. Click **Deploy**

### Step 3: Add the Worker Code

1. In the Worker editor, replace the default code with the contents of `cloudflare-worker.js`
2. Click **Save and deploy**

### Step 4: Configure Route (Important!)

1. Go to your Worker's settings
2. Click **Triggers** tab
3. Under **Routes**, click **Add route**
4. Add route:
   - **Route**: `its-kirakira.com/api/v1/kiruna-update-checker/*`
   - **Zone**: `its-kirakira.com`
   - **Environment**: `production`
5. Click **Save**

### Step 5: Configure GitHub Pages (if using)

1. Keep your GitHub Pages setup as is
2. Your static site will still be served from GitHub Pages
3. The API route will be handled by Cloudflare Worker

### Step 6: Test the API

```bash
# Should return "Invalid Request"
curl "https://its-kirakira.com/api/v1/kiruna-update-checker/"

# Should return "UpdateNone"
curl "https://its-kirakira.com/api/v1/kiruna-update-checker/?key=3302b00ddb20209ad5b2a7158373a2f0bfafb2facd055f36f24a487371b59abb796ce611149b02c8d56c9eafcc859be07efca955a2bccfe083f62ee3951f1b58edc56430d69ea5643e93c00805cf1c2ba1915bb663cf6615c8594ce135e8cf874257b6bbd47e931f825203e9625fd9a2bf2ba561af99a0ccbde24782b8f69c9d4edaebf967fddea23025746a9f2a0fb636b33b4ab3330fcc075f362bef21a3148dc2ee3891b66144b3bcaddb24f06ffde423739d504113cec851e9a5577e3eac5844b5e7432c0dd0ed23b41b1f701f99fc67f993462fdad7c375b21b21bff96e27f0565feec08dc601529e9d5e73319ec454ece373c2c247711df59cc60c28687d7c9dfa6a79c9ef2f3e29d4ab2adadb01ebd861d9177d0affb745c4254e58db971b779897b60a56d68bd426c6566f0d015c4182570ad5beaae6a44e06f28dd7"
```

## Alternative: Using Wrangler CLI

If you prefer command-line deployment:

### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

### Step 3: Create wrangler.toml

Create a file `wrangler.toml` in your project root:

```toml
name = "kiruna-update-checker"
main = "cloudflare-worker.js"
compatibility_date = "2024-01-01"

[[routes]]
pattern = "its-kirakira.com/api/v1/kiruna-update-checker/*"
zone_name = "its-kirakira.com"
```

### Step 4: Deploy

```bash
cd /Users/kirakira/Projects/its-kirakira.com
wrangler deploy
```

## How It Works

1. **Static files** (HTML, CSS, JS, images) → Served by GitHub Pages
2. **API requests** to `/api/v1/kiruna-update-checker/*` → Handled by Cloudflare Worker
3. Cloudflare routes the request based on the path pattern

## Benefits

- ✅ Free tier: 100,000 requests/day
- ✅ Fast global edge network
- ✅ Automatic HTTPS
- ✅ No server management
- ✅ Works alongside GitHub Pages

## Troubleshooting

### Route not working?
- Make sure the route pattern matches exactly: `its-kirakira.com/api/v1/kiruna-update-checker/*`
- Check that your domain is added to Cloudflare
- Verify DNS is pointing to Cloudflare nameservers

### CORS issues?
- The worker already includes CORS headers
- If you need to restrict origins, modify the `Access-Control-Allow-Origin` header

### Testing locally?
```bash
# Install wrangler
npm install -g wrangler

# Run locally
wrangler dev
```

Then test at `http://localhost:8787/api/v1/kiruna-update-checker/`

