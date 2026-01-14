# FarmerToBuyer - Database Schema & Application Flow

## 📊 Database Schema

### 1. Users Table

**Purpose:** Store all user accounts (both farmers and buyers)

| Column Name   | Data Type               | Constraints                         | Description                     |
| ------------- | ----------------------- | ----------------------------------- | ------------------------------- |
| id            | UUID/INTEGER            | PRIMARY KEY, AUTO_INCREMENT         | Unique user identifier          |
| email         | VARCHAR(255)            | UNIQUE, NOT NULL                    | User email address              |
| password_hash | VARCHAR(255)            | NOT NULL                            | Hashed password                 |
| name          | VARCHAR(255)            | NOT NULL                            | User's full name                |
| role          | ENUM('farmer', 'buyer') | NOT NULL                            | User role type                  |
| phone         | VARCHAR(20)             | NULL                                | Contact phone number            |
| profile_image | VARCHAR(500)            | NULL                                | Profile picture URL             |
| address       | TEXT                    | NULL                                | Physical address                |
| city          | VARCHAR(100)            | NULL                                | City                            |
| state         | VARCHAR(100)            | NULL                                | State/Province                  |
| pincode       | VARCHAR(10)             | NULL                                | Postal/ZIP code                 |
| is_verified   | BOOLEAN                 | DEFAULT FALSE                       | Email/phone verification status |
| is_active     | BOOLEAN                 | DEFAULT TRUE                        | Account active status           |
| created_at    | TIMESTAMP               | DEFAULT CURRENT_TIMESTAMP           | Account creation date           |
| updated_at    | TIMESTAMP               | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp           |

**Indexes:**

- INDEX idx_email (email)
- INDEX idx_role (role)
- INDEX idx_city_state (city, state)

---

### 2. Farmers Table (Extended Profile)

**Purpose:** Additional information specific to farmers

| Column Name    | Data Type     | Constraints                         | Description                                         |
| -------------- | ------------- | ----------------------------------- | --------------------------------------------------- |
| id             | UUID/INTEGER  | PRIMARY KEY                         | Same as Users.id (Foreign Key)                      |
| farm_name      | VARCHAR(255)  | NULL                                | Name of the farm                                    |
| farm_location  | VARCHAR(255)  | NULL                                | Farm location                                       |
| farm_area      | DECIMAL(10,2) | NULL                                | Farm area in acres/hectares                         |
| certifications | JSON/TEXT     | NULL                                | Array of certifications (Organic, Fair Trade, etc.) |
| bio            | TEXT          | NULL                                | Farmer biography                                    |
| rating         | DECIMAL(3,2)  | DEFAULT 0.00                        | Average farmer rating (0-5)                         |
| total_products | INTEGER       | DEFAULT 0                           | Total products listed                               |
| total_sales    | INTEGER       | DEFAULT 0                           | Total orders completed                              |
| bank_account   | VARCHAR(50)   | NULL                                | Bank account number (encrypted)                     |
| ifsc_code      | VARCHAR(20)   | NULL                                | IFSC code                                           |
| created_at     | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP           | Profile creation date                               |
| updated_at     | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp                               |

**Foreign Keys:**

- FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE

---

### 3. Products Table

**Purpose:** Store product listings by farmers

