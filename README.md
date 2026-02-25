# 💍 অলকানন্দা - Handmade Churi E-commerce

বাংলায় তৈরি সম্পূর্ণ হ্যান্ডমেড চুড়ির ই-কমার্স ওয়েবসাইট।

## 🛠️ Tech Stack
- **Frontend**: React.js + React Router + Axios
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT Token

## 📁 Project Structure
```
alakananda/
├── frontend/          # React App
│   └── src/
│       ├── pages/     # সব পেইজ
│       │   ├── Home.js
│       │   ├── Products.js
│       │   ├── ProductDetail.js
│       │   ├── Cart.js
│       │   ├── Checkout.js
│       │   ├── Login.js
│       │   ├── Signup.js
│       │   ├── MyOrders.js
│       │   ├── Profile.js
│       │   └── admin/
│       │       ├── Dashboard.js
│       │       ├── Products.js
│       │       ├── AddProduct.js
│       │       ├── Orders.js
│       │       └── Customers.js
│       ├── components/
│       │   ├── Navbar.js
│       │   ├── Footer.js
│       │   └── ProductCard.js
│       └── context/
│           ├── AuthContext.js
│           └── CartContext.js
└── backend/
    ├── models/        # MongoDB Models
    ├── routes/        # API Routes
    ├── middleware/    # Auth Middleware
    └── server.js
```

## 🚀 Setup করার নিয়ম

### ১. MongoDB ইনস্টল করুন
- MongoDB Community Server ডাউনলোড করুন: https://www.mongodb.com/try/download/community

### ২. Backend চালু করুন
```bash
cd backend
npm install
cp .env.example .env
# .env ফাইলে MongoDB URI এবং JWT_SECRET সেট করুন
npm run dev
```

### ৩. Frontend চালু করুন
```bash
cd frontend
npm install
# .env ফাইল তৈরি করুন:
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
npm start
```

### ৪. Admin একাউন্ট তৈরি করুন
MongoDB তে সরাসরি বা backend দিয়ে signup করে role 'admin' করুন:
```js
// MongoDB Compass বা shell থেকে:
db.users.updateOne({ email: "admin@alakananda.com" }, { $set: { role: "admin" } })
```

## ✨ Features

### Customer:
- ✅ Signup / Login
- ✅ পণ্য ব্রাউজ করা (Category, Search, Sort)
- ✅ পণ্যের বিস্তারিত দেখা
- ✅ Cart এ পণ্য যোগ/বাদ দেওয়া
- ✅ Checkout (bKash, Nagad, Card, COD)
- ✅ অর্ডার ট্র্যাক করা
- ✅ প্রোফাইল আপডেট

### Admin:
- ✅ Dashboard (Stats, Recent Orders)
- ✅ পণ্য যোগ/সম্পাদনা/মুছে দেওয়া
- ✅ ছবি আপলোড
- ✅ অর্ডার স্ট্যাটাস আপডেট
- ✅ কাস্টমার লিস্ট (Cart & Order দেখা)

## 🎨 Categories
- 💝 সেট/কম্বো
- ✨ মেটাল/ধাতু  
- 🎀 সুতা/কাপড়
