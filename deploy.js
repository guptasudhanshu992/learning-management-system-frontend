// deploy.js
const { exec } = require('child_process');

console.log('📦 Starting deployment process...');

// First build the project
console.log('🛠️  Building project...');
exec('npm run build', (err, stdout, stderr) => {
  if (err) {
    console.error('❌ Build failed:', stderr);
    process.exit(1);
  }
  
  console.log('✅ Build successful!');
  console.log(stdout);
  
  // Deploy to Cloudflare Pages
  console.log('� Deploying to Cloudflare Pages...');
  exec('wrangler pages deploy dist --project-name=learning-management-system', (err, stdout, stderr) => {
    if (err) {
      console.error('❌ Deployment failed:', stderr);
      process.exit(1);
    }
    
    console.log('✅ Deployment successful!');
    console.log(stdout);
    process.exit(0);
  });
});