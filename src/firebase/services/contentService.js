import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../config';

const CONTENT_COLLECTION = 'websiteContent';

// Get all content
const getAllContent = async () => {
  try {
    const contentSnapshot = await getDocs(collection(db, CONTENT_COLLECTION));
    const contentList = [];
    contentSnapshot.forEach((doc) => {
      contentList.push({ id: doc.id, ...doc.data() });
    });
    return contentList;
  } catch (error) {
    console.error("Error getting content: ", error);
    throw error;
  }
};

// Get content by ID
const getContentById = async (contentId) => {
  try {
    const contentRef = doc(db, CONTENT_COLLECTION, contentId);
    const contentSnap = await getDoc(contentRef);
    
    if (contentSnap.exists()) {
      return { id: contentSnap.id, ...contentSnap.data() };
    } else {
      throw new Error("Content not found");
    }
  } catch (error) {
    console.error("Error getting content: ", error);
    throw error;
  }
};

// Create or update content
const saveContent = async (contentId, contentData) => {
  try {
    const contentRef = doc(db, CONTENT_COLLECTION, contentId);
    await setDoc(contentRef, contentData, { merge: true });
    return { id: contentId, ...contentData };
  } catch (error) {
    console.error("Error saving content: ", error);
    throw error;
  }
};

// Delete content
const deleteContent = async (contentId) => {
  try {
    if (!contentId) {
      throw new Error('Content ID is required for deletion');
    }
    const contentRef = doc(db, CONTENT_COLLECTION, contentId);
    await deleteDoc(contentRef);
    return true;
  } catch (error) {
    console.error("Error deleting content: ", error);
    throw error;
  }
};

// Get content by section path (e.g., 'about.team')
const getContentBySection = async (sectionPath) => {
  try {
    const contentRef = collection(db, CONTENT_COLLECTION);
    const q = query(contentRef, where('section', '==', sectionPath), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting content by section:', error);
    throw error;
  }
};

// Get all videos
const getAllVideos = async () => {
  try {
    const videosSnapshot = await getDocs(collection(db, 'videos'));
    const videosList = [];
    videosSnapshot.forEach((doc) => {
      videosList.push({ id: doc.id, ...doc.data() });
    });
    return videosList;
  } catch (error) {
    console.error("Error getting videos: ", error);
    throw error;
  }
};

// Save a video
const saveVideo = async (videoData) => {
  try {
    const videoRef = doc(collection(db, 'videos'));
    await setDoc(videoRef, videoData);
    return { id: videoRef.id, ...videoData };
  } catch (error) {
    console.error("Error saving video: ", error);
    throw error;
  }
};

export { 
  getAllContent, 
  getContentById, 
  saveContent, 
  deleteContent, 
  getContentBySection, 
  getAllVideos, 
  saveVideo 
};
