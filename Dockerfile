# 1. Etapa de dependencias (deps)
FROM node:20-alpine3.20 AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# 2. Etapa de compilación (builder)
FROM node:20-alpine3.20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Etapa de ejecución (runner)
FROM node:20-alpine3.20 AS runner
WORKDIR /app

# Habilita la salida independiente de Next.js
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# El puerto por defecto es 3000
EXPOSE 3000

# Inicia la aplicación
CMD ["node", "server.js"]
