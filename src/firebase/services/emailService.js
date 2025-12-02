// Email service for sending replies to contact and complaint submissions
import emailjs from '@emailjs/browser';

// Email templates
const emailTemplates = {
  contactReply: {
    subject: 'Re: Your Contact Form Submission - HOA USA',
    html: (formData, customMessage) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Response from HOA USA</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .form-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .form-details h3 { color: #4F46E5; margin-top: 0; }
          .custom-message { background: #e0e7ff; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HOA USA</h1>
            <p>Response to Your Inquiry</p>
          </div>
          
          <div class="content">
            <h2>Thank You for Contacting Us</h2>
            <p>Dear ${formData.name},</p>
            <p>Thank you for reaching out to HOA USA. We have received your message and our team will review your inquiry shortly.</p>
            
            ${customMessage ? `
            <div class="custom-message">
              <h3>Our Response:</h3>
              <p>${customMessage}</p>
            </div>
            ` : ''}
            
            <div class="form-details">
              <h3>Your Submission Details:</h3>
              <p><strong>Name:</strong> ${formData.name}</p>
              <p><strong>Email:</strong> ${formData.email}</p>
              ${formData.phone ? `<p><strong>Phone:</strong> ${formData.phone}</p>` : ''}
              ${formData.subject ? `<p><strong>Subject:</strong> ${formData.subject}</p>` : ''}
              ${formData.message ? `<p><strong>Message:</strong> ${formData.message}</p>` : ''}
              <p><strong>Submitted:</strong> ${new Date(formData.createdAt?.toDate?.() || Date.now()).toLocaleString()}</p>
            </div>
            
            <p>We will get back to you as soon as possible. If you have any urgent questions, please don't hesitate to contact us directly.</p>
            
            <p>Best regards,<br>The HOA USA Team</p>
          </div>
          
          <div class="footer">
            <p>&copy; 2025 HOA USA. All rights reserved.</p>
            <p>This is an automated response to your submission.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  
  complaintReply: {
    subject: 'Re: Your Complaint Submission - HOA USA',
    html: (formData, customMessage) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Response from HOA USA</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .form-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .form-details h3 { color: #dc2626; margin-top: 0; }
          .custom-message { background: #fee2e2; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HOA USA</h1>
            <p>Response to Your Complaint</p>
          </div>
          
          <div class="content">
            <h2>Your Complaint Has Been Received</h2>
            <p>Dear ${formData.name},</p>
            <p>Thank you for bringing this matter to our attention. We have received your complaint and our team is reviewing the details carefully.</p>
            
            ${customMessage ? `
            <div class="custom-message">
              <h3>Our Response:</h3>
              <p>${customMessage}</p>
            </div>
            ` : ''}
            
            <div class="form-details">
              <h3>Your Complaint Details:</h3>
              <p><strong>Complaint ID:</strong> #${formData.id || 'N/A'}</p>
              <p><strong>Date Submitted:</strong> ${formData.dateSubmitted || new Date(formData.createdAt?.toDate?.() || Date.now()).toLocaleDateString()}</p>
              <p><strong>Name:</strong> ${formData.name}</p>
              <p><strong>Email:</strong> ${formData.email}</p>
              ${formData.phone ? `<p><strong>Phone:</strong> ${formData.phone}</p>` : ''}
              ${formData.propertyAddress ? `<p><strong>Property Address:</strong> ${formData.propertyAddress}</p>` : ''}
              ${formData.mailingAddress && formData.mailingAddress !== formData.propertyAddress ? `<p><strong>Mailing Address:</strong> ${formData.mailingAddress}</p>` : ''}
              ${Array.isArray(formData.complaintTypes) && formData.complaintTypes.length > 0 ? `<p><strong>Complaint Types:</strong> ${formData.complaintTypes.join(', ')}</p>` : ''}
              ${formData.otherComplaintType ? `<p><strong>Other Complaint Type:</strong> ${formData.otherComplaintType}</p>` : ''}
              ${formData.description ? `<p><strong>Description:</strong> ${formData.description}</p>` : ''}
              ${formData.evidenceFiles ? `<p><strong>Evidence:</strong> Files attached</p>` : ''}
              ${formData.resolutionAttempted ? `<p><strong>Resolution Attempted:</strong> ${formData.resolutionAttempted}</p>` : ''}
              ${formData.resolutionDescription ? `<p><strong>Resolution Efforts:</strong> ${formData.resolutionDescription}</p>` : ''}
              ${formData.desiredResolution ? `<p><strong>Desired Resolution:</strong> ${formData.desiredResolution}</p>` : ''}
              <p><strong>Status:</strong> ${formData.status || 'Under Review'}</p>
              <p><strong>Signature:</strong> ${formData.signature || 'Not provided'}</p>
              <p><strong>Signature Date:</strong> ${formData.signatureDate || formData.dateSubmitted || 'Not provided'}</p>
            </div>
            
            <p>We take all complaints seriously and will investigate this matter thoroughly. We will contact you again if we need additional information or once we have an update.</p>
            
            <p>Best regards,<br>The HOA USA Team</p>
          </div>
          
          <div class="footer">
            <p>&copy; 2025 HOA USA. All rights reserved.</p>
            <p>This is an automated response to your complaint submission.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
};

// Send email reply function using EmailJS
export const sendEmailReply = async (type, formData, customMessage = '') => {
  try {
    // Get the appropriate template
    const template = emailTemplates[type];
    if (!template) {
      throw new Error('Invalid email template type');
    }

    // Initialize EmailJS with your public key
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

    // Prepare template parameters for EmailJS
    const templateParams = {
      to_email: formData.email,
      subject: template.subject,
      message: customMessage || 'Thank you for contacting us. We have received your message and will respond shortly.',
      name: formData.name,
      email: formData.email,
      phone: formData.phone || 'Not provided',
      subject: formData.subject || 'No subject',
      original_message: formData.message || formData.description || 'No message provided',
      submission_date: formData.createdAt?.toDate?.() ? 
        formData.createdAt.toDate().toLocaleDateString() + ' ' + formData.createdAt.toDate().toLocaleTimeString() : 
        formData.dateSubmitted || new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
      hoa_name: formData.hoaName || 'Not provided',
      urgency: formData.urgency || 'Not specified',
      description: formData.description || 'No description provided',
      status: formData.status || 'pending',
      complaint_id: formData.id || 'N/A',
      // New complaint form fields
      property_address: formData.propertyAddress || 'Not provided',
      mailing_address: formData.mailingAddress || 'Same as property',
      complaint_types: Array.isArray(formData.complaintTypes) ? formData.complaintTypes.join(', ') : 'Not specified',
      other_complaint_type: formData.otherComplaintType || '',
      evidence_files: formData.evidenceFiles ? 'Attached' : 'None',
      resolution_attempted: formData.resolutionAttempted || 'Not specified',
      resolution_description: formData.resolutionDescription || 'Not provided',
      desired_resolution: formData.desiredResolution || 'Not specified',
      signature: formData.signature || 'Not provided',
      signature_date: formData.signatureDate || formData.dateSubmitted || 'Not provided'
    };

    // Send email using EmailJS
    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      type === 'contactReply' ? import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID : import.meta.env.VITE_EMAILJS_COMPLAINT_TEMPLATE_ID,
      templateParams
    );

    console.log('Email sent successfully:', response);
    return { success: true, message: 'Email sent successfully', response };
  } catch (error) {
    console.error('Error sending email via EmailJS:', error);
    throw error;
  }
};

// Simple mock function for testing (remove in production)
export const mockSendEmailReply = async (type, formData, customMessage = '') => {
  try {
    const template = emailTemplates[type];
    if (!template) {
      throw new Error('Invalid email template type');
    }

    console.log('=== EMAIL REPLY ===');
    console.log('To:', formData.email);
    console.log('Subject:', template.subject);
    console.log('Custom Message:', customMessage);
    console.log('Form Data:', formData);
    console.log('==================');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true, message: 'Email sent successfully (mock)' };
  } catch (error) {
    console.error('Error sending mock email:', error);
    throw error;
  }
};

export default emailTemplates;
