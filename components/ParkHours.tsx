interface ParkHoursProps {
  hours: {
    today: string;
    tomorrow: string;
  };
}

export default function ParkHours({ hours }: ParkHoursProps) {
  return (
    <div className="glass-card rounded-2xl shadow-xl overflow-hidden hover-glow transition-all duration-300">
      <div className="gradient-disney p-6 md:p-8">
        <h3 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <span className="text-3xl md:text-4xl">🕐</span>
          Park Hours
        </h3>
      </div>
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-2 gap-6 md:gap-8">
          <div className="text-center p-4 md:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <p className="text-sm md:text-base text-blue-600 font-semibold mb-2">Today</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">{hours.today}</p>
          </div>
          <div className="text-center p-4 md:p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
            <p className="text-sm md:text-base text-purple-600 font-semibold mb-2">Tomorrow</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">{hours.tomorrow}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
