set -e
echo "Running Prisma migrations..."
npx prisma migrate deploy
echo "Starting Document Service..."
exec node dist/server.js