import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  FileText, 
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const DocumentViewer = ({ 
  isOpen, 
  onClose, 
  document, 
  documents = [],
  currentIndex = 0 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDocIndex, setCurrentDocIndex] = useState(currentIndex);

  useEffect(() => {
    setCurrentDocIndex(currentIndex);
  }, [currentIndex]);

  const currentDocument = documents[currentDocIndex] || document;

  const handleDownload = async () => {
    if (!currentDocument) return;
    
    const downloadUrl = currentDocument.fileUrl || currentDocument.imageUrl || currentDocument.documentUrl;
    if (!downloadUrl) {
      console.error('No download URL available');
      return;
    }

    try {
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Try to set the filename
      const fileName = currentDocument.fileName || currentDocument.title || 'document';
      link.download = fileName.includes('.') ? fileName : `${fileName}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to opening in new tab
      window.open(downloadUrl, '_blank');
    }
  };

  const navigateDocument = (direction) => {
    if (direction === 'prev' && currentDocIndex > 0) {
      setCurrentDocIndex(currentDocIndex - 1);
    } else if (direction === 'next' && currentDocIndex < documents.length - 1) {
      setCurrentDocIndex(currentDocIndex + 1);
    }
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return <FileText className="w-8 h-8 text-gray-400" />;
    
    const type = fileType.toLowerCase();
    if (type.includes('pdf')) {
      return <FileText className="w-8 h-8 text-red-500" />;
    } else if (type.includes('word') || type.includes('docx')) {
      return <FileText className="w-8 h-8 text-blue-500" />;
    } else if (type.includes('excel') || type.includes('xlsx')) {
      return <FileText className="w-8 h-8 text-green-500" />;
    } else if (type.includes('powerpoint') || type.includes('pptx')) {
      return <FileText className="w-8 h-8 text-orange-500" />;
    } else if (type.includes('image')) {
      return <FileText className="w-8 h-8 text-purple-500" />;
    }
    return <FileText className="w-8 h-8 text-gray-400" />;
  };

  const renderDocumentContent = () => {
    if (!currentDocument) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No document available</p>
          </div>
        </div>
      );
    }

    const fileUrl = currentDocument.fileUrl || currentDocument.imageUrl || currentDocument.documentUrl;
    const fileType = currentDocument.fileType || '';

    // For images, show them directly
    if (fileType.includes('image')) {
      return (
        <div className="h-full flex items-center justify-center bg-gray-50">
          <img
            src={fileUrl}
            alt={currentDocument.title || 'Document'}
            className="max-w-full max-h-full object-contain"
            onLoad={() => setLoading(false)}
            onError={() => {
              setError('Failed to load image');
              setLoading(false);
            }}
          />
        </div>
      );
    }

    // For PDFs, use iframe
    if (fileType.includes('pdf')) {
      return (
        <iframe
          src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
          className="w-full h-full border-0"
          title={currentDocument.title || 'PDF Document'}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError('Failed to load PDF');
            setLoading(false);
          }}
        />
      );
    }

    // For Google Docs viewer (supports DOC, DOCX, PPT, PPTX, XLS, XLSX)
    if (fileType.includes('word') || fileType.includes('excel') || fileType.includes('powerpoint')) {
      const googleViewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fileUrl)}`;
      return (
        <iframe
          src={googleViewerUrl}
          className="w-full h-full border-0"
          title={currentDocument.title || 'Document'}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError('Failed to load document');
            setLoading(false);
          }}
        />
      );
    }

    // For other file types, show download prompt
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8">
        {getFileIcon(fileType)}
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          {currentDocument.title || 'Document'}
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          {fileType || 'Unknown file type'}
        </p>
        <p className="mt-4 text-center text-gray-600 max-w-md">
          This file type cannot be previewed directly. Please download the file to view it.
        </p>
        <button
          onClick={handleDownload}
          className="mt-6 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Document
        </button>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {getFileIcon(currentDocument?.fileType)}
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {currentDocument?.title || 'Document Viewer'}
                </h2>
                {currentDocument?.fileSize && (
                  <p className="text-sm text-gray-500">
                    {(currentDocument.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Navigation buttons for multiple documents */}
              {documents.length > 1 && (
                <>
                  <button
                    onClick={() => navigateDocument('prev')}
                    disabled={currentDocIndex === 0}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-500 px-2">
                    {currentDocIndex + 1} / {documents.length}
                  </span>
                  <button
                    onClick={() => navigateDocument('next')}
                    disabled={currentDocIndex === documents.length - 1}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Document Content */}
          <div className="flex-1 overflow-hidden relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-2" />
                  <p className="text-gray-600">Loading document...</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mx-auto"
                  >
                    <Download className="w-4 h-4" />
                    Download Instead
                  </button>
                </div>
              </div>
            )}
            
            {renderDocumentContent()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DocumentViewer;
