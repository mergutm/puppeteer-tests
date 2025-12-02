FROM zenika/alpine-chrome:with-node

WORKDIR /usr/src/app

# Para puppeteer-core (sin descargas automáticas)
ENV PUPPETEER_SKIP_DOWNLOAD=true

COPY package.json .
RUN npm install

COPY e2e-tests.js .

COPY .env .

RUN mkdir reports
RUN chmod 777 reports

CMD ["npm", "run", "e2e"]
