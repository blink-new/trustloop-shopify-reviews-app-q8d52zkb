import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

interface ShopifyRequest {
  shop: string;
  accessToken: string;
}

interface ShopifyShopResponse {
  shop: {
    id: number;
    name: string;
    email: string;
    domain: string;
    myshopify_domain: string;
    plan_name: string;
    currency: string;
    timezone: string;
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
    const { shop, accessToken }: ShopifyRequest = await req.json();

    if (!shop || !accessToken) {
      return new Response(JSON.stringify({ error: 'Shop domain and access token are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Clean up shop domain
    const cleanShop = shop.replace(/^https?:\/\//, '').replace(/\.myshopify\.com.*$/, '') + '.myshopify.com';

    // Test Shopify connection by fetching shop info
    const shopifyResponse = await fetch(`https://${cleanShop}/admin/api/2024-01/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    });

    if (!shopifyResponse.ok) {
      const errorText = await shopifyResponse.text();
      console.error('Shopify API error:', errorText);
      
      if (shopifyResponse.status === 401) {
        return new Response(JSON.stringify({ error: 'Invalid access token. Please check your private app credentials.' }), {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
      
      return new Response(JSON.stringify({ error: 'Failed to connect to Shopify. Please check your shop domain and access token.' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const shopData: ShopifyShopResponse = await shopifyResponse.json();

    // Return shop information (without sensitive data)
    return new Response(JSON.stringify({
      success: true,
      shop: {
        id: shopData.shop.id.toString(),
        name: shopData.shop.name,
        email: shopData.shop.email,
        domain: shopData.shop.domain,
        myshopifyDomain: shopData.shop.myshopify_domain,
        plan: shopData.shop.plan_name,
        currency: shopData.shop.currency,
        timezone: shopData.shop.timezone,
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error in shopify-connect:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});