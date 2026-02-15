"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SearchResult {
  id: string;
  type: "Attraction" | "Food" | "Merch";
  name: string;
  park: string;
  slug: string;
}

// Search result data
const searchIndex: SearchResult[] = [
  // Attractions
  { id: "mk-1", type: "Attraction", name: "Space Mountain", park: "Magic Kingdom", slug: "magic-kingdom" },
  { id: "mk-2", type: "Attraction", name: "Seven Dwarfs Mine Train", park: "Magic Kingdom", slug: "magic-kingdom" },
  { id: "mk-3", type: "Attraction", name: "Pirates of the Caribbean", park: "Magic Kingdom", slug: "magic-kingdom" },
  { id: "mk-4", type: "Attraction", name: "Haunted Mansion", park: "Magic Kingdom", slug: "magic-kingdom" },
  { id: "ep-1", type: "Attraction", name: "Frozen Ever After", park: "EPCOT", slug: "epcot" },
  { id: "ep-2", type: "Attraction", name: "Soarin'", park: "EPCOT", slug: "epcot" },
  { id: "ep-3", type: "Attraction", name: "Test Track", park: "EPCOT", slug: "epcot" },
  { id: "hs-1", type: "Attraction", name: "Star Wars: Rise of the Resistance", park: "Hollywood Studios", slug: "hollywood-studios" },
  { id: "hs-2", type: "Attraction", name: "TRON Lightcycle/Run", park: "Magic Kingdom", slug: "magic-kingdom" },
  { id: "ak-1", type: "Attraction", name: "Avatar Flight of Passage", park: "Animal Kingdom", slug: "animal-kingdom" },
  { id: "ak-2", type: "Attraction", name: "Expedition Everest", park: "Animal Kingdom", slug: "animal-kingdom" },

  // Food
  { id: "mk-f1", type: "Food", name: "Dole Whip", park: "Magic Kingdom", slug: "magic-kingdom" },
  { id: "mk-f2", type: "Food", name: "Churro", park: "All Parks", slug: "magic-kingdom" },
  { id: "mk-f3", type: "Food", name: "Cinderella's Royal Table", park: "Magic Kingdom", slug: "magic-kingdom" },
  { id: "ep-f1", type: "Food", name: "Les Halles Boulangerie-Patisserie", park: "EPCOT", slug: "epcot" },
  { id: "ep-f2", type: "Food", name: "Space 220", park: "EPCOT", slug: "epcot" },
  { id: "hs-f1", type: "Food", name: "Docking Bay 7", park: "Hollywood Studios", slug: "hollywood-studios" },
  { id: "ak-f1", type: "Food", name: "Satu'li Canteen", park: "Animal Kingdom", slug: "animal-kingdom" },

  // Merch
  { id: "mk-m1", type: "Merch", name: "Mickey Ears", park: "All Parks", slug: "magic-kingdom" },
  { id: "mk-m2", type: "Merch", name: "Cinderella Castle Souvenir", park: "Magic Kingdom", slug: "magic-kingdom" },
  { id: "ep-m1", type: "Merch", name: "Figment Plush", park: "EPCOT", slug: "epcot" },
  { id: "hs-m1", type: "Merch", name: "Lightsaber", park: "Hollywood Studios", slug: "hollywood-studios" },
  { id: "ak-m1", type: "Merch", name: "Avatar Plush", park: "Animal Kingdom", slug: "animal-kingdom" },
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const filtered = searchIndex.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.park.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered.slice(0, 8));
    setIsOpen(true);
  }, [query]);

  const groupedResults = {
    Attractions: results.filter((r) => r.type === "Attraction"),
    Food: results.filter((r) => r.type === "Food"),
    Merch: results.filter((r) => r.type === "Merch"),
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Delay closing to allow click on results
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={handleBlur}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search attractions, shows, food, and merch"
          className="input-landio input-search pl-12 py-4 shadow-soft text-text placeholder:text-text-faint"
          aria-label="Search Disney attractions, food, and merch"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 card-landio card-landio-featured overflow-hidden z-50"
          role="listbox"
        >
          {Object.entries(groupedResults).map(([type, items]) =>
            items.length > 0 ? (
              <div key={type} className="border-b border-border last:border-b-0">
                <div className="px-4 py-2 bg-surface2 text-xs font-semibold text-text-muted uppercase tracking-wide">
                  {type}
                </div>
                {items.map((item) => (
                  <Link
                    key={item.id}
                    href={`/parks/${item.slug}`}
                    className="block px-4 py-3 hover:bg-surface2 transition-colors duration-150"
                    onClick={() => {
                      setQuery(item.name);
                      setIsOpen(false);
                    }}
                  >
                    <div className="font-medium text-text">{item.name}</div>
                    <div className="text-sm text-text-muted">{item.park}</div>
                  </Link>
                ))}
              </div>
            ) : null
          )}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 card-landio z-50 p-6 text-center">
          <div className="text-text-muted mb-2">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-text-muted">No results found.</p>
          <p className="text-text-faint text-sm mt-1">Try a different ride, show, or food name.</p>
        </div>
      )}
    </div>
  );
}
