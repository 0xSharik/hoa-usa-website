import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../config';

// Complaint Services
export const submitComplaint = async (complaintData) => {
  try {
    const docRef = await addDoc(collection(db, 'complaints'), {
      ...complaintData,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error submitting complaint:', error);
    throw error;
  }
};

export const getAllComplaints = async () => {
  try {
    const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching complaints:', error);
    throw error;
  }
};

export const updateComplaintStatus = async (complaintId, status) => {
  try {
    const complaintRef = doc(db, 'complaints', complaintId);
    await updateDoc(complaintRef, {
      status,
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating complaint status:', error);
    throw error;
  }
};

export const deleteComplaint = async (complaintId) => {
  try {
    await deleteDoc(doc(db, 'complaints', complaintId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting complaint:', error);
    throw error;
  }
};

// Contact Form Services
export const submitContactForm = async (contactData) => {
  try {
    const docRef = await addDoc(collection(db, 'contacts'), {
      ...contactData,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};

export const getAllContacts = async () => {
  try {
    const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};

export const updateContactStatus = async (contactId, status) => {
  try {
    const contactRef = doc(db, 'contacts', contactId);
    await updateDoc(contactRef, {
      status,
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating contact status:', error);
    throw error;
  }
};

export const deleteContact = async (contactId) => {
  try {
    await deleteDoc(doc(db, 'contacts', contactId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
};
