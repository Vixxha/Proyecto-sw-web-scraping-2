# Dockerfile for Next.js

# Stage 1: Install dependencies
FROM node:20-alpine3.20 AS deps
WORKDIR /app
COPY package.json ./
RUN npm install

# Stage 2: Build the application
FROM node:20-alpine3.20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production runner
FROM node:20-alpine3.20 AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy the standalone output
COPY --from=builder /app/.next/standalone ./

# Copy the public and static assets
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT 3000

# Run the application
CMD ["node", "server.js"]
