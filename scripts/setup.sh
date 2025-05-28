#!/bin/bash

set -e

REPO_URL="https://github.com/operacle/checkcle.git"
CLONE_DIR="/opt/checkcle"
DATA_DIR="/opt/pb_data"
PORT=8090

echo "🚀 Installing Checkcle from $REPO_URL"

# Step 1: Check if port 8090 is already in use
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

# Step 4: Clone the repository
if [ -d "$CLONE_DIR" ]; then
  echo "📁 Directory $CLONE_DIR already exists. Pulling latest changes..."
  git -C "$CLONE_DIR" pull
else
  echo "📥 Cloning repo to $CLONE_DIR"
  git clone "$REPO_URL" "$CLONE_DIR"
fi

# Step 5: Create data volume directory if it doesn’t exist
if [ ! -d "$DATA_DIR" ]; then
  echo "📁 Creating data volume directory at $DATA_DIR"
  sudo mkdir -p "$DATA_DIR"
  sudo chown "$(whoami)":"$(whoami)" "$DATA_DIR"
fi

# Step 6: Start the service
cd "$CLONE_DIR"
echo "📦 Starting Checkcle service with Docker Compose..."
docker compose up -d

# Step 7: Show success output
echo ""
echo "✅ Checkcle has been successfully installed and started."
echo ""
echo "🛠️  Admin Web Management"
echo "🔗 Default URL: http://0.0.0.0:$PORT"
echo "👤 User: admin@example.com"
echo "🔑 Passwd: Admin123456"
echo ""
echo "📌 Make sure port $PORT is accessible from your host system or cloud firewall."
