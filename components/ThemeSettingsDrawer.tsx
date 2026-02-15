"use client";

import { useState, useEffect } from "react";

type BackgroundTheme = "classic" | "nighttime" | "blueprint" | "park-pulse";

type MagicCursor = "default" | "magic" | "mickey" | "wand" | "lightsaber";

type MagicEffects = "none" | "subtle" | "strong";

export default function ThemeSettingsDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>("park-pulse");
  const [magicCursor, setMagicCursor] = useState<MagicCursor>("magic");
  const [magicEffects, setMagicEffects] = useState<MagicEffects>("subtle");
  const [lowMotion, setLowMotion] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "afternoon" | "evening" | "night">("morning");

  // Update time of day based on current time
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 11) {
        setTimeOfDay("morning");
      } else if (hour >= 11 && hour < 17) {
        setTimeOfDay("afternoon");
      } else if (hour >= 17 && hour < 20) {
        setTimeOfDay("evening");
      } else {
        setTimeOfDay("night");
      }
    };

    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("goofy-trooper-theme-settings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setBackgroundTheme(settings.backgroundTheme || "park-pulse");
      setMagicCursor(settings.magicCursor || "magic");
      setMagicEffects(settings.magicEffects || "subtle");
      setLowMotion(settings.lowMotion || false);
    }

    // Check system preference for reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLowMotion(true);
    }
  }, []);

  // Apply theme to body
  useEffect(() => {
    // Remove all theme classes
    document.body.classList.remove(
      "theme-classic",
      "theme-nighttime",
      "theme-blueprint",
      "theme-park-pulse",
      "morning",
      "afternoon",
      "evening",
      "night",
      "cursor-default",
      "cursor-magic",
      "cursor-mickey",
      "cursor-wand",
      "cursor-lightsaber"
    );

    // Apply background theme
    document.body.classList.add(`theme-${backgroundTheme}`);

    // Apply time-of-day if park-pulse theme
    if (backgroundTheme === "park-pulse") {
      document.body.classList.add(timeOfDay);
    }

    // Apply cursor
    if (magicCursor !== "default") {
      document.body.classList.add(`cursor-${magicCursor}`);
    }

    // Apply low motion preference
    if (lowMotion) {
      document.body.classList.add("reduced-motion");
    } else {
      document.body.classList.remove("reduced-motion");
    }

    // Manage effects
    if (lowMotion || magicEffects === "none") {
      document.body.classList.add("no-effects");
    } else if (magicEffects === "strong") {
      document.body.classList.add("strong-effects");
    } else {
      document.body.classList.remove("strong-effects");
      document.body.classList.remove("no-effects");
    }
  }, [backgroundTheme, magicCursor, magicEffects, lowMotion, timeOfDay]);

  // Save preferences to localStorage
  const saveSettings = () => {
    const settings = {
      backgroundTheme,
      magicCursor,
      magicEffects,
      lowMotion,
    };
    localStorage.setItem("goofy-trooper-theme-settings", JSON.stringify(settings));
  };

  const handleBackgroundThemeChange = (newTheme: BackgroundTheme) => {
    setBackgroundTheme(newTheme);
    saveSettings();
  };

  const handleMagicCursorChange = (newCursor: MagicCursor) => {
    setMagicCursor(newCursor);
    saveSettings();
  };

  const handleMagicEffectsChange = (newEffects: MagicEffects) => {
    setMagicEffects(newEffects);
    saveSettings();
  };

  const toggleLowMotion = () => {
    setLowMotion(!lowMotion);
    saveSettings();
  };

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
        aria-label="Open theme settings"
        title="Theme settings"
      >
        <span className="text-xl" role="img" aria-hidden="true">⚙️</span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1001] transition-opacity duration-200"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full md:w-[400px] bg-white/95 backdrop-blur-xl shadow-2xl z-[1002]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Live preview</h2>
              <p className="text-sm text-gray-500 mt-1">Customize your experience</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Close settings"
            >
              <svg
                className="w-5 h-5 text-gray-600"
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
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Background Theme */}
            <section>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Background Theme
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => handleBackgroundThemeChange("park-pulse")}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 text-left
                    ${backgroundTheme === "park-pulse"
                      ? "border-indigo-500 bg-indigo-50 shadow-md"
                      : "border-gray-200 hover:border-indigo-300 bg-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-hidden="true">🎢</span>
                    <div>
                      <div className="font-semibold text-gray-800">Park Pulse</div>
                      <div className="text-sm text-gray-600">Dynamic time-based backgrounds</div>
                      {backgroundTheme === "park-pulse" && (
                        <div className="text-xs text-indigo-600 mt-1 capitalize">
                          Current: {timeOfDay}
                        </div>
                      )}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleBackgroundThemeChange("classic")}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 text-left
                    ${backgroundTheme === "classic"
                      ? "border-amber-500 bg-amber-50 shadow-md"
                      : "border-gray-200 hover:border-amber-300 bg-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-hidden="true">🎨</span>
                    <div>
                      <div className="font-semibold text-gray-800">Classic</div>
                      <div className="text-sm text-gray-600">Clean white with gold accents</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleBackgroundThemeChange("nighttime")}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 text-left
                    ${backgroundTheme === "nighttime"
                      ? "border-purple-500 bg-purple-50 shadow-md"
                      : "border-gray-200 hover:border-purple-300 bg-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-hidden="true">🌙</span>
                    <div>
                      <div className="font-semibold text-gray-800">Nighttime</div>
                      <div className="text-sm text-gray-600">Dark theme with purple accents</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleBackgroundThemeChange("blueprint")}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 text-left
                    ${backgroundTheme === "blueprint"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 bg-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-hidden="true">🗺️</span>
                    <div>
                      <div className="font-semibold text-gray-800">Blueprint</div>
                      <div className="text-sm text-gray-600">Park map blueprint style</div>
                    </div>
                  </div>
                </button>
              </div>
            </section>

            {/* Magic Cursor */}
            <section>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Magic Cursor
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => handleMagicCursorChange("default")}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 text-left
                    ${magicCursor === "default"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 bg-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-hidden="true">👆</span>
                    <div>
                      <div className="font-semibold text-gray-800">Default</div>
                      <div className="text-sm text-gray-600">Standard system cursor</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleMagicCursorChange("magic")}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 text-left
                    ${magicCursor === "magic"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 bg-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-hidden="true">🔮</span>
                    <div>
                      <div className="font-semibold text-gray-800">Magic Circle</div>
                      <div className="text-sm text-gray-600">Subtle magic cursor</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleMagicCursorChange("mickey")}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 text-left
                    ${magicCursor === "mickey"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 bg-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-hidden="true">🐭</span>
                    <div>
                      <div className="font-semibold text-gray-800">Mickey Hand</div>
                      <div className="text-sm text-gray-600">Classic Disney cursor</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleMagicCursorChange("wand")}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 text-left
                    ${magicCursor === "wand"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 bg-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-hidden="true">🪄</span>
                    <div>
                      <div className="font-semibold text-gray-800">Princess Wand</div>
                      <div className="text-sm text-gray-600">Sparkle cursor</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleMagicCursorChange("lightsaber")}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 text-left
                    ${magicCursor === "lightsaber"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 bg-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-hidden="true">⚔️</span>
                    <div>
                      <div className="font-semibold text-gray-800">Lightsaber</div>
                      <div className="text-sm text-gray-600">Star Wars cursor</div>
                    </div>
                  </div>
                </button>
              </div>
            </section>

            {/* Magic Effects */}
            <section>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Magic Effects
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => handleMagicEffectsChange("none")}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 text-left
                    ${magicEffects === "none"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 bg-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-hidden="true">🚫</span>
                    <div>
                      <div className="font-semibold text-gray-800">None</div>
                      <div className="text-sm text-gray-600">Disable all effects</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleMagicEffectsChange("subtle")}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 text-left
                    ${magicEffects === "subtle"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 bg-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-hidden="true">✨</span>
                    <div>
                      <div className="font-semibold text-gray-800">Subtle</div>
                      <div className="text-sm text-gray-600">Gentle animations and sparkles</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleMagicEffectsChange("strong")}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 text-left
                    ${magicEffects === "strong"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 bg-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-hidden="true">💫</span>
                    <div>
                      <div className="font-semibold text-gray-800">Strong</div>
                      <div className="text-sm text-gray-600">Full magical effects</div>
                    </div>
                  </div>
                </button>
              </div>
            </section>

            {/* Low Motion Toggle */}
            <section>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Accessibility
              </h3>
              <button
                onClick={toggleLowMotion}
                className={`
                  w-full p-4 rounded-xl border-2 transition-all duration-200 text-left
                  ${lowMotion
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-200 hover:border-green-300 bg-white"
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-hidden="true">🐢</span>
                    <div>
                      <div className="font-semibold text-gray-800">Low Motion</div>
                      <div className="text-sm text-gray-600">Reduce intense animations</div>
                    </div>
                  </div>
                  {lowMotion && (
                    <span className="text-green-600 font-semibold text-sm">On</span>
                  )}
                </div>
              </button>
            </section>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-500 text-center">
              Changes saved automatically
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
