FROM node:24-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run css:build
ENV NODE_ENV=production PORT=8080 DATABASE_PATH=/data/app.sqlite
EXPOSE 8080
CMD ["node", "--import", "remix/node-tsx", "server.ts"]
