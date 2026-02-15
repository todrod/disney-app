interface PopcornBucket {
  id: string;
  name: string;
  location: string;
  price: string;
  available: boolean;
  limitedEdition: boolean;
  notes: string;
}

interface PopcornBucketListProps {
  items: PopcornBucket[];
}

export default function PopcornBucketList({ items }: PopcornBucketListProps) {
  if (!items || items.length === 0) {
    return (
      <p className="text-gray-600 text-center py-4">
        No popcorn buckets currently available.
      </p>
    );
  }

  // Sort: available first, then limited edition
  const sortedItems = [...items].sort((a, b) => {
    if (a.available !== b.available) return a.available ? -1 : 1;
    if (a.limitedEdition !== b.limitedEdition) return a.limitedEdition ? -1 : 1;
    return 0;
  });

  return (
    <div className="space-y-5">
      {sortedItems.map((item) => (
        <div
          key={item.id}
          className={`border-2 rounded-xl p-5 md:p-6 transition-all duration-200 ${
            item.available
              ? "border-green-300 bg-gradient-to-br from-green-50 to-white hover:shadow-xl hover:border-green-400"
              : "border-gray-300 bg-gradient-to-br from-gray-100 to-gray-50 opacity-75"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg md:text-xl">
                <span className="text-3xl md:text-4xl">🍿</span>
                {item.name}
                {item.limitedEdition && <span className="text-yellow-500 text-2xl">⭐</span>}
              </h3>

              <div className="mt-3 space-y-2">
                <p className="text-gray-700 text-base md:text-lg flex items-center gap-2">
                  <span className="font-semibold text-gray-800">📍</span>
                  <span>{item.location}</span>
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold shadow-md ${
                      item.available
                        ? "bg-gradient-to-r from-green-500 to-green-400 text-white"
                        : "bg-gradient-to-r from-red-500 to-red-400 text-white"
                    }`}
                  >
                    {item.available ? "✓ AVAILABLE" : "✗ SOLD OUT"}
                  </span>

                  {item.limitedEdition && (
                    <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-amber-400 text-white text-sm font-bold rounded-full shadow-md">
                      LIMITED EDITION
                    </span>
                  )}
                </div>

                {item.notes && (
                  <p className="text-gray-600 italic text-sm md:text-base bg-white p-3 rounded-lg border border-gray-200">
                    💡 {item.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="font-bold text-2xl md:text-3xl text-gray-900">{item.price}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
