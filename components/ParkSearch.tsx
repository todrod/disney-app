"use client";

import { useState } from "react";

interface ParkSearchProps {
  onFilter: (query: string) => void;
}

export default function ParkSearch({ onFilter }: ParkSearchProps) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onFilter(value);
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-400"
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
        onChange={handleChange}
        placeholder="Filter by ride, show, or dining name"
        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 text-gray-800 placeholder-gray-500 text-sm"
        aria-label="Filter park content"
      />
      {query && (
        <button
          onClick={() => {
            setQuery("");
            onFilter("");
          }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          aria-label="Clear filter"
        >
          <svg
            className="w-4 h-4 text-gray-400 hover:text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
