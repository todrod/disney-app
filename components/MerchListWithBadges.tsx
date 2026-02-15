interface MerchItem {
  id: string;
  name: string;
  location: string;
  price: string;
  limitedEdition: boolean;
  notes: string;
  stockStatus?: "in-stock" | "low-stock" | "sold-out" | "just-dropped";
}

interface MerchListWithBadgesProps {
  items: MerchItem[];
}

function getStockBadge(status?: string) {
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

export default function MerchListWithBadges({ items }: MerchListWithBadgesProps) {
  if (!items || items.length === 0) {
    return (
      <p className="text-gray-600 text-center py-8 text-base md:text-lg">
        No limited edition merch currently available.
      </p>
    );
  }

  return (
    <div className="space-y-5" id="merch">
      {items.map((item) => {
        const isSoldOut = item.stockStatus === "sold-out";

        return (
          <div
            key={item.id}
            className={`glass-card rounded-xl p-5 md:p-6 transition-all duration-300 hover-glow ${
              isSoldOut
                ? "opacity-70 grayscale"
                : "hover:-translate-y-0.5 hover:scale-[1.01]"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={`font-bold text-gray-900 flex items-center gap-2 text-lg md:text-xl ${isSoldOut ? "line-through" : ""}`}>
                    {item.limitedEdition && <span className="text-yellow-500 text-2xl twinkle">⭐</span>}
                    {item.name}
                  </h3>
                  {getStockBadge(item.stockStatus)}
                </div>

                <div className="mt-3 space-y-2">
                  <p className="text-gray-700 text-base md:text-lg flex items-center gap-2">
                    <span className="font-semibold text-gray-800">📍 Location:</span>
                    <span>{item.location}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    {item.limitedEdition && (
                      <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-amber-400 text-white text-sm font-bold rounded-full shadow-md hover:scale-105 transition-transform">
                        LIMITED EDITION
                      </span>
                    )}
                  </div>

                  {item.notes && (
                    <p className="text-gray-600 italic text-sm md:text-base glass-card-light p-3 rounded-lg border border-amber-200">
                      💡 {item.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className={`font-bold text-2xl md:text-3xl ${isSoldOut ? "text-gray-500" : "text-green-600"}`}>
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
