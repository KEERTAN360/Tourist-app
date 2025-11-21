#!/bin/bash

# Install dependencies
npm ci --only=production

# Build the application
npm run build

# Start the production server
npm start
