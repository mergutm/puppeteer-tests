FROM node:18

WORKDIR /usr/src/app

COPY package.json  ./
RUN npm install

COPY public ./public

EXPOSE 8080

CMD ["npx", "http-server", "public", "-p", "8080"]
