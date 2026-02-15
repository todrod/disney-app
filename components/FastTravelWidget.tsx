"use client";

import Link from "next/link";

export default function FastTravelWidget() {
  return (
    <Link
      href="/fast-travel"
      className="glass-card rounded-xl p-4 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200 group cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
          ✈️
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
            Fast Travel
          </div>
          <div className="text-xs text-gray-500">
            Find the quickest route between Disney areas
          </div>
        </div>
        <svg
          className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}
