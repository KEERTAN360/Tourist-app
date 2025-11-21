#!/usr/bin/env node

/**
 * MongoDB Exposure Setup Script
 * This script helps configure MongoDB for external access
 * ⚠️ WARNING: Only use for development/testing!
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🔧 MongoDB Exposure Setup Script');
console.log('⚠️  WARNING: This exposes your MongoDB to external connections!');
console.log('   Only use this for development/testing purposes.\n');

// Get local IP address
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

// Generate MongoDB configuration
function generateMongoConfig() {
  const config = {
    net: {
      port: 27017,
      bindIp: '0.0.0.0', // Allow all IPs
    },
    security: {
      authorization: 'enabled'
    },
    storage: {
      dbPath: process.platform === 'win32' ? 'C:\\data\\db' : '/usr/local/var/mongodb'
    }
  };

  return config;
}

// Create .env.local file
function createEnvFile() {
  const localIP = getLocalIP();
  const envContent = `# MongoDB Configuration for External Access
# ⚠️ WARNING: This exposes your database to external connections!
# Only use this for development/testing purposes.

# Local MongoDB with external access
MONGODB_URI=mongodb://mock5_user:your_password_here@${localIP}:27017/mock5?authSource=mock5

# Alternative connection strings:
# MONGODB_URI=mongodb://localhost:27017/mock5  # Local only
# MONGODB_URI=mongodb://username:password@${localIP}:27017/mock5?authSource=mock5  # With auth
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mock5  # MongoDB Atlas

# Your local IP: ${localIP}
# Make sure to update the password above!
`;

  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Created .env.local file');
  console.log(`📍 Your local IP: ${localIP}`);
  console.log('🔑 Remember to update the password in .env.local!\n');
}

// Generate MongoDB setup commands
function generateSetupCommands() {
  const commands = {
    windows: [
      '# Windows MongoDB Setup Commands:',
      '# 1. Stop MongoDB service:',
      'net stop MongoDB',
      '',
      '# 2. Edit MongoDB config file:',
      '# Location: C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.cfg',
      '# Add these lines:',
      'net:',
      '  port: 27017',
      '  bindIp: 0.0.0.0',
      'security:',
      '  authorization: enabled',
      '',
      '# 3. Start MongoDB service:',
      'net start MongoDB',
      '',
      '# 4. Connect to MongoDB and create user:',
      'mongosh',
      '# Then run the user creation commands below'
    ],
    unix: [
      '# macOS/Linux MongoDB Setup Commands:',
      '# 1. Stop MongoDB:',
      'brew services stop mongodb-community  # macOS',
      '# or',
      'sudo systemctl stop mongod  # Linux',
      '',
      '# 2. Edit MongoDB config file:',
      '# macOS: /usr/local/etc/mongod.conf or /opt/homebrew/etc/mongod.conf',
      '# Linux: /etc/mongod.conf',
      '# Add these lines:',
      'net:',
      '  port: 27017',
      '  bindIp: 0.0.0.0',
      'security:',
      '  authorization: enabled',
      '',
      '# 3. Start MongoDB:',
      'brew services start mongodb-community  # macOS',
      '# or',
      'sudo systemctl start mongod  # Linux',
      '',
      '# 4. Connect to MongoDB and create user:',
      'mongosh',
      '# Then run the user creation commands below'
    ]
  };

  return commands;
}

// Generate user creation commands
function generateUserCommands() {
  return [
    '# MongoDB User Creation Commands:',
    '# Run these in mongosh:',
    '',
    '# 1. Create admin user:',
    'use admin',
    'db.createUser({',
    '  user: "admin",',
    '  pwd: "your_admin_password_here",',
    '  roles: [',
    '    { role: "userAdminAnyDatabase", db: "admin" },',
    '    { role: "readWriteAnyDatabase", db: "admin" }',
    '  ]',
    '})',
    '',
    '# 2. Create app user:',
    'use mock5',
    'db.createUser({',
    '  user: "mock5_user",',
    '  pwd: "your_app_password_here",',
    '  roles: [',
    '    { role: "readWrite", db: "mock5" }',
    '  ]',
    '})',
    '',
    '# 3. Test connection:',
    'db.auth("mock5_user", "your_app_password_here")',
    'show dbs'
  ];
}

// Main execution
function main() {
  try {
    console.log('🔍 Detecting system...');
    const platform = process.platform;
    const localIP = getLocalIP();
    
    console.log(`📍 Platform: ${platform}`);
    console.log(`🌐 Local IP: ${localIP}\n`);

    // Create .env.local file
    createEnvFile();

    // Generate setup commands
    const commands = generateSetupCommands();
    const userCommands = generateUserCommands();

    console.log('📋 Setup Commands:');
    console.log('==================\n');

    if (platform === 'win32') {
      commands.windows.forEach(line => console.log(line));
    } else {
      commands.unix.forEach(line => console.log(line));
    }

    console.log('\n');
    userCommands.forEach(line => console.log(line));

    console.log('\n🔧 Next Steps:');
    console.log('==============');
    console.log('1. Follow the setup commands above');
    console.log('2. Update the password in .env.local');
    console.log('3. Restart your application');
    console.log('4. Test the connection from another device');
    console.log('\n⚠️  Remember: This exposes your database!');
    console.log('   Only use this for development/testing.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { getLocalIP, generateMongoConfig, createEnvFile };
