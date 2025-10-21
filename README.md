# Learning Management System - Frontend

A modern, professional frontend application for a Learning Management System built with React, Vite, TypeScript, and Tailwind CSS. Designed for deployment on Cloudflare Pages.

## 🚀 Features

### Authentication
- **Login** - Secure user authentication with form validation
- **Registration** - New user signup with password confirmation
- **Forgot Password** - Email-based password reset flow
- **Reset Password** - Secure password reset with token validation
- **Toast Notifications** - Real-time feedback for all user actions

### Admin Dashboard
- **User Management** - Complete CRUD operations for managing users
- **Dashboard Analytics** - Overview of key metrics and statistics
- **Role-Based Access Control** - Admin and user roles
- **Responsive Design** - Works seamlessly on all devices

### Design Features
- **Subtle Animations** - Smooth transitions using Framer Motion
- **Professional UI** - Clean, modern interface with Tailwind CSS
- **Accessibility** - WCAG compliant components
- **Dark Mode Ready** - Easy to extend with dark mode support

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe code
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Framer Motion** - Animation library
- **React Hot Toast** - Toast notifications
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons

## 📦 Installation

1. **Install dependencies:**
   ```powershell
   npm install
   ```

2. **Start development server:**
   ```powershell
   npm run dev
   ```

3. **Build for production:**
   ```powershell
   npm run build
   ```

4. **Preview production build:**
   ```powershell
   npm run preview
   ```

## 🌐 Deployment on Cloudflare Pages

### Option 1: Using Wrangler CLI (Recommended)

1. **Set up Cloudflare Credentials:**
   ```powershell
   npx wrangler login
   ```

2. **Test your application locally with Cloudflare Pages:**
   ```powershell
   npm run pages:dev
   ```

3. **Deploy your application:**
   ```powershell
   npm run pages:deploy
   ```

3. **Environment Variables (if needed):**
   - Add environment variables to your `wrangler.toml` file
   ```toml
   [vars]
   API_URL = "https://api.example.com"
   ```

### Option 3: GitHub Actions Automated Deployment

This project is configured with GitHub Actions for automatic deployment:

1. **Add Cloudflare Secrets to GitHub:**
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Add the following secrets:
     - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
     - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

2. **Push to GitHub:**
   - When you push to the `main` branch, GitHub Actions will automatically build and deploy your application to Cloudflare Pages

### Option 2: Via Cloudflare Dashboard

1. **Push to GitHub:**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages:**
   - Go to Cloudflare Dashboard
   - Navigate to Pages
   - Click "Create a project"
   - Connect your GitHub repository
   - Configure build settings:
     - **Build command:** `npm run build`
     - **Build output directory:** `dist`
     - **Node version:** 18 or higher

3. **Environment Variables (if needed):**
   - Add your API base URL and other environment variables in Cloudflare Pages settings

## 📁 Project Structure

```
frontend/
├── public/
│   └── _redirects          # Cloudflare Pages redirects
├── src/
│   ├── components/
│   │   └── ProtectedRoute.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── layouts/
│   │   └── AdminLayout.tsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   └── ResetPassword.tsx
│   │   └── admin/
│   │       ├── Dashboard.tsx
│   │       └── UserManagement.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🔧 Configuration

### API Integration

Update the API base URL in `src/contexts/AuthContext.tsx`:

```typescript
const API_BASE_URL = 'https://your-api.com/api'
```

### Customization

- **Colors:** Modify `tailwind.config.js` to change the color scheme
- **Animations:** Adjust animation settings in `tailwind.config.js`
- **Routes:** Add or modify routes in `src/App.tsx`

## 🎨 UI Components

The project includes reusable CSS classes:
- `.input-field` - Styled input fields
- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary action buttons
- `.card` - Card container

## 🔐 Security Features

- JWT token management
- Protected routes with role-based access
- Secure password validation
- XSS protection with React
- CSRF protection ready

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interface
- Optimized for all screen sizes

## 🧪 Testing

```powershell
# Run linter
npm run lint
```

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@example.com or create an issue in the repository.

## 🙏 Acknowledgments

- React Team for the amazing framework
- Tailwind Labs for Tailwind CSS
- Cloudflare for Pages hosting
- All open-source contributors
