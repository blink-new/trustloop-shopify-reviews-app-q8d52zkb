import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

interface ProductsRequest {
  shop: string;
  accessToken: string;
  limit?: number;
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
    const { shop, accessToken, limit = 50 }: ProductsRequest = await req.json();

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

    // Fetch products from Shopify
    const shopifyResponse = await fetch(`https://${cleanShop}/admin/api/2024-01/products.json?limit=${limit}`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    });

    if (!shopifyResponse.ok) {
      const errorText = await shopifyResponse.text();
      console.error('Shopify API error:', errorText);
      
      return new Response(JSON.stringify({ error: 'Failed to fetch products from Shopify' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const productsData = await shopifyResponse.json();

    // Transform products data
    const products = productsData.products.map((product: any) => ({
      id: product.id.toString(),
      title: product.title,
      handle: product.handle,
      description: product.body_html || '',
      status: product.status,
      vendor: product.vendor,
      productType: product.product_type,
      image_url: product.images?.[0]?.src || '/placeholder-product.jpg',
      price: product.variants?.[0]?.price || '0.00',
      compareAtPrice: product.variants?.[0]?.compare_at_price,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));

    return new Response(JSON.stringify({
      success: true,
      products
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error in shopify-products:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});