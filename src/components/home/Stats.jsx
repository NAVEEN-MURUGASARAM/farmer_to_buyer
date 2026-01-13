// src/components/home/Stats.jsx
export function Stats() {
  const stats = [
    { label: 'Active Farmers', value: '5,000+', icon: '👨‍🌾' },
    { label: 'Happy Buyers', value: '50,000+', icon: '🛒' },
    { label: 'Products Listed', value: '100,000+', icon: '🥬' },
    { label: 'Orders Delivered', value: '500,000+', icon: '🚚' },
  ];

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-r from-green-600 to-green-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="text-white">
              <p className="text-4xl sm:text-5xl font-bold mb-2">{stat.icon}</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2">{stat.value}</p>
              <p className="text-green-100 text-sm sm:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;