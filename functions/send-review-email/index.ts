import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

interface EmailRequest {
  to: string;
  customerName: string;
  productName: string;
  orderNumber: string;
  shopDomain: string;
  reviewLink: string;
  template?: {
    subject: string;
    body: string;
  };
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    const emailData: EmailRequest = await req.json();

    if (!emailData.to || !emailData.customerName || !emailData.productName) {
      return new Response(JSON.stringify({ error: 'Missing required email parameters' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Default email template
    const defaultSubject = "How was your recent purchase?";
    const defaultBody = `Hi {{customer_name}},

We hope you're loving your recent purchase of {{product_name}}! We'd love to hear about your experience.

Your feedback helps other customers make informed decisions and helps us improve our products.

Leave a review: {{review_link}}

Thanks for choosing us!
The Team`;

    // Use custom template if provided, otherwise use default
    const subject = emailData.template?.subject || defaultSubject;
    const bodyTemplate = emailData.template?.body || defaultBody;

    // Replace template variables
    const personalizedSubject = subject
      .replace(/{{customer_name}}/g, emailData.customerName)
      .replace(/{{product_name}}/g, emailData.productName)
      .replace(/{{order_number}}/g, emailData.orderNumber);

    const personalizedBody = bodyTemplate
      .replace(/{{customer_name}}/g, emailData.customerName)
      .replace(/{{product_name}}/g, emailData.productName)
      .replace(/{{order_number}}/g, emailData.orderNumber)
      .replace(/{{review_link}}/g, emailData.reviewLink)
      .replace(/{{shop_domain}}/g, emailData.shopDomain);

    // Convert plain text to HTML
    const htmlBody = personalizedBody
      .replace(/\n/g, '<br>')
      .replace(/{{review_link}}/g, `<a href="${emailData.reviewLink}" style="background-color: #00A96E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">Leave a Review</a>`);

    // In a real implementation, you would integrate with an email service like:
    // - SendGrid
    // - Mailgun
    // - Amazon SES
    // - Postmark
    
    // For demo purposes, we'll simulate sending the email
    console.log('Sending review request email:', {
      to: emailData.to,
      subject: personalizedSubject,
      body: personalizedBody
    });

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return new Response(JSON.stringify({
      success: true,
      message: 'Review request email sent successfully',
      emailId: `email_${Date.now()}`,
      sentAt: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error in send-review-email:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});