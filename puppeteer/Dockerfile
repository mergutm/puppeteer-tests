FROM zenika/alpine-chrome:with-node

USER root
RUN apk update && apk add --no-cache curl

WORKDIR /usr/src/app

# Evitar que Puppeteer descargue Chromium (ya viene instalado)
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Cambiar al usuario chrome ANTES de instalar
USER chrome

# Copiar package.json con permisos correctos
COPY --chown=chrome:chrome package.json package-lock.json* ./

# Instalar dependencias
RUN npm install

# Copiar código de pruebas
COPY --chown=chrome:chrome e2e/ ./e2e/
COPY --chown=chrome:chrome .env .

# Crear carpeta de reportes y permisos
RUN mkdir -p e2e/reports && chmod -R 777 e2e/reports

# CMD ["npm", "run", "e2e"]
CMD ["tail", "-f", "/dev/null"]

