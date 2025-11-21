FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY src ./src
COPY .env.example ./
ENV NODE_ENV=production
EXPOSE 43100
CMD ["npm", "start"]
