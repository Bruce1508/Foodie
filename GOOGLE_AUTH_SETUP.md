# 🔐 Google Authentication Setup Guide

## Tổng quan
Hướng dẫn này sẽ giúp bạn setup Google Sign-In cho ứng dụng StudyBuddy (React Native + Express.js).

## 📋 Checklist Cần Thiết

### 1. Google Cloud Console Setup

#### Bước 1: Tạo Google Cloud Project
1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Enable Google+ API và Google OAuth2 API

#### Bước 2: Tạo OAuth 2.0 Credentials
1. Vào **APIs & Services > Credentials**
2. Click **"Create Credentials" > "OAuth 2.0 Client IDs"**
3. Tạo 3 client IDs cho các platform:

**Android Client ID:**
- Application type: Android
- Package name: `com.foodie.foodieapp`
- SHA-1 certificate fingerprint: (xem hướng dẫn dưới)

**iOS Client ID:**
- Application type: iOS
- Bundle ID: `com.foodie.foodieapp`

**Web Client ID:**
- Application type: Web application
- Authorized redirect URIs:
  - `http://localhost:5000/auth/callback` (Backend API)
  - `https://auth.expo.io/@antvo158/foodieapp` (Expo Auth)
  - `exp://10.248.189.105:8081` (Local Expo dev - thay IP theo máy bạn)

**⚠️ Lưu ý quan trọng:**
- Thay `your-expo-username` bằng username Expo của bạn
- Thay `studybuddy-app` bằng slug trong app.json của bạn
- URL Expo thực tế sẽ hiển thị khi bạn chạy `npx expo start`

#### Bước 3: Lấy SHA-1 Certificate Fingerprint (Android)
```bash
# Development keystore
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Production keystore (khi build release)
keytool -list -v -keystore path/to/your/keystore.jks -alias your-alias
```

### 2. Frontend Configuration

#### Cập nhật app.json
Mở `studybuddy-app/frontend/app.json` và thay:
```json
{
  "expo": {
    "extra": {
      "googleAuthConfig": {
        "androidClientId": "1075082404053-jmj3m9v7dhbdmei28l9u5pdl5ii4bt1o.apps.googleusercontent.com",
        "iosClientId": "1075082404053-mhsjr933sulooh7bcbfdp94fco8l5chi.apps.googleusercontent.com", 
        "webClientId": "1075082404053-00n9e8ch4i3d8f0mc10pp69v1n0cjub8.apps.googleusercontent.com"
      }
    },
    "ios": {
      "bundleIdentifier": "com.foodie.foodieapp"
    },
    "android": {
      "package": "com.foodie.foodieapp"
    }
  }
}
```

#### Install Dependencies
```bash
cd frontend
npm install
# hoặc
yarn install
```

### 3. Backend Configuration

#### Tạo file .env
Tạo file `.env` trong folder `backend/` với nội dung từ `env-template.txt`:
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/studybuddy

# Google OAuth
GOOGLE_CLIENT_ID=YOUR_WEB_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGINS=http://localhost:8081,exp://192.168.1.100:8081
```

#### Install Dependencies
```bash
cd backend
npm install
# hoặc
yarn install
```

#### Setup Database
1. Tạo PostgreSQL database
2. Chạy schema: `psql -d your_database -f src/database/schema.sql`

### 4. Running the Application

#### Start Backend
```bash
cd backend
npm run dev
```

#### Start Frontend 
```bash
cd frontend
npx expo start
```

## 🔧 Troubleshooting

### Common Issues

**1. CORS Error**
- Kiểm tra IP address trong CORS_ORIGINS
- Đảm bảo port đúng (8081 cho Expo)

**2. Google Sign-In Failed**
- Kiểm tra Client IDs đã đúng chưa
- Đảm bảo bundle ID/package name khớp
- Kiểm tra SHA-1 fingerprint (Android)

**3. Database Connection Error**
- Kiểm tra DATABASE_URL
- Đảm bảo PostgreSQL đang chạy
- Chạy schema.sql

**4. JWT Token Error**
- Kiểm tra JWT_SECRET
- Đảm bảo secret đủ mạnh

## 🔄 Development vs Production

### Development
- Sử dụng debug keystore (SHA-1 tự động)
- localhost URLs
- Development Google Client IDs

### Production  
- Tạo production keystore
- Domain/IP thật
- Production Google Client IDs
- Environment variables secure

## 📱 Testing

1. **Test Backend**: `GET http://localhost:3000/health`
2. **Test Frontend**: Mở Expo app và test Google Sign-In
3. **Test Database**: Kiểm tra users table sau khi đăng nhập

## 🚀 Next Steps

Sau khi setup thành công:
1. Customize user profile
2. Add more OAuth providers (Apple, Facebook)
3. Implement email/password authentication
4. Add role-based permissions
5. Setup refresh tokens

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra console logs (frontend & backend)
2. Verify tất cả environment variables
3. Test từng component riêng biệt
4. Kiểm tra Google Cloud Console settings