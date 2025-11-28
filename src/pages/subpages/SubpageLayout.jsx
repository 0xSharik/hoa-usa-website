import React from 'react';
import { useLocation } from 'react-router-dom';
import { useContent } from '../../hooks/useContent';

const SubpageLayout = ({ children }) => {
  const location = useLocation();
  const { content, loading, error } = useContent();
  
  // Get page title from URL or use content title if available
  let pageTitle = location.pathname
    .split('/')
    .pop()
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Use content title if available
  if (content?.title) {
    pageTitle = content.title;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
        {content?.subtitle && (
          <p className="mt-2 text-lg text-gray-600">
            {content.subtitle}
          </p>
        )}
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center p-4">
              {error}
            </div>
          ) : content?.content ? (
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: content.content }} 
            />
          ) : (
            <div className="text-center text-gray-500 py-8">
              No content available yet. Please check back later.
            </div>
          )}
          
          {/* Render children below the content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default SubpageLayout;
