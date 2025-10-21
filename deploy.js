// deploy.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

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
  
  // Make sure workers-site folder exists
  const workersSitePath = path.join(__dirname, 'workers-site');
  if (!fs.existsSync(workersSitePath)) {
    console.log('📁 Creating workers-site directory...');
    fs.mkdirSync(workersSitePath, { recursive: true });
  }
  
  // Install dependencies for workers-site
  console.log('📚 Installing worker dependencies...');
  exec('cd workers-site && npm install', (err, stdout, stderr) => {
    if (err) {
      console.error('❌ Worker dependency installation failed:', stderr);
      // Continue anyway as they might already be installed
    } else {
      console.log('✅ Worker dependencies installed!');
      console.log(stdout);
    }
    
    // Deploy using wrangler
    console.log('🚀 Deploying to Cloudflare Pages...');
    exec('wrangler deploy', (err, stdout, stderr) => {
      if (err) {
        console.error('❌ Deployment failed:', stderr);
        process.exit(1);
      }
      
      console.log('✅ Deployment successful!');
      console.log(stdout);
      process.exit(0);
    });
  });
});