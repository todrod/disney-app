"use client";

import { useState, useEffect } from "react";

interface VirtualQueue {
  id: string;
  name: string;
  park: string;
  dropTime: "7:00 AM" | "1:00 PM";
  isActive?: boolean;
}

interface VirtualQueueRemindersProps {
  currentPark?: string;
}

export default function VirtualQueueReminders({ currentPark }: VirtualQueueRemindersProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alerts, setAlerts] = useState<{ [key: string]: string }>({});

  // Virtual queue data - can be expanded
  const virtualQueues: VirtualQueue[] = [
    {
      id: "tron",
      name: "TRON Lightcycle / Run",
      park: "Magic Kingdom",
      dropTime: "7:00 AM",
    },
    {
      id: "gotg",
      name: "Guardians of the Galaxy: Cosmic Rewind",
      park: "EPCOT",
      dropTime: "1:00 PM",
    },
  ];

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Check for drop alerts
  useEffect(() => {
    const checkAlerts = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      const newAlerts: { [key: string]: string } = {};

      virtualQueues.forEach((queue) => {
        // Parse drop time
        const [dropHourStr, dropMinutesStr] = queue.dropTime.split(":");
        const [dropMinutes, dropPeriod] = dropMinutesStr.split(" ");
        let dropHour = parseInt(dropHourStr);

        // Convert to 24-hour format
        if (dropPeriod === "PM" && dropHour !== 12) {
          dropHour += 12;
        } else if (dropPeriod === "AM" && dropHour === 12) {
          dropHour = 0;
        }

        const dropMinutesNum = parseInt(dropMinutes);

        // Calculate time until drop
        const timeUntilDrop =
          (dropHour * 60 + dropMinutesNum) - (currentHours * 60 + currentMinutes);

        // Alert within 30 minutes of drop (including past drops)
        if (timeUntilDrop >= -30 && timeUntilDrop <= 30) {
          if (timeUntilDrop > 0) {
            newAlerts[queue.id] = `DROP IN ${timeUntilDrop} MIN`;
          } else if (timeUntilDrop === 0) {
            newAlerts[queue.id] = "DROP NOW!";
          } else {
            newAlerts[queue.id] = "DROPPED";
          }
        }
      });

      setAlerts(newAlerts);
    };

    checkAlerts();

    // Check every minute
    const alertTimer = setInterval(checkAlerts, 60000);
    return () => clearInterval(alertTimer);
  }, []);

  // Filter queues by current park if specified
  const relevantQueues = currentPark
    ? virtualQueues.filter((q) => q.park === currentPark)
    : virtualQueues;

  // Don't show section if no relevant queues
  if (relevantQueues.length === 0) {
    return null;
  }

  // Get current date for display
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="glass-card rounded-2xl shadow-xl overflow-hidden hover-glow border-magic" id="virtual-queues">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-500 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl md:text-4xl">🔔</span>
            Virtual Queue Reminders
          </h2>
          {Object.keys(alerts).length > 0 && (
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full animate-pulse shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              ACTIVE ALERT
            </span>
          )}
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Alert Banner */}
        {Object.keys(alerts).length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-5 mb-6 animate-pulse">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🚨</span>
              <div>
                <p className="font-bold text-red-700 text-lg">DROP ALERT!</p>
                <p className="text-red-600">
                  {Object.entries(alerts).map(([id, alert]) => {
                    const queue = virtualQueues.find((q) => q.id === id);
                    return (
                      <span key={id} className="block">
                        {queue?.name}: <strong>{alert}</strong>
                      </span>
                    );
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Virtual Queue Cards */}
        <div className="space-y-4">
          {relevantQueues.map((queue) => {
            const alert = alerts[queue.id];
            return (
              <div
                key={queue.id}
                className={`glass-card-light rounded-xl p-5 border-2 transition-all duration-300 ${
                  alert
                    ? "border-orange-400 bg-orange-50/50"
                    : "border-gray-200 bg-gray-50/50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-lg md:text-xl">
                        {queue.name}
                      </h3>
                      {alert && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-md animate-pulse">
                          🔔 {alert}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 space-y-2">
                      <p className="text-gray-700 text-base flex items-center gap-2">
                        <span className="font-semibold text-gray-800">📍</span>
                        <span>{queue.park}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-400 text-white text-xs font-bold rounded-full shadow-md">
                          <span className="text-sm">⏰</span>
                          <span>DROP: {queue.dropTime}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-400 text-white text-xs font-bold rounded-full shadow-md">
                          <span className="text-sm">📅</span>
                          <span>Daily</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="glass-card-light bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-xl p-5 border border-blue-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-semibold text-gray-800 mb-1">How Virtual Queues Work</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Join via the Disney app at the designated drop time</li>
                <li>• Boarding groups are limited and fill quickly</li>
                <li>• Return during your assigned time window to ride</li>
                <li>• Check 5-10 minutes before drop to ensure app is ready</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Date Display */}
        <p className="text-center text-sm text-gray-500">
          Today is {formattedDate} • Alerts update automatically
        </p>
      </div>
    </section>
  );
}
