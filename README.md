# 🏥 MediLinks – A Unified Platform for Surplus Medicine Redistribution

MediLinks is a crowdsourced platform for the donation, resale, and redistribution of surplus medicines. It connects donors, NGOs, pharmacies, and patients in need, with a mobile-first design and AI-powered features to ensure safe and efficient medicine sharing.

---

## 📱 Mobile App (Flutter)

### Features
- Medicine donation via manual entry or barcode scan
- AI-based OCR for medicine label extraction
- User authentication
- Upload with expiry date, condition, and quantity
- Real-time donation listing & tracking

### Technologies
- Flutter + Dart
- REST API (Node.js Backend)
- Integration with camera & barcode scanner

---

## 💻 Admin Panel (React.js)

### Features
- Admin dashboard
- User management
- Listing and donation approval
- Activity logs & analytics

### Technologies
- React.js 
- REST API
---

## 🔙 Backend (Node.js + Express)

### Features
- JWT-based auth system (access + refresh tokens)
- REST API for users, medicines, listings, logs
- Handles file uploads and validation
- Connects to both PostgreSQL and MongoDB

### Tech Stack
- Node.js + Express
- PostgreSQL (medicine data)
- MongoDB (logs & activity tracking)
- JWT authentication
- Multer (file uploads)
- Jest + Supertest (testing)

---

## 🧪 Testing

### Flutter (Mobile App)

**Unit & Widget Tests**
```bash
flutter test
