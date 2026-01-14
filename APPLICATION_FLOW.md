# FarmerToBuyer - Application Flow Diagrams

## 🎯 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Pages   │  │ Components│  │  Store   │  │  Routes  │  │
│  │          │  │           │  │ (Zustand)│  │          │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                         ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Node.js/Express)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Auth    │  │ Products │  │  Orders  │  │ Payments │  │
│  │  Service │  │  Service │  │  Service │  │  Service │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                         ↕ ORM/Query Builder
┌─────────────────────────────────────────────────────────────┐
│                   Database (MySQL/PostgreSQL)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Users   │  │ Products │  │  Orders  │  │ Reviews  │  │
│  │  Tables  │  │  Tables  │  │  Tables  │  │  Tables  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌──────────┐
│   User   │
└────┬─────┘
     │
     ├─── Registration Flow ───┐
     │                         │
     │ 1. Select Role          │
     │    (Farmer/Buyer)       │
     │                         │
     │ 2. Fill Form            │
     │    - Name               │
     │    - Email              │
     │    - Password           │
     │    - Phone (optional)   │
     │                         │
     │ 3. Submit               │
     │    ↓                    │
     │ [Validate Input]        │
     │    ↓                    │
     │ [Check Email Exists]    │
     │    ↓                    │
     │ [Create User Record]    │
     │    ↓                    │
     │ [If Farmer: Create      │
     │  Farmer Profile]        │
     │    ↓                    │
     │ [Send Verification      │
     │  Email]                 │
     │    ↓                    │
     │ [Redirect to Login]     │
     │                         │
     └─── Login Flow ──────────┘
          │
          │ 1. Enter Credentials
          │    - Email
          │    - Password
          │
          │ 2. Submit
          │    ↓
          │ [Validate Input]
          │    ↓
          │ [Check Credentials]
          │    ↓
          │ [Generate JWT Token]
          │    ↓
          │ [Store Token]
          │    ↓
          │ [Load User Data]
          │    ↓
          │ [Redirect Based on Role]
          │    ├─ Farmer → /farmer/dashboard
          │    └─ Buyer → /buyer/dashboard
          │
          └─── Logout ──────────┘
               │
               │ 1. Click Logout
               │    ↓
               │ [Clear Token]
               │    ↓
               │ [Clear Local Storage]
               │    ↓
               │ [Redirect to Home]
```

---

## 🌾 Farmer Product Management Flow

```
┌──────────┐
│  Farmer  │
└────┬─────┘
     │
     ├─── Add Product ────────────┐
     │                            │
     │ 1. Navigate to Add Product │
     │    ↓                       │
     │ 2. Fill Product Form       │
     │    - Name                  │
     │    - Category              │
     │    - Price                 │
     │    - Stock Quantity        │
     │    - Description           │
     │    - Images                │
     │    - Certifications        │
     │    - Delivery Options      │
     │    ↓                       │
     │ 3. Submit                  │
     │    ↓                       │
     │ [Validate Form]            │
     │    ↓                       │
     │ [Upload Images]            │
     │    ↓                       │
     │ [Create Product Record]    │
     │    ↓                       │
     │ [Return Success]           │
     │    ↓                       │
     │ [Redirect to My Listings]  │
     │                            │
     ├─── Edit Product ───────────┤
     │                            │
     │ 1. Select Product          │
     │    ↓                       │
     │ 2. Load Product Data       │
     │    ↓                       │
     │ 3. Update Fields           │
     │    ↓                       │
     │ 4. Submit                  │
     │    ↓                       │
     │ [Validate Updates]         │
     │    ↓                       │
     │ [Update Product Record]    │
     │    ↓                       │
     │ [Return Success]           │
     │                            │
     ├─── Manage Stock ───────────┤
     │                            │
     │ 1. View Product Stock      │
     │    ↓                       │
     │ 2. Update Stock Quantity   │
     │    ↓                       │
     │ [Update stock_quantity]    │
     │    ↓                       │
     │ [If stock = 0:             │
     │  Set is_active = false]    │
     │                            │
     └─── Delete Product ─────────┘
          │
          │ 1. Select Product
          │    ↓
          │ 2. Confirm Deletion
          │    ↓
          │ [Check for Active Orders]
          │    ↓
          │ [If no active orders:
          │   Soft delete product]
          │    ↓
          │ [Set is_active = false]
