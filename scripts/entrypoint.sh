#!/bin/sh
if [ -z "$(ls -A /app/pb_data)" ]; then
  echo "Initializing pb_data from image..."
  cp -r /app/pb_data_seed/* /app/pb_data/
fi

exec /app/pocketbase serve --dir /app/pb_data
