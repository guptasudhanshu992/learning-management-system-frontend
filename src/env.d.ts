interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_URL: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  
  // Environment
  readonly VITE_NODE_ENV: string
  readonly VITE_ENVIRONMENT: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
  
  // Application
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_DESCRIPTION: string
  
  // Features
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_ERROR_REPORTING: string
  
  // Payment Gateways
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_RAZORPAY_KEY_ID: string
  
  // Social Auth
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_FACEBOOK_APP_ID: string
  
  // CDN/Assets
  readonly VITE_ASSETS_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}