```

---

## 🛒 Buyer Shopping Flow

```
┌──────────┐
│  Buyer   │
└────┬─────┘
     │
     ├─── Browse Products ────────┐
     │                            │
     │ 1. View Product List       │
     │    ↓                       │
     │ 2. Apply Filters           │
     │    - Category              │
     │    - Price Range           │
     │    - Rating                │
     │    ↓                       │
     │ 3. Search Products         │
     │    ↓                       │
     │ 4. View Product Details    │
     │    - Images                │
     │    - Description           │
     │    - Price                 │
     │    - Farmer Info           │
     │    - Reviews               │
     │    ↓                       │
     │ 5. Select Quantity         │
     │    ↓                       │
     │ 6. Add to Cart             │
     │    ↓                       │
     │ [Check Stock Availability] │
     │    ↓                       │
     │ [Add to Cart Table]        │
     │    ↓                       │
     │ [Update Cart Count]        │
     │                            │
     ├─── Manage Cart ────────────┤
     │                            │
     │ 1. View Cart               │
     │    ↓                       │
     │ 2. Update Quantities       │
     │    ↓                       │
     │ 3. Remove Items            │
     │    ↓                       │
     │ 4. View Total              │
     │                            │
     └─── Checkout ───────────────┘
          │
          │ 1. Review Cart
          │    ↓
          │ 2. Select Address
          │    ├─ Use Saved Address
          │    └─ Add New Address
          │    ↓
          │ 3. Choose Delivery Method
          │    ├─ Self Delivery
          │    ├─ Courier
          │    └─ Pickup
          │    ↓
          │ 4. Review Order Summary
          │    ↓
          │ 5. Select Payment Method
          │    ↓
          │ 6. Place Order
          │    ↓
          │ [Validate Cart Items]
          │    ↓
          │ [Check Stock]
          │    ↓
          │ [Create Order Record]
          │    ↓
          │ [Create Order Items]
          │    ↓
          │ [Reduce Stock]
          │    ↓
          │ [Process Payment]
          │    ↓
          │ [Create Payment Record]
          │    ↓
          │ [Clear Cart]
          │    ↓
          │ [Send Notifications]
          │    ↓
          │ [Order Confirmation]
```

---

## 📦 Order Processing Flow

```
┌────────────┐
│   Order    │
└─────┬──────┘
      │
      │ Status: PENDING
      │ ↓
      │ [Payment Processing]
      │ ↓
      │ Status: CONFIRMED
      │ ↓
      │ [Farmer Receives Notification]
      │ ↓
      │ [Farmer Confirms Order]
      │ ↓
      │ Status: PROCESSING
      │ ↓
      │ [Farmer Prepares Order]
      │ ↓
      │ [Farmer Marks as Shipped]
      │ ↓
      │ Status: SHIPPED
      │ [Add Tracking Number]
      │ ↓
      │ [Buyer Receives Notification]
      │ ↓
      │ [Courier/Delivery in Transit]
      │ ↓
      │ [Order Delivered]
      │ ↓
      │ Status: DELIVERED
      │ ↓
      │ [Buyer Confirms Delivery]
      │ ↓
      │ [Payment Released to Farmer]
      │ ↓
      │ [Order Completed]
      │
      └─── Cancellation Flow ─────┘
           │
           │ [Buyer/Farmer Cancels]
           │ ↓
           │ Status: CANCELLED
           │ ↓
           │ [Restore Stock]
           │ ↓
           │ [Process Refund]
           │ ↓
           │ [Update Payment Status]
           │ ↓
           │ [Send Notifications]