| Column Name          | Data Type     | Constraints                         | Description                             |
| -------------------- | ------------- | ----------------------------------- | --------------------------------------- |
| id                   | UUID/INTEGER  | PRIMARY KEY, AUTO_INCREMENT         | Unique product identifier               |
| farmer_id            | UUID/INTEGER  | NOT NULL, FOREIGN KEY               | Owner of the product                    |
| name                 | VARCHAR(255)  | NOT NULL                            | Product name                            |
| category_id          | INTEGER       | NOT NULL, FOREIGN KEY               | Product category                        |
| description          | TEXT          | NULL                                | Detailed product description            |
| price                | DECIMAL(10,2) | NOT NULL                            | Price per unit (in ₹)                   |
| original_price       | DECIMAL(10,2) | NULL                                | Original price (for discounts)          |
| stock_quantity       | DECIMAL(10,2) | NOT NULL, DEFAULT 0                 | Available stock quantity                |
| unit                 | VARCHAR(50)   | DEFAULT 'kg'                        | Unit of measurement (kg, piece, bundle) |
| min_order_quantity   | DECIMAL(10,2) | DEFAULT 1                           | Minimum order quantity                  |
| max_order_quantity   | DECIMAL(10,2) | NULL                                | Maximum order quantity                  |
| rating               | DECIMAL(3,2)  | DEFAULT 0.00                        | Average product rating (0-5)            |
| total_reviews        | INTEGER       | DEFAULT 0                           | Total number of reviews                 |
| total_sales          | INTEGER       | DEFAULT 0                           | Total units sold                        |
| images               | JSON/TEXT     | NULL                                | Array of image URLs                     |
| certifications       | JSON/TEXT     | NULL                                | Product certifications                  |
| storage_instructions | TEXT          | NULL                                | Storage and handling instructions       |
| nutrition_info       | JSON/TEXT     | NULL                                | Nutritional information per 100g        |
| delivery_available   | BOOLEAN       | DEFAULT TRUE                        | Self-delivery available                 |
| courier_available    | BOOLEAN       | DEFAULT TRUE                        | Courier delivery available              |
| pickup_available     | BOOLEAN       | DEFAULT TRUE                        | Farm pickup available                   |
| is_active            | BOOLEAN       | DEFAULT TRUE                        | Product listing active status           |
| is_featured          | BOOLEAN       | DEFAULT FALSE                       | Featured product flag                   |
| created_at           | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP           | Listing creation date                   |
| updated_at           | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp                   |

**Foreign Keys:**

- FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
- FOREIGN KEY (category_id) REFERENCES categories(id)

**Indexes:**

- INDEX idx_farmer_id (farmer_id)
- INDEX idx_category_id (category_id)
- INDEX idx_is_active (is_active)
- INDEX idx_price (price)
- INDEX idx_rating (rating)
- FULLTEXT INDEX idx_search (name, description)

---

### 4. Categories Table

**Purpose:** Product categories

| Column Name | Data Type    | Constraints                 | Description                              |
| ----------- | ------------ | --------------------------- | ---------------------------------------- |
| id          | INTEGER      | PRIMARY KEY, AUTO_INCREMENT | Unique category identifier               |
| name        | VARCHAR(100) | UNIQUE, NOT NULL            | Category name (Vegetables, Fruits, etc.) |
| slug        | VARCHAR(100) | UNIQUE, NOT NULL            | URL-friendly category name               |
| description | TEXT         | NULL                        | Category description                     |
| icon        | VARCHAR(255) | NULL                        | Category icon/image URL                  |
| is_active   | BOOLEAN      | DEFAULT TRUE                | Category active status                   |
| created_at  | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP   | Creation date                            |

**Sample Data:**

- Vegetables
- Fruits
- Grains
- Pulses
- Dairy
- Spices
- Herbs

---

### 5. Cart Table

**Purpose:** Shopping cart items (temporary storage before checkout)

| Column Name    | Data Type     | Constraints                         | Description                 |
| -------------- | ------------- | ----------------------------------- | --------------------------- |
| id             | UUID/INTEGER  | PRIMARY KEY, AUTO_INCREMENT         | Unique cart item identifier |
| user_id        | UUID/INTEGER  | NOT NULL, FOREIGN KEY               | Buyer user ID               |
| product_id     | UUID/INTEGER  | NOT NULL, FOREIGN KEY               | Product ID                  |
| quantity       | DECIMAL(10,2) | NOT NULL, DEFAULT 1                 | Quantity selected           |
| price_at_added | DECIMAL(10,2) | NOT NULL                            | Price when added to cart    |
| created_at     | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP           | Added to cart date          |
| updated_at     | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp       |

