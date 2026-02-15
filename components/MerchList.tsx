interface MerchItem {
  id: string;
  name: string;
  location: string;
  price: string;
  limitedEdition: boolean;
  notes: string;
}

interface MerchListProps {
  items: MerchItem[];
}

export default function MerchList({ items }: MerchListProps) {
  if (!items || items.length === 0) {
    return (
      <p className="text-gray-600 text-center py-8 text-base md:text-lg">
        No limited edition merch currently available.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {items.map((item) => (
        <div
          key={item.id}
          className="border-2 border-gray-100 rounded-xl p-5 md:p-6 bg-gradient-to-br from-white to-gray-50 hover:shadow-xl hover:border-amber-200 transition-all duration-200"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg md:text-xl">
                {item.limitedEdition && <span className="text-yellow-500 text-2xl">⭐</span>}
                {item.name}
              </h3>
              <div className="mt-3 space-y-2">
                <p className="text-gray-700 text-base md:text-lg flex items-center gap-2">
                  <span className="font-semibold text-gray-800">📍 Location:</span>
                  <span>{item.location}</span>
                </p>
                {item.notes && (
                  <p className="text-gray-600 italic text-sm md:text-base bg-amber-50 p-3 rounded-lg">
                    💡 {item.notes}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-2xl md:text-3xl text-green-600">{item.price}</p>
              {item.limitedEdition && (
                <span className="inline-block mt-2 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-amber-400 text-white text-sm font-bold rounded-full shadow-md">
                  LIMITED EDITION
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
