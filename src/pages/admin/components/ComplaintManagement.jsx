import React, { useState, useEffect } from 'react';
import { getAllComplaints, updateComplaintStatus, deleteComplaint } from '../../../firebase/services/formService';
import { sendEmailReply } from '../../../firebase/services/emailService';

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

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
      await sendEmailReply('complaintReply', selectedComplaint, replyMessage);
      
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

  const filteredComplaints = complaints.filter(complaint => 
    filterStatus === 'all' || complaint.status === filterStatus
  );

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

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Complaint Management</h2>
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Complaints</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredComplaints.length} complaint{filteredComplaints.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading complaints...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
            <p className="text-gray-600">No complaints match the current filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaint Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            #{complaint.id || 'N/A'}
                          </span>
                          <div className="text-sm font-medium text-gray-900">{complaint.propertyAddress || 'No address'}</div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {Array.isArray(complaint.complaintTypes) ? complaint.complaintTypes.join(', ') : complaint.complaintType || 'No type'}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Date: {complaint.dateSubmitted || formatDate(complaint.createdAt)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{complaint.name}</div>
                      <div className="text-sm text-gray-500">{complaint.email}</div>
                      {complaint.phone && <div className="text-sm text-gray-500">{complaint.phone}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setSelectedComplaint(complaint)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </button>
                        <select
                          value={complaint.status}
                          onChange={(e) => handleStatusUpdate(complaint.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <button
                          onClick={() => handleDelete(complaint.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-xl bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Complaint Details</h3>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">Complaint Types</h4>
                <p className="text-gray-700">
                  {Array.isArray(selectedComplaint.complaintTypes) ? selectedComplaint.complaintTypes.join(', ') : selectedComplaint.complaintType || 'No type specified'}
                </p>
                {selectedComplaint.otherComplaintType && (
                  <p className="text-gray-600 text-sm mt-1">Other: {selectedComplaint.otherComplaintType}</p>
                )}
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900">Description</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedComplaint.description}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900">Desired Resolution</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedComplaint.desiredResolution || 'Not specified'}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900">Resolution Attempted</h4>
                <p className="text-gray-700">{selectedComplaint.resolutionAttempted || 'Not specified'}</p>
                {selectedComplaint.resolutionDescription && (
                  <div className="mt-2">
                    <h5 className="font-medium text-gray-800 text-sm">Resolution Efforts:</h5>
                    <p className="text-gray-600 text-sm">{selectedComplaint.resolutionDescription}</p>
                  </div>
                )}
              </div>
              
              {selectedComplaint.evidenceFiles && (
                <div>
                  <h4 className="font-semibold text-gray-900">Evidence Files</h4>
                  <p className="text-gray-700">Files attached</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Complaint ID</h4>
                  <p className="text-gray-700 font-mono text-sm bg-gray-100 px-2 py-1 rounded inline-block">
                    #{selectedComplaint.id || 'N/A'}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Date Submitted</h4>
                  <p className="text-gray-700">{selectedComplaint.dateSubmitted || formatDate(selectedComplaint.createdAt)}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Contact Name</h4>
                  <p className="text-gray-700">{selectedComplaint.name}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <p className="text-gray-700">{selectedComplaint.email}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Phone</h4>
                  <p className="text-gray-700">{selectedComplaint.phone || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Property Address</h4>
                  <p className="text-gray-700">{selectedComplaint.propertyAddress || 'Not provided'}</p>
                </div>
                {selectedComplaint.mailingAddress && selectedComplaint.mailingAddress !== selectedComplaint.propertyAddress && (
                  <div>
                    <h4 className="font-semibold text-gray-900">Mailing Address</h4>
                    <p className="text-gray-700">{selectedComplaint.mailingAddress}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-gray-900">Signature</h4>
                  <p className="text-gray-700">{selectedComplaint.signature || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Signature Date</h4>
                  <p className="text-gray-700">{selectedComplaint.signatureDate || selectedComplaint.dateSubmitted || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Status</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedComplaint.status)}`}>
                    {selectedComplaint.status}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => openReplyModal(selectedComplaint)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Email Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Reply Modal */}
      {showReplyModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Send Email Reply</h3>
            
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Message (Optional)
              </label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={6}
                placeholder="Add your custom message here..."
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowReplyModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={sendingEmail}
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={sendingEmail}
              >
                {sendingEmail ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintManagement;