**Foreign Keys:**

- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
- FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE

**Indexes:**

- UNIQUE INDEX idx_user_product (user_id, product_id)
- INDEX idx_user_id (user_id)

---

### 6. Orders Table

**Purpose:** Store order information

| Column Name      | Data Type                                                                       | Constraints                         | Description               |
| ---------------- | ------------------------------------------------------------------------------- | ----------------------------------- | ------------------------- |
| id               | VARCHAR(50)                                                                     | PRIMARY KEY                         | Order ID (e.g., ORD001)   |
| buyer_id         | UUID/INTEGER                                                                    | NOT NULL, FOREIGN KEY               | Buyer user ID             |
| farmer_id        | UUID/INTEGER                                                                    | NOT NULL, FOREIGN KEY               | Farmer user ID            |
| order_number     | VARCHAR(50)                                                                     | UNIQUE, NOT NULL                    | Unique order number       |
| subtotal         | DECIMAL(10,2)                                                                   | NOT NULL                            | Order subtotal            |
| tax              | DECIMAL(10,2)                                                                   | DEFAULT 0.00                        | Tax amount                |
| shipping_charges | DECIMAL(10,2)                                                                   | DEFAULT 0.00                        | Shipping/delivery charges |
| discount         | DECIMAL(10,2)                                                                   | DEFAULT 0.00                        | Discount amount           |
| total_amount     | DECIMAL(10,2)                                                                   | NOT NULL                            | Final total amount        |
| payment_method   | VARCHAR(50)                                                                     | NULL                                | Payment method used       |
| payment_status   | ENUM('pending', 'paid', 'failed', 'refunded')                                   | DEFAULT 'pending'                   | Payment status            |
| order_status     | ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') | DEFAULT 'pending'                   | Order status              |
| delivery_method  | ENUM('self_delivery', 'courier', 'pickup')                                      | NULL                                | Delivery method           |
| shipping_address | TEXT                                                                            | NOT NULL                            | Delivery address          |
| shipping_city    | VARCHAR(100)                                                                    | NULL                                | Delivery city             |
| shipping_state   | VARCHAR(100)                                                                    | NULL                                | Delivery state            |
| shipping_pincode | VARCHAR(10)                                                                     | NULL                                | Delivery pincode          |
| tracking_number  | VARCHAR(100)                                                                    | NULL                                | Courier tracking number   |
| notes            | TEXT                                                                            | NULL                                | Order notes/comments      |
| ordered_at       | TIMESTAMP                                                                       | DEFAULT CURRENT_TIMESTAMP           | Order placement date      |
| delivered_at     | TIMESTAMP                                                                       | NULL                                | Delivery completion date  |
| created_at       | TIMESTAMP                                                                       | DEFAULT CURRENT_TIMESTAMP           | Record creation date      |
| updated_at       | TIMESTAMP                                                                       | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp     |

**Foreign Keys:**

- FOREIGN KEY (buyer_id) REFERENCES users(id)
- FOREIGN KEY (farmer_id) REFERENCES users(id)

**Indexes:**

- INDEX idx_buyer_id (buyer_id)
- INDEX idx_farmer_id (farmer_id)
- INDEX idx_order_status (order_status)
- INDEX idx_payment_status (payment_status)
- INDEX idx_ordered_at (ordered_at)

---

### 7. Order_Items Table

**Purpose:** Individual items within an order

