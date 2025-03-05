# Use Node.js LTS (Long Term Support) image as base
FROM node:20 AS build-stage

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies and rebuild bcrypt
RUN npm install --only=production
RUN npm rebuild bcrypt --build-from-source

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy rest of the application
COPY . .

# Tahap Runtime
FROM node:20-alpine AS production-stage

# Set working directory
WORKDIR /app

# Copy hanya file yang dibutuhkan dari tahap build
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/prisma ./prisma
# COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/.env ./.env
COPY --from=build-stage /app/src ./src
COPY --from=build-stage /app/package.json ./package.json

# Expose port
EXPOSE 3000

# Jalankan Aplikasi
CMD ["npm", "run", "start"]