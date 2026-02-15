"use client";

import { useState, useEffect } from "react";

interface Ride {
  id: number;
  name: string;
  wait_time: number | null;
  is_open: boolean;
  last_updated: string;
}

interface WaitTimesWithSortProps {
  queueTimesId: number;
}

export default function WaitTimesWithSort({ queueTimesId }: WaitTimesWithSortProps) {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [sortBy, setSortBy] = useState<"lowest" | "highest">("lowest");

  useEffect(() => {
    async function fetchWaitTimes() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://queue-times.com/parks/${queueTimesId}/queue_times.json`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch wait times");
        }

        const data = await response.json();

        // Filter only open rides with wait times
        const openRides = data.rides.filter(
          (ride: Ride) => ride.is_open && ride.wait_time !== null
        );

        setRides(openRides);
        setLastUpdate(new Date().toLocaleTimeString());
      } catch (err) {
        setError("Unable to load wait times. Please try again later.");
        console.error("Wait times error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWaitTimes();

    // Refresh every 5 minutes
    const interval = setInterval(fetchWaitTimes, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [queueTimesId]);

  // Sort rides based on selected option
  const sortedRides = [...rides].sort((a, b) => {
    if (sortBy === "lowest") {
      return (a.wait_time || 0) - (b.wait_time || 0);
    } else {
      return (b.wait_time || 0) - (a.wait_time || 0);
    }
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-gray-600 mt-4 text-base md:text-lg">Loading wait times...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card-light bg-yellow-50/80 border-l-4 border-yellow-400 p-6 rounded-xl hover-glow transition-all duration-300">
        <p className="text-yellow-800 font-medium">{error}</p>
        <p className="text-sm text-yellow-600 mt-2">
          💡 Tip: Wait times may be unavailable when the park is closed
        </p>
      </div>
    );
  }

  if (rides.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        <p className="text-base md:text-lg">No rides currently operating.</p>
        <p className="text-sm md:text-base mt-2">Check back during park hours!</p>
      </div>
    );
  }

  return (
    <div>
      {/* Last Updated & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 glass-card-light px-4 py-2 rounded-full">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Last updated: {lastUpdate} • Auto-refreshes every 5 min
        </div>

        {/* Sort Toggle */}
        <div className="flex items-center gap-2 glass-card-light rounded-full p-1">
          <button
            onClick={() => setSortBy("lowest")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              sortBy === "lowest"
                ? "bg-white text-green-600 shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            ⚡ Lowest Wait
          </button>
          <button
            onClick={() => setSortBy("highest")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              sortBy === "highest"
                ? "bg-white text-red-600 shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            🎢 Highest Wait
          </button>
        </div>
      </div>

      {/* Wait Time Cards */}
      <div className="space-y-4">
        {sortedRides.map((ride, index) => (
          <div
            key={ride.id}
            id={`ride-${ride.id}`}
            className="glass-card flex items-center justify-between p-4 md:p-5 rounded-xl hover-glow hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-3">
                {sortBy === "lowest" && index === 0 && (
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-gradient-to-r from-green-500 to-green-400 text-white text-xs font-bold rounded-full shadow-md twinkle">
                    1
                  </span>
                )}
                <h3 className="font-semibold text-gray-900 text-base md:text-lg">{ride.name}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {ride.wait_time !== null && (
                <div
                  className={`px-5 py-2.5 rounded-full font-bold text-white text-base md:text-lg shadow-md transition-transform hover:scale-105 active:scale-95 ${
                    ride.wait_time < 20
                      ? "bg-gradient-to-r from-green-500 to-green-400"
                      : ride.wait_time < 45
                      ? "bg-gradient-to-r from-amber-500 to-amber-400"
                      : "bg-gradient-to-r from-red-500 to-red-400"
                  }`}
                >
                  {ride.wait_time} min
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
