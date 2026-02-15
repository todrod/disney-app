# Disney Parks Guide

A mobile-first web app for quickly checking Disney World park information, merchandise, popcorn buckets, and live wait times.

## Features

- 🏰 4 Disney World parks (Magic Kingdom, EPCOT, Hollywood Studios, Animal Kingdom)
- ⏱️ Live wait times (updates every 5 minutes via Queue-Times API)
- ⭐ Limited edition merchandise tracking
- 🍿 Popcorn bucket availability
- 📱 Mobile-responsive design
- ⚡ Fast loading (<2 seconds)

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Queue-Times API** (free, no key required)

## Getting Started

### Prerequisites

You need Node.js installed. Check if you have it:

```bash
node --version
```

If not installed, download from: https://nodejs.org/ (get the LTS version)

### Installation

1. Navigate to the project folder:
```bash
cd /Users/todrod/.openclaw/workspace/projects/disney-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser to: http://localhost:3000

### View on Mobile

While the dev server is running:

1. Find your computer's local IP address:
   - Mac: System Preferences → Network
   - Or run: `ipconfig getifaddr en0`

2. On your phone's browser, go to: `http://YOUR_IP_ADDRESS:3000`

Example: `http://192.168.1.100:3000`

## Project Structure

```
disney-app/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page (park selector)
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── parks/[slug]/      # Dynamic park pages
│       └── page.tsx       # Individual park page
├── components/            # React components
│   ├── ParkCard.tsx       # Home page park button
│   ├── WaitTimes.tsx      # Live wait times display
│   ├── MerchList.tsx      # Merchandise list
│   ├── PopcornBucketList.tsx  # Popcorn bucket list
│   └── ParkHours.tsx      # Park hours display
├── data/                  # Static JSON data
│   ├── magic-kingdom-data.json
│   ├── epcot-data.json
│   ├── hollywood-studios-data.json
│   └── animal-kingdom-data.json
└── public/                # Static assets (images, etc.)
```

## Modifying the App

### Add/Update Merchandise

Edit the JSON files in the `data/` folder. For example, to add merch to Magic Kingdom:

Open `data/magic-kingdom-data.json` and add to the `limitedEditionMerch` array:

```json
{
  "id": "mk-004",
  "name": "New Item Name",
  "location": "Store Location",
  "price": "$XX.XX",
  "limitedEdition": true,
  "notes": "Any special notes"
}
```

### Add/Update Popcorn Buckets

Same process - edit the `popcornBuckets` array in the park's JSON file:

```json
{
  "id": "pk-mk-004",
  "name": "Bucket Name",
  "location": "Where to find it",
  "price": "$XX.XX",
  "available": true,
  "limitedEdition": false,
  "notes": "Special info"
}
```

### Update Park Hours

In each park's JSON file, update the `parkHours` section:

```json
"parkHours": {
  "today": "9:00 AM - 10:00 PM",
  "tomorrow": "9:00 AM - 9:00 PM"
}
```

### Styling

- Main colors are in `tailwind.config.ts`
- Global styles are in `app/globals.css`
- Component-specific styles use Tailwind classes inline

## Deployment

### Deploy to Vercel (Free)

1. Sign up at https://vercel.com
2. Install Vercel CLI: `npm install -g vercel`
3. From the project folder, run: `vercel`
4. Follow the prompts
5. Your app will be live at: `your-app.vercel.app`

## Cost Breakdown

- ✅ Next.js: Free
- ✅ Queue-Times API: Free (no key needed)
- ✅ Vercel Hosting: Free (hobby tier)
- ✅ Total: $0

## Known Limitations

- Wait times require internet connection
- Merch/bucket data is manually curated (not auto-updated)
- No user accounts or favorites (MVP phase)
- Works best on iOS Safari and Android Chrome

## Next Steps

1. Test on actual phone during park visit
2. Add more parks (water parks, etc.)
3. Add push notifications for new merch
4. Add map integration
5. Add photo upload feature

## Support

For issues or questions, see the full build report at:
`/Users/todrod/.openclaw/workspace/projects/disney-app-build-report.md`
