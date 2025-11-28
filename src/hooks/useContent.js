import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getContentBySection } from '../firebase/services/contentService';

export const useContent = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Extract page and section from URL
  const pathParts = location.pathname.split('/').filter(Boolean);
  const page = pathParts[0];
  const section = pathParts[1] || 'main';

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const contentData = await getContentBySection(`${page}.${section}`);
        setContent(contentData);
        setError(null);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [page, section]);

  return { content, loading, error, page, section };
};

// Add this to contentService.js
// Add this function to your contentService.js file:
/*
export const getContentBySection = async (sectionPath) => {
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
*/
