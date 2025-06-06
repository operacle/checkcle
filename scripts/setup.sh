#!/bin/bash

set -e

DATA_DIR="/opt/pb_data"
PORT=8090
COMPOSE_FILE="/opt/docker-compose.yml"
RAW_URL="https://raw.githubusercontent.com/operacle/checkcle/main/docker-compose.yml"

echo "🚀 Installing Checkcle using Docker Compose"

# Step 1: Check if port is already in use
if lsof -i :"$PORT" &>/dev/null; then
  echo "❗ ERROR: Port $PORT is already in use. Please free the port or change the Docker Compose configuration."
  exit 1
fi

# Step 2: Ensure Docker is installed
if ! command -v docker &> /dev/null; then
  echo "🔧 Docker not found. Installing Docker..."
  curl -fsSL https://get.docker.com | sh
fi

# Step 3: Ensure Docker Compose v2 is available
if ! docker compose version &> /dev/null; then
  echo "❗ Docker Compose v2 not found. Please install Docker Compose v2 and rerun this script."
  exit 1
fi

# Step 4: Download docker-compose.yml if not exists
if [ ! -f "$COMPOSE_FILE" ]; then
  echo "📥 Downloading docker-compose.yml to $COMPOSE_FILE..."
  curl -fsSL "$RAW_URL" -o "$COMPOSE_FILE"
else
  echo "✅ docker-compose.yml already exists at $COMPOSE_FILE"
fi

# Step 5: Create data volume directory if it doesn’t exist
if [ ! -d "$DATA_DIR" ]; then
  echo "📁 Creating data volume directory at $DATA_DIR"
  sudo mkdir -p "$DATA_DIR"
  sudo chown "$(whoami)":"$(whoami)" "$DATA_DIR"
fi

# Step 6: Start the service
cd /opt
echo "📦 Starting Checkcle service with Docker Compose..."
docker compose -f "$COMPOSE_FILE" up -d

# Step 7: Detect host IP address
HOST_IP=$(hostname -I | awk '{print $1}')

# Step 8: Show success output
echo ""
echo "✅ Checkcle has been successfully installed and started."
echo ""
echo "🛠️  Admin Web Management"
echo "🔗 Default URL: http://$HOST_IP:$PORT"
echo "👤 User: admin@example.com"
echo "🔑 Passwd: Admin123456"
echo ""
echo "📌 Make sure port $PORT is accessible from your host system or cloud firewall."
