// functions/auth.js - Authentication middleware for your LMS Frontend

export async function onRequest(context) {
  // Extract request from the context
  const { request, env, next } = context;
  const url = new URL(request.url);
  
  // Add security headers to all responses
  const response = await next();
  const newResponse = new Response(response.body, response);
  
  // Set security headers
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('X-Frame-Options', 'DENY');
  newResponse.headers.set('X-XSS-Protection', '1; mode=block');
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  newResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Only set HSTS in production to avoid issues during development
  if (env.ENVIRONMENT === 'production') {
    newResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  return newResponse;
}