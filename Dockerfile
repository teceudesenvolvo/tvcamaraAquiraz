<<<<<<< HEAD
FROM node

WORKDIR /usr/app
COPY package.json yarn.lock ./

RUN npm install

COPY . .

EXPOSE 3000
=======
FROM node

WORKDIR /usr/app
COPY package.json yarn.lock ./

RUN npm install

COPY . .

EXPOSE 3000
>>>>>>> 35e75b1a24c6fa74665bd3793c80f1d4326e7abc
CMD [ "npm", "start" ]