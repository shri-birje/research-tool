FROM node:18-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Build backend
COPY backend/src ./backend/src
COPY backend/tsconfig.json ./backend/
RUN cd backend && npm run build

# Install frontend dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Build frontend
COPY frontend/src ./frontend/src
COPY frontend/index.html ./frontend/
COPY frontend/vite.config.ts ./frontend/
COPY frontend/tsconfig*.json ./frontend/
RUN cd frontend && npm run build

# Expose port
EXPOSE 3001

# Start backend server
CMD ["node", "backend/dist/index.js"]
