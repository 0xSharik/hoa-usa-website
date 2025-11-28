# Firebase & Cloudinary Setup Guide

## Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Enable Firestore Database in test mode

2. **Get Firebase Configuration**
   - In Firebase Console, go to Project Settings
   - Under "Your apps", add a web app
   - Copy the configuration values to your `.env` file

3. **Set Up Firestore Rules**
   - In Firestore Database, go to "Rules" tab
   - Add these rules (for development - tighten for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Cloudinary Setup

1. **Create Cloudinary Account**
   - Go to [Cloudinary](https://cloudinary.com/)
   - Sign up for a free account

2. **Get Cloudinary Configuration**
   - Go to Dashboard → Settings → Upload
   - Find your "Cloud name"
   - Create an "Upload preset" with unsigned mode
   - Copy the values to your `.env` file

3. **Configure Upload Preset**
   - Go to Settings → Upload → Upload presets
   - Create a new preset with:
     - Signing mode: Unsigned
     - Allowed formats: Images
     - Folder: Optional (e.g., "hoa-resources")

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Add your actual Firebase and Cloudinary credentials to `.env.local`.

## Required Packages

Make sure these packages are installed:

```bash
npm install firebase
```

## Features

### Firebase Integration
- ✅ Real-time data synchronization
- ✅ Persistent storage across sessions
- ✅ Automatic timestamp management
- ✅ CRUD operations for all resource types

### Cloudinary Integration
- ✅ Image upload and optimization
- ✅ Automatic transformations
- ✅ CDN delivery
- ✅ Fallback to YouTube thumbnails for videos

### Admin Panel
- ✅ Firebase-powered CRUD operations
- ✅ Image upload with Cloudinary
- ✅ YouTube URL processing
- ✅ Auto-generated metadata
- ✅ Error handling and loading states

### Frontend
- ✅ Real-time updates from Firebase
- ✅ Responsive design
- ✅ Video embedding
- ✅ Search and filtering
- ✅ Loading and error states

## Next Steps

1. Set up Firebase project
2. Set up Cloudinary account
3. Configure environment variables
4. Test the integration
5. Deploy to production with proper security rules
