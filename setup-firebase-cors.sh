#!/bin/bash

echo "Setting up Firebase Storage CORS..."

# Check if gcloud is installed
if ! command -v gsutil &> /dev/null
then
    echo "Error: Google Cloud SDK is not installed."
    echo "Please install Google Cloud SDK first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo "Applying CORS configuration to Firebase Storage..."
gsutil cors set storage-cors.json gs://rebuildofficial-fit.firebasestorage.app

if [ $? -eq 0 ]; then
    echo "CORS configuration applied successfully!"
    echo ""
    echo "Firebase Storage Security Rules:"
    echo "Please make sure to update your Firebase Storage Security Rules in the Firebase Console"
    echo "Copy the contents of storage.rules to your Firebase Storage Rules"
    echo ""
    echo "Firestore Security Rules:"
    echo "Please make sure to update your Firestore Security Rules in the Firebase Console"
    echo "Copy the contents of firestore.rules to your Firestore Rules"
else
    echo "Error: Failed to apply CORS configuration"
    echo "Please make sure you are authenticated with gcloud and have proper permissions"
fi
