# 🎢 Pre-Disney Trip Checklist

**Your Disney trip: February 16, 2026**  
**Days remaining: 9**

Use this checklist to make sure your app is ready!

---

## ✅ Phase 1: Get It Running (Do This First!)

### Tech Setup
- [ ] **Install Node.js** (https://nodejs.org - get LTS version)
  - Verify: `node --version` should show a version number
  - Verify: `npm --version` should show a version number

- [ ] **Install dependencies**
  ```bash
  cd /Users/todrod/.openclaw/workspace/projects/disney-app
  npm install
  ```
  - Should take 2-3 minutes
  - Watch for any errors (usually means Node.js isn't installed)

- [ ] **Start the dev server**
  ```bash
  npm run dev
  ```
  - Should see: "Local: http://localhost:3000"

- [ ] **Test in browser**
  - Open: http://localhost:3000
  - Should see home page with 4 park buttons
  - Click each park - should navigate to park pages

- [ ] **Test on iPhone**
  - Find your Mac's IP: `ipconfig getifaddr en0`
  - On iPhone, same WiFi, go to: `http://YOUR_IP:3000`
  - Test clicking around
  - Add bookmark to home screen for easy access

---

## ✅ Phase 2: Update Real Data (Critical!)

### Park Hours
- [ ] **Magic Kingdom hours**
  - Edit: `data/magic-kingdom-data.json`
  - Update `parkHours.today` and `parkHours.tomorrow`
  - Source: https://disneyworld.disney.go.com/calendars/

- [ ] **EPCOT hours**
  - Edit: `data/epcot-data.json`
  - Same process

- [ ] **Hollywood Studios hours**
  - Edit: `data/hollywood-studios-data.json`

- [ ] **Animal Kingdom hours**
  - Edit: `data/animal-kingdom-data.json`

### Limited Edition Merch Research
- [ ] **Check Disney Parks Blog**
  - URL: https://disneyparks.disney.go.com/blog/
  - Look for "merchandise" or "limited edition" posts
  - Note items that are currently available

- [ ] **Check shopDisney**
  - URL: https://www.shopdisney.com/parks/
  - Filter by "New Arrivals"
  - Note prices and store locations

- [ ] **Update Magic Kingdom merch**
  - Replace sample items in `data/magic-kingdom-data.json`
  - Use real item names, locations, prices
  - Mark actual limited editions

- [ ] **Update other parks**
  - EPCOT: `data/epcot-data.json`
  - Hollywood Studios: `data/hollywood-studios-data.json`
  - Animal Kingdom: `data/animal-kingdom-data.json`

### Popcorn Buckets
- [ ] **Check Disney Food Blog**
  - URL: https://www.disneyfoodblog.com/
  - Search: "popcorn bucket"
  - Note current availability

- [ ] **Check Instagram**
  - Hashtag: #disneypopcornbucket
  - Recent posts show what's currently available

- [ ] **Update popcorn bucket data**
  - Set `available: true` only if confirmed in stock
  - Update prices (they change!)
  - Update notes with latest info

---

## ✅ Phase 3: Polish & Test (Nice to Have)

### Visual Improvements (Optional)
- [ ] **Add real park images**
  - Download park photos (or use your own!)
  - Save to: `public/images/`
  - Update `components/ParkCard.tsx` to use images instead of emoji

- [ ] **Add app icon**
  - Create or download a Disney-themed icon
  - Save as: `public/favicon.ico`

### Performance Testing
- [ ] **Test on slow connection**
  - Enable "Slow 3G" in browser DevTools
  - Refresh home page - should still load quickly
  - Check wait times still load

- [ ] **Test battery usage**
  - Open app on iPhone
  - Leave it open for 30 minutes
  - Check battery drain (should be minimal)

### User Testing
- [ ] **Ask Ralph to test**
  - Give him the URL (IP address)
  - Don't explain anything - see if it's intuitive
  - Note what confuses him
  - Ask: "Would you use this at Disney?"

- [ ] **Test with someone else**
  - Friend, family member, anyone
  - Fresh perspective = better feedback

---

## ✅ Phase 4: Deploy (Optional but Recommended)

### Deploy to Vercel
- [ ] **Create GitHub account** (if you don't have one)
  - https://github.com/signup

- [ ] **Create Git repository**
  ```bash
  cd /Users/todrod/.openclaw/workspace/projects/disney-app
  git init
  git add .
  git commit -m "Disney Parks Guide MVP"
  ```

- [ ] **Push to GitHub**
  - Create new repo on GitHub
  - Follow "push existing repository" instructions
  - Should see all your files on GitHub

- [ ] **Deploy to Vercel**
  - Sign up: https://vercel.com
  - Click "New Project"
  - Import from GitHub
  - Select your disney-app repo
  - Click "Deploy"
  - Get URL like: `disney-app.vercel.app`

**Benefits of deploying:**
- ✅ Access from anywhere (don't need Mac on)
- ✅ Share with Ralph easily
- ✅ Automatic updates when you push to GitHub
- ✅ Free hosting forever

**Downside:**
- Takes 20-30 minutes to set up
- Not required if local access works fine

---

## ✅ Phase 5: Pre-Trip Final Check

**48 hours before Disney:**

### Data Freshness
- [ ] **Re-check park hours** (Disney sometimes changes them last minute)
- [ ] **Re-check limited edition items** (popular stuff sells out)
- [ ] **Re-check popcorn buckets** (availability changes daily)

### Technical Check
- [ ] **Restart dev server** (`Ctrl+C` then `npm run dev`)
- [ ] **Clear browser cache** (Cmd+Shift+R on Mac)
- [ ] **Test wait times** (should load current data)
- [ ] **Test all 4 park pages**

### Mobile Ready
- [ ] **Charge phone to 100%**
- [ ] **Download app to phone** (visit URL, add to home screen)
- [ ] **Test offline loading** (turn off WiFi, see what works)
  - Merch data should still load (cached)
  - Wait times won't update (requires internet)

### Backup Plan
- [ ] **Screenshot key info** (in case phone dies)
  - Park hours for each day
  - Top 3 limited edition items you want
  - Popcorn bucket locations

- [ ] **Save Vercel URL** (if deployed)
  - Can access from any device
  - Ralph can see it too

- [ ] **Bring portable charger** 🔋
  - Phone will drain faster at parks
  - App is lightweight but screen-on time adds up

---

## 🎯 Day Before Disney (Feb 15)

### Morning
- [ ] Update all park hours for your trip days
- [ ] Check Disney Parks Blog for new merchandise announcements
- [ ] Test app one last time on phone

### Evening
- [ ] **Export to PDF (backup):**
  - Open each park page in browser
  - Print to PDF (Cmd+P → Save as PDF)
  - AirDrop to phone
  - Worst case: you have static backup

- [ ] Charge phone to 100%
- [ ] Charge portable battery
- [ ] Save app URL to phone notes

---

## 📱 At Disney (Feb 16+)

### Before Entering Park
- [ ] Connect to park WiFi
- [ ] Open app, let wait times load
- [ ] Bookmark or add to home screen (if not done already)

### During Day
- [ ] Check wait times before rope drop
- [ ] Check merch locations as you pass stores
- [ ] Note any items not in the app (to add later)
- [ ] Take screenshots of anything interesting

### Evening
- [ ] Note what worked well
- [ ] Note what was missing
- [ ] Note what was inaccurate
- [ ] List ideas for improvements

---

## 🚨 Troubleshooting Quick Reference

| Problem | Quick Fix |
|---------|-----------|
| App won't start | Restart dev server: `npm run dev` |
| Can't connect from phone | Check both on same WiFi |
| Wait times not loading | Check internet connection |
| Data not updating | Hard refresh: Cmd+Shift+R |
| Port 3000 in use | Use different port: `npm run dev -- -p 3001` |
| Changes not showing | Stop server, restart, clear cache |

---

## 📊 Success Metrics

**You'll know it worked if:**

✅ **Speed**: Faster than Googling or checking multiple sources  
✅ **Accuracy**: Info matches what you find in the parks  
✅ **Usefulness**: You use it 3+ times during your trip  
✅ **Simplicity**: No confusion, works without instructions  
✅ **Reliability**: Doesn't crash or fail to load  

**Bonus points:**
🎯 Ralph uses it too  
🎯 You find merch you wouldn't have known about  
🎯 You avoid a sold-out item by checking ahead  
🎯 You want to keep building it after the trip  

---

## 🎉 You're Ready!

Once you've checked off the essentials (Phase 1 & 2), you're good to go!

Phases 3-5 are nice-to-haves that improve the experience but aren't critical.

---

## 📞 Need Help?

**Before your trip:**
- Read: `QUICKSTART.md` (10-minute setup)
- Read: `README.md` (full documentation)
- Read: `disney-app-build-report.md` (everything explained)

**At Disney:**
- If app breaks, fall back to My Disney Experience app
- Take notes on what to fix when you get home
- Don't stress - it's MVP, bugs are expected!

---

**Most important:** Have an amazing trip! The app is a tool to enhance your experience, not the experience itself. 🎢✨

**—Felix** 🏗️