```

---

## ⭐ Review & Rating Flow

```
┌──────────┐
│  Buyer   │
└────┬─────┘
     │
     │ 1. Order Delivered
     │    ↓
     │ 2. Navigate to Review Page
     │    ↓
     │ 3. Select Product to Review
     │    ↓
     │ 4. Rate Product (1-5 stars)
     │    ↓
     │ 5. Write Review
     │    - Title (optional)
     │    - Comment
     │    - Upload Images (optional)
     │    ↓
     │ 6. Submit Review
     │    ↓
     │ [Validate Review]
     │    ↓
     │ [Check if Already Reviewed]
     │    ↓
     │ [Create Review Record]
     │    ↓
     │ [Update Product Rating]
     │    - Calculate Average Rating
     │    - Update total_reviews count
     │    ↓
     │ [Update Farmer Rating]
     │    ↓
     │ [Send Notification to Farmer]
     │    ↓
     │ [Review Published]
```

---

## 🔍 Search & Filter Flow

```
┌──────────┐
│  Buyer   │
└────┬─────┘
     │
     │ 1. Enter Search Query
     │    ↓
     │ [Full-text Search]
     │    - Product Name
     │    - Description
     │    - Category
     │    ↓
     │ 2. Apply Filters
     │    ├─ Category Filter
     │    ├─ Price Range
     │    ├─ Rating Filter
     │    └─ Availability
     │    ↓
     │ 3. Sort Results
     │    ├─ Relevance
     │    ├─ Price: Low to High
     │    ├─ Price: High to Low
     │    ├─ Rating: High to Low
     │    └─ Newest First
     │    ↓
     │ [Execute Query]
     │    ↓
     │ [Return Results]
     │    ↓
     │ [Display Product Cards]
     │    ↓
     │ [Pagination]
```

---

## 💳 Payment Processing Flow

```
┌──────────┐
│  Buyer   │
└────┬─────┘
     │
     │ 1. Select Payment Method
     │    ├─ UPI
     │    ├─ Credit/Debit Card
     │    ├─ Net Banking
     │    └─ Wallet
     │    ↓
     │ 2. Enter Payment Details
     │    ↓
     │ 3. Confirm Payment
     │    ↓
     │ [Create Payment Record]
     │    Status: PENDING
     │    ↓
     │ [Redirect to Payment Gateway]
     │    ↓
     │ [Payment Gateway Processing]
     │    ↓
     │ [Payment Gateway Response]
     │    ├─ SUCCESS
     │    │   ↓
     │    │ [Update Payment Status: PAID]
     │    │   ↓
     │    │ [Update Order Payment Status]
     │    │   ↓
     │    │ [Confirm Order]
     │    │   ↓
     │    │ [Send Confirmation Email]
     │    │
     │    └─ FAILED
     │        ↓
     │        [Update Payment Status: FAILED]
     │        ↓
     │        [Keep Order as PENDING]
     │        ↓
     │        [Notify Buyer]
     │        ↓
     │        [Allow Retry]
```

---

## 📊 Dashboard Flow

### Farmer Dashboard
```
┌──────────┐
│  Farmer  │
└────┬─────┘
     │
     │ Dashboard Components:
     │
     ├─ Stats Cards
     │  ├─ Total Products
     │  ├─ Total Orders
     │  ├─ Total Revenue
     │  └─ Average Rating
     │
     ├─ Recent Orders
     │  └─ List of Latest Orders
     │     - Order ID
     │     - Buyer Name
     │     - Amount
     │     - Status
     │     - Date
     │
     ├─ My Listings
     │  └─ Product Table
     │     - Product Name
     │     - Price
     │     - Stock
     │     - Sales
     │     - Actions (Edit/Delete)
     │
     └─ Quick Actions
        ├─ Add New Product
        ├─ View All Orders
        ├─ View Analytics
        └─ Manage Profile
```

### Buyer Dashboard
```
┌──────────┐
│  Buyer   │
└────┬─────┘
     │
     │ Dashboard Tabs:
     │
     ├─ Overview
     │  ├─ Stats Cards
     │  │  ├─ Total Orders
     │  │  ├─ Cart Items
     │  │  ├─ Saved Addresses
     │  │  └─ Wishlist Items
     │  │
     │  ├─ Recent Orders
     │  └─ Quick Actions
     │
     ├─ Orders
     │  └─ Order History
     │     - Order List
     │     - Status
     │     - Total Amount
     │     - Actions
     │
     ├─ Cart
     │  └─ Shopping Cart
     │     - Cart Items
     │     - Total Price
     │     - Checkout Button
     │
     └─ Settings
        ├─ Profile Management
        ├─ Address Management
        └─ Account Settings
