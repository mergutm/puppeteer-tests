FROM mongo:6.0

# Copiar configuración opcional
COPY mongo.conf /etc/mongo/mongo.conf

# Copiar scripts de inicialización (Mongo ejecuta automáticamente cualquier .js o .sh en esta ruta)
COPY init/ /docker-entrypoint-initdb.d/

CMD ["mongod", "--config", "/etc/mongo/mongo.conf"]
