import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db } from './config';

// Collections
const COLLECTIONS = {
  articles: 'articles',
  videos: 'videos',
  newsletters: 'newsletters'
};

// Generic CRUD operations
export class FirebaseService {
  constructor(collectionName) {
    this.collection = collection(db, collectionName);
  }

  // Get all documents
  async getAll() {
    try {
      const q = query(this.collection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error getting ${this.collection.path}:`, error);
      return [];
    }
  }

  // Get single document
  async getById(id) {
    try {
      const docRef = doc(this.collection, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error(`Error getting document ${id}:`, error);
      return null;
    }
  }

  // Create new document
  async create(data) {
    try {
      const docData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      const docRef = await addDoc(this.collection, docData);
      return { id: docRef.id, ...docData };
    } catch (error) {
      console.error(`Error creating document:`, error);
      throw error;
    }
  }

  // Update document
  async update(id, data) {
    try {
      const docRef = doc(this.collection, id);
      const docData = {
        ...data,
        updatedAt: serverTimestamp()
      };
      await updateDoc(docRef, docData);
      return { id, ...docData };
    } catch (error) {
      console.error(`Error updating document ${id}:`, error);
      throw error;
    }
  }

  // Delete document
  async delete(id) {
    try {
      const docRef = doc(this.collection, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error(`Error deleting document ${id}:`, error);
      throw error;
    }
  }
}

// Service instances
export const articlesService = new FirebaseService(COLLECTIONS.articles);
export const videosService = new FirebaseService(COLLECTIONS.videos);
export const newslettersService = new FirebaseService(COLLECTIONS.newsletters);

// Resource-specific functions
export const getResources = async () => {
  try {
    const [articles, videos, newsletters] = await Promise.all([
      articlesService.getAll(),
      videosService.getAll(),
      newslettersService.getAll()
    ]);

    return {
      articles: articles.map(article => ({ ...article, type: 'article' })),
      videos: videos.map(video => ({ ...video, type: 'video', excerpt: video.description })),
      newsletters: newsletters.map(newsletter => ({ ...newsletter, type: 'newsletter' }))
    };
  } catch (error) {
    console.error('Error getting resources:', error);
    return {
      articles: [],
      videos: [],
      newsletters: []
    };
  }
};

export const createResource = async (type, data) => {
  switch (type) {
    case 'articles':
    case 'article':
      return await articlesService.create(data);
    case 'videos':
    case 'video':
      return await videosService.create(data);
    case 'newsletters':
    case 'newsletter':
      return await newslettersService.create(data);
    default:
      throw new Error('Invalid resource type');
  }
};

export const updateResource = async (type, id, data) => {
  try {
    switch (type) {
      case 'articles':
      case 'article':
        return await articlesService.update(id, data);
      case 'videos':
      case 'video':
        return await videosService.update(id, data);
      case 'newsletters':
      case 'newsletter':
        return await newslettersService.update(id, data);
      default:
        throw new Error('Invalid resource type');
    }
  } catch (error) {
    console.error(`Error updating ${type}:`, error);
    throw error;
  }
};

export const deleteResource = async (type, id) => {
  try {
    switch (type) {
      case 'articles':
      case 'article':
        return await articlesService.delete(id);
      case 'videos':
      case 'video':
        return await videosService.delete(id);
      case 'newsletters':
      case 'newsletter':
        return await newslettersService.delete(id);
      default:
        throw new Error('Invalid resource type');
    }
  } catch (error) {
    console.error(`Error deleting ${type}:`, error);
    throw error;
  }
};

// Import auth from firebase config
import { auth } from './config';

// Upload file to Firebase Storage
export const uploadDocument = async (file, path = 'documents', onProgress) => {
  try {
    if (!file) throw new Error('No file provided');
    
    // Get the current user
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get the user's ID token
    const token = await user.getIdToken();
    
    const storage = getStorage();
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    
    // Create metadata with the content type
    const metadata = {
      contentType: file.type,
      customMetadata: {
        'uploadedBy': user.uid,
        'originalName': file.name
      }
    };
    
    // Create upload task with metadata
    const uploadTask = uploadBytesResumable(storageRef, file, metadata, {
      customHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          console.error('Error uploading file:', {
            code: error.code,
            message: error.message,
            serverResponse: error.customData?.serverResponse,
            stack: error.stack
          });
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('File uploaded successfully:', {
              name: file.name,
              size: file.size,
              type: file.type,
              downloadURL,
              path: uploadTask.snapshot.ref.fullPath
            });
            
            resolve({
              url: downloadURL,
              name: file.name,
              type: file.type,
              size: file.size,
              path: uploadTask.snapshot.ref.fullPath,
              metadata: uploadTask.snapshot.metadata
            });
          } catch (error) {
            console.error('Error getting download URL:', {
              code: error.code,
              message: error.message,
              stack: error.stack
            });
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error in uploadDocument:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};
