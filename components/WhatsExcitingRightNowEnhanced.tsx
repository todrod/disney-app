import WeatherWidget from "@/components/WeatherWidget";

interface ParkHours {
  today: string;
  tomorrow: string;
}

interface ParadeFireworks {
  name: string;
  time: string;
  location: string;
  type: "parade" | "fireworks";
}

interface WeatherStatus {
  isRainy: boolean;
  indoorRecommended: boolean;
  indoorAttractions: string[];
}

interface WhatsExcitingRightNowEnhancedProps {
  content: string;
  parkHours?: ParkHours;
  nextEvent?: ParadeFireworks;
  weatherStatus?: WeatherStatus;
  parkName?: string;
}

export default function WhatsExcitingRightNowEnhanced({
  content,
  parkHours,
  nextEvent,
  weatherStatus,
  parkName,
}: WhatsExcitingRightNowEnhancedProps) {
  // Parse park hours to extract opening/closing times
  const parseHours = (hoursString: string) => {
    const match = hoursString.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))\s*-\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
    if (match) {
      return { open: match[1], close: match[2] };
    }
    return null;
  };

  const todayHours = parkHours ? parseHours(parkHours.today) : null;

  return (
    <section className="glass-card rounded-2xl shadow-xl overflow-hidden hover-glow border-magic" id="whats-exciting">
      <div className="gradient-magic p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <span className="text-3xl md:text-4xl twinkle">✨</span>
          What's Exciting Right Now
        </h2>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Weather Widget */}
        <WeatherWidget parkName={parkName} />

        {/* Park Hours Widget */}
        {todayHours && (
          <div className="glass-card-light bg-gradient-to-r from-blue-50/80 to-blue-100/80 rounded-xl p-5 border border-blue-200 hover-glow">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl twinkle">🕐</span>
              <h3 className="font-bold text-gray-800 text-lg">Today's Park Hours</h3>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-gray-600 font-medium">Opens</p>
                <p className="text-xl font-bold text-blue-600">{todayHours.open}</p>
              </div>
              <div className="text-3xl text-gray-400">→</div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Closes</p>
                <p className="text-xl font-bold text-blue-600">{todayHours.close}</p>
              </div>
            </div>
          </div>
        )}

        {/* Next Event Widget */}
        {nextEvent && (
          <div
            className={`glass-card-light rounded-xl p-5 hover-glow ${
              nextEvent.type === "parade"
                ? "bg-gradient-to-r from-amber-50/80 to-orange-50/80 border-amber-200"
                : "bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border-indigo-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl twinkle">{nextEvent.type === "parade" ? "🎭" : "🎆"}</span>
              <h3 className="font-bold text-gray-800 text-lg">
                Next {nextEvent.type === "parade" ? "Parade" : "Fireworks"}
              </h3>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600 font-medium">Show</p>
                <p className="text-lg font-bold text-gray-900">{nextEvent.name}</p>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Time</p>
                  <p className="text-xl font-bold text-indigo-600">{nextEvent.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Location</p>
                  <p className="text-lg font-semibold text-gray-700">{nextEvent.location}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rainy Day Widget */}
        {weatherStatus?.isRainy && (
          <div className="glass-card-light bg-gradient-to-r from-blue-100/80 to-cyan-100/80 rounded-xl p-5 border border-blue-300 hover-glow">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl twinkle">🌧️</span>
              <h3 className="font-bold text-gray-800 text-lg">Rainy Day Mode</h3>
            </div>
            <p className="text-gray-700 mb-3">Indoor attractions recommended! Here are some great options:</p>
            <ul className="space-y-2">
              {weatherStatus.indoorAttractions.slice(0, 3).map((attraction, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700">
                  <span className="text-blue-500">•</span>
                  <span className="font-medium">{attraction}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Content */}
        <div className="glass-card-light bg-gray-50/80 rounded-xl p-5 border border-gray-200 hover-glow">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            {content}
          </p>
        </div>
      </div>
    </section>
  );
}
