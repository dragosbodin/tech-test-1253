#!/bin/bash

# Check if Nodejs is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js 24 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm."
    exit 1
fi

# Check if node_modules exists and install dependencies
if [ ! -d "node_modules" ]; then
    npm install
fi

# Run the development server
npm run dev