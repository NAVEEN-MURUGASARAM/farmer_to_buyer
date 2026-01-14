// src/pages/OrderDetailsPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, MapPin, CreditCard, Calendar } from 'lucide-react';
import { useOrderStore, useAuthStore, useAddressStore } from '@/store';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/common/Modal';
import { useState } from 'react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, cancelOrder } = useOrderStore();
  const { addresses } = useAddressStore();
  const { userRole } = useAuthStore();
  const toast = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const rawOrder = orders.find((o) => o.id === id || o.order_number === id);

  if (!rawOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Package className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/')} className="bg-green-600 hover:bg-green-700">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Normalization
  const addressObj = rawOrder.address_id ? addresses.find(a => a.id === rawOrder.address_id) : null;
  const formattedAddress = addressObj 
      ? `${addressObj.fullName || ''}, ${addressObj.street || addressObj.address_line1 || ''}, ${addressObj.city}, ${addressObj.state} - ${addressObj.zipCode || addressObj.zip_code}`
      : rawOrder.shipping_address || 'Not specified';

  const order = {
      ...rawOrder,
      order_number: rawOrder.order_number || rawOrder.id,
      shipping_address: formattedAddress,
      delivery_method: rawOrder.delivery_method || rawOrder.delivery_mode,
      payment_method: rawOrder.payment_method || 'N/A',
      items: rawOrder.items && rawOrder.items.length > 0 ? rawOrder.items : [{
          product_name: rawOrder.product_name || rawOrder.crop_name || rawOrder.name || 'Product',
          quantity: rawOrder.quantity || 1,
          unit_price: rawOrder.unit_price || rawOrder.price_per_unit || (rawOrder.total_amount ? rawOrder.total_amount / (rawOrder.quantity || 1) : 0),
          total_price: rawOrder.total_amount || 0
      }],
      subtotal: rawOrder.subtotal || rawOrder.total_amount || 0,
      shipping_charges: rawOrder.shipping_charges || 0,
      total_amount: rawOrder.total_amount || 0
  };

  /* Safe status access */
  const currentStatus = (order.order_status || order.status || 'pending').toLowerCase();
  const currentStatusIndex = statusSteps.indexOf(currentStatus);
  const canCancel = currentStatus === 'pending' || currentStatus === 'confirmed';

  const handleCancel = () => {
    cancelOrder(order.id);
    toast.success('Order cancelled successfully');
    setShowCancelDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600 mt-1">Order #{order.order_number}</p>
          </div>
          {userRole === 'buyer' && canCancel && (
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(true)}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Cancel Order
            </Button>
          )}
        </div>

        {/* Status Timeline */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {statusSteps.map((status, index) => (
                <div key={status} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        index <= currentStatusIndex
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`text-xs mt-2 capitalize ${
                        index <= currentStatusIndex ? 'text-green-600 font-medium' : 'text-gray-500'
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        index < currentStatusIndex ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[currentStatus] || statusColors.pending}`}
              >
                {currentStatus.toUpperCase()}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="text-green-600" size={20} />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-start border-b pb-4 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.product_name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Price: ₹{item.unit_price} per unit</p>
                    </div>
                    <p className="font-semibold text-gray-900">₹{item.total_price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="text-green-600" size={20} />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Delivery Method</p>
                <p className="text-gray-600 capitalize">
                  {order.delivery_method?.replace('_', ' ') || 'Not specified'}
                </p>
              </div>
              {order.tracking_number && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Tracking Number</p>
                  <p className="text-gray-600 font-mono">{order.tracking_number}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Delivery Address</p>
                <p className="text-gray-600">{order.shipping_address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="text-green-600" size={20} />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium capitalize">{order.payment_method || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    order.payment_status === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {order.payment_status?.toUpperCase() || 'PENDING'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="text-green-600" size={20} />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{order.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>₹{order.shipping_charges?.toFixed(2) || '0.00'}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-₹{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-green-600">₹{order.total_amount?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="pt-3 border-t text-sm text-gray-600">
                <p>Ordered on: {new Date(order.ordered_at || order.created_at).toLocaleString()}</p>
                {order.delivered_at && (
                  <p className="mt-1">
                    Delivered on: {new Date(order.delivered_at).toLocaleString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancel}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmText="Yes, Cancel Order"
        cancelText="Keep Order"
        variant="danger"
      />
    </div>
  );
}

