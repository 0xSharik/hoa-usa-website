import React, { useState, useEffect } from 'react';
import { getAllContacts, updateContactStatus, deleteContact } from '../../../firebase/services/formService';
import { sendEmailReply } from '../../../firebase/services/emailService';

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

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
    if (window.confirm('Are you sure you want to delete this contact submission?')) {
      try {
        await deleteContact(contactId);
        await loadContacts();
        setError('');
      } catch (error) {
        setError('Failed to delete contact');
        console.error(error);
      }
    }
  };

  const handleSendReply = async () => {
    if (!selectedContact) return;
    
    try {
      setSendingEmail(true);
      await sendEmailReply('contactReply', selectedContact, replyMessage);
      
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

  const filteredContacts = contacts.filter(contact => 
    filterStatus === 'all' || contact.status === filterStatus
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
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Forms</h2>
      
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
              <option value="all">All Contacts</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading contacts...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">📧</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contact submissions found</h3>
            <p className="text-gray-600">No contact form submissions match the current filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                      <div className="text-sm text-gray-500">{contact.email}</div>
                      {contact.phone && <div className="text-sm text-gray-500">{contact.phone}</div>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{contact.subject || 'No subject'}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{contact.message}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(contact.createdAt)}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </button>
                        <select
                          value={contact.status}
                          onChange={(e) => handleStatusUpdate(contact.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <button
                          onClick={() => handleDelete(contact.id)}
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

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-xl bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Contact Details</h3>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">Name</h4>
                <p className="text-gray-700">{selectedContact.name}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900">Email</h4>
                <p className="text-gray-700">{selectedContact.email}</p>
              </div>
              
              {selectedContact.phone && (
                <div>
                  <h4 className="font-semibold text-gray-900">Phone</h4>
                  <p className="text-gray-700">{selectedContact.phone}</p>
                </div>
              )}
              
              {selectedContact.subject && (
                <div>
                  <h4 className="font-semibold text-gray-900">Subject</h4>
                  <p className="text-gray-700">{selectedContact.subject}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold text-gray-900">Message</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Status</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedContact.status)}`}>
                    {selectedContact.status}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Submitted</h4>
                  <p className="text-gray-700">{formatDate(selectedContact.createdAt)}</p>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => openReplyModal(selectedContact)}
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
      {showReplyModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Send Email Reply</h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-3">Replying to Contact:</h4>
              <div className="space-y-2">
                <p><strong>Name:</strong> {selectedContact.name}</p>
                <p><strong>Email:</strong> {selectedContact.email}</p>
                {selectedContact.phone && <p><strong>Phone:</strong> {selectedContact.phone}</p>}
                <p><strong>Subject:</strong> {selectedContact.subject || 'No subject'}</p>
                <p><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedContact.status)}`}>
                    {selectedContact.status}
                  </span>
                </p>
                <p><strong>Submitted:</strong> {formatDate(selectedContact.createdAt)}</p>
                {selectedContact.message && (
                  <div>
                    <p><strong>Original Message:</strong></p>
                    <div className="mt-1 p-2 bg-white border border-gray-200 rounded text-sm">
                      {selectedContact.message}
                    </div>
                  </div>
                )}
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

export default ContactManagement;
