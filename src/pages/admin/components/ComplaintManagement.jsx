import React, { useState, useEffect } from 'react';
import { getAllComplaints, updateComplaintStatus, deleteComplaint } from '../../../firebase/services/formService';
import { sendComplaintReplyToUser } from '../../../utils/emailService';
import { FileText, Download, Eye } from 'lucide-react';

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  // Signature viewing state
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const data = await getAllComplaints();
      setComplaints(data);
      setError('');
    } catch (error) {
      setError('Failed to load complaints');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      await updateComplaintStatus(complaintId, newStatus);
      await loadComplaints();
      setError('');
    } catch (error) {
      setError('Failed to update status');
      console.error(error);
    }
  };

  const handleDelete = async (complaintId) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await deleteComplaint(complaintId);
        await loadComplaints();
        setError('');
      } catch (error) {
        setError('Failed to delete complaint');
        console.error(error);
      }
    }
  };

  const handleSendReply = async () => {
    if (!selectedComplaint) return;
    
    try {
      setSendingEmail(true);
      await sendComplaintReplyToUser(selectedComplaint, replyMessage, selectedComplaint.status);
      
      // Update status to 'replied'
      await updateComplaintStatus(selectedComplaint.id, 'replied');
      await loadComplaints();
      
      // Close modal and reset
      setShowReplyModal(false);
      setReplyMessage('');
      setSelectedComplaint(null);
      setError('');
      
      alert('Reply sent successfully!');
    } catch (error) {
      setError('Failed to send reply: ' + error.message);
      console.error(error);
    } finally {
      setSendingEmail(false);
    }
  };

  const openReplyModal = (complaint) => {
    setSelectedComplaint(complaint);
    setShowReplyModal(true);
    setReplyMessage('');
  };

  const openViewModal = (complaint) => {
    setSelectedComplaint(complaint);
    setShowViewModal(true);
  };

  const openSignatureModal = (signatureUrl) => {
    setSignatureUrl(signatureUrl);
    setShowSignatureModal(true);
  };

  const filteredAndSortedComplaints = complaints.filter(complaint => {
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      (complaint.name && complaint.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (complaint.propertyAddress && complaint.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (complaint.email && complaint.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (complaint.complaintTypes && complaint.complaintTypes.some(type => type.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesStatus && matchesSearch;
  }).sort((a, b) => {
    let aValue, bValue;
    
    switch(sortBy) {
      case 'name':
        aValue = a.name ? a.name.toLowerCase() : '';
        bValue = b.name ? b.name.toLowerCase() : '';
        break;
      case 'date':
        aValue = a.createdAt ? a.createdAt.toDate() : new Date(0);
        bValue = b.createdAt ? b.createdAt.toDate() : new Date(0);
        break;
      case 'status':
        aValue = a.status || 'pending';
        bValue = b.status || 'pending';
        break;
      default:
        aValue = a.createdAt ? a.createdAt.toDate() : new Date(0);
        bValue = b.createdAt ? b.createdAt.toDate() : new Date(0);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'replied': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Complaint Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search:
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, address, email, or complaint type..."
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        
        <div className="w-full lg:w-auto">
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status:
          </label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="all">All Complaints</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
            <option value="replied">Replied</option>
          </select>
        </div>
        
        <div className="w-full lg:w-auto">
          <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
            Sort by:
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="date">Date</option>
            <option value="name">Name</option>
            <option value="status">Status</option>
          </select>
        </div>
        
        <div className="w-full lg:w-auto">
          <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 mb-1">
            Order:
          </label>
          <select
            id="sort-order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Complaint Types
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedComplaints.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No complaints found.
                  </td>
                </tr>
              ) : (
                filteredAndSortedComplaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {complaint.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {complaint.propertyAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {complaint.complaintTypes ? complaint.complaintTypes.join(', ') : 'No types specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(complaint.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(complaint.status || 'pending')}`}>
                        {complaint.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openViewModal(complaint)}
                        className="text-green-600 hover:text-green-900 mr-2"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openReplyModal(complaint)}
                        className="text-blue-600 hover:text-blue-900 mr-2"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => handleDelete(complaint.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative z-[61]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Reply to {selectedComplaint.name}</h2>
              <button
                onClick={() => setShowReplyModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-3">Replying to Complaint:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p><strong>Complaint ID:</strong></p>
                  <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">
                    #{selectedComplaint.id || 'N/A'}
                  </span>
                </div>
                <p><strong>Name:</strong> {selectedComplaint.name}</p>
                <p><strong>Email:</strong> {selectedComplaint.email}</p>
                {selectedComplaint.phone && <p><strong>Phone:</strong> {selectedComplaint.phone}</p>}
                {selectedComplaint.propertyAddress && <p><strong>Property Address:</strong> {selectedComplaint.propertyAddress}</p>}
                {selectedComplaint.mailingAddress && selectedComplaint.mailingAddress !== selectedComplaint.propertyAddress && (
                  <p><strong>Mailing Address:</strong> {selectedComplaint.mailingAddress}</p>
                )}
                <p><strong>Date Submitted:</strong> {selectedComplaint.dateSubmitted || formatDate(selectedComplaint.createdAt)}</p>
                {Array.isArray(selectedComplaint.complaintTypes) && selectedComplaint.complaintTypes.length > 0 && (
                  <p><strong>Complaint Types:</strong> {selectedComplaint.complaintTypes.join(', ')}</p>
                )}
                {selectedComplaint.otherComplaintType && (
                  <p><strong>Other Type:</strong> {selectedComplaint.otherComplaintType}</p>
                )}
                {selectedComplaint.desiredResolution && (
                  <div>
                    <p><strong>Desired Resolution:</strong></p>
                    <div className="mt-1 p-2 bg-white border border-gray-200 rounded text-sm">
                      {selectedComplaint.desiredResolution}
                    </div>
                  </div>
                )}
                {selectedComplaint.description && (
                  <div>
                    <p><strong>Description:</strong></p>
                    <div className="mt-1 p-2 bg-white border border-gray-200 rounded text-sm">
                      {selectedComplaint.description}
                    </div>
                  </div>
                )}
                <p><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedComplaint.status)}`}>
                    {selectedComplaint.status}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="reply-message" className="block text-sm font-medium text-gray-700 mb-1">
                Your Reply:
              </label>
              <textarea
                id="reply-message"
                rows="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply here..."
              ></textarea>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowReplyModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={sendingEmail}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendReply}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={sendingEmail || !replyMessage.trim()}
              >
                {sendingEmail ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedComplaint && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Complaint Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Personal Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedComplaint.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedComplaint.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedComplaint.phone}</p>
                  <p><span className="font-medium">Property Address:</span> {selectedComplaint.propertyAddress}</p>
                  <p><span className="font-medium">Mailing Address:</span> {selectedComplaint.mailingAddress}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Complaint Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Date Submitted:</span> {formatDate(selectedComplaint.createdAt)}</p>
                  <p><span className="font-medium">Complaint Types:</span></p>
                  {selectedComplaint.complaintTypes ? (
                    <ul className="list-disc list-inside ml-4">
                      {selectedComplaint.complaintTypes.map((type, index) => (
                        <li key={index}>{type}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="ml-4">No types specified</p>
                  )}
                  {selectedComplaint.otherComplaintType && (
                    <p><span className="font-medium">Other Type:</span> {selectedComplaint.otherComplaintType}</p>
                  )}
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedComplaint.status || 'pending')}`}>
                      {selectedComplaint.status || 'pending'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600 bg-gray-50 p-3 rounded">{selectedComplaint.description}</p>
            </div>
            
            {selectedComplaint.desiredResolution && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Desired Resolution</h3>
                <p className="text-gray-600 bg-gray-50 p-3 rounded">{selectedComplaint.desiredResolution}</p>
              </div>
            )}
            
            {(selectedComplaint.resolutionAttempted || selectedComplaint.resolutionDescription) && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Resolution Attempt</h3>
                <p className="text-gray-600 bg-gray-50 p-3 rounded">
                  {selectedComplaint.resolutionAttempted}: {selectedComplaint.resolutionDescription}
                </p>
              </div>
            )}
            
            {/* Evidence Files Section - Always Show */}
            <div className="mt-4">
              <h3 className="font-semibold text-gray-700 mb-2">Evidence Files</h3>
              {selectedComplaint.evidenceFileUrls && selectedComplaint.evidenceFileUrls.length > 0 ? (
                <div className="space-y-2">
                  {selectedComplaint.evidenceFileUrls.map((url, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-gray-50 p-3 rounded">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline flex-1"
                      >
                        {url.split('/').pop() || `Evidence File ${index + 1}`}
                      </a>
                      <button
                        onClick={() => window.open(url, '_blank')}
                        className="text-gray-600 hover:text-gray-800"
                        title="View in new tab"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a 
                        href={url} 
                        download
                        className="text-gray-600 hover:text-gray-800"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm bg-gray-50 p-3 rounded">
                  <p>No evidence files uploaded.</p>
                  <div className="mt-2 text-xs text-gray-400">
                    <p>Debug information:</p>
                    <p>evidenceFileUrls: {JSON.stringify(selectedComplaint.evidenceFileUrls || 'null')}</p>
                    <p>evidenceFiles: {JSON.stringify(selectedComplaint.evidenceFiles || 'null')}</p>
                  </div>
                </div>
              )}
            </div>
            
            {selectedComplaint.signatureImageUrl && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Signature</h3>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="flex items-start gap-4">
                    <img 
                      src={selectedComplaint.signatureImageUrl} 
                      alt="Signature" 
                      className="h-20 border border-gray-300 rounded cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => openSignatureModal(selectedComplaint.signatureImageUrl)}
                      title="Click to view full size"
                    />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-2">Signed on: {selectedComplaint.signatureDate || 'N/A'}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openSignatureModal(selectedComplaint.signatureImageUrl)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                        <a 
                          href={selectedComplaint.signatureImageUrl}
                          download={`signature_${selectedComplaint.name}_${selectedComplaint.signatureDate}`}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => openReplyModal(selectedComplaint)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reply to Complaint
              </button>
              <button
                type="button"
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signature View Modal */}
      {showSignatureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[70]">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 relative z-[71]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Signature View</h2>
              <button
                onClick={() => setShowSignatureModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex justify-center mb-4">
              <img 
                src={signatureUrl} 
                alt="Signature Full View" 
                className="max-w-full max-h-96 border border-gray-300 rounded shadow-lg"
              />
            </div>
            
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowSignatureModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Close
              </button>
              <a 
                href={signatureUrl}
                download={`signature_${new Date().getTime()}`}
                className="inline-flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="w-4 h-4" />
                Download Signature
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintManagement;
