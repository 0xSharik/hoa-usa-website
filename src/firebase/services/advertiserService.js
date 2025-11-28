import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config';

const ADVERTISERS_COLLECTION = 'advertisers';

// Get all advertisers
const getAllAdvertisers = async () => {
  try {
    const advertisersSnapshot = await getDocs(collection(db, ADVERTISERS_COLLECTION));
    const advertisers = [];
    advertisersSnapshot.forEach((doc) => {
      advertisers.push({ id: doc.id, ...doc.data() });
    });
    return advertisers;
  } catch (error) {
    console.error("Error getting advertisers: ", error);
    throw error;
  }
};

// Get active advertisers
const getActiveAdvertisers = async () => {
  try {
    const q = query(collection(db, ADVERTISERS_COLLECTION), where("isActive", "==", true));
    const querySnapshot = await getDocs(q);
    const advertisers = [];
    querySnapshot.forEach((doc) => {
      advertisers.push({ id: doc.id, ...doc.data() });
    });
    return advertisers;
  } catch (error) {
    console.error("Error getting active advertisers: ", error);
    throw error;
  }
};

// Get advertiser by ID
const getAdvertiserById = async (advertiserId) => {
  try {
    const advertiserRef = doc(db, ADVERTISERS_COLLECTION, advertiserId);
    const advertiserSnap = await getDoc(advertiserRef);
    
    if (advertiserSnap.exists()) {
      return { id: advertiserSnap.id, ...advertiserSnap.data() };
    } else {
      throw new Error("Advertiser not found");
    }
  } catch (error) {
    console.error("Error getting advertiser: ", error);
    throw error;
  }
};

// Create or update advertiser
const saveAdvertiser = async (advertiserData, advertiserId = null) => {
  try {
    let advertiserRef;
    
    if (advertiserId) {
      // Update existing advertiser
      advertiserRef = doc(db, ADVERTISERS_COLLECTION, advertiserId);
      await updateDoc(advertiserRef, advertiserData);
      return { id: advertiserId, ...advertiserData };
    } else {
      // Create new advertiser
      advertiserRef = doc(collection(db, ADVERTISERS_COLLECTION));
      await setDoc(advertiserRef, {
        ...advertiserData,
        createdAt: new Date().toISOString(),
        isActive: true
      });
      return { id: advertiserRef.id, ...advertiserData };
    }
  } catch (error) {
    console.error("Error saving advertiser: ", error);
    throw error;
  }
};

// Toggle advertiser active status
const toggleAdvertiserStatus = async (advertiserId, isActive) => {
  try {
    const advertiserRef = doc(db, ADVERTISERS_COLLECTION, advertiserId);
    await updateDoc(advertiserRef, { isActive });
    return true;
  } catch (error) {
    console.error("Error toggling advertiser status: ", error);
    throw error;
  }
};

// Delete advertiser
const deleteAdvertiser = async (advertiserId) => {
  try {
    await deleteDoc(doc(db, ADVERTISERS_COLLECTION, advertiserId));
    return true;
  } catch (error) {
    console.error("Error deleting advertiser: ", error);
    throw error;
  }
};

export {
  getAllAdvertisers,
  getActiveAdvertisers,
  getAdvertiserById,
  saveAdvertiser,
  toggleAdvertiserStatus,
  deleteAdvertiser
};
