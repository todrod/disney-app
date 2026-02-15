"use client";

import { useState, useEffect } from "react";

type Theme =
  | "default"
  | "park-pulse"
  | "blueprint";

type Cursor =
  | "default"
  | "magic"
  | "mickey"
  | "wand"
  | "lightsaber";

type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

interface ThemeSettingsProps {
  children?: React.ReactNode;
}

export default function ThemeSettings({ children }: ThemeSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("park-pulse");
  const [cursor, setCursor] = useState<Cursor>("magic");
  const [sparklesEnabled, setSparklesEnabled] = useState(true);
  const [hoverEffectsEnabled, setHoverEffectsEnabled] = useState(true);
  const [currentTimeOfDay, setCurrentTimeOfDay] = useState<TimeOfDay>("morning");

  // Apply theme class to body
  useEffect(() => {
    // Remove all theme classes
    document.body.classList.remove(
      "theme-default",
      "theme-park-pulse",
      "theme-blueprint",
      "morning",
      "afternoon",
      "evening",
      "night"
    );

    // Remove all cursor classes
    document.body.classList.remove(
      "cursor-default",
      "cursor-magic",
      "cursor-mickey",
      "cursor-wand",
      "cursor-lightsaber"
    );

    // Apply selected theme
    document.body.classList.add(`theme-${theme}`);

    // Apply time-of-day if park-pulse theme
    if (theme === "park-pulse") {
      document.body.classList.add(currentTimeOfDay);
    }

    // Apply cursor
    if (cursor !== "default") {
      document.body.classList.add(`cursor-${cursor}`);
    }

    // Manage sparkles
    let sparkleContainer = document.getElementById("sparkle-container");
    if (sparklesEnabled && !sparkleContainer) {
      sparkleContainer = document.createElement("div");
      sparkleContainer.id = "sparkle-container";
      sparkleContainer.className = "sparkle-container";
      sparkleContainer.innerHTML = `
        <div class="sparkle">✨</div>
        <div class="sparkle">⭐</div>
        <div class="sparkle">✨</div>
        <div class="sparkle">⭐</div>
        <div class="sparkle">✨</div>
        <div class="sparkle">⭐</div>
      `;
      document.body.appendChild(sparkleContainer);
    } else if (!sparklesEnabled && sparkleContainer) {
      sparkleContainer.remove();
    }

    // Manage hover effects
    const glassCards = document.querySelectorAll(".glass-card, .glass-card-light");
    glassCards.forEach((card) => {
      if (hoverEffectsEnabled) {
        card.classList.add("hover-glow");
      } else {
        card.classList.remove("hover-glow");
      }
    });
  }, [theme, cursor, sparklesEnabled, hoverEffectsEnabled, currentTimeOfDay]);

  // Update time of day based on current time
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 11) {
        setCurrentTimeOfDay("morning");
      } else if (hour >= 11 && hour < 17) {
        setCurrentTimeOfDay("afternoon");
      } else if (hour >= 17 && hour < 20) {
        setCurrentTimeOfDay("evening");
      } else {
        setCurrentTimeOfDay("night");
      }
    };

    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [theme]);

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("disney-theme-settings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setTheme(settings.theme || "park-pulse");
      setCursor(settings.cursor || "magic");
      setSparklesEnabled(settings.sparklesEnabled ?? true);
      setHoverEffectsEnabled(settings.hoverEffectsEnabled ?? true);
    }
  }, []);

  // Save preferences to localStorage
  const saveSettings = () => {
    const settings = {
      theme,
      cursor,
      sparklesEnabled,
      hoverEffectsEnabled,
    };
    localStorage.setItem("disney-theme-settings", JSON.stringify(settings));
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    saveSettings();
  };

  const handleCursorChange = (newCursor: Cursor) => {
    setCursor(newCursor);
    saveSettings();
  };

  const toggleSparkles = () => {
    setSparklesEnabled(!sparklesEnabled);
    saveSettings();
  };

  const toggleHoverEffects = () => {
    setHoverEffectsEnabled(!hoverEffectsEnabled);
    saveSettings();
  };

  const getTimeOfDayLabel = () => {
    switch (currentTimeOfDay) {
      case "morning":
        return "🌅 Morning (Soft blues & pinks)";
      case "afternoon":
        return "☀️ Day (Vibrant purples)";
      case "evening":
        return "🌆 Evening (Warm oranges & purples)";
      case "night":
        return "🌙 Night (Deep blues)";
    }
  };

  return (
    <>
      {/* Settings Button */}
      <button
        className="settings-button"
        onClick={() => setIsOpen(true)}
        aria-label="Theme Settings"
      >
        ⚙️
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="settings-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Settings Panel */}
      <div className={`settings-panel ${isOpen ? "open" : ""}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-text">
              ✨ Theme Settings
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 rounded-full bg-surface2 hover:bg-surface3 flex items-center justify-center transition-colors"
              aria-label="Close settings"
            >
              ✕
            </button>
          </div>

          {/* Theme Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-text mb-4">
              🎨 Background Theme
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-border hover:border-accent cursor-pointer transition-all">
                <input
                  type="radio"
                  name="theme"
                  value="park-pulse"
                  checked={theme === "park-pulse"}
                  onChange={() => handleThemeChange("park-pulse")}
                  className="w-5 h-5 text-accent"
                />
                <div className="flex-1">
                  <div className="font-semibold text-text">
                    The Park Pulse
                  </div>
                  <div className="text-sm text-text-muted">
                    Time-based dynamic backgrounds
                  </div>
                  {theme === "park-pulse" && (
                    <div className="text-xs text-accent2 mt-1">
                      {getTimeOfDayLabel()}
                    </div>
                  )}
                </div>
                <span className="text-2xl">🎢</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-border hover:border-accent cursor-pointer transition-all">
                <input
                  type="radio"
                  name="theme"
                  value="blueprint"
                  checked={theme === "blueprint"}
                  onChange={() => handleThemeChange("blueprint")}
                  className="w-5 h-5 text-accent"
                />
                <div className="flex-1">
                  <div className="font-semibold text-text">
                    Blueprint Theme
                  </div>
                  <div className="text-sm text-text-muted">
                    Static park map blueprint style
                  </div>
                </div>
                <span className="text-2xl">🗺️</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-border hover:border-accent cursor-pointer transition-all">
                <input
                  type="radio"
                  name="theme"
                  value="default"
                  checked={theme === "default"}
                  onChange={() => handleThemeChange("default")}
                  className="w-5 h-5 text-accent"
                />
                <div className="flex-1">
                  <div className="font-semibold text-text">Classic</div>
                  <div className="text-sm text-text-muted">
                    Clean white background
                  </div>
                </div>
                <span className="text-2xl">📄</span>
              </label>
            </div>
          </div>

          {/* Cursor Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-text mb-4">
              👆 Magic Cursor
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-border hover:border-accent cursor-pointer transition-all">
                <input
                  type="radio"
                  name="cursor"
                  value="magic"
                  checked={cursor === "magic"}
                  onChange={() => handleCursorChange("magic")}
                  className="w-5 h-5 text-accent"
                />
                <div className="flex-1">
                  <div className="font-semibold text-text">Magic Circle</div>
                  <div className="text-sm text-text-muted">Subtle magic cursor</div>
                </div>
                <span className="text-xl">🔮</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-border hover:border-accent cursor-pointer transition-all">
                <input
                  type="radio"
                  name="cursor"
                  value="mickey"
                  checked={cursor === "mickey"}
                  onChange={() => handleCursorChange("mickey")}
                  className="w-5 h-5 text-accent"
                />
                <div className="flex-1">
                  <div className="font-semibold text-text">Mickey Hand</div>
                  <div className="text-sm text-text-muted">
                    Classic Disney cursor
                  </div>
                </div>
                <span className="text-xl">🐭</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-border hover:border-accent cursor-pointer transition-all">
                <input
                  type="radio"
                  name="cursor"
                  value="wand"
                  checked={cursor === "wand"}
                  onChange={() => handleCursorChange("wand")}
                  className="w-5 h-5 text-accent"
                />
                <div className="flex-1">
                  <div className="font-semibold text-text">
                    Princess Wand
                  </div>
                  <div className="text-sm text-text-muted">Sparkle cursor</div>
                </div>
                <span className="text-xl">🪄</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-border hover:border-accent cursor-pointer transition-all">
                <input
                  type="radio"
                  name="cursor"
                  value="lightsaber"
                  checked={cursor === "lightsaber"}
                  onChange={() => handleCursorChange("lightsaber")}
                  className="w-5 h-5 text-accent"
                />
                <div className="flex-1">
                  <div className="font-semibold text-text">Lightsaber</div>
                  <div className="text-sm text-text-muted">
                    Star Wars cursor
                  </div>
                </div>
                <span className="text-xl">⚔️</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-border hover:border-accent cursor-pointer transition-all">
                <input
                  type="radio"
                  name="cursor"
                  value="default"
                  checked={cursor === "default"}
                  onChange={() => handleCursorChange("default")}
                  className="w-5 h-5 text-accent"
                />
                <div className="flex-1">
                  <div className="font-semibold text-text">Default</div>
                  <div className="text-sm text-text-muted">System cursor</div>
                </div>
                <span className="text-xl">👆</span>
              </label>
            </div>
          </div>

          {/* Effects Toggles */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-text mb-4">
              ✨ Magic Effects
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 rounded-xl border-2 border-border hover:border-accent cursor-pointer transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-xl">✨</span>
                  <div>
                    <div className="font-semibold text-text">
                      Sparkle Particles
                    </div>
                    <div className="text-sm text-text-muted">
                      Floating sparkles across screen
                    </div>
                  </div>
                </div>
                <button
                  onClick={toggleSparkles}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    sparklesEnabled ? "bg-accent" : "bg-surface3"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-text transition-transform ${
                      sparklesEnabled ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border-2 border-border hover:border-accent cursor-pointer transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-xl">💫</span>
                  <div>
                    <div className="font-semibold text-text">
                      Hover Effects
                    </div>
                    <div className="text-sm text-text-muted">
                      Magical glow on hover
                    </div>
                  </div>
                </div>
                <button
                  onClick={toggleHoverEffects}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    hoverEffectsEnabled ? "bg-accent" : "bg-surface3"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-text transition-transform ${
                      hoverEffectsEnabled ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              handleThemeChange("park-pulse");
              handleCursorChange("magic");
              setSparklesEnabled(true);
              setHoverEffectsEnabled(true);
              saveSettings();
            }}
            className="w-full py-3 px-4 bg-surface2 hover:bg-surface3 rounded-xl text-text font-semibold transition-colors"
          >
            Reset to Default
          </button>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-text-muted">
              Settings saved automatically
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
