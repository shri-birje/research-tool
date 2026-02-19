#!/bin/bash

# Build script for Render deployment
set -e

echo "Installing dependencies..."
npm install

echo "Building backend..."
cd backend
npm install
npm run build
cd ..

echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Build complete!"
