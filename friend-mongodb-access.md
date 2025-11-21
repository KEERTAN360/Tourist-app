# 🔗 MongoDB Access for Friend

## Connection Details:
- **Host**: 49.207.225.30
- **Port**: 27017
- **Database**: mock5
- **Username**: friend_user
- **Password**: friend_secure_password_123

## Connection Strings:

### For mongosh:
```bash
mongosh "mongodb://friend_user:friend_secure_password_123@49.207.225.30:27017/mock5?authSource=mock5"
```

### For MongoDB Compass:
```
mongodb://friend_user:friend_secure_password_123@49.207.225.30:27017/mock5?authSource=mock5
```

### For Node.js/Application:
```javascript
const mongoose = require('mongoose');
mongoose.connect('mongodb://friend_user:friend_secure_password_123@49.207.225.30:27017/mock5?authSource=mock5');
```

## Test Connection:
1. Open MongoDB Compass
2. Paste the connection string above
3. Click "Connect"
4. You should see the "mock5" database

## Troubleshooting:
- Make sure port 27017 is forwarded in your router
- Check Windows Firewall allows MongoDB
- Verify your public IP address is correct
- Test with: `telnet 49.207.225.30 27017`

## Security Note:
This connection allows read/write access to the mock5 database.
Only share these credentials with trusted friends!
