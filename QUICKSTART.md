# 🚀 Quick Start Guide

**Goal:** Get your Disney app running in 10 minutes

---

## Step 1: Install Node.js (5 minutes)

**If you already have Node.js installed, skip to Step 2!**

Check if you have it:
```bash
node --version
```

If you see a version number (like `v22.13.0`), you're good! Skip to Step 2.

If not, install it:
1. Go to: https://nodejs.org/
2. Click the big green button (LTS version)
3. Run the installer
4. Restart Terminal

---

## Step 2: Install Dependencies (3 minutes)

```bash
# Navigate to the project
cd /Users/todrod/.openclaw/workspace/projects/disney-app

# Install everything
npm install
```

Wait for it to finish (takes 2-3 minutes).

---

## Step 3: Start the App (30 seconds)

```bash
npm run dev
```

**You should see:**
```
▲ Next.js 14.1.0
- Local:        http://localhost:3000
```

---

## Step 4: Open in Browser

Open your browser and go to: **http://localhost:3000**

You should see the Disney Parks Guide home page with 4 park buttons!

---

## Step 5: View on Your Phone

### Find your computer's IP address:

```bash
ipconfig getifaddr en0
```

You'll see something like: `192.168.1.100`

### On your phone:

1. Connect to the **same WiFi** as your computer
2. Open Safari or Chrome
3. Go to: `http://192.168.1.100:3000` (use YOUR IP address)
4. Bookmark it to your home screen!

---

## That's It! 🎉

Your app is now running. Try clicking around and exploring the parks.

---

## Quick Reference

**Start the app:**
```bash
cd /Users/todrod/.openclaw/workspace/projects/disney-app
npm run dev
```

**Stop the app:**
Press `Ctrl + C` in Terminal

**Update merch data:**
Edit files in `data/` folder (they're just text files with curly braces)

**Read full documentation:**
- `README.md` - Setup and usage
- `disney-app-build-report.md` - Everything explained in detail

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "command not found: npm" | Node.js isn't installed - go back to Step 1 |
| "Cannot find module" | Run `npm install` again |
| Port 3000 in use | Try: `npm run dev -- -p 3001` |
| Can't connect from phone | Make sure both on same WiFi |

---

## Next Steps

1. ✅ Get it running (you just did this!)
2. 📝 Update park hours in data files
3. 📝 Update merch/popcorn data with real items
4. 📝 Test at Disney World (Feb 16!)

**Full details in:** `disney-app-build-report.md`

---

**Need help?** Check the build report or README - they have detailed explanations!
