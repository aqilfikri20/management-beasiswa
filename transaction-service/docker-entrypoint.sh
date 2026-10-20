set -e
echo "Running Prisma migrations..."
npx prisma migrate deploy
echo "Starting Transaction Service..."
exec node dist/server.js