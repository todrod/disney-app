# Disney Parks Guide - Project Structure

## 📁 Directory Tree

```
disney-app/
│
├── 📄 QUICKSTART.md              ← Start here! 10-minute setup guide
├── 📄 README.md                  ← Full documentation
├── 📄 package.json               ← Dependencies & scripts
├── 📄 tsconfig.json              ← TypeScript configuration
├── 📄 tailwind.config.ts         ← Styling configuration (Disney colors!)
├── 📄 postcss.config.js          ← CSS processing
├── 📄 next.config.js             ← Next.js settings
├── 📄 .gitignore                 ← Git ignore rules
│
├── 📂 app/                       ← Pages (Next.js App Router)
│   ├── 📄 layout.tsx             ← Root layout (wraps all pages)
│   ├── 📄 page.tsx               ← HOME PAGE (4 park buttons)
│   ├── 📄 globals.css            ← Global styles
│   │
│   └── 📂 parks/
│       └── 📂 [slug]/            ← Dynamic route (handles all parks)
│           └── 📄 page.tsx       ← PARK PAGE TEMPLATE
│
├── 📂 components/                ← Reusable UI components
│   ├── 📄 ParkCard.tsx           ← Park button on home page
│   ├── 📄 WaitTimes.tsx          ← Live wait times (Queue-Times API)
│   ├── 📄 MerchList.tsx          ← Merchandise display
│   ├── 📄 PopcornBucketList.tsx  ← Popcorn bucket display
│   └── 📄 ParkHours.tsx          ← Park hours display
│
├── 📂 data/                      ← JSON data files (your "database")
│   ├── 📄 magic-kingdom-data.json      ← Magic Kingdom merch & buckets
│   ├── 📄 epcot-data.json              ← EPCOT merch & buckets
│   ├── 📄 hollywood-studios-data.json  ← Hollywood Studios merch & buckets
│   └── 📄 animal-kingdom-data.json     ← Animal Kingdom merch & buckets
│
└── 📂 public/                    ← Static files (images, fonts, etc.)
    └── 📂 images/                ← Park images (empty for now, using emoji)
```

---

## 🎯 Key Files Explained

### **Configuration Files** (Don't touch unless you know what you're doing)

| File | Purpose |
|------|---------|
| `package.json` | Lists all dependencies (React, Next.js, etc.) |
| `tsconfig.json` | TypeScript settings |
| `tailwind.config.ts` | Custom colors and Tailwind settings |
| `next.config.js` | Next.js optimization settings |
| `postcss.config.js` | CSS processing (needed for Tailwind) |

---

### **App Files** (The pages users see)

#### `app/page.tsx` - Home Page
- Shows 4 park selector buttons
- Each button is a different color and emoji
- Clicking takes you to that park's page

#### `app/layout.tsx` - Root Layout
- Wraps all pages with common elements
- Sets metadata (title, description)
- Loads global CSS

#### `app/parks/[slug]/page.tsx` - Park Pages
- **Dynamic route**: One template handles all 4 parks
- Loads data from JSON files
- Shows: hours, wait times, merch, popcorn buckets

---

### **Components** (Reusable UI pieces)

#### `ParkCard.tsx` - Park Button
- Used on home page
- Shows park name + emoji
- Hover/tap animation
- Links to park page

#### `WaitTimes.tsx` - Live Wait Times
- Fetches from Queue-Times API
- Auto-refreshes every 5 minutes
- Color-coded badges (green/yellow/red)
- Shows only open rides
- Handles errors gracefully

#### `MerchList.tsx` - Merchandise Display
- Reads from JSON data
- Shows name, location, price
- Limited edition badge (⭐)
- Notes section

#### `PopcornBucketList.tsx` - Popcorn Buckets
- Shows availability status (green/red)
- Limited edition badges
- Location and price
- Notes for special info

#### `ParkHours.tsx` - Park Hours
- Simple display: Today + Tomorrow
- Blue border for visibility

---

### **Data Files** (Easy to edit!)

Each park has a JSON file with this structure:

