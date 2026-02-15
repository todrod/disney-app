"use client";

import { useState, useEffect } from "react";

interface PopcornBucket {
  id: string;
  name: string;
  location: string;
  price: string;
  available: boolean;
  limitedEdition: boolean;
  notes: string;
  stockStatus?: "in-stock" | "low-stock" | "sold-out" | "just-dropped";
}

interface PopcornBucketListWithBadgesProps {
  items: PopcornBucket[];
  liveData?: boolean;
  lastUpdated?: string; // ISO 8601 date string
}

function getStockBadge(status?: string, available?: boolean) {
  // Override with available status if stockStatus not provided
  if (!status && available === false) {
    status = "sold-out";
  } else if (!status && available === true) {
    status = "in-stock";
  }

  switch (status) {
    case "just-dropped":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-400 text-white text-xs font-bold rounded-full shadow-md animate-pulse hover:scale-105 transition-transform">
          <span className="text-sm">🚀</span>
          <span>JUST DROPPED</span>
        </span>
      );
    case "in-stock":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-400 text-white text-xs font-bold rounded-full shadow-md hover:scale-105 transition-transform">
          <span className="text-sm">🟢</span>
          <span>IN STOCK</span>
        </span>
      );
    case "low-stock":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-400 text-white text-xs font-bold rounded-full shadow-md hover:scale-105 transition-transform">
          <span className="text-sm">🟡</span>
          <span>LOW STOCK</span>
        </span>
      );
    case "sold-out":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold rounded-full shadow-md">
          <span className="text-sm">🔴</span>
          <span>SOLD OUT</span>
        </span>
      );
    default:
      return null;
  }
}

export default function PopcornBucketListWithBadges({
  items,
  liveData = false,
  lastUpdated: propLastUpdated,
}: PopcornBucketListWithBadgesProps) {
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [daysAgo, setDaysAgo] = useState<number>(0);

  useEffect(() => {
    if (liveData) {
      setLastUpdate(new Date().toLocaleTimeString());
    }
  }, [liveData]);

  useEffect(() => {
    // Calculate days ago from the provided lastUpdated date
    if (propLastUpdated) {
      const lastUpdateDate = new Date(propLastUpdated);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - lastUpdateDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      setDaysAgo(diffDays);

      // Also set the formatted time
      setLastUpdate(lastUpdateDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }));
    } else if (liveData) {
      // If live data is enabled but no lastUpdated provided, use current time
      setLastUpdate(new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }));
      setDaysAgo(0);
    }
  }, [propLastUpdated, liveData]);

  // Sort: available first, then limited edition
  const sortedItems = [...items].sort((a, b) => {
    if (a.available !== b.available) return a.available ? -1 : 1;
    if (a.limitedEdition !== b.limitedEdition) return a.limitedEdition ? -1 : 1;
    return 0;
  });

  if (!items || items.length === 0) {
    return (
      <p className="text-gray-600 text-center py-4">
        No popcorn buckets currently available.
      </p>
    );
  }

  return (
    <div className="space-y-5" id="popcorn-buckets">
      {liveData && lastUpdate && (
        <div className="flex items-center justify-center gap-3 text-sm text-gray-600 mb-6 glass-card-light rounded-lg px-4 py-3 border border-blue-200">
          <div className="relative">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="font-semibold text-gray-800">Updated:</span>
            <span className="font-medium text-blue-600">{lastUpdate}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">{daysAgo === 0 ? "Today" : `${daysAgo} day${daysAgo !== 1 ? "s" : ""} ago`}</span>
            <span className="text-gray-400">•</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Live
            </span>
          </div>
        </div>
      )}

      {sortedItems.map((item) => {
        const isSoldOut = !item.available || item.stockStatus === "sold-out";

        return (
          <div
            key={item.id}
            className={`glass-card rounded-xl p-5 md:p-6 transition-all duration-300 hover-glow ${
              isSoldOut
                ? "opacity-70 grayscale"
                : "hover:-translate-y-0.5 hover:scale-[1.01] border-green-300"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={`font-bold text-gray-900 flex items-center gap-2 text-lg md:text-xl ${isSoldOut ? "line-through opacity-70" : ""}`}>
                    <span className="text-3xl md:text-4xl twinkle">🍿</span>
                    {item.name}
                    {item.limitedEdition && <span className="text-yellow-500 text-2xl twinkle">⭐</span>}
                  </h3>
                  {getStockBadge(item.stockStatus, item.available)}
                </div>

                <div className="mt-3 space-y-2">
                  <p className="text-gray-700 text-base md:text-lg flex items-center gap-2">
                    <span className="font-semibold text-gray-800">📍</span>
                    <span className={isSoldOut ? "opacity-70" : ""}>{item.location}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    {item.limitedEdition && (
                      <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-amber-400 text-white text-sm font-bold rounded-full shadow-md hover:scale-105 transition-transform">
                        LIMITED EDITION
                      </span>
                    )}
                  </div>

                  {item.notes && (
                    <p className={`text-gray-600 italic text-sm md:text-base glass-card-light p-3 rounded-lg border border-gray-200 ${isSoldOut ? "opacity-60" : ""}`}>
                      💡 {item.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className={`font-bold text-2xl md:text-3xl ${isSoldOut ? "text-gray-500 opacity-70" : "text-gray-900"}`}>
                  {item.price}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
