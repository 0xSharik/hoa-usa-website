# Email Notification Setup Instructions

## 🚀 Quick Setup for Complaint Form Email Notifications

### 1. Configure EmailJS

1. **Create EmailJS Account**
   - Go to [https://www.emailjs.com/](https://www.emailjs.com/)
   - Sign up for a free account
   - Verify your email address

2. **Create Email Service**
   - In EmailJS dashboard, go to **Email Services**
   - Click **Add New Service**
   - Choose your email provider (Gmail recommended)
   - Connect your email account
   - Note your **Service ID** (e.g., `service_xxxxx`)

3. **Create Email Templates**

#### Complaint Notification Template (for Admin)
1. Go to **Email Templates**
2. Click **Create New Template**
3. Use the following template content:

```
Subject: New Complaint Submitted - {{name}} - {{property_address}}

Hello Admin,

A new complaint has been submitted to the HOA system:

Complaint Details:
- Name: {{name}}
- Email: {{email}}
- Phone: {{phone}}
- Property Address: {{property_address}}
- Complaint Types: {{complaint_types}}
- Date Submitted: {{submission_date}}
- Desired Resolution: {{desired_resolution}}

Description:
{{description}}

Please review this complaint in the admin panel and respond accordingly.

Best regards,
HOA Management System
```

4. Add these template variables:
   - `{{name}}` - Complainant's name
   - `{{email}}` - Complainant's email
   - `{{phone}}` - Phone number
   - `{{property_address}}` - Property address
   - `{{complaint_types}}` - Types of complaints
   - `{{description}}` - Complaint description
   - `{{desired_resolution}}` - Desired resolution
   - `{{submission_date}}` - Date submitted

5. Note your **Complaint Template ID** (e.g., `template_xxxxx`)

#### Contact Form Notification Template (for Admin)
1. Create another template for contact form submissions:

```
Subject: New Contact Form Submission - {{name}} - {{subject}}

Hello Admin,

A new contact form has been submitted:

Contact Details:
- Name: {{name}}
- Email: {{email}}
- Phone: {{phone}}
- Subject: {{subject}}
- Date Submitted: {{submission_date}}

Message:
{{message}}

Please review this message in the admin panel and respond accordingly.

Best regards,
HOA Management System
```

6. Add these template variables:
   - `{{name}}` - Contact person's name
   - `{{email}}` - Contact person's email
   - `{{phone}}` - Phone number
   - `{{subject}}` - Subject line
   - `{{message}}` - Message content
   - `{{submission_date}}` - Date submitted

7. Note your **Contact Template ID** (e.g., `template_yyyyy`)

#### Reply Templates (for Users)
Create reply templates for both complaints and contacts with similar structure but addressing the user.

### 4. Get Public Key
1. Go to **Account** → **API Keys**
2. Copy your **Public Key** (starts with `B-`)

### 5. Configure Environment Variables

Create a `.env` file in your project root (copy from `.env.example`):

```env
# EmailJS Configuration
VITE_EMAILJS_PUBLIC_KEY=B-xxxxxxxxxxxxxxxxxxxxxxxx
VITE_EMAILJS_SERVICE_ID=service_xxxxx
VITE_EMAILJS_CONTACT_TEMPLATE_ID=template_yyyyy
VITE_EMAILJS_COMPLAINT_TEMPLATE_ID=template_xxxxx

# Admin Email Configuration
VITE_ADMIN_EMAIL=admin@yourhoa.com
```

### 6. Test the Setup

1. Start your development server: `npm run dev`
2. Submit a test complaint form
3. Check your admin email for the notification
4. Go to admin panel → Complaint Management
5. Click "Reply" on a complaint
6. Add a custom message and click "Send Reply"
7. Check the complainant's email inbox for the test reply

## 📧 How It Works

### Complaint Form Flow:
1. User submits complaint form
2. Data is saved to Firebase
3. Email notification is sent to admin
4. Admin can view complaint in admin panel
5. Admin can send email reply directly from panel
6. User receives reply email
7. Complaint status is updated to "replied"

### Contact Form Flow:
1. User submits contact form
2. Data is saved to Firebase
3. Email notification is sent to admin
4. Admin can view message in admin panel
5. Admin can send email reply directly from panel
6. User receives reply email
7. Contact status is updated to "replied"

## 🔧 Features Added

- ✅ Email notifications to admin when forms are submitted
- ✅ Direct email reply functionality from admin panel
- ✅ Status tracking for complaints and contacts
- ✅ Professional email templates
- ✅ Error handling for email failures
- ✅ Responsive admin interface

## 🎯 Next Steps

1. Set up EmailJS account and templates
2. Configure environment variables
3. Test the complete flow
4. Customize email templates as needed
5. Monitor email delivery in EmailJS dashboard

## 📞 Support

If you need help:
- EmailJS Documentation: https://www.emailjs.com/docs/
- Check browser console for error messages
- Verify all IDs and keys are correct
- Ensure templates are saved and published in EmailJS
