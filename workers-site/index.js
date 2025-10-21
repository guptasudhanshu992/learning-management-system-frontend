import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

/**
 * The DEBUG flag will do two things:
 * 1. we will skip caching on the edge, which makes it easier to debug
 * 2. we will return an error message on exception in your Response rather than the default 500 internal server error
 */
const DEBUG = false

/**
 * Handle requests to your domain
 */
addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event))
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        }),
      )
    }
    event.respondWith(new Response('Internal Error', { status: 500 }))
  }
})

/**
 * Handle individual requests
 */
async function handleEvent(event) {
  const url = new URL(event.request.url)
  let options = {}

  try {
    // Handle API requests if needed by proxying to backend
    if (url.pathname.startsWith('/api/')) {
      // You can implement API forwarding here if needed
      // For now we'll just return a placeholder response
      return new Response(JSON.stringify({message: 'API not implemented yet'}), {
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // For static assets and general pages
    return await getAssetFromKV(event, options)
  } catch (e) {
    // Fall back to serving index.html for SPA routing
    if (!DEBUG) {
      try {
        let notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req),
        })

        return new Response(notFoundResponse.body, {
          ...notFoundResponse,
          status: 200,
        })
      } catch (e) {}
    }

    return new Response(e.message || e.toString(), { status: 500 })
  }
}