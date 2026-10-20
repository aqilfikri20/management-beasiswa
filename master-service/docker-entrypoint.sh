set -e
echo "Running Prisma migrations..."
npx prisma migrate deploy
echo "Starting Master Service..."
exec node dist/server.js