| Column Name  | Data Type     | Constraints                 | Description                         |
| ------------ | ------------- | --------------------------- | ----------------------------------- |
| id           | UUID/INTEGER  | PRIMARY KEY, AUTO_INCREMENT | Unique order item identifier        |
| order_id     | VARCHAR(50)   | NOT NULL, FOREIGN KEY       | Order ID                            |
| product_id   | UUID/INTEGER  | NOT NULL, FOREIGN KEY       | Product ID                          |
| product_name | VARCHAR(255)  | NOT NULL                    | Product name (snapshot)             |
| quantity     | DECIMAL(10,2) | NOT NULL                    | Quantity ordered                    |
| unit_price   | DECIMAL(10,2) | NOT NULL                    | Price per unit at time of order     |
| total_price  | DECIMAL(10,2) | NOT NULL                    | Total price (quantity × unit_price) |
| created_at   | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP   | Record creation date                |

**Foreign Keys:**

- FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
- FOREIGN KEY (product_id) REFERENCES products(id)

**Indexes:**

- INDEX idx_order_id (order_id)
- INDEX idx_product_id (product_id)

---

### 8. Reviews Table

**Purpose:** Product reviews and ratings by buyers

| Column Name          | Data Type    | Constraints                         | Description              |
| -------------------- | ------------ | ----------------------------------- | ------------------------ |
| id                   | UUID/INTEGER | PRIMARY KEY, AUTO_INCREMENT         | Unique review identifier |
| product_id           | UUID/INTEGER | NOT NULL, FOREIGN KEY               | Product being reviewed   |
| buyer_id             | UUID/INTEGER | NOT NULL, FOREIGN KEY               | Buyer who wrote review   |
| order_id             | VARCHAR(50)  | NULL, FOREIGN KEY                   | Associated order ID      |
| rating               | INTEGER      | NOT NULL, CHECK (1-5)               | Rating (1-5 stars)       |
| title                | VARCHAR(255) | NULL                                | Review title             |
| comment              | TEXT         | NULL                                | Review comment/feedback  |
| images               | JSON/TEXT    | NULL                                | Review images            |
| is_verified_purchase | BOOLEAN      | DEFAULT FALSE                       | Verified purchase flag   |
| is_approved          | BOOLEAN      | DEFAULT FALSE                       | Admin approval status    |
| helpful_count        | INTEGER      | DEFAULT 0                           | Number of helpful votes  |
| created_at           | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP           | Review creation date     |
| updated_at           | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp    |

**Foreign Keys:**

- FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
- FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
- FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL

**Indexes:**

- UNIQUE INDEX idx_product_buyer (product_id, buyer_id, order_id)
- INDEX idx_product_id (product_id)
- INDEX idx_rating (rating)
- INDEX idx_is_approved (is_approved)

---

### 9. Wishlist Table

**Purpose:** Buyer's wishlist/saved products

| Column Name | Data Type    | Constraints                 | Description                     |
| ----------- | ------------ | --------------------------- | ------------------------------- |
| id          | UUID/INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique wishlist item identifier |
| user_id     | UUID/INTEGER | NOT NULL, FOREIGN KEY       | Buyer user ID                   |
| product_id  | UUID/INTEGER | NOT NULL, FOREIGN KEY       | Product ID                      |
| created_at  | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP   | Added to wishlist date          |

**Foreign Keys:**

- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
- FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE

**Indexes:**

- UNIQUE INDEX idx_user_product (user_id, product_id)
- INDEX idx_user_id (user_id)

---

### 10. Addresses Table

**Purpose:** Buyer's saved delivery addresses

| Column Name   | Data Type                     | Constraints                         | Description               |
| ------------- | ----------------------------- | ----------------------------------- | ------------------------- |
| id            | UUID/INTEGER                  | PRIMARY KEY, AUTO_INCREMENT         | Unique address identifier |
| user_id       | UUID/INTEGER                  | NOT NULL, FOREIGN KEY               | Buyer user ID             |
| type          | ENUM('home', 'work', 'other') | DEFAULT 'home'                      | Address type              |
| full_name     | VARCHAR(255)                  | NOT NULL                            | Recipient full name       |
| phone         | VARCHAR(20)                   | NOT NULL                            | Contact phone number      |
| address_line1 | VARCHAR(255)                  | NOT NULL                            | Address line 1            |
| address_line2 | VARCHAR(255)                  | NULL                                | Address line 2            |
| city          | VARCHAR(100)                  | NOT NULL                            | City                      |
| state         | VARCHAR(100)                  | NOT NULL                            | State/Province            |
| pincode       | VARCHAR(10)                   | NOT NULL                            | Postal/ZIP code           |
| landmark      | VARCHAR(255)                  | NULL                                | Landmark                  |
| is_default    | BOOLEAN                       | DEFAULT FALSE                       | Default address flag      |
| created_at    | TIMESTAMP                     | DEFAULT CURRENT_TIMESTAMP           | Creation date             |
| updated_at    | TIMESTAMP                     | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp     |

