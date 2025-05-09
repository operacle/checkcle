#!/bin/bash

set -e

echo "🚀 Starting Checkcle Installation..."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "📦 npm is not installed. Installing Node.js and npm..."
    
    # Install Node.js and npm (Ubuntu/Debian-based systems)
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Clone the repo
if [ ! -d "checkcle" ]; then
    echo "📁 Cloning repository..."
    git clone https://github.com/operacle/checkcle.git
fi

cd checkcle

# Set up paths
PROJECT_DIR=$(pwd)
APP_DIR="$PROJECT_DIR/application"
PB_DIR="$PROJECT_DIR/server"
PB_BINARY="$PB_DIR/pocketbase"

# Install web dependencies
echo "📦 Installing Web Application dependencies..."
cd "$APP_DIR"
npm install

# Create systemd service for frontend
echo "🛠️ Setting up systemd service for Web Application..."
sudo tee /etc/systemd/system/checkcle-web.service > /dev/null <<EOF
[Unit]
Description=Checkcle Web Application
After=network.target

[Service]
Type=simple
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/npm run dev
Restart=on-failure
User=$USER
Environment=NODE_ENV=development

[Install]
WantedBy=multi-user.target
EOF

# Create systemd service for PocketBase
echo "🛠️ Setting up systemd service for PocketBase..."
sudo tee /etc/systemd/system/checkcle-pb.service > /dev/null <<EOF
[Unit]
Description=Checkcle PocketBase Server
After=network.target

[Service]
Type=simple
WorkingDirectory=$PB_DIR
ExecStart=$PB_BINARY serve --dir pb_data
Restart=on-failure
User=$USER

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and start services
echo "🔄 Enabling and starting services..."
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable --now checkcle-web
sudo systemctl enable --now checkcle-pb

echo ""
echo "✅ All done!"
echo "🌐 Admin Panel: http://0.0.0.0:8090"
echo "👤 User: admin@example.com"
echo "🔑 Passwd: Admin123456"
