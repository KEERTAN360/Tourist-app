@echo off
echo 🔧 Quick MongoDB Setup for Friend Access
echo ========================================
echo.

echo 📋 Step 1: Configure MongoDB for External Access
echo.

echo ⏹️  Stopping MongoDB service...
net stop MongoDB

echo.
echo ⚙️  Please edit your MongoDB config file:
echo    Location: C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg
echo.
echo    Add these lines:
echo    net:
echo      port: 27017
echo      bindIp: 0.0.0.0
echo    security:
echo      authorization: enabled
echo.
pause

echo ⏹️  Starting MongoDB service...
net start MongoDB

echo.
echo 🔥 Step 2: Configure Windows Firewall
echo.
echo Adding MongoDB rule to Windows Firewall...
netsh advfirewall firewall add rule name="MongoDB External" dir=in action=allow protocol=TCP localport=27017

echo.
echo ✅ Firewall rule added successfully!

echo.
echo 📝 Step 3: Create Friend User in MongoDB
echo.
echo Please run these commands in mongosh:
echo.
echo use mock5
echo db.createUser({
echo   user: "friend_user",
echo   pwd: "friend_secure_password_123",
echo   roles: [
echo     { role: "readWrite", db: "mock5" }
echo   ]
echo })
echo.
echo db.auth("friend_user", "friend_secure_password_123")
echo show dbs
echo.
pause

echo.
echo 🌐 Step 4: Router Port Forwarding
echo.
echo 1. Access your router admin panel (usually 192.168.1.1 or 192.168.0.1)
echo 2. Find "Port Forwarding" or "Virtual Server" settings
echo 3. Add new rule:
echo    - Service Name: MongoDB
echo    - External Port: 27017
echo    - Internal IP: 10.151.30.73
echo    - Internal Port: 27017
echo    - Protocol: TCP
echo.
pause

echo.
echo 📱 Step 5: Share Connection Details
echo.
echo Your friend can connect using:
echo.
echo Host: 49.207.225.30
echo Port: 27017
echo Database: mock5
echo Username: friend_user
echo Password: friend_secure_password_123
echo.
echo Connection String:
echo mongodb://friend_user:friend_secure_password_123@49.207.225.30:27017/mock5?authSource=mock5
echo.
echo 📄 Share the friend-mongodb-access.md file with your friend!
echo.
pause

echo.
echo ✅ Setup Complete!
echo.
echo 🧪 Test the connection:
echo 1. From your friend's computer, run:
echo    mongosh "mongodb://friend_user:friend_secure_password_123@49.207.225.30:27017/mock5?authSource=mock5"
echo.
echo 2. Or use MongoDB Compass with the connection string above
echo.
echo ⚠️  Remember: This exposes your database to external access!
echo    Only share credentials with trusted friends.
echo.
pause
