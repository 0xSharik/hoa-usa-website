import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config';

// Get all vendors
const getAllVendors = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'vendors'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting vendors:', error);
    throw error;
  }
};

// Save or update vendor
const saveVendor = async (vendorData, vendorId = null) => {
  try {
    if (vendorId) {
      // Update existing vendor
      const vendorRef = doc(db, 'vendors', vendorId);
      await updateDoc(vendorRef, vendorData);
      return { id: vendorId, ...vendorData };
    } else {
      // Add new vendor
      const docRef = await addDoc(collection(db, 'vendors'), vendorData);
      return { id: docRef.id, ...vendorData };
    }
  } catch (error) {
    console.error('Error saving vendor:', error);
    throw error;
  }
};

// Delete vendor
const deleteVendor = async (vendorId) => {
  try {
    await deleteDoc(doc(db, 'vendors', vendorId));
  } catch (error) {
    console.error('Error deleting vendor:', error);
    throw error;
  }
};

// Toggle vendor status
const toggleVendorStatus = async (vendorId, currentStatus) => {
  try {
    const vendorRef = doc(db, 'vendors', vendorId);
    await updateDoc(vendorRef, { isActive: !currentStatus });
  } catch (error) {
    console.error('Error toggling vendor status:', error);
    throw error;
  }
};

// Get vendors by state
const getVendorsByState = async (state) => {
  try {
    const q = query(collection(db, 'vendors'), where('state', '==', state));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting vendors by state:', error);
    throw error;
  }
};

export {
  getAllVendors,
  saveVendor,
  deleteVendor,
  toggleVendorStatus,
  getVendorsByState
};
