FROM node:20-alpine
WORKDIR /app
ARG VITE_API_URL=http://api:43100
ENV VITE_API_URL=${VITE_API_URL}
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 43210
CMD ["npm", "run", "preview", "--", "--host", "--port", "43210"]
