FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8081

# For Expo web development
CMD ["npx", "expo", "start", "--web"]