**Foreign Keys:**

- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

**Indexes:**

- INDEX idx_user_id (user_id)
- INDEX idx_is_default (is_default)

---

### 11. Payments Table

**Purpose:** Payment transaction records

| Column Name      | Data Type                                          | Constraints                         | Description                              |
| ---------------- | -------------------------------------------------- | ----------------------------------- | ---------------------------------------- |
| id               | UUID/INTEGER                                       | PRIMARY KEY, AUTO_INCREMENT         | Unique payment identifier                |
| order_id         | VARCHAR(50)                                        | NOT NULL, FOREIGN KEY               | Associated order ID                      |
| transaction_id   | VARCHAR(255)                                       | UNIQUE, NULL                        | Payment gateway transaction ID           |
| payment_method   | VARCHAR(50)                                        | NOT NULL                            | Payment method (UPI, Card, Wallet, etc.) |
| amount           | DECIMAL(10,2)                                      | NOT NULL                            | Payment amount                           |
| status           | ENUM('pending', 'completed', 'failed', 'refunded') | DEFAULT 'pending'                   | Payment status                           |
| gateway_response | JSON/TEXT                                          | NULL                                | Payment gateway response data            |
| refund_amount    | DECIMAL(10,2)                                      | DEFAULT 0.00                        | Refunded amount                          |
| refund_reason    | TEXT                                               | NULL                                | Refund reason                            |
| paid_at          | TIMESTAMP                                          | NULL                                | Payment completion timestamp             |
| created_at       | TIMESTAMP                                          | DEFAULT CURRENT_TIMESTAMP           | Payment creation date                    |
| updated_at       | TIMESTAMP                                          | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp                    |

**Foreign Keys:**

- FOREIGN KEY (order_id) REFERENCES orders(id)

**Indexes:**

- INDEX idx_order_id (order_id)
- INDEX idx_transaction_id (transaction_id)
- INDEX idx_status (status)

---

### 12. Notifications Table

**Purpose:** System notifications for users

| Column Name | Data Type    | Constraints                 | Description                    |
| ----------- | ------------ | --------------------------- | ------------------------------ |
| id          | UUID/INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique notification identifier |
| user_id     | UUID/INTEGER | NOT NULL, FOREIGN KEY       | Recipient user ID              |
| type        | VARCHAR(50)  | NOT NULL                    | Notification type              |
| title       | VARCHAR(255) | NOT NULL                    | Notification title             |
| message     | TEXT         | NOT NULL                    | Notification message           |
| link        | VARCHAR(500) | NULL                        | Related link URL               |
| is_read     | BOOLEAN      | DEFAULT FALSE               | Read status                    |
| created_at  | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP   | Notification creation date     |

**Foreign Keys:**

- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

**Indexes:**

- INDEX idx_user_id (user_id)
- INDEX idx_is_read (is_read)
- INDEX idx_created_at (created_at)

---

## 🔗 Entity Relationship Diagram (ERD)

