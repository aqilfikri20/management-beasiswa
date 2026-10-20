#!/bin/sh

set -e

echo "Running Prisma migrations..."

npx prisma migrate deploy

echo "Starting RBAC Service..."

exec node dist/server.js