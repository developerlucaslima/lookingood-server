#!/bin/sh
# docker-entrypoint.sh

# Executa as migrações do Prisma
echo "Aplicando migrações do Prisma..."
npx prisma migrate deploy

# Inicia a aplicação em modo de produção
echo "Iniciando a aplicação..."
npm run start:prod
