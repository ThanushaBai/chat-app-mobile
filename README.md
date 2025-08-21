# 🚀 Real-time Chat App (React Native + Node.js)

A complete real-time chat application built with React Native (Expo) frontend and Node.js (Express + Socket.IO) backend.

## 📱 Features

### ✅ **MVP Complete**
- **Authentication**: JWT-based register/login
- **User List**: See all users, tap to chat
- **Real-time Chat**: Live messaging with Socket.IO
- **Typing Indicators**: See when someone is typing
- **Read Receipts**: Message delivery and read status
- **Online Status**: See who's online
- **Image Sharing**: Send photos in chat
- **Profile Management**: Update profile picture

### 🎯 **Mobile-Optimized**
- Native mobile UI with React Native
- Image picker integration
- Keyboard-avoiding views
- Smooth animations
- Touch-friendly interface

## 🏗️ Project Structure

```
chat-app-mobile/
├── server/                 # Backend (Node.js + Express + Socket.IO)
│   ├── src/
│   │   ├── controllers/    # API controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   ├── lib/           # Socket.io, DB, utils
│   │   └── seeds/         # Test data
│   ├── package.json
│   └── .env
└── mobile/                # React Native Frontend (Expo)
    ├── src/
    │   ├── screens/       # App screens
    │   ├── store/         # Zustand state management
    │   ├── components/    # Reusable components
    │   └── services/      # API services
    ├── App.js
    └── package.json
```

## 🚀 Setup Instructions

### **Prerequisites**
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- Expo CLI: `npm install -g @expo/cli`
- Mobile device or emulator

### **1. Server Setup**
```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your values:
# MONGO_URI=mongodb://localhost:27017/chat-app
# JWT_SECRET=your-super-secret-key
# CLOUDINARY_CLOUD_NAME=your-cloudinary-name
# CLOUDINARY_API_KEY=your-api-key  
# CLOUDINARY_API_SECRET=your-api-secret
# PORT=5001

# Seed database with test users
node src/seeds/user.seed.js

# Start server
npm run dev
```

### **2. Mobile Setup**
```bash
cd mobile

# Install dependencies
npm install

# Update server IP in store files
# Edit src/store/useAuthStore.js and src/store/useChatStore.js
# Replace 'http://192.168.1.100:5001' with your computer's IP

# Start Expo
npx expo start

# Scan QR code with Expo Go app (iOS/Android)
# OR run on emulator: npx expo run:android / npx expo run:ios
```

### **3. Network Configuration**

**Important**: Replace the server IP in mobile store files:

```javascript
// In src/store/useAuthStore.js and src/store/useChatStore.js
const BASE_URL = "http://YOUR_COMPUTER_IP:5001"; // e.g., "http://192.168.1.100:5001"
```

To find your IP:
- **Windows**: `ipconfig` → IPv4 Address
- **Mac/Linux**: `ifconfig` → inet address

## 👥 Sample Users (Password: "123456")

```javascript
// Female Users
emma.thompson@example.com
olivia.miller@example.com  
sophia.davis@example.com
ava.wilson@example.com
isabella.brown@example.com
mia.johnson@example.com
charlotte.williams@example.com
amelia.garcia@example.com

// Male Users  
james.anderson@example.com
william.clark@example.com
benjamin.taylor@example.com
lucas.moore@example.com
henry.jackson@example.com
alexander.martin@example.com
daniel.rodriguez@example.com
```

## 📡 API Endpoints

### **Authentication**
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user  
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/check` - Check auth status
- `PUT /api/auth/update-profile` - Update profile

### **Messages**
- `GET /api/messages/users` - Get all users
- `GET /api/messages/:id` - Get conversation messages
- `POST /api/messages/send/:id` - Send message
- `PATCH /api/messages/read/:messageId` - Mark as read

## ⚡ Socket Events

### **Client → Server**
- `typing:start` - User started typing
- `typing:stop` - User stopped typing  
- `message:read` - Message marked as read

### **Server → Client**  
- `getOnlineUsers` - Online users list
- `newMessage` - New message received
- `typing:start` - Someone started typing
- `typing:stop` - Someone stopped typing
- `message:read` - Message was read

## 🔧 Environment Variables

### **Server (.env)**
```env
MONGO_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your-super-secret-jwt-key-here  
PORT=5001

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key  
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Optional
NODE_ENV=development
```

## 🧪 Testing

### **Test Real-time Features**
1. **Multiple Devices**: Install app on 2+ devices
2. **Login Different Users**: Use sample accounts
3. **Test Features**:
   - Send messages → Should appear instantly
   - Start typing → Should show typing indicator  
   - Send image → Should upload and display
   - Go offline → Online status should update

### **Debug Tips**
- Check server console for connection logs
- Use Expo dev tools for mobile debugging
- Ensure devices are on same WiFi network
- Verify server IP is accessible from mobile

## 🎨 Screenshots

*Add screenshots of your app here*

## 🚧 Future Enhancements

- [ ] Push notifications  
- [ ] Voice messages
- [ ] Group chats
- [ ] Message search
- [ ] Dark theme
- [ ] File sharing
- [ ] Message reactions
- [ ] User blocking
- [ ] Chat backup

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For support, email your-email@example.com or create an issue on GitHub.

---

**Built with ❤️ using React Native, Node.js, Socket.IO, and MongoDB**
