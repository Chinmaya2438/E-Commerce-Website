# 🛒 Full Stack E-Commerce Website

A **production-ready full-stack E-Commerce platform** built using **React, Node.js, Express, and MongoDB**.
This project includes authentication, admin dashboard, Stripe payments, coupons, wishlist, invoices, address book, and advanced security.

---

# 🚀 Tech Stack

## Frontend

* React (Vite)
* Tailwind CSS
* React Router
* Axios
* Context API

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt
* Multer
* Cloudinary
* Stripe

---

# ✨ Features

## 🔐 Authentication

* Register & Login
* Forgot / Reset Password (Email Link)
* JWT Authentication
* Role-based Access (Admin / User)
* bcrypt Password Hashing

## 🛍️ Products

* Browse Products
* Product Search
* Category Filter
* Price Range Slider with Histogram
* Sort by Price / Date
* Product Detail Pages
* Image Upload via Cloudinary

## 🛒 Cart

* Add to Cart
* Remove from Cart
* Update Quantity
* Persistent DB-backed Cart

## ❤️ Wishlist

* Add to Wishlist
* Remove from Wishlist
* Wishlist Page

## 💳 Stripe Payment

* Stripe Checkout Sessions
* Secure Redirect Flow
* Payment Verification
* Test Card Support (4242...)

## 📦 Orders

* Place Orders
* Order History
* Cancel Pending Orders
* Order Status Tracking
  (Pending / Shipped / Delivered / Cancelled)

## 🧾 Invoices

* Download PDF Invoice
* Generated per order

## 🎟️ Coupons

* Admin Created Coupons
* Percentage or Flat Discount
* Apply at Checkout
* Discount in Order Summary

## 👤 User Profile

* Edit Profile
* Profile Picture Upload
* Change Password
* Multi Address Book

## 📍 Address Book

* Multiple Shipping Addresses
* Default Address
* Quick Checkout Selection
* Auto Fill Address

## 🛡️ Admin Dashboard

* Manage Products (CRUD)
* Manage Orders
* Update Order Status
* Manage Users
* Manage Coupons

## 🔒 Security

* Helmet
* Rate Limiting
* Mongo Sanitization
* CORS Whitelist
* bcrypt Hashing

## 🎨 UI/UX

* Responsive Design
* Animations
* Glassmorphism Navbar
* Toast Notifications
* Loading Spinners

---

# 📂 Project Structure

```
E-Commerce-Website/
│
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── hooks/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   └── server.js
│
└── README.md
```

---

# 🗄️ Database Models

* User
* Product
* Cart
* Wishlist
* Order
* Coupon
* Address

---

# 🔌 API Routes

## Auth

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/profile
```

## Products

```
GET    /api/products
GET    /api/products/:id
POST   /api/products (admin)
PUT    /api/products/:id (admin)
DELETE /api/products/:id (admin)
```

## Cart

```
GET    /api/cart
POST   /api/cart
PUT    /api/cart/:id
DELETE /api/cart/:id
```

## Wishlist

```
GET    /api/wishlist
POST   /api/wishlist
DELETE /api/wishlist/:id
```

## Orders

```
POST /api/orders
GET  /api/orders
GET  /api/orders/my
PUT  /api/orders/:id (admin)
```

## Coupons

```
POST   /api/coupons (admin)
GET    /api/coupons
DELETE /api/coupons/:id (admin)
```

---

# ⚙️ Environment Variables

Create `.env` inside `server` folder:

```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret

STRIPE_SECRET_KEY=your_stripe_secret
CLIENT_URL=http://localhost:5173
```

---

# 🛠️ Installation

## Clone repository

```
git clone https://github.com/yourusername/ecommerce.git
cd ecommerce
```

## Install dependencies

```
cd server
npm install

cd ../client
npm install
```

---

# ▶️ Running the Application

## Run Backend

```
cd server
npm run dev
```

## Run Frontend

```
cd client
npm run dev
```

---

# 🔄 Order Flow

1. User adds products to cart
2. User selects address
3. User applies coupon (optional)
4. Stripe Checkout session created
5. Payment completed
6. Order saved in database
7. Invoice generated
8. Cart cleared

---

# 🔐 Middleware

* authMiddleware
* adminMiddleware
* rateLimiter
* errorHandler
* mongoSanitize

---

# 🚀 Deployment

Frontend: Vercel
Backend: Render
Database: MongoDB Atlas
Images: Cloudinary
Payments: Stripe

---

# 👨‍💻 Author

**Chinmaya Panda**

---

# ⭐ If you like this project

Give it a star on GitHub!
