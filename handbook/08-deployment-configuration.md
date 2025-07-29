# NEXMAX Dashboard - Deployment & Configuration Documentation

## 🚀 Deployment Overview

### System Requirements
- **Node.js**: 18.x or higher
- **PostgreSQL**: 14.x or higher
- **Memory**: Minimum 2GB RAM
- **Storage**: Minimum 10GB free space
- **Network**: Stable internet connection for updates

### Supported Platforms
- **Windows**: Windows 10/11
- **Linux**: Ubuntu 20.04+, CentOS 8+
- **macOS**: macOS 11+ (Big Sur)
- **Docker**: Containerized deployment

## 📋 Pre-Deployment Checklist

### 1. Environment Setup
```bash
# Check Node.js version
node --version  # Should be 18.x or higher

# Check npm version
npm --version   # Should be 8.x or higher

# Check PostgreSQL
psql --version  # Should be 14.x or higher
```

### 2. Database Setup
```sql
-- Create database
CREATE DATABASE nexmax;

-- Create user (optional)
CREATE USER nexmax_user WITH PASSWORD 'secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE nexmax TO nexmax_user;
```

### 3. Environment Variables
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/nexmax
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nexmax
DB_USER=nexmax_user
DB_PASSWORD=secure_password

# Server Configuration
PORT=3000
NODE_ENV=production
HOSTNAME=0.0.0.0

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
SESSION_SECRET=your-session-secret-key

# API Configuration
API_BASE_URL=http://localhost:3000/api
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/nexmax.log

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=100

# Export Configuration
EXPORT_MAX_SIZE=10000
EXPORT_TIMEOUT=300000
```

## 🔧 Installation Process

### 1. Clone Repository
```bash
# Clone the repository
git clone https://github.com/your-org/nexmax-dashboard.git
cd nexmax-dashboard

# Install dependencies
npm install
```

### 2. Database Initialization
```bash
# Run database migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed

# Verify database connection
npm run db:test
```

### 3. Build Application
```bash
# Build for production
npm run build

# Verify build
npm run start
```

## 🐳 Docker Deployment

### 1. Dockerfile
```dockerfile
# Use Node.js 18 Alpine
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
CMD ["npm", "start"]
```

### 2. Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://nexmax_user:password@db:5432/nexmax
      - JWT_SECRET=your-jwt-secret
    depends_on:
      - db
    restart: unless-stopped
    networks:
      - nexmax-network

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=nexmax
      - POSTGRES_USER=nexmax_user
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - nexmax-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - nexmax-network

volumes:
  postgres_data:

networks:
  nexmax-network:
    driver: bridge
```

### 3. Nginx Configuration
```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_proxied expired no-cache no-store private must-revalidate auth;
        gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        location /api {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

## ☁️ Cloud Deployment

### 1. AWS Deployment

#### EC2 Setup
```bash
# Update system
sudo yum update -y

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PostgreSQL
sudo yum install -y postgresql15 postgresql15-server
sudo /usr/pgsql-15/bin/postgresql-15-setup initdb
sudo systemctl enable postgresql-15
sudo systemctl start postgresql-15

# Install PM2
sudo npm install -g pm2
```

#### PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'nexmax-dashboard',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/nexmax-dashboard',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/nexmax/err.log',
    out_file: '/var/log/nexmax/out.log',
    log_file: '/var/log/nexmax/combined.log',
    time: true
  }]
};
```

#### AWS RDS Setup
```sql
-- Create RDS instance
-- Engine: PostgreSQL 14
-- Instance: db.t3.micro (for development)
-- Storage: 20 GB
-- Multi-AZ: Disabled (for development)

-- Connect to RDS
psql -h your-rds-endpoint -U master -d postgres

-- Create database
CREATE DATABASE nexmax;

-- Create user
CREATE USER nexmax_user WITH PASSWORD 'secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE nexmax TO nexmax_user;
```

### 2. Google Cloud Platform

#### App Engine Configuration
```yaml
# app.yaml
runtime: nodejs18
env: standard

instance_class: F1

automatic_scaling:
  target_cpu_utilization: 0.65
  min_instances: 1
  max_instances: 10

env_variables:
  NODE_ENV: production
  DATABASE_URL: postgresql://user:pass@host:5432/nexmax

handlers:
  - url: /.*
    script: auto
    secure: always
```

#### Cloud SQL Setup
```bash
# Create Cloud SQL instance
gcloud sql instances create nexmax-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password=secure_password

# Create database
gcloud sql databases create nexmax --instance=nexmax-db

# Create user
gcloud sql users create nexmax_user \
  --instance=nexmax-db \
  --password=secure_password
```

### 3. Azure Deployment

#### Azure App Service
```json
// .deployment
{
  "scripts": {
    "postbuild": "npm run build"
  }
}
```

