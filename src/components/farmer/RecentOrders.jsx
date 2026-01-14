// src/components/farmer/RecentOrders.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RecentOrders({ orders = [] }) {
  const statusColor = {
    delivered: 'bg-green-100 text-green-800',
    shipped: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Your latest orders from buyers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders received yet.</p>
          ) : (
            orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">#{order.id ? order.id.slice(0, 8) : 'ORD'}</p>
                  <p className="text-sm text-gray-600">
                    {order.product_name || order.crop_name || (order.items && order.items[0]?.name) || "Product"} 
                    {order.quantity ? ` x${order.quantity}` : ''}
                  </p>
                </div>
                <div className="text-right">
                  {/* Total Amount calculation might be needed if not provided? Checkout set price * qty? 
                      Actually Backend might return total_amount? 
                      If not, I can't calculate without unit price. 
                      Let's check what fields we have. 
                      Assuming order has 'quantity', maybe 'product' details?
                  */}
                  <p className="font-medium text-gray-900">Qty: {order.quantity}</p>
                  <span className={`text-xs font-medium px-2 py-1 rounded capitalize ${statusColor[order.status?.toLowerCase()] || 'bg-gray-100'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}