```json
{
  "parkName": "Magic Kingdom",
  "queueTimesId": 47,                  ← Queue-Times API ID
  "limitedEditionMerch": [             ← Array of merch items
    {
      "id": "mk-001",
      "name": "Item name",
      "location": "Store name",
      "price": "$XX.XX",
      "limitedEdition": true,          ← Shows ⭐ badge
      "notes": "Special info"
    }
  ],
  "popcornBuckets": [                  ← Array of popcorn buckets
    {
      "id": "pk-mk-001",
      "name": "Bucket name",
      "location": "Where to find",
      "price": "$XX.XX",
      "available": true,               ← Green if true, red if false
      "limitedEdition": false,
      "notes": "Special info"
    }
  ],
  "parkHours": {
    "today": "9:00 AM - 11:00 PM",
    "tomorrow": "9:00 AM - 10:00 PM"
  }
}
```

**To update:** Just open the file in any text editor and change the values!

---

## 🔄 How Data Flows

### Home Page Load:
```
User visits homepage
  ↓
app/page.tsx loads
  ↓
Renders 4 ParkCard components
  ↓
User sees park buttons
```

### Park Page Load:
```
User clicks "Magic Kingdom"
  ↓
Navigates to /parks/magic-kingdom
  ↓
app/parks/[slug]/page.tsx loads
  ↓
Reads data/magic-kingdom-data.json
  ↓
Passes data to components:
  - ParkHours
  - WaitTimes (fetches from API)
  - MerchList
  - PopcornBucketList
  ↓
User sees complete park page
```

### Wait Times Update:
```
WaitTimes component mounts
  ↓
Fetches from Queue-Times API
  ↓
Shows loading spinner
  ↓
Receives data
  ↓
Displays wait times
  ↓
Sets 5-minute timer
  ↓
Automatically refreshes
```

---

## 🎨 Styling System

### Tailwind CSS Classes

**Common patterns you'll see:**

```tsx
// Layout
className="flex items-center gap-2"     // Flexbox with gap
className="grid grid-cols-2 gap-4"      // 2-column grid

// Spacing
className="p-4"         // Padding all sides
className="px-4 py-2"   // Padding horizontal & vertical
className="mb-4"        // Margin bottom

// Colors
className="bg-blue-600"       // Background color
className="text-white"        // Text color
className="border-gray-300"   // Border color

// Typography
className="text-xl font-bold"  // Size & weight
className="text-center"        // Alignment

// Responsive
className="grid-cols-1 sm:grid-cols-2"  // 1 col mobile, 2 on tablet+
```

### Custom Disney Colors

Defined in `tailwind.config.ts`:

```typescript
disney: {
  blue: "#0063B2",     // Official Disney blue
  purple: "#5B2E8C",   // EPCOT purple
  gold: "#F5A623",     // Disney gold
}
```

Use as: `className="bg-disney-blue"`

---

## 🔌 API Integration

### Queue-Times API

**Endpoint:**
```
https://queue-times.com/parks/{parkId}/queue_times.json
```

**Park IDs:**
- Magic Kingdom: `47`
- EPCOT: `48`
- Hollywood Studios: `49`
- Animal Kingdom: `50`

**Response format:**
```json
{
  "rides": [
    {
      "id": 123,
      "name": "Space Mountain",
      "wait_time": 35,
      "is_open": true,
      "last_updated": "2026-02-07T19:30:00Z"
    }
  ]
}
```

**Refresh strategy:**
- Fetch on component mount
- Auto-refresh every 5 minutes
- Show loading state while fetching
- Handle errors gracefully

---

## 📱 Mobile Optimization

### Responsive Breakpoints

```
sm:   640px   (Large phones, landscape)
md:   768px   (Tablets)
lg:   1024px  (Laptops)
xl:   1280px  (Desktops)
```

### Touch Optimization

- All buttons are minimum 44x44px (Apple's recommended tap target)
- No hover-only features (everything works with tap)
- Smooth scrolling on iOS (`-webkit-overflow-scrolling: touch`)
- No tap highlight flash (`-webkit-tap-highlight-color: transparent`)

### Performance

- Server-side rendering for fast first load
- Code splitting (each page loads only what it needs)
- Image optimization (Next.js handles this automatically)
- CSS purging (Tailwind removes unused styles)

---

## 🚀 Build & Deploy Process

### Local Development:
```bash
npm run dev          # Start dev server
```

### Production Build:
```bash
npm run build        # Create optimized build
npm run start        # Run production build locally
```

### Deploy to Vercel:
```bash
vercel               # Deploy to Vercel
```

Or connect GitHub repo and auto-deploy on every push!

---

## 📝 Common Tasks

### Add New Merch Item:

1. Open park's JSON file: `data/magic-kingdom-data.json`
2. Find `limitedEditionMerch` array
3. Add new object (copy the format)
4. Save file
5. Refresh browser

### Update Park Hours:

1. Open park's JSON file
2. Find `parkHours` section
3. Update `today` and `tomorrow`
4. Save file
5. Refresh browser

### Change Park Colors:

1. Open `app/page.tsx`
2. Find `parks` array
3. Change `color` value (e.g., `"bg-blue-600"` to `"bg-purple-600"`)
4. Also update in `app/parks/[slug]/page.tsx` in `parkInfo` object
5. Save files
6. Refresh browser

### Add New Component:

1. Create new file in `components/` folder
2. Example: `components/NewComponent.tsx`
3. Import in page: `import NewComponent from "@/components/NewComponent"`
4. Use it: `<NewComponent />`

---

## 🐛 Debugging

### Browser Console (F12):
- Shows JavaScript errors
- Network tab shows API requests
- React DevTools (install extension)

### Terminal:
- Shows build errors
- TypeScript errors
- Port conflicts

### Common Errors:

```bash
"Cannot find module"
→ Run: npm install

"Port 3000 is already in use"
→ Kill the process or use: npm run dev -- -p 3001

"Unexpected token"
→ Check for missing commas or quotes in JSON files

"Failed to fetch"
→ Check internet connection, Queue-Times API might be down
```

---

## 📚 Learning Resources

**This project:**
- Next.js (framework): https://nextjs.org/docs
- React (UI library): https://react.dev
- TypeScript (language): https://www.typescriptlang.org
- Tailwind (styling): https://tailwindcss.com

**Concepts used:**
- Server-side rendering (SSR)
- Client-side rendering (CSR)
- Dynamic routing
- API fetching
- Component composition
- State management

---

## 🎓 Code Examples

### Creating a New Component

```tsx
// components/MyComponent.tsx
export default function MyComponent() {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">Hello!</h2>
    </div>
  );
}
```

### Using the Component

```tsx
// app/page.tsx
import MyComponent from "@/components/MyComponent";

export default function Page() {
  return (
    <div>
      <MyComponent />
    </div>
  );
}
```

### Fetching Data

```tsx
"use client";  // Makes it a client component

import { useState, useEffect } from "react";

export default function DataComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://api.example.com/data")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return <div>{data ? data.name : "Loading..."}</div>;
}
```

---

## 🔐 Environment Variables (Future)

If you need API keys later:

1. Create `.env.local` file (automatically git-ignored)
2. Add: `NEXT_PUBLIC_API_KEY=your_key_here`
3. Use in code: `process.env.NEXT_PUBLIC_API_KEY`

**Note:** `NEXT_PUBLIC_` prefix makes it available in browser

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Stop server | `Ctrl + C` |
| Install dependencies | `npm install` |
| Build for production | `npm run build` |
| Run production build | `npm start` |
| Check for errors | `npm run lint` |

| File | Purpose |
|------|---------|
| `app/page.tsx` | Home page |
| `app/parks/[slug]/page.tsx` | Park pages |
| `data/*.json` | Merch & bucket data |
| `components/*.tsx` | Reusable UI pieces |

| URL | Shows |
|-----|-------|
| `http://localhost:3000` | Home page |
| `http://localhost:3000/parks/magic-kingdom` | Magic Kingdom page |
| `http://YOUR_IP:3000` | View on phone |

---

**This structure is designed to be:**
- ✅ Simple to understand
- ✅ Easy to modify
- ✅ Fast to load
- ✅ Scalable for future features

**Next steps:** See `QUICKSTART.md` to get it running!
