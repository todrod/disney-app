"use client";

import { useState, useEffect } from "react";

interface WeatherData {
  temperature: number;
  condition: "sunny" | "partly-cloudy" | "cloudy" | "rainy" | "stormy";
  humidity: number;
  rainChance: number;
  feelsLike: number;
}

interface WeatherWidgetProps {
  parkName?: string;
  onRainyDayTips?: () => void;
}

export default function WeatherWidget({ parkName, onRainyDayTips }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock weather data - In production, this would call a real weather API
  useEffect(() => {
    const fetchWeather = () => {
      // Simulate API delay
      setTimeout(() => {
        // Mock weather data for Orlando, FL (Disney World location)
        const mockWeather: WeatherData = {
          temperature: 75,
          condition: "partly-cloudy",
          humidity: 65,
          rainChance: 30,
          feelsLike: 78,
        };

        setWeather(mockWeather);
        setLoading(false);
      }, 500);
    };

    fetchWeather();

    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return "☀️";
      case "partly-cloudy":
        return "⛅";
      case "cloudy":
        return "🌥️";
      case "rainy":
        return "🌧️";
      case "stormy":
        return "⛈️";
      default:
        return "🌤️";
    }
  };

  const getWeatherEmoji = (condition: string) => {
    switch (condition) {
      case "sunny":
        return "😎";
      case "partly-cloudy":
        return "😊";
      case "cloudy":
        return "😐";
      case "rainy":
        return "☔";
      case "stormy":
        return "😰";
      default:
        return "🌡️";
    }
  };

  const getWeatherAdvice = (temp: number, rainChance: number) => {
    if (rainChance > 50) {
      return "Rain expected - bring umbrella & rain jacket!";
    } else if (temp >= 85) {
      return "Hot day - stay hydrated & seek shade";
    } else if (temp >= 70) {
      return "Perfect weather for outdoor fun!";
    } else if (temp >= 60) {
      return "Cool weather - light jacket recommended";
    } else {
      return "Chilly - dress warmly";
    }
  };

  const getWeatherBackground = (condition: string, rainChance: number) => {
    if (rainChance > 50) {
      return "bg-gradient-to-r from-blue-100/90 to-cyan-100/90 border-blue-300";
    } else if (condition === "sunny") {
      return "bg-gradient-to-r from-yellow-100/90 to-orange-100/90 border-yellow-300";
    } else if (condition === "partly-cloudy") {
      return "bg-gradient-to-r from-blue-50/90 to-gray-100/90 border-gray-300";
    } else {
      return "bg-gradient-to-r from-gray-100/90 to-slate-100/90 border-gray-300";
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp >= 85) return "text-red-600";
    if (temp >= 70) return "text-orange-600";
    if (temp >= 60) return "text-blue-600";
    return "text-indigo-600";
  };

  if (loading) {
    return (
      <div className="glass-card-light bg-gradient-to-r from-gray-50/80 to-gray-100/80 rounded-xl p-5 border border-gray-200 animate-pulse">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌡️</span>
          <p className="text-gray-600">Loading weather...</p>
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  const advice = getWeatherAdvice(weather.temperature, weather.rainChance);
  const backgroundClass = getWeatherBackground(weather.condition, weather.rainChance);

  return (
    <div className={`glass-card-light rounded-xl p-5 border hover-glow transition-all duration-300 ${backgroundClass}`}>
      <div className="flex items-start justify-between gap-4">
        {/* Temperature & Condition */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl twinkle">🌡️</span>
            <h3 className="font-bold text-gray-800 text-lg">Current Weather</h3>
          </div>

          <div className="flex items-center gap-4 mb-3">
            <span className="text-4xl">{getWeatherIcon(weather.condition)}</span>
            <div>
              <p className={`text-3xl md:text-4xl font-bold ${getTemperatureColor(weather.temperature)}`}>
                {weather.temperature}°F
              </p>
              <p className="text-sm text-gray-600">
                Feels like {weather.feelsLike}°F
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-700 font-medium mb-3 flex items-center gap-2">
            <span className="text-lg">{getWeatherEmoji(weather.condition)}</span>
            {advice}
          </p>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/60 rounded-full text-gray-700">
              💧 Humidity: {weather.humidity}%
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/60 rounded-full text-gray-700">
              🌧️ Rain Chance: {weather.rainChance}%
            </span>
          </div>
        </div>

        {/* Rainy Day Tips Button */}
        {weather.rainChance > 50 && (
          <button
            onClick={onRainyDayTips}
            className="flex-shrink-0 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex flex-col items-center gap-1"
          >
            <span className="text-2xl">☔</span>
            <span className="text-sm">Rainy Day Tips</span>
          </button>
        )}
      </div>
    </div>
  );
}
