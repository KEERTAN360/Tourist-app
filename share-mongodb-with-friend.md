# Share MongoDB with Friend - Complete Guide

## 🔧 Step 1: Configure MongoDB for External Access

### 1.1 Stop MongoDB Service
```bash
# Windows
net stop MongoDB

# macOS
brew services stop mongodb-community

# Linux
sudo systemctl stop mongod
```

### 1.2 Edit MongoDB Configuration File

**Windows Location**: `C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg`
**macOS Location**: `/usr/local/etc/mongod.conf` or `/opt/homebrew/etc/mongod.conf`
**Linux Location**: `/etc/mongod.conf`

Add these lines to your MongoDB config file:
```yaml
# Network Configuration
net:
  port: 27017
  bindIp: 0.0.0.0  # Allow connections from any IP
  # Alternative: bindIp: 127.0.0.1,YOUR_LOCAL_IP  # Specific IPs only

# Security Configuration
security:
  authorization: enabled  # Enable authentication

# Storage (keep your existing settings)
storage:
  dbPath: C:\data\db  # Windows
  # dbPath: /usr/local/var/mongodb  # macOS
  # dbPath: /var/lib/mongodb  # Linux
```

### 1.3 Start MongoDB Service
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

## 👤 Step 2: Create User Account for Your Friend

### 2.1 Connect to MongoDB
```bash
mongosh
```

### 2.2 Create Admin User (if not exists)
```javascript
use admin

db.createUser({
  user: "admin",
  pwd: "your_secure_admin_password",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
})
```

### 2.3 Create Friend's User Account
```javascript
use mock5

db.createUser({
  user: "friend_user",
  pwd: "friend_secure_password_123",
  roles: [
    { role: "readWrite", db: "mock5" },
    { role: "read", db: "admin" }  // Optional: read access to admin
  ]
})
```

### 2.4 Test the User Account
```javascript
// Test friend's connection
db.auth("friend_user", "friend_secure_password_123")
show dbs
```

## 🌐 Step 3: Network Configuration

### 3.1 Find Your Public IP Address
```bash
# Visit this website or run:
curl ifconfig.me
# or
curl ipinfo.io/ip
```

### 3.2 Configure Windows Firewall
```bash
# Allow MongoDB through Windows Firewall
netsh advfirewall firewall add rule name="MongoDB External" dir=in action=allow protocol=TCP localport=27017

# Check if rule was added
netsh advfirewall firewall show rule name="MongoDB External"
```

### 3.3 Router Port Forwarding (Important!)
1. **Access your router admin panel** (usually 192.168.1.1 or 192.168.0.1)
2. **Find Port Forwarding settings**
3. **Add new rule**:
   - **Service Name**: MongoDB
   - **External Port**: 27017
   - **Internal IP**: YOUR_LOCAL_IP (e.g., 192.168.1.100)
   - **Internal Port**: 27017
   - **Protocol**: TCP

### 3.4 Test Port Forwarding
```bash
# From your friend's computer, test if port is open:
telnet YOUR_PUBLIC_IP 27017
# or
nc -zv YOUR_PUBLIC_IP 27017
```

## 📱 Step 4: Provide Connection Details to Friend

### 4.1 Connection Information to Share
```
🔗 MongoDB Connection Details:

Host: YOUR_PUBLIC_IP_ADDRESS
Port: 27017
Database: mock5
Username: friend_user
Password: friend_secure_password_123
Auth Source: mock5

Connection String:
mongodb://friend_user:friend_secure_password_123@YOUR_PUBLIC_IP:27017/mock5?authSource=mock5

MongoDB Compass Connection:
mongodb://friend_user:friend_secure_password_123@YOUR_PUBLIC_IP:27017/mock5?authSource=mock5
```

### 4.2 Test Connection Commands for Friend
```bash
# Test with mongosh
mongosh "mongodb://friend_user:friend_secure_password_123@YOUR_PUBLIC_IP:27017/mock5?authSource=mock5"

# Test with MongoDB Compass
# Use the connection string above in MongoDB Compass
```

## 🔒 Step 5: Security Best Practices

### 5.1 Strong Passwords
- Use at least 12 characters
- Mix letters, numbers, symbols
- Avoid common words

### 5.2 Limit Access
```javascript
// Create user with limited permissions
use mock5
db.createUser({
  user: "friend_readonly",
  pwd: "readonly_password_123",
  roles: [
    { role: "read", db: "mock5" }  // Read-only access
  ]
})
```

### 5.3 Monitor Connections
```javascript
// Check active connections
db.runCommand({currentOp: 1})

// Check user activity
db.runCommand({usersInfo: 1})
```

## 🧪 Step 6: Testing the Connection

### 6.1 From Your Computer
```bash
# Test local connection
mongosh "mongodb://friend_user:friend_secure_password_123@localhost:27017/mock5?authSource=mock5"
```

### 6.2 From Friend's Computer
```bash
# Test external connection
mongosh "mongodb://friend_user:friend_secure_password_123@YOUR_PUBLIC_IP:27017/mock5?authSource=mock5"
```

### 6.3 Test with MongoDB Compass
1. Download MongoDB Compass
2. Use connection string: `mongodb://friend_user:friend_secure_password_123@YOUR_PUBLIC_IP:27017/mock5?authSource=mock5`
3. Test connection

## 🚨 Troubleshooting

### Connection Refused
- Check if MongoDB is running
- Verify bindIp is 0.0.0.0
- Check Windows Firewall
- Verify port forwarding

### Authentication Failed
- Check username/password
- Verify authSource parameter
- Ensure user has proper roles

### Network Unreachable
- Check public IP address
- Verify port forwarding
- Test with telnet/nc
- Check router settings

## 📋 Quick Setup Checklist

- [ ] MongoDB configured with bindIp: 0.0.0.0
- [ ] Authentication enabled
- [ ] Friend user created
- [ ] Windows Firewall configured
- [ ] Router port forwarding set up
- [ ] Public IP address obtained
- [ ] Connection string shared with friend
- [ ] Test connection from friend's computer

## 🔄 Alternative: Use MongoDB Atlas (Recommended for Production)

For production use, consider MongoDB Atlas:
1. Go to https://cloud.mongodb.com
2. Create free cluster
3. Add friend as database user
4. Share connection string

## 📞 Support Commands

```bash
# Check MongoDB status
net start MongoDB  # Windows
brew services list | grep mongo  # macOS
sudo systemctl status mongod  # Linux

# Check listening ports
netstat -an | findstr 27017  # Windows
lsof -i :27017  # macOS/Linux

# Test connection
mongosh "mongodb://username:password@host:27017/database"
```
