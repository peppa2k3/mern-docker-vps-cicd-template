FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install
RUN apk add --no-cache openssl
COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
