#!/bin/bash

echo "🚀 Starting Portfolio Tester with ngrok..."

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok is not installed or not in PATH"
    echo "Please install ngrok from https://ngrok.com/download"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install:all
fi

echo "🔧 Starting backend server..."
npm run dev:backend &
BACKEND_PID=$!

echo "⚛️ Starting frontend server..."
npm run dev:frontend &
FRONTEND_PID=$!

echo "⏳ Waiting for servers to initialize..."
sleep 5

echo "🌍 Starting ngrok tunnels..."
ngrok start --all --config ngrok.yml &
NGROK_PID=$!

# Function to cleanup processes on exit
cleanup() {
    echo "🛑 Stopping all services..."
    kill $BACKEND_PID $FRONTEND_PID $NGROK_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

echo "✅ All services started!"
echo "Press Ctrl+C to stop all services"

# Wait for ngrok process
wait $NGROK_PID 