#### Azure Database for PostgreSQL
```bash
# Create Azure Database for PostgreSQL
az postgres flexible-server create \
  --resource-group myResourceGroup \
  --name nexmax-db \
  --admin-user nexmax_admin \
  --admin-password secure_password \
  --sku-name Standard_B1ms \
  --version 14

# Create database
az postgres flexible-server db create \
  --resource-group myResourceGroup \
  --server-name nexmax-db \
  --database-name nexmax
```

## 🔒 Security Configuration

### 1. SSL/TLS Setup
```bash
# Generate SSL certificate (Let's Encrypt)
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. Firewall Configuration
```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# iptables (CentOS)
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo service iptables save
```

### 3. Database Security
```sql
-- Restrict database access
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
GRANT CONNECT ON DATABASE nexmax TO nexmax_user;
GRANT USAGE ON SCHEMA public TO nexmax_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO nexmax_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO nexmax_user;

-- Enable SSL
ALTER SYSTEM SET ssl = on;
ALTER SYSTEM SET ssl_ciphers = 'HIGH:MEDIUM:+3DES:!aNULL';
SELECT pg_reload_conf();
```

## 📊 Monitoring & Logging

### 1. Application Monitoring
```javascript
// monitoring.js
const winston = require('winston');
const { createLogger, format, transports } = winston;

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'nexmax-dashboard' },
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple()
  }));
}

module.exports = logger;
```

### 2. Health Check Endpoint
```javascript
// pages/api/health.js
export default function handler(req, res) {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version
  };
  
  try {
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.message = error;
    res.status(503).json(healthcheck);
  }
}
```

### 3. Performance Monitoring
```javascript
// middleware/performance.js
export function performanceMiddleware(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
}
```

## 🔄 CI/CD Pipeline

### 1. GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npm test
    - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npm run build
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.KEY }}
        script: |
          cd /var/www/nexmax-dashboard
          git pull origin main
          npm ci --production
          npm run build
          pm2 restart nexmax-dashboard
```

### 2. Docker Hub
```yaml
# .github/workflows/docker.yml
name: Build and Push Docker Image

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Build Docker image
      run: docker build -t nexmax-dashboard .
    - name: Push to Docker Hub
      run: |
        docker tag nexmax-dashboard username/nexmax-dashboard:latest
        docker push username/nexmax-dashboard:latest
```

## 📈 Scaling Configuration

### 1. Horizontal Scaling
```javascript
// cluster.js
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  require('./server.js');
  console.log(`Worker ${process.pid} started`);
}
```

### 2. Load Balancer Configuration
```nginx
# nginx-load-balancer.conf
upstream backend {
    least_conn;
    server app1:3000;
    server app2:3000;
    server app3:3000;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

## 🔧 Maintenance Procedures

### 1. Database Backup
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/nexmax"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
pg_dump nexmax > $BACKUP_DIR/nexmax_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/nexmax_$DATE.sql

# Remove old backups (keep last 7 days)
find $BACKUP_DIR -name "nexmax_*.sql.gz" -mtime +7 -delete

echo "Backup completed: nexmax_$DATE.sql.gz"
```

### 2. Application Update
```bash
#!/bin/bash
# update.sh
cd /var/www/nexmax-dashboard

# Backup current version
cp -r . ../nexmax-backup-$(date +%Y%m%d_%H%M%S)

# Pull latest changes
git pull origin main

# Install dependencies
npm ci --production

# Build application
npm run build

# Restart application
pm2 restart nexmax-dashboard

echo "Application updated successfully"
```

### 3. Log Rotation
```bash
# /etc/logrotate.d/nexmax
/var/log/nexmax/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
```

## 🚨 Troubleshooting

### 1. Common Issues

#### Database Connection Issues
```bash
# Check database status
sudo systemctl status postgresql

# Check connection
psql -h localhost -U nexmax_user -d nexmax

# Check logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

#### Application Issues
```bash
# Check application status
pm2 status

# Check logs
pm2 logs nexmax-dashboard

# Restart application
pm2 restart nexmax-dashboard
```

#### Memory Issues
```bash
# Check memory usage
free -h

# Check process memory
ps aux --sort=-%mem | head -10

# Restart with more memory
NODE_OPTIONS="--max-old-space-size=4096" pm2 restart nexmax-dashboard
```

### 2. Performance Tuning
```javascript
// Performance optimization
const performanceConfig = {
  // Increase heap size
  maxOldSpaceSize: 4096,
  
  // Enable garbage collection logging
  traceGc: true,
  
  // Optimize for production
  optimizeForSize: false
};

// Database connection pooling
const poolConfig = {
  max: 20,
  min: 5,
  idle: 10000,
  acquire: 30000,
  evict: 60000
};
```

---

*This deployment and configuration documentation provides comprehensive information about deploying the NEXMAX Dashboard in various environments, including security, monitoring, and maintenance procedures.* 