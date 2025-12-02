import React, { useEffect, useState } from 'react';
import SubpageLayout from '../subpages/SubpageLayout';
import { getAllVideos } from '../../firebase/services/contentService';

// Helper function to extract YouTube video ID from URL
const getYoutubeId = (url) => {
  if (!url) {
    console.log('No URL provided to getYoutubeId');
    return null;
  }
  
  console.log('Processing URL:', url);
  
  // Handle youtu.be short URLs
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1];
    const cleanId = id ? id.split('?')[0] : null;
    console.log('Extracted ID from youtu.be:', cleanId);
    return cleanId;
  }
  
  // Handle full YouTube URLs with various parameters
  const regExp = /[?&]v=([^&#]*)/;
  const match = url.match(regExp);
  const videoId = (match && match[1].length === 11) ? match[1] : null;
  console.log('Extracted ID from URL:', videoId);
  return videoId;
};

// Function to get YouTube thumbnail URL
const getYoutubeThumbnail = (url) => {
  const videoId = getYoutubeId(url);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
  console.log('Generated thumbnail URL:', thumbnailUrl);
  return thumbnailUrl;
};

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        console.log('Starting to fetch videos...');
        
        // Get videos from Firebase
        const data = await getAllVideos();
        console.log('Raw data from Firebase:', data);
        
        if (!data) {
          console.error('No data returned from getAllVideos()');
          setError('No video data received from server.');
          return;
        }
        
        if (!Array.isArray(data)) {
          console.error('Expected an array of videos but got:', typeof data);
          setError('Invalid video data format received from server.');
          return;
        }
        
        console.log('Number of videos received:', data.length);
        
        // Filter out any invalid video entries
        const validVideos = data.filter(video => {
          const isValid = video && 
                         video.link && 
                         typeof video.link === 'string' && 
                         (video.link.includes('youtube.com') || video.link.includes('youtu.be'));
          
          if (!isValid) {
            console.log('Skipping invalid video:', video);
          } else {
            console.log('Valid video found:', video.title || 'Untitled', video.link);
          }
          
          return isValid;
        });
        
        console.log('Number of valid videos:', validVideos.length);
        setVideos(validVideos);
        
        if (validVideos.length === 0) {
          const errorMsg = data.length > 0 
            ? 'No valid YouTube videos found in the database. Please check the video links.'
            : 'No videos found in the database. Please add videos from the admin panel.';
          setError(errorMsg);
        }
      } catch (err) {
        console.error('Error in fetchVideos:', err);
        setError(`Failed to load videos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Function to get YouTube embed URL with autoplay disabled
  const getYoutubeEmbedUrl = (url) => {
    const videoId = getYoutubeId(url);
    if (!videoId) return null;
    
    // Return embed URL with modest branding and no related videos
    const embedUrl = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`;
    console.log('Generated embed URL:', embedUrl);
    return embedUrl;
  };

  if (loading) {
    return (
      <SubpageLayout title="Video Library" description="Loading videos...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </SubpageLayout>
    );
  }

  if (error) {
    return (
      <SubpageLayout title="Video Library" description="Error loading videos">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </SubpageLayout>
    );
  }

  return (
    <SubpageLayout 
      title="Video Library"
      description="Educational and informative videos for HOA members and board members"
    >
      {videos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No videos found in the database. Please add videos from the admin panel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => {
            const embedUrl = getYoutubeEmbedUrl(video.link);
            const videoId = getYoutubeId(video.link);
            
            return (
              <div key={video.id || video.link} className="bg-surface rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {embedUrl ? (
                  <div className="relative pt-[56.25%] h-0 overflow-hidden">
                    <img 
                      src={getYoutubeThumbnail(video.link)} 
                      alt={video.title || 'Video Thumbnail'}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                    <a 
                      href={embedUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-30 transition-all duration-200"
                    >
                      <div className="w-16 h-16 bg-surface bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200">
                        <svg className="w-8 h-8 text-red-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </a>
                  </div>
                ) : (
                  <div className="bg-gray-100 text-center p-8 text-gray-500">
                    Invalid YouTube URL
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{video.title || 'Untitled Video'}</h3>
                  {videoId && (
                    <a
                      href={`https://www.youtube.com/watch?v=${videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      Watch on YouTube
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SubpageLayout>
  );
};

export default Videos;
