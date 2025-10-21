// deploy.js
const { exec, execSync } = require('child_process');
const readline = require('readline');

console.log('📦 Starting deployment process...');

// Check if the user is logged in to Cloudflare
console.log('� Checking Cloudflare authentication...');
try {
  // Check if token exists by running a simple Wrangler command
  execSync('npx wrangler whoami', { stdio: 'ignore' });
  console.log('✅ Already authenticated with Cloudflare');
} catch (error) {
  console.log('❗ Not authenticated with Cloudflare');
  console.log('🔐 Please run the following command in a separate terminal to log in:');
  console.log('\n   npx wrangler login\n');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('Press Enter when you have completed the login process...', () => {
    rl.close();
    continueDeployment();
  });
  
  // Exit this execution; the user will restart after logging in
  return;
}

// Continue with the deployment process
continueDeployment();

function continueDeployment() {
  // Build the project
  console.log('🛠️  Building project...');
  exec('npm run build', (err, stdout, stderr) => {
    if (err) {
      console.error('❌ Build failed:', stderr);
      process.exit(1);
    }
    
    console.log('✅ Build successful!');
    
    // Deploy to Cloudflare Pages
    console.log('🚀 Deploying to Cloudflare Pages...');
  exec('npx wrangler pages deploy dist --project-name=learning-management-system', (err, stdout, stderr) => {
    if (err) {
      console.error('❌ Deployment failed:', stderr);
      process.exit(1);
    }
    
    console.log('✅ Deployment successful!');
    console.log(stdout);
    process.exit(0);
  });
});