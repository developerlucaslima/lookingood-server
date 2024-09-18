#!/bin/sh

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 host:port -- command"
  exit 1
fi

HOST=$(echo $1 | cut -d':' -f1)
PORT=$(echo $1 | cut -d':' -f2)

shift 1

while ! nc -z "$HOST" "$PORT"; do
  echo "Aguardando o serviço em $HOST:$PORT..."
  sleep 1
done

echo "Serviço em $HOST:$PORT está disponível, executando comando..."
exec "$@"
