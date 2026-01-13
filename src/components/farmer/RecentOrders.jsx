// src/components/farmer/RecentOrders.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RecentOrders() {
  const orders = [
    { id: 'ORD001', buyer: 'Rajesh Kumar', amount: '₹1,200', status: 'Delivered', date: '2024-12-20' },
    { id: 'ORD002', buyer: 'Priya Singh', amount: '₹850', status: 'Shipped', date: '2024-12-19' },
    { id: 'ORD003', buyer: 'Amit Patel', amount: '₹2,100', status: 'Pending', date: '2024-12-18' },
    { id: 'ORD004', buyer: 'Sneha Desai', amount: '₹650', status: 'Delivered', date: '2024-12-17' },
  ];

  const statusColor = {
    Delivered: 'bg-green-100 text-green-800',
    Shipped: 'bg-blue-100 text-blue-800',
    Pending: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Your latest orders from buyers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex justify-between items-center border-b pb-4 last:border-0">
              <div>
                <p className="font-medium text-gray-900">{order.id}</p>
                <p className="text-sm text-gray-600">{order.buyer}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{order.amount}</p>
                <span className={`text-xs font-medium px-2 py-1 rounded ${statusColor[order.status]}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}