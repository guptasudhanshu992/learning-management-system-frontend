// functions/_middleware.js - Global middleware for your LMS Frontend

// Import authentication middleware
import { onRequest as authMiddleware } from './auth';

// Stack of middleware to execute for each request
const middlewares = [
  authMiddleware
];

export const onRequest = async (context) => {
  // Process each middleware in sequence
  let currentContext = context;
  
  for (const middleware of middlewares) {
    const response = await middleware(currentContext);
    if (response instanceof Response) {
      return response;
    }
    // If the middleware didn't return a response, continue with the next one
  }
  
  // If we get here, none of the middlewares returned a response
  return context.next();
};