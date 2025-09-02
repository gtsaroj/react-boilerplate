#!/bin/bash

# React App Boilerplate Setup Script
echo "🚀 Setting up React App Boilerplate..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created. Please update it with your configuration."
else
    echo "✅ .env file already exists."
fi

# Create public directory and add favicon
mkdir -p public
if [ ! -f public/vite.svg ]; then
    echo "📁 Creating public directory with favicon..."
    # You can add a default favicon here
fi

echo "✅ Setup complete!"
echo ""
echo "🎉 Your React app is ready to go!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your configuration"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo "Happy coding! 🎨"
