// src/components/home/Features.jsx
import { Leaf, Truck, CreditCard, Users, TrendingUp, Shield } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Leaf,
      title: 'Direct from Farms',
      description: 'Source directly from certified farmers, eliminating middlemen and ensuring freshness.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Same-day or next-day delivery to your doorstep with temperature-controlled logistics.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: CreditCard,
      title: 'Fair Pricing',
      description: 'Transparent pricing with no hidden charges. Farmers get better rates, buyers save money.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join a community of farmers and buyers committed to sustainable agriculture.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Business',
      description: 'For farmers: access to wider markets. For buyers: exclusive deals and fresh produce.',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: Shield,
      title: 'Verified & Safe',
      description: 'All farmers verified with certifications. Secure payment and quality guarantees.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose FarmerToBuyer?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're revolutionizing the way fresh produce reaches your table by connecting you directly with farmers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group hover:shadow-lg transition duration-300 rounded-xl p-8 bg-white border border-gray-200 hover:border-gray-300"
              >
                <div className={`inline-block p-4 ${feature.bgColor} rounded-lg mb-4 group-hover:scale-110 transition`}>
                  <Icon className={`${feature.color} w-6 h-6`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}