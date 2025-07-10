@echo off
echo Setting up Firebase Storage CORS...

echo Applying CORS configuration to Firebase Storage...
gsutil cors set storage-cors.json gs://rebuildofficial-fit.firebasestorage.app

echo CORS configuration applied successfully!
echo.
echo Firebase Storage Security Rules:
echo Please make sure to update your Firebase Storage Security Rules in the Firebase Console
echo Copy the contents of storage.rules to your Firebase Storage Rules
echo.
echo Firestore Security Rules:
echo Please make sure to update your Firestore Security Rules in the Firebase Console  
echo Copy the contents of firestore.rules to your Firestore Rules
echo.
pause
