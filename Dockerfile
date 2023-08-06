FROM node:16.17.1-alpine

#RUN npm install -g nodemon

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

RUN npm rebuild bcrypt --update-binary

CMD ["npx", "nodemon", "src/index.js", "--MONGO"]




