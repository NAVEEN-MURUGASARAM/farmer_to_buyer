// src/components/farmer/StatsCards.jsx
import { TrendingUp, Package, Users, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function StatsCards() {
  const stats = [
    { icon: Package, label: 'Active Listings', value: 24, color: 'text-green-600', bg: 'bg-green-50' },
    { icon: Users, label: 'Total Buyers', value: 156, color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: DollarSign, label: 'Total Revenue', value: '₹24,500', color: 'text-orange-600', bg: 'bg-orange-50' },
    { icon: TrendingUp, label: 'Monthly Growth', value: '+12%', color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition">
            <CardContent className="pt-6">
              <div className={`inline-block p-3 ${stat.bg} rounded-lg mb-4`}>
                <Icon className={`${stat.color} w-6 h-6`} />
              </div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}