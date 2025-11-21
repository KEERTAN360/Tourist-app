# MongoDB Local Exposure Setup Guide

## ⚠️ Security Warning
This setup exposes your local MongoDB to external connections. **ONLY use this for development/testing purposes. NEVER use this configuration in production.**

## Step 1: Configure MongoDB to Accept External Connections

### 1.1 Find your MongoDB configuration file:

**Windows:**
```bash
# Default location
C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg

# Or check if you have a custom config
mongod --help | findstr config
```

**macOS (Homebrew):**
```bash
# Default location
/usr/local/etc/mongod.conf
# or
/opt/homebrew/etc/mongod.conf
```

**Linux:**
```bash
# Default location
/etc/mongod.conf
```

### 1.2 Edit the MongoDB configuration file:

Add or modify these settings in your `mongod.cfg` or `mongod.conf`:

```yaml
# Network interfaces
net:
  port: 27017
  bindIp: 0.0.0.0  # This allows connections from any IP
  # Alternative: bindIp: 127.0.0.1,192.168.1.100  # Specific IPs only

# Security (IMPORTANT for development)
security:
  authorization: enabled  # Enable authentication

# Storage
storage:
  dbPath: C:\data\db  # Windows default
  # dbPath: /usr/local/var/mongodb  # macOS default
  # dbPath: /var/lib/mongodb  # Linux default
```

### 1.3 Restart MongoDB service:

**Windows:**
```bash
# Stop MongoDB
net stop MongoDB

# Start MongoDB
net start MongoDB
```

**macOS:**
```bash
# Stop MongoDB
brew services stop mongodb-community

# Start MongoDB
brew services start mongodb-community
```

**Linux:**
```bash
# Stop MongoDB
sudo systemctl stop mongod

# Start MongoDB
sudo systemctl start mongod
```

## Step 2: Create MongoDB User with Proper Permissions

### 2.1 Connect to MongoDB:
```bash
mongosh
```

### 2.2 Create an admin user:
```javascript
use admin

db.createUser({
  user: "admin",
  pwd: "your_secure_password_here",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
})
```

### 2.3 Create a database-specific user:
```javascript
use mock5

db.createUser({
  user: "mock5_user",
  pwd: "your_app_password_here",
  roles: [
    { role: "readWrite", db: "mock5" }
  ]
})
```

## Step 3: Update Your Application Connection

### 3.1 Create a `.env.local` file in your project root:
```env
MONGODB_URI=mongodb://mock5_user:your_app_password_here@YOUR_LOCAL_IP:27017/mock5?authSource=mock5
```

### 3.2 Find your local IP address:

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address" under your network adapter
```

**macOS/Linux:**
```bash
ifconfig | grep inet
# or
ip addr show
```

### 3.3 Update the connection string with your actual IP:
```env
# Replace YOUR_LOCAL_IP with your actual IP (e.g., 192.168.1.100)
MONGODB_URI=mongodb://mock5_user:your_app_password_here@192.168.1.100:27017/mock5?authSource=mock5
```

## Step 4: Test the Connection

### 4.1 Test from your application:
```bash
npm run dev
```

### 4.2 Test from external machine:
```bash
# Install MongoDB client on another machine
mongosh "mongodb://mock5_user:your_app_password_here@YOUR_LOCAL_IP:27017/mock5"
```

## Step 5: Firewall Configuration (if needed)

### Windows:
```bash
# Allow MongoDB through Windows Firewall
netsh advfirewall firewall add rule name="MongoDB" dir=in action=allow protocol=TCP localport=27017
```

### macOS:
```bash
# Allow MongoDB through macOS Firewall
sudo pfctl -f /etc/pf.conf
```

### Linux:
```bash
# Allow MongoDB through UFW
sudo ufw allow 27017
```

## Step 6: Security Considerations

### 6.1 Use strong passwords:
- At least 12 characters
- Mix of letters, numbers, and symbols
- Avoid common words

### 6.2 Limit access:
```yaml
# In mongod.conf, you can restrict to specific IPs:
net:
  bindIp: 127.0.0.1,192.168.1.100,192.168.1.101
```

### 6.3 Use VPN for remote access:
- Set up a VPN for secure remote connections
- Don't expose MongoDB directly to the internet

## Step 7: Alternative - MongoDB Atlas (Recommended for Production)

For production use, consider MongoDB Atlas:
1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Get connection string
4. Update your connection string

## Troubleshooting

### Connection refused:
- Check if MongoDB is running
- Verify bindIp configuration
- Check firewall settings

### Authentication failed:
- Verify username/password
- Check authSource parameter
- Ensure user has proper roles

### Network unreachable:
- Check IP address
- Verify network connectivity
- Check firewall rules

## Example Connection Strings

```env
# Local development (no auth)
MONGODB_URI=mongodb://localhost:27017/mock5

# Local with authentication
MONGODB_URI=mongodb://username:password@localhost:27017/mock5?authSource=mock5

# Remote access (replace with your IP)
MONGODB_URI=mongodb://username:password@192.168.1.100:27017/mock5?authSource=mock5

# MongoDB Atlas (production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mock5
```