```

---

## 🔔 Notification Flow

```
┌──────────────┐
│   System     │
└──────┬───────┘
       │
       │ Trigger Events:
       │
       ├─ Order Placed
       │  └─ Notify Farmer
       │
       ├─ Order Confirmed
       │  └─ Notify Buyer
       │
       ├─ Order Shipped
       │  └─ Notify Buyer
       │
       ├─ Order Delivered
       │  └─ Notify Buyer & Farmer
       │
       ├─ Payment Received
       │  └─ Notify Farmer
       │
       ├─ Review Received
       │  └─ Notify Farmer
       │
       ├─ Low Stock Alert
       │  └─ Notify Farmer
       │
       └─ Product Out of Stock
          └─ Notify Farmer
             │
             │ Create Notification Record
             │ ↓
             │ Send Email/SMS (optional)
             │ ↓
             │ Display in Dashboard
             │ ↓
             │ Mark as Read when viewed
```

---

## 🔐 Authorization & Access Control

```
┌──────────┐
│ Request  │
└────┬─────┘
     │
     │ 1. Extract JWT Token
     │    ↓
     │ [Validate Token]
     │    ↓
     │ [Extract User Info]
     │    ↓
     │ [Check User Role]
     │    ↓
     │ [Check Resource Ownership]
     │    ↓
     │ Access Control:
     │
     ├─ Public Routes
     │  └─ No authentication required
     │     - Home
     │     - Products List
     │     - Product Details
     │     - About
     │     - Contact
     │
     ├─ Buyer Routes
     │  └─ Requires: role = 'buyer'
     │     - Buyer Dashboard
     │     - Cart
     │     - Orders
     │     - Wishlist
     │
     ├─ Farmer Routes
     │  └─ Requires: role = 'farmer'
     │     - Farmer Dashboard
     │     - Add Product
     │     - Manage Products
     │     - Order Management
     │
     └─ Resource Ownership
        └─ Users can only access their own:
           - Orders
           - Cart
           - Reviews
           - Addresses
           - Products (farmers only)
```

---

## 🗄️ Data Flow Architecture

```
┌─────────────────┐
│   React Frontend│
│                 │
│  Components     │
│      ↓          │
│  Store (Zustand)│
│      ↓          │
│  API Service    │
└────────┬────────┘
         │ HTTP Requests
         │ (GET, POST, PUT, DELETE)
         ↓
┌─────────────────┐
│  Backend API    │
│                 │
│  Route Handlers │
│      ↓          │
│  Controllers    │
│      ↓          │
│  Services       │
│      ↓          │
│  Models/DAO     │
└────────┬────────┘
         │ SQL Queries
         ↓
┌─────────────────┐
│   Database      │
│                 │
│  Tables         │
│      ↓          │
│  Data Storage   │
└─────────────────┘
         │
         ↓
┌─────────────────┐
│  Response       │
│  JSON Data      │
│      ↓          │
│  Update Store   │
│      ↓          │
│  Re-render UI   │
└─────────────────┘
```

---

## 📱 API Endpoints Structure

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-email` - Email verification

### Products
- `GET /api/products` - List all products (with filters)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Farmer only)
- `PUT /api/products/:id` - Update product (Owner only)
- `DELETE /api/products/:id` - Delete product (Owner only)
- `GET /api/farmers/:id/products` - Get farmer's products

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item
- `DELETE /api/cart` - Clear cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status
- `POST /api/orders/:id/cancel` - Cancel order

### Reviews
- `GET /api/products/:id/reviews` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### User Management
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile
- `GET /api/users/:id/addresses` - Get addresses
- `POST /api/users/:id/addresses` - Add address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

---

This comprehensive flow document should help you understand the complete application structure and user journeys!


