import { Resend } from 'resend';
import businessConfig from '~/config/businessConfig';

const resend = new Resend(process.env.RESEND_API_KEY);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, subject, message } = body;

  // Validate required fields
  if (!name || !email || !message) {
    throw createError({
      statusCode: 400,
      message: 'Name, email, and message are required',
    });
  }

  // Validate email
  if (!email.includes('@')) {
    throw createError({
      statusCode: 400,
      message: 'Valid email address is required',
    });
  }

  // Check if Resend API key is configured
  if (!process.env.RESEND_API_KEY) {
    throw createError({
      statusCode: 500,
      message: 'Email service not configured',
    });
  }

  try {
    // Send email to business
    await resend.emails.send({
      from: `Contact Form <contact@${businessConfig.email.split('@')[1]}>`,
      to: businessConfig.email,
      replyTo: email,
      subject: subject || 'New Contact Form Submission',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2C4FA3;">New Contact Form Submission</h2>
          <div style="background: #F2F3F5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            ${subject ? `<p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>` : ''}
            <p style="margin: 10px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <div style="margin: 20px 0;">
            <strong>Message:</strong>
            <p style="white-space: pre-wrap; margin-top: 10px;">${message}</p>
          </div>
          <hr style="border: 1px solid #E5E7EB; margin: 20px 0;">
          <p style="color: #6B7280; font-size: 12px;">
            You can reply directly to this email to respond to ${name}.
          </p>
        </div>
      `,
    });

    return { success: true, message: 'Message sent successfully' };
  } catch (error: any) {
    console.error('Contact form submission error:', error);
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to send message',
    });
  }
});
