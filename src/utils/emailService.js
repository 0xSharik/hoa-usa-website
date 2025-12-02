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

// Send notification email to admin when complaint is submitted
export const sendComplaintNotificationToAdmin = async (complaintData) => {
  try {
    const templateParams = {
      name: complaintData.name,
      email: complaintData.email,
      phone: complaintData.phone,
      property_address: complaintData.propertyAddress,
      complaint_types: complaintData.complaintTypes.join(', '),
      description: complaintData.description,
      desired_resolution: complaintData.desiredResolution,
      submission_date: new Date(complaintData.dateSubmitted).toLocaleDateString(),
      hoa_name: 'HOA Community',
      admin_email: EMAILJS_CONFIG.ADMIN_EMAIL,
      to_email: EMAILJS_CONFIG.ADMIN_EMAIL
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.COMPLAINT_TEMPLATE_ID,
      templateParams
    );

    return { success: true, response };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    throw error;
  }
};

// Send reply email to complainant from admin
export const sendComplaintReplyToUser = async (complaintData, adminMessage, status = 'pending') => {
  try {
    const templateParams = {
      name: complaintData.name,
      email: complaintData.email,
      phone: complaintData.phone,
      property_address: complaintData.propertyAddress,
      complaint_types: complaintData.complaintTypes.join(', '),
      description: complaintData.description,
      desired_resolution: complaintData.desiredResolution,
      message: adminMessage,
      status: status.charAt(0).toUpperCase() + status.slice(1),
      submission_date: new Date(complaintData.dateSubmitted).toLocaleDateString(),
      hoa_name: 'HOA Community',
      complaint_id: complaintData.id || 'N/A',
      to_email: complaintData.email
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.COMPLAINT_TEMPLATE_ID,
      templateParams
    );

    return { success: true, response };
  } catch (error) {
    console.error('Error sending complaint reply:', error);
    throw error;
  }
};

// Send notification email to admin when contact form is submitted
export const sendContactNotificationToAdmin = async (contactData) => {
  try {
    const templateParams = {
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      subject: contactData.subject,
      message: contactData.message,
      submission_date: new Date(contactData.submissionDate).toLocaleDateString(),
      hoa_name: 'HOA Community',
      admin_email: EMAILJS_CONFIG.ADMIN_EMAIL,
      to_email: EMAILJS_CONFIG.ADMIN_EMAIL
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.CONTACT_TEMPLATE_ID,
      templateParams
    );

    return { success: true, response };
  } catch (error) {
    console.error('Error sending contact notification:', error);
    throw error;
  }
};

// Send reply email to contact form submitter from admin
export const sendContactReplyToUser = async (contactData, adminMessage) => {
  try {
    const templateParams = {
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      subject: contactData.subject,
      original_message: contactData.message,
      message: adminMessage,
      submission_date: new Date(contactData.submissionDate).toLocaleDateString(),
      hoa_name: 'HOA Community',
      to_email: contactData.email
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.CONTACT_TEMPLATE_ID,
      templateParams
    );

    return { success: true, response };
  } catch (error) {
    console.error('Error sending contact reply:', error);
    throw error;
  }
};

export default {
  initializeEmailJS,
  sendComplaintNotificationToAdmin,
  sendComplaintReplyToUser,
  sendContactNotificationToAdmin,
  sendContactReplyToUser
};
