# Cloudinary Upload Troubleshooting Guide

## Common Upload Errors and Solutions

### "Upload failed: Bad Request. Upload preset not found"

This error occurs when the upload preset specified in your code doesn't exist in your Cloudinary account or isn't properly configured.

#### Solution:

1. **Log into your Cloudinary Dashboard**:
   - Visit https://cloudinary.com/console
   - Log in with your account credentials

2. **Check Upload Presets**:
   - Navigate to Settings > Upload
   - Scroll down to "Upload presets" section

3. **Create or Verify Upload Preset**:
   - Look for "rebuild_fit" preset in the list
   - If it doesn't exist, click "Add upload preset"
   - Set the preset name to "rebuild_fit"
   - Under "Signing Mode", select "Unsigned"
   - Under "Folder", enter "rebuild_gym" (optional)
   - Save the settings

4. **Configure Upload Preset Settings**:
   - Access restrictions: None (for client-side uploads)
   - Delivery type: Upload
   - Enable the preset

5. **Check Cloud Name**:
   - Verify your cloud name in Settings > Account details
   - Make sure it matches the cloud name in your code (currently set to "dvmrhs2ek")

6. **Modify the Code (if needed)**:
   - Update `src/lib/cloudinaryService.ts` with the correct cloud name and upload preset
   - The preset must match exactly what's in your Cloudinary dashboard

7. **Test Upload Again**:
   - Try uploading a small image (less than 1MB)
   - Check browser console for detailed error messages

### Additional Upload Settings

For optimal security and performance:

1. **Configure Asset Limits**:
   - Max file size: 10MB
   - Allowed formats: jpg, png, gif, webp

2. **Enable Auto-Optimization**:
   - Quality: Auto
   - Format: Auto (delivers WebP to supported browsers)
   - Responsive breakpoints: Enable

3. **Set Up Access Controls**:
   - Consider setting domain restrictions for image delivery
   - Set expiration times for uploads if needed

## Testing Cloudinary Configuration

You can test your Cloudinary configuration with this simple HTML form:

```html
<!DOCTYPE html>
<html>
<body>
  <h1>Cloudinary Test Upload</h1>
  <form>
    <input type="file" id="fileInput">
    <button type="button" id="uploadButton">Upload</button>
  </form>
  <div id="result"></div>

  <script>
    document.getElementById('uploadButton').addEventListener('click', async () => {
      const file = document.getElementById('fileInput').files[0];
      if (!file) return;
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'rebuild_fit');
      
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dvmrhs2ek/image/upload',
        { method: 'POST', body: formData }
      );
      
      const result = await response.json();
      document.getElementById('result').innerHTML = 
        response.ok 
          ? `Success! URL: ${result.secure_url}` 
          : `Error: ${result.error?.message || 'Unknown error'}`;
    });
  </script>
</body>
</html>
```

Save this as `cloudinary-test.html` and open it in a browser to test your configuration directly.

## Cloudinary Documentation References

- [Upload API Reference](https://cloudinary.com/documentation/image_upload_api_reference)
- [Upload Presets](https://cloudinary.com/documentation/upload_presets)
- [Client-Side Upload](https://cloudinary.com/documentation/upload_images#unsigned_upload)
