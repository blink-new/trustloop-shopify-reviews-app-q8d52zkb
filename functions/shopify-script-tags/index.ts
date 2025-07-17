import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

interface ScriptTagRequest {
  shop: string;
  accessToken: string;
  action: 'create' | 'delete' | 'list';
  src?: string;
  id?: string;
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
    const { shop, accessToken, action, src, id }: ScriptTagRequest = await req.json();

    if (!shop || !accessToken || !action) {
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

    let shopifyResponse: Response;
    let result: any;

    switch (action) {
      case 'create': {
        if (!src) {
          return new Response(JSON.stringify({ error: 'src parameter required for create action' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }

        const scriptTagData = {
          script_tag: {
            event: 'onload',
            src: src
          }
        };

        shopifyResponse = await fetch(`https://${cleanShop}/admin/api/2024-01/script_tags.json`, {
          method: 'POST',
          headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(scriptTagData)
        });

        if (!shopifyResponse.ok) {
          const errorText = await shopifyResponse.text();
          console.error('Shopify script tag creation error:', errorText);
          
          return new Response(JSON.stringify({ error: 'Failed to create script tag' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }

        result = await shopifyResponse.json();
        break;
      }

      case 'delete': {
        if (!id) {
          return new Response(JSON.stringify({ error: 'id parameter required for delete action' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }

        shopifyResponse = await fetch(`https://${cleanShop}/admin/api/2024-01/script_tags/${id}.json`, {
          method: 'DELETE',
          headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json',
          }
        });

        if (!shopifyResponse.ok) {
          const errorText = await shopifyResponse.text();
          console.error('Shopify script tag deletion error:', errorText);
          
          return new Response(JSON.stringify({ error: 'Failed to delete script tag' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }

        result = { deleted: true };
        break;
      }

      case 'list':
        shopifyResponse = await fetch(`https://${cleanShop}/admin/api/2024-01/script_tags.json`, {
          headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json',
          }
        });

        if (!shopifyResponse.ok) {
          const errorText = await shopifyResponse.text();
          console.error('Shopify script tags list error:', errorText);
          
          return new Response(JSON.stringify({ error: 'Failed to list script tags' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }

        result = await shopifyResponse.json();
        break;

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
    }

    return new Response(JSON.stringify({
      success: true,
      ...result
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error in shopify-script-tags:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});