// functions/api/[[path]].js - API Proxy for your LMS Frontend

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Extract the API path (everything after /api/)
  const apiPath = url.pathname.replace('/api/', '/');
  
  // Create a new request to your backend API
  const backendUrl = new URL(apiPath, env.BACKEND_API_URL);
  
  // Copy the query parameters
  url.searchParams.forEach((value, key) => {
    backendUrl.searchParams.set(key, value);
  });
  
  // Forward the request to your backend
  let apiRequest = new Request(backendUrl.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });
  
  // Forward the Authorization header if it exists
  const authHeader = request.headers.get('Authorization');
  if (authHeader) {
    apiRequest.headers.set('Authorization', authHeader);
  }
  
  try {
    // Fetch from the API
    const response = await fetch(apiRequest);
    
    // Check if the response is valid
    if (!response.ok) {
      // If the API returns an error, forward it to the client
      return response;
    }
    
    // Create a new response with CORS headers
    const apiResponse = new Response(response.body, response);
    
    // Set CORS headers
    apiResponse.headers.set('Access-Control-Allow-Origin', url.origin);
    apiResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    apiResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return apiResponse;
  } catch (error) {
    // Return an error response if the API request fails
    return new Response(JSON.stringify({
      error: 'Failed to connect to the API',
      message: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': url.origin
      }
    });
  }
}