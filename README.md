# 🐰 Bunny App

A modern social media mobile application built with React Native and Expo, powered by Supabase backend, featuring real-time updates, user interactions, and a seamless user experience.

![Bunny App](readme_assets/image_1.png)

## 📱 About

Bunny App is a full-featured social networking platform that allows users to share posts, interact with content, receive real-time notifications, and manage their profiles. Built with cutting-edge technologies, it provides a smooth and responsive experience across iOS and Android devices.

## ✨ Key Features

### 🔐 Authentication

- User registration and login
- Secure authentication with Supabase
- Session management with persistent storage

### 📝 Posts & Content

- Create, edit, and delete posts
- Rich text editor for content creation
- Image and media upload support
- Real-time post updates across all users
- Infinite scroll with pagination

### 💬 Social Interactions

- Like and unlike posts
- Comment on posts
- Real-time comment updates
- View post details with full comment threads

### 🔔 Notifications

- Real-time notification system
- Notification badge counter
- Push notifications for likes and comments
- Notification history

### 👤 User Profiles

- View and edit user profiles
- Profile picture upload
- User bio and information management
- View user's posts

### 🎨 UI/UX

- Clean and modern interface
- Custom icons and components
- Smooth animations and transitions
- Avatar components with fallback images
- Responsive design

## 🛠️ Technologies Used

### Core Framework

- **React Native** (0.81.5) - Cross-platform mobile framework
- **Expo** (~54.0.30) - Development and build platform
- **TypeScript** (~5.9.2) - Type-safe development
- **Expo Router** (~6.0.21) - File-based routing

### Backend & Database

- **Supabase** (^2.89.0) - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - Storage for images

### State Management & Storage

- **React Context API** - Global state management
- **Async Storage** (2.2.0) - Persistent local storage

### UI Components & Styling

- **React Native Elements** (^4.0.0-rc.8) - UI component library
- **React Native SVG** (15.12.1) - SVG rendering
- **Expo Image** (~3.0.11) - Optimized image component
- **React Native Gesture Handler** (~2.28.0) - Touch interactions
- **React Native Reanimated** (~4.1.1) - Smooth animations

### Rich Content

- **React Native Pell Rich Editor** (^1.10.0) - Rich text editing
- **React Native Render HTML** (^6.3.4) - HTML content rendering

### Media & File Handling

- **Expo Image Picker** (~17.0.10) - Image selection
- **Expo File System** (~19.0.21) - File operations
- **Base64 ArrayBuffer** (^1.0.2) - File encoding

### Utilities

- **Moment.js** (^2.30.1) - Date and time formatting
- **Expo Haptics** (~15.0.8) - Haptic feedback

## 📁 Project Structure

```
bunny-app/
├── app/                    # Application screens
│   ├── (auth)/            # Authentication screens
│   │   ├── login.tsx
│   │   └── signUp.tsx
│   ├── (main)/            # Main app screens
│   │   ├── home.tsx
│   │   ├── profile.tsx
│   │   ├── edit-profile.tsx
│   │   ├── new-post.tsx
│   │   ├── post-details.tsx
│   │   └── notifications.tsx
│   ├── _layout.tsx
│   ├── index.tsx
│   └── welcome.tsx
├── assets/                # Static assets
│   ├── icons/            # Custom icon components
│   └── images/           # Images and logos
├── components/           # Reusable components
│   ├── common/          # Shared components
│   ├── home/            # Home screen components
│   ├── notifications/   # Notification components
│   └── post-details/    # Post detail components
├── constants/           # App constants
├── context/            # React Context providers
├── helpers/            # Utility functions
├── lib/                # Third-party configurations
├── services/           # API and service layer
│   ├── posts-services.ts
│   ├── user-services.ts
│   ├── notification-services.ts
│   └── image-services.ts
└── types/             # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or Bun package manager
- Expo CLI
- Expo Go app (for testing on physical devices)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd bunny-app
```

2. Install dependencies

```bash
bun install
# or
npm install
```

3. Set up Supabase

- Create a Supabase project
- Configure the database schema
- Add your Supabase credentials to the environment

4. Start the development server

```bash
bun start
# or
npm start
```

5. Run on your preferred platform

```bash
# iOS
bun ios

# Android
bun android

# Web
bun web
```

## 🔄 Real-time Features

The app uses Supabase real-time subscriptions to provide instant updates:

- **Post updates** - New posts appear immediately in the feed
- **Comment updates** - Comments are synchronized across users
- **Notifications** - Real-time notification delivery
- **Post modifications** - Edits and deletions reflect instantly

## 📱 Screens

- **Welcome Screen** - Onboarding experience
- **Login/Sign Up** - User authentication
- **Home Feed** - Main timeline with posts
- **New Post** - Create and edit posts
- **Post Details** - View post with comments
- **Profile** - User profile with posts
- **Edit Profile** - Update user information
- **Notifications** - View all notifications

## 🎨 Theme & Design

The app features a custom theme system with:

- Consistent color palette
- Typography scale
- Spacing system
- Border radius values
- Reusable style constants

## 📄 License

This project is private and proprietary.

## 👨‍💻 Author

Built with ❤️ using React Native and Expo