```
Users (1) ────< (0..1) Farmers
  │
  │ (1)
  ├───< (N) Products
  │
  │ (1)
  ├───< (N) Cart
  │
  │ (1)
  ├───< (N) Orders (as buyer)
  │
  │ (1)
  ├───< (N) Orders (as farmer)
  │
  │ (1)
  ├───< (N) Reviews
  │
  │ (1)
  ├───< (N) Wishlist
  │
  │ (1)
  └───< (N) Addresses

Categories (1) ────< (N) Products

Products (1) ────< (N) Cart
  │
  │ (1)
  ├───< (N) Order_Items
  │
  │ (1)
  ├───< (N) Reviews
  │
  │ (1)
  └───< (N) Wishlist

Orders (1) ────< (N) Order_Items
  │
  │ (1)
  ├───< (N) Payments
  │
  │ (1)
  └───< (N) Reviews
```

---

## 📱 Application Flow

### **User Registration & Authentication Flow**

```
1. User visits website
   ↓
2. Chooses role (Farmer/Buyer) at registration
   ↓
3. Fills registration form (name, email, password, etc.)
   ↓
4. System creates user record in Users table with selected role
   ↓
5. If Farmer: Creates additional record in Farmers table
   ↓
6. Email verification sent
   ↓
7. User logs in with credentials
   ↓
8. JWT token generated and stored
   ↓
9. Redirect based on role:
   - Farmer → /farmer/dashboard
   - Buyer → /buyer/dashboard
```

### **Farmer Workflow**

```
1. Farmer Dashboard
   ├── View Stats (Total Products, Orders, Sales, Rating)
   ├── Recent Orders
   ├── My Listings
   └── Quick Actions

2. Add Product Listing
   ├── Fill product form (name, category, price, quantity, description, images)
   ├── Set delivery options (self-delivery, courier, pickup)
   ├── Submit → Creates record in Products table
   └── Product appears in marketplace

3. Manage Products
   ├── View all listings
   ├── Edit product details
   ├── Update stock quantity
   ├── Deactivate/Activate listings
   └── Delete products

4. Order Management
   ├── View incoming orders
   ├── Update order status (Confirmed → Processing → Shipped → Delivered)
   ├── Add tracking number for courier orders
   └── Handle cancellations/returns

5. Analytics & Reports
   ├── Sales reports
   ├── Product performance
   └── Revenue tracking
```

### **Buyer Workflow**

```
1. Browse Products
   ├── View product listings
   ├── Filter by category, price, rating
   ├── Search products
   └── View product details

2. Product Details
   ├── View images, description, price
   ├── Check availability and stock
   ├── View farmer information and rating
   ├── Read reviews
   └── Select quantity

3. Shopping Cart
   ├── Add products to cart
   ├── Update quantities
   ├── Remove items
   └── View cart total

4. Checkout Process
   ├── Review cart items
   ├── Select/Add delivery address
   ├── Choose delivery method
   ├── Apply discounts (if any)
   ├── Select payment method
   ├── Place order → Creates Order record
   ├── Process payment → Creates Payment record
   └── Order confirmation

5. Order Tracking
   ├── View order history
   ├── Track order status
   ├── View tracking number (if shipped)
   └── Cancel order (if pending)

6. Post-Order
   ├── Mark as delivered
   ├── Write review and rating
   └── Add to wishlist for future

7. Account Management
   ├── Manage saved addresses
   ├── View wishlist
   ├── Update profile
   └── View notifications
```

### **Order Processing Flow**

```
1. Buyer places order
   ↓
2. System creates Order record (status: 'pending')
   ↓
3. Creates Order_Items records for each product
   ↓
4. Reduces product stock_quantity
   ↓
5. Notification sent to Farmer
   ↓
6. Payment processing
   ├── Payment gateway integration
   ├── Creates Payment record
   └── Updates payment_status
   ↓
7. Farmer confirms order (status: 'confirmed')
   ↓
8. Farmer processes order (status: 'processing')
   ↓
9. Farmer ships/dispatches (status: 'shipped')
   ├── Adds tracking number
   └── Notification to Buyer
   ↓
10. Buyer receives order (status: 'delivered')
    ├── Buyer confirms delivery
    └── Order marked as delivered
    ↓
11. Buyer writes review (optional)
    ├── Creates Review record
    └── Updates product rating
    ↓
12. Payment released to Farmer (if escrow system)
```

