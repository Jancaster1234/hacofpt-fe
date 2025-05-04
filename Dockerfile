# 1. Base image with Node.js 18
FROM node:18-alpine AS base

# 2. Set working directory
WORKDIR /app

# 3. Install dependencies (with legacy-peer-deps)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# 4. Copy the rest of your app
COPY . .

# 5. Build the app
RUN npm run build

# 6. Production image (only necessary files)
FROM node:18-alpine AS production

WORKDIR /app

COPY --from=base /app /app

# Set environment variables
ENV NODE_ENV=production

# Expose port (default Next.js port)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
