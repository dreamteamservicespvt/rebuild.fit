# Firebase Setup Instructions

This document provides step-by-step instructions to resolve CORS issues and set up Firebase properly for the Rebuild.fit admin dashboard.

## Issues Fixed

1. ✅ **CORS Policy Issues** - Fixed Firebase Storage CORS configuration
2. ✅ **Authentication System** - Added admin authentication
3. ✅ **Protected Routes** - Admin dashboard now requires authentication
4. ✅ **Firebase Security Rules** - Updated storage and firestore rules
5. ✅ **Image Upload** - Fixed image upload with proper authentication

## Setup Steps

### 1. Install Google Cloud SDK (Required for CORS setup)

**Windows:**
- Download from: https://cloud.google.com/sdk/docs/install-sdk
- Run the installer and follow the setup wizard

**Mac:**
```bash
brew install google-cloud-sdk
```

**Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

### 2. Authenticate with Google Cloud

```bash
gcloud auth login
gcloud config set project rebuildofficial-fit
```

### 3. Apply CORS Configuration

**Windows:**
```cmd
setup-firebase-cors.bat
```

**Mac/Linux:**
```bash
chmod +x setup-firebase-cors.sh
./setup-firebase-cors.sh
```

### 4. Update Firebase Security Rules

#### Storage Rules:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `rebuildofficial-fit`
3. Go to Storage → Rules
4. Copy the contents of `storage.rules` and paste it
5. Click "Publish"

#### Firestore Rules:
1. Go to Firestore Database → Rules
2. Copy the contents of `firestore.rules` and paste it
3. Click "Publish"

### 5. Create Admin User

Run this command to create the admin user:

```bash
npm run setup:admin
```

**Default Admin Credentials:**
- **Email:** admin@rebuild.com
- **Password:** RebuildAdmin2025!

> ⚠️ **Important:** Change the password after first login!

### 6. Test the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:8080/admin/login`

3. Login with the admin credentials

4. Try uploading an image in any admin section

## Files Modified/Created

### New Files:
- `storage-cors.json` - CORS configuration for Firebase Storage
- `storage.rules` - Security rules for Firebase Storage
- `firestore.rules` - Security rules for Firestore
- `src/contexts/AuthContext.tsx` - Authentication context
- `src/components/ProtectedRoute.tsx` - Route protection
- `src/pages/AdminLogin.tsx` - Admin login page
- `src/scripts/createAdmin.ts` - Admin user creation script
- `setup-firebase-cors.bat` - Windows CORS setup script
- `setup-firebase-cors.sh` - Mac/Linux CORS setup script

### Modified Files:
- `src/App.tsx` - Added authentication provider and protected routes
- `src/lib/firebaseServices.ts` - Added authentication checks
- `src/components/ImageUpload.tsx` - Added authentication validation
- `package.json` - Added setup scripts

## Troubleshooting

### CORS Issues Persist:
1. Make sure you ran the CORS setup script successfully
2. Wait 5-10 minutes for changes to propagate
3. Clear browser cache and cookies
4. Check if you're authenticated with the correct Google account

### Authentication Issues:
1. Verify the admin user was created successfully
2. Check Firebase Console → Authentication → Users
3. Ensure Firestore rules are published correctly

### Image Upload Issues:
1. Make sure you're logged in as admin
2. Check browser console for detailed error messages
3. Verify Firebase Storage rules are applied
4. Ensure file size is under 5MB

### Getting Help:
1. Check browser console for error messages
2. Check Firebase Console logs
3. Verify all security rules are published
4. Ensure CORS configuration was applied successfully

## Production Deployment

Before deploying to production:

1. **Change admin password** from the default
2. **Update CORS origins** in `storage-cors.json` to include your production domain
3. **Re-apply CORS settings** for the production domain
4. **Test all functionality** in production environment

## Security Notes

- The admin email is hardcoded as `admin@rebuild.com`
- Only this email has admin access
- All admin operations require authentication
- File uploads are restricted to authenticated admin users
- Public read access is allowed for uploaded content

---

**Support:** If you encounter any issues, please check the browser console and Firebase Console logs for detailed error messages.
