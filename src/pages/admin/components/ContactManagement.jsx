import React, { useState, useEffect } from 'react';
import { getAllContacts, updateContactStatus, deleteContact } from '../../../firebase/services/formService';
import { sendContactReplyToUser } from '../../../utils/emailService';

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await getAllContacts();
      setContacts(data);
      setError('');
    } catch (error) {
      setError('Failed to load contacts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (contactId, newStatus) => {
    try {
      await updateContactStatus(contactId, newStatus);
      await loadContacts();
      setError('');
    } catch (error) {
      setError('Failed to update status');
      console.error(error);
    }
  };

  const handleDelete = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact message?')) {
      try {
        await deleteContact(contactId);
        await loadContacts();
        setError('');
      } catch (error) {
        setError('Failed to delete contact message');
        console.error(error);
      }
    }
  };

  const handleSendReply = async () => {
    if (!selectedContact) return;
    
    try {
      setSendingEmail(true);
      await sendContactReplyToUser(selectedContact, replyMessage);
      
      // Update status to 'replied'
      await updateContactStatus(selectedContact.id, 'replied');
      await loadContacts();
      
      // Close modal and reset
      setShowReplyModal(false);
      setReplyMessage('');
      setSelectedContact(null);
      setError('');
      
      alert('Reply sent successfully!');
    } catch (error) {
      setError('Failed to send reply: ' + error.message);
      console.error(error);
    } finally {
      setSendingEmail(false);
    }
  };

  const openReplyModal = (contact) => {
    setSelectedContact(contact);
    setShowReplyModal(true);
    setReplyMessage('');
  };

  const openViewModal = (contact) => {
    setSelectedContact(contact);
    setShowViewModal(true);
  };

  const filteredAndSortedContacts = contacts.filter(contact => {
    const matchesStatus = filterStatus === 'all' || contact.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  }).sort((a, b) => {
    let aValue, bValue;
    
    switch(sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'date':
        aValue = a.submissionDate || a.createdAt ? new Date(a.submissionDate || a.createdAt) : new Date(0);
        bValue = b.submissionDate || b.createdAt ? new Date(b.submissionDate || b.createdAt) : new Date(0);
        break;
      case 'status':
        aValue = a.status || 'pending';
        bValue = b.status || 'pending';
        break;
      default:
        aValue = a.submissionDate || a.createdAt ? new Date(a.submissionDate || a.createdAt) : new Date(0);
        bValue = b.submissionDate || b.createdAt ? new Date(b.submissionDate || b.createdAt) : new Date(0);
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
      case 'replied': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Contact Management</h1>
      
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
            placeholder="Search by name, email, or subject..."
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
            <option value="all">All Messages</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
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
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
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
              {filteredAndSortedContacts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No contact messages found.
                  </td>
                </tr>
              ) : (
                filteredAndSortedContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {contact.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contact.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contact.subject || 'No Subject'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(contact.submissionDate || contact.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(contact.status || 'pending')}`}>
                        {contact.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openViewModal(contact)}
                        className="text-green-600 hover:text-green-900 mr-2"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openReplyModal(contact)}
                        className="text-blue-600 hover:text-blue-900 mr-2"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
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
      {showReplyModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative z-[61]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Reply to {selectedContact.name}</h2>
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
              <h4 className="font-semibold mb-3">Replying to Contact:</h4>
              <div className="space-y-2">
                <p><strong>Name:</strong> {selectedContact.name}</p>
                <p><strong>Email:</strong> {selectedContact.email}</p>
                {selectedContact.phone && <p><strong>Phone:</strong> {selectedContact.phone}</p>}
                <p><strong>Subject:</strong> {selectedContact.subject}</p>
                {selectedContact.message && (
                  <div>
                    <p><strong>Message:</strong></p>
                    <div className="mt-1 p-2 bg-white border border-gray-200 rounded text-sm">
                      {selectedContact.message}
                    </div>
                  </div>
                )}
                <p><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedContact.status)}`}>
                    {selectedContact.status}
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
      {showViewModal && selectedContact && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Contact Message Details</h2>
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
                <h3 className="font-semibold text-gray-700 mb-2">Contact Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedContact.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedContact.email}</p>
                  {selectedContact.phone && (
                    <p><span className="font-medium">Phone:</span> {selectedContact.phone}</p>
                  )}
                  <p><span className="font-medium">Date Submitted:</span> {formatDate(selectedContact.submissionDate || selectedContact.createdAt)}</p>
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedContact.status || 'pending')}`}>
                      {selectedContact.status || 'pending'}
                    </span>
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Message Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Subject:</span> {selectedContact.subject || 'No Subject'}</p>
                  <p><span className="font-medium">Message Type:</span> {selectedContact.messageType || 'General Inquiry'}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-semibold text-gray-700 mb-2">Message</h3>
              <p className="text-gray-600 bg-gray-50 p-3 rounded whitespace-pre-wrap">{selectedContact.message}</p>
            </div>
            
            {selectedContact.additionalInfo && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Additional Information</h3>
                <p className="text-gray-600 bg-gray-50 p-3 rounded">{selectedContact.additionalInfo}</p>
              </div>
            )}
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => openReplyModal(selectedContact)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reply to Message
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
    </div>
  );
};

export default ContactManagement;