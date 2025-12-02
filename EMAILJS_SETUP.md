# EmailJS Setup Guide

## 🚀 Quick Setup Steps

### 1. Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Create Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail recommended)
4. Connect your email account
5. Note your **Service ID** (e.g., `service_xxxxx`)

### 3. Create Email Templates

#### Contact Reply Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Copy-paste the **Contact Reply Template** from our templates
4. Add these template variables:
   - `{{name}}` - Contact person's name
   - `{{email}}` - Contact person's email
   - `{{phone}}` - Phone number
   - `{{subject}}` - Subject line
   - `{{original_message}}` - Original message content
   - `{{message}}` - Admin's custom reply
   - `{{submission_date}}` - Date submitted
5. Note your **Contact Template ID** (e.g., `template_xxxxx`)

#### Complaint Reply Template
1. Create another template
2. Copy-paste the **Complaint Reply Template**
3. Add these template variables:
   - `{{name}}` - Complainant's name
   - `{{email}}` - Complainant's email
   - `{{phone}}` - Phone number
   - `{{hoa_name}}` - HOA/Community name
   - `{{urgency}}` - Urgency level
   - `{{description}}` - Complaint description
   - `{{message}}` - Admin's custom reply
   - `{{status}}` - Current complaint status
   - `{{submission_date}}` - Date submitted
   - `{{complaint_id}}` - Unique complaint ID
6. Note your **Complaint Template ID** (e.g., `template_yyyyy`)

### 4. Get Public Key
1. Go to **Account** → **API Keys**
2. Copy your **Public Key** (starts with `B-`)

### 5. Configure Environment Variables

Create a `.env` file in your project root:

```env
# EmailJS Configuration
VITE_EMAILJS_PUBLIC_KEY=B-xxxxxxxxxxxxxxxxxxxxxxxx
VITE_EMAILJS_SERVICE_ID=service_xxxxx
VITE_EMAILJS_CONTACT_TEMPLATE_ID=template_xxxxx
VITE_EMAILJS_COMPLAINT_TEMPLATE_ID=template_yyyyy
```

### 6. Test the Setup

1. Start your development server: `npm run dev`
2. Go to admin panel
3. Click on any contact or complaint submission
4. Click "Send Email Reply"
5. Add a custom message and click "Send Reply"
6. Check your email inbox for the test email

## 🔧 Troubleshooting

### Common Issues:

**"Email not sent" Error:**
- Verify all environment variables are set correctly
- Check EmailJS service is connected
- Ensure template IDs are correct

**"Template variables not working":**
- Make sure variable names match exactly (including braces)
- Check template is saved and published in EmailJS

**"Public key invalid":**
- Ensure you're using the Public Key (not Private Key)
- Key should start with `B-`

### EmailJS Limits (Free Plan):
- 200 emails per month
- 2 email services
- Up to 3 templates per service

## 📱 Testing

Test both contact and complaint emails:
1. **Contact Reply**: Should show contact details + custom message
2. **Complaint Reply**: Should show complaint details + custom message + urgency level

## 🎯 Next Steps

Once working:
- Monitor email delivery in EmailJS dashboard
- Set up email analytics if needed
- Consider upgrading plan if sending more emails
- Add email templates for other notifications

## 📞 Support

If you need help:
- EmailJS Documentation: https://www.emailjs.com/docs/
- Check browser console for error messages
- Verify all IDs and keys are correct