### **Search & Discovery Flow**

```
1. Buyer searches for products
   ↓
2. System queries Products table
   ├── Full-text search on name, description
   ├── Filter by category
   ├── Filter by price range
   ├── Filter by rating
   └── Sort by relevance/price/rating
   ↓
3. Display search results
   ├── Product cards with key info
   ├── Pagination
   └── Faceted filters
   ↓
4. Buyer clicks product
   ↓
5. Load product details
   ├── Product information
   ├── Farmer profile
   ├── Reviews and ratings
   └── Related products
```

---

## 🔑 Key Business Rules

1. **User Roles:**
   - A user can only have one role (farmer OR buyer)
   - Farmers can list products and receive orders
   - Buyers can purchase products and write reviews

2. **Product Management:**
   - Only farmers can create/edit/delete their own products
   - Products must have stock > 0 to be purchasable
   - Product prices can be updated but order prices are locked

3. **Order Management:**
   - Minimum order quantity must be met
   - Stock is reserved when order is placed
   - Orders can only be cancelled if status is 'pending' or 'confirmed'
   - Payment must be completed before order is confirmed

4. **Reviews:**
   - Only buyers who purchased the product can review
   - One review per product per buyer
   - Reviews require admin approval before publishing

5. **Cart:**
   - Cart is user-specific and session-based
   - Cart items expire after 7 days of inactivity
   - Prices in cart may differ from current product prices

6. **Stock Management:**
   - Stock is reduced when order is placed
   - Stock is increased if order is cancelled
   - Products with stock = 0 are automatically marked inactive

---

## 📊 Database Statistics Queries

### Popular Products

```sql
SELECT p.*, COUNT(oi.id) as total_orders
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id
ORDER BY total_orders DESC, p.rating DESC
LIMIT 10;
```

### Top Farmers

```sql
SELECT u.name, f.farm_name, COUNT(DISTINCT o.id) as total_orders, SUM(o.total_amount) as total_revenue
FROM users u
JOIN farmers f ON u.id = f.id
LEFT JOIN orders o ON u.id = o.farmer_id AND o.order_status = 'delivered'
GROUP BY u.id
ORDER BY total_revenue DESC
LIMIT 10;
```

### Monthly Sales Report

```sql
SELECT
    DATE_FORMAT(ordered_at, '%Y-%m') as month,
    COUNT(*) as total_orders,
    SUM(total_amount) as total_revenue
FROM orders
WHERE order_status = 'delivered'
GROUP BY month
ORDER BY month DESC;
```

---

## 🔒 Security Considerations

1. **Password Security:**
   - Passwords must be hashed using bcrypt/argon2
   - Minimum password requirements enforced

2. **Data Privacy:**
   - Personal information encrypted at rest
   - Payment information never stored in plain text
   - Bank details encrypted

3. **Access Control:**
   - Role-based access control (RBAC)
   - Farmers can only manage their own products
   - Buyers can only view/edit their own orders

4. **Input Validation:**
   - All user inputs validated and sanitized
   - SQL injection prevention (parameterized queries)
   - XSS protection

---

## 🚀 Future Enhancements

1. **Multi-vendor orders** - Buyer can order from multiple farmers in one cart
2. **Auction system** - Farmers can list products for bidding
3. **Subscription model** - Recurring orders for buyers
4. **Live chat** - Direct communication between farmers and buyers
5. **Geolocation** - Find nearby farmers and products
6. **Advanced analytics** - Farmer and buyer dashboards with insights
7. **Mobile app** - Native mobile applications
8. **Payment gateway integration** - Razorpay, Stripe, etc.
9. **Inventory management** - Advanced stock tracking
10. **Shipping integration** - Direct integration with courier services

