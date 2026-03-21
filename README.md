# 🛒 Full Stack E-Commerce Website

A production-ready full-stack E-Commerce platform built using React, Node.js, Express, and MongoDB.
This project includes authentication, admin dashboard, product management, cart system, and order processing.

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

---

# ✨ Features

## Authentication

* User Signup & Login
* JWT-based Authentication
* Protected Routes
* Role-based Access (Admin / User)
* Password Hashing

## User Features

* Browse Products
* Product Search
* Filter by Category
* Sort by Price
* Product Details Page
* Add to Cart
* Remove from Cart
* Update Quantity
* Checkout
* Place Orders
* Order History

## Admin Features

* Admin Dashboard
* Add Product
* Edit Product
* Delete Product
* Upload Product Images
* Manage Categories
* View Orders
* Update Order Status

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
* Order

---

# 🔌 API Routes

## Auth

POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile

## Products

GET /api/products
GET /api/products/:id
POST /api/products (admin)
PUT /api/products/:id (admin)
DELETE /api/products/:id (admin)

## Cart

GET /api/cart
POST /api/cart
PUT /api/cart/:id
DELETE /api/cart/:id

## Orders

POST /api/orders
GET /api/orders
GET /api/orders/my
PUT /api/orders/:id (admin)

---

# ⚙️ Environment Variables

Create `.env` in server folder:

```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
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
2. User proceeds to checkout
3. User enters shipping details
4. Order stored in database
5. Cart cleared after order

---

# 🎨 UI Features

* Responsive design
* Modern layout
* Navbar with cart count
* Loading spinners
* Error handling
* Toast notifications

---

# 🔐 Middleware

* authMiddleware
* adminMiddleware
* errorHandler

---

# 🚀 Deployment

Frontend: Vercel
Backend: Render
Database: MongoDB Atlas

---

# 📌 Future Improvements

* Wishlist feature
* Payment gateway integration
* Product reviews & ratings
* Pagination
* Email notifications

---

# 👨‍💻 Author

Chinmaya Panda

---

# ⭐ If you like this project

Give it a star on GitHub!
