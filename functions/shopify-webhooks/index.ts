import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

interface WebhookRequest {
  shop: string;
  accessToken: string;
  topic: string;
  address: string;
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
    const { shop, accessToken, topic, address }: WebhookRequest = await req.json();

    if (!shop || !accessToken || !topic || !address) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Clean up shop domain
    const cleanShop = shop.replace(/^https?:\/\//, '').replace(/\.myshopify\.com.*$/, '') + '.myshopify.com';

    // Create webhook
    const webhookData = {
      webhook: {
        topic,
        address,
        format: 'json'
      }
    };

    const shopifyResponse = await fetch(`https://${cleanShop}/admin/api/2024-01/webhooks.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData)
    });

    if (!shopifyResponse.ok) {
      const errorText = await shopifyResponse.text();
      console.error('Shopify webhook creation error:', errorText);
      
      return new Response(JSON.stringify({ error: 'Failed to create webhook' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const webhookResult = await shopifyResponse.json();

    return new Response(JSON.stringify({
      success: true,
      webhook: webhookResult.webhook
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error in shopify-webhooks:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});