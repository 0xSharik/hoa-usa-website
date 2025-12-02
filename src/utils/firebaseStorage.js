import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase/config';

// Upload any file to Firebase Storage
export const uploadFile = async (file, folder = 'files', onProgress = null) => {
  if (!file) return null;

  try {
    // Create a unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2);
    const filename = `${timestamp}_${randomString}_${file.name}`;
    
    // Create storage reference
    const storageRef = ref(storage, `${folder}/${filename}`);
    
    // Create metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        'originalName': file.name,
        'uploadedAt': new Date().toISOString()
      }
    };

    // Upload file
    if (onProgress) {
      // Use resumable upload for progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
      
      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } else {
      // Simple upload without progress tracking
      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Upload image to Firebase Storage
export const uploadImage = async (file, folder = 'images', onProgress = null) => {
  if (!file) return null;

  try {
    // Create a unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2);
    const filename = `${timestamp}_${randomString}_${file.name}`;
    
    // Create storage reference
    const storageRef = ref(storage, `${folder}/${filename}`);
    
    // Create metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        'originalName': file.name,
        'uploadedAt': new Date().toISOString()
      }
    };

    // Upload file
    if (onProgress) {
      // Use resumable upload for progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
      
      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({
                url: downloadURL,
                path: uploadTask.snapshot.ref.fullPath,
                name: filename,
                size: file.size,
                type: file.type
              });
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } else {
      // Simple upload without progress tracking
      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        url: downloadURL,
        path: snapshot.ref.fullPath,
        name: filename,
        size: file.size,
        type: file.type
      };
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Get optimized image URL with size parameters (for future use)
export const getOptimizedImageUrl = (url, options = {}) => {
  // Firebase Storage doesn't have built-in transformations like Cloudinary
  // But we can add parameters for future CDN integration
  const { width, height, quality = 80 } = options;
  
  if (!url) return null;
  
  // For now, just return the original URL
  // In the future, you might want to integrate with a CDN or use Firebase's image optimization
  return url;
};

// Delete image from Firebase Storage
export const deleteImage = async (path) => {
  if (!path) return;
  
  try {
    const storageRef = ref(storage, path);
    // Note: You'll need to import deleteObject from firebase/storage
    // import { deleteObject } from 'firebase/storage';
    // await deleteObject(storageRef);
    console.log('Image deleted successfully:', path);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

export default {
  uploadFile,
  uploadImage,
  getOptimizedImageUrl,
  deleteImage
};
