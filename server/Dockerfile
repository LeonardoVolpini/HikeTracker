FROM node:16
WORKDIR ./server
COPY package*.json ./
COPY . .
RUN npm install
EXPOSE 3001
CMD [ "npm", "start" ]