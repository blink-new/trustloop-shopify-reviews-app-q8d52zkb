import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// This function handles incoming webhooks from Shopify for order fulfillment
// and triggers review request emails

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Shopify-Topic, X-Shopify-Hmac-Sha256, X-Shopify-Shop-Domain',
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
    const shopDomain = req.headers.get('X-Shopify-Shop-Domain');
    const topic = req.headers.get('X-Shopify-Topic');
    
    if (!shopDomain || !topic) {
      return new Response(JSON.stringify({ error: 'Missing required headers' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const webhookData = await req.json();

    // Handle different webhook topics
    switch (topic) {
      case 'orders/fulfilled':
        await handleOrderFulfilled(shopDomain, webhookData);
        break;
      case 'orders/paid':
        await handleOrderPaid(shopDomain, webhookData);
        break;
      default:
        console.log(`Unhandled webhook topic: ${topic}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error in review-webhook:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});

async function handleOrderFulfilled(shopDomain: string, orderData: any) {
  try {
    console.log(`Order fulfilled for shop: ${shopDomain}, order: ${orderData.id}`);
    
    // Extract order information
    const order = {
      id: orderData.id.toString(),
      customer: {
        email: orderData.customer?.email,
        first_name: orderData.customer?.first_name,
        last_name: orderData.customer?.last_name
      },
      line_items: orderData.line_items || [],
      fulfilled_at: orderData.fulfillments?.[0]?.created_at || new Date().toISOString()
    };

    // Schedule review request email (in a real app, this would use a job queue)
    // For now, we'll just log the action
    console.log('Scheduling review request email for:', {
      shop: shopDomain,
      customer: order.customer.email,
      products: order.line_items.map((item: any) => item.product_id)
    });

    // In a real implementation, you would:
    // 1. Store the order in your database
    // 2. Schedule an email to be sent after X days
    // 3. Track the campaign status

  } catch (error) {
    console.error('Error handling order fulfilled:', error);
  }
}

async function handleOrderPaid(shopDomain: string, orderData: any) {
  try {
    console.log(`Order paid for shop: ${shopDomain}, order: ${orderData.id}`);
    
    // Handle order paid logic if needed
    // This could be used for immediate review requests for digital products
    
  } catch (error) {
    console.error('Error handling order paid:', error);
  }
}