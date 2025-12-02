FROM node:20-alpine

# Instalar Chromium & dependencias
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont

ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

#CMD ["node", "index.js"]
CMD ["node", "test/runTests.test.js"]
