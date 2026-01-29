import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, firstName, lastName } = body;

  // Validate email
  if (!email || !email.includes("@")) {
    throw createError({
      statusCode: 400,
      message: "Valid email address is required",
    });
  }

  // Check if Resend API key is configured
  if (!process.env.RESEND_API_KEY) {
    throw createError({
      statusCode: 500,
      message: "Email service not configured",
    });
  }

  try {
    await resend.contacts.create({
      email: email,
      firstName: firstName || "",
      lastName: lastName || "",
      unsubscribed: false,
    });

    // Send welcome email to subscriber
    const greeting = firstName ? `Hi ${firstName}` : "Hello";
    await resend.emails.send({
      from: "The Legendary Prints <newsletter@thelegendaryprints.com>",
      to: email,
      subject: "Welcome to The Legendary Prints Newsletter! 🎨",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2C4FA3;">Welcome to The Legendary Prints!</h1>
          <p><strong>${greeting}!</strong></p>
          <p>Thanks for subscribing to our newsletter. You'll be the first to know about:</p>
          <ul>
            <li>New sticker designs and products</li>
            <li>Exclusive discounts and promotions</li>
            <li>Design tips and inspiration</li>
            <li>Behind-the-scenes content</li>
          </ul>
          <p>Stay legendary! ✨</p>
          <hr style="border: 1px solid #E5E7EB; margin: 20px 0;">
          <p style="color: #6B7280; font-size: 12px;">
            The Legendary Prints<br>
            Custom Vinyl Stickers & Printing Solutions
          </p>
        </div>
      `,
    });

    // Send notification to admin
    const subscriberName = [firstName, lastName].filter(Boolean).join(" ") || "No name provided";
    await resend.emails.send({
      from: "Newsletter <newsletter@thelegendaryprints.com>",
      to: process.env.ADMIN_EMAIL || "hello@thelegendaryprints.com",
      subject: "New Newsletter Subscriber",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>New Newsletter Subscription</h2>
          <p><strong>Name:</strong> ${subscriberName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
      `,
    });

    return { success: true, message: "Successfully subscribed to newsletter" };
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to subscribe to newsletter",
    });
  }
});
