"use client";

import { useState, useEffect } from "react";

interface Ride {
  id: number;
  name: string;
  wait_time: number | null;
  is_open: boolean;
  last_updated: string;
}

interface WaitTimesProps {
  queueTimesId: number;
}

export default function WaitTimes({ queueTimesId }: WaitTimesProps) {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");

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
        
        // Filter and sort rides: show only open rides, sort by wait time
        const openRides = data.rides
          .filter((ride: Ride) => ride.is_open && ride.wait_time !== null)
          .sort((a: Ride, b: Ride) => (b.wait_time || 0) - (a.wait_time || 0));
        
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
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-xl">
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
      <div className="text-sm text-gray-500 mb-6 flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        Last updated: {lastUpdate} • Auto-refreshes every 5 min
      </div>

      <div className="space-y-4">
        {rides.map((ride) => (
          <div
            key={ride.id}
            className="flex items-center justify-between p-4 md:p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200"
          >
            <div className="flex-1 pr-4">
              <h3 className="font-semibold text-gray-900 text-base md:text-lg">{ride.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              {ride.wait_time !== null && (
                <div
                  className={`px-5 py-2.5 rounded-full font-bold text-white text-base md:text-lg shadow-md ${
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
