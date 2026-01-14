// src/pages/CheckoutPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Truck, CreditCard, ArrowLeft } from 'lucide-react';
import { useCartStore, useAddressStore, useOrderStore, useAuthStore } from '@/store';
import { useToast } from '@/contexts/ToastContext';
import { orderService } from '@/services/orderService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Modal from '@/components/common/Modal';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCartStore();
  const { addresses, addAddress, setDefaultAddress } = useAddressStore();
  const { addOrder } = useOrderStore();
  const { user } = useAuthStore();
  const toast = useToast();

  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((addr) => addr.is_default)?.id || null
  );
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newAddress, setNewAddress] = useState({
    full_name: user?.name || '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    type: 'home',
    is_default: addresses.length === 0,
  });

  const shippingCharges = deliveryMethod === 'courier' ? 50 : deliveryMethod === 'pickup' ? 0 : 0;
  const finalTotal = totalPrice + shippingCharges;

  const isOrderPlaced = useRef(false);

  useEffect(() => {
    if (items.length === 0 && !isOrderPlaced.current) {
      navigate('/products');
      toast.warning('Your cart is empty');
    }
  }, [items.length, navigate, toast]);

  const handleAddAddress = () => {
    if (!newAddress.full_name || !newAddress.phone || !newAddress.address_line1 || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast.error('Please fill all required fields');
      return;
    }

    const address = {
      id: Date.now(),
      ...newAddress,
      created_at: new Date().toISOString(),
    };

    addAddress(address);
    setSelectedAddressId(address.id);
    setShowAddressModal(false);
    setNewAddress({
      full_name: user?.name || '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      pincode: '',
      type: 'home',
      is_default: false,
    });
    toast.success('Address added successfully');
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select or add a delivery address');
      return;
    }

    setIsProcessing(true);

    try {
      const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId);
      const token = localStorage.getItem('authToken'); // Get fresh token

      // Create an order for each item in the cart
      const orderPromises = items.map((item) => {
        const pid = String(item.id || item.productId);
        console.log("Creating order for product:", pid, "item:", item);
        return orderService.createOrder({
          product_id: pid,
          quantity: parseInt(item.quantity),
          delivery_mode: deliveryMethod,
          address_id: selectedAddressId, // Send selected address ID
          payment_method: paymentMethod, // Send selected payment method
          status: "pending", 
        }, token);
      });

      await Promise.all(orderPromises);
      
      isOrderPlaced.current = true;
      clearCart();
      toast.success('Order(s) placed successfully!');
      // Navigate to order history or the first new order?
      // Since we might create multiple orders, let's go to the Orders list or Dashboard.
      navigate('/buyer/dashboard?tab=orders');
    } catch (error) {
       console.error("Checkout error:", error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Cart
        </Button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="text-green-600" size={20} />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.length > 0 && (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                          selectedAddressId === address.id
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedAddressId(address.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">{address.full_name}</span>
                              {address.is_default && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  Default
                                </span>
                              )}
                              <span className="text-xs text-gray-500 capitalize">
                                {address.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{address.phone}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {address.address_line1}
                              {address.address_line2 && `, ${address.address_line2}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} {address.pincode}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={() => setShowAddressModal(true)}
                  className="w-full"
                >
                  + Add New Address
                </Button>
              </CardContent>
            </Card>

            {/* Delivery Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="text-green-600" size={20} />
                  Delivery Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { value: 'pickup', label: 'Self Delivery', price: 'Free', desc: 'Delivered by farmer' },
                    { value: 'courier', label: 'Courier', price: '₹50', desc: 'Delivered via courier service' },
                    { value: 'farm_pickup', label: 'Pickup from Farm', price: 'Free', desc: 'Collect from farmer location' },
                  ].map((method) => (
                    <div
                      key={method.value}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                        deliveryMethod === method.value
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setDeliveryMethod(method.value)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{method.label}</span>
                            <span className="text-green-600 font-medium">{method.price}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{method.desc}</p>
                        </div>
                        <input
                          type="radio"
                          checked={deliveryMethod === method.value}
                          onChange={() => setDeliveryMethod(method.value)}
                          className="text-green-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="text-green-600" size={20} />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {['upi', 'card', 'wallet', 'cod'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      className={`border-2 rounded-lg p-4 text-left transition ${
                        paymentMethod === method
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod(method)}
                    >
                      <span className="font-medium capitalize">{method.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>₹{shippingCharges.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-green-600">₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {selectedAddress && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">Deliver to:</p>
                    <p className="text-sm text-gray-600">
                      {selectedAddress.full_name}
                      <br />
                      {selectedAddress.address_line1}
                      <br />
                      {selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}
                    </p>
                  </div>
                )}

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || !selectedAddressId}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg"
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner size={20} className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    `Place Order - ₹${finalTotal.toFixed(2)}`
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        title="Add New Address"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <Input
              value={newAddress.full_name}
              onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
            <Input
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
              placeholder="9876543210"
              type="tel"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
            <Input
              value={newAddress.address_line1}
              onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })}
              placeholder="House/Flat No., Building Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
            <Input
              value={newAddress.address_line2}
              onChange={(e) => setNewAddress({ ...newAddress, address_line2: e.target.value })}
              placeholder="Street, Area, Landmark (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
              <Input
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
              <Input
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                placeholder="State"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
            <Input
              value={newAddress.pincode}
              onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
              placeholder="560001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
            <select
              value={newAddress.type}
              onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newAddress.is_default}
              onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
              className="rounded"
            />
            <label className="text-sm text-gray-700">Set as default address</label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowAddressModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddAddress}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Add Address
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


