import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_CONFIG = {
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  COMPLAINT_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_COMPLAINT_TEMPLATE_ID,
  CONTACT_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID,
  ADMIN_EMAIL: import.meta.env.VITE_ADMIN_EMAIL || 'admin@hoa.com'
};

// Initialize EmailJS
export const initializeEmailJS = () => {
  if (EMAILJS_CONFIG.PUBLIC_KEY) {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }
};

/* ===============================
   ✅ ADMIN COMPLAINT NOTIFICATION
================================ */
export const sendComplaintNotificationToAdmin = async (complaintData) => {
  try {
    const templateParams = {
      name: complaintData.name,
      email: complaintData.email,
      user_email: complaintData.email, // ✅ REQUIRED FOR TEMPLATE
      phone: complaintData.phone,
      property_address: complaintData.propertyAddress,
      complaint_types: complaintData.complaintTypes?.join(', ') || 'N/A',
      description: complaintData.description,
      desired_resolution: complaintData.desiredResolution,
      document: complaintData.evidenceFileUrls?.map((url, index) => ({
        url: url,
        name: `Document ${index + 1}`
      })) || [],
      submission_date: new Date(complaintData.dateSubmitted).toLocaleDateString(),
      complaint_id: complaintData.id,
      to_email: EMAILJS_CONFIG.ADMIN_EMAIL,
      is_admin: true,
      is_admin_notification: true
    };

    console.log('ADMIN EMAIL PAYLOAD:', templateParams);

    return await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.COMPLAINT_TEMPLATE_ID,
      templateParams
    );
  } catch (error) {
    console.error('Admin email failed:', error);
    throw error;
  }
};

/* ===============================
   ✅ USER COMPLAINT REPLY
================================ */
export const sendComplaintReplyToUser = async (complaintData, adminMessage, status = 'pending') => {
  try {
    const templateParams = {
      name: complaintData.name,
      email: complaintData.email,
      user_email: complaintData.email, // ✅ REQUIRED
      phone: complaintData.phone,
      property_address: complaintData.propertyAddress,
      complaint_types: complaintData.complaintTypes?.join(', ') || 'N/A',
      description: complaintData.description,
      desired_resolution: complaintData.desiredResolution,
      message: adminMessage,
      status: status.charAt(0).toUpperCase() + status.slice(1),
      submission_date: new Date(complaintData.dateSubmitted).toLocaleDateString(),
      document: complaintData.evidenceFileUrls?.map((url, index) => ({
        url: url,
        name: `Document ${index + 1}`
      })) || [],
      complaint_id: complaintData.id,
      to_email: complaintData.email,
      is_admin: false
    };

    console.log('USER EMAIL PAYLOAD:', templateParams);

    return await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.COMPLAINT_TEMPLATE_ID,
      templateParams
    );
  } catch (error) {
    console.error('User email failed:', error);
    throw error;
  }
};

export default {
  initializeEmailJS,
  sendComplaintNotificationToAdmin,
  sendComplaintReplyToUser
};
