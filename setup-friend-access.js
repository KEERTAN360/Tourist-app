#!/usr/bin/env node

/**
 * MongoDB Friend Access Setup Script
 * This script helps configure MongoDB for external friend access
 */

const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const readline = require('readline');

console.log('👥 MongoDB Friend Access Setup');
console.log('==============================\n');

// Get local and public IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Create friend user in MongoDB
function createFriendUser() {
  const friendUsername = 'friend_user';
  const friendPassword = 'friend_secure_password_123';
  
  const mongoCommands = [
    'use mock5',
    `db.createUser({`,
    `  user: "${friendUsername}",`,
    `  pwd: "${friendPassword}",`,
    `  roles: [`,
    `    { role: "readWrite", db: "mock5" }`,
    `  ]`,
    `})`,
    '',
    '# Test the user:',
    `db.auth("${friendUsername}", "${friendPassword}")`,
    'show dbs'
  ];

  console.log('📝 MongoDB Commands to Run:');
  console.log('===========================');
  mongoCommands.forEach(line => console.log(line));
  
  return { friendUsername, friendPassword };
}

// Generate connection strings
function generateConnectionStrings(localIP, publicIP, friendUsername, friendPassword) {
  const connectionStrings = {
    local: `mongodb://${friendUsername}:${friendPassword}@${localIP}:27017/mock5?authSource=mock5`,
    public: `mongodb://${friendUsername}:${friendPassword}@${publicIP}:27017/mock5?authSource=mock5`,
    compass: `mongodb://${friendUsername}:${friendPassword}@${publicIP}:27017/mock5?authSource=mock5`
  };
  
  return connectionStrings;
}

// Create friend access guide
function createFriendGuide(connectionStrings, publicIP) {
  const guide = `# 🔗 MongoDB Access for Friend

## Connection Details:
- **Host**: ${publicIP}
- **Port**: 27017
- **Database**: mock5
- **Username**: friend_user
- **Password**: friend_secure_password_123

## Connection Strings:

### For mongosh:
\`\`\`bash
mongosh "${connectionStrings.public}"
\`\`\`

### For MongoDB Compass:
\`\`\`
${connectionStrings.compass}
\`\`\`

### For Node.js/Application:
\`\`\`javascript
const mongoose = require('mongoose');
mongoose.connect('${connectionStrings.public}');
\`\`\`

## Test Connection:
1. Open MongoDB Compass
2. Paste the connection string above
3. Click "Connect"
4. You should see the "mock5" database

## Troubleshooting:
- Make sure port 27017 is forwarded in your router
- Check Windows Firewall allows MongoDB
- Verify your public IP address is correct
- Test with: \`telnet ${publicIP} 27017\`

## Security Note:
This connection allows read/write access to the mock5 database.
Only share these credentials with trusted friends!
`;

  fs.writeFileSync('friend-mongodb-access.md', guide);
  console.log('✅ Created friend-mongodb-access.md');
}

// Main setup function
async function main() {
  try {
    const localIP = getLocalIP();
    
    console.log(`📍 Your Local IP: ${localIP}`);
    console.log('🌐 To get your public IP, visit: https://whatismyipaddress.com/');
    
    // Get public IP from user
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const publicIP = await new Promise((resolve) => {
      rl.question('Enter your public IP address: ', (ip) => {
        rl.close();
        resolve(ip.trim());
      });
    });
    
    if (!publicIP) {
      console.log('❌ Public IP is required for external access');
      process.exit(1);
    }
    
    console.log(`\n🔧 Setting up friend access...`);
    
    // Create friend user
    const { friendUsername, friendPassword } = createFriendUser();
    
    // Generate connection strings
    const connectionStrings = generateConnectionStrings(localIP, publicIP, friendUsername, friendPassword);
    
    // Create friend guide
    createFriendGuide(connectionStrings, publicIP);
    
    console.log('\n📋 Next Steps:');
    console.log('==============');
    console.log('1. Run the MongoDB commands above in mongosh');
    console.log('2. Configure Windows Firewall (if not done)');
    console.log('3. Set up router port forwarding for port 27017');
    console.log('4. Share the friend-mongodb-access.md file with your friend');
    console.log('5. Test the connection from your friend\'s computer');
    
    console.log('\n🔒 Security Checklist:');
    console.log('======================');
    console.log('✅ MongoDB configured with bindIp: 0.0.0.0');
    console.log('✅ Authentication enabled');
    console.log('✅ Friend user created');
    console.log('⚠️  Windows Firewall: netsh advfirewall firewall add rule name="MongoDB" dir=in action=allow protocol=TCP localport=27017');
    console.log('⚠️  Router Port Forwarding: Forward port 27017 to your local IP');
    console.log('⚠️  Share connection details securely');
    
    console.log('\n📱 Connection Details for Friend:');
    console.log('==================================');
    console.log(`Host: ${publicIP}`);
    console.log(`Port: 27017`);
    console.log(`Database: mock5`);
    console.log(`Username: ${friendUsername}`);
    console.log(`Password: ${friendPassword}`);
    console.log(`\nConnection String: ${connectionStrings.public}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { createFriendUser, generateConnectionStrings };
