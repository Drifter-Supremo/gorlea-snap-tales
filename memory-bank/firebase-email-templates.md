# Firebase Email Templates Configuration

This document provides instructions and templates for configuring Firebase Authentication email templates.

## Password Reset Email Template

### Configuration Steps

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select the "gorlea-snaps" project
3. In the left sidebar, click on "Authentication"
4. Click on the "Templates" tab
5. Select "Password reset" from the template options
6. Customize the following elements:
   - Sender name: "Gorlea Snaps"
   - Subject line: "Reset your Gorlea Snaps password"
   - Email body content (HTML template provided below)
   - Add the app's logo (located at `public/new-gorlea-logo.png`)
   - Customize the action URL (optional - Firebase handles this automatically)
7. Click "Save" to apply your changes

### HTML Template for Password Reset Email

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="[LOGO_URL]" alt="Gorlea Snaps Logo" style="max-width: 150px;">
  </div>
  
  <h2 style="color: #4a4a4a; text-align: center;">Password Reset Request</h2>
  
  <p>Hello,</p>
  
  <p>We received a request to reset your password for your Gorlea Snaps account. Click the button below to reset your password:</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="%LINK%" style="background-color: #4285F4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
  </div>
  
  <p>If you didn't request a password reset, you can ignore this email and your password will remain unchanged.</p>
  
  <p>This link will expire in 1 hour.</p>
  
  <p>Thank you,<br>The Gorlea Snaps Team</p>
  
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center;">
    <p>If you're having trouble clicking the reset password button, copy and paste the URL below into your web browser:</p>
    <p style="word-break: break-all;">%LINK%</p>
  </div>
</div>
```

Replace `[LOGO_URL]` with the URL of your app's logo. If you're hosting the app on Vercel, you might use something like: `https://your-app-domain.vercel.app/new-gorlea-logo.png`

## Email Verification Template (For Future Use)

When implementing email verification, you can use a similar approach to customize the email verification template.

### Configuration Steps

1. Go to the Firebase Console
2. Select the "gorlea-snaps" project
3. In the left sidebar, click on "Authentication"
4. Click on the "Templates" tab
5. Select "Email verification" from the template options
6. Customize the template similar to the password reset email
7. Click "Save" to apply your changes

## Welcome Email Template (For Future Use)

For a welcome email after sign-up, you would need to implement this using Firebase Cloud Functions, as Firebase Authentication doesn't provide a built-in welcome email template.

## Notes

- Firebase automatically includes the necessary action links in the emails
- The `%LINK%` placeholder will be replaced with the actual password reset link
- Email templates support HTML and inline CSS for styling
- Test the emails by triggering the password reset flow in your application
- Firebase handles email delivery, tracking, and security
