interface WhatsExcitingRightNowProps {
  content: string;
}

export default function WhatsExcitingRightNow({ content }: WhatsExcitingRightNowProps) {
  if (!content) {
    return null;
  }

  return (
    <section className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <span className="text-3xl md:text-4xl">✨</span>
          What's Exciting Right Now
        </h2>
      </div>
      <div className="p-6 md:p-8">
        <p className="text-base md:text-lg text-gray-700 leading-relaxed">
          {content}
        </p>
      </div>
    </section>
  